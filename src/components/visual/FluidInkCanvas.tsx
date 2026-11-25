"use client";

import React, { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { particleBridge } from "@/components/particles/particleState";
import {
  FLUID_DEFAULTS,
  clamp,
  computeBowAndWakeSplats,
  pickWineInkColor,
} from "@/lib/visualExperience";

interface ColorRGB {
  r: number;
  g: number;
  b: number;
}

interface FBO {
  texture: WebGLTexture;
  fbo: WebGLFramebuffer;
  width: number;
  height: number;
  texelSizeX: number;
  texelSizeY: number;
  attach: (id: number) => number;
}

interface DoubleFBO {
  width: number;
  height: number;
  texelSizeX: number;
  texelSizeY: number;
  read: FBO;
  write: FBO;
  swap: () => void;
}

function isSoftwareRenderer(gl: WebGLRenderingContext | WebGL2RenderingContext): boolean {
  try {
    const ext = gl.getExtension("WEBGL_debug_renderer_info");
    const rendererStr = ext
      ? String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) || "")
      : String(gl.getParameter(gl.RENDERER) || "");
    return /swiftshader|llvmpipe|software|mesa/i.test(rendererStr);
  } catch {
    return false;
  }
}

export function FluidInkCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const reducedMotionRef = useRef(prefersReducedMotion);
  reducedMotionRef.current = prefersReducedMotion;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || typeof window === "undefined") return;
    if (reducedMotionRef.current) return;

    const params: WebGLContextAttributes = {
      alpha: true,
      depth: false,
      stencil: false,
      antialias: false,
      preserveDrawingBuffer: false,
      powerPreference: "high-performance",
    };

    let gl: WebGLRenderingContext | WebGL2RenderingContext | null = null;
    try {
      gl = (canvas.getContext("webgl2", params) ||
        canvas.getContext("webgl", params) ||
        canvas.getContext("experimental-webgl", params)) as
        | WebGL2RenderingContext
        | WebGLRenderingContext
        | null;
    } catch {
      return;
    }
    if (!gl) return;

    const isSoftwareGl = isSoftwareRenderer(gl);
    const isMobile = window.innerWidth < 768;

    const config = {
      SIM_RESOLUTION: isMobile || isSoftwareGl ? 64 : FLUID_DEFAULTS.simResolution,
      DYE_RESOLUTION: isMobile ? 320 : isSoftwareGl ? 320 : FLUID_DEFAULTS.dyeResolution,
      DENSITY_DISSIPATION: FLUID_DEFAULTS.densityDissipation,
      VELOCITY_DISSIPATION: FLUID_DEFAULTS.velocityDissipation,
      PRESSURE: FLUID_DEFAULTS.pressure,
      PRESSURE_ITERATIONS: isSoftwareGl ? 8 : FLUID_DEFAULTS.pressureIterations,
      CURL: FLUID_DEFAULTS.curl,
      SPLAT_RADIUS: FLUID_DEFAULTS.splatRadius,
      SPLAT_FORCE: FLUID_DEFAULTS.splatForce,
      SHADING: isSoftwareGl ? false : FLUID_DEFAULTS.shading,
    };

    const getExtensions = (ctx: WebGLRenderingContext | WebGL2RenderingContext) => {
      const isWebGL2 = "drawBuffers" in ctx;
      let supportLinearFiltering = false;
      let halfFloat: OES_texture_half_float | null = null;

      if (isWebGL2) {
        const gl2 = ctx as WebGL2RenderingContext;
        gl2.getExtension("EXT_color_buffer_float");
        supportLinearFiltering = !!gl2.getExtension("OES_texture_float_linear");
      } else {
        halfFloat = ctx.getExtension("OES_texture_half_float");
        supportLinearFiltering = !!ctx.getExtension("OES_texture_half_float_linear");
      }

      const halfFloatTexType = isWebGL2
        ? (ctx as WebGL2RenderingContext).HALF_FLOAT
        : (halfFloat && halfFloat.HALF_FLOAT_OES) || ctx.UNSIGNED_BYTE;

      const supportRenderTextureFormat = (
        internalFormat: number,
        format: number,
        type: number
      ): boolean => {
        const tex = ctx.createTexture();
        const fbo = ctx.createFramebuffer();
        if (!tex || !fbo) return false;
        ctx.bindTexture(ctx.TEXTURE_2D, tex);
        ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, ctx.NEAREST);
        ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, ctx.NEAREST);
        ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_S, ctx.CLAMP_TO_EDGE);
        ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_T, ctx.CLAMP_TO_EDGE);
        ctx.texImage2D(ctx.TEXTURE_2D, 0, internalFormat, 4, 4, 0, format, type, null);
        ctx.bindFramebuffer(ctx.FRAMEBUFFER, fbo);
        ctx.framebufferTexture2D(ctx.FRAMEBUFFER, ctx.COLOR_ATTACHMENT0, ctx.TEXTURE_2D, tex, 0);
        const status = ctx.checkFramebufferStatus(ctx.FRAMEBUFFER);
        ctx.bindFramebuffer(ctx.FRAMEBUFFER, null);
        ctx.deleteTexture(tex);
        ctx.deleteFramebuffer(fbo);
        return status === ctx.FRAMEBUFFER_COMPLETE;
      };

      const getSupportedFormat = (
        internalFormat: number,
        format: number,
        type: number
      ): { internalFormat: number; format: number } | null => {
        if (supportRenderTextureFormat(internalFormat, format, type)) {
          return { internalFormat, format };
        }
        if (isWebGL2) {
          const gl2 = ctx as WebGL2RenderingContext;
          if (internalFormat === gl2.R16F) {
            return getSupportedFormat(gl2.RG16F, gl2.RG, type);
          }
          if (internalFormat === gl2.RG16F) {
            return getSupportedFormat(gl2.RGBA16F, gl2.RGBA, type);
          }
        }
        return null;
      };

      let formatRGBA: { internalFormat: number; format: number } | null;
      let formatRG: { internalFormat: number; format: number } | null;
      let formatR: { internalFormat: number; format: number } | null;

      if (isWebGL2) {
        const gl2 = ctx as WebGL2RenderingContext;
        formatRGBA = getSupportedFormat(gl2.RGBA16F, gl2.RGBA, halfFloatTexType);
        formatRG = getSupportedFormat(gl2.RG16F, gl2.RG, halfFloatTexType);
        formatR = getSupportedFormat(gl2.R16F, gl2.RED, halfFloatTexType);
      } else {
        formatRGBA = getSupportedFormat(ctx.RGBA, ctx.RGBA, halfFloatTexType);
        formatRG = formatRGBA;
        formatR = formatRGBA;
      }

      if (!formatRGBA || !formatRG || !formatR) {
        return null;
      }

      return {
        formatRGBA,
        formatRG,
        formatR,
        halfFloatTexType,
        supportLinearFiltering,
      };
    };

    const ext = getExtensions(gl);
    if (!ext) return;

    if (!ext.supportLinearFiltering) {
      config.DYE_RESOLUTION = 256;
      config.SHADING = false;
    }

    const compiledShaders: WebGLShader[] = [];
    const createdPrograms: WebGLProgram[] = [];
    const createdTextures: WebGLTexture[] = [];
    const createdFramebuffers: WebGLFramebuffer[] = [];
    const createdBuffers: WebGLBuffer[] = [];

    const hashCode = (s: string) => {
      if (!s.length) return 0;
      let hash = 0;
      for (let i = 0; i < s.length; i++) {
        hash = (hash << 5) - hash + s.charCodeAt(i);
        hash |= 0;
      }
      return hash;
    };

    const addKeywords = (source: string, keywords: string[] | null) => {
      if (!keywords || keywords.length === 0) return source;
      return keywords.map((k) => `#define ${k}\n`).join("") + source;
    };

    const compileShader = (
      type: number,
      source: string,
      keywords: string[] | null = null
    ): WebGLShader | null => {
      if (!gl) return null;
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, addKeywords(source, keywords));
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      compiledShaders.push(shader);
      return shader;
    };

    const createProgram = (
      vertexShader: WebGLShader | null,
      fragmentShader: WebGLShader | null
    ): WebGLProgram | null => {
      if (!gl || !vertexShader || !fragmentShader) return null;
      const program = gl.createProgram();
      if (!program) return null;
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        gl.deleteProgram(program);
        return null;
      }
      createdPrograms.push(program);
      return program;
    };

    const getUniforms = (program: WebGLProgram) => {
      const uniforms: Record<string, WebGLUniformLocation | null> = {};
      if (!gl) return uniforms;
      const count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
      for (let i = 0; i < count; i++) {
        const info = gl.getActiveUniform(program, i);
        if (info) {
          uniforms[info.name] = gl.getUniformLocation(program, info.name);
        }
      }
      return uniforms;
    };

    class Program {
      program: WebGLProgram | null;
      uniforms: Record<string, WebGLUniformLocation | null>;
      constructor(vs: WebGLShader | null, fs: WebGLShader | null) {
        this.program = createProgram(vs, fs);
        this.uniforms = this.program ? getUniforms(this.program) : {};
      }
      bind() {
        if (gl && this.program) gl.useProgram(this.program);
      }
    }

    class Material {
      vertexShader: WebGLShader | null;
      fragmentShaderSource: string;
      programs: Record<number, WebGLProgram | null>;
      activeProgram: WebGLProgram | null;
      uniforms: Record<string, WebGLUniformLocation | null>;
      constructor(vs: WebGLShader | null, fsSource: string) {
        this.vertexShader = vs;
        this.fragmentShaderSource = fsSource;
        this.programs = {};
        this.activeProgram = null;
        this.uniforms = {};
      }
      setKeywords(keywords: string[]) {
        let hash = 0;
        for (const kw of keywords) hash += hashCode(kw);
        let program = this.programs[hash];
        if (program == null) {
          const fs = compileShader(gl!.FRAGMENT_SHADER, this.fragmentShaderSource, keywords);
          program = createProgram(this.vertexShader, fs);
          this.programs[hash] = program;
        }
        if (program === this.activeProgram) return;
        if (program) this.uniforms = getUniforms(program);
        this.activeProgram = program;
      }
      bind() {
        if (gl && this.activeProgram) gl.useProgram(this.activeProgram);
      }
    }

    // -------------------- Shaders (Inspira UI Navier-Stokes core + Wine-Red & Exclusion Display) --------------------
    const baseVertexShader = compileShader(
      gl.VERTEX_SHADER,
      `
        precision highp float;
        attribute vec2 aPosition;
        varying vec2 vUv;
        varying vec2 vL;
        varying vec2 vR;
        varying vec2 vT;
        varying vec2 vB;
        uniform vec2 texelSize;

        void main () {
          vUv = aPosition * 0.5 + 0.5;
          vL = vUv - vec2(texelSize.x, 0.0);
          vR = vUv + vec2(texelSize.x, 0.0);
          vT = vUv + vec2(0.0, texelSize.y);
          vB = vUv - vec2(0.0, texelSize.y);
          gl_Position = vec4(aPosition, 0.0, 1.0);
        }
      `
    );

    const copyShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        uniform sampler2D uTexture;

        void main () {
          gl_FragColor = texture2D(uTexture, vUv);
        }
      `
    );

    const clearShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        uniform sampler2D uTexture;
        uniform float value;

        void main () {
          gl_FragColor = value * texture2D(uTexture, vUv);
        }
      `
    );

    const displayShaderSource = `
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uTexture;
      uniform vec2 texelSize;
      uniform float uGlobalOpacity;
      uniform vec4 uExcludeRect1;
      uniform vec4 uExcludeRect2;

      float rectMask(vec2 uv, vec4 rect) {
        if (rect.z <= rect.x || rect.w <= rect.y) return 1.0;
        float pad = 0.018;
        float inX = smoothstep(rect.x - pad, rect.x + 0.002, uv.x) *
                    (1.0 - smoothstep(rect.z - 0.002, rect.z + pad, uv.x));
        float inY = smoothstep(rect.y - pad, rect.y + 0.002, uv.y) *
                    (1.0 - smoothstep(rect.w - 0.002, rect.w + pad, uv.y));
        return 1.0 - clamp(inX * inY, 0.0, 1.0);
      }

      void main () {
        float zoneMask = rectMask(vUv, uExcludeRect1) * rectMask(vUv, uExcludeRect2);
        if (uGlobalOpacity <= 0.002 || zoneMask <= 0.002) {
          gl_FragColor = vec4(0.0);
          return;
        }

        vec3 raw = texture2D(uTexture, vUv).rgb;
        #ifdef SHADING
          vec3 lc = texture2D(uTexture, vL).rgb;
          vec3 rc = texture2D(uTexture, vR).rgb;
          vec3 tc = texture2D(uTexture, vT).rgb;
          vec3 bc = texture2D(uTexture, vB).rgb;

          float dx = length(rc) - length(lc);
          float dy = length(tc) - length(bc);
          vec3 n = normalize(vec3(dx, dy, length(texelSize) * 1.4));
          vec3 l = vec3(0.0, 0.0, 1.0);
          float diffuse = clamp(dot(n, l) + 0.68, 0.68, 1.0);
          raw *= diffuse;
        #endif

        // Restrained dark wine-red spectrum: deeper burgundy core to crimson edge, zero neon/white
        float peak = max(raw.r, max(raw.g, raw.b));
        float density = smoothstep(0.008, 0.32, peak);
        vec3 wineTone = mix(
          vec3(0.42, 0.06, 0.14),
          vec3(0.76, 0.15, 0.30),
          clamp(peak * 1.45, 0.0, 1.0)
        );
        float alpha = density * uGlobalOpacity * zoneMask;
        gl_FragColor = vec4(wineTone * alpha, alpha);
      }
    `;

    const splatShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
        precision highp float;
        precision highp sampler2D;
        varying vec2 vUv;
        uniform sampler2D uTarget;
        uniform float aspectRatio;
        uniform vec3 color;
        uniform vec2 point;
        uniform float radius;

        void main () {
          vec2 p = vUv - point.xy;
          p.x *= aspectRatio;
          vec3 splat = exp(-dot(p, p) / radius) * color;
          vec3 base = texture2D(uTarget, vUv).xyz;
          gl_FragColor = vec4(base + splat, 1.0);
        }
      `
    );

    const advectionShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
        precision highp float;
        precision highp sampler2D;
        varying vec2 vUv;
        uniform sampler2D uVelocity;
        uniform sampler2D uSource;
        uniform vec2 texelSize;
        uniform vec2 dyeTexelSize;
        uniform float dt;
        uniform float dissipation;

        vec4 bilerp (sampler2D sam, vec2 uv, vec2 tsize) {
          vec2 st = uv / tsize - 0.5;
          vec2 iuv = floor(st);
          vec2 fuv = fract(st);
          vec4 a = texture2D(sam, (iuv + vec2(0.5, 0.5)) * tsize);
          vec4 b = texture2D(sam, (iuv + vec2(1.5, 0.5)) * tsize);
          vec4 c = texture2D(sam, (iuv + vec2(0.5, 1.5)) * tsize);
          vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) * tsize);
          return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);
        }

        void main () {
          #ifdef MANUAL_FILTERING
            vec2 coord = vUv - dt * bilerp(uVelocity, vUv, texelSize).xy * texelSize;
            vec4 result = bilerp(uSource, coord, dyeTexelSize);
          #else
            vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
            vec4 result = texture2D(uSource, coord);
          #endif
          float decay = 1.0 + dissipation * dt;
          gl_FragColor = result / decay;
        }
      `,
      ext.supportLinearFiltering ? null : ["MANUAL_FILTERING"]
    );

    const divergenceShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        varying highp vec2 vL;
        varying highp vec2 vR;
        varying highp vec2 vT;
        varying highp vec2 vB;
        uniform sampler2D uVelocity;

        void main () {
          float L = texture2D(uVelocity, vL).x;
          float R = texture2D(uVelocity, vR).x;
          float T = texture2D(uVelocity, vT).y;
          float B = texture2D(uVelocity, vB).y;
          vec2 C = texture2D(uVelocity, vUv).xy;
          if (vL.x < 0.0) { L = -C.x; }
          if (vR.x > 1.0) { R = -C.x; }
          if (vT.y > 1.0) { T = -C.y; }
          if (vB.y < 0.0) { B = -C.y; }
          float div = 0.5 * (R - L + T - B);
          gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
        }
      `
    );

    const curlShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        varying highp vec2 vL;
        varying highp vec2 vR;
        varying highp vec2 vT;
        varying highp vec2 vB;
        uniform sampler2D uVelocity;

        void main () {
          float L = texture2D(uVelocity, vL).y;
          float R = texture2D(uVelocity, vR).y;
          float T = texture2D(uVelocity, vT).x;
          float B = texture2D(uVelocity, vB).x;
          float vorticity = R - L - T + B;
          gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
        }
      `
    );

    const vorticityShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
        precision highp float;
        precision highp sampler2D;
        varying vec2 vUv;
        varying vec2 vL;
        varying vec2 vR;
        varying vec2 vT;
        varying vec2 vB;
        uniform sampler2D uVelocity;
        uniform sampler2D uCurl;
        uniform float curl;
        uniform float dt;

        void main () {
          float L = texture2D(uCurl, vL).x;
          float R = texture2D(uCurl, vR).x;
          float T = texture2D(uCurl, vT).x;
          float B = texture2D(uCurl, vB).x;
          float C = texture2D(uCurl, vUv).x;
          vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
          force /= length(force) + 0.0001;
          force *= curl * C;
          force.y *= -1.0;
          vec2 velocity = texture2D(uVelocity, vUv).xy;
          velocity += force * dt;
          velocity = min(max(velocity, -1000.0), 1000.0);
          gl_FragColor = vec4(velocity, 0.0, 1.0);
        }
      `
    );

    const pressureShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        varying highp vec2 vL;
        varying highp vec2 vR;
        varying highp vec2 vT;
        varying highp vec2 vB;
        uniform sampler2D uPressure;
        uniform sampler2D uDivergence;

        void main () {
          float L = texture2D(uPressure, vL).x;
          float R = texture2D(uPressure, vR).x;
          float T = texture2D(uPressure, vT).x;
          float B = texture2D(uPressure, vB).x;
          float divergence = texture2D(uDivergence, vUv).x;
          float pressure = (L + R + B + T - divergence) * 0.25;
          gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
        }
      `
    );

    const gradientSubtractShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        varying highp vec2 vL;
        varying highp vec2 vR;
        varying highp vec2 vT;
        varying highp vec2 vB;
        uniform sampler2D uPressure;
        uniform sampler2D uVelocity;

        void main () {
          float L = texture2D(uPressure, vL).x;
          float R = texture2D(uPressure, vR).x;
          float T = texture2D(uPressure, vT).x;
          float B = texture2D(uPressure, vB).x;
          vec2 velocity = texture2D(uVelocity, vUv).xy;
          velocity.xy -= vec2(R - L, T - B);
          gl_FragColor = vec4(velocity, 0.0, 1.0);
        }
      `
    );

    const vbo = gl.createBuffer();
    const ibo = gl.createBuffer();
    if (!vbo || !ibo) return;
    createdBuffers.push(vbo, ibo);

    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);

    const blit = (target: FBO | null, doClear = false) => {
      if (!gl) return;
      if (!target) {
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      } else {
        gl.viewport(0, 0, target.width, target.height);
        gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
      }
      if (doClear) {
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
      }
      gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
    };

    const copyProgram = new Program(baseVertexShader, copyShader);
    const clearProgram = new Program(baseVertexShader, clearShader);
    const splatProgram = new Program(baseVertexShader, splatShader);
    const advectionProgram = new Program(baseVertexShader, advectionShader);
    const divergenceProgram = new Program(baseVertexShader, divergenceShader);
    const curlProgram = new Program(baseVertexShader, curlShader);
    const vorticityProgram = new Program(baseVertexShader, vorticityShader);
    const pressureProgram = new Program(baseVertexShader, pressureShader);
    const gradientSubtractProgram = new Program(baseVertexShader, gradientSubtractShader);
    const displayMaterial = new Material(baseVertexShader, displayShaderSource);

    displayMaterial.setKeywords(config.SHADING ? ["SHADING"] : []);

    const createFBO = (
      w: number,
      h: number,
      internalFormat: number,
      format: number,
      type: number,
      param: number
    ): FBO => {
      gl!.activeTexture(gl!.TEXTURE0);
      const texture = gl!.createTexture()!;
      createdTextures.push(texture);
      gl!.bindTexture(gl!.TEXTURE_2D, texture);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MIN_FILTER, param);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MAG_FILTER, param);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_S, gl!.CLAMP_TO_EDGE);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_T, gl!.CLAMP_TO_EDGE);
      gl!.texImage2D(gl!.TEXTURE_2D, 0, internalFormat, w, h, 0, format, type, null);

      const fbo = gl!.createFramebuffer()!;
      createdFramebuffers.push(fbo);
      gl!.bindFramebuffer(gl!.FRAMEBUFFER, fbo);
      gl!.framebufferTexture2D(gl!.FRAMEBUFFER, gl!.COLOR_ATTACHMENT0, gl!.TEXTURE_2D, texture, 0);
      gl!.viewport(0, 0, w, h);
      gl!.clearColor(0, 0, 0, 0);
      gl!.clear(gl!.COLOR_BUFFER_BIT);

      return {
        texture,
        fbo,
        width: w,
        height: h,
        texelSizeX: 1 / w,
        texelSizeY: 1 / h,
        attach(id: number) {
          gl!.activeTexture(gl!.TEXTURE0 + id);
          gl!.bindTexture(gl!.TEXTURE_2D, texture);
          return id;
        },
      };
    };

    const createDoubleFBO = (
      w: number,
      h: number,
      internalFormat: number,
      format: number,
      type: number,
      param: number
    ): DoubleFBO => {
      const fbo1 = createFBO(w, h, internalFormat, format, type, param);
      const fbo2 = createFBO(w, h, internalFormat, format, type, param);
      return {
        width: w,
        height: h,
        texelSizeX: fbo1.texelSizeX,
        texelSizeY: fbo1.texelSizeY,
        read: fbo1,
        write: fbo2,
        swap() {
          const tmp = this.read;
          this.read = this.write;
          this.write = tmp;
        },
      };
    };

    const resizeFBO = (
      target: FBO,
      w: number,
      h: number,
      internalFormat: number,
      format: number,
      type: number,
      param: number
    ): FBO => {
      const newFbo = createFBO(w, h, internalFormat, format, type, param);
      copyProgram.bind();
      if (copyProgram.uniforms.uTexture) {
        gl!.uniform1i(copyProgram.uniforms.uTexture, target.attach(0));
      }
      blit(newFbo, false);
      return newFbo;
    };

    const resizeDoubleFBO = (
      target: DoubleFBO,
      w: number,
      h: number,
      internalFormat: number,
      format: number,
      type: number,
      param: number
    ): DoubleFBO => {
      if (target.width === w && target.height === h) return target;
      target.read = resizeFBO(target.read, w, h, internalFormat, format, type, param);
      target.write = createFBO(w, h, internalFormat, format, type, param);
      target.width = w;
      target.height = h;
      target.texelSizeX = 1 / w;
      target.texelSizeY = 1 / h;
      return target;
    };

    const getResolution = (resolution: number) => {
      const w = Math.max(1, gl!.drawingBufferWidth);
      const h = Math.max(1, gl!.drawingBufferHeight);
      const aspectRatio = w / h;
      const aspect = aspectRatio < 1 ? 1 / aspectRatio : aspectRatio;
      const min = Math.round(resolution);
      const max = Math.round(resolution * aspect);
      return w > h ? { width: max, height: min } : { width: min, height: max };
    };

    let dye: DoubleFBO;
    let velocity: DoubleFBO;
    let divergence: FBO;
    let curl: FBO;
    let pressure: DoubleFBO;

    const initFramebuffers = () => {
      const simRes = getResolution(config.SIM_RESOLUTION);
      const dyeRes = getResolution(config.DYE_RESOLUTION);
      const texType = ext.halfFloatTexType;
      const rgba = ext.formatRGBA;
      const rg = ext.formatRG;
      const r = ext.formatR;
      const filtering = ext.supportLinearFiltering ? gl!.LINEAR : gl!.NEAREST;

      gl!.disable(gl!.BLEND);

      if (!dye) {
        dye = createDoubleFBO(
          dyeRes.width,
          dyeRes.height,
          rgba.internalFormat,
          rgba.format,
          texType,
          filtering
        );
      } else {
        dye = resizeDoubleFBO(
          dye,
          dyeRes.width,
          dyeRes.height,
          rgba.internalFormat,
          rgba.format,
          texType,
          filtering
        );
      }

      if (!velocity) {
        velocity = createDoubleFBO(
          simRes.width,
          simRes.height,
          rg.internalFormat,
          rg.format,
          texType,
          filtering
        );
      } else {
        velocity = resizeDoubleFBO(
          velocity,
          simRes.width,
          simRes.height,
          rg.internalFormat,
          rg.format,
          texType,
          filtering
        );
      }

      divergence = createFBO(
        simRes.width,
        simRes.height,
        r.internalFormat,
        r.format,
        texType,
        gl!.NEAREST
      );
      curl = createFBO(
        simRes.width,
        simRes.height,
        r.internalFormat,
        r.format,
        texType,
        gl!.NEAREST
      );
      pressure = createDoubleFBO(
        simRes.width,
        simRes.height,
        r.internalFormat,
        r.format,
        texType,
        gl!.NEAREST
      );
    };

    const resizeCanvas = () => {
      const dpr = 1;
      const width = Math.max(1, Math.floor(canvas.clientWidth * dpr));
      const height = Math.max(1, Math.floor(canvas.clientHeight * dpr));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        return true;
      }
      return false;
    };

    resizeCanvas();
    initFramebuffers();

    const correctRadius = (radius: number) => {
      const aspectRatio = canvas.width / Math.max(1, canvas.height);
      return aspectRatio > 1 ? radius * aspectRatio : radius;
    };

    const splat = (x: number, y: number, dx: number, dy: number, color: ColorRGB, radiusUv: number) => {
      if (!gl) return;
      gl.disable(gl.BLEND);
      splatProgram.bind();
      if (splatProgram.uniforms.uTarget) {
        gl.uniform1i(splatProgram.uniforms.uTarget, velocity.read.attach(0));
      }
      if (splatProgram.uniforms.aspectRatio) {
        gl.uniform1f(splatProgram.uniforms.aspectRatio, canvas.width / Math.max(1, canvas.height));
      }
      if (splatProgram.uniforms.point) {
        gl.uniform2f(splatProgram.uniforms.point, x, y);
      }
      if (splatProgram.uniforms.color) {
        gl.uniform3f(splatProgram.uniforms.color, dx, dy, 0);
      }
      if (splatProgram.uniforms.radius) {
        gl.uniform1f(splatProgram.uniforms.radius, correctRadius(radiusUv));
      }
      blit(velocity.write);
      velocity.swap();

      if (splatProgram.uniforms.uTarget) {
        gl.uniform1i(splatProgram.uniforms.uTarget, dye.read.attach(0));
      }
      if (splatProgram.uniforms.color) {
        gl.uniform3f(splatProgram.uniforms.color, color.r, color.g, color.b);
      }
      blit(dye.write);
      dye.swap();
    };

    const step = (dt: number) => {
      if (!gl) return;
      gl.disable(gl.BLEND);

      // Curl
      curlProgram.bind();
      if (curlProgram.uniforms.texelSize) {
        gl.uniform2f(curlProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      }
      if (curlProgram.uniforms.uVelocity) {
        gl.uniform1i(curlProgram.uniforms.uVelocity, velocity.read.attach(0));
      }
      blit(curl);

      // Vorticity confinement (kept very gentle so wake flows like ink in water)
      vorticityProgram.bind();
      if (vorticityProgram.uniforms.texelSize) {
        gl.uniform2f(vorticityProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      }
      if (vorticityProgram.uniforms.uVelocity) {
        gl.uniform1i(vorticityProgram.uniforms.uVelocity, velocity.read.attach(0));
      }
      if (vorticityProgram.uniforms.uCurl) {
        gl.uniform1i(vorticityProgram.uniforms.uCurl, curl.attach(1));
      }
      if (vorticityProgram.uniforms.curl) {
        gl.uniform1f(vorticityProgram.uniforms.curl, config.CURL);
      }
      if (vorticityProgram.uniforms.dt) {
        gl.uniform1f(vorticityProgram.uniforms.dt, dt);
      }
      blit(velocity.write);
      velocity.swap();

      // Divergence
      divergenceProgram.bind();
      if (divergenceProgram.uniforms.texelSize) {
        gl.uniform2f(divergenceProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      }
      if (divergenceProgram.uniforms.uVelocity) {
        gl.uniform1i(divergenceProgram.uniforms.uVelocity, velocity.read.attach(0));
      }
      blit(divergence);

      // Clear pressure
      clearProgram.bind();
      if (clearProgram.uniforms.uTexture) {
        gl.uniform1i(clearProgram.uniforms.uTexture, pressure.read.attach(0));
      }
      if (clearProgram.uniforms.value) {
        gl.uniform1f(clearProgram.uniforms.value, config.PRESSURE);
      }
      blit(pressure.write);
      pressure.swap();

      // Pressure solver
      pressureProgram.bind();
      if (pressureProgram.uniforms.texelSize) {
        gl.uniform2f(pressureProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      }
      if (pressureProgram.uniforms.uDivergence) {
        gl.uniform1i(pressureProgram.uniforms.uDivergence, divergence.attach(0));
      }
      for (let i = 0; i < config.PRESSURE_ITERATIONS; i++) {
        if (pressureProgram.uniforms.uPressure) {
          gl.uniform1i(pressureProgram.uniforms.uPressure, pressure.read.attach(1));
        }
        blit(pressure.write);
        pressure.swap();
      }

      // Gradient subtract
      gradientSubtractProgram.bind();
      if (gradientSubtractProgram.uniforms.texelSize) {
        gl.uniform2f(
          gradientSubtractProgram.uniforms.texelSize,
          velocity.texelSizeX,
          velocity.texelSizeY
        );
      }
      if (gradientSubtractProgram.uniforms.uPressure) {
        gl.uniform1i(gradientSubtractProgram.uniforms.uPressure, pressure.read.attach(0));
      }
      if (gradientSubtractProgram.uniforms.uVelocity) {
        gl.uniform1i(gradientSubtractProgram.uniforms.uVelocity, velocity.read.attach(1));
      }
      blit(velocity.write);
      velocity.swap();

      // Advect velocity
      advectionProgram.bind();
      if (advectionProgram.uniforms.texelSize) {
        gl.uniform2f(advectionProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      }
      if (!ext.supportLinearFiltering && advectionProgram.uniforms.dyeTexelSize) {
        gl.uniform2f(advectionProgram.uniforms.dyeTexelSize, velocity.texelSizeX, velocity.texelSizeY);
      }
      const velocityId = velocity.read.attach(0);
      if (advectionProgram.uniforms.uVelocity) gl.uniform1i(advectionProgram.uniforms.uVelocity, velocityId);
      if (advectionProgram.uniforms.uSource) gl.uniform1i(advectionProgram.uniforms.uSource, velocityId);
      if (advectionProgram.uniforms.dt) gl.uniform1f(advectionProgram.uniforms.dt, dt);
      if (advectionProgram.uniforms.dissipation) {
        gl.uniform1f(advectionProgram.uniforms.dissipation, config.VELOCITY_DISSIPATION);
      }
      blit(velocity.write);
      velocity.swap();

      // Advect dye
      if (!ext.supportLinearFiltering && advectionProgram.uniforms.dyeTexelSize) {
        gl.uniform2f(advectionProgram.uniforms.dyeTexelSize, dye.texelSizeX, dye.texelSizeY);
      }
      if (advectionProgram.uniforms.uVelocity) {
        gl.uniform1i(advectionProgram.uniforms.uVelocity, velocity.read.attach(0));
      }
      if (advectionProgram.uniforms.uSource) {
        gl.uniform1i(advectionProgram.uniforms.uSource, dye.read.attach(1));
      }
      if (advectionProgram.uniforms.dissipation) {
        gl.uniform1f(advectionProgram.uniforms.dissipation, config.DENSITY_DISSIPATION);
      }
      blit(dye.write);
      dye.swap();
    };

    const renderDisplay = (globalOpacity: number) => {
      if (!gl) return;
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.enable(gl.BLEND);
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      if (globalOpacity <= 0.002) return;

      displayMaterial.bind();
      if (config.SHADING && displayMaterial.uniforms.texelSize) {
        gl.uniform2f(
          displayMaterial.uniforms.texelSize,
          1 / Math.max(1, gl.drawingBufferWidth),
          1 / Math.max(1, gl.drawingBufferHeight)
        );
      }
      if (displayMaterial.uniforms.uTexture) {
        gl.uniform1i(displayMaterial.uniforms.uTexture, dye.read.attach(0));
      }
      if (displayMaterial.uniforms.uGlobalOpacity) {
        gl.uniform1f(displayMaterial.uniforms.uGlobalOpacity, globalOpacity);
      }
      if (displayMaterial.uniforms.uExcludeRect1) {
        const [x1, y1, x2, y2] = particleBridge.excludeServicesUv;
        gl.uniform4f(displayMaterial.uniforms.uExcludeRect1, x1, y1, x2, y2);
      }
      if (displayMaterial.uniforms.uExcludeRect2) {
        const [x1, y1, x2, y2] = particleBridge.excludeFooterUv;
        gl.uniform4f(displayMaterial.uniforms.uExcludeRect2, x1, y1, x2, y2);
      }
      blit(null, false);
    };

    let contextLost = false;
    const handleContextLost = (e: Event) => {
      e.preventDefault();
      contextLost = true;
    };
    const handleContextRestored = () => {
      contextLost = false;
      initFramebuffers();
    };
    canvas.addEventListener("webglcontextlost", handleContextLost);
    canvas.addEventListener("webglcontextrestored", handleContextRestored);

    let rafId = 0;
    let timerId: ReturnType<typeof setTimeout> | null = null;
    let disposed = false;
    let isSleeping = false;
    let clearedWhileIdle = false;
    let lastTime = performance.now();
    let lastFluidActivity = 0;
    let prevSpringUvX = 0.5;
    let prevSpringUvY = 0.5;
    let initializedCursor = false;
    let smoothedOpacity = 0;

    const wake = () => {
      if (disposed) return;
      if (
        particleBridge.fluidBlend <= 0.04 &&
        smoothedOpacity <= 0.002 &&
        particleBridge.pendingDissolveSeeds.length === 0
      ) {
        return;
      }
      lastFluidActivity = performance.now();
      if (isSleeping) {
        isSleeping = false;
        lastTime = performance.now();
        rafId = requestAnimationFrame(tick);
      }
    };

    const tick = () => {
      if (disposed) return;

      const now = performance.now();
      const dt = Math.min(0.025, Math.max(0.004, (now - lastTime) / 1000));
      lastTime = now;

      let hadNewActivity = false;

      if (!contextLost) {
        if (resizeCanvas()) {
          initFramebuffers();
          hadNewActivity = true;
        }

        const fluidBlend = particleBridge.fluidBlend;
        const targetOpacity =
          fluidBlend *
          (particleBridge.cursorExcluded ? 0.08 : 1.0) *
          0.52;
        if (Math.abs(targetOpacity - smoothedOpacity) > 0.002) {
          hadNewActivity = true;
        }
        smoothedOpacity += (targetOpacity - smoothedOpacity) * Math.min(1, dt * 8);

        // 1. Consume dispersing hero wisps
        while (particleBridge.pendingDissolveSeeds.length > 0) {
          hadNewActivity = true;
          const seed = particleBridge.pendingDissolveSeeds.shift()!;
          const c = pickWineInkColor(seed.strength, now * 0.002);
          splat(
            seed.uvX,
            seed.uvY,
            seed.dx * 1500,
            seed.dy * 1500,
            { r: c.r * 0.9, g: c.g * 0.9, b: c.b * 0.9 },
            (config.SPLAT_RADIUS / 100) * 1.35
          );
        }

        // 2. Drive fluid wake directly from SmoothCursor spring stream
        if (
          particleBridge.hasPointerMoved &&
          particleBridge.cursorActive &&
          !particleBridge.cursorExcluded &&
          fluidBlend > 0.06
        ) {
          const vw = Math.max(1, window.innerWidth);
          const vh = Math.max(1, window.innerHeight);
          const uvX = clamp(particleBridge.springClientX / vw, 0, 1);
          const uvY = clamp(1 - particleBridge.springClientY / vh, 0, 1);

          if (!initializedCursor) {
            prevSpringUvX = uvX;
            prevSpringUvY = uvY;
            initializedCursor = true;
          }

          const rawDx = uvX - prevSpringUvX;
          const rawDy = uvY - prevSpringUvY;
          prevSpringUvX = uvX;
          prevSpringUvY = uvY;

          const aspectRatio = canvas.width / Math.max(1, canvas.height);
          const corrDx = aspectRatio < 1 ? rawDx * aspectRatio : rawDx;
          const corrDy = aspectRatio > 1 ? rawDy / aspectRatio : rawDy;
          const dist = Math.hypot(corrDx, corrDy);

          if (dist > 0.00015) {
            hadNewActivity = true;
            const speedRatio = clamp(dist * 28, 0.18, 1);
            const inkColor = pickWineInkColor(speedRatio, now * 0.0018);
            const baseR = config.SPLAT_RADIUS / 100;
            const [bow, wake] = computeBowAndWakeSplats(
              uvX,
              uvY,
              corrDx,
              corrDy,
              aspectRatio,
              baseR,
              config.SPLAT_FORCE
            );

            splat(
              bow.x,
              bow.y,
              bow.dx,
              bow.dy,
              {
                r: inkColor.r * bow.dyeScale * fluidBlend,
                g: inkColor.g * bow.dyeScale * fluidBlend,
                b: inkColor.b * bow.dyeScale * fluidBlend,
              },
              bow.radius
            );

            splat(
              wake.x,
              wake.y,
              wake.dx,
              wake.dy,
              {
                r: inkColor.r * wake.dyeScale * fluidBlend,
                g: inkColor.g * wake.dyeScale * fluidBlend,
                b: inkColor.b * wake.dyeScale * fluidBlend,
              },
              wake.radius
            );
          }
        }

        // 3. Subtle click impulse outside excluded regions
        while (particleBridge.pendingClickSplats.length > 0) {
          hadNewActivity = true;
          const click = particleBridge.pendingClickSplats.shift()!;
          if (!particleBridge.cursorExcluded && fluidBlend > 0.15) {
            const vw = Math.max(1, window.innerWidth);
            const vh = Math.max(1, window.innerHeight);
            const c = pickWineInkColor(0.55, now * 0.002);
            splat(
              clamp(click.clientX / vw, 0, 1),
              clamp(1 - click.clientY / vh, 0, 1),
              (Math.random() - 0.5) * 45,
              (Math.random() - 0.5) * 45,
              { r: c.r * 0.9 * fluidBlend, g: c.g * 0.9 * fluidBlend, b: c.b * 0.9 * fluidBlend },
              (config.SPLAT_RADIUS / 100) * 0.95
            );
          }
        }

        if (hadNewActivity) {
          lastFluidActivity = now;
        }

        const isRecentlyActive = lastFluidActivity > 0 && now - lastFluidActivity < 4200;

        if ((smoothedOpacity > 0.002 || fluidBlend > 0.04) && isRecentlyActive) {
          clearedWhileIdle = false;
          step(dt);
          renderDisplay(smoothedOpacity);
        } else {
          if (!clearedWhileIdle) {
            gl!.viewport(0, 0, gl!.drawingBufferWidth, gl!.drawingBufferHeight);
            gl!.bindFramebuffer(gl!.FRAMEBUFFER, null);
            gl!.clearColor(0, 0, 0, 0);
            gl!.clear(gl!.COLOR_BUFFER_BIT);
            clearedWhileIdle = true;
          }
          // Put fluid simulation cleanly to sleep when hidden on hero top or after dye fades out
          if (fluidBlend <= 0.04 || !isRecentlyActive) {
            isSleeping = true;
            return;
          }
        }
      }

      if (isSoftwareGl) {
        timerId = setTimeout(() => {
          if (!disposed) rafId = requestAnimationFrame(tick);
        }, 90);
      } else {
        rafId = requestAnimationFrame(tick);
      }
    };

    window.addEventListener("pointermove", wake, { passive: true });
    window.addEventListener("pointerdown", wake, { passive: true });
    window.addEventListener("scroll", wake, { passive: true });
    window.addEventListener("resize", wake, { passive: true });

    rafId = requestAnimationFrame(tick);

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      if (timerId) clearTimeout(timerId);
      window.removeEventListener("pointermove", wake);
      window.removeEventListener("pointerdown", wake);
      window.removeEventListener("scroll", wake);
      window.removeEventListener("resize", wake);
      canvas.removeEventListener("webglcontextlost", handleContextLost);
      canvas.removeEventListener("webglcontextrestored", handleContextRestored);

      if (gl) {
        for (const tex of createdTextures) gl.deleteTexture(tex);
        for (const fbo of createdFramebuffers) gl.deleteFramebuffer(fbo);
        for (const buf of createdBuffers) gl.deleteBuffer(buf);
        for (const prog of createdPrograms) gl.deleteProgram(prog);
        for (const sh of compiledShaders) gl.deleteShader(sh);
      }
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[2] pointer-events-none select-none overflow-hidden"
    >
      <canvas
        ref={canvasRef}
        data-visual-layer="fluid-ink-canvas"
        className="block w-full h-full"
      />
    </div>
  );
}
