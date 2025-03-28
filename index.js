const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('threejs-container').appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Lighting
scene.add(new THREE.AmbientLight(0xaaaaaa, 1.0));

// Starfield
const createStarField = (count, size, range, opacity) => {
    const geometry = new THREE.BufferGeometry();
    const material = new THREE.PointsMaterial({ size, transparent: true, opacity, vertexColors: true });
    
    const vertices = [];
    const colors = [];
    for (let i = 0; i < count; i++) {
        const x = (Math.random() - 0.5) * range;
        const y = (Math.random() - 0.5) * range;
        const z = (Math.random() - 0.5) * range;
        vertices.push(x, y, z);
        
        const color = new THREE.Color();
        const colorOptions = [0xffffff, 0xff4500, 0x87ceeb];
        color.setHex(colorOptions[Math.floor(Math.random() * colorOptions.length)]);
        colors.push(color.r, color.g, color.b);
    }
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    
    const points = new THREE.Points(geometry, material);
    scene.add(points);
    return points;
};

const stars = createStarField(2000, 3, 4000, 0.9);
const bgStars = createStarField(10000, 6, 20000, 0.6);

// Generate random solar systems
const solarSystems = [];
for (let i = 0; i < 3; i++) {
    const system = new THREE.Group();
    const star = new THREE.Mesh(
        new THREE.SphereGeometry(7, 32, 32),
        new THREE.MeshStandardMaterial({ emissive: 0xffcc00, emissiveIntensity: 2 })
    );
    
    const starLight = new THREE.PointLight(0xffcc00, 1.5, 100);
    starLight.position.set(0, 0, 0);
    system.add(star);
    system.add(starLight);
    
    const planets = [];
    for (let j = 0; j < 3 + Math.floor(Math.random() * 5); j++) {
        const radius = Math.random() * 2.5 + 1.5;
        const planet = new THREE.Mesh(
            new THREE.SphereGeometry(radius, 32, 32),
            new THREE.MeshStandardMaterial({ color: Math.random() * 0xffffff, emissive: Math.random() * 0xffffff, emissiveIntensity: 0.3 })
        );
        planet.position.set(Math.random() * 50 - 25, Math.random() * 20 - 10, Math.random() * 50 - 25);
        planets.push({ mesh: planet, angle: Math.random() * Math.PI * 2, speed: Math.random() * 0.02 + 0.01 });
        system.add(planet);
    }
    
    system.position.set(Math.random() * 800 - 400, Math.random() * 400 - 200, Math.random() * -1000);
    scene.add(system);
    solarSystems.push({ system, planets });
}

const asteroids = createStarField(500, 2, 1000, 0.9);
asteroids.position.z = -300;

const shootingStars = createStarField(10, 4, 1000, 0.9);

camera.position.z = 10;

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    
    const positions = stars.geometry.attributes.position.array;
    for (let i = 2; i < positions.length; i += 3) {
        positions[i] += 1.5;
        if (positions[i] > 200) positions[i] = -200;
    }
    stars.geometry.attributes.position.needsUpdate = true;
    
    const bgPositions = bgStars.geometry.attributes.position.array;
    for (let i = 2; i < bgPositions.length; i += 3) {
        bgPositions[i] += 0.3;
        if (bgPositions[i] > 500) bgPositions[i] = -500;
    }
    bgStars.geometry.attributes.position.needsUpdate = true;
    
    solarSystems.forEach(({ system, planets }) => {
        system.position.z += 1;
        if (system.position.z > 30) {
            system.position.set(Math.random() * 800 - 400, Math.random() * 400 - 200, Math.random() * -1000);
        }
        
        planets.forEach(planet => {
            planet.angle += planet.speed;
            planet.mesh.position.x = Math.cos(planet.angle) * 20;
            planet.mesh.position.z = Math.sin(planet.angle) * 20;
        });
    });
    
    // Shooting stars effect
    const sPositions = shootingStars.geometry.attributes.position.array;
    for (let i = 0; i < sPositions.length; i += 3) {
        sPositions[i] -= 5;
        sPositions[i + 1] -= 2;
        if (sPositions[i] < -500) {
            sPositions[i] = (Math.random() - 0.5) * 1000;
            sPositions[i + 1] = (Math.random() - 0.5) * 1000;
        }
    }
    shootingStars.geometry.attributes.position.needsUpdate = true;
    
    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
