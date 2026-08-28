import { D2R } from "@cosmicds/vue-toolkit";
import { Color, Coordinates, Planets, type PositionColoredTextured, type Sprite2d, type Texture, type RenderContext } from "@wwtelescope/engine";
import { OpacitySpriteShader } from "./sprite_shader";
import { WEBGL } from "./webgl_constants";

export interface DrawMoonOptions {
  renderContext: RenderContext;
  raDeg: number;
  decDeg: number;
  opacity: number;
}

function drawWithOpacityShader(sprite: Sprite2d, renderContext: RenderContext, points: PositionColoredTextured[], _count: number, texture: Texture, triangleStrips: boolean, opacity: number) {
  if (sprite.vertexBuffer == null) {
    sprite.create(points);
  } else {
    sprite.update(points);
  }
  OpacitySpriteShader.use(renderContext, sprite.vertexBuffer, (texture != null) ? texture.texture2d : null, opacity);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error gl property exists on the render context
  renderContext.gl.drawArrays(triangleStrips ? WEBGL.TRIANGLE_STRIP : WEBGL.TRIANGLES, 0, points.length);
}

export function drawMoon(options: DrawMoonOptions) {
  const moonID = 9;
  const color = Color.fromArgb(255, 255, 255, 255);
  const opacity = Math.max(0, Math.min(options.opacity, 1));
  const texture = Planets._planetTextures[moonID];
  const scale = Planets._planetScales[moonID];
  const radius = scale / 2;
  const raRadius = (radius / Math.cos(options.decDeg * D2R));
  Planets._planetPoints[0].position = Coordinates.raDecTo3dAu(((options.raDeg - raRadius) / 15), options.decDeg + radius, 1);
  Planets._planetPoints[0].tu = 0;
  Planets._planetPoints[0].tv = 1;
  Planets._planetPoints[0].color = color;
  Planets._planetPoints[1].position = Coordinates.raDecTo3dAu(((options.raDeg - raRadius) / 15), options.decDeg - radius, 1);
  Planets._planetPoints[1].tu = 0;
  Planets._planetPoints[1].tv = 0;
  Planets._planetPoints[1].color = color;
  Planets._planetPoints[2].position = Coordinates.raDecTo3dAu(((options.raDeg + raRadius) / 15), options.decDeg + radius, 1);
  Planets._planetPoints[2].tu = 1;
  Planets._planetPoints[2].tv = 1;
  Planets._planetPoints[2].color = color;
  Planets._planetPoints[3].position = Coordinates.raDecTo3dAu(((options.raDeg + raRadius) / 15), options.decDeg - radius, 1);
  Planets._planetPoints[3].tu = 1;
  Planets._planetPoints[3].tv = 0;
  Planets._planetPoints[3].color = color;
  drawWithOpacityShader(Planets._planetSprite, options.renderContext, Planets._planetPoints, 4, texture, true, opacity);
}
