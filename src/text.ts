import { Color, RenderContext, type ScriptInterface, Text3d, Text3dBatch, Vector3d } from "@wwtelescope/engine";
import { createTransformsForCamera } from "./overlays";
import { WWTEngineStore } from "@cosmicds/vue-toolkit";

export interface UseTextOverlayOptions {
  store: WWTEngineStore;
  text: string;
  renderContext: RenderContext;
  up?: Vector3d;
  center: Vector3d;
  initialShow?: boolean;
  color?: string | Color;
  scale?: number;
}

// In the future, we should expose the render context-specific stuff at the Pinia store level as well
// In case we want to make each text item a different color, for simplicity this creates
// a separate text batch for each text item
export function createTextOverlay(options: UseTextOverlayOptions) {
  let show = options.initialShow ?? false;

  const textBatch = new Text3dBatch(1);
  const up = options.up ?? Vector3d.create(0, 1, 0);
  const scale = options.scale ?? 0.001;
  const text = new Text3d(options.center, up, options.text, 1, scale);
  textBatch.add(text);

  const color = typeof options.color === "string" ? Color.load(options.color) : (options.color ? options.color : Color.fromArgb(255, 255, 255, 255));

  function drawTextOverlays(renderContext: RenderContext) {
    const batchTransforms = createTransformsForCamera({
      position: { raDeg: 0, decDeg: 0 },
      rotationDeg: 0,
      renderContext,
    });
    const draw = (rc: RenderContext) => {
      textBatch.draw(rc, 1, color);
    };
    renderContext.executeWithTransforms(batchTransforms, draw);
  }

  function setVisible(visible: boolean) {
    show = visible;
  }

  options.store.addFrameCallback((_si: ScriptInterface) => {
    if (show) {
      drawTextOverlays(options.renderContext);
    }
  });

  return {
    setVisible,
    textBatch,
  };
}
