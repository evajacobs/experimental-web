export default (THREE, moon, scene) => {
  const geomMoon = new THREE.TetrahedronGeometry(500, 4);
  const loader = new THREE.TextureLoader();
  const texture1 = loader.load(`assets/moon.jpg`);
  const matMoon = new THREE.MeshPhongMaterial({
    map: texture1,
    shininess: 0,
    specular: 0xffffff
  });
  this.moon = new THREE.Mesh(geomMoon, matMoon);
  this.moon.castShadow = true;
  this.moon.receiveShadow = true;

  this.moon.position.x = 0;
  this.moon.position.y = 0;
  this.moon.position.z = -1800;
  moon = this.moon;
  scene.add(this.moon);
  return(moon);
}
