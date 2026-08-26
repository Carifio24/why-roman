<template>
  <div
    id="tour-text"
    :class="['selected-info', smallSize ? 'selected-info-tall' : '', 'info-box']"
  >
    <!-- fill either slot to replace the step's own content, so callers can put
     something else in this box without passing it all in as props -->
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
          {{ paragraph }}
        </p>
      </div>
    </slot>
    <v-spacer />
    <slot name="controls">
      <div class="tour-text-controls">
        <v-btn
          :class="{ 'tour-back-button-hidden': step === 0 }"
          variant="flat"
          color="#502752"
          rounded="lg"
          @click="emit('previous')"
        >
          Back
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
              :class="{ 'tour-dot-active': index === step }"
              @click="() => emit('step', index)"
            >
              ⬤
            </button>
          </template>
        </v-breadcrumbs>
        <v-btn
          v-if="step < totalSteps - 1"
          variant="flat"
          color="#502752"
          rounded="lg"
          @click="emit('next')"
        >
          Next
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
}

const props = withDefaults(defineProps<Props>(), {
  showBreadcrumbs: true,
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

</script>

<style lang="less">

p {
  margin-top: 0.5rem;
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
.selected-info {
  position: relative;
  padding: 10px;
  // max-width: 30%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  height: calc(100% - 0.5rem);
  overflow-y: auto;
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

    button {
      padding: 0;
      font-size: 0.5rem;
      line-height: 1;
      color: white;
      background: none;
      border: none;
      cursor: pointer;
    }
    
    button.tour-dot-active {
      color: var(--accent-color);
      --font-delta: 0.25em;
      font-size: calc(0.5rem + var(--font-delta));
      margin: calc(-1*var(--font-delta));
      z-index: 10;
    }
  }
}

@media (orientation: landscape) {
  .selected-info.selected-info-tall .tour-text-controls .v-btn {
    --v-btn-size: 0.75rem;
    --v-btn-height: 28px;
    font-size: var(--v-btn-size);
    min-width: 50px;
    padding: 0 12px;
  }
}  


</style>
