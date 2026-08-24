import { Point } from "./types";

/**
 * HST WFPC2 -- PC1, WF2, WF3, WF4 (there is no WF1; that was the original WF/PC).
 *
 * Four 800x800 CCDs behind a pyramid mirror: the Planetary Camera at 0.0455"/px and three
 * Wide Field chips at 0.0996"/px, so the WF chips tile three quadrants of a square and the
 * higher-resolution PC fills the fourth -- the characteristic stair-step / chevron.
 *
 * Emitted as ONE merged ring rather than four. The chip projections overlap by ~9% where they
 * meet: the pyramid mirror split the beam, so the CCDs were nowhere near each other physically
 * and these coordinates say where each looked on the sky. The overlap is what the instrument
 * saw, so the outline is the union. MAST's own s_region for WFPC2 exposures is a 159.2" square,
 * matching 2 x 79.68" -- the same two-chip span this outline has.
 * https://www.stsci.edu/hst/instrumentation/legacy/wfpc2
 *
 * RA is in (-180, 180], not [0, 360). The outline straddles RA 0, and in raw degrees its
 * corners sit 360 apart -- that flips their left-to-right order and makes the ring
 * self-intersect, so ear-clipping bails and returns 9 triangles instead of n-2 = 10. Concave
 * outlines like this one need real triangulation; the 4-point quads elsewhere in this folder
 * are two triangles by inspection and never hit that path.
 *
 * Created using
 * https://github.com/spacetelescope/mast_notebooks/blob/main/notebooks/multi_mission/display_footprints/display_footprints.ipynb
 * HST SIAF apertures UPC1/UWF2/UWF3/UWF4 referenced to UWFALL, target (0, 0),
 * rotation angle close to 0 degrees
 */
export const corners: Point[][] = [
  [
    [-0.0038313058731033523, 0.01225655285410765],
    [-0.0038448738881908333, 0.023514683387764433],
    [0.01828755456446279, 0.023541356751672755],
    [0.01831420217569355, 0.0014302617369754693],
    [0.018121838051131125, 0.0014300299042821437],
    [0.018039691712293457, -0.018103681619079142],
    [-0.0020664814486256347, -0.018019127824203493],
    [-0.00206766351805338, -0.018103681619079146],
    [-0.024206611250518883, -0.017794177361655516],
    [-0.02389740515885493, 0.004323439240914342],
    [-0.012656561821209004, 0.004166291291908436],
    [-0.012592343117498801, 0.012325508267562093],
  ],
];
