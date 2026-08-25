<template>
  <div
    id="tour-text"
    :class="['selected-info', smallSize ? 'selected-info-tall' : '', 'info-box']"
  >
    <template v-if="tourId === 'andromeda'">
      <h3>Andromeda</h3>
      <p v-if="step === 0">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. 
        Illo eligendi at accusantium, corporis, vitae est dolorem 
        suscipit aut, inventore dignissimos ab! Ipsa ab cupiditate 
        quae voluptas, molestias repudiandae necessitatibus natus!
      </p>
    </template>
    <template v-if="tourId === 'carina'">
      <h3>Carina</h3>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. 
        Illo eligendi at accusantium, corporis, vitae est dolorem 
        suscipit aut, inventore dignissimos ab! Ipsa ab cupiditate 
        quae voluptas, molestias repudiandae necessitatibus natus!
      </p>
    </template>
    <v-spacer />
    <div class="tour-text-controls">
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
      class="justify-space-between"
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

.info-box {
  font-size: 0.9rem;
  color: white;
  background: rgba(10, 5, 21, 0.7);
  border: 1px solid;
  border-radius: 5px;
  padding: 0.5rem;
  pointer-events: auto;
  border-color: var(--border-color);
  // width: 100%;
  height: 100%;
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
  height: 100%;
}
.selected-info.selected-info-tall {
  // max-width: 60%;
  // top: 20px;
}

.tour-text-controls {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  margin-top: 0.5rem;
}

</style>
