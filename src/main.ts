import { init } from './ts/utils/three-helpers'
import raf from './ts/utils/raf'
import fx from './ts/effects'
import { randomGenerator } from './ts/utils/helpers'
import { AmbientLight, Color, Mesh, MeshStandardMaterial, Object3D, PointLight } from 'three'
import { createBoxWithRoundedEdges, resetCubeRotation, selectFaceCubes } from './ts/rubiksHelpers'
import gsap from 'gsap/all'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const random = randomGenerator() // put seed here
gsap.registerPlugin(ScrollTrigger)

// INIT

const { camera, renderer, scene } = init()
renderer.pixelRatio = 2
scene.background = new Color(0x020202)

const { composer } = fx({ renderer, scene, camera })

camera.position.z = 8
camera.position.x = 8
camera.position.y = 8

// SKETCH

const light1 = new PointLight(0xffffff, 2, 0, 2)
const light2 = new PointLight(0xffffff, 2, 0, 2)
const amb = new AmbientLight(0xffffff, 1)
light1.position.set(10, 20, 15)
light2.position.set(-20, 40, 30)
scene.add(light1, light2, amb)

const colors = [0x110847, 0x085441, 0x111958, 0x07275a]

// creating rubiks cube
const rubiks = new Object3D()
for (let x = 0; x < 3; x++) {
  for (let y = 0; y < 3; y++) {
    for (let z = 0; z < 3; z++) {
      const wrapper = new Object3D()
      const color = colors[Math.round(random() * (colors.length - 1))]
      const geometry = createBoxWithRoundedEdges(0.98, 0.98, 0.98, 0.07, 2)
      const material = new MeshStandardMaterial({ color, metalness: 0.5, roughness: 0.2 })
      const mesh = new Mesh(geometry, material)
      mesh.position.set(x - 1, y - 1, z - 1)
      wrapper.add(mesh)
      rubiks.add(wrapper)
    }
  }
}
scene.add(rubiks)

rubiks.children.forEach(c => resetCubeRotation(c))

// cubes moves every 3.5 seconds

setInterval(() => {
  if (window.scrollY === 0 && !document.hidden) {
    const axis = ['x', 'y', 'z'][Math.round(random() * 2)]
    rubiks.children.forEach(c => resetCubeRotation(c))

    gsap.to(selectFaceCubes(rubiks, axis, Math.round(random() * 2)).map(c => c.rotation), {
      [axis]: Math.PI / 2 * Math.ceil(random() * 3),
      duration: 3,
      ease: 'expo.inOut'
    })
  }
}, 3500)

const cubeExplosion = gsap.timeline({
  scrollTrigger: {
    trigger: document.body,
    start: 'top',
    end: 'bottom',
    scrub: 0.5
  }
})

cubeExplosion.to(rubiks.scale, {
  x: 0.7,
  y: 0.7,
  z: 0.7
}, 0)

const rotationSpeed = { val: 0 }
cubeExplosion.to(rotationSpeed, {
  val: 1
}, 0)

rubiks.children.map(c => c.children[0]).forEach(c => {
  // c = un des 9 cubes du rubiks cube
  const pos = { x: c.position.x, y: c.position.y, z: c.position.z }
  const randA = random() + 7
  const randB = (random() - 0.5) * 10
  cubeExplosion.to(c.position, {
    x: pos.x * randA + randB,
    y: pos.y * randA + randB,
    z: pos.z * randA + randB
  }, 0)
})

// ANIMATION

raf.subscribe((time) => {
  const r = randomGenerator(3675)
  rubiks.children.map(c => c.children[0]).forEach(c => {
    c.rotation.x = time * rotationSpeed.val / 5000 * r()
    c.rotation.y = time * rotationSpeed.val / 5000 * r()
    c.rotation.z = time * rotationSpeed.val / 5000 * r()
  })
  composer.render()
})
