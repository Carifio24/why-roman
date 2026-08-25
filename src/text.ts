import { ref } from "vue";
import { Color, RenderContext, type ScriptInterface, Text3d, Text3dBatch, Vector3d } from "@wwtelescope/engine";
import { createTransformsForCamera, executeWithTransforms } from "./overlays";
import { WWTEngineStore } from "@cosmicds/vue-toolkit";

export interface CreateTextOverlayOptions {
  text: string;
  renderContext: RenderContext;
  up?: Vector3d;
  center: Vector3d;
}

// In the future, we should expose the render context-specific stuff at the Pinia store level as well
export function useTextOverlays(store: WWTEngineStore, renderContext: RenderContext) {

  const show = ref(false);

  const batchTransforms = createTransformsForCamera({
    position: { raDeg: 0, decDeg: 0 },
    rotationDeg: 0,
    renderContext,
  });

  const textBatch = new Text3dBatch(1);

  function createTextOverlay(options: CreateTextOverlayOptions) {
    const up = options.up ?? Vector3d.create(0, 1, 0);
    const text = new Text3d(options.center, up, options.text, 1, 0.01);
    textBatch.add(text);
  }
  
  function drawTextOverlays(renderContext: RenderContext) {
    const draw = (rc: RenderContext) => {
      textBatch.draw(rc, 1, Color.fromArgb(255, 255, 255, 255));
    };
    // draw(renderContext); 
    executeWithTransforms(renderContext, draw, batchTransforms);
  }

  store.addFrameCallback((_si: ScriptInterface) => {
    if (show.value) {
      drawTextOverlays(renderContext);
    }
  });

  return {
    show,
    textBatch,
    createTextOverlay,
  };
}
