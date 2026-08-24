import { shallowReactive } from "vue";
import { Color, WWTControl } from "@wwtelescope/engine";

import { drawFootprint, drawStaticFootprint } from "../footprint";
import type { Point } from "../footprints/types";

// the shadow canvas the moving footprints project through, matching the
// #shadow-roman-footprint element in RomanFov.vue. they all share it, since
// footprint.ts keeps one fake WWTControl per canvas
const SHADOW_CANVAS_ID = "shadow-footprint";

export interface FootprintOptions {
  id: string; // must be unique, or else will 2nd+ instance of id will not get rendered
  footprint: Point[][]; // [ [box1], [box2], ... ] in degrees, each box is a loop of points (no longer needs to be self-closing)
  label?: string;
  /** outline color, hex format */
  color?: string; 
  /** fill the shape? */
  fill?: boolean;
  /** opacity of fill */
  fillOpacity?: number;
  show?: boolean;
  /** outline (or overall) opacity */
  opacity?: number;
  /** offset X + to move left, and - to move right */
  offsetXDeg?: number;
  /** offset Y + to move down, and - to move up */
  offsetYDeg?: number;
  /**
   * Pin the footprint to the sky rather than to the centre of the view. Use
   * this for real observation footprints
   */
  fixed?: boolean;
  canvasId?: string; // vestigial - override the default shadow canvas#shadow
  linewidth?: number; // outline width. in pixels. only for floating footprints
}

/** ""
 *   const hubble = useFootprint({ id: "hubble", footprint: hubbleCorners });
 *   <FootprintSettings v-model:show="hubble.show" ... />
 *
 * Call `draw(wwt)` from the render callback; it reads the current settings
 * each frame, so changing `hubble.color` shows up on the next one.
 */
export function useFootprint(options: FootprintOptions) {
  // Geometry and placement are fixed for the life of the footprint, so they
  // stay in the closure and out of the settings the UI writes to.
  const { id, footprint, offsetXDeg, offsetYDeg } = options;
  const canvasId = options.canvasId ?? SHADOW_CANVAS_ID;
  const drawWith = options.fixed ? drawStaticFootprint : drawFootprint;

  // shallowReactive, not reactive: every setting here is a primitive, so deep
  // conversion would buy nothing, and `draw` stays a plain function rather than
  // something the proxy has to consider wrapping.
  return shallowReactive({
    id,
    label: options.label ?? id,
    color: options.color ?? "#ffffff",
    fill: options.fill ?? false,
    fillOpacity: options.fillOpacity ?? 0.5,
    show: options.show ?? true,
    opacity: options.opacity ?? 1,

    draw(wwt: WWTControl) {
      drawWith(wwt, {
        id,
        canvasId,
        footprint,
        color: Color.load(this.color),
        fill: this.fill,
        fillOpacity: this.fillOpacity,
        show: this.show,
        opacity: this.opacity,
        offsetXDeg,
        offsetYDeg,
        linewidth: options.linewidth ?? 1,
      });
    },
  });
}

export type Footprint = ReturnType<typeof useFootprint>;
