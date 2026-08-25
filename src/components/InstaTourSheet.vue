<template>
  <div
    id="insta-tour-text"
    :class="['insta-selected-info', smallSize ? 'insta-selected-info-tall' : '', 'insta-info-box']"
  >
    <div
      v-if="tourId === 'andromeda'"
      class="insta-selected-info-tour"
    >
      <h3>Andromeda</h3>
      <div v-if="step === 0">
        <p>
          The Andromeda Galaxy, our nearest neighboring spiral galaxy is located over 2 million light years away. 
        </p>
        
        <p>
          Visible to the unaided eye as a faint smudge in the constellation of Andromeda, it is spans
          3 degrees, or the width of 6 ful moons, on the night sky. 
        </p>
        
        <p>
          The current view shows an optical image of the galaxy from the Digitized Sky Survey. 
          The data was taken from a 1.2 m telescope at Palomar Observatory. 
        </p>
      </div>
      <div v-if="step === 1">
        <p></p>
      </div>
      <div v-if="step === 2">
        <p></p>
      </div>
      <div v-if="step === 3">
        <p></p>
      </div>
      <div v-if="step === 4">
        <p></p>
      </div>
      <div v-if="step === 4">
        <p></p>
      </div>
    </div>
    <div
      v-if="tourId === 'carina'"
      class="insta-selected-info-tour">
      <h3>Carina</h3>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. 
        Illo eligendi at accusantium, corporis, vitae est dolorem 
        suscipit aut, inventore dignissimos ab! Ipsa ab cupiditate 
        quae voluptas, molestias repudiandae necessitatibus natus!
      </p>
    </div>
    <v-spacer />
    <div class="insta-tour-text-controls">
      <v-btn
        v-if="step > 0"
        variant="flat"
        color="#502752"
        size="small"
        rounded="lg"
        @click="emit('previous')"
      >
        Previous
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
      <v-spacer />
      <v-btn
        v-if="step < totalSteps - 1"
        variant="flat"
        color="#502752"
        size="small"
        rounded="lg"
        @click="emit('next')"
      >
        Next
      </v-btn>
    </div>
    <v-breadcrumbs 
      class="justify-space-evenly"
      :items="items"
      divider=""
    >
      <template #item="{index}"> 
        <button 
          @click="() => emit('step', index)">
          ⬤ 
        </button>
      </template>
    </v-breadcrumbs>
    <v-progress-linear
      :model-value="progress"
      class="mt-2"
      height="6"
      rounded
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
interface Props {
  tourId: string,
  smallSize: boolean,
  step: number,
  totalSteps: number,
  progress: number,
}

const props = defineProps<Props>();
  
// const emit = defineEmits(['previous', 'next', 'leave',]);
const emit = defineEmits<{
  (e: 'previous' | 'next' | 'leave'): void;
  (e: 'step', index: number): void;
}>();

const items = computed(() => {
  return Array.from({ length: props.totalSteps }).map((_, index) => ({
    title: '',
    disabled: index !== props.step,
  }));
});

</script>

<style lang="less">

#insta-tour-text {
  position: absolute;
  width: 30%;
  top: 1rem;
  right: 1rem;
  height: 300px;
  max-height: 40vh;
  
}

.insta-info-box {
  font-size: 0.9rem;
  color: white;
  background: rgba(10, 5, 21, 0.7);
  border: 1px solid;
  border-radius: 5px;
  padding: 0.5rem;
  pointer-events: auto;
  border-color: var(--border-color);
  // width: 100%;
}

// Copied from rubin-first-look. Positions the floating tour text against
// #wwt-overlay, in the corner the place cards vacate during a tour.
.insta-selected-info {
  position: relative;
  padding: 10px;
  // max-width: 30%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.insta-selected-info.insta-selected-info-tall {
  // max-width: 60%;
  // top: 20px;
}

.insta-tour-text-controls {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  margin-top: 0.5rem;
}

</style>
