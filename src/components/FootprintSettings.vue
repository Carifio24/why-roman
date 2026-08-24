<template>
  <div class="footprint-settings">
    <div class="centered-content pt-4 pb-3 pl-1">
      <v-checkbox
        v-model="show"
        :label="`${label} Color:`"
        density="compact"
        hide-details
        @keydown.space.prevent="show = !show"
        @keydown.enter.prevent="show = !show"
      ></v-checkbox>
      <input
        :id="colorInputId"
        v-model="footprintColor"
        class="bordered"
        type="color"
        :disabled="!show"
        :aria-label="`${label} color`"
      />
    </div>

    <div class="fill-row centered-content">
      <v-checkbox
        v-model="fill"
        label="Fill"
        density="compact"
        hide-details
        :disabled="!show"
        @keydown.space.prevent="fill = !fill"
        @keydown.enter.prevent="fill = !fill"
      ></v-checkbox>
      <v-slider
        v-model="fillOpacity"
        :min="0"
        :max="1"
        :step="0.01"
        :disabled="!fill || !show"
        :color="footprintColor"
        density="compact"
        hide-details
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useId } from "vue";

interface Props {
  /** footprint label, e.g. "Roman" */
  label?: string;
}

withDefaults(defineProps<Props>(), {
  label: "Footprint",
});

// hex string
const footprintColor = defineModel<string>("footprintColor", { required: true });
const fill = defineModel<boolean>("fill", { required: true });
const fillOpacity = defineModel<number>("fillOpacity", { required: true });
// whether the footprint is drawn at all
const show = defineModel<boolean>("show", { default: true });

/* several of these render at once, and a hardcoded id would duplicate and
   break the id/aria association */
const colorInputId = useId();
</script>

<style scoped>
/* copied from RomanFov.vue so this stands on its own */
.bordered {
  border: 1px solid #bbbbbb;
  padding-inline: 2px;
  border-radius: 4px;
}

.centered-content {
  display: flex;
  align-items: center;
  gap: 10px;
}
</style>
