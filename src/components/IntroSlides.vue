<template>
  <v-dialog
    id="intro-slides"
    v-model="open"
    class="intro-slides-dialog"
    :width="smallSize ? '90vw' : 500"
    :max-width="smallSize ? '90vw' : '50vw'"
    :height="smallSize ? '90vh' : undefined"
    :persistent="true"
  >
    <v-card :class="['intro-slides-container', smallSize ? 'intro-slides-small' : '']">
      <v-window 
        v-model="window" 
        class="intro-slides pa-2"
      >
        <v-window-item
          class="intro-slides-window-item"
          :value="0"
        >
          <p>
            On August 30, 2026, NASA and SpaceX will launch the Nancy Grace Roman Space Telescope into orbit.
          </p>
          <p>
            <!-- It will travel to “L2” X miles from Earth, near the James Webb Space Telescope.  -->
            Using the Andromeda Galaxy, let's learn about Roman's capabilities and how they are different from the Hubble and Webb Space Telescopes.
          </p>
          <!-- <v-img
            src="/Trailer_still_1-1.jpg"
            aspect-ratio="1"
            height="150px"
            cover
          /> -->
          <!-- <video loop src="/JWST_L2_Orbit_Animation_HD.webm" /> -->
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
          Go!
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
import { computed, ref } from 'vue';
import { useDisplay } from 'vuetify';
import type { VBtn } from 'vuetify/components/VBtn';

// the dialog is teleported out of #app, so app-is-small can't reach it
const { smAndDown } = useDisplay();
const smallSize = computed(() => smAndDown.value);



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
const NUM_SLIDES = 1;
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
  padding: 1.7rem;
}

.intro-slides-container.intro-slides-small {
  height: 100%;
  min-height: 0;
  padding: 0.75rem;

  .intro-slides-window-item {
    font-size: 1.1rem;
  }

  .intro-slide-button {
    font-size: 1rem;
  }
}

.intro-slides {
  position: relative;
}
.intro-slides-window-item {
  text-align: center;
  font-size: 1.5rem;
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