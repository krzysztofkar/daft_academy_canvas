import { visibleHeightAtZDepth, visibleWidthAtZDepth, lerp } from "../utils.js"
import { nextSlide } from "../main.js"
import { previousSlide } from "../main.js"

const raycaster = new THREE.Raycaster()
const objLoader = new THREE.OBJLoader()

let arrowBox = null
let arrowBoxRotation = 0
let reverseArrowBox = null
let reverseArrowBoxRotation = 0
const REVERSE = true

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.render(scene, camera)

document.body.append(renderer.domElement)

objLoader.load(
  'models/cube.obj',
  ({ children }) => {
    const screenBorderRight = visibleWidthAtZDepth(-10, camera) / 2
    const screenBottom = -visibleHeightAtZDepth(-10, camera) / 2

    addCube(children[0], nextSlide, screenBorderRight - 1.5, screenBottom + 1)

    animate()
  }
)

objLoader.load(
  'models/reverse_cube.obj',
  ({ children }) => {
    const screenBorderLeft = -visibleWidthAtZDepth(-10, camera) / 2
    const screenBottom = -visibleHeightAtZDepth(-10, camera) / 2

    addCube(children[0], previousSlide, screenBorderLeft + 1.5, screenBottom + 1, REVERSE)

    animate()
  }
)

const addCube = (object, callbackFn, x, y, reverse) => {
  const cubeMesh = object.clone()

  cubeMesh.scale.setScalar(.3)
  cubeMesh.rotation.set(THREE.Math.degToRad(90), 0, 0)

  const boundingBox = new THREE.Mesh(
    new THREE.BoxGeometry(.7, .7, .7),
    new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 })
  )

  boundingBox.position.x = x
  boundingBox.position.y = y
  boundingBox.position.z = -10

  boundingBox.add(cubeMesh)

  boundingBox.callbackFn = callbackFn

  reverse ? reverseArrowBox = boundingBox : arrowBox = boundingBox
  scene.add(boundingBox)
}

const animate = () => {
  if (arrowBox && reverseArrowBox) {
    arrowBoxRotation = lerp(arrowBoxRotation, 0, .07)
    arrowBox.rotation.set(THREE.Math.degToRad(arrowBoxRotation), 0, 0)

    reverseArrowBoxRotation = lerp(reverseArrowBoxRotation, 0, .07)
    reverseArrowBox.rotation.set(THREE.Math.degToRad(reverseArrowBoxRotation), 0, 0)
  }

  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}

export const handleThreeAnimation = (reverse = false) => {
  reverse ? reverseArrowBoxRotation = -360 : arrowBoxRotation = 360
}

window.addEventListener('click', () => {
  const mousePosition = new THREE.Vector2()
  mousePosition.x = (event.clientX / window.innerWidth) * 2 - 1
  mousePosition.y = -(event.clientY / window.innerHeight) * 2 + 1

  raycaster.setFromCamera(mousePosition, camera)
  console.log(arrowBox, reverseArrowBox)
  const interesctedObjects = raycaster.intersectObjects([arrowBox, reverseArrowBox])
  interesctedObjects.length && interesctedObjects[0].object.callbackFn()
})