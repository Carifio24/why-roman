import type { TourExperience } from "./types";
import { andromedaExperience } from "./andromeda";
import { carinaExperience } from "./carina";
import { smacsExperience } from "./smacs";

export * from "./types";

export const tourExperiences: Record<string, TourExperience> = {
  andromeda: andromedaExperience,
  carina: carinaExperience,
  smacs: smacsExperience,
};
