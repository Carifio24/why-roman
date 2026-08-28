/*
 Content for the info cards on the Compare Fields of View controls.

 The camera named in each entry is the one whose footprint this app actually
 draws, not the mission's most famous instrument -- the numbers only mean
 something next to the shape on screen.

 NB: the figures here are content, not derived from the footprint files. Worth a
 read-through by someone on the science side before this ships.
*/

export interface TelescopeInfo {
  /** heading for the card */
  name: string;
  launch: string;
  /** the instrument this app's footprint belongs to */
  camera: string;
  fieldOfView: string;
  resolution: string;
  /** visible, infrared, and so on -- kept plain rather than a wavelength range alone */
  wavelengths: string;
  highlights: string[];
}

export const telescopeInfo: Record<string, TelescopeInfo> = {
  "roman-footprint": {
    name: "Nancy Grace Roman Space Telescope",
    launch: "Planned for 2026",
    camera: "Wide Field Instrument (WFI)",
    fieldOfView: "0.28 square degrees — about 100 times Hubble's, in one shot",
    resolution: "0.11 arcseconds per pixel, across 18 detectors (~300 megapixels)",
    wavelengths: "Near-infrared (0.5–2.3 microns)",
    highlights: [
      "Will survey the sky hundreds of times faster than Hubble at the same sharpness.",
      "Designed to measure dark energy by mapping how galaxies cluster over cosmic time.",
      "Will hunt for exoplanets by watching for the brief brightening of microlensing events.",
    ],
  },

  // the centred variants are the ones the Compare Fields of View controls show;
  // the tour's own hubble/jwst footprints are drawn in place and have no chip
  "hubble-footprint-centered": {
    name: "Hubble Space Telescope",
    launch: "April 24, 1990",
    camera: "Wide Field Camera 3 (WFC3)",
    fieldOfView: "About 2.7 arcminutes across — a small patch of one galaxy",
    resolution: "0.04 arcseconds per pixel (visible), 0.13 (infrared)",
    wavelengths: "Ultraviolet through near-infrared (0.2–1.7 microns), including visible light",
    highlights: [
      "Took the sharpest visible-light pictures of Andromeda ever made, the survey shown here.",
      "Measured how fast the universe is expanding, and found that the expansion is speeding up.",
      "Its Deep Field images stared at seemingly empty sky and found thousands of galaxies.",
    ],
  },

  "jwst-footprint-centered": {
    name: "James Webb Space Telescope",
    launch: "December 25, 2021",
    camera: "Near Infrared Camera (NIRCam)",
    fieldOfView: "Two 2.2 arcminute squares, about 9.7 square arcminutes in total",
    resolution: "0.031 arcseconds per pixel (short wavelengths), 0.063 (long)",
    wavelengths: "Infrared only (0.6–5 microns) — it cannot see visible light",
    highlights: [
      "Sees the most distant galaxies yet found, as they were a few hundred million years after the Big Bang.",
      "Its infrared eyes see through the dust clouds where stars and planets are being born.",
      "Reads the atmospheres of planets orbiting other stars.",
    ],
  },
};
