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
      <!-- dismissing the intro is the same as finishing it: the dialog is
           persistent, so this is the only way out besides the buttons -->
      <v-icon
        class="intro-slides-close"
        icon="mdi-close"
        tabindex="0"
        @click="handleFinalNext"
        @keyup.enter="handleFinalNext"
      />
      <v-window
        v-model="window"
        class="intro-slides pa-2"
      >
        <v-window-item
          class="intro-slides-window-item"
          :value="0"
        >
          <div :class="['intro-slide-body', sideBySide ? 'intro-slide-body-split' : '']">
            <div class="intro-slide-text">
              <p>
                On August 30, 2026, NASA and SpaceX will launch the <strong>Nancy Grace Roman Space Telescope</strong> into orbit.
              </p>
              <p>
                <!-- It will travel to “L2” X miles from Earth, near the James Webb Space Telescope.  -->
                Using the Andromeda Galaxy, let's learn about Roman's capabilities and how they are different from the Hubble and Webb Space Telescopes.
              </p>
            </div>
            <figure class="intro-slide-figure">
              <v-img src="/nancy_grace_roman.jpeg" />
              <figcaption>
                Nancy Grace Roman, NASA's first Chief Astronomer and the &ldquo;Mother of Hubble.&rdquo;
              </figcaption>
            </figure>
          </div>
          <!-- <video loop src="/JWST_L2_Orbit_Animation_HD.webm" /> -->
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
const { smAndDown, width, height } = useDisplay();
const smallSize = computed(() => smAndDown.value);

// On a small screen the dialog is 90vw x 90vh, so in landscape it is wide and
// short -- stacking the picture under the text overflows and crops it. There
// the two sit side by side instead. Elsewhere the dialog is narrow and tall
// (500px wide on desktop), where stacking is the better fit.
const sideBySide = computed(() => smallSize.value && width.value > height.value);



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

/* Two .v-overlay__scrim rules ship in the bundle -- Vuetify's themed one and a
   legacy solid black -- and which of them lands last differs between dev and
   the build, so the scrim was black locally and the themed wash once deployed.
   The id pins the deployed one in both. */
#intro-slides.intro-slides-dialog .v-overlay__scrim {
  background: rgb(var(--v-theme-on-surface));
}
/* Vuetify's own card styling, deliberately: its CSS is emitted twice in the
   production bundle and the second copy lands after this file, so a
   single-class rule here silently lost its background, border and padding once
   built. The elevated card that fell out of that is the look we want, so the
   overrides are gone rather than fighting their way back in with more
   specificity -- which also means dev and the deployed app now agree.

   Dropping `height: 60vh` is what stops the figure's caption being clipped: the
   card sizes to its content instead of to the viewport. */
.intro-slides-container {
  position: relative;
  display: flex;
}

// sits in the card's own corner
.v-icon.intro-slides-close {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  z-index: 1;
  color: var(--text-color);
  cursor: pointer;
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
  // keeps the centred copy clear of the close icon in the card's top corner,
  // which is out of flow and so cannot push the first line along
  padding-inline: 1.5rem;
  font-size: 1.25rem;
  // tighter than the inherited 1.5, so the card stays a reasonable height now
  // that it grows with its content
  line-height: 1.3;
  color: var(--text-color);

  p {
    margin-bottom: 1em;
  }
}

// stacked by default: the dialog is narrow and tall, so the picture reads best
// full width under the text
.intro-slide-body {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-height: 0;
}

// wide and short: text and picture share the row instead, so neither is cropped
.intro-slide-body-split {
  flex-direction: row;
  align-items: center;
  text-align: left;
  gap: 1.25rem;

  .intro-slide-text {
    flex: 1 1 55%;
    min-width: 0;
  }

  .intro-slide-figure {
    flex: 1 1 45%;
    min-width: 0;
  }

  // the paragraphs' bottom margin becomes a gap between columns otherwise
  p:last-child {
    margin-bottom: 0;
  }
}

.intro-slide-figure {
  margin: 0;

  figcaption {
    margin-top: 0.4em;
    font-size: calc(1.2 * var(--default-font-size));
    line-height: 1.3;
    opacity: 0.8;
    text-align: center;
  }
}

// Both of these are qualified by the container to outrank a same-specificity
// rule that lands after this file in the production bundle -- in dev the order
// is the other way round, so they only misbehave once built.

// the toolkit ships a global `.v-card-actions { display: var(--footer-visible) }`
// for its rating dialog; that variable is undefined here, so the declaration is
// invalid and takes Vuetify's `display: flex` down with it, leaving the spacer
// with nothing to push against
.intro-slides-container > .v-card-actions {
  display: flex;
}

// Vuetify emits `.v-btn { border-width: 0 }` twice, the second copy after this
.intro-slides-container .intro-slide-button {
  color: var(--text-color);
  font-size: 1.2rem;
  text-transform: uppercase;
  border: 1px solid var(--accent-color);
}

</style>