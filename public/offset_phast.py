"""Align the PHAST imagery to the DSS background as WWT renders it.

Reads the .bak file so it is always applied to the original, never compounded.
Prints the shift in degrees, for useFootprint's offsetXDeg / offsetYDeg.

Everything here is measured, not eyeballed -- see ~/projects/wwt-dss-offset
(RESULTS.md, "PHAST vs DSS"). Two separate errors are in play:

1. WWT's DSS background renders ~2.8" from where the engine says it is. That error
   is in the DSS tile stack, not the engine -- PanSTARRS1 3pi through the identical
   path is clean at 0.21". It is a pure translation.

2. PHAST carries a rotation error of its own, so putting PHAST onto DSS needs more
   than the DSS shift. Walking along M31's major axis, the required shift swings
   monotonically from (+0.25", +1.40") at -0.6 deg to (-1.65", +2.30") at +0.6 deg
   while DSS against the same stars stays flat, so the gradient is PHAST's.

APPLIED TRANSFORM (the constants below), about the imageset's own centre at
dec +41.3858, cos = 0.75027:

    shift      -0.867" east, +1.869" north   ->  RA_OFF, DEC_OFF
    rotation   -0.02361 deg                  ->  ROT_OFF, added to Rotation
    scale      0.999866                      ->  SCALE, times BaseDegreesPerTile

VERIFIED: re-registering the output on a fresh 2D grid leaves residual shift
(-0.000", +0.004"), rotation -0.0002 deg, scale 0.9999924, rms 0.108" -- and the
similarity fit no longer removes anything (0.119" -> 0.108"), so no systematic is
left. Measurement was cross-checked two ways that agree to ~0.1" per field: direct
phase correlation of the rendered frames, and the difference of each frame measured
against the astrometry.net index stars.

Two traps, both of which produced wrong answers before being fixed:
  - Fields sampled along a single line cannot separate rotation from shear. That
    inflated the rotation to 0.0272 deg; applying it made alignment worse, which is
    also how the sign got pinned down. Use a 2D grid.
  - Partially PHAST-covered blocks drag the measured shift toward zero, biasing
    rotation and scale low by about a third. Uncovered pixels render bit-identical
    in both frames, so an exact coverage mask fixes it; with it the estimate is
    stable across coverage cuts from 0.80 to 0.98.

The east shift becomes a shift in RA itself by dividing by cos(dec), since CenterX
is plain RA. This deliberately places PHAST off its true coordinates: the goal is
matching what a viewer sees.

NOT the same number: footprints drawn from TRUE sky coordinates (the Roman survey
outlines in RomanFov.vue) need the DSS offset instead, -1.446" east / +2.331" north
at M31. Only footprints that outline the PHAST mosaic take the transform above.

Residual accuracy is ~0.1-0.2", set by patchy structure that the DSS2 cutout control
shows belongs to the plates rather than to WWT. Re-tuning by eye below that is
chasing noise.
"""

from pathlib import Path

from wwt_data_formats import write_xml_doc
from wwt_data_formats.folder import Folder

# All four are the APPLIED transform described in the docstring, accumulated over two
# measure-apply-verify iterations on a 2D grid of 35 fields. Skew came out negligible
# (0.02-0.07 "/deg), which is just as well: an ImageSet assumes square pixels and
# could not express it.
RA_OFF = -0.867 / 0.75027   # arcsec (+ increases RA); -0.867" east -> a shift in RA
DEC_OFF = 1.869             # arcsec (+ increases dec)
ROT_OFF = -0.02361          # degrees, added to Rotation (-0.01618 then -0.00743)
SCALE = 0.999866            # -134 ppm, times BaseDegreesPerTile (0.999908 x 0.9999576)

# Resolved against this file's own directory, so the script runs from anywhere.
HERE = Path(__file__).resolve().parent
SRC = HERE / "M31_PHAST.bak.wtml"
DST = HERE / "M31_PHAST.wtml"

ra_deg = RA_OFF / 3600
dec_deg = DEC_OFF / 3600

folder = Folder.from_file(SRC)
for place in folder.children:
    imageset = place.foreground_image_set or place.image_set
    if imageset is None:
        continue
    print(f"CenterX  {imageset.center_x:.6f} -> {imageset.center_x + ra_deg:.6f}")
    print(f"CenterY  {imageset.center_y:.6f} -> {imageset.center_y + dec_deg:.6f}")
    print(f"Rotation {imageset.rotation_deg:.6f} -> {imageset.rotation_deg + ROT_OFF:.6f}")
    print(f"BaseDeg  {imageset.base_degrees_per_tile:.9f} -> "
          f"{imageset.base_degrees_per_tile * SCALE:.9f}")
    imageset.center_x += ra_deg
    imageset.center_y += dec_deg
    imageset.rotation_deg += ROT_OFF
    imageset.base_degrees_per_tile *= SCALE

with DST.open("wt", encoding="utf8") as f:
    write_xml_doc(folder.to_xml(), indent=True, dest_stream=f)

# shiftCorners subtracts these, so flip the sign to move the footprint with the
# imagery
print(f"\nuseFootprint:  offsetXDeg: {-ra_deg},  offsetYDeg: {-dec_deg}")
