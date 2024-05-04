import * as THREE from 'three';

// function createTextFile() {
fetch('left_cst_positions.json')
.then(response => response.json())
.then(tracts => {

    let tot_cylinders = 0;
    tracts.forEach(tract => {
        tract.forEach(pos_rot => {
            tot_cylinders += 1;
        });
    });


    var textContent = "[";
    let cylinder = new THREE.Object3D();
    tracts.forEach(tract => {
        textContent += "[";
        for(let j = 0; j < tot_cylinders; j++) {
            console.log(j);
            let x1 = tract[j * 3];
            let y1 = tract[j * 3 + 1];
            let z1 = tract[j * 3 + 2];
            let x2 = tract[j * 3 + 3];
            let y2 = tract[j * 3 + 4];
            let z2 = tract[j * 3 + 5];
            let x = (x1 + x2) / 2;
            let y = (y1 + y2) / 2;
            let z = (z1 + z2) / 2;
            textContent += x + ", " + y + ", " + z + ", ";

            let dx = x2 - x1;
            let dy = y2 - y1;
            let dz = z2 - z1;
            let dirVector = new THREE.Vector3(dx, dy, dz).normalize();
            let quaternion = new THREE.Quaternion();
            quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dirVector);
            cylinder.setRotationFromQuaternion(quaternion);
            textContent += cylinder.rotation.x + ", " + cylinder.rotation.y + ", " + cylinder.rotation.z;
        }
        textContent += "], ";
    });
    textContent += "]";

    // Create a Blob containing the text
    var blob = new Blob([textContent], { type: "text/plain" });

    // Create a link element
    var a = document.createElement("a");

    // Set the link's href attribute to a Blob URL
    a.href = URL.createObjectURL(blob);

    // Set the file name
    a.download = "quat_pos_rot.json";

    // Append the link to the body
    document.body.appendChild(a);

    // Programmatically click the link to trigger the download
    a.click();

    // Remove the link from the DOM
    document.body.removeChild(a);
})
.catch(error => console.error('Error fetching JSON:', error));
// }