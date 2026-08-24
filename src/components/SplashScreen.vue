<template>
  <v-overlay
    id="splash-overlay"
    :model-value="showSplashScreen"
    :scrim="false"

    absolute
    :style="cssVars"
    transition="fade-transition"
  >
    <focus-trap>
      <div
        id="splash-screen"
        v-click-outside="closeSplashScreen"
        :style="cssVars"
      >
        <div class="background">
          <div class="background-blur"></div>
        </div>
        <font-awesome-icon
          id="close-splash-button"
          icon="xmark"
          tabindex="0"
          @click="closeSplashScreen"
          @keyup.enter="closeSplashScreen"
        />
        <slot />

        <div id="splash-screen-acknowledgements">
          <div id="splash-screen-logos">
            <credit-logos
              id="splash-screen-credit-logos"
              logo-size="5vmin"
              :default-logos="['cosmicds', 'wwt', 'sciact', 'nasa']"
            />
          </div>
        </div>
      </div>
    </focus-trap>
  </v-overlay>
</template>


<script setup lang="ts">
import { computed } from 'vue';
import { FocusTrap } from "focus-trap-vue";

export interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cssVars?: any;
  color?: string,
  highlightColor?: string,
  loaded?: boolean,
}

const props = withDefaults(defineProps<Props>(), {
  cssVars: () => ({}),
  loaded: true,
  color: 'white',
  highlightColor: 'white'
});

const cssVars = computed(() => {
  return {
    ...props.cssVars,
    ...{'--accent-color': props.color == null ? props.cssVars['--accent-color'] : props.color ?? 'white'},
  };
});

const emits = defineEmits(['close']);

const showSplashScreen = defineModel<boolean>({ default: true });
const splash = new URLSearchParams(window.location.search).get("splash")?.toLowerCase() !== "false";
if (!splash) {
  showSplashScreen.value = false;
  emits('close');
}


// watch(() => props.loaded, (l) =>{
//   if (l) {
//     setTimeout( () => {
//       showSplashScreen.value = false;
//     }, 5000)
//   }
// })


function closeSplashScreen() {
  showSplashScreen.value = false;
  emits('close');
}


</script>


<style lang="less">

#splash-overlay {
  align-items: center;
  justify-content: center;
  font-size: min(8vw, 5vh);
  transition: width 0.5s, height 0.5s;
}

:deep(.v-fade-transition-enter-active),
:deep(.v-fade-transition-leave-active) {
  transition-duration: 6000ms !important;
}

#splash-screen {
  color: white;
  user-select: none;
  contain: paint;

  @media (max-width: 699px) {
    max-height: 80vh;
    max-width: 90vw;
  }

  @media (min-width: 700px) {
    max-height: 85vh;
    max-width: min(70vw, 800px);
  }
  --border-radius: 30px;
  
  
  .background {
    position: fixed;
    inset: 0;
    // background-image: url('/roman_early_universe.jpg');
    background-image: url("/Trailer_still_1-1.jpg");
    filter: grayscale(0.8);

    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    contain: strict;
    z-index: -1;
    border-radius: var(--border-radius);
  }
  
  .background-blur {
    backdrop-filter: blur(0px) saturate(2);
    position: fixed;
    inset: 0;
    // margin-top: 2rem;
    // margin-bottom: 1rem;
    // margin-inline: 1rem;
    border-radius: var(--border-radius);
  }
  
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-content: center;
  padding-top: 2rem;
  padding-bottom: 1rem;
  padding-inline: 2rem;

  border-radius: var(--border-radius);
  border: min(1.2vw, 0.9vh) solid var(--accent-color);
  overflow: auto;
  font-family: 'Source Sans 3', 'Roboto', sans-serif;

  div {
    margin-inline: auto;
    text-align: center;
  }

  a {
    color: white;
  }
  // make a paragraph inside the div centered horizontally and vertically
  p {
    font-family: 'Source Sans 3', 'Roboto', sans-serif;
    font-weight: regular;
    vertical-align: middle;
  }
    
  p.highlight {
    color: var(--accent-color);
    text-transform: uppercase;
    font-weight: bold;
  }

  
  p.small {
    font-size: 0.8em;
    font-weight: bold;
  }

  #first-splash-row {
    width: 100%;
  }

  #close-splash-button {
    position: absolute;
    top: 20px;
    right: 20px;
    text-align: end;
    color: var(--button-color);
    font-size: min(5vw, 4vh);
    padding: 0.25rem;
    margin: -0.25rem;

    &:hover {
      cursor: pointer;
    }
  }

  #splash-screen-text {
    // in the grid, the text is in the 2nd column
    display: flex;
    flex-direction: column;
    line-height: 130%;
    
  }

  .splash-get-started {
    border: 2px solid white;
    font-size: 0.5em;
    font-weight: bold !important;
  }

  #splash-screen-guide {
    margin-block: 1.5em;
    font-size: min(5vw, 4vh);
    line-height: 140%;
    width: 75%;

    .v-col{
      padding: 0;
    }
    
    .svg-inline--fa {
      color:var(--accent-color);
      margin: 0 10px;
    }
  }

  #splash-screen-acknowledgements {
    // margin-top: 3rem;
    margin: clamp(0.5rem, 3vh, 3rem) auto;
    margin-bottom: 0;
    font-size: 1em;
    line-height: calc(var(--default-line-height));
    width: 80%; 

    @media only screen and (max-width: 600px) {
      width: 80%;
    }
  }

  #splash-screen-credit-logos {
    img {
    // height: 65px;
    vertical-align: middle;
    margin-inline: 0.5em;
    }

    @media only screen and (max-width: 600px) {
      img {
        // height: 40px;
      }
    }

    svg {
      vertical-align: middle;
      height: 24px;
    }
  }
}

@media (max-height: 500px) {
  #splash-screen {
    // display: flex;
    // flex-direction: column;
    // max-width: 200vh;
    // justify-content: center;
    // align-items: center;
    // gap: calc(0.5 * var(--default-line-height));
    overflow: hidden;
    
  #splash-screen-text {
    line-height: 75%;
  }
  
  .splash-get-started {
    margin-bottom: 0;
  }
  
  #splash-screen-acknowledgements {
    font-size: 1em;
  }
}
  
}

@media (max-height: 310px) {
  #splash-screen {
    width: 50vw;
    padding-block: 10px;
  }
  #splash-screen-acknowledgements  {
    display: none;
  }
}

#artemis-large-logo {
  height: 100px;
}

@media (min-width: 600px) {
  #artemis-large-logo {
    height: 200px;
  }
}

</style>
