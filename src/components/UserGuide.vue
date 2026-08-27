<template>
  <div>
    <h4 class="user-guide-header mt-5">
      Sky Navigation
    </h4>
    <p>To navigate the WWT view, use the following controls:</p>
    <v-row
      align="center"
      dense
      class="mt-2 mx-3"
    >
      <v-col cols="4">
        <v-chip
          label
          density="compact"
          variant="outlined"
        >
          Pan
        </v-chip>
      </v-col>
      <v-col
        cols="8"
        class="pt-1"
      >
        <strong>{{ touchscreen ? "press + drag" : "click + drag" }}</strong>
        {{ touchscreen ? "" : "or" }}
        <strong>{{ touchscreen ? "" : "W-A-S-D" }}</strong> {{ touchscreen ? ""
          : "keys" }}<br />
      </v-col>
    </v-row>
    <v-row
      align="center"
      dense
      class="mx-3"
    >
      <v-col cols="4">
        <v-chip
          label
          density="compact"
          variant="outlined"
        >
          Zoom
        </v-chip>
      </v-col>
      <v-col
        cols="8"
        class="pt-1"
      >
        <strong>{{ touchscreen ? "pinch in and out" : "scroll in and out" }}</strong>
        {{ touchscreen ? "" : "or" }}
        <strong>{{ touchscreen ? "" : "I-O" }}</strong> {{ touchscreen ? "" :
          "keys" }}<br />
      </v-col>
    </v-row>
    <v-row
      align="center"
      dense
      class="mx-3"
    >
      <v-col cols="4">
        <v-chip
          label
          density="compact"
          variant="outlined"
        >
          Rotate
        </v-chip>
      </v-col>
      <v-col
        cols="8"
        class="pt-1"
      >
        {{ touchscreen ? "" : "press" }}
        <strong>{{ touchscreen ? "pinch and twist" : "control + click + drag"
        }}</strong>
        {{ touchscreen ? "" : "" }}
        <strong>{{ touchscreen ? "" : "" }}</strong> {{ touchscreen ? "" : ""
        }}<br />
      </v-col>
    </v-row>

    <!-- Credits -->
    <v-row>
      <v-col cols="12">
        <div class="credits">
          <h4 class="user-guide-header mt-3">
            Credits
          </h4>
          <h5>
            <easyLink href="https://www.cosmicds.cfa.harvard.edu/">
              CosmicDS
            </easyLink>
          </h5>
          <p>John Lewis</p>
          <p>Jon Carifio</p>
          <p>Pat Udomprasert</p>
          <p>Alyssa Goodman</p>

          <h5>
            <a
              href="https://www.worldwidetelescope.org/home"
              target="_blank"
              rel="noopener noreferrer"
            >WorldWide Telescope</a>
          </h5>
          <p>Jon Carifio</p>
          <p>Peter Williams</p>
          <p>David Weigel</p>

          <h4 class="user-guide-header mt-3">
            Data &amp; Citations
          </h4>

          <h5>Hubble imaging of Andromeda</h5>
          <p class="citation">
            PHAT &mdash;
            <easyLink href="https://ui.adsabs.harvard.edu/abs/2012ApJS..200...18D/abstract">NASA ADS</easyLink>
          </p>
          <p class="citation">
            PHAST &mdash;
            <easyLink href="https://ui.adsabs.harvard.edu/abs/2025ApJ...979...35C/abstract">NASA ADS</easyLink>
          </p>
          <p class="citation">
            The combined
            <easyLink href="https://science.nasa.gov/asset/hubble/hubble-m31-phatphast-mosaic/">
              PHAT
              + PHAST mosaic
            </easyLink> at NASA.
          </p>

          <h5>Roman survey footprints</h5>
          <p class="citation">
            Roman Cycle 1 GAS program 2002 (PI K. Gilbert), <em>A Legacy Survey of Andromeda and
              Triangulum with Roman</em> &mdash;
            <easyLink href="https://roman.ipac.caltech.edu/cycle1-approved-programs/2002">
              program
              2002
            </easyLink>. Footprints derived from its public APT file.
          </p>
          <p class="citation">
            Roman WFI apertures from
            <easyLink href="https://github.com/spacetelescope/pysiaf">pysiaf</easyLink>
            and reference geometry from
            <easyLink href="https://github.com/spacetelescope/roman_notebooks">roman_notebooks</easyLink>,
            both Space Telescope Science Institute.
          </p>

          <h5>Archives &amp; software</h5>
          <p class="citation">
            Hubble data from the Mikulski Archive for Space Telescopes (MAST) at STScI &mdash;
            <easyLink href="https://archive.stsci.edu/hlsp/phat">PHAT</easyLink> and
            <easyLink href="https://archive.stsci.edu/hlsp/phast">PHAST</easyLink> archives.
          </p>
          <p class="citation">
            Built with <easyLink href="https://www.astropy.org">Astropy</easyLink>.
          </p>
        </div>
        <v-spacer class="end-spacer"></v-spacer>
      </v-col>
    </v-row>
    <funding-acknowledgement />
  </div>
</template>
<script setup lang="ts">
import { ref, h, type SetupContext } from 'vue';


const touchscreen = ref(true);
// https://v3-migration.vuejs.org/breaking-changes/functional-components
const easyLink = (props: { href: string }, { slots }: SetupContext) => {
  return h('a', { href: props.href, target: '_blank' }, slots.default?.());
};
</script>

<style scoped>
.credits .citation {
  font-size: 0.82rem;
  line-height: 1.45;
  margin-bottom: 0.5rem;
  max-width: 42rem;
  text-indent: -1rem;
  padding-left: 1rem;
}
</style>
