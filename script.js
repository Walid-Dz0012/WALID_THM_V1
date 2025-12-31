
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.115.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.115.0/examples/jsm/controls/OrbitControls.js';
import { OBJLoader } from 'https://cdn.jsdelivr.net/npm/three@0.115.0/examples/jsm/loaders/OBJLoader.js';
import { MeshSurfaceSampler } from 'https://cdn.jsdelivr.net/npm/three@0.115.0/examples/jsm/math/MeshSurfaceSampler.js';

/* ================= SoundCloud ================= */
const widget = SC.Widget(scWidget);
widget.bind(SC.Widget.Events.PLAY, () => {
  veil.style.display = "none";
  scWidget.style.display = "none";
  start();
});

/* ================= Scene ================= */
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  1,
  1000
);
camera.position.set(0, 5, 10);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xffaacc);
document.body.appendChild(renderer.domElement);

window.addEventListener("resize", onResize);

/* ================= Controls ================= */
const controls = new OrbitControls(camera, renderer.domElement);
controls.enablePan = false;
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.autoRotate = true;
controls.autoRotateSpeed = -0.5;
controls.minDistance = 5;
controls.maxDistance = 12.5;
controls.target.set(0, 4, 0);
controls.update();

/* ================= Base ================= */
const baseGeom = new THREE.CircleBufferGeometry(6, 64);
baseGeom.rotateX(-Math.PI * 0.5);
const base = new THREE.Mesh(
  baseGeom,
  new THREE.MeshBasicMaterial({ color: 0xff0088 })
);
base.position.y = -0.15;
scene.add(base);

/* ================= TEXTURE (Happy 2026 tata zoe) ================= */
const cnvs = document.createElement("canvas");
cnvs.width = 512;
cnvs.height = 128;
const ctx = cnvs.getContext("2d");

ctx.clearRect(0, 0, cnvs.width, cnvs.height);

// Happy 2026
ctx.fillStyle = "#FFD700";
ctx.font = "bold 42px Arial";
ctx.textAlign = "center";
ctx.textBaseline = "middle";
ctx.fillText("Happy 2026", cnvs.width / 2, cnvs.height / 2 - 26);

// tata zoe
ctx.fillStyle = "#ff0033";
ctx.font = "bold 36px Arial";
ctx.fillText("tata zoe", cnvs.width / 2, cnvs.height / 2 + 26);

const textTexture = new THREE.CanvasTexture(cnvs);

/* ================= Petals ================= */
const petals = [];
for (let i = 0; i < 9000; i++) {
  petals.push(
    THREE.Math.randFloatSpread(9),
    Math.random() * 10,
    THREE.Math.randFloatSpread(9)
  );
}

const petalGeo = new THREE.BufferGeometry();
petalGeo.setAttribute(
  "position",
  new THREE.Float32BufferAttribute(petals, 3)
);

const petalMat = new THREE.PointsMaterial({
  size: 0.25,
  color: 0xffaadd,
  map: textTexture,
  transparent: true
});

const petalPoints = new THREE.Points(petalGeo, petalMat);
scene.add(petalPoints);

/* ================= Tree Particles ================= */
const loader = new OBJLoader();
loader.load(
  'https://threejs.org/examples/models/obj/tree.obj',
  object => {
    const sampler = new MeshSurfaceSampler(object.children[0]).build();
    const pts = [];
    for (let i = 0; i < 1200; i++) {
      const p = new THREE.Vector3();
      sampler.sample(p);
      pts.push(p);
    }
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    const mat = new THREE.PointsMaterial({
      color: 0xffbbff,
      size: 0.25
    });
    const tree = new THREE.Points(geo, mat);
    tree.scale.setScalar(5);
    tree.rotation.y = Math.PI / 9;
    scene.add(tree);

    percentage.style.display = "none";
    scWidget.style.display = "block";
  },
  xhr => {
    percentage.innerText =
      (xhr.loaded / xhr.total * 100).toFixed(0) + "%";
  }
);

/* ================= Animation ================= */
const clock = new THREE.Clock();

function start() {
  renderer.setAnimationLoop(() => {
    const t = clock.getElapsedTime();
    petalPoints.rotation.y = t * 0.15;
    controls.update();
    renderer.render(scene, camera);
  });
}

/* ================= Resize ================= */
function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
									 }
