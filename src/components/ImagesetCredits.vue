<template>
  <p class="imageset-credits-p">
    <a
      v-if="creditUrl"
      class="imageset-credit"
      :href="creditUrl"
      target="_blank"
    >
      <span
        v-if="credit"
        class="imageset-credit-text"
      >{{ credit }}</span>
      <span
        v-else
        class="imageset-credit-text"
      > {{ creditUrl }} </span>
    </a>
    <span
      v-else-if="credit"
      class="imageset-credit imageset-credit-text"
    >{{ credit }}</span>
    <span
      v-else
      class="imageset-credit imageset-credit-text imageset-no-credit"
    > No credits available </span>
  </p>
</template>


<script setup lang="ts">
import { computed } from "vue";
import type { Imageset } from "@wwtelescope/engine";
interface Props {
  imageset: Imageset
}

const {imageset } = defineProps<Props>();

const credit = computed(() => {
  if (imageset.get_creditsText()) {
    return imageset.get_creditsText();
  }
  return null;
});

const creditUrl = computed(() => {
  if (imageset.get_creditsUrl()) {
    return imageset.get_creditsUrl();
  }
  return null;
});
</script>

<style scoped>
.imageset-credits-p {
  line-height: 1;
  max-width: 20ch;
  white-space: nowrap;   
  overflow: hidden;  
  text-overflow: ellipsis;
}
.imageset-credit {
  font-size: 0.8em;
}
</style>
