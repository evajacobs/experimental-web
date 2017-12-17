let player;

export default (THREE, OBJLoader, scene) => {

  if (!player) {

    const loader = new THREE.OBJLoader();
    loader.load(`assets/astronaut.obj`, object => {
      player = object;
      player.position.set(1500, - 2200, 1100);
      player.scale.set(0.1, 0.1, 0.1);
    });

  } else {
    scene.add(player);
    return player;

  }
};
