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

renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 2;


const response = await fetch('../../quat_pos_rot.json');
let tracts = await response.json();

const tot_tracts_to_render = 500
tracts = tracts.slice(0, tot_tracts_to_render);

let tot_cylinders = 0;
tracts.forEach(tract => {
    tract.forEach(pos_rot => {
        tot_cylinders += 1;
    });
});



    

gltfLoader.load('./assets/cylinder.glb', function(glb) {
    const mesh = glb.scene.getObjectByName('Object_3');
    const geometry = mesh.geometry.clone();
    const material = new THREE.MeshPhongMaterial({ color: 0xff0000 }); // Changed from MeshBasicMaterial to MeshPhongMaterial
    const ins_mesh = new THREE.InstancedMesh(geometry, material, tot_cylinders);
    ins_mesh.castShadow = true; // Enable shadow casting for the cylinders
    ins_mesh.receiveShadow = true;
    scene.add(ins_mesh);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Soft white light
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.75);
    directionalLight.position.set(0, 1, 0); // Adjust as needed
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Instance placement
    let cylinder = new THREE.Object3D();
    let i = 0;
    tracts.forEach(tract => {
        console.log(tract);
        tract.forEach(pos_rot => {
            
            cylinder = new THREE.Object3D();
            cylinder.position.set(pos_rot[0], pos_rot[1], pos_rot[2]);
            cylinder.rotation.set(pos_rot[3], pos_rot[4], pos_rot[5]);
            const cyl_scale = .02;
            cylinder.scale.set(cyl_scale, .1, cyl_scale);
            cylinder.updateMatrix();
            ins_mesh.setMatrixAt(i, cylinder.matrix);

            

            ins_mesh.setColorAt(i, new THREE.Color(0xff0000 * pos_rot[0])); // Consider varying the color slightly if needed
            i += 1;
        });
    });

    // let two_rots = [[1.393, .292, .354], [1.393, .27168, .32404]];

    // let cylinder = new THREE.Object3D();
    // let i = 0;
    // tracts.slice(0, 1).forEach(tract => {
    //     // for(let j = 0; j < Math.floor(tract.length/3); j++) {
    //     for(let j = 0; j < tot_cylinders; j++) {
    //         let x1 = tract[j * 3];
    //         let y1 = tract[j * 3 + 1];
    //         let z1 = tract[j * 3 + 2];
    //         let x2 = tract[j * 3 + 3];
    //         let y2 = tract[j * 3 + 4];
    //         let z2 = tract[j * 3 + 5];
    //         console.log("point1", x1, y1, z1);
    //         console.log("point2", x2, y2, z2);

    //         // let x = (x1 + x2) / 2;
    //         // let y = (y1 + y2) / 2;
    //         // let z = (z1 + z2) / 2;

    //         let dx = x2 - x1;
    //         let dy = y2 - y1;
    //         let dz = z2 - z1;
    //         console.log("dx, dy, dz", dx, dy, dz);

    //         // let length = Math.sqrt(dx * dx + dy * dy + dz * dz);

    //         // // cylinder = new THREE.Object3D();
    //         // cylinder.position.set(x, y, z);
    //         // cylinder.rotation.set(0, Math.atan2(dy, dx), Math.acos(dz/length));
    //         // const cyl_scale = .02;
    //         // cylinder.scale.set(cyl_scale, .1, cyl_scale);
    //         // cylinder.updateMatrix();
    //         // ins_mesh.setMatrixAt(i, cylinder.matrix);
    //         // i+=1;

    //         // Create a normalized direction vector
    
    //         // Use the normalized vector to create a quaternion
    //         // let dirVector = new THREE.Vector3(dx, dy, dz).normalize();
    //         // let quaternion = new THREE.Quaternion();
    //         // quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dirVector);
    //         // let theta = Math.atan2(dy, dx);  // Rotation around Z-axis
    //         // let phi = Math.atan2(Math.sqrt(dx * dx + dy * dy), dz);  // Rotation around X-axis
    //         // let phi = Math.atan2(dy, dz);
    //         // let theta  = Math.atan2(dy, dx);


    //         const magnitude = Math.sqrt(dx * dx + dy * dy + dz * dz);

    //         // Normalize the target vector
    //         const norm_x = dx / magnitude;
    //         const norm_y = dy / magnitude;
    //         const norm_z = dz / magnitude;

    //         const up_axis_x = 0;
    //         const up_axis_y = 1;
    //         const up_axis_z = 0;

    //         const yaw = Math.atan2(norm_x, norm_z);
    //         const pitch = Math.asin(-norm_y);
    //         const roll = Math.atan2(up_axis_y * norm_x - up_axis_x * norm_y, up_axis_x * norm_x + up_axis_y * norm_y);

    //         // Calculate angles
    //         // const thetaX = Math.atan2(nz, ny);  // Rotation about X-axis
    //         // const thetaY = Math.atan2(nx, Math.sqrt(ny * ny + nz * nz));  // Rotation about Y-axis
    //         // const thetaZ = 0;  // Typically no rotation needed about Z-axis for this transformation

    //         cylinder.rotation.set(yaw, pitch, roll);



    //         // Set cylinder position to the midpoint
    //         let x = (x1 + x2) / 2;
    //         let y = (y1 + y2) / 2;
    //         let z = (z1 + z2) / 2;
    //         cylinder.position.set(x, y, z);

    //         // Apply the quaternion to the cylinder
    //         // cylinder.setRotationFromQuaternion(quaternion);
    //         // console.log("quaternion", quaternion);
    //         console.log("rotation", cylinder.rotation);

    //         // cylinder.rotation.set(-phi, 0, theta);  // -phi because Three.js uses a right-handed coordinate system
    //         // cylinder.rotation.set(0, phi, -theta);
    //         // cylinder.rotation.set(two_rots[j][0], two_rots[j][1], two_rots[j][2]);


    //         const cyl_scale = 0.05;
    //         cylinder.scale.set(cyl_scale, .1, cyl_scale);  // Adjust the length scaling factor
    //         cylinder.updateMatrix();
    //         ins_mesh.setMatrixAt(i, cylinder.matrix);
    //         i += 1;
    //     };
    // }); 


    // Optional: Configure shadows on the renderer
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Soft shadows
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