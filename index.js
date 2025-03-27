// create scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true });

renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('threejs-container').appendChild(renderer.domElement);

// stars
const starGeometry = new THREE.BufferGeometry();
const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.5 });

const starVertices = [];
for (let i = 0; i < 1000; i++) {
    const x = (Math.random() - 0.5) * 2000;
    const y = (Math.random() - 0.5) * 2000;
    const z = (Math.random() - 0.5) * 2000;
    starVertices.push(x, y, z);
}

starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

// soft blue nebula glow
const nebulaGeometry = new THREE.SphereGeometry(100, 32, 32);
const nebulaMaterial = new THREE.MeshBasicMaterial({
    color: 0x304ffe,
    transparent: true,
    opacity: 0.05
});
const nebula = new THREE.Mesh(nebulaGeometry, nebulaMaterial);
scene.add(nebula);

const shootingStars = [];
const shootingStarMaterial = new THREE.MeshBasicMaterial({ color: 0xfff176 });
for (let i = 0; i < 5; i++) {
    const geometry = new THREE.SphereGeometry(0.5, 16, 16);
    const shootingStar = new THREE.Mesh(geometry, shootingStarMaterial);
    shootingStar.position.set(Math.random() * 100 - 50, Math.random() * 50 - 25, Math.random() * -200);
    scene.add(shootingStar);
    shootingStars.push(shootingStar);
}

camera.position.z = 5;

function animate() {
    requestAnimationFrame(animate);
    
    stars.rotation.x += 0.001;
    stars.rotation.y += 0.001;

    // shooting stars movement
    shootingStars.forEach(star => {
        star.position.z += 2;
        if (star.position.z > 5) {
            star.position.set(Math.random() * 100 - 50, Math.random() * 50 - 25, Math.random() * -200);
        }
    });

    // camera motion
    camera.position.x = Math.sin(Date.now() * 0.0001) * 2;
    camera.position.y = Math.cos(Date.now() * 0.0001) * 2;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

