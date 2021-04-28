uniform float amount;
uniform sampler2D tDiffuse;
varying vec2 vUv;

float random (vec2 p) {
  vec2 K1 = vec2(23.14069263277926, 2.665144142690225);
  return fract( cos( dot(p,K1) ) * 12345.6789 );
}

void main () {
  vec4 color = texture2D(tDiffuse, vUv);
  vec2 uvRandom = vUv;
  uvRandom.y *= random(vec2(uvRandom.y,amount));
  color.r += random(uvRandom * 2.) * 0.07;
  color.g += random(uvRandom * .5) * 0.07;
  color.b += random(uvRandom) * 0.07;
  gl_FragColor = vec4(color);
}
