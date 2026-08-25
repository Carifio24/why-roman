<template>
  <v-dialog
    id="intro-slides"
    v-model="open"
    class="intro-slides-dialog"
    :width="500"
    max-width="50vw"
    :persistent="true"
  >
    <v-card class="intro-slides-container">
      <v-window 
        v-model="window" 
        class="intro-slides pa-2"
      >
        <v-window-item
          class="intro-slides-window-item"
          :value="0"
        >
          <p>
            On August 30, 2026, NASA will launch the Nancy Grace Roman Space Telescope into orbit.
          </p>
          <p>
            It will travel to “L2” where the James Webb Space Telescope is already stationed. 
          </p>
          <!-- <v-img
            src="/Trailer_still_1-1.jpg"
            aspect-ratio="1"
            height="150px"
            cover
          /> -->
          <video loop src="/JWST_L2_Orbit_Animation_HD.webm" />
        </v-window-item>
        <v-window-item
          class="intro-slides-window-item"
          :value="1"
        >
          <p>
            You might wonder why NASA needs another space telescope.
          </p>
          <p>
            This interactive app explains why!
          </p>
        </v-window-item>
      </v-window>
      <v-spacer />
      <v-card-actions>
        <v-btn
          v-if="window > 0"
          v-bind="buttonProps"
          @click="window = Math.max(0, window - 1)"
        >
          Previous
        </v-btn>
        <v-spacer />
        <v-btn
          v-if="window < NUM_SLIDES - 1"
          v-bind="buttonProps"
          @click="window = Math.min(NUM_SLIDES, window + 1)"
        >
          Next
        </v-btn>
        <v-btn
          v-else
          v-bind="buttonProps"
          @click="handleFinalNext"
        >
          Next
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { VBtn } from 'vuetify/components/VBtn';



const open = defineModel<boolean>({default: true});
const emit = defineEmits(['close']);

function handleFinalNext() {
  open.value = false;
  emit('close');
}

const buttonProps = {
  class: 'intro-slide-button',
  variant: 'flat',
  size: 'large',
  rounded: '2',
  color: '#632B7D',
  // https://stackoverflow.com/a/68753574/11594175
} as Partial<InstanceType<typeof VBtn>['$props']>;

const window = ref(0);
const NUM_SLIDES = 2;
</script>


<style lang="less">

#intro-slides.intro-slides-dialog .v-overlay__content {
  outline: none !important;
  box-shadow: none !important;
}
.intro-slides-container {
  position: relative;
  height: 60vh;
  min-height: 400px;
  display: flex;
  background-color: rgba(0, 0, 0, 0.9);
  border: 4px solid var(--background-color);
  padding: 2rem;
}

.intro-slides {
  position: relative;
}
.intro-slides-window-item {
  text-align: center;
  font-size: 1.2rem;
  color: var(--text-color);
  
  p {
    margin-bottom: 1em;
  }
}

.intro-slide-button {
  color: var(--text-color);
  font-size: 1.2rem;
  text-transform: none;
  border: 1px solid var(--text-color);
}

</style>