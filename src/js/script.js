{

  const THREE = require(`three`);
  const OBJLoader = require(`three-obj-loader`);
  OBJLoader(THREE);

  const Colors = {
    red: 0xf25346,
  };

  const init = () => {
    createScene();
    createPlayer();

    createLights();
    //createParticle();
    createEnnemy();
    createTriangle();

    // document.addEventListener(`mousemove`, onMouseMove, false);
    setInterval(loop, 1000 / 30);

  };

  let scene,
    camera,
    fieldOfView,
    aspectRatio,
    nearPlane,
    farPlane,
    HEIGHT,
    WIDTH,
    renderer,
    container,
    hemisphereLight,
    shadowLight,
    particle;

  const particles = [], ennemies = [], triangles = [];

  let ennemy, triangle;
  let player;



  const createScene = () => {

    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;

    scene = new THREE.Scene();

    aspectRatio = WIDTH / HEIGHT;
    fieldOfView = 60;
    nearPlane = 1;
    farPlane = 4000;
    camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);

    camera.position.set(0, 0, 2000);

    renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});

    renderer.setSize(WIDTH, HEIGHT);

    renderer.shadowMap.enabled = true;

    container = document.querySelector(`.world`);
    container.appendChild(renderer.domElement);

    window.addEventListener(`resize`, handleWindowResize, false);

  };

  const handleWindowResize = () => {
    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;
    renderer.setSize(WIDTH, HEIGHT);
    camera.aspect = WIDTH / HEIGHT;
    camera.updateProjectionMatrix();
  };

  const createPlayer = () => {


    const loader = new THREE.OBJLoader();

    loader.load(`assets/astronaut.obj`,

      object => {
        player = object;
        player.scale.set(0.1, 0.1, 0.1);
        player.position.set(1600, - 1300, 700);
        scene.add(object);
      },
    );
  };


  // const onMouseMove = event => {
  //   mouseX = event.clientX;
  //   mouseY = event.clientY;
  // };

  const createLights = () => {

    hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, .9);

    shadowLight = new THREE.DirectionalLight(0xffffff, .9);

    shadowLight.position.set(150, 350, 350);
    shadowLight.castShadow = true;

    shadowLight.shadow.camera.left = - 400;
    shadowLight.shadow.camera.right = 400;
    shadowLight.shadow.camera.top = 400;
    shadowLight.shadow.camera.bottom = - 400;
    shadowLight.shadow.camera.near = 1;
    shadowLight.shadow.camera.far = 1000;

    shadowLight.shadow.mapSize.width = 2048;
    shadowLight.shadow.mapSize.height = 2048;

    scene.add(hemisphereLight);
    scene.add(shadowLight);
  };


  // const createParticle = () => {
  //
  //   for (let i = - 1000;i < 1000;i += 20) {
  //     this.mesh = new THREE.Object3D();
  //
  //     const geomHeigt = (Math.random() * 25) + 10;
  //
  //     const geomParticle = new THREE.BoxGeometry(geomHeigt, geomHeigt, geomHeigt, 1, 1, 1);
  //     const matParticle = new THREE.MeshPhongMaterial({color: Colors.white, shading: THREE.FlatShading});
  //     this.oneParticle = new THREE.Mesh(geomParticle, matParticle);
  //     this.oneParticle.castShadow = true;
  //     this.oneParticle.receiveShadow = true;
  //
  //     this.oneParticle.position.x = Math.random() * 1000 - 500;
  //     this.oneParticle.position.y = Math.random() * 1000 - 500;
  //     this.oneParticle.position.z = i;
  //
  //   // this.oneParticle.scale.x = this.oneParticle.scale.y = 10;
  //
  //   //this.mesh.add(this.oneParticle);
  //
  //     scene.add(this.oneParticle);
  //
  //     particles.push(this.oneParticle);
  //
  //   }
  //
  //
  //   // particle = new Particle();
  //   // particle.mesh.position.y = 100;
  //   // scene.add(particle.mesh);
  // };


  const updateParcticle = i => {

    particles[i].rotation.x += Math.random() * - 0.05;
    particles[i].rotation.y += Math.random() *  - 0.05;

    particle = particles[i];

    particle.position.z +=  10;
    if (particle.position.z > 2000) particle.position.z -= 2000;

  };

  const createEnnemy = () => {

    for (let i = - 1000;i < 1000;i += 20) {
      this.mesh = new THREE.Object3D();

      const geomEnnemy = new THREE.TetrahedronGeometry(8, 2);
      const matEnnemy = new THREE.MeshPhongMaterial({
        color: Colors.red,
        shininess: 0,
        specular: 0xffffff,
        shading: THREE.FlatShading
      });
      this.oneEnnemy = new THREE.Mesh(geomEnnemy, matEnnemy);
      this.oneEnnemy.castShadow = true;
      this.oneEnnemy.receiveShadow = true;

      this.oneEnnemy.position.x = Math.random() * 1000 - 500;
      this.oneEnnemy.position.y = Math.random() * 1000 - 500;
      this.oneEnnemy.position.z = i;

      scene.add(this.oneEnnemy);

      ennemies.push(this.oneEnnemy);

    }

  };


  const updateEnnemy = i => {

    ennemies[i].rotation.x += Math.random() * - 0.05;
    ennemies[i].rotation.y += Math.random() *  - 0.05;

    ennemy = ennemies[i];

    ennemy.position.z +=  10;
    if (ennemy.position.z > 2000) ennemy.position.z -= 3000;

  };

  const createTriangle = () => {

    for (let i = - 1000;i < 1000;i += 20) {
      this.mesh = new THREE.Object3D();

      const geomTriangle = new THREE.TetrahedronGeometry(5, 0);
      const matTriangle = new THREE.MeshPhongMaterial({
        color: 0x009999,
        shininess: 0,
        specular: 0xffffff,
        shading: THREE.FlatShading
      });
      this.oneTriangle = new THREE.Mesh(geomTriangle, matTriangle);
      this.oneTriangle.castShadow = true;
      this.oneTriangle.receiveShadow = true;

      this.oneTriangle.position.x = Math.random() * 1000 - 500;
      this.oneTriangle.position.y = Math.random() * 1000 - 500;
      this.oneTriangle.position.z = i;

      scene.add(this.oneTriangle);

      particles.push(this.oneTriangle);

    }

  };


  const updateTriangle = i => {

    triangles[i].rotation.x += Math.random() * - 0.05;
    triangles[i].rotation.y += Math.random() *  - 0.05;

    triangle = triangles[i];

    triangle.position.z +=  10;
    if (triangle.position.z > 2000) triangle.position.z -= 3000;

  };


  const loop = () => {

    for (let i = 0;i < particles.length;i ++) {
      updateParcticle(i);

    }
    for (let i = 0;i < ennemies.length;i ++) {
      updateEnnemy(i);

    }

    for (let i = 0;i < triangles.length;i ++) {
      updateTriangle(i);

    }
    renderer.render(scene, camera);
  };






  init();
}
