export default (THREE, scene, player) => {
  player = new Player(THREE);
  scene.add(player.mesh);

  return player
}

class Player {
  constructor(THREE) {
    this.mesh = new THREE.Object3D();
    this.mesh.name = `pilot`;

    const geom = new THREE.BoxGeometry(200, 200, 200);
    const mat = new THREE.MeshPhongMaterial({
      color: 0xf1c40f,
      transparent: true,
      opacity: 1,
      shininess: 10,
      side: THREE.DoubleSide
    });
    const body = new THREE.Mesh(geom, mat);
    body.position.set(0,-1000, 0);
    this.mesh.add(body);
  }
}
