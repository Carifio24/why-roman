// @ts-nocheck

import { RenderContext, Texture } from "@wwtelescope/engine";
import { WEBGL } from "./webgl_constants";

export class OpacitySpriteShader {
  static vertLoc = 0;
  static textureLoc = 0;
  static colorLoc = 0;
  static opacityLoc = 0;
  static _prog = null;
  static initialized = false;

  static init(renderContext: RenderContext) {
    const gl = renderContext.gl;

    const fragShaderText = `\
        precision mediump float;

        varying vec2 vTextureCoord;
        varying lowp vec4 vColor;
        uniform sampler2D uSampler;
        uniform float uOpacity;

        void main(void) {
            vec4 colorWithOpacity = vColor;
            colorWithOpacity.a = uOpacity * colorWithOpacity.a;
            gl_FragColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t)) * colorWithOpacity;
        }
    `;

    const vertexShaderText = `\
        attribute vec3 aVertexPosition;
        attribute vec2 aTextureCoord;
        attribute lowp vec4 aColor;

        uniform mat4 uMVMatrix;
        uniform mat4 uPMatrix;

        varying vec2 vTextureCoord;
        varying vec4 vColor;

        void main(void) {
            gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
            vTextureCoord = aTextureCoord;
            vColor = aColor;
        }
    `;

    OpacitySpriteShader._frag = gl.createShader(WEBGL.FRAGMENT_SHADER);
    gl.shaderSource(OpacitySpriteShader._frag, fragShaderText);
    gl.compileShader(OpacitySpriteShader._frag);
    var stat = gl.getShaderParameter(OpacitySpriteShader._frag, WEBGL.COMPILE_STATUS);
    OpacitySpriteShader._vert = gl.createShader(WEBGL.VERTEX_SHADER);
    gl.shaderSource(OpacitySpriteShader._vert, vertexShaderText);
    gl.compileShader(OpacitySpriteShader._vert);
    var stat1 = gl.getShaderParameter(OpacitySpriteShader._vert, WEBGL.COMPILE_STATUS);
    OpacitySpriteShader._prog = gl.createProgram();
    gl.attachShader(OpacitySpriteShader._prog, OpacitySpriteShader._vert);
    gl.attachShader(OpacitySpriteShader._prog, OpacitySpriteShader._frag);
    gl.linkProgram(OpacitySpriteShader._prog);
    var errcode = gl.getProgramParameter(OpacitySpriteShader._prog, WEBGL.LINK_STATUS);
    gl.useProgram(OpacitySpriteShader._prog);
    OpacitySpriteShader.vertLoc = gl.getAttribLocation(OpacitySpriteShader._prog, 'aVertexPosition');
    OpacitySpriteShader.textureLoc = gl.getAttribLocation(OpacitySpriteShader._prog, 'aTextureCoord');
    OpacitySpriteShader.colorLoc = gl.getAttribLocation(OpacitySpriteShader._prog, 'aColor');
    OpacitySpriteShader.projMatLoc = gl.getUniformLocation(OpacitySpriteShader._prog, 'uPMatrix');
    OpacitySpriteShader.mvMatLoc = gl.getUniformLocation(OpacitySpriteShader._prog, 'uMVMatrix');
    OpacitySpriteShader.sampLoc = gl.getUniformLocation(OpacitySpriteShader._prog, 'uSampler');
    OpacitySpriteShader.opacityLoc = gl.getUniformLocation(OpacitySpriteShader._prog, 'uOpacity');
    gl.enable(WEBGL.BLEND);
    gl.blendFunc(WEBGL.SRC_ALPHA, WEBGL.ONE_MINUS_SRC_ALPHA);
    OpacitySpriteShader.initialized = true;
  }

  static use(renderContext: RenderContext, vertex, texture, opacity) {
    if (texture == null) {
        texture = Texture.getEmpty();
    }
    var gl = renderContext.gl;
    if (gl != null) {
        if (!OpacitySpriteShader.initialized) {
            OpacitySpriteShader.init(renderContext);
        }
        gl.useProgram(OpacitySpriteShader._prog);
        var mvMat = Matrix3d.multiplyMatrix(renderContext.get_world(), renderContext.get_view());
        gl.uniformMatrix4fv(OpacitySpriteShader.mvMatLoc, false, mvMat.floatArray());
        gl.uniformMatrix4fv(OpacitySpriteShader.projMatLoc, false, renderContext.get_projection().floatArray());
        gl.uniform1i(OpacitySpriteShader.sampLoc, 0);
        gl.uniform1f(OpacitySpriteShader.opacityLoc, opacity);
        gl.disable(WEBGL.DEPTH_TEST);
        gl.disableVertexAttribArray(0);
        gl.disableVertexAttribArray(1);
        gl.disableVertexAttribArray(2);
        gl.disableVertexAttribArray(3);
        gl.bindBuffer(WEBGL.ARRAY_BUFFER, vertex);
        gl.enableVertexAttribArray(OpacitySpriteShader.vertLoc);
        gl.enableVertexAttribArray(OpacitySpriteShader.textureLoc);
        gl.enableVertexAttribArray(OpacitySpriteShader.colorLoc);
        gl.vertexAttribPointer(OpacitySpriteShader.vertLoc, 3, WEBGL.FLOAT, false, 36, 0);
        gl.vertexAttribPointer(OpacitySpriteShader.colorLoc, 4, WEBGL.FLOAT, false, 36, 12);
        gl.vertexAttribPointer(OpacitySpriteShader.textureLoc, 2, WEBGL.FLOAT, false, 36, 28);
        gl.activeTexture(WEBGL.TEXTURE0);
        gl.bindTexture(WEBGL.TEXTURE_2D, texture);
        gl.bindBuffer(WEBGL.ELEMENT_ARRAY_BUFFER, null);
        gl.enable(WEBGL.BLEND);
        gl.blendFunc(WEBGL.SRC_ALPHA, WEBGL.ONE_MINUS_SRC_ALPHA);
    }
  }
}
