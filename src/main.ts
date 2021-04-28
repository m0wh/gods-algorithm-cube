import { init } from './ts/utils/three-helpers'
import raf from './ts/utils/raf'
import fx from './ts/effects'
import { AmbientLight, Color, ExtrudeBufferGeometry, Mesh, MeshStandardMaterial, Object3D, PointLight, Shape } from 'three'

const { camera, renderer, scene } = init()
renderer.pixelRatio = 2

const { composer } = fx({ renderer, scene, camera })

scene.background = new Color(0x090c0d)

camera.position.z = 5
camera.position.x = 5
camera.position.y = 5

function createBoxWithRoundedEdges (width, height, depth, radius0, smoothness) {
  const shape = new Shape()
  const eps = 0.00001
  const radius = radius0 - eps
  shape.absarc(eps, eps, eps, -Math.PI / 2, -Math.PI, true)
  shape.absarc(eps, height - radius * 2, eps, Math.PI, Math.PI / 2, true)
  shape.absarc(width - radius * 2, height - radius * 2, eps, Math.PI / 2, 0, true)
  shape.absarc(width - radius * 2, eps, eps, 0, -Math.PI / 2, true)
  const geometry = new ExtrudeBufferGeometry(shape, {
    depth: depth - radius0 * 2,
    bevelEnabled: true,
    bevelSegments: smoothness * 2,
    steps: 1,
    bevelSize: radius,
    bevelThickness: radius0,
    curveSegments: smoothness
  })

  geometry.center()

  return geometry
}

function group (...objects) {
  const gr = new Object3D()
  objects.forEach(obj => {
    scene.remove(obj)
    gr.add(obj)
  })
  scene.add(gr)
  return gr
}

const light1 = new PointLight(0xffffff, 2, 0, 2)
const light2 = new PointLight(0xffffff, 2, 0, 2)
const amb = new AmbientLight(0xffffff, 1)
light1.position.set(10, 20, 15)
light2.position.set(10, 20, 15)
scene.add(light1, light2, amb)

const colors = [0x110847, 0x085441, 0x111958, 0x07275a]

function createBox (x, y, z) {
  const box = new Object3D()
  const color = colors[Math.round(Math.random() * (colors.length - 1))]
  box.add(
    new Mesh(createBoxWithRoundedEdges(1, 1, 1, 0.07, 2), new MeshStandardMaterial({ color, metalness: 0, roughness: 0.2 }))
  )
  box.position.set(x, y, z)
  return box
}

const cube: Array<any> = [
  [
    [createBox(+1, +1, +1), createBox(+1, +1, +0), createBox(+1, +1, -1)],
    [createBox(+0, +1, +1), createBox(+0, +1, +0), createBox(+0, +1, -1)],
    [createBox(-1, +1, +1), createBox(-1, +1, +0), createBox(-1, +1, -1)]
  ],
  [
    [createBox(+1, +0, +1), createBox(+1, +0, +0), createBox(+1, +0, -1)],
    [createBox(+0, +0, +1), createBox(+0, +0, +0), createBox(+0, +0, -1)],
    [createBox(-1, +0, +1), createBox(-1, +0, +0), createBox(-1, +0, -1)]
  ],
  [
    [createBox(+1, -1, +1), createBox(+1, -1, +0), createBox(+1, -1, -1)],
    [createBox(+0, -1, +1), createBox(+0, -1, +0), createBox(+0, -1, -1)],
    [createBox(-1, -1, +1), createBox(-1, -1, +0), createBox(-1, -1, -1)]
  ]
]

cube.forEach(level => {
  level.forEach(line => {
    line.forEach(box => {
      scene.add(box)
    })
  })
})

// const A = [
//   group(...(cube.map(c => c[0]) as any).flat()),
//   group(...(cube.map(c => c[1]) as any).flat()),
//   group(...(cube.map(c => c[2]) as any).flat())
// ]

// const A = [
//   group(...cube[0].flat()),
//   group(...cube[1].flat()),
//   group(...cube[2].flat())
// ]

const A = [
  group(...(cube.map(c => c.map(b => b[0])) as any).flat()),
  group(...(cube.map(c => c.map(b => b[1])) as any).flat()),
  group(...(cube.map(c => c.map(b => b[2])) as any).flat())
]

raf.subscribe((time) => {
  A[0].rotation.z = time / 750
  A[1].rotation.z = time / -1000
  A[2].rotation.z = time / 1000
  composer.render()
})
