<template>
  <!-- a plain <details> instead of v-expansion-panels: collapsed it's just the
       summary line, and we control the open/closed layout -->
  <details
    class="wtml-gallery"
    :open="open"
    :style="{
      '--gallery-width': width,
      '--gallery-accent-color': accentColor,
    }"
    @toggle="open = ($event.target as HTMLDetailsElement).open"
  >
    <summary class="wtml-gallery-title">
      {{ title }}
    </summary>

    <div class="wtml-gallery-body">
      <!-- keydown.stop: WWT listens for key presses on the document -->
      <v-text-field
        v-model="search"
        class="wtml-gallery-search"
        label="Filter"
        density="compact"
        variant="outlined"
        bg-color="black"
        hide-details
        clearable
        @keydown.stop
      />

      <div class="wtml-gallery-items">
        <div
          v-for="(place, index) in visiblePlaces"
          :key="index"
          class="wtml-gallery-item"
        >
          <!-- slider is a sibling of the button, not inside it. nesting a
               control in a button swallows its clicks -->
          <button
            type="button"
            class="wtml-gallery-item-target"
            @click="emit('select', place, false)"
            @dblclick="emit('select', place, true)"
          >
            <ImagesetPreview
              :imageset="imagesetFor(place)"
              source="thumb"
              :square="square"
              :zoom="1"
            />
            <span>{{ place.get_name() }}</span>
            <v-tooltip
              v-if="descriptionFor(place)"
              activator="parent"
              location="start"
              :open-delay="400"
              max-width="320"
              :text="descriptionFor(place)"
            />
          </button>
          <v-slider
            class="wtml-gallery-opacity"
            :model-value="opacityFor(place)"
            :min="0"
            :max="1"
            :step="0.01"
            density="compact"
            hide-details
            :aria-label="`${place.get_name()} opacity`"
            @update:model-value="setOpacity(place, $event)"
            @keydown.stop
          />
        </div>

        <p
          v-if="visiblePlaces.length === 0"
          class="wtml-gallery-empty"
        >
          No matching images
        </p>
      </div>
    </div>
  </details>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { Place, type Imageset } from "@wwtelescope/engine";
import ImagesetPreview from "./ImagesetPreview.vue";

interface Props {
  places: Place[]; // each place's imageset supplies the preview image
  title?: string;
  source?: "level0" | "thumb"; // which preview image to use, see ImagesetPreview
  square?: boolean; // force previews to 1:1
  zoom?: number; // crop the black border on level-0 tiles, see ImagesetPreview
  width?: string;
  accentColor?: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: "Images",
  source: "level0",
  square: false,
  zoom: 1,
  width: "200px",
  accentColor: "currentColor",
});

const emit = defineEmits<{
  /**
   * The parent decides what selecting a place means. `instant` is set for a
   * double click. A double click fires two single-click events first, so the
   * parent sees two animated selections before this one, and the instant move
   * lands last.
   */
  select: [place: Place, instant: boolean];
  opacity: [place: Place, opacity: number];
}>();

// keyed by the Place itself, since names aren't unique. absent means opaque
const opacities = reactive(new Map<Place, number>());

function opacityFor(place: Place): number {
  return opacities.get(place) ?? 1;
}

function setOpacity(place: Place, opacity: number) {
  opacities.set(place, opacity);
  emit("opacity", place, opacity);
}

// closed by default. the list is tall and it sits over the WWT view
const open = defineModel<boolean>("open", { default: false });

// v-text-field's clear button sets this to null
const search = ref<string | null>("");

const sortedPlaces = computed(() =>
  props.places
  // [...props.places].sort((a, b) =>
  //   a.get_name().localeCompare(b.get_name(), undefined, { sensitivity: "base" }),
  // ),
);

const visiblePlaces = computed(() => {
  const query = (search.value ?? "").trim().toLowerCase();
  if (!query) {
    return sortedPlaces.value;
  }
  return sortedPlaces.value.filter((place) =>
    place.get_name().toLowerCase().includes(query),
  );
});

function imagesetFor(place: Place): Imageset | null {
  return place.get_backgroundImageset() ?? place.get_studyImageset();
}

/**
 * A WTML <Place> can carry a <Description>, but hardly any do (12 of 1349 in
 * the Hubble catalog). Nearly all of them have the imageset's <Credits>, which
 * in practice is the attribution plus a sentence about the image, so fall back
 * to that. An imageset's own <Description> is no use: the engine's WTML parser
 * reads Credits and CreditsUrl off an ImageSet but not Description.
 */
function descriptionFor(place: Place): string {
  const description = place.htmlDescription?.trim();
  if (description) {
    return description;
  }
  return imagesetFor(place)?.get_creditsText()?.trim() ?? "";
}
</script>

<style scoped>
.wtml-gallery {
  width: var(--gallery-width);
  /* shrink to fit the height the layout offers and scroll inside. max-height:
     100% only resolves against a parent with a definite height, flex-shrink
     just needs a parent flex column that overflows. min-height: 0 is what
     allows the shrink, flex items default to min-height: auto */
  flex: 0 1 auto;
  min-height: 0;

  display: flex;
  flex-direction: column;

  background: rgb(0 0 0 / 50%);
  backdrop-filter: blur(5px);
  border: 1px solid var(--gallery-accent-color);
  border-radius: 4px;
  /* keep the blurred background clipped to the rounded border */
  overflow: hidden;
}

.wtml-gallery-title {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  cursor: pointer;
  user-select: none;
  /* replaced by the caret below */
  list-style: none;
}

.wtml-gallery-title::-webkit-details-marker {
  display: none;
}

.wtml-gallery-title::after {
  content: "";
  margin-inline-start: auto;
  width: 0.5em;
  height: 0.5em;
  border-right: 2px solid currentColor;
  border-bottom: 2px solid currentColor;
  transform: translateY(-0.15em) rotate(45deg);
  transition: transform 0.2s ease;
}

.wtml-gallery[open] .wtml-gallery-title::after {
  transform: translateY(0.1em) rotate(-135deg);
}

/* browsers wrap a <details>'s content in this generated box, so the body is not
   a direct flex child. without this the wrapper is an auto-height block and the
   list overflows instead of scrolling. browsers without ::details-content drop
   the rule and get the same layout from .wtml-gallery-body */
.wtml-gallery[open]::details-content {
  flex: 1 1 auto;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.wtml-gallery-body {
  flex: 1 1 auto;
  min-height: 0;
  display: flex;
  flex-direction: column;
  padding: 0 0.75rem 0.75rem;
  gap: 0.5rem;
}

.wtml-gallery-search {
  flex: 0 0 auto;
}

.wtml-gallery-items {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
}

.wtml-gallery-item {
  margin-block-end: 0.75rem;
}

.wtml-gallery-item-target {
  display: block;
  width: 100%;
  cursor: pointer;
  text-align: center;
}

.wtml-gallery-item :deep(.imageset-preview) {
  width: 50%;
  margin-inline: auto;
}

.wtml-gallery-item-target span {
  display: block;
  padding-block: 0.25rem;
  line-height: 1.25;
  overflow-wrap: anywhere;
}

/* inset so the slider thumb doesn't hit the gallery border at either end */
.wtml-gallery-opacity {
  margin-inline: 0.5rem;
}

.wtml-gallery-empty {
  text-align: center;
  padding-block: 0.5rem;
  opacity: 0.7;
}
</style>
