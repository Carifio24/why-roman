<template>
  <div
    class="place-cards"
    :style="{
      '--cards-width': width,
      '--cards-accent-color': accentColor,
    }"
  >
    <!-- make a close open button -->
    <button
      v-if="cards.length > 1"
      type="button"
      class="place-card place-card-button place-card--open"
      @click="open = !open"
    >
      <span class="place-card-label">Select a place</span>
      <span
        v-if="open"
        style="margin-left: auto;"
      >▲</span>
      <span
        v-else
        style="margin-left: auto;"
      >▼</span>
    </button>
    <template v-if="open">
      <div
        v-for="card in cards"
        :key="card.id"
        class="place-card"
        :class="{ 'place-card--selected': card.id === selected }"
      >
        <ImagesetPreview
          v-if="card.imageset"
          :imageset="card.imageset"
          :zoom="zoom"
          :aspect-ratio="aspectRatio"
        />
        <!-- no imagery to preview until the card's WTML has loaded -->
        <div
          v-else
          class="place-card-placeholder"
        ></div>
        <span class="place-card-label">{{ card.label }}</span>
        <div class="place-card-actions">
          <v-btn
            class="place-card-action"
            :color="accentColor"
            variant="outlined"
            density="compact"
            size="small"
            rounded="lg"
            :disabled="card.disabled"
            @click="emit('select', card.id)"
          >
            Start tour
          </v-btn>
          <v-btn
            class="place-card-action"
            :color="accentColor"
            variant="outlined"
            density="compact"
            size="small"
            rounded="lg"
            :disabled="card.disabled"
            @click="emit('goTo', card.id)"
          >
            Go to
          </v-btn>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">

import type { Imageset } from "@wwtelescope/engine";
import ImagesetPreview from "./ImagesetPreview.vue";

const open = defineModel<boolean>({default: true});

export interface PlaceCard {
  id: string;
  label: string;
  imageset?: Imageset | null;
  disabled?: boolean;
}

interface Props {
  cards: PlaceCard[];
  selected?: string | null; // id of the card currently showing
  zoom?: number; // crop the black border on level-0 previews, see ImagesetPreview
  width?: string;
  accentColor?: string;
  aspectRatio?: number;
}

withDefaults(defineProps<Props>(), {
  selected: null,
  zoom: 1,
  width: "200px",
  accentColor: "currentColor",
  aspectRatio: 1,
});

const emit = defineEmits<{
  select: [id: string]; // start this place's tour
  goTo: [id: string]; // show this place without starting its tour
}>();
</script>

<style scoped>
.place-cards {
  width: var(--cards-width);
  pointer-events: auto;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  /* height: 100%; */
  height: fit-content;
  min-height: 0;
  overflow-y: auto;
  user-select: none;
  position: relative;
}

.place-card {
  padding: 0.25rem;
  border: 1px solid transparent;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
}

.place-card-button {
  cursor: pointer;
  border: 1px solid white;
  display: flex;
  /* off the prop rather than 100%, which resolves against a content box that
     narrows when the scrollbar shows up */
  width: var(--cards-width);
  box-sizing: border-box;
  padding-inline: 1em;
  align-items: center;
  z-index: 100;
  background: rgba(0, 0, 0, 0.5);

  /* sticks to the top of .place-cards, the scrolling ancestor. flex-shrink
     keeps the column from squashing it as the list overflows */
  position: sticky;
  top: 0;
  flex-shrink: 0;
}

.place-card-button:hover {
  background: rgba(255, 255, 255, 0.50);
}

.place-card--selected {
  border-color: var(--cards-accent-color);
}

.place-card-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 0.25rem;
}

.place-card-action {
  /* flex: 1 1 0; */
  text-transform: none;
  line-height: 1;
}

.place-card-action .v-btn__content {
  line-height: 1;
  /* height: auto; */
  /* min-height: 0px; */
}

.place-card-placeholder {
  aspect-ratio: 1;
  width: 50%;
  margin-inline: auto;
  background: rgb(255 255 255 / 8%);
  border-radius: 2px;
}



.place-card-label {
  display: block;
  padding-block: 0.25rem;
  line-height: 1.25;
  overflow-wrap: anywhere;
}
</style>
