let player;

export default (THREE, OBJLoader, scene) => {

  if (!player) {

    const loader = new THREE.OBJLoader();
    loader.load(`assets/astro2.obj`, object => {
      player = object;
      player.position.set(800, - 650, 1600);
      player.scale.set(0.05, 0.05, 0.05);
      // player.position.set(800, -650, 1600);
      // player.scale.set(0.1, 0.1, 0.1);
      player.rotation.x = - .3;
    });

  } else {
    scene.add(player);
    return player;

  }
};
