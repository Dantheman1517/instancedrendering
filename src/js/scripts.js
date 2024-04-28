import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {RGBELoader} from 'three/examples/jsm/loaders/RGBELoader.js';

const renderer = new THREE.WebGLRenderer({antialias: true});

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

renderer.setClearColor(0xFFEA00);

const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    -1000,
    0
);

camera.position.set(0, 0, -1000);
camera.lookAt(scene.position);

// scene.position.set(0, 0, 0);

const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1);
directionalLight.position.set(0, 10, 10);
scene.add(directionalLight);

const gltfLoader = new GLTFLoader();
const rgbeLoader = new RGBELoader();

renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 2;


const response = await fetch('../../left_cst_pos_rot.json');
let tracts = await response.json();

const tot_tracts_to_render = 1;
tracts = tracts.slice(0, tot_tracts_to_render);

let tot_cylinders = 0;
tracts.forEach(tract => {
    tract.forEach(pos_rot => {
        tot_cylinders += 1;
    });
});

console.log(tot_cylinders);
console.log(Math.random() * 40 - 20);


    
gltfLoader.load('./assets/cylinder.glb', function(glb) {
    const mesh = glb.scene.getObjectByName('Object_3');
    const geometry = mesh.geometry.clone();
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const ins_mesh = new THREE.InstancedMesh(geometry, material, tot_cylinders);
    scene.add(ins_mesh);

    
    // const dummy = new THREE.Object3D();
    let cylinder = new THREE.Object3D();
    let i = 0;
    tracts.forEach(tract => {
        tract.forEach(pos_rot => {
            
            cylinder = new THREE.Object3D();
            cylinder.position.set(pos_rot[0], pos_rot[1], pos_rot[2]);
            // cylinder.setRotationFromEuler(new THREE.Euler(pos_rot[3] * (Math.PI/180), pos_rot[5] * (Math.PI/180), pos_rot[4] * (Math.PI/180)));
            cylinder.rotation.set(pos_rot[5] * (Math.PI/180), pos_rot[4] * (Math.PI/180), pos_rot[3] * (Math.PI/180));
            console.log(cylinder);
            const cyl_scale = .1
            cylinder.scale.set(cyl_scale, .1, cyl_scale);
            cylinder.updateMatrix();
            ins_mesh.setMatrixAt(i, cylinder.matrix);
            // ins_mesh.setColorAt(i, new THREE.Color(Math.random() * 0xFFFFFF));
            ins_mesh.setColorAt(i, new THREE.Color(0xff0000));
            i += 1;
        });
    });



    // const cyl_scale = 5;
    // cylinder.position.set(1, 1, 1);
    // cylinder.rotation.set(1 , 1 , 1 );
    // // console.log(cylinder.rotation);
    // cylinder.scale.set(cyl_scale, 15, cyl_scale);
    // cylinder.updateMatrix();
    // ins_mesh.setMatrixAt(i, cylinder.matrix);
    // ins_mesh.setColorAt(i, new THREE.Color(Math.random() * 0xFFFFFF));
    // i += 1;


    // const cyl_scale = 5;
    // cylinder.position.set(tracts[0][0][0], tracts[0][0][1], tracts[0][0][2]);
    // cylinder.rotation.set(tracts[0][0][3] , tracts[0][0][5] , tracts[0][0][4] );
    // console.log(cylinder.rotation);
    // cylinder.scale.set(cyl_scale, 15, cyl_scale);
    // cylinder.updateMatrix();
    // ins_mesh.setMatrixAt(i, cylinder.matrix);
    // ins_mesh.setColorAt(i, new THREE.Color(Math.random() * 0xFFFFFF));
    // i += 1;

    // cylinder = new THREE.Object3D();
    // cylinder.position.set(tracts[0][1][0], tracts[0][1][1], tracts[0][1][2]);
    // cylinder.rotation.set(tracts[0][1][3] , tracts[0][1][5] , tracts[0][1][4] );
    // console.log(cylinder.rotation);
    // cylinder.scale.set(cyl_scale, 15, cyl_scale);
    // cylinder.updateMatrix();
    // ins_mesh.setMatrixAt(i, cylinder.matrix);
    // ins_mesh.setColorAt(i, new THREE.Color(Math.random() * 0xFFFFFF));
    // i += 1;
    

    // for(let i = 0; i < 10000; i++) {
    //     dummy.position.x = Math.random() * 40 - 20;
    //     dummy.position.y = Math.random() * 40 - 20;
    //     dummy.position.z = Math.random() * 40 - 20;

    //     dummy.rotation.x = Math.random() * 2 * Math.PI;
    //     dummy.rotation.y = Math.random() * 2 * Math.PI;
    //     dummy.rotation.z = Math.random() * 2 * Math.PI;

    //     dummy.scale.x = dummy.scale.y = dummy.scale.z = 1 * Math.random();

    //     dummy.updateMatrix();
    //     ins_mesh.setMatrixAt(i, dummy.matrix);
    //     ins_mesh.setColorAt(i, new THREE.Color(Math.random() * 0xFFFFFF));
    // }
});

// const geometry = new THREE.IcosahedronGeometry();
// const material = new THREE.MeshPhongMaterial({color: 0xFFEA00});
// const mesh = new THREE.InstancedMesh(geometry, material, 10000);
// scene.add(mesh);

// const dummy = new THREE.Object3D();
// for(let i = 0; i < 10000; i++) {
//     dummy.position.x = Math.random() * 40 - 20;
//     dummy.position.y = Math.random() * 40 - 20;
//     dummy.position.z = Math.random() * 40 - 20;

//     dummy.rotation.x = Math.random() * 2 * Math.PI;
//     dummy.rotation.y = Math.random() * 2 * Math.PI;
//     dummy.rotation.z = Math.random() * 2 * Math.PI;

//     dummy.scale.x = dummy.scale.y = dummy.scale.z = Math.random();

//     dummy.updateMatrix();
//     mesh.setMatrixAt(i, dummy.matrix);
//     mesh.setColorAt(i, new THREE.Color(Math.random() * 0xFFFFFF));
// }

// const matrix = new THREE.Matrix4();
function animate(time) {
    // for(let i = 0; i < 10000; i++) {
    //     mesh.getMatrixAt(i, matrix);
    //     matrix.decompose(dummy.position, dummy.rotation, dummy.scale);

    //     dummy.rotation.x = i/10000 * time/1000;
    //     dummy.rotation.y = i/10000 * time/500;
    //     dummy.rotation.z = i/10000 * time/1200;
    
    //     dummy.updateMatrix();
    //     mesh.setMatrixAt(i, dummy.matrix);
    // }
    // mesh.instanceMatrix.needsUpdate = true;

    // mesh.rotation.y = time / 10000;

    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});