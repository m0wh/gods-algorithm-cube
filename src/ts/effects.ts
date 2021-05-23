import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader'
import { Vector2 } from 'three'

export default function composer ({ renderer, scene, camera }) {
  const composer = new EffectComposer(renderer)
  composer.setSize(window.innerWidth * 2, window.innerHeight * 2)
  composer.addPass(new RenderPass(scene, camera))

  const bloomFx = new UnrealBloomPass(new Vector2(window.innerWidth * 2, window.innerHeight * 2), 0.8, 0.01, 0)
  composer.addPass(bloomFx)

  const fxaa = new ShaderPass(FXAAShader)
  composer.addPass(fxaa)

  return { composer }
}
