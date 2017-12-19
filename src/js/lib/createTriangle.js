export default (THREE, triangles, triangleXpos, scene) => {

  for (let i = 200;i > - 200;i -= 100) {
    //this.mesh = new THREE.Object3D();

    const geomTriangle = new THREE.TetrahedronGeometry(20, 0);
    const matTriangle = new THREE.MeshPhongMaterial({
      color: 0x009999,
      shininess: 0,
      specular: 0xffffff
    });
    this.oneTriangle = new THREE.Mesh(geomTriangle, matTriangle);
    this.oneTriangle.castShadow = true;
    this.oneTriangle.receiveShadow = true;


    this.oneTriangle.position.x = triangleXpos;
    this.oneTriangle.position.y = - 95;
    this.oneTriangle.position.z = i;

    scene.add(this.oneTriangle);

    triangles.push(this.oneTriangle);

  }

  return triangles;
};
