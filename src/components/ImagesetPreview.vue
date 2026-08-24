<template>
  <v-img
    class="imageset-preview"
    :src="src"
    :aspect-ratio="1"
    :cover="true"
    :style="{ '--preview-zoom': zoom, '--preview-aspect-ratio': aspectRatio }"
    @error="tileFailed = true"
  />
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import type { Imageset } from "@wwtelescope/engine";
import { ProjectionType } from "@wwtelescope/engine-types";

interface Props {
  imageset: Imageset | null;
  // "level0" is the imageset's level-0 tile: one 256x256 square tile covering
  // the whole image, so much sharper than the WTML thumbnail (usually 96x45).
  // Falls back to the thumbnail if there's no tiled URL template or the tile
  // fails to load.
  source?: "level0" | "thumb";
  aspectRatio?: number;
  // scale the image up in its box, cropping evenly from the center. a level-0
  // tile inscribes the image in a square with a wide black border, so 2 shows
  // the central 50%, 3 the central third, etc.
  zoom?: number;
}

const props = withDefaults(defineProps<Props>(), {
  source: "level0",
  aspectRatio: 1,
  zoom: 1,
});

/*
 * An http:// image on an https:// page is blocked as mixed content. WWT's own
 * tile loads go through URLHelpers.rewrite and Tile.get_URL, which force https
 * and retarget legacy hosts. We read the imageset URLs raw, so we have to do
 * the same two fixups.
 *
 * r{S}.ortho.tiles.virtualearth.net has no https listener at all, so the host
 * rewrite (to ecn.t{S}.tiles.virtualearth.net, same tiles over https) has to
 * happen before the scheme upgrade. The other hosts in our WTMLs serve https
 * as-is.
 */
function httpsUrl(url: string): string {
  return url
    .replace(/\/\/r(\d)\.ortho\.tiles\.virtualearth\.net/i, "//ecn.t$1.tiles.virtualearth.net")
    .replace(/^http:\/\//i, "https://");
}

/*
 * Both of WWT's tile URL template styles show up in our WTMLs.
 *
 * Old style, {1}=level, {2}=x, {3}=y, so level 0 is all zeros:
 *   .../{1}/{3}/{3}_{2}.png  ->  .../0/0/0_0.png
 *   .../L{1}X{2}Y{3}.png     ->  .../L0X0Y0.png
 *
 * Quadkey style, {Q}=quadkey, {S:N}=tile server digit:
 *   http://r{S:2}.ortho.tiles.virtualearth.net/tiles/wsa0000003102{Q}?g=138
 *     ->  https://ecn.t2.tiles.virtualearth.net/tiles/wsa0000003102?g=138
 * At level 0 the quadkey is empty, since Tile.getTileID builds it with
 * `for (i = level; i > 0; --i)`. With an empty key the server digit falls back
 * to the number in {S:N}. True for tangent and friends but not equirectangular,
 * where getTileID bumps the level first, so leave those alone.
 */
function levelZeroTileUrl(imageset: Imageset | null): string | null {
  const url = imageset?.get_url();
  if (!url) {
    return null;
  }

  let tile: string;
  if (url.includes("{Q}")) {
    if (imageset?.get_projection() === ProjectionType.equirectangular) {
      return null;
    }
    tile = url.replace(/\{Q\}/g, "").replace(/\{S:(\d)\}/g, "$1");
  } else {
    tile = url
      .replace(/\{1\}/g, "0")
      .replace(/\{2\}/g, "0")
      .replace(/\{3\}/g, "0");
  }

  // nothing substituted (not a tiled template), or placeholders we don't
  // understand are left over. don't guess
  if (tile === url || /\{[^}]*\}/.test(tile)) {
    return null;
  }
  return httpsUrl(tile);
}

const thumbUrl = computed(() => httpsUrl(props.imageset?.get_thumbnailUrl() ?? ""));

// set if the level-0 tile fails to load, so we drop back to the thumbnail
const tileFailed = ref(false);
watch(() => [props.imageset, props.source], () => tileFailed.value = false);

const src = computed(() => {
  if (props.source === "thumb" || tileFailed.value) {
    return thumbUrl.value;
  }
  return levelZeroTileUrl(props.imageset) ?? thumbUrl.value;
});
</script>

<style scoped>
.imageset-preview {
  width: 100%;
  filter: brightness(1.3) contrast(1.1);
   border-radius: 8px;
  aspect-ratio: var(--preview-aspect-ratio, 1);
  outline: 1px solid white;
  background-color: black;
}

/* v-img clips to its box (.v-responsive is overflow: hidden), so scaling the
   inner image crops off the black border a level-0 tile pads the image with */
.imageset-preview :deep(.v-img__img) {
  transform: scale(var(--preview-zoom, 1));
}
</style>
