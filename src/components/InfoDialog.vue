<template>
  <div
    v-if="showInfoDialog"
    id="info-dialog"
    class="info-dialog-content"
  > 
    <font-awesome-icon
      id="info-close-icon"
      class="close-icon"
      icon="times"
      size="lg"
      tabindex="0"
      @click="showInfoDialog = false"
      @keyup.enter="showInfoDialog = false"
    >
    </font-awesome-icon>
    <div class="intro-card info-text">
      <h3 class="mb-3">
        Quick Start
      </h3>
      <h4>Navigation</h4>
      <ul class="ml-4">
        <v-list-item density="compact">
          <strong>Pan:</strong> Click + drag.
        </v-list-item>
        <v-list-item density="compact">
          <strong>Zoom:</strong> Scroll in and out
        </v-list-item>
        <v-list-item density="compact">
          <strong>Rotate:</strong> Press <strong>ctrl</strong> + click + drag
        </v-list-item>
      </ul>
      <h4 class="mt-2">
        Buttons
      </h4>
      <ul>
        <v-list-item density="compact">
          <template #prepend>
            <font-awesome-icon
              icon="info"
              size="lg"
              class="bullet-icon"
            ></font-awesome-icon>
          </template>
          View all documentation
        </v-list-item>
        <v-list-item density="compact">
          <template #prepend>
            <font-awesome-icon
              icon="share-nodes"
              size="lg"
              class="bullet-icon"
            ></font-awesome-icon>
          </template>
          <strong>Share</strong> current view. Url will be copied to clipboard and can be pasted in browser.
        </v-list-item>
      </ul>
      <v-card-actions class="pb-0">
        <v-btn
          variant="text"
          :color="accentColor"
          @click="() => {
            autoOpen = false;
            showInfoDialog = false;
          }"
        >
          Don't show again
        </v-btn>
      </v-card-actions>
    </div>
  </div>
</template>

<script setup lang="ts">

const showInfoDialog = defineModel<boolean>({default: true});

/*
 * Two-way: "Don't show again" writes it, and RomanFov persists it to
 * localStorage. A plain prop would be mutated from the child.
 */
const autoOpen = defineModel<boolean>("autoOpen", { default: true });

interface InfoDialogProps {
  accentColor: string;
};

defineProps<InfoDialogProps>();




</script>


<style>
/* don't scope the css */
/* Remove oreo focus styling from info dialog */
#info-dialog.info-dialog-content:focus-visible {
  outline: none !important;
  box-shadow: none !important;
}


#info-dialog.info-dialog-content {
  width: auto;
  max-width: 300px;
  width: min(300px, calc(100vw - 2rem)); /* this line was breaking syntax highlighting with LESS but still built */
  max-height: calc(95vh - 1rem);
  overflow-y: auto;
  position: relative;
  margin: 0 !important;
  border: 1px solid var(--border-color);
  background: rgb(var(--v-theme-surface));
  border-radius: 10px;
  pointer-events: auto;
  user-select: none;
}


#info-dialog.info-dialog-content .close-icon {
  top: 10px;
  right: 10px;
  padding: 4px;
}

#info-dialog.info-dialog-content .close-icon:hover {
  color: var(--accent-color);
}


.intro-card {
  padding: 1em;
}

.info-text {
}

.info-text p {
  margin-block: 0.5em;
}

.info-text a {
  color: var(--accent-color-2)
}

.info-text h3 {
  font-size: 1.4em;
  color: var(--text-color);
}

.info-text h4 {
  font-size: 1.2em;
  color: var(--border-color);
}

.info-text h5 {
  font-size: 1em;
  font-weight: bold;
  margin-top: 1em;
}

.info-text li {
  margin-block: 0.5em;
}


</style>