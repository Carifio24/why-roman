<template>
  <v-app
    id="app"
    :style="cssVars"
    :class="[smallSize && isPortrait ? 'app-is-small' : '']"
  >
    <div id="main-content">
      <WorldWideTelescope :wwt-namespace="wwtNamespace"></WorldWideTelescope>

      <canvas id="shadow-footprint"></canvas>
      <wwt-loader v-model="isLoading" />

      <SplashGesture
        v-if="!isLoading && !showInfoDialog && !showStartup && !showIntroSlides && tourStep >= 1 && opacitySliders.length === 0"
        v-model="showSplashGesture"
        :close-on-click="false"
        @close="handleSplashGestureClose"
      />

      <component
        :is="SplashScreen"
        v-if="showStartup"
        v-bind="{ color: accentColor }"
        @close="handleSplashClose"
      >
        <div id="startup-screen-content">
          <h1 class="startup-screen-title">Why Roman?</h1>
          <span>Learn why NASA is launching a new space telescope</span>
          <!-- <v-btn
            v-for="tour in tours"
            :key="tour.id"
            class="startup-button"
            variant="flat"
            block
            rounded="pill"
            :color="borderColor"
            :disabled="isLoading"
            @click="startTourFromStartup(tour.id)"
          >
            {{ tour.label }}
          </v-btn> -->
          <v-btn
            class="startup-button"
            variant="elevated"
            rounded="lg"
            block
            :color="backgroundColorDarkest"
            :disabled="isLoading"
            @click="handleSplashClose"
          >
            Get Started
          </v-btn>
        </div>
      </component>
      
      <IntroSlides 
        v-if="showIntroSlides" 
        v-model:open="showIntroSlides" 
        @close="handleIntroClose"
      />

      <div
        v-if="!showStartup && !showIntroSlides"
        id="wwt-overlay"
      >
        <InstaTourSheet
          v-if="activeTour"
          :tour-id="activeTour.id"
          :step="tourStep"
          :small-size="smallSize"
          @next="goToStep(tourStep + 1)"
          @previous="goToStep(tourStep - 1)"
          @leave="leaveTour"
          @step="(index) => goToStep(index)"
        />
        <div id="top-content">
          <div id="left-buttons">
            <!-- <div
              v-if="showExploreUi"
              class="d-flex flex-column ga-2"
            >
              <h3 v-if="visibleFootprints.length > 0">
                Satellite fields of view
              </h3>
              <MiniFootprintSettings
                v-for="footprint in visibleFootprints"
                :key="footprint.id"
                v-model:opacity="footprint.opacity"
                v-model:fill="footprint.fill"
                :label="footprint.label"
                :color="footprint.color"
                :show-fill="footprint.id === 'roman-footprint' || true"
              />
            </div> -->

            <div
              v-if="endTourOverlay"
              id="tour-options"
              class="d-flex flex-column ga-2"
            >
              <v-btn
                v-for="option in tourEndOptions"
                :key="option.id"
                :color="borderColor"
                elevation="6"
                density="comfortable"
                class="tour-option"
                @click="option.action"
              >
                {{ option.label }}
              </v-btn>
            </div>

            <!-- <InfoDialog
          :style="cssVars"
          v-model="showInfoDialog"
          v-model:auto-open="autoOpenInfoDialog"
          :accent-color="accentColor"
        /> -->

            <div class="d-flex flex-direction-row ga-2">
              <icon-button
                v-if="showExploreUi"
                id="options-closed"
                icon="sliders"
                :color="borderColor"
                tooltip-text="Open controls"
                tooltip-location="start"
                tabindex="0"
                background-color="transparent"
                @activate="toggleControls"
              ></icon-button>

              <icon-button
                v-if="showExploreUi"
                id="info-icon"
                v-model="showTextSheet"
                icon="info"
                :color="borderColor"
                tooltip-text="Show User Guide"
                tooltip-location="start"
              >
              </icon-button>

              <icon-button
                v-if="showExploreUi"
                id="replay-icon"
                icon="mdi-replay"
                :color="borderColor"
                tooltip-text="Play the tour again"
                tooltip-location="start"
                background-color="transparent"
                @activate="replayTour"
              ></icon-button>

              <!-- icon-button owns its own tooltip model, so the close-out
               call-outs are separate tooltips anchored to its generated id -->
              <v-tooltip
                :model-value="inTour && showExploreUi"
                activator="#options-closed-button"
                location="bottom"
                :open-on-hover="false"
                text="Controls"
              />
              <v-tooltip
                :model-value="inTour && showExploreUi"
                activator="#info-icon-button"
                location="bottom"
                :offset="34"
                :open-on-hover="false"
                text="Learn more"
              />

              <!-- <icon-button
                v-if="showExploreUi"
                id="share-icon"
                icon="fa-share-nodes"
                :color="borderColor"
                tooltip-text="Copy share URL"
                tooltip-location="start"
                @activate="copyURLToClipboard"
              >
              </icon-button> -->
              <v-snackbar
                v-model="snackbar"
                :color="snackbarColor"
              >
                {{ snackbarMessage }}
              </v-snackbar>
            </div>
            <div
              v-if="false"
              id="options"
            >
              <div id="options-content">
                <div id="options-top-row">
                  <v-select
                    id="bg-select"
                    v-model="backgroundImagesetName"
                    class="mt-3 ml-1"
                    width="165"
                    label="Select Background"
                    :items="backgroundImagesets"
                    :list-props="{ bgColor: backgroundColorDarkest }"
                    variant="solo-filled"
                    item-title="displayName"
                    item-value="imagesetName"
                    :bg-color="backgroundColor"
                    :item-color="textColor"
                    density="compact"
                    hide-details
                  >
                  </v-select>
                  <icon-button
                    id="options-open"
                    class="pt-0 px-0"
                    icon="chevron-up"
                    :color="borderColor"
                    tooltip-text="Close controls"
                    tooltip-location="start"
                    tabindex="0"
                    :border="false"
                    background-color="transparent"
                    @activate="showOptions = !showOptions"
                  ></icon-button>
                </div>
                <div id="options-scroll">
                  <FootprintSettings
                    v-for="footprint in footprints"
                    :key="footprint.id"
                    v-model:footprint-color="footprint.color"
                    v-model:fill="footprint.fill"
                    v-model:fill-opacity="footprint.fillOpacity"
                    v-model:show="footprint.show"
                    :label="footprint.label"
                    @show="(show: boolean) => showTextOverlay(footprint.id, show)"
                  />
                  <!--                   
                  <div
                    id="crosshairs-row"
                    class="centered-content"
                  >
                    <v-checkbox
                      v-model="crosshairs"
                      label="Crosshairs"
                      density="compact"
                      hide-details
                      @keydown.space.prevent="crosshairs = !crosshairs"
                      @keydown.enter.prevent="crosshairs = !crosshairs"
                    ></v-checkbox>
                    <input
                      v-show="crosshairs"
                      id="crosshairs-color"
                      v-model="crosshairsColor"
                      class="bordered"
                      type="color"
                      :disabled="!crosshairs"
                    />
                  </div>
                  <v-checkbox
                    v-model="decimalCoordinates"
                    label="Decimal coordinates"
                    density="compact"
                    hide-details
                    @keydown.space.prevent="
                      decimalCoordinates = !decimalCoordinates
                    "
                    @keydown.enter.prevent="
                      decimalCoordinates = !decimalCoordinates
                    "
                  ></v-checkbox>
                  <v-checkbox
                    v-model="galactic"
                    label="Galactic mode"
                    density="compact"
                    hide-details
                    @keydown.space.prevent="galactic = !galactic"
                    @keydown.enter.prevent="galactic = !galactic"
                  ></v-checkbox>
                   -->
                </div>
              </div>
            </div>
          </div>
          <div id="center-content">
            <div
              v-if="false"
              id="coordinates"
              class="info-box"
            >
              <div class="coordinates-content">
                <span class="coordinate-item">RA: {{ raDisplay }}</span>
                <span class="coordinate-item">Dec: {{ decDisplay }}</span>
                <span class="coordinate-item">FOV: {{ fovDisplay }}</span>
              </div>
            </div>
          </div>

          <div id="right-buttons">
            <!-- <PlaceCards
              :cards="placeCards"
              :selected="selectedPlaceId"
              :zoom="2"
              :width="smallSize ? '100px' : '200px'"
              :accent-color="accentColor"
              :aspect-ratio="smallSize ? 1 : 2"
              @select="selectPlace"
              @go-to="goToPlace"
            /> -->
          </div>
        </div>
        <!-- on screen info from rubin first look -->

        <div
          id="bottom-content"
          :class="[smallSize ? 'no-footer' : '']"
        >
          <!-- padding on top is needed because -->
          <v-row
            id="position-layout"
            align="start"
            justify="center"
            class="pt-4"
          >
            <div
              v-if="opacitySliders.length > 0"
              id="step-control"
              class="info-box"
            >
              <div
                v-for="slider in opacitySliders"
                :key="slider.index"
                class="opacity-slider-row"
              >
                <template v-if="slider.minLabel || slider.maxLabel">
                  <span
                    class="opacity-slider-label"
                    tabindex="0"
                    @click="setOpacity(slider.index, 0)"
                    @keyup.enter="setOpacity(slider.index, 0)"
                  >{{ slider.minLabel ?? slider.name }}</span>
                  <v-slider
                    :id="`layer-opacity-${slider.index}`"
                    :model-value="opacityOf(slider.index)"
                    :min="0"
                    :max="1"
                    :step="0.01"
                    color="grey"
                    density="compact"
                    hide-details
                    @update:model-value="
                      (value: number) => setOpacity(slider.index, value)
                    "
                  />
                  <span
                    class="opacity-slider-label"
                    tabindex="0"
                    @click="setOpacity(slider.index, 1)"
                    @keyup.enter="setOpacity(slider.index, 1)"
                  >{{ slider.maxLabel ?? slider.name }}</span>
                </template>
                <template v-else>
                  <label :for="`layer-opacity-${slider.index}`">{{
                    slider.name
                  }}</label>
                  <v-slider
                    :id="`layer-opacity-${slider.index}`"
                    :model-value="opacityOf(slider.index)"
                    :min="0"
                    :max="1"
                    :step="0.01"
                    color="grey"
                    density="compact"
                    hide-details
                    @update:model-value="
                      (value: number) => setOpacity(slider.index, value)
                    "
                  />
                </template>
              </div>
            </div>
          </v-row>

          
          <!-- Imageset Credits -->
          <footer
            id="body-logos"
          >
            <div 
              v-if="!smallSize" 
              id="imageset-credits"
            >
              <template v-if="activeTour && shownImagesets.length > 0">
                <ImagesetCredits
                  v-for="index in shownImagesets"
                  :key="index"
                  :imageset="activeTour?.wtml.imagesets.value[index]"
                />
              </template>
            </div>
            <template v-if="false">
              <div>zoom deg: {{ (store.zoomDeg / 6).toFixed(2) }}</div>
              <div>ra deg: {{ (store.raRad * R2D).toFixed(4) }}</div>
              <div>dec deg: {{ (store.decRad * R2D).toFixed(4) }}</div>
            </template>
            <credit-logos v-if="!smallSize" />
          </footer>
        </div>
      </div>

      <!-- WebGL2 not enabled dialog -->
      <webgl-test
        :style="cssVars"
        @webgl2-disabled="webglDisabled = true"
      />

      <!-- This dialog contains the video that is displayed when the video icon is clicked -->

      <v-dialog
        id="video-container"
        v-model="showVideoSheet"
        transition="slide-y-transition"
        fullscreen
      >
        <div class="video-wrapper">
          <font-awesome-icon
            id="video-close-icon"
            class="close-icon"
            icon="times"
            size="lg"
            tabindex="0"
            @click="showVideoSheet = false"
            @keyup.enter="showVideoSheet = false"
          ></font-awesome-icon>
          <video
            id="info-video"
            controls
          >
            <source
              src=""
              type="video/mp4"
            />
          </video>
        </div>
      </v-dialog>
    </div>

    <div
      id="side-drawer"
      :class="[(showTextSheet || inTour || showOptions) ? 'side-drawer-open' : 'side-drawer-closed']"
    >
      <TourSheet
        v-if="activeTour && !showOptions"
        :tour-id="activeTour.id"
        :step="tourStep"
        :small-size="smallSize"
        show-next-on-last-step
        :next-text="showExploreUi ? 'Explore' : 'Next'"
        @next="showExploreUi ? enterExplore() : goToStep(tourStep + 1)"
        @previous="goToStep(tourStep - 1)"
        @leave="leaveTour"
        @step="(index) => goToStep(index)"
      >
        <!-- the close-out step keeps the text but trades the stepper for the
         way out -->
        <!-- <template
          v-if="showExploreUi"
          #controls
        >
          <div class="tour-text-controls">
            <v-spacer />
            <v-btn
              variant="flat"
              color="#502752"
              size="small"
              rounded="lg"
              @click="enterExplore"
            >
              Explore
            </v-btn>
          </div>
        </template> -->
      </TourSheet>

      <TourSheet
        v-if="showOptions && !showTextSheet"
        :tour-id="lastTourId"
        :step="tourStep"
        :small-size="smallSize"
        :show-breadcrumbs="false"
      >
        <div id="tour-controls">
          <div class="tour-controls-column">
            <h3>Scale</h3>
            <v-btn
              variant="flat"
              color="#502752"
              size="small"
              rounded="lg"
              @click="goToScale('galaxy')"
            >
              Galaxy
            </v-btn>
            <v-btn
              variant="flat"
              color="#502752"
              size="small"
              rounded="lg"
              @click="goToScale('roman')"
            >
              Roman
            </v-btn>
            <v-btn
              variant="flat"
              color="#502752"
              size="small"
              rounded="lg"
              @click="goToScale('pixel')"
            >
              Pixel
            </v-btn>
          </div>
          <div class="tour-controls-column">
            <h3>FOV</h3>
            <MiniFootprintSettings
              v-for="footprint in visibleFootprints"
              :key="footprint.id"
              v-model:opacity="footprint.opacity"
              v-model:fill="footprint.fill"
              :label="footprint.label"
              :color="footprint.color"
              :show-opacity="false"
            />
          </div>
          <v-icon
            icon="mdi-close"
            @click="showOptions = false"
          />
        </div>
        <template #controls>
          <!-- an empty slot falls back to the stepper, so this div always renders -->
          <div>
            <div
              v-for="slider in layerSliders"
              :key="slider.index"
            >
              <label :for="`controls-opacity-${slider.index}`">{{
                slider.name
              }}</label>
              <v-slider
                :id="`controls-opacity-${slider.index}`"
                :model-value="opacityOf(slider.index)"
                :min="0"
                :max="1"
                :step="0.01"
                :color="roman.color"
                density="compact"
                hide-details
                @update:model-value="
                  (value: number) => setOpacity(slider.index, value)
                "
              />
            </div>
          </div>
        </template>
      </TourSheet>
      <InformationSheet
        v-if="showTextSheet"
        v-model="showTextSheet"
        v-model:tab="infoSheetTab"
        :tab-color="borderColor"
        :text-color="textColor"
        :heading-color="borderColor"
        :accent-color="roman.color"
        tab-title="WWT Why Roman"
      >
        <InfoPage title="View Finder Info">
          <ViewFinderHelp />
        </InfoPage>
        <InfoPage
          title="User Guide"
        >
          <UserGuide />
        </InfoPage>
      </InformationSheet>
    </div>
  </v-app>
</template>

<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ref,
  shallowRef,
  reactive,
  computed,
  watch,
  onBeforeMount,
  onMounted,
  nextTick,
  type Ref,
} from "vue";
import { fmtDegLat, fmtHours, D2R, R2D } from "@wwtelescope/astro";
import {
  Color,
  Coordinates,
  Imageset,
  ImageSetLayer,
  Place,
  Settings,
  WWTControl,
} from "@wwtelescope/engine";
import { GotoRADecZoomParams, engineStore } from "@wwtelescope/engine-pinia";
import {
  BackgroundImageset,
  skyBackgroundImagesets,
  blurActiveElement,
  useWWTKeyboardControls,
} from "@cosmicds/vue-toolkit";
import PlaceCards from "./components/PlaceCards.vue";
import { useDisplay, useTheme } from "vuetify";
import { storeToRefs } from "pinia";

import * as wwtlib from "@wwtelescope/engine";

import { useFootprint, type Footprint } from "./composables/useFootprint";
import { flat } from "./utils";
import { renderOneFrame, splitString } from "./wwt-hacks";

import { ResolvedObject } from "./simbad_resolvers";
import ImagesetCredits from "./components/ImagesetCredits.vue";
import InformationSheet from "./components/InformationSheet.vue";
import InfoPage from "./components/InfoPage.vue";
import UserGuide from "./components/UserGuide.vue";
import ViewFinderHelp from "./components/ViewFinderHelp.vue";
import InfoDialog from "./components/InfoDialog.vue";
import SplashGesture from "./components/SplashGesture.vue";
import SplashScreen from "./components/SplashScreen.vue";
import FootprintSettings from "./components/FootprintSettings.vue";
import MiniFootprintSettings from "./components/MiniFootprintSettings.vue";
import TourSheet from "./components/TourSheet.vue";
import InstaTourSheet from "./components/InstaTourSheet.vue";
import { tourExperiences } from "./experiences";
import {
  useWtmlLoader,
  type WtmlLoaderReturn,
} from "./composables/useWtmlLoader";
import { useLayerOrdering } from "./composables/useLayerOrdering";
import { useSpreadsheetLayer } from "./composables/useSpreadsheetLayer";
import { RAUnits } from "@wwtelescope/engine-types";

// @ts-expect-error `Util.splitString` is defined
wwtlib.Util.splitString = splitString;

type SheetType = "text" | "video";
type CameraParams = Omit<GotoRADecZoomParams, "instant">;
export interface RomanFovProps {
  wwtNamespace?: string;
  initialCameraParams?: CameraParams;
}

const store = engineStore();

const { backgroundImageset, decRad, raRad } = storeToRefs(store);

const backgroundImagesetName = computed({
  get(): string | undefined {
    return backgroundImageset.value?.get_name();
  },
  set(name: string) {
    store.setBackgroundImageByName(name);
  },
});

useWWTKeyboardControls(store);

const { height, width, smAndDown } = useDisplay();

const isPortrait = computed(() => height.value >= width.value);

const props = withDefaults(defineProps<RomanFovProps>(), {
  wwtNamespace: "roman-fov",
  initialCameraParams: () => {
    return {
      // Orion
      // raRad: 1.4612,
      // decRad: -0.09646,
      // Andromeda
      raRad: 10.6847083 * D2R,
      decRad: 41.26875 * D2R,
      zoomDeg: 60,
    };
  },
});

// const backgroundImagesets = reactive<BackgroundImageset[]>([
//   new BackgroundImageset("DSS", "Digitized Sky Survey (Color)"),
//   new BackgroundImageset("2MASS", "2Mass: Imagery (Infrared)"),
// ]);
const backgroundImagesets = reactive<BackgroundImageset[]>([
  ...skyBackgroundImagesets,
]);


const sheet = ref<SheetType | null>(null);
const layersLoaded = ref(false);
const positionSet = ref(false);

const positionSearchRA = ref<string | null>(null);
const positionSearchDec = ref<string | null>(null);
const positionSearchError = ref<string | null>(null);

// Color palette generated by Claude from https://assets.science.nasa.gov/dynamicimage/assets/science/missions/rst/spacecraft-illustrations/Roman_Title_1.jpg
// (with some adjustments by me)
// Deep Space Purple #502752(Background)
// Cosmic Violet #632B7D (Background)
// ISM Indigo #8B5FB6 (Call to Action, with Stardust White text)
// pick one accent
// Nebula Magenta #C77FB3 (Accents)
// Stellar Amber #FFB86C (Accents / Contrast)
// Electric Cyan #00F0FF (Accents)
// Soft Lavender #B8A5D4  (Borders)
// Stardust White #F5F0FF  (Background / text on dark)
// Space Black #0A0515  (text on light)
// https://contrast-grid.eightshapes.com/?version=1.1.0&background-colors=&foreground-colors=%23FFFFFF%2C%20white%0D%0A%23502762%2C%20Deep%20Space%20Purple%0D%0A%23632b7d%2C%20Cosmic%20Violet%0D%0A%238B5FB6%2C%20ISM%20Indigo%0D%0A%23C77FB3%2C%20Nebula%20Magenta%0D%0A%23FFB86C%2C%20Stellar%20Amber%0D%0A%2300F0FF%2C%20Electric%20Cyan%0D%0A%23B8A5D4%2C%20Soft%20Lavender%0D%0A%23F5F0FF%2C%20Stardust%20White%0D%0A%230A0515%2C%20Space%20Black%0D%0A%23000000%2C%20black&es-color-form__tile-size=compact&es-color-form__show-contrast=aaa&es-color-form__show-contrast=aa&es-color-form__show-contrast=aa18&es-color-form__show-contrast=dnp

const backgroundColorDarkest = ref("#502752");
const backgroundColor = ref("#632B7D");
const borderColor = ref("#B8A5D4");
const accentColor = ref("#C77FB3");
const textColor = ref("#F5F0FF");

/*
 * Each footprint carries its own geometry and settings. To add one: import its
 * corners, add a useFootprint() call, and list it in `footprints` below. The
 * controls and the render loop both come from that array.
 */
import { full as jwstFootprint } from "./footprints/jwst_nircam_modules";
import { corners as romanFootprint } from "./footprints/roman_wfi_footprint";
import { corners as romanPixelFootprint } from "./footprints/roman_wfi_pixels";
import { corners as hubbleFootprint } from "./footprints/hubble_wfc3_footprint";
import { corners as wfpc2Footprint } from "./footprints/hst_wfpc2_footprint";
import { corners as phastFootprint } from "./footprints/m31_footprint";
import { corners as phastIFootprint } from "./footprints/m31_individual_footprints";
import { drawFootprint } from "./footprint";

/*
 * The Roman core community surveys, as idealized 49.404' x 25.307' tiles, one
 * cell per pointing.
 */
/*
import { corners as gpsFootprint } from "./footprints/gps";
import { corners as hltdsFootprint } from "./footprints/hltds";
import { corners as hlwasFootprint } from "./footprints/hlwas";
// m31 footprints
import { corners as gbtdsFootprint } from "./footprints/gbtds_wfi";
import { corners as m31HiDiskFootprint } from "./footprints/roman_2002_m31_hi_disk";
*/
import { corners as m31SfDiskFootprint } from "./footprints/roman_2002_m31_sf_disk";
import { corners as m31SfDiskFootprintOutline } from "./footprints/roman_2002_m31_sf_disk_display";
import IntroSlides from "./components/IntroSlides.vue";

const roman = useFootprint({
  id: "roman-footprint",
  label: "Roman",
  footprint: romanFootprint,
  color: "#ff1900",
  // linewidth: 2, // faking the linewidth can leave artifacts
  offsetXDeg: 0.05,
  offsetYDeg: -0.5 * 0.11 / 3600,  // Half the height of one Roman pixel
});

const romanPixel = useFootprint({
  id: "roman-pixel-grid",
  label: "Roman Pixel Grid",
  footprint: romanPixelFootprint,
  color: "#108de0",
  show: true,
});
const testFootprint = useFootprint({
  id: "roman-fixed-footprint",
  label: "TEST 10 deg",
  // footprint: [[[-0.5, -0.5], [-0.5, 0.5], [0.5, 0.5], [0.5, -0.5]]],
  footprint: [
    [
      [-0.5, -0.5],
      [-0.5, 0.5],
      [0.5, 0.5],
      [0.5, -0.5],
    ].map(([x, y]) => [x * 15, y * 10]),
  ], // 1 hour x 10 deg. the equatorial grid spacing
  // footprint: romanFootprint,
  color: "#4afa4a",
  fixed: false,
  fill: false,
  show: false,
});
const jwst = useFootprint({
  id: "jwst-footprint",
  label: "JWST",
  footprint: jwstFootprint,
  color: "#002aff",
  offsetXDeg: -0.075, // left
  offsetYDeg: 0.2, // down
  // linewidth: 2,
  show: false,
});
const hubble = useFootprint({
  id: "hubble-footprint",
  label: "WFC3",
  footprint: hubbleFootprint,
  color: "#e100ff",
  offsetXDeg: 0.1,
  offsetYDeg: 0.2,
  // linewidth: 2,
  show: false,
});
// const wfpc2 = useFootprint({
//   id: "wfpc2-footprint",
//   label: "WFPC2",
//   footprint: wfpc2Footprint,
//   color: "#34ebd5",
//   offsetXDeg: 0.2,
//   offsetYDeg: 0.2,
//   fill: true,
//   linewidth: 2,
// });
const phast = useFootprint({
  id: "phast-footprint",
  label: "PHAST",
  footprint: phastFootprint,
  color: "#00ff95",
  fixed: true,
  show: false,
});

const phastI = useFootprint({
  id: "phastI-footprint",
  label: "PHAST (individual)",
  footprint: phastIFootprint,
  color: "#00ff00",
  fixed: true,
  show: false,
  opacity: 0.2,
});

/* The Roman core survey footprints: real sky positions, so all `fixed`. */
/*
const gbtds = useFootprint({
  id: "gbtds-footprint",
  label: "GBTDS",
  footprint: gbtdsFootprint,
  color: "#ffb86c",
  fixed: true,
  show: false,
});
const gps = useFootprint({
  id: "gps-footprint",
  label: "GPS",
  footprint: gpsFootprint,
  color: "#00f0ff",
  fixed: true,
  show: false,
});
const hltds = useFootprint({
  id: "hltds-footprint",
  label: "HLTDS",
  footprint: hltdsFootprint,
  color: "#ffe066",
  fixed: true,
  show: false,
});
const hlwas = useFootprint({
  id: "hlwas-footprint",
  label: "HLWAS",
  footprint: hlwasFootprint,
  color: "#ff6ec7",
  fixed: true,
  show: false,
});

const m31HiDisk = useFootprint({
  id: "m31-hi-disk-footprint",
  label: "M31 HI disk (2002)",
  footprint: m31HiDiskFootprint,
  color: "#00bfa5",
  fixed: true,
  show: false,
});
*/

const m31SfDisk = useFootprint({
  id: "m31-sf-disk-footprint",
  label: "M31 SF disk (2002)",
  footprint: m31SfDiskFootprint,
  color: "#bd93f9",
  fixed: true,
  show: false,
});
const m31SfDiskOutline = useFootprint({
  id: "m31-sf-disk-footprint-outline",
  label: "M31 SF disk (2002)",
  footprint: m31SfDiskFootprintOutline,
  color: "#f58d42",  // TODO: Feel free to change this
  fixed: true,
  show: false,
});

// phast, phastI, gbtds, hlwas, hltds, gps, testFootprint
const footprints = [  
  phast,
  phastI,
  // gbtds,
  // hlwas,
  // hltds,
  // gps,
  // m31HiDisk,
  m31SfDisk,
  m31SfDiskOutline,
  romanPixel,
  roman,
  jwst,
  hubble,
];

// the currently visible footprints. 
const visibleFootprints = computed(() =>
  footprints.filter((footprint) => footprint.show),
);

const visibleAndShownFootprints = computed(() =>
  footprints.filter((footprint) => footprint.show && footprint.opacity > 0),
);
function hideVisibleFootprints() {
  // set their opacity to 0
  footprints.forEach((footprint) => {
    footprint.opacity = 0;
  });
}
import { useLocalStorage } from "@vueuse/core";
import { createTextOverlay } from "./text";

const hasSeenIntroSlides = useLocalStorage("why-roman:hasSeenIntroSlides", false);
const hasSeenFullTour = useLocalStorage("why-roman:hasSeenFullTour", false);


hasSeenIntroSlides.value = true;
hasSeenFullTour.value = false;
console.error("NOTE: make these live for real use");
// if we are returnings we can skip
const returning = hasSeenIntroSlides.value && hasSeenFullTour.value;

// ?tour=<id>&tourStep=<n>, skips the splash and intro
// and slides. ?tour=manual is a short cut to a manual mode.
const searchParams = new URLSearchParams(window.location.search);
const tourParam = searchParams.get("tour");
// a step without a tour to put it in means nothing. the param is 1-indexed,
const tourStepParam = tourParam === null ? 0 : +(searchParams.get("tourStep") ?? 1) - 1;

const showStartup = ref(!returning && tourParam === null);
// const showStartup = ref(false);
const showIntroSlides = ref(false);
function handleSplashClose() {
  showStartup.value = false;
  showIntroSlides.value = true;
}
function handleIntroClose() {
  showIntroSlides.value = false;
  startTourFromStartup("andromeda");
  hasSeenIntroSlides.value = true;
}


const hasSeenSplashGesture = useLocalStorage(
  "why-roman:hasSeenSplashGesture",
  false,
);
const showSplashGesture = ref(!hasSeenSplashGesture.value);
function handleSplashGestureClose() {
  hasSeenSplashGesture.value = true;
}

const showTextSheet = ref(false);
const infoSheetTab = ref(0);


function onlyFootprints(visible: Footprint[], show?: (boolean | undefined)[]) {
  footprints.forEach(
    (footprint, index) => {
      footprint.show = visible.includes(footprint);
      if (show) {
        footprint.opacity = show[visible.indexOf(footprint)] === true ? 1 : 0;
      }
    },
  );
}

function showOnlyFootprints(...visible: Footprint[]) {
  // hide all "shown" footprints by opacity, and make only visible opacity 1
  footprints.forEach((footprint) => {
    if (footprint.show) {
      footprint.opacity = visible.includes(footprint) ? 1 : 0;
    }
  });
}

const { setOrderForLayers } = useLayerOrdering();

const shownImagesets = ref<number[]>([]);
const layerOpacities = ref<Record<number, number>>({});
// whichever wtml showImagesets last drew from, so the sliders work outside a tour too
const shownWtml = shallowRef<WtmlLoaderReturn | null>(null);

function _fadeInLayer(layer: ImageSetLayer, duration = 1) {
  const startOpacity = layer.get_opacity();
  const dtMs = duration * 1000;
  
  const startTime = performance.now();

  
  // requestAnimationFrame loop to fade in the layer
  const fadeLoop = (time: number) => {
    const fraction = (time - startTime) / dtMs ;
    // lerp
    const newOpacity = startOpacity + (1 - startOpacity) * fraction;
    layer.set_opacity(newOpacity);
    if (fraction < 1) {
      requestAnimationFrame(fadeLoop);
    } else {
      layer.set_opacity(1);
    }
  };
  fadeLoop(startTime);

}
// show just these layers, lowest first
function showImagesets(wtml: WtmlLoaderReturn, ...indices: number[]) {
  shownImagesets.value = indices;
  shownWtml.value = wtml;
  layerOpacities.value = {};
  wtml.imagesetLayers.value.forEach((layer, index) => {
    layer.set_enabled(indices.includes(index));
    layer.set_opacity(1);
  });
  const shown = indices
    .map((index) => wtml.imagesetLayers.value[index])
    .filter((layer) => layer != null);
  if (shown.length > 1) {
    setOrderForLayers(shown);
  }
}

// a plain number shows the layer's own name; pass an object instead to
// label the slider's 0%/100% ends (e.g. the background/foreground images
// being cross-faded) rather than falling back to the layer's own name
type OpacitySliderSpec =
  | number
  | { index: number; minLabel?: string; maxLabel?: string };

function showOpacitySliders(...specs: OpacitySliderSpec[]) {
  layerOpacities.value = {};
  const wtml = shownWtml.value;
  if (!wtml) {
    opacitySliders.value = [];
    return;
  }
  const indices = specs.map((spec) =>
    typeof spec === "number" ? spec : spec.index,
  );
  // make sure layers are enabled and have opacity.
  indices.forEach((index) => {
    const layer = wtml.imagesetLayers.value[index];
    if (layer) {
      layer.set_enabled(true);
      layer.set_opacity(layerOpacities.value[index] ?? 1);
    }
  });
  // set the list of sliders to show
  opacitySliders.value = specs.map((spec) => {
    const index = typeof spec === "number" ? spec : spec.index;
    return {
      index,
      name: wtml.imagesetNames.value[index] ?? "",
      minLabel: typeof spec === "number" ? undefined : spec.minLabel,
      maxLabel: typeof spec === "number" ? undefined : spec.maxLabel,
    };
  });
}

interface ImagesetView {
  zoom: number; // vertical field of view, degrees
  roll?: number | "imageset";
  ra?: number;
  dec?: number;
  instant?: boolean;
  duration?: number;
}

function goToImageset(
  wtml: WtmlLoaderReturn,
  index: number,
  view: ImagesetView,
) {
  const imageset = wtml.imagesets.value[index];
  if (!imageset) {
    return;
  }
  const rollDeg =
    view.roll === "imageset" ? imageset.get_rotation() : (view.roll ?? 0);
  store.gotoRADecZoom({
    raRad: (view.ra ?? imageset.get_centerX()) * D2R,
    decRad: (view.dec ?? imageset.get_centerY()) * D2R,
    zoomDeg: view.zoom * 6,
    rollRad: rollDeg * D2R,
    instant: view.instant ?? true,
    duration: view.duration,
  });
}

// the explore ui: hidden while stepping, on from the close-out step onward
const showExploreUi = ref(true);
const lastTourId = ref("andromeda");

function tourCloseOut() {
  showExploreUi.value = true;
}

function replayTour() {
  selectPlace(lastTourId.value);
}

// leaving the tour for good: step -1 is the state explore mode starts from
function enterExplore() {
  leaveTour();
  tours.find((t) => t.id === lastTourId.value)?.step(-1, false);
  showOptions.value = true; // show the options box by default
}

// opening the controls at the close-out step ends the tour
function toggleControls() {
  const open = !showOptions.value;
  if (open && inTour.value) {
    enterExplore();
  }
  showOptions.value = open;
}

const endTourOverlay = ref(false);
function showEndTourOverlay() {
  endTourOverlay.value = true;
  hasSeenFullTour.value = true;
  // in case there is more we want to do
}

const carinaWtml = useWtmlLoader("carina.wtml", {
  goTo: false,
  onLoad: (out) => out.layer.set_enabled(false),
});
const currentViewRad = computed(() => {
  return {
    raRad: store.raRad,
    decRad: store.decRad,
    zoomDeg: store.zoomDeg,
    rollRad: store.rollRad,
  };
});

/* in the tours step -1 displays everything from a tour for a user to explore */


function carinaTour(n: number, tour = true) {
  if (n === -1) {
    onlyFootprints([hubble, jwst, roman]);
    showImagesets(carinaWtml, 0, 1, 2);
    showOpacitySliders(1, 2);
    goToImageset(carinaWtml, 2, {
      zoom: 0.9,
      roll: "imageset",
      instant: false,
    });
    return;
  }
  if (n === 0) { // Andromeda
    onlyFootprints([]); // no footprints
    showImagesets(carinaWtml, 0); // eso widefield image
    showOpacitySliders();
    goToImageset(carinaWtml, 0, { zoom: 0.9, instant: false }); //
    return;
  }
  if (n === 1) {
    onlyFootprints([hubble]); // hst cosmic cliffs
    showImagesets(carinaWtml, 0, 1); // wide + hst
    showOpacitySliders(1);
    goToImageset(carinaWtml, 2, { zoom: 0.15, roll: "imageset" });
    return;
  }
  if (n === 2) {
    onlyFootprints([hubble, jwst]);
    showImagesets(carinaWtml, 0, 1, 2); // wide + hst + jwst
    showOpacitySliders(1, 2);
    goToImageset(carinaWtml, 2, { zoom: 0.15, roll: "imageset" });
    return;
  }
  if (n === 3) {
    onlyFootprints([hubble, jwst, roman]);
    showImagesets(carinaWtml, 0, 1, 2);
    showOpacitySliders(1, 2);
    store.gotoRADecZoom({
      ...currentViewRad.value,
      zoomDeg: 5.4,
      instant: true,
    });
    if (tour) showEndTourOverlay();
    return;
  }
  console.error("carina tour does not have step", n);
}

const andromedaWtml = useWtmlLoader("M31_PHAST.wtml", {
  goTo: false,
  onLoad: (out) => out.layer.set_enabled(false),
});
// andromeda tour state
const ats = {
  maxStep: 0,
  setMaxStep(n: number) {
    console.log("andromedaTour maxStep", n);
    this.maxStep = Math.max(this.maxStep, n);
  },
};

function andromedaTour(n: number, tour = true) {
  if (n === -1) {
    onlyFootprints(
      [phast, phastI, roman, romanPixel, hubble, jwst, m31SfDisk, m31SfDiskOutline],
      // eslint-disable-next-line no-sparse-arrays
      [,,true,,,,,]
    );
    // handle undefined warning buy using the setter
    textVisibilitySetters["roman"]?.(true);
    textVisibilitySetters["hubble"]?.(false);
    textVisibilitySetters["jwst"]?.(false);
    showImagesets(andromedaWtml, 0);
    goToImageset(andromedaWtml, 0, { zoom: 3.4, instant: false });
    showOpacitySliders({ index: 0, minLabel: "ground", maxLabel: "Hubble" });
    return;
  }
  /* each step should explicitly set
   - visible footprints
   - visible opacity sliders
   - visible imagesets
   - camera position
   */
  ats.setMaxStep(n);
  if (n === 0 || n === 1) { // Andromeda & View from the ground
    ats.setMaxStep(0);
    onlyFootprints([]); // no footprints
    showOpacitySliders();
    showImagesets(andromedaWtml); // load wtml, but don't show anything yet
    store.gotoRADecZoom({ // center M31, zoomed to 
      raRad: 10.6847 * D2R,
      decRad: 41.269 * D2R,
      zoomDeg: 3 * 6, // a 3 degree zoom.
      rollRad: 0,
      instant: false,
    });
    
    if (n===1) {
      ats.setMaxStep(1);
    }
    
    return;
  }
  

  if (n === 2) {  // Hubbles view from space
    onlyFootprints([phast]);
    showImagesets(andromedaWtml, 0);
    store.gotoRADecZoom({
      raRad: 10.6847 * D2R,
      decRad: 41.269 * D2R,
      zoomDeg: 2.9 * 6,
      rollRad: 0,
      instant: ats.maxStep < 1, // if we have been here before, don't animate
    }).then(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1500)); // brief pause before the next zoom
      // zoom into some point where the user can change opacity
      await store.gotoRADecZoom({
        raRad: 11.0743 * D2R,
        decRad: 41.6521 * D2R,
        zoomDeg: 0.04 * 6,
        instant: false,
        duration: 4,
      });
      showOpacitySliders({ index: 0, minLabel: "ground", maxLabel: "Hubble" });
    });
    
    return;
  }

  if (n === 3) {  // "Hubble Took this many images"
    onlyFootprints([phast]); // just show PHAST outlines
    showOpacitySliders();  // no slides
    showImagesets(andromedaWtml, 0);
    store.gotoRADecZoom({
      raRad: 10.6847 * D2R,
      decRad: 41.269 * D2R,
      zoomDeg: 2 * 6, 
      rollRad: 0,
      instant: false,
    }).then(async () => {
      onlyFootprints([phast, phastI]); 
    }); // zoom back out
    ats.setMaxStep(n);
    return;
  }
  if (n === 4) { // JWST can only see this
    onlyFootprints([jwst]);
    showOpacitySliders();
    showImagesets(andromedaWtml, 0);
    store.gotoRADecZoom({ // center M31, zoomed to 
      raRad: 10.6847 * D2R,
      decRad: 41.469 * D2R,
      zoomDeg: 2 * 6,
      rollRad: 0,
      instant: false,
    });
    ats.setMaxStep(n);
    return;
  }
  if (n === 5) { // Compare Roman, JWST, and Hubble
    onlyFootprints([roman, jwst, hubble]);
    showOpacitySliders();
    showImagesets(andromedaWtml, 0);
    store.gotoRADecZoom({ // center M31, zoomed to 
      raRad: 10.5847 * D2R,
      decRad: 41.269 * D2R,
      zoomDeg: 2 * 6, 
      rollRad: 0,
      instant: false,
    });
    ats.setMaxStep(n);
    return;
  }
  if (n === 6) { // what hubble did, roman can do in 3 hours
    onlyFootprints([phast, phastI, m31SfDisk, m31SfDiskOutline]);
    showOpacitySliders();
    showImagesets(andromedaWtml, 0);
    goToImageset(andromedaWtml, 0, { zoom: 3, instant: false });
    if (tour) showEndTourOverlay();
    ats.setMaxStep(n);
    return;
  }
  
  // step 8
  if (n === 7) { // Zoom in to Hubble with a pixel grid
    onlyFootprints([romanPixel]);
    showOpacitySliders();
    showImagesets(andromedaWtml, 0);
    store.gotoRADecZoom({
      raRad: 10.13 * D2R,
      decRad: 40.71 * D2R,
      zoomDeg: 0.01,
      rollRad: 0,
      instant: false,
      duration: 3,
    }).then(async () => {
      onlyFootprints([romanPixel, roman]);
      await new Promise((resolve) => setTimeout(resolve, 4000)); // brief pause before the next zoom
      // zoom into some point where the user can change opacity
      await store.gotoRADecZoom({
        raRad: 10.13 * D2R,
        decRad: 40.71 * D2R,
        zoomDeg: 2 * 6,
        instant: false,
        duration: 3,
      });
    });
    ats.setMaxStep(n);
    return;
  }
  
  // // step 9
  // if (n === 8) { // So many pixels
  //   onlyFootprints(phast,romanPixel, /* show pixel grid when ready, */ roman);
  //   showOpacitySliders();
  //   showImagesets(andromedaWtml, 0);
  //   store.gotoRADecZoom({
  //     raRad: 10.13 * D2R,
  //     decRad: 40.71 * D2R,
  //     zoomDeg: (10/60) * 6, // keep the zoom we are at
  //     rollRad: store.rollRad, // keep the roll we are at
  //     instant: false,
  //   });
  //   ats.setMaxStep(n);
  //   return;
  // }
  
  // // step 10
  // if (n === 9) {  // Zoomed all the way out 
  //   onlyFootprints(phast, m31SfDiskOutline,romanPixel,/* show pixel grid when ready, */ roman);
  //   showOpacitySliders();
  //   showImagesets(andromedaWtml, 0);
  //   // goToImageset(andromedaWtml, 0, { zoom: 2.5, instant: false });
  //   store.gotoRADecZoom({
  //     raRad: 10.13 * D2R,
  //     decRad: 40.71 * D2R,
  //     zoomDeg: 2 * 6, // keep the zoom we are at
  //     rollRad: store.rollRad, // keep the roll we are at
  //     instant: false,
  //   });
  //   ats.setMaxStep(n);
  //   return;
  // }
  
  // step 9
  if (n === 8) {// close out
    tourCloseOut();
    showOpacitySliders();
    onlyFootprints([]);
    ats.setMaxStep(n);
    return;
  }
  
  
  console.error("andromeda tour does not have step", n);
}

function goToScale(scale: 'galaxy' | 'roman' | 'pixel') {
  if (scale === 'galaxy') {
    // show these 3 and whatever else the user has visible
    showOnlyFootprints(phast, romanPixel, roman, ...visibleAndShownFootprints.value);
    store.gotoRADecZoom({
      ...currentViewRad.value,
      zoomDeg: 3 * 6,
      instant: false,
    });
    return;
  }  
  
  if (scale === 'roman') {
    // show these 2 and whatever else the user has visible
    showOnlyFootprints(romanPixel, roman, ...visibleAndShownFootprints.value);
    return store.gotoRADecZoom({
      ...currentViewRad.value,
      zoomDeg: 2 * 6,
      instant: false,
    });
  } 
  if (scale === 'pixel') {
    // show these 3 and whatever else the user has visible
    showOnlyFootprints(romanPixel, roman, ...visibleAndShownFootprints.value);
    return store.gotoRADecZoom({
      ...currentViewRad.value,
      zoomDeg: 0.01,
      instant: false,
    });
    
  }
}

const eagleWtml = useWtmlLoader("eagle_nebula.wtml", {
  goTo: false,
  onLoad: (out) => out.layer.set_enabled(false),
});

function eagleTour(n: number, tour = true) {
  if (n === -1) {
    onlyFootprints([hubble, roman]);
    showImagesets(eagleWtml, 0, 1);
    store.gotoRADecZoom({
      raRad: 274.7457 * D2R,
      decRad: -13.8305 * D2R,
      zoomDeg: 1 * 6,
      rollRad: 0,
      instant: false,
    });
    return;
  }
  if (n === 0) {
    onlyFootprints([hubble]);
    showImagesets(eagleWtml, 1);
    store.gotoRADecZoom({
      raRad: 274.7457 * D2R,
      decRad: -13.8305 * D2R,
      zoomDeg: 1 * 6,
      rollRad: 0,
      instant: true,
    });
    return;
  }
  if (n === 1) {
    onlyFootprints([hubble, roman]);
    showImagesets(eagleWtml, 0, 1);
    if (tour) showEndTourOverlay();
    return;
  }
  console.error("eagle tour does not have step", n);
}

const smacsWtml = useWtmlLoader("SMAC_0723_all_loose.wtml", {
  goTo: false,
  onLoad: (out) => out.layer.set_enabled(false),
});

function smacsTour(n: number, tour = true) {
  if (n === -1) {
    onlyFootprints([jwst, roman]);
    showImagesets(smacsWtml, 1, 0);
    goToImageset(smacsWtml, 1, {
      zoom: 0.15,
      roll: "imageset",
      instant: false,
    });
    return;
  }
  if (n === 0) {
    onlyFootprints([jwst]);
    showImagesets(smacsWtml, 1);
    goToImageset(smacsWtml, 1, {
      zoom: 0.15,
      roll: "imageset",
      instant: false,
    });
    // store.gotoRADecZoom({ raRad: 110.8335 * D2R, decRad: -73.4542 * D2R, zoomDeg: 0.15, rollRad: 0, instant: true });
    return;
  }
  if (n === 1) {
    onlyFootprints([jwst, roman]);
    showImagesets(smacsWtml, 1, 0);
    if (tour) showEndTourOverlay();
    return;
  }
  console.error("smacs tour does not have step", n);
}

const helixWtml = useWtmlLoader("helix_hst.wtml", {
  goTo: false,
  onLoad: (out) => out.layer.set_enabled(false),
});

function helixTour(n: number, tour = true) {
  if (n === -1) {
    onlyFootprints([hubble, roman]);
    showImagesets(helixWtml, 0);
    store.gotoRADecZoom({
      raRad: 337.4167 * D2R,
      decRad: -20.8394 * D2R,
      zoomDeg: 1 * 6,
      rollRad: 0,
      instant: false,
    });
    return;
  }
  if (n === 0) {
    onlyFootprints([hubble]);
    showImagesets(helixWtml, 0);
    store.gotoRADecZoom({
      raRad: 337.4167 * D2R,
      decRad: -20.8394 * D2R,
      zoomDeg: 1 * 6,
      rollRad: 0,
      instant: true,
    });
    return;
  }
  if (n === 1) {
    onlyFootprints([hubble, roman]);
    showImagesets(helixWtml, 0);
    if (tour) showEndTourOverlay();
    return;
  }
  console.error("helix tour does not have step", n);
}

interface PlaceTour {
  id: string;
  label: string;
  wtml: WtmlLoaderReturn;
  step: (n: number, tour?: boolean) => void;
}

const tours: PlaceTour[] = [
  // { id: "eagle", label: "Eagle Nebula", wtml: eagleWtml, step: eagleTour },
  {
    id: "andromeda",
    label: "Andromeda",
    wtml: andromedaWtml,
    step: andromedaTour,
  },
  { id: "smacs", label: "SMACS 0723", wtml: smacsWtml, step: smacsTour,},
  { id: "carina", label: "Carina", wtml: carinaWtml, step: carinaTour,},
  // { id: "helix", label: "Helix Nebula", wtml: helixWtml, step: helixTour },
];

const selectedPlaceId = ref<string | null>(null);
const activeTour = computed(
  () => tours.find((t) => t.id === selectedPlaceId.value) ?? null,
);
const inTour = computed(() => activeTour.value != null);

function leaveTour() {
  if (activeTour.value) {
    activeTour.value.wtml.hide();
  }
  selectedPlaceId.value = null;
  tourStep.value = 0;
  endTourOverlay.value = false;
  showExploreUi.value = true;
  onlyFootprints([]);
  showOptions.value = false;
  // the wtml was just hidden, so nothing is left to put a slider on
  shownImagesets.value = [];
  shownWtml.value = null;
  showOpacitySliders();
}

const tourStep = ref(0);
// src/experiences is the source of truth for what the steps are
const tourStepTitles = computed(() => {
  if (activeTour.value) {
    return (tourExperiences[activeTour.value.id] ?? []).map((s) => s.title ?? "");
  }
  return [];
});
const tourTotalSteps = computed(() => tourStepTitles.value.length);
const tourStepTitle = computed(
  () => tourStepTitles.value[tourStep.value] ?? "",
);

const onLastStep = computed(() => tourStep.value >= tourTotalSteps.value - 1);

function goToStep(n: number) {
  // if going backwards, we need undo the tour close out steps
  if (n < tourStep.value && n < (tourTotalSteps.value - 1)) {
    if (showExploreUi.value) {
      showExploreUi.value = false;
    }
  }
  tourStep.value = n;

  endTourOverlay.value = false; // so it goes away if we go backward, step() will bring it back if needed
  if (activeTour.value) {
    activeTour.value.step(n);
  }
}

/* what buttons will be shown at the end of a tour */
const tourEndOptions = computed<{id: string, label: string, action: () => void}[]>(() => {
  const options = [
  ];
  return options;
});

/*
 * The comparison lives on the last step, so once it has stacked more than one
 * image the upper ones get an opacity slider. The lowest layer is what the
 * others fade against, so it doesn't get one.
 */
// set by showOpacitySliders, not worked out from what is showing
const opacitySliders = ref<{ index: number; name: string; minLabel?: string; maxLabel?: string }[]>([]);
const layerSliders = opacitySliders;

function opacityOf(index: number): number {
  return layerOpacities.value[index] ?? 1;
}

function setOpacity(index: number, opacity: number) {
  if (shownWtml.value) {
    const layer = shownWtml.value.imagesetLayers.value[index];
    if (layer) {
      layer.set_opacity(opacity);
      layerOpacities.value[index] = opacity;
    }
  }
}

function imagesetFor(place: Place | null | undefined): Imageset | null {
  if (!place) {
    return null;
  }
  return place.get_studyImageset() ?? place.get_backgroundImageset();
}

const placeCards = computed(() =>
  tours.map(({ id, label, wtml }) => ({
    id,
    label,
    imageset: imagesetFor(wtml.places.value[0]),
    disabled: !wtml.loaded.value,
  })),
);

// picking a card starts that tour, or restarts it if it's already up
function selectPlace(id: string, step = 0) {
  if (activeTour.value) {
    leaveTour();
  }
  showExploreUi.value = false;
  showOptions.value = false;
  lastTourId.value = id;
  selectedPlaceId.value = id;
  goToStep(step);
}

/* bring up an experience's layers */
function goToPlace(id: string) {
  const place = tours.find((t) => t.id === id);
  if (!place) {
    return;
  }
  tours.forEach((t) => t.wtml.hide());
  place.step(-1, false);
}

function startTourFromStartup(id: string) {
  showStartup.value = false;
  selectPlace(id, tourStepParam || 0);
}

const decimalCoordinates = ref(false);
const raDisplay = computed(() => {
  return decimalCoordinates.value
    ? (raRad.value * R2D).toFixed(6)
    : fmtHours(raRad.value, "h", "m", 0, "s");
});
const decDisplay = computed(() => {
  return decimalCoordinates.value
    ? (decRad.value * R2D).toFixed(6)
    : fmtDegLat(decRad.value);
});

const fovDisplay = computed(() => {
  const fovDeg = store.zoomDeg / 6;
  if (fovDeg >= 1) {
    return `${fovDeg.toFixed(2)}°`;
  }
  const fovArcmin = fovDeg * 60;
  if (fovArcmin >= 1) {
    return `${fovArcmin.toFixed(1)}'`;
  }
  return `${(fovArcmin * 60).toFixed(1)}"`;
});
const galactic = ref(false);
const crosshairs = ref(false);
const crosshairsColor = ref("#ffffff");
const moving = ref(false);

const snackbar = ref(false);
const snackbarColor = ref<"error" | "success">("success");
const snackbarMessage = ref("");

const showInfoDialog = ref(false);
const autoOpenInfoDialog = ref(false);

const settings = Settings.get_active();

const webglDisabled = ref(false);

const textVisibilitySetters: Record<string, (show: boolean) => void> = {};

function showTextOverlay(id: string, show: boolean) {
  const setter = textVisibilitySetters[id];
  if (setter) {
    setter(show);
  }
}

const AUTO_SHOW_INFO_KEY = "roman-view-finder__auto-show-info";
// onBeforeMount(() => {
//   autoOpenInfoDialog.value = window.localStorage.getItem(AUTO_SHOW_INFO_KEY)?.toLowerCase() !== "false";
// });

onMounted(() => {
  store.waitForReady().then(async () => {
    if (webglDisabled.value) {
      layersLoaded.value = true;
      positionSet.value = true;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error `canvas` is defined
      WWTControl.singleton.canvas.setAttribute("hidden", "true");
      WWTControl.singleton.renderOneFrame = function () {
        /* empty */
      };
      return;
    }

    // allow zoom out to 90deg
    WWTControl.singleton.set_zoomMax(6 * 90);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error Modifying window object
    window.Matrix3d = wwtlib.Matrix3d; window.wwt = WWTControl.singleton;

    settings.set_galacticMode(galactic.value);
    settings.set_showCrosshairs(crosshairs.value);
    settings.set_crosshairsColor(crosshairsColor.value);
    settings.set_showGrid(false);
    settings.set_showEquatorialGridText(true);

    const control = WWTControl.singleton;
    const renderContext = control.renderContext;
    control.renderOneFrame();
    control.renderOneFrame = renderOneFrame.bind(control);

    const { setVisible: setRomanTextVisible } = createTextOverlay({
      store,
      renderContext,
      text: "Roman",
      center: Coordinates.raDecTo3d(-0.001, 0.4),
      color: "#ff1900",
    });
    const { setVisible: setHubbleTextVisible } = createTextOverlay({
      store,
      renderContext,
      text: "Hubble",
      center: Coordinates.raDecTo3d(-0.01, -0.3),
      color: "#e100ff",
      scale: 0.0005,
    });
    const { setVisible: setJWSTTextVisible } = createTextOverlay({
      store,
      renderContext,
      text: "JWST",
      center: Coordinates.raDecTo3d(0.01, -0.3),
      color: "#002aff",
      scale: 0.0005,
    });

    textVisibilitySetters[roman.id] = setRomanTextVisible;
    textVisibilitySetters[hubble.id] = setHubbleTextVisible;
    textVisibilitySetters[jwst.id] = setJWSTTextVisible;

    const cameraParams = { ...props.initialCameraParams };
    const query = new URLSearchParams(window.location.search);

    const paramNames: Record<string, keyof CameraParams> = {
      raDeg: "raRad",
      decDeg: "decRad",
      zoomDeg: "zoomDeg",
      rollDeg: "rollRad",
    };
    for (const [queryParam, cameraParam] of Object.entries(paramNames)) {
      const valueString = query.get(queryParam);
      if (valueString == null) {
        continue;
      }
      const value = parseFloat(valueString);
      if (!isNaN(value)) {
        const factor = queryParam === "zoomDeg" ? 1 : D2R;
        cameraParams[cameraParam] = value * factor;
      }
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // control._drawCrosshairs = (_renderContext: RenderContext) => {
    //   drawFootprint(WWTControl.singleton, {
    //     id: "footprint",
    //     footprint: romanFootprint,
    //     color: Color.fromArgb(255, 255, 0, 0),
    //     fill: true,
    //     opacity: 1,
    //     fillOpacity: 0.7,
    //     linewidth: 4,
    //     show: true,
    //   });
    // };
    //  store.applySetting(["showCrosshairs", true]);

    store.addFrameCallback(_si => {
      footprints.forEach((footprint) => footprint.draw(WWTControl.singleton));
    });
    WWTControl.singleton.renderOneFrame();

    store
      .gotoRADecZoom({
        ...cameraParams,
        instant: true,
      })
      .then(() => (positionSet.value = true));

    // the default set is WWT's built-in imagery, bg.wtml adds two HiPS surveys
    await store
      .loadImageCollection({ url: "bg.wtml", loadChildFolders: false })
      .then((_folder) => {
        backgroundImagesets.push(
          new BackgroundImageset(
            "unWISE",
            "unWISE color, from W2 and W1 bands",
          ),
        );
        backgroundImagesets.push(new BackgroundImageset("SDSS", "SDSS9 color"));
      });

    const bgName = query.get("bg") ?? "Optical (Terapixel DSS)";
    let backgroundName: string | null = null;
    if (bgName) {
      const bgSet = backgroundImagesets.find((bg) => bg.displayName === bgName);
      if (bgSet) {
        backgroundName = bgSet.imagesetName;
      }
    }
    if (backgroundName) {
      backgroundImagesetName.value = backgroundName;
    }

    const url = new URL(window.location.href);
    url.search = "";
    // persist the tour and step in the URL for now. We don't update it dynamically, but
    // this is useful in development for refreshing and returning to a tour step.
    const searchParams = new URLSearchParams(url.search);
    if (tourParam) {
      searchParams.set("tour", tourParam);
    }
    if (tourStepParam) {
      searchParams.set("tourStep", (tourStepParam + 1).toString());
    }
    url.search = searchParams.toString();
    window.history.replaceState({}, document.title, url.toString());
    console.error("NOTE: clear the search params for production use");

    // createTableLayer needs the engine up, so build the catalog here
    // m31Catalog.createLayer();

    // If there are layers to set up, do that here!
    layersLoaded.value = true;

    if (tourParam === "manual") {
      const tour = tours.find((t) => t.id === lastTourId.value) ?? tours[0];
      await tour.wtml.ready; // enterExplore runs step -1, which needs layers
      enterExplore();
    } else if (tourParam !== null) {
      const tour = tours.find((t) => t.id === tourParam) ?? tours[0];
      await tour.wtml.ready; // the step needs its layers
      selectPlace(tour.id, tourStepParam || 0);
    }

    // showInfoDialog.value = autoOpenInfoDialog.value;
  });
});

const ready = computed(() => layersLoaded.value && positionSet.value);

/* `isLoading` is a bit redundant here, but it could potentially have independent logic */
const isLoading = computed(() => !ready.value);

/* Properties related to device/screen characteristics */
const smallSize = computed(() => smAndDown.value);

/* This lets us inject component data into element CSS */
const cssVars = computed(() => {
  return {
    "--accent-color": accentColor.value,
    "--background-color-darkest": backgroundColorDarkest.value,
    "--background-color": backgroundColor.value,
    "--border-color": borderColor.value,
    "--text-color": textColor.value,
    "--accent-color-2": roman.color,
  };
});

const showOptions = ref(false);
/**
  Computed flags that control whether the relevant dialogs display.
  The `sheet` data member stores which sheet is open, so these are just
  computed wrappers around modifying/querying that which can be used as
  dialog v-model values
*/

const showVideoSheet = computed({
  get() {
    return sheet.value === "video";
  },
  set(value: boolean) {
    selectSheet("video");
    if (!value) {
      const video = document.querySelector("#info-video") as HTMLVideoElement;
      video.pause();
    }
  },
});

function selectSheet(sheetType: SheetType | null) {
  if (sheet.value === sheetType) {
    sheet.value = null;
    nextTick(() => {
      blurActiveElement();
    });
  } else {
    sheet.value = sheetType;
  }
}

let timeout: ReturnType<typeof setTimeout> | null = null;
let clickCount = 0;
const DOUBLE_CLICK_INTERVAL_MS = 200;
function handlePositionGoToClick(isActive: Ref<boolean>) {
  clickCount += 1;
  if (timeout != null) {
    clearTimeout(timeout);
  }
  if (clickCount > 1) {
    tryGoToSearchPosition(isActive, true);
    clickCount = 0;
    return;
  }
  timeout = setTimeout(() => {
    tryGoToSearchPosition(isActive, false);
    clickCount = 0;
  }, DOUBLE_CLICK_INTERVAL_MS);
}

function parseRA(data: string): number {
  const lower = data.toLowerCase();
  let hours = false;
  if (["h", ":", " "].some((c) => lower.indexOf(c) !== -1)) {
    hours = lower.indexOf("d") === -1; // so 14d 23m would pass the above check because of the space, but 'd' means degree
  }
  let ra = Coordinates.parse(lower);
  if (hours && ra <= 24) {
    ra *= 15;
  }
  return ra;
}

function tryGoToSearchPosition(
  menuOpen: Ref<boolean>,
  instant: boolean = false,
) {
  positionSearchError.value = null;
  console.log(
    "Searching for RA:",
    positionSearchRA.value,
    "Dec:",
    positionSearchDec.value,
  );
  const ra = parseRA(positionSearchRA.value ?? "");
  const dec = Coordinates.parseDec(positionSearchDec.value ?? "");

  const raValid = !isNaN(ra);
  const decValid = !isNaN(dec);
  console.log("Parsed RA:", ra, "Dec:", dec, "Valid:", raValid, decValid);
  if (raValid && decValid) {
    store.gotoRADecZoom({
      raRad: ra * D2R,
      decRad: dec * D2R,
      zoomDeg: 20,
      instant,
    });
    menuOpen.value = false;
    return;
  }

  const invalid: string[] = [];
  if (!raValid) {
    invalid.push("right ascension");
  }
  if (!decValid) {
    invalid.push("declination");
  }

  const multiple = invalid.length > 1;
  const isAre = multiple ? "are" : "is";
  positionSearchError.value = `Your value${multiple ? "s" : ""} for ${invalid.join(" and ")} ${isAre} invalid`;
}

function shareURL(): string {
  const url = new URL(window.location.href);
  const bgSet = backgroundImagesets.find(
    (bg) => bg.imagesetName === backgroundImagesetName.value,
  );
  let search = `raDeg=${store.raRad * R2D}&decDeg=${store.decRad * R2D}&zoomDeg=${store.zoomDeg}&rollDeg=${store.rollRad * R2D}`;
  if (bgSet) {
    search = `${search}&bg=${bgSet.displayName}`;
  }
  url.search = search;
  return url.href;
}

function copyURLToClipboard() {
  navigator.clipboard
    .writeText(shareURL())
    .then(() => {
      snackbarColor.value = "success";
      snackbarMessage.value = "Shareable URL copied to clipboard";
      snackbar.value = true;
    })
    .catch((_err) => {
      snackbarColor.value = "error";
      snackbarMessage.value = "Failed to copy share URL to clipboard";
      snackbar.value = true;
    });
}

watch(galactic, (gal: boolean) => {
  const raRad = store.raRad;
  const decRad = store.decRad;
  settings.set_galacticMode(gal);
  store.gotoRADecZoom({
    raRad,
    decRad,
    zoomDeg: store.zoomDeg,
    instant: true,
  });
});
watch(crosshairs, (show: boolean) => settings.set_showCrosshairs(show));
watch(crosshairsColor, (color: string) => settings.set_crosshairsColor(color));

function handleResolved(object: ResolvedObject) {
  const { raDeg, decDeg } = object;
  console.log("Received", object);
  if (raDeg && decDeg) {
    positionSearchRA.value = raDeg.toFixed(7);
    positionSearchDec.value = decDeg.toFixed(7);
  }
  handlePositionGoToClick(ref(true));
}



watch(autoOpenInfoDialog, (open: boolean) => {
  window.localStorage.setItem(AUTO_SHOW_INFO_KEY, open.toString());
});
</script>

<style lang="less">
@import url("https://fonts.googleapis.com/css2?family=Source+Sans+3:ital,wght@0,200..900;1,200..900&display=swap");

@font-face {
  font-family: "Highway Gothic Narrow";
  src: url("./assets/HighwayGothicNarrow.ttf");
}

:root {
  --default-font-size: clamp(0.7rem, min(1.7vh, 1.7vw), 1.1rem);
  --default-line-height: clamp(1rem, min(2.2vh, 2.2vw), 1.6rem);

  --accent-color: #c77fb3;
  --background-color-darkest: #502752;
  --background-color: #632b7d;
  --border-color: #b8a5d4;
  --text-color: #f5f0ff;
  overscroll-behavior: none;
}

html {
  height: 100%;
  margin: 0;
  padding: 0;
  background-color: #000;
  overflow: hidden;

  -ms-overflow-style: none;
  scrollbar-width: none;
}

body {
  position: fixed;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;

  font-family: "Source Sans 3", Helvetica, sans-serif;
  font-weight: regular;
}

// #app is a flex, but the direct parent is .v-application__wrap, which sizes
// to its children, so height definitions go here. `row` keeps #side-drawer on
// the right (it follows #main-content in the DOM), `row-reverse` puts it left.
// Scoped under #app to beat Vuetify's own .v-application__wrap rule: a bare
// selector ties on specificity, and in dev Vuetify's styles are injected last
// (main.ts imports RomanFov.vue before plugins/vuetify), so it would lose.
#app > .v-application__wrap {
  flex-direction: row;
  max-height: 100svh;
}

#app.app-is-small > .v-application__wrap {
  flex-direction: column; // side panel becomes a bottom panel
  max-height: 100svh;

  #side-drawer {
    order: 1;
  }
}

#main-content {
  // containing block for the absolutely positioned WWT host and overlay
  position: relative;
  display: block;
  // grow into the space #side-drawer doesn't take, but stay shrinkable
  flex: 1 1 auto;
  min-width: 0;
  min-height: 0;
  overflow: hidden;

  transition: height 0.1s ease-in-out;
}

// a flex sibling of #main-content, so opening it shrinks the WWT view
#side-drawer {
  flex: 0 0 auto;
  overflow: hidden;
  width: 0;
  order: -1;

  &.side-drawer-open {
    width: 34%;
  }
}

#app.app-is-small {
  #side-drawer {
    flex: 0 0 auto;
    overflow: hidden;
    width: 100%;
    height: 0;

    &.side-drawer-open {
      height: 34%;
    }
  }

  // the drawer is wide and short here, so the columns fit side by side
  #tour-controls {
    flex-direction: row;
  }
}

#app {
  width: 100%;
  height: 100%;
  margin: 0;
  overflow: hidden;
  font-size: 11pt;

  // inset: 0 fills #main-content and resizes with it, no explicit w/h needed
  .wwtelescope-component {
    position: absolute;
    inset: 0;
    border-style: none;
    border-width: 0;
    margin: 0;
    padding: 0;

    // filter: brightness(2)
  }
}

// positioned against #main-content, not the viewport. out of flow, but its
// children lay out with normal flex inside it
#wwt-overlay {
  position: absolute;
  inset: 0;
  padding: 1rem;
  padding-bottom: 0.5rem;
  pointer-events: none;

  display: flex;
  flex-direction: column;
  justify-content: space-between; // pushes top and bottom content apart
}

#wwt-overlay > * > * {
  // pointer-events: auto;
  // outline: 1px solid orange;  // debug
  // background-color: rgba(164, 34, 34, 0.5);
}

#shadow {
  width: 100%;
  height: 100%;
  pointer-events: none;
  position: static;
  opacity: 0;
}

#top-content {
  width: 100%; // 100% of the overlay less its padding
  pointer-events: none;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 10px;
  align-items: flex-start;
  // Take the height #bottom-content doesn't, so tall children (the gallery)
  // fill the gap and scroll internally instead of pushing it off screen.
  // min-height: 0 lets those children shrink below their content height.
  flex: 1 1 auto;
  min-height: 0;
}

#left-buttons {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  // Override the grid's align-items: flex-start for this column only, so the
  // options panel has a definite height to shrink against; min-height: 0 lets
  // it shrink. Without this the column is content-height and the panel just
  // runs off the bottom of the screen.
  align-self: stretch;
  min-height: 0;
}

// #top-content is pointer-events: none so drags fall through to WWT, so the
// buttons have to switch it back on for themselves. The block is only as tall
// as the buttons, so nothing invisible is left over to swallow those drags.
#tour-options {
  pointer-events: auto;
  flex: 0 0 auto;
  // #left-buttons aligns to flex-start, so the block is content-width without
  // this; the cap keeps a long label from running across the sky.
  width: 100%;
  max-width: 240px;

  .tour-option {
    // Let a long label wrap instead of forcing the column wider.
    height: auto;
    min-height: 36px;
    padding-block: 0.4rem;
    text-transform: none;
    letter-spacing: normal;

    .v-btn__content {
      white-space: normal;
      text-align: left;
    }
  }
}

#center-content {
  display: flex;
  justify-content: center;
  min-width: 0;
}

#right-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: flex-end;
  // Override the grid's align-items: flex-start for this column only, so the
  // gallery has a definite height to fill; min-height: 0 lets it shrink.
  align-self: stretch;
  min-height: 0;

  .icon-wrapper {
    min-width: 50px;
    border-radius: 10px;
  }

  // #wwt-overlay and #top-content are pointer-events: none so drags pass
  // through to WWT, so it has to be re-enabled on the gallery or it can't be
  // clicked. The gallery is only as tall as its content (one line when closed),
  // so nothing invisible is left over to swallow drags on WWT.
  .wtml-gallery {
    pointer-events: auto;
  }
}

#body-logos {
  #logo-credits img {
    height: 32px !important;
  }

  @media (max-height: 599px) {
    img {
      display: none;
    }
  }
}

// From Sara Soueidan (https://www.sarasoueidan.com/blog/focus-indicators/) & Erik Kroes (https://www.erikkroes.nl/blog/the-universal-focus-state/)
// checkbox will only get oreo styling when user tabs by keyboard.
:focus-visible,
.v-checkbox .v-selection-control__input:has(:focus-visible) {
  outline: 9px double white;
  box-shadow: 0 0 0 6px black;
  border-radius: 0.125rem;
}

// Reduce focus indicator for text input fields only (they have their own built-in indicators)
.v-text-field input:focus-visible {
  outline: none !important;
  box-shadow: none !important;
}

.video-wrapper {
  height: 100%;
  background: black;
  text-align: center;
  z-index: 1000;

  #video-close-icon {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 15;

    &:hover {
      cursor: pointer;
    }

    &:focus {
      color: white;
      border: 2px solid white;
    }
  }
}

video {
  height: 100%;
  width: auto;
  max-width: 100%;
  object-fit: contain;
}

#info-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  max-width: 100%;
  overflow: hidden;
  padding: 0px;
  z-index: 10;
}

.close-icon {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 15;

  &:hover {
    cursor: pointer;
  }

  &:focus {
    color: white;
    border: 2px solid white;
  }
}

.bullet-icon {
  color: var(--border-color);
  width: 1.2em;
  padding-right: 0.5em;
}

// The info sheet is now laid out by #side-drawer's flex sizing, and its
// internal styling comes from InformationSheet.vue.

#bg-select {
  pointer-events: auto;

  &:hover {
    color: var(--accent-color);
    cursor: pointer;
  }
}


#coordinates {
  .coordinates-content {
    display: flex;
    flex-wrap: wrap;
    column-gap: 1rem;
    row-gap: 0.25rem;
    font-family: monospace;
    justify-content: center;
  }

  .coordinate-item {
    white-space: nowrap;
  }
}

.bordered {
  border: 1px solid #bbbbbb;
  padding-inline: 2px;
  border-radius: 4px;
}

.centered-content {
  display: flex;
  align-items: center;
  gap: 10px;
}

#bottom-content {
  width: 100%;
  pointer-events: auto;
  display: flex;
  flex-direction: column;
}

#position-layout {
  font-family: monospace;
}

#position-form {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 1rem;
  flex-grow: 1;
}

.position-label {
  font-size: 0.9em;
  font-weight: bold;
  width: fit-content;
  white-space: nowrap;
  padding-top: 0.6rem;
}

#options {
  background: black;
  border: 1px solid var(--border-color);
  border-radius: 0.75em;
  pointer-events: auto;

  flex: 0 1 auto;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .icon-wrapper {
    border: none;
  }

  #options-top-row {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    // Stays put while the settings below it scroll, so the close button and
    // background picker are always reachable.
    flex: 0 0 auto;
  }

  #options-content {
    padding-inline: 5px;
    padding-bottom: 5px;

    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
    min-height: 0;
  }

  #options-scroll {
    flex: 1 1 auto;
    min-height: 0;
    overflow-y: auto;
  }

  input[type="checkbox"] {
    color: var(--border-color);
  }
}

.error-dialog {
  width: auto;
  height: auto;
  max-width: 425px;
  border-radius: 10px;
}

.error-message {
  padding: 1rem;
  border: 1px solid var(--accent-color);
  text-align: center;
  border-radius: 10px;
}

// Out of flow so a growing credit list doesn't push the step controls up.
// Positioned against #wwt-overlay, whose padding box it has to inset itself from.
#body-logos {
  position: absolute;
  inset: auto 1rem 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

// The overlay is a fixed-height flex column. #top-content has to be the one
// that gives, or a tall gallery pushes the footer past the bottom edge.
#top-content {
  flex: 1 1 auto;
  min-height: 0;
}

#bottom-content {
  flex: 0 0 auto;
  padding-bottom: 3rem; // the space #body-logos no longer takes

  &.no-footer {
    padding-bottom: 0;
  }
}

#tour-controls {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;

  .tour-controls-column {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    flex: 1 1 0;
  }

  .v-icon {
    align-self: flex-start;
    cursor: pointer;
  }
}

#middle-content {
  flex: 0 0 auto;

  // Deliberately not on the container: it spans the full width of the overlay,
  // and an invisible full-width band would swallow drags on the sky.
  .v-btn {
    pointer-events: auto;
  }
}

#startup-screen {
  /* competing with the main wwt-component */
  position: absolute;
  inset: 0;
  z-index: 10;

  // background-image: url("/roman_early_universe.jpg");
  background-image: url("/Trailer_still_1-1.jpg");
  background-size: cover;
  background-position: center;
  filter:grayscale(0.6);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem 1rem;
}

// Not nested under #startup-screen: the same content is slotted into
// SplashScreen on large screens, where that ancestor doesn't exist.
h1.startup-screen-title {
  color: white;
  font-size: 1.25em;
  text-align: center;
  line-height: 1.1;
  margin-bottom: 2rem;
  text-shadow: 0 2px 8px black; //var(--background-color);
}

#startup-screen-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  width: min(100%, 320px);
}

// Fill and contrast text come from the `color` prop, shape from `rounded`.
// Only the casing needs overriding.
.v-btn.startup-button {
  text-transform: none;
  letter-spacing: normal;
  border: 3px solid var(--accent-color);
}

.v-btn {
  pointer-events: auto;
  line-height: 1;
}

#step-control {
  flex: 1 0 auto;
  border: none;
  background: none;
}

.opacity-slider-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
}

.opacity-slider-label {
  font-weight: bold;
  font-size: 0.9em;
  text-align: center;
  color: white;
  background: var(--background-color-darkest);
  border: 1px solid var(--accent-color);
  border-radius: 10px;
  padding: 0.25rem 0.5rem;

  &:hover {
    cursor: pointer;
  }
}
</style>
