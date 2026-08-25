export interface TourStepContent {
  title?: string;
  tourSheetText?: string[]; // one entry per <p> paragraph in TourSheet.vue
  instaText?: string; // short caption shown in InstaTourSheet.vue
}

export type TourExperience = TourStepContent[];
