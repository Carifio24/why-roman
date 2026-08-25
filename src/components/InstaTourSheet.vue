<template>
  <div
    id="insta-tour-text"
    :class="['insta-selected-info', smallSize ? 'insta-selected-info-tall' : '', 'insta-info-box']"
  >
    <div
      v-if="currentStep?.instaText"
      class="insta-selected-info-tour"
    >
      {{ currentStep.instaText }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { tourExperiences } from '../experiences';
interface Props {
  tourId: string,
  smallSize: boolean,
  step: number,
  totalSteps: number,
  progress: number,
}

const props = defineProps<Props>();

const currentStep = computed(() => tourExperiences[props.tourId]?.[props.step]);

</script>

<style lang="less">

#insta-tour-text {
  position: absolute;
  width: 35%;
  top: 1rem;
  right: 1rem;
  height: auto;
  max-height: 40vh;
  
}

.insta-info-box {
  font-size: calc(2 * var(--default-font-size));
  font-weight: bold;
  color: white;
  background: rgba(10, 5, 21, 0.7);
  padding: 0.5rem;
  pointer-events: none;
  text-align: right;
  // width: 100%;
}


</style>
