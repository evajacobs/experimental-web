let THREE;
const stars = [];

export default (three, scene) => {
  THREE = three;

    for (let i = 0;i < 1500;i ++) {
      const star = new Star();
      star.mesh.position.z = i;
      scene.add(star.mesh);
      stars.push(star.mesh);
    }

    return stars;


};

class Star {
  constructor() {

    const geom = new THREE.BoxGeometry(0.5, 0.5, 0.5);


    const mat = new THREE.MeshPhongMaterial({
      color: 0xFFffFF,
      emissive: 0xFFffFF,
      transparent: true,
      opacity: 1,
      blending: THREE.AdditiveBlending,

    });

    this.mesh = new THREE.Mesh(geom, mat);

    //
    //this.mesh.position.x = -600;
    this.mesh.position.y = 0;
    this.mesh.position.z = 500
    console.log(window.innerHeight);

    //
    this.mesh.position.x = (Math.random() * 1400) +  - 700;
    this.mesh.position.y = (Math.random() * 776) + - 388;
    // this.mesh.position.z = Math.random() * 700;


  }
}
