<template>
  <v-window-item :value="index">
    <v-card
      class="scrollable border-radius-0"
      elevation="0"
    >
      <v-card-text class="info-text scrollable">
        <slot />
      </v-card-text>
    </v-card>
  </v-window-item>
</template>
<script setup lang="ts">
// adapted from https://vueschool.io/articles/vuejs-tutorials/tightly-coupled-components-vue-components-with-provide-inject/
import { inject, computed } from "vue";

// Notice that import the injection key from the `vTabs` component
// since it's a symbol we can be absolutely certain it's unique
// and since these are tightly coupled it makes sense to get it from the parent
import { injectionKey } from "./InformationSheet.vue";

// This is a simple title prop
const props = defineProps<{
    title: string,
  }>();

// This is where the magic happens
// Here we "pick up" the data provided by the parent
const tabsProvider = inject(injectionKey, null);
// If withinTabs is false, then the injected data wasn't provided
// Why? because withinTabs defaults to false. Well for this it is undefined
// So we're outside the context of `InformationSheet` which is not a valid use of the panel component
if (!tabsProvider?.withinTabs) {
  throw new Error('InformationPage must be used within an InformationSheet');
}



// Here we push our panels title to the parent so that it can display the tabs properly
const index = tabsProvider.registerTab(props.title);

// If there is no active tab set, go ahead and set it
// This will only ever be true for the first panel
// Meaning, the first panel will always be the default active one
if (!tabsProvider.activeTab.value) {
  tabsProvider.activateTab(index);
}

// Finally just check to see if this panel should be active
// based on the active `activeTab` state from the parent
const _isActive = computed(() => tabsProvider.activeTab.value === index);
</script>
