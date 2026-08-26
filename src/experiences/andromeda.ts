import type { TourExperience } from "./types";

// This is the source of truth for the length of a tour. Make sure the count matches the number of steps 
// in the corresponding tour. If the same text is needed on multiple steps, duplicate the text
export const andromedaExperience: TourExperience = [
  {
    title: "Andromeda",
    tourSheetText: [
      "Andromeda (M31) is our nearest neighboring spiral galaxy.",
      "It spans 3 degrees (or 6 full Moons!) across the sky.",
      "By studying Andromeda, astronomers can better understand our own Milky Way galaxy.",
    ],
    instaText: "Andromeda covers a huge amount of sky",

  },
  {
    title: "View from the ground",
    tourSheetText: [
      "This image shows Andromeda as viewed from a 1.2-m telescope on Earth.",
      "Zoom in and pan around Andromeda to explore the stars and dust lanes in the spiral arms.",
    ],
    instaText: "A telescope on the ground sees this...",
  },
  {
    title: "Hubble's view from space",
    tourSheetText: [
      "The Hubble Space Telescope has provided the clearest view to date of Andromeda in visible light (that we can see with our eyes).",
      "Zoom in to see how much more detail you can notice with Hubble.",
      "Use the slider to cross-fade between the 2 images.",
    ],
    instaText: "Hubble sees this...",
  },
  {
    title: "Hubble Took this many images",
    tourSheetText: [],
    instaText: "",
  },
  {
    title: "JWST only sees this",
    tourSheetText: [],
    instaText: "",
  },
  {
    title: "Compare Roman, JWST, and Hubble",
    tourSheetText: [],
    instaText: "",
  },
  {
    title: "What Hubble did, Roman can do in 3 hours",
    tourSheetText: [],
    instaText: "",
  },
  {
    title: "Zoom in to Hubble",
    tourSheetText: [],
    instaText: "",
  },
  {
    title: "So many pixels",
    tourSheetText: [],
    instaText: "",
  },
  {
    title: "Zoomed all the way out",
    tourSheetText: [],
    instaText: "",
  },
  {
    title: "The end",
    tourSheetText: [],
    instaText: "",
  }
  
  
];
