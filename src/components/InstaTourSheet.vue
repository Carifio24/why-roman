<template>
  <div
    id="insta-tour-text"
    :class="['insta-selected-info', smallSize ? 'insta-selected-info-tall' : '', 'insta-info-box']"
  >
    <div
      v-if="currentStep?.instaText"
      class="insta-selected-info-tour"
    >
      <span v-html="currentStep.instaText" />
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
}

const props = defineProps<Props>();

const currentStep = computed(() => tourExperiences[props.tourId]?.[props.step]);

</script>

<style lang="less">

#insta-tour-text {
  position: absolute;
  width: 90%;
  top: 0.5rem;
  right: 1rem;
  height: auto;
  max-height: 40vh;
  
}

.insta-info-box {
  font-size: calc(2.5 * var(--default-font-size));
  font-weight: bold;
  // use Impact font
  font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
  line-height: 1.2;
  color: white;
  background: rgba(10, 5, 21, 0);
  text-shadow: 0px 0px 10px black, 0px 0px 10px black, 0px 0px 10px black;
  padding: 0.5rem;
  pointer-events: none;
  text-align: right;
  // width: 100%;
}


</style>
