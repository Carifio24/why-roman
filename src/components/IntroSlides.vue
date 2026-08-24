<template>
  <v-dialog
    id="intro-slides"
    v-model="open"
    class="intro-slides-dialog"
    :width="800"
    :persistent="true"
  >
    <v-card class="intro-slides-container">
      <v-window 
        v-model="window" 
        class="intro-slides pa-2"
      >
        <v-window-item
          class="intro-slides-window-item"
          :value="0"
        >
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolor earum ducimus, non aliquam consequatur tempora molestiae explicabo dolore autem fugit, cumque nam ab! Possimus dolore itaque, ratione amet quibusdam quidem?
          <v-img
            src="/Trailer_still_1-1.jpg"
            aspect-ratio="1"
            height="150px"
            cover
          />
        </v-window-item>
        <v-window-item
          class="intro-slides-window-item"
          :value="1"
        >
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolor earum ducimus, non aliquam consequatur tempora molestiae explicabo dolore autem fugit, cumque nam ab! Possimus dolore itaque, ratione amet quibusdam quidem?
        </v-window-item>
        <v-window-item
          class="intro-slides-window-item"
          :value="2"
        >
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolor earum ducimus, non aliquam consequatur tempora molestiae explicabo dolore autem fugit, cumque nam ab! Possimus dolore itaque, ratione amet quibusdam quidem?
        </v-window-item>
      </v-window>
      <v-spacer />
      <v-card-actions>
        <v-btn
          v-if="window > 0"
          variant="flat"
          color="#502752"
          size="small"
          rounded="lg"
          @click="window = Math.max(0, window - 1)"
        >
          Previous
        </v-btn>
        <v-spacer />
        <v-btn
          v-if="window < 2"
          variant="flat"
          color="#502752"
          size="small"
          rounded="lg"
          @click="window = Math.min(2, window + 1)"
        >
          Next
        </v-btn>
        <v-btn
          v-else
          variant="flat"
          color="#502752"
          size="small"
          rounded="lg"
          @click="handleFinalNext"
        >
          Next
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const open = defineModel<boolean>({default: true});
const emit = defineEmits(['close']);

function handleFinalNext() {
  open.value = false;
  emit('close');
}

const window = ref(0);

</script>


<style lang="less">

#intro-slides.intro-slides-dialog .v-overlay__content {
  outline: none !important;
  box-shadow: none !important;
}
.intro-slides-container {
  position: relative;
  height: 60vh;
  min-height: 400px;
  display: flex;
}

.intro-slides {
  position: relative;
}
.intro-slides-window-item {

}


</style>