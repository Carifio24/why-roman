import type { TourExperience } from "./types";

// This is the source of truth for the length of a tour. Make sure the count matches the number of steps 
// in the corresponding tour. If the same text is needed on multiple steps, duplicate the text
export const carinaExperience: TourExperience = [
  {
    title: "NGC 3324",
    tourSheetText: [
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo eligendi at accusantium, corporis, vitae est dolorem suscipit aut, inventore dignissimos ab! Ipsa ab cupiditate quae voluptas, molestias repudiandae necessitatibus natus!",
    ],
    instaText: "",
  },
  {
    title: "Hubble",
    tourSheetText: [],
    instaText: "",
  },
  {
    title: "JWST",
    tourSheetText: [],
    instaText: "",
  },
  {
    title: "Roman",
    tourSheetText: [],
    instaText: "",
  },
];
