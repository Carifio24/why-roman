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
    launch: "August 30, 2026 (Planned)",
    camera: "Wide Field Instrument (WFI)",
    fieldOfView: "0.28 square degrees — about 100 times Hubble's, in one shot",
    resolution: "0.11 arcseconds per pixel, across 18 detectors (~300 megapixels)",
    wavelengths: "Optical to Near-infrared (0.48–2.3 microns)",
    highlights: [
      "Will survey the sky hundreds of times faster than Hubble at the same sharpness.",
      "Designed to measure dark energy by mapping how galaxies cluster over cosmic time.",
      "Will hunt for exoplanets by catching the brief flicker of a microlensing event.",
      "Can peer through dust to watch new stars being born.",
    ],
  },

  // the centred variants are the ones the Compare Fields of View controls show;
  // the tour's own hubble/jwst footprints are drawn in place and have no chip
  "hubble-footprint-centered": {
    name: "Hubble Space Telescope",
    launch: "April 24, 1990",
    camera: "Advanced Camera for Surveys (ACS)",
    fieldOfView: "About 3.4 arcminutes across — a small patch of one galaxy",
    resolution: "0.05 arcseconds per pixel",
    wavelengths: "Ultraviolet through near-infrared (0.38–1.1 microns), including visible light",
    highlights: [
      "Took the sharpest visible-light pictures of Andromeda ever made, the survey shown here.",
      "Measured how fast the universe is expanding, and found that the expansion is speeding up.",
      "Took the Hubble Ultra Deep Field image revealing thousands of galaxies in a seemingly empty patch of sky.",
    ],
  },

  "jwst-footprint-centered": {
    name: "James Webb Space Telescope",
    launch: "December 25, 2021",
    camera: "Near Infrared Camera (NIRCam)",
    fieldOfView: "Two 2.2 arcminute squares, about 9.7 square arcminutes in total",
    resolution: "0.031 arcseconds per pixel (short wavelengths), 0.063 (long)",
    wavelengths: "Infrared light (0.6–5 microns)",
    highlights: [
      "Sees the most distant galaxies yet found, as they were a few hundred million years after the Big Bang.",
      "Its infrared eyes see through the dust clouds where stars and planets are being born.",
      "Decodes the atmospheres of planets orbiting other stars.",
    ],
  },
};
