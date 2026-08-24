<template>
  <div
    class="mini-fp-settings pa-2"
    :style="{ '--fp-color': color }"
  >
    <div class="d-flex flex-wrap justify-space-between">
      <div class="show-option">
        <label>
          <span class="mr-2"> {{ label }} </span>
          <input
            v-model="shown"
            type="checkbox"
          />
        </label>
      </div>
      <div
        v-if="showFill"
        class="fill-option"
      >
        <label>
          <span class="mr-2">Fill</span>
          <input
            v-model="fill"
            type="checkbox"
          />
        </label>
      </div>
      <div>
        <input
          v-model.number="opacity"
          type="range"
          min="0"
          max="1"
          step="0.01"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  /** footprint label, e.g. "Roman" */
  label: string;
  /** outline color, hex format */
  color: string;
  /** offer the fill toggle. most footprints aren't filled */
  showFill?: boolean;
}

withDefaults(defineProps<Props>(), {
  showFill: false,
});

const opacity = defineModel<number>("opacity", { required: true });
const fill = defineModel<boolean>("fill", { required: true });

// the checkbox hides the footprint by taking opacity to 0 and putting the old
// value back. `show` belongs to the tour, which flips footprints per step, so
// this control can't use it
let lastOpacity = opacity.value;
const shown = computed({
  get: () => opacity.value > 0,
  set: (value: boolean) => {
    if (value) {
      opacity.value = lastOpacity || 1;
    } else {
      lastOpacity = opacity.value;
      opacity.value = 0;
    }
  },
});
</script>

<style scoped>
.mini-fp-settings {
  border: 1px solid var(--fp-color);
  border-radius: 4px;
  background: black;
  color: var(--fp-color);
  padding: 0.5em;
  pointer-events: auto;
  user-select: none;
  width: 250px;
}

/* The slider sits under the label rather than beside it. */
.mini-fp-settings > div > div:last-child {
  flex-basis: 100%;
}

.show-option {
}

.fill-option {
  padding-left: 0.5em;
}

label > span {
  color: white;
}
input {
  /* this color will only get applied for certain modern browsers, but is a nice touch */
  accent-color: var(--fp-color);
  cursor: pointer;
}

input[type="range"] {
  width: 100%;
}
</style>
