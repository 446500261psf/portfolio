export const basinVertexShader = /* glsl */ `
varying vec2 vBasinXY;
varying vec3 vNormalW;
varying vec3 vPosW;
varying float vRho;

uniform float uA;
uniform float uB;
uniform float uN;

void main() {
  vBasinXY = position.xy;
  float rho = pow(abs(position.x / uA), uN) + pow(abs(position.y / uB), uN);
  vRho = rho;
  vNormalW = normalize(normalMatrix * normal);
  vPosW = (modelMatrix * vec4(position, 1.0)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

export const basinFragmentShader = /* glsl */ `
varying vec2 vBasinXY;
varying vec3 vNormalW;
varying vec3 vPosW;
varying float vRho;

uniform vec3 uColorInner;
uniform vec3 uColorOuter;
uniform vec3 uColorAccent;
uniform float uTime;
uniform float uBreath;
uniform float uRimStrength;
uniform float uHueDrift;
uniform vec3 uColorDual;
uniform int uGradientType;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

void main() {
  float rho = clamp(vRho, 0.0, 1.0);
  float edge = smoothstep(0.55, 0.95, rho);

  vec3 outer = uColorOuter;
  if (uHueDrift > 0.0) {
    float t = (sin(uTime * 0.14) + 1.0) * 0.5;
    outer = mix(uColorOuter, uColorDual, t * uHueDrift);
  }

  vec3 col;
  if (uGradientType == 0) {
    col = mix(uColorInner, outer, pow(rho, 0.85));
  } else if (uGradientType == 1) {
    float t = (vBasinXY.y / uB + 1.0) * 0.5;
    col = mix(uColorOuter, uColorInner, t);
  } else {
    float t = (vBasinXY.x / uA + 1.0) * 0.5;
    col = mix(uColorOuter, uColorInner, t);
  }

  col *= uBreath;

  float rim = edge * uRimStrength;
  col += uColorAccent * rim * 0.45;

  vec3 viewDir = normalize(cameraPosition - vPosW);
  float fresnel = pow(1.0 - max(dot(vNormalW, viewDir), 0.0), 3.0);
  col += vec3(1.0) * fresnel * 0.12 * (0.5 + edge);

  float grain = hash(vBasinXY * 40.0 + uTime * 0.02) * 0.03;
  col += grain;

  gl_FragColor = vec4(col, 1.0);
}
`

export function hexToVec3(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  return [
    parseInt(h.slice(0, 2), 16) / 255,
    parseInt(h.slice(2, 4), 16) / 255,
    parseInt(h.slice(4, 6), 16) / 255,
  ]
}

export function gradientTypeIndex(t: string): number {
  switch (t) {
    case 'linear-vertical':
      return 1
    case 'linear-horizontal':
      return 2
    default:
      return 0
  }
}
