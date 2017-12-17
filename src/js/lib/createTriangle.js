export default (THREE, triangles, scene) => {
  for (let i = - 1000;i < 1000;i += 20) {
    //this.mesh = new THREE.Object3D();

    const geomTriangle = new THREE.TetrahedronGeometry(5, 0);
    const matTriangle = new THREE.MeshPhongMaterial({
      color: 0x009999,
      shininess: 0,
      specular: 0xffffff
    });
    this.oneTriangle = new THREE.Mesh(geomTriangle, matTriangle);
    this.oneTriangle.castShadow = true;
    this.oneTriangle.receiveShadow = true;

    this.oneTriangle.position.x = Math.random() * 1000 - 500;
    this.oneTriangle.position.y = Math.random() * - 1000 - 500;
    this.oneTriangle.position.z = i;

    scene.add(this.oneTriangle);

    triangles.push(this.oneTriangle);

  }

  return triangles;
};
