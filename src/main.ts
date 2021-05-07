import { init } from './ts/utils/three-helpers'
import raf from './ts/utils/raf'
import fx from './ts/effects'
import { randomGenerator } from './ts/utils/helpers'
import { AmbientLight, Mesh, MeshStandardMaterial, Object3D, PointLight } from 'three'
import { createBoxWithRoundedEdges, resetCubeRotation, selectFaceCubes } from './ts/rubiksHelpers'
import gsap from 'gsap/all'

const random = randomGenerator() // put seed here

// INIT

const { camera, renderer, scene } = init()
renderer.pixelRatio = 2

const { composer } = fx({ renderer, scene, camera })

camera.position.z = 10
camera.position.x = 10
camera.position.y = 10

// SKETCH

const light1 = new PointLight(0xffffff, 2, 0, 2)
const light2 = new PointLight(0xffffff, 2, 0, 2)
const amb = new AmbientLight(0xffffff, 1)
light1.position.set(10, 20, 15)
light2.position.set(10, 20, 15)
scene.add(light1, light2, amb)

const colors = [0x110847, 0x085441, 0x111958, 0x07275a]

const rubiks = new Object3D()
for (let x = 0; x < 3; x++) {
  for (let y = 0; y < 3; y++) {
    for (let z = 0; z < 3; z++) {
      const wrapper = new Object3D()
      const color = colors[Math.round(random() * (colors.length - 1))]
      const geometry = createBoxWithRoundedEdges(0.98, 0.98, 0.98, 0.07, 2)
      const material = new MeshStandardMaterial({ color, metalness: 0, roughness: 0.2 })
      const mesh = new Mesh(geometry, material)
      mesh.position.set(x - 1, y - 1, z - 1)
      wrapper.add(mesh)
      rubiks.add(wrapper)
    }
  }
}
scene.add(rubiks)

rubiks.children.forEach(c => resetCubeRotation(c))

const cubeMoves = true
setInterval(() => {
  if (cubeMoves) {
    const axis = ['x', 'y', 'z'][Math.round(random() * 2)]
    rubiks.children.forEach(c => resetCubeRotation(c))

    gsap.to(selectFaceCubes(rubiks, axis, Math.round(random() * 2)).map(c => c.rotation), {
      [axis]: Math.PI / 2 * Math.ceil(random() * 3),
      duration: 3,
      ease: 'expo.inOut'
    })
  }
}, 3500)

// ANIMATION

raf.subscribe((time) => {
  composer.render()
})
