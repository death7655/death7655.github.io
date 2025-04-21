const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

renderer.setPixelRatio(window.devicePixelRatio);
const textureLoader = new THREE.TextureLoader();
const earthTexture = textureLoader.load('https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg');
const moonTexture = textureLoader.load('https://threejs.org/examples/textures/planets/moon_1024.jpg');

const earthGeometry = new THREE.SphereGeometry(2, 64, 64);
const earthMaterial = new THREE.MeshStandardMaterial({ map: earthTexture });
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
scene.add(earth);

const moonGeometry = new THREE.SphereGeometry(.6, 100, 1000);
const moonMaterial = new THREE.MeshStandardMaterial({ map: moonTexture });
const moon = new THREE.Mesh(moonGeometry, moonMaterial);
scene.add(moon);

const light = new THREE.PointLight(0xffffff, 1.75);
light.position.set(5, 5, 5);
scene.add(light);

function createStars() {
    const starsGeometry = new THREE.BufferGeometry();
    const starsVertices = [];

    for (let i = 0; i < 500; i++) {
        let x = (Math.random() - 0.5) * 200; 
        let y = (Math.random() - 0.5) * 200;
        let z = (Math.random() - 0.5) * 200;
        starsVertices.push(x, y, z);
    }

    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    
    const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.5 });
    const starField = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(starField);
}

createStars(); 

camera.position.set(0, 5, 10);
camera.lookAt(earth.position);

let moonAngle = 0;
function animate() {
    requestAnimationFrame(animate);
    
    earth.rotation.y += 0.002;
    
    moonAngle += 0.01;
    moon.position.set(
        Math.cos(moonAngle) * 5,
        0, 
        Math.sin(moonAngle) * 5
    );

    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});
