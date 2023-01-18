import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
import { gsap } from 'gsap';

// console.log(gsap);
/**
 * Base
 */
const gui = new dat.GUI()

const myText = document.querySelector('.my-text');
const myText2 = document.querySelector('.my-text2');
const myText3 = document.querySelector('.my-text3');
const myText4 = document.querySelector('.my-text4');
// Set the initial state of the element to be hidden
gsap.set(myText, { opacity: 0, y: 50 });
gsap.set(myText2, { opacity: 0, y: 50 });
gsap.set(myText3, { opacity: 0, y: 50 });
gsap.set(myText4, { opacity: 0, y: 50 });


// enable controlls when button is clicked and hide the button

// Create a timeline
const tl = gsap.timeline({ repeat: 0, yoyo: true });

// Add the animation to the timeline
tl.to(myText, { duration: 3, opacity: 1, y: 0, ease: 'power3.out', delay: 1 })
    .to(myText, {
        duration: 1, opacity: 0, y: 50, delay: 2, onComplete: function () {
            myText.style.display = 'none';
        }
    })
    .to(myText2, {
        duration: 3, opacity: 1, y: 0, ease: 'power3.out', delay: 4,
    })
    .to(myText2, {
        duration: 1, opacity: 0, y: 50, delay: 2, onComplete: function () {
            myText2.style.display = 'none';
        }
    })
    .to(myText3, {
        duration: 3, opacity: 1, y: 0, ease: 'power3.out', delay: 2,
    })
    .to(myText3, {
        duration: 1, opacity: 0, y: 50, delay: 2,
    })
    .to(myText4, {
        duration: 3, opacity: 1, y: 0, ease: 'power3.out', delay: 0, display: 'block',
        onComplete: function () {
            controls.enabled = true;
        }
    })
    .to(myText4, {
        duration: 1, opacity: 0, y: 50, delay: 3,
    })



// Play the animation
tl.play();



const canvas = document.querySelector('canvas.webgl')
// gui.hide()
const scene = new THREE.Scene()
let startRotating = false
/**
 * Models
 */
const gltfLoader = new GLTFLoader()
const TextureLoader = new THREE.CubeTextureLoader()

const updateAllMaterials = () => {
    scene.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
            child.material.envMapIntensity = debugObject.envMapIntensity
            child.receiveShadow = true
            child.castShadow = true
            child.material.needsUpdate = true
        }
    })
}
const debugObject = {}
const environmentMap = TextureLoader.load(
    [
        '/environmentMap/px.jpg',
        '/environmentMap/nx.jpg',
        '/environmentMap/py.jpg',
        '/environmentMap/ny.jpg',
        '/environmentMap/pz.jpg',
        '/environmentMap/nz.jpg'

    ]
)
environmentMap.encoding = THREE.sRGBEncoding
scene.environment = environmentMap

debugObject.envMapIntensity = 5
gui.add(debugObject, 'envMapIntensity').min(0).max(10).step(0.001).onChange(updateAllMaterials)
let cameraMiddle = null
gltfLoader.load(
    '/models/camera2.glb',
    (gltf) => {

        gltf.scene.scale.set(3, 3, 3);
        gltf.scene.position.set(-0.17, 0.23, 5.85);
        const folder = gui.addFolder('cameraObject')
        folder.add(gltf.scene.position, 'x').min(-3).max(3).step(0.01).name('positionX')
        folder.add(gltf.scene.position, 'y').min(-3).max(3).step(0.01).name('positionY')
        folder.add(gltf.scene.position, 'z').min(-3).max(10).step(0.01).name('positionZ')
        folder.add(gltf.scene.rotation, 'x').min(-3).max(3).step(0.01).name('rotationX')
        folder.add(gltf.scene.rotation, 'y').min(-3).max(3).step(0.01).name('rotationY')
        folder.add(gltf.scene.rotation, 'z').min(-3).max(3).step(0.01).name('rotationZ')
        folder.add(gltf.scene.scale, 'x').min(-3).max(3).step(0.01).name('scaleX')
        folder.add(gltf.scene.scale, 'y').min(-3).max(3).step(0.01).name('scaleY')
        folder.add(gltf.scene.scale, 'z').min(-3).max(3).step(0.01).name('scaleZ')
        updateAllMaterials()
        cameraMiddle = gltf.scene
        scene.add(cameraMiddle);
    },
);

/**
 * Floor
 */
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: '#444444',
        metalness: 1,
        roughness: 0.2,
    })
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
const floorGui = gui.addFolder('floor')
floorGui.add(floor.material, 'metalness').min(0).max(1).step(0.001).name('metalness')
floorGui.add(floor.material, 'roughness').min(0).max(1).step(0.001).name('roughness')

scene.add(floor)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
scene.add(ambientLight)
const folder = gui.addFolder('lightAmbient')
folder.add(ambientLight, 'intensity').min(0).max(3).step(0.001).name('intensity')

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(-6, 5, 5)
scene.add(directionalLight)
const parameters = {
    color: 0xff0000
}

const directionalLightFolder = gui.addFolder('light')
directionalLightFolder.add(directionalLight.position, 'x').min(-6).max(6).step(0.01).name('positionX')
directionalLightFolder.add(directionalLight.position, 'y').min(-6).max(6).step(0.01).name('positionY')
directionalLightFolder.add(directionalLight.position, 'z').min(-6).max(6).step(0.01).name('positionZ')
directionalLightFolder.add(directionalLight, 'intensity').min(0).max(3).step(0.001).name('intensity')
directionalLightFolder.addColor(parameters, 'color').onChange(() => {
    directionalLight.color.set(parameters.color)
})

const LightPos = { x: directionalLight.position.x, y: directionalLight.position.y, z: directionalLight.position.z };
const newLightPos = { x: 6, y: 2, z: -2 };
const lightTween = new TWEEN.Tween(LightPos)
    .to(newLightPos, 5000)
    .easing(TWEEN.Easing.Quadratic.InOut)
    .onUpdate(() => {
        directionalLight.position.set(LightPos.x, LightPos.y, LightPos.z);
    })
    .onComplete(() => {
        setTimeout(() => {

            reverseLightTween.start();
        }, 1000);
    });

const reverseNewLightPos = { x: directionalLight.position.x, y: directionalLight.position.y, z: directionalLight.position.z };
const reverseLightTween = new TWEEN.Tween(LightPos)
    .to(reverseNewLightPos, 2000)
    .easing(TWEEN.Easing.Quadratic.InOut)
    .onUpdate(() => {
        directionalLight.position.set(LightPos.x, LightPos.y, LightPos.z);
    })
    .onComplete(() => {
        cameraTween.start();
    });

setTimeout(() => {
    lightTween.start();
}, 1000);



/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})
// Select the canvas element


// Add a mousedown event listener to the canvas
canvas.addEventListener('mousedown', () => {
    // Change the cursor to "grabbing"
    canvas.style.cursor = 'grabbing';
});

// Add a mouseup event listener to the canvas
canvas.addEventListener('mouseup', () => {
    // Change the cursor back to "grab"
    canvas.style.cursor = 'grab';
});
/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0.23, 0.67, 1.11)
// add position to dat gui
const cameraFolder = gui.addFolder('camera')
cameraFolder.add(camera.position, 'x').min(-3).max(3).step(0.01).name('positionX')
cameraFolder.add(camera.position, 'y').min(-3).max(3).step(0.01).name('positionY')
cameraFolder.add(camera.position, 'z').min(-3).max(3).step(0.01).name('positionZ')

scene.add(camera)

const cameraPos = { x: camera.position.x, y: camera.position.y, z: camera.position.z };
const newPos = { x: 2, y: 2, z: 1 };
const cameraTween = new TWEEN.Tween(cameraPos)
    .to(newPos, 2000)
    .easing(TWEEN.Easing.Quadratic.InOut)
    .onUpdate(() => {
        camera.position.set(cameraPos.x, cameraPos.y, cameraPos.z);
    })
    .onComplete(() => {
        setTimeout(() => {
            cameraTween2.start();
        }, 3000);
    });

//Create the second animation and chain it with the first animation
const newPos2 = { x: 5, y: 2, z: 5 };
const cameraTween2 = new TWEEN.Tween(cameraPos)
    .to(newPos2, 2000)
    .easing(TWEEN.Easing.Quadratic.InOut)
    .onUpdate(() => {
        camera.position.set(cameraPos.x, cameraPos.y, cameraPos.z);
    })
    .onComplete(() => {
        setTimeout(() => {
            cameraTween3.start();
        }, 2000);
    });

const newPos3 = { x: 0.67, y: 0.45, z: -1.76 };
const cameraTween3 = new TWEEN.Tween(cameraPos)
    .to(newPos3, 1000)
    .easing(TWEEN.Easing.Quadratic.InOut)
    .onUpdate(() => {
        camera.position.set(cameraPos.x, cameraPos.y, cameraPos.z);
    })
    .onComplete(() => {
        setTimeout(() => {
            cameraTween4.start();
        }, 5000);
    });
const newPos4 = { x: 0.47, y: 0.6, z: 1.92 };
const cameraTween4 = new TWEEN.Tween(cameraPos)
    .to(newPos4, 1000)
    .easing(TWEEN.Easing.Quadratic.InOut)
    .onUpdate(() => {
        camera.position.set(cameraPos.x, cameraPos.y, cameraPos.z);
    })
    .onComplete(() => {
        // controls.enabled = true;
        startRotating = true;

    });



const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 0.75, 0)
controls.enableDamping = true
controls.enabled = false
controls.dampingFactor = 0.04
controls.rotateSpeed = 1.4
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.physicallyCorrectLights = true
renderer.outputEncoding = THREE.sRGBEncoding
renderer.toneMapping = THREE.ReinhardToneMapping
renderer.toneMappingExposure = 3
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
gui.add(renderer, 'toneMappingExposure').min(0).max(10).step(0.001)



const clock = new THREE.Clock()
let previousTime = 0



// object in the middle

const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    controls.update()

    TWEEN.update();
    renderer.render(scene, camera)

    window.requestAnimationFrame(tick)
}

tick()