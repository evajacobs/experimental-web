let THREE;
let scene;

const movementSpeed = 40;
const totalObjects = 400;
const objectSize = 3;


const dirs = [];
const parts = [];

export default (three, sceneGame, x,y, z) => {
  THREE = three;
  scene = sceneGame;
  parts.push(new ExplodeAnimation(x,y, z));
  render();
}


class ExplodeAnimation {
  constructor(x, y, z) {
  const geometry = new THREE.Geometry();

  for (let i = 0;i < totalObjects;i ++){
    const vertex = new THREE.Vector3();
    vertex.x = x;
    vertex.y = y;
    vertex.z = z;

    geometry.vertices.push(vertex);
    dirs.push({x: (Math.random() * movementSpeed) - (movementSpeed / 2), y: (Math.random() * movementSpeed) - (movementSpeed / 2), z: (Math.random() * movementSpeed) - (movementSpeed / 2)});
  }

  const material = new THREE.ParticleBasicMaterial({size: objectSize,  color: `0xFFFFFF`});
  const particles = new THREE.ParticleSystem(geometry, material);

  this.object = particles;
  this.status = true;

  this.xDir = (Math.random() * movementSpeed) - (movementSpeed / 2);
  this.yDir = (Math.random() * movementSpeed) - (movementSpeed / 2);
  this.zDir = (Math.random() * movementSpeed) - (movementSpeed / 2);

  scene.add(this.object);
  }

  update() {
    if (this.status === true) {
      let pCount = totalObjects;
      while (pCount --) {
        const particle =  this.object.geometry.vertices[pCount];
        particle.y += dirs[pCount].y;
        particle.x += dirs[pCount].x;
        particle.z += dirs[pCount].z;
      }
      this.object.geometry.verticesNeedUpdate = true;
    }
  };

}


const render = ()  => {
  requestAnimationFrame(render);

  let pCount = parts.length;
  while (pCount --) {
    parts[pCount].update();
  }

}
