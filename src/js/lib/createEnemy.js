export default (THREE, enemies, scene) => {
  for (let i = - 1000;i < 1000;i += 300) {
    const planet = new Planet(THREE);
    planet.mesh.position.z = i;
    scene.add(planet.mesh);
    enemies.push(planet.mesh);
  }

  for (let i = - 1000;i < 1000;i += 300) {
    const rock = new Rock(THREE);
    rock.mesh.position.z = i;
    scene.add(rock.mesh);
    enemies.push(rock.mesh);
  }

  return enemies;
};

class Enemy {

  set mesh(mesh) {
    this._mesh = mesh;
  }

  get mesh() {
    return this._mesh;
  }

  randomPosition() {
    this._mesh.position.x = Math.random() * (window.innerWidth / 2) - (window.innerWidth / 4);
    this._mesh.position.y = Math.random() * (window.innerHeight / 2) - (window.innerHeight / 4);
  }
}

class Planet extends Enemy {

  constructor(THREE) {
    super();
    //create an enemy
    const geomEnemy = new THREE.TetrahedronGeometry(25, 4);

    // create a material
    const loader = new THREE.TextureLoader();
    const texture1 = loader.load(`assets/planet.jpeg`);
    const matEnemy = new THREE.MeshPhongMaterial({
      map: texture1,
      shininess: 0,
      specular: 0xffffff
    });

    super.mesh = new THREE.Mesh(geomEnemy, matEnemy);
    super.mesh.castShadow = true;
    super.mesh.receiveShadow = true;

    // set the position of each enemy randomly
    super.randomPosition();
  }
}

class Rock extends Enemy {

  constructor(THREE) {
    super();
    //create an enemy
    const geomEnemy = new THREE.IcosahedronBufferGeometry(20, 0);

    // create a material
    const loader = new THREE.TextureLoader();
    const texture1 = loader.load(`assets/rock.jpg`);
    const matEnemy = new THREE.MeshPhongMaterial({
      map: texture1,
      shininess: 0,
      specular: 0xffffff
    });

    super.mesh = new THREE.Mesh(geomEnemy, matEnemy);
    super.mesh.castShadow = true;
    super.mesh.receiveShadow = true;

    // set the position of each enemy randomly
    super.randomPosition();
  }
}
