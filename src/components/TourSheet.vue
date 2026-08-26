<template>
  <div
    id="tour-text"
    :class="['selected-info', smallSize ? 'selected-info-tall' : '', 'info-box']"
  >
    <!-- fill either slot to replace the step's own content, so callers can put
     something else in this box without passing it all in as props -->
    <div class="selected-info-scroll">
      <slot>
        <div
          v-if="currentStep"
          class="selected-info-tour"
        >
          <h3 v-if="currentStep.title">
            {{ currentStep.title }}
          </h3>
          <p
            v-for="(paragraph, i) in currentStep.tourSheetText"
            :key="i"
          >
            <span v-html="simpleMarkdownParse(paragraph)" />
          </p>
        </div>
      </slot>
    </div>
    <slot name="controls">
      <div class="tour-text-controls">
        <v-btn
          :class="{ 
            'tour-back-button-hidden': step === 0 && !showBackOnFirstStep,
            'px-2': smallSize,
            'mr-1': smallSize,
          }"
          variant="flat"
          :density="smallSize ? 'compact' : 'default'"
          color="#502752"
          @click="emit('previous')"
        >
          {{ backText }}
        </v-btn>

        <!-- <v-btn
        variant="flat"
        color="#502752"
        size="small"
        rounded="lg"
        @click="emit('leave')"
      >
        Leave Tour
      </v-btn> -->
        <v-breadcrumbs
          v-if="showBreadcrumbs"
          class="tour-dots"
          :items="items"
          divider=""
        >
          <template #item="{index}">
            <!-- get rid of {{  index +1 }} for production -->
            <button
              class="tour-dot"
              :class="{ 'tour-dot-active': index === step }"
              @click="() => emit('step', index)"
            >
              ⬤
            </button>
          </template>
        </v-breadcrumbs>
        <v-spacer v-else />
        <v-btn
          v-if="step < totalSteps - (showNextOnLastStep ? 0 : 1)"
          :class="{ 
            'px-2': smallSize,
            'ml-1': smallSize
          }"
          variant="flat"
          color="#502752"
          :density="smallSize ? 'compact' : 'default'"
          @click="emit('next')"
        >
          {{ nextText }}
        </v-btn>
      </div>
    </slot>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { tourExperiences } from '../experiences';
interface Props {
  tourId: string,
  smallSize: boolean,
  step: number,
  /** the step dots. off once the tour is done stepping */
  showBreadcrumbs?: boolean,
  showNextOnLastStep?: boolean,
  showBackOnFirstStep?: boolean,
  nextText?: string,  
  backText?: string,
}

const props = withDefaults(defineProps<Props>(), {
  showBreadcrumbs: true,
  showNextOnLastStep: false,
  showBackOnFirstStep: false,
  nextText: 'Next',
  backText: 'Back',
});

// const emit = defineEmits(['previous', 'next', 'leave',]);
const emit = defineEmits<{
  (e: 'previous' | 'next' | 'leave'): void;
  (e: 'step', index: number): void;
}>();

const currentStep = computed(() => tourExperiences[props.tourId]?.[props.step]);
const totalSteps = computed(() => tourExperiences[props.tourId]?.length ?? 0);

const items = computed(() => {
  return Array.from({ length: totalSteps.value }).map((_, index) => ({
    title: '',
    disabled: index !== props.step,
  }));
});


function simpleMarkdownParse(text: string): string {
  // get ** wrapped text and replace with <strong> tags
  const boldPattern = /\*\*(.*?)\*\*/g;
  const boldReplaced = text.replace(boldPattern, '<strong>$1</strong>');
  // get * wrapped text and replace with <em> tags
  const italicPattern = /\*(.*?)\*/g;
  const italicReplaced = boldReplaced.replace(italicPattern, '<em>$1</em>');
  return italicReplaced;
  
}

</script>

<style lang="less">

p {
  margin-top: 0.5rem;
}

// Sizes text off the box's own dimensions (--container-width/-height, set per
// layout on #side-drawer-tour-sheet in RomanFov.vue) instead of the raw
// viewport, so it scales with how much room TourSheet actually has rather than
// the whole screen. Averages width and height rather than picking either
// extreme: the large-portrait column is narrow but full height, the portrait
// bottom panel is wide but short, and the landscape box is narrow and short --
// sizing off only the generous dimension overflows the tight one, and off only
// the tight one looks needlessly small.
#tour-text {
  font-size: clamp(
    1rem,
    calc(0.025 * (var(--container-width) + var(--container-height))),
    2rem
  );
}

// the landscape box is the short floating one (~50vh), so a step with a full
// paragraph needs tighter spacing to fit
#app.app-is-landscape #tour-text p {
  margin-top: 0.25rem;
}

#tour-text {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  min-height: 0;
  height: auto;
  overflow-y: auto;
}

.info-box {
  font-size: calc(1.5 * var(--default-font-size));
  color: white;
  background: rgba(10, 5, 21, 0.7);
  border: 2px solid;
  border-radius: 5px;
  padding: 0.5rem;
  margin: 0.25rem;
  pointer-events: auto;
  border-color: var(--border-color);
  // width: 100%;
  height: calc(100% - 0.5rem);
}

// Copied from rubin-first-look. Positions the floating tour text against
// #wwt-overlay, in the corner the place cards vacate during a tour.
// Sizing lives on #tour-text; this is just the box itself.
.selected-info {
  position: relative;
  padding: 10px;
  // max-width: 30%;
  align-items: flex-start;
}


// the scrollable region: grows to fill whatever space tour-text-controls
// doesn't need, and scrolls on its own so the controls stay visible even
// when a step's text doesn't fit (notably in the large-landscape overlay,
// where the box is a fixed ~34% of the screen height, not full height)
.selected-info-scroll {
  width: 100%;
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
}

.selected-info-scroll {
  flex: 0 1 auto;
}

.tour-text-controls {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  margin-top: 0.5rem;

  .tour-back-button-hidden {
    visibility: hidden;
    pointer-events: none;
  }

  .tour-dots {
    flex: 1 1 0;
    min-width: 0;
    max-width: 14rem;
    margin: 0 auto;
    justify-content: space-evenly;
    padding: 0;

    .v-breadcrumbs-item {
      padding: 0 1px;
    }

    // divider="" still renders the divider items, and their padding is what
    // made the row too wide to fit
    .v-breadcrumbs-divider {
      padding: 0 2px;
    }

    button.tour-dot {
      padding: 0;
      --tour-dot-size: 0.5rem;
      font-size: var(--tour-dot-size);
      line-height: 1;
      color: white;
      background: none;
      border: none;
      cursor: pointer;
    }
    
    button.tour-dot-active {
      color: var(--accent-color);
      --font-delta: 0.25em;
      font-size: calc(var(--tour-dot-size) + var(--font-delta));
      margin: calc(-1*var(--font-delta));
      z-index: 10;
    }
  }
}

// landscape is the short floating box in every size now, so the buttons shrink
// to leave the step's text as much of it as possible
#app.app-is-landscape .tour-text-controls .v-btn {
  --v-btn-size: 0.75rem;
  --v-btn-height: 28px;
  font-size: var(--v-btn-size);
  min-width: 50px;
  padding: 0 12px;
}


</style>
