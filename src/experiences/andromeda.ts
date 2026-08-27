import type { TourExperience } from "./types";

// This is the source of truth for the length of a tour. Make sure the count matches the number of steps 
// in the corresponding tour. If the same text is needed on multiple steps, duplicate the text
export const andromedaExperience: TourExperience = [
  {
    title: "Andromeda",  // step 1, n=0
    tourSheetText: [
      "Andromeda (M31) is our nearest neighboring spiral galaxy.",
      "It spans 3 degrees (or 6 full Moons!) across the sky.",
      "By studying Andromeda, astronomers can better understand our own Milky Way galaxy.",
    ],
    instaText: "The Andromeda Galaxy is REALLY BIG on the sky",

  },
  {
    title: "View from the ground",  // step 2, n=1
    tourSheetText: [
      "This image shows Andromeda as viewed from a 1.2-m telescope on Earth.",
      "Zoom in and pan around Andromeda to explore the stars and dust lanes in the spiral arms.",
    ],
    instaText: "From the ground, a telescope can see THIS...",
  },
  {
    title: "Hubble's view from space",  // step 3, n=2
    tourSheetText: [
      "The Hubble Space Telescope has provided the clearest view to date of Andromeda in visible light (that we can see with our eyes).",
      "Zoom in to see how much more detail you can notice with Hubble.",
      "Use the slider to compare the 2 images.",
    ],
    instaText: "If you use the Hubble Space Telescope, you can see this!",
  },
  {
    title: "600 Hubble images",  // step 4, n=3
    // Hubble built this picture out of 600 separate pointings, over 13 years, from 2010 to 2024.
    // About 1,000 trips around the Earth. Roughly 3,700 individual exposures. Add all the
    // shutter-open time together and it comes to about 500 hours -- three solid weeks of staring.
    // And it still only covers about a quarter of the galaxy on screen.
    //
    // Friendly angles: "600 pointings. 1,000 orbits. 13 years."
    //                  "Three weeks of exposure, spread across 13 years."
    //                  "Every rectangle you see is a separate Hubble photograph."
    // Precise: 606 pointings | 1,023 orbits | 503 h exposure |
    //          0.888 deg^2 | 2010-07-12 to 2024-01-13 | ~3,700 ACS exposures
    tourSheetText: [
      "To obtain this view with Hubble, astronomers stitched together 600 images taken over 500 hours.",
      "The overlaid grid shows where each individual image was taken across Andromeda to make this beautiful mosaic.",
    ],
    instaText: "Hubble captured 600 images for Andromeda. It took 500 hours!",
  },
  {
    title: "Webb sees this",  // step 5, n=4
    // Webb's camera sees a patch about 100 times smaller than Roman's. It would take Webb more
    // than 300 pointings to cover just the piece of Andromeda that Hubble mapped; Roman needs 3.
    //
    // Friendly angles: "A hundred Webb views fit inside one Roman picture."
    //                  "Webb sees faint. Roman sees wide."
    // Precise: NIRCam 9.62 sq' vs Roman WFI 967.6 sq' = 101x | to cover 3,195 sq':
    //          332 NIRCam pointings, 274 ACS, 3 Roman
    //
    // Careful: this is about how much sky fits in the camera, not about which telescope is
    // better. Webb's mirror is nearly three times the size of Roman's -- it is built to look
    // deep and sharp at one spot, not to map a whole galaxy.
    tourSheetText: [
      "The James Webb Space Telescope takes images using infrared light (which has less energy than what our eyes can see).",
      "Webb's biggest camera has two chips that are side-by-side. The orange squares show how much (or little) of the sky Webb can photograph at once.",
    ],
    instaText: "Like Hubble, Webb can see only tiny pieces of sky at a time",
  },
  {
    title: "Roman's View",  // step 6, n=5
    tourSheetText: [
      "Like Webb, Roman will capture images in infrared light.",
      "Roman's camera has 18 large chips arranged in a boomerang shape.",
      `The camera's footprint or "field of view" is shown here.`,
    ],
    instaText: "Enter Roman...!",
  },
  {
    title: "Compare 3 Space Telescopes",  // step 7, n=6
    // Three cameras, same sky, wildly different sizes. Roman's view is about 85 times bigger
    // than Hubble's and 100 times bigger than Webb's.
    //
    // The best fact in the whole tour: Roman and Hubble have the SAME size mirror -- 2.4 metres.
    // Roman is not a more powerful telescope. It is Hubble's telescope with a far bigger camera
    // behind it, so every picture covers much more sky.
    //
    // Friendly angles: "Same mirror as Hubble. Eighty-five times the view."
    //                  "One Roman picture covers what took Hubble eighty-five."
    // Precise: Roman WFI 967.6 sq' | Hubble visible (ACS/WFC) 11.7 (83x) | Webb NIRCam 9.62
    //          (101x) | Hubble infrared (WFC3/IR) 4.68 (207x) | Roman and Hubble mirrors both
    //          2.4 m; Webb 6.5 m
    tourSheetText: [
      "The Webb and Hubble camera footprints are added in orange and blue.",
      "See how much more sky Roman can cover at once?"
    ],
    instaText: 'Roman covers way more sky with each "snap!"',
  },
  {
    title: "What Hubble did, Roman can do in 3 hours",  // step 7, n=6
    // Hubble spent about 500 hours photographing this part of Andromeda, once, in two colours.
    // Roman can match it in about 3 hours -- and its actual survey revisits the star-forming
    // disk 20 times over five years, covering twice the area, in 27 hours total.
    //
    // Friendly angles: "What took Hubble 500 hours, Roman does in 3."
    //                  "Hubble: one visit, 500 hours. Roman: twenty visits, 27 hours."
    //                  "Thirteen years of Hubble in an afternoon."
    //
    // Careful, and worth saying out loud somewhere: Roman is not simply better. Hubble sees a
    // little deeper in visible light and sees ultraviolet, which Roman cannot see at all. Roman
    // wins on speed, sky coverage, and infrared. Say "matches" or "as much as", not "better than".
    // Precise: HST 503 h, 0.888 deg^2, 1 epoch, 2 filters | Roman 2.7 h to match that depth
    //          over the same area (187x) | Roman SF disk as flown: 1.77 deg^2, 20 epochs,
    //          26.9 h, 0.91 mag deeper stacked
    tourSheetText: [
      "Just 6 images (taken over 3 hrs) with Roman will cover more of Andromeda than 600 images (taken over 500 hrs) with Hubble!",
    ],
    instaText: "Roman is 100x faster than Hubble.",
  },
  {
    title: "Roman's incredible detail",  // step 8, n=7 -- with the pixel grid
    // This close, every dot is an individual star. Hubble picked out 200 million of them here.
    // Each spot on the sky got about an hour of exposure, because neighbouring pointings overlap.
    // The faintest stars measured are 275 million times fainter than anything the eye can see.
    //
    // Friendly angles: "Every dot is a star."
    //                  "Two hundred million stars, one by one."
    //                  "An hour of exposure on every point of sky."
    // Precise: Hubble visible-light (ACS) pixel 0.05" = 0.19 pc at 785 kpc | 3,918 s per point |
    //          faintest stars mag 27.1 at S/N 4 (27.52 AB) | 200 million stars
    tourSheetText: [
      "Roman's high resolution will allow very detailed images, similar to Hubble.",
      "The blue grid shows the size of Roman's pixels, overlaid on the image taken by Hubble.",
      "Zoom out from here to see how much area Roman can cover with this level of detail."
    ],
    instaText: "Roman images will have similar detail to Hubble.",
  },
  // {
  //   title: "So many pixels",  // step 9, n=8
  //   // Roman's camera is 300 megapixels. Hubble's infrared camera -- the fair comparison, since
  //   // Roman is an infrared telescope too -- is about 1 megapixel. Roman has nearly 300 times more
  //   // pixels per picture, and each one is slightly finer. Hubble's 13-year mosaic of Andromeda is
  //   // 2.5 billion pixels; that is about 8 Roman pictures' worth. A single Roman pointing spans
  //   // 7,000 parsecs, a third of the way across the galaxy's disk.
  //   //
  //   // Friendly angles: "Three hundred megapixels, every single picture."
  //   //                  "Hubble's 13-year mosaic is eight Roman snapshots."
  //   //                  "Nearly 300 times the pixels of Hubble's infrared camera."
  //   // Precise: Roman WFI 18 x 4088^2 = 300.8 Mpx at 0.11"/px = 0.419 pc at M31 |
  //   //          Hubble WFC3/IR 1014^2 = 1.03 Mpx at 0.13"/px = 0.495 pc -> Roman has 293x the
  //   //          pixels and they are 1.18x finer | mosaic 2.5 Gpx = 8.3 Roman frames |
  //   //          one WFI pointing spans 7.10 kpc at M31
  //   //
  //   // Careful, and this one is easy to get backwards: the Andromeda picture on screen comes from
  //   // Hubble's VISIBLE-light camera, whose pixels are 0.05" -- finer than Roman's 0.11". Against
  //   // that image Roman is 2.2x coarser. Against Hubble's INFRARED camera, the like-for-like
  //   // comparison, Roman is finer. So never say "finer than Hubble" without naming which camera;
  //   // safest is "nearly 300 times the pixels of Hubble's infrared camera".
  //   tourSheetText: [],
  //   instaText: "",
  // },
  // {
  //   title: "Zoomed all the way out",  // step 10, n=9
  //   // Andromeda is 3 degrees across, six full Moons side by side. Roman's Andromeda survey covers
  //   // 59 square degrees of sky -- Andromeda and Triangulum together -- in 276 hours. Hubble spent
  //   // 500 hours on less than one square degree.
  //   //
  //   // Friendly angles: "Hubble: 500 hours, one square degree. Roman: 60 square degrees, 280 hours."
  //   //                  "Sixty times the sky, half the time."
  //   //                  "Nine times the area, in nine percent of the time."
  //   //                  "And Triangulum too."
  //   // Precise: program 2002 = 59.42 deg^2, 275.9 h integration (310.7 h charged), 7 filters |
  //   //          HI disk 7.93 deg^2 in 45.0 h = 8.9x the area in 8.9% of the time (100x) |
  //   //          M31 halo 152 tiles filling a 3.73 deg circle | M31 3 deg across
  //   tourSheetText: [],
  //   instaText: "",
  // },
  {
    title: "Explore on your own",  // step 9, n=8
    // A parting line, not a fact slide. Roman's Andromeda survey will measure more than half a
    // billion stars across Andromeda and Triangulum.
    //
    // Friendly angles: "Half a billion stars, in five years."
    //                  "Now go explore it yourself."  -> point at the settings box and the (i)
    // Precise: "more than half a billion stars" (proposal abstract) | 5-year prime mission |
    //          2.4 m mirror, 300 Mpx camera, 59.42 deg^2 over M31 and M33
    //
    // Keep it short. This step's job is to hand over and get out of the way.
    tourSheetText: [
      "You can continue exploring different regions of the sky and the fields of view of Hubble, Webb, and Roman.",
    ],
    instaText: "",
  }
  
  
];
