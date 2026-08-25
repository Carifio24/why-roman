import type { TourExperience } from "./types";

// Step titles/count are driven by andromedaTitles in RomanFov.vue (kept in
// sync by hand) — this array must have the same length.
export const andromedaExperience: TourExperience = [
  {
    title: "Andromeda",
    tourSheetText: [
      "The Andromeda Galaxy, our nearest neighboring spiral galaxy is located over 2 million light years away.",
      "Visible to the unaided eye as a faint smudge in the constellation of Andromeda, it is spans 3 degrees, or the width of 6 ful moons, on the night sky.",
      "The current view shows an optical image of the galaxy from the Digitized Sky Survey. The data was taken from a 1.2 m telescope at Palomar Observatory.",
    ],
    instaText: "Andromeda covers a huge amount of sky",
  },
  {
    title: "Hubble",
    tourSheetText: [],
    instaText: "A telescope on the ground sees this...",
  },
  {
    title: "PHAST",
    tourSheetText: [],
    instaText: "",
  },
  {
    title: "PHAST Frames",
    tourSheetText: [],
    instaText: "",
  },
  {
    title: "SF Disk",
    tourSheetText: [],
    instaText: "",
  },
  {
    title: "Roman",
    tourSheetText: [],
    instaText: "",
  },
];
