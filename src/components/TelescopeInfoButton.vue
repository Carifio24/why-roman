<template>
  <!-- click rather than hover: this sits in a panel that is used on phones, and
       the menu teleports out of #app so WWT's document listeners are the ones
       that would otherwise see the keystrokes -->
  <v-menu
    :close-on-content-click="false"
    location="bottom end"
    offset="4"
  >
    <template #activator="{ props: menuProps }">
      <v-btn
        class="telescope-info-button"
        icon="mdi-information-outline"
        variant="text"
        density="compact"
        size="small"
        :aria-label="`About ${info.name}`"
        v-bind="menuProps"
        @keydown="onKeydown"
      />
    </template>

    <v-card
      class="telescope-info-card"
      :style="{ '--fp-color': color }"
      @keydown="onKeydown"
    >
      <h3>{{ info.name }}</h3>

      <dl>
        <template
          v-for="row in rows"
          :key="row.term"
        >
          <dt>{{ row.term }}</dt>
          <dd>{{ row.value }}</dd>
        </template>
      </dl>

      <h4>Science highlights</h4>
      <ul>
        <li
          v-for="(highlight, i) in info.highlights"
          :key="i"
        >
          {{ highlight }}
        </li>
      </ul>
    </v-card>
  </v-menu>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { TelescopeInfo } from "../telescopeInfo";

interface Props {
  info: TelescopeInfo;
  /** the footprint's colour, so the card reads as belonging to that layer */
  color: string;
}

const props = defineProps<Props>();

// WWT listens for keystrokes on the document, so typing here must not reach it
// -- except Escape, which is how the menu closes. Blanket .stop swallowed that
// and left the menu open.
function onKeydown(event: KeyboardEvent) {
  if (event.key !== "Escape") {
    event.stopPropagation();
  }
}

const rows = computed(() => [
  { term: "Launched", value: props.info.launch },
  { term: "Camera", value: props.info.camera },
  { term: "Field of view", value: props.info.fieldOfView },
  { term: "Resolution", value: props.info.resolution },
  { term: "Sees", value: props.info.wavelengths },
]);
</script>

<style scoped>
.telescope-info-button {
  color: white;
  opacity: 0.75;
}

.telescope-info-button:hover,
.telescope-info-button:focus-visible {
  opacity: 1;
}

/* Capped rather than sized: the card is teleported to the body, so it is not
   bound by the drawer it was opened from and would otherwise run the width of
   a desktop screen. */
.telescope-info-card {
  max-width: min(28rem, 90vw);
  max-height: 80vh;
  overflow-y: auto;
  padding: 0.75rem 1rem 1rem;
  background: var(--background-color-darkest);
  color: var(--text-color);
  border: 1px solid var(--fp-color);
  border-radius: 8px;
  line-height: 1.4;
}

.telescope-info-card h3 {
  color: var(--fp-color);
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}

.telescope-info-card h4 {
  font-size: 0.95rem;
  margin-top: 0.9rem;
  margin-bottom: 0.25rem;
}

/* two columns so the labels line up down the left, collapsing to stacked rows
   where there isn't room for both */
.telescope-info-card dl {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.3rem 0.75rem;
  margin: 0;
  font-size: 0.9rem;
}

.telescope-info-card dt {
  font-weight: 600;
  opacity: 0.8;
  white-space: nowrap;
}

.telescope-info-card dd {
  margin: 0;
}

.telescope-info-card ul {
  margin: 0;
  padding-left: 1.1rem;
  font-size: 0.9rem;
}

.telescope-info-card li {
  margin-block: 0.35rem;
}

@media (max-width: 400px) {
  .telescope-info-card dl {
    grid-template-columns: 1fr;
    gap: 0 0;
  }

  .telescope-info-card dd {
    margin-bottom: 0.4rem;
  }
}
</style>
