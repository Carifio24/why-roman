<template>
  <v-snackbar
    v-model="show"
    class="gesture-preview-overlay"
    :content-class="['gesture-preview', smallScreen ? 'small' : '']"
    rounded="large"
    :timeout="6000000"
    location="bottom left"
    attach="#main-content"
    contained
    close-on-content-click
    :min-width="0"
  >
    <template #text>
      <div :class="['gesture-preview-container', smallScreen ? 'my-1 small' : 'my-2']">
        <div class="gesture-icon">
          <div class="gesture-icon__icon">
            <v-icon :size="iconSize">
              {{ touchscreen ? 'mdi-gesture-swipe' : 'mdi-cursor-move' }}
            </v-icon>
          </div>
          <div class="gesture-icon__label">
            PAN
          </div>
        </div>
        <span class="gesture-and">&</span>
        <div class="gesture-icon">
          <div class="gesture-icon__icon">
            <v-icon
              v-if="touchscreen"
              :size="iconSize"
            >
              mdi-gesture-pinch
            </v-icon>
            <div
              v-else
              class="two-icons"
            >
              <v-icon
                :size="iconSize"
              >
                mdi-minus-box-outline
              </v-icon>
              <v-icon
                :size="iconSize"
              >
                mdi-plus-box-outline
              </v-icon>
            </div>
          </div>
          <div class="gesture-icon__label">
            ZOOM
          </div>
        </div>
        <span class="gesture-explore">to explore</span>
      </div>
    </template>
    <template
      #actions
    >
      <v-btn
        class="mx-2"
        density="comfortable"
        rounded="lg"
        text="Close"
        variant="tonal"
        @click.stop="handleClose"
        @keyup.enter.stop="handleClose"
      ></v-btn>
    </template>
  </v-snackbar>
</template>


<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { supportsTouchscreen } from '@cosmicds/vue-toolkit';
const touchscreen = supportsTouchscreen();
// const iconSize = ref('large');
import { useDisplay } from 'vuetify';
const show = defineModel<boolean>({default: true});
const smallScreen = useDisplay().smAndDown;
const iconSize = ref(smallScreen.value ? 'small' : 'large');

const props = defineProps({
  closeOnClick: {
    type: Boolean,
    default: true,
  }, 
});
const hide = () => show.value = false;

onMounted(() => {
  console.log('showing gesture preview');
  if (props.closeOnClick) {
    setTimeout(() => {
      window.addEventListener('pointerdown', hide, { once: true });
    }, 0);
  }
});

const emit = defineEmits(['close']);
const handleClose = () => {
  show.value = false;
  emit('close');
};

onUnmounted(() => {
  window.removeEventListener('pointerdown', hide);
});
</script>


<style>
.v-overlay.gesture-preview-overlay {
  margin: 0;
  padding: 0 0 1rem 1rem;
}

.v-overlay__content.v-snackbar__wrapper.v-snackbar--variant-elevated.gesture-preview {
  border: 1px solid var(--accent-color);
  padding-inline: 0.75em;
  background-color: #502752ee;
  color: white;
}
.gesture-preview.small {
  padding-block: 0.5em;
}
.gesture-preview .v-snackbar__content {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}


.gesture-preview-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: fit-content;
  gap: 2em;
  font-size: 1.25em;
}

.gesture-preview-container.small {
  gap: 1.5em;
  font-size: 1em;
  margin: 0;
  padding: 0;
}

.gesture-icon {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5em;
  /* font-size: 1.5rem; */
}

.gesture-icon__label {
  font-size: 0.8em;
}

.gesture-and {
  font-size: 1em;
  margin-inline: -0.5em;
}

.gesture-explore {
  /* width: fit-content; */
  font-size: 0.9em;
  margin-left: -0.5em;
}

.two-icons {
  display: flex;
  flex-direction: row;
  gap: 4px;
}
</style>
