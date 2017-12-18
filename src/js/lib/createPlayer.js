let player;

export default (THREE, OBJLoader, scene) => {

  if (!player) {

    const loader = new THREE.OBJLoader();
    loader.load(`assets/astronaut.obj`, object => {
      player = object;
      player.position.set(800, -700, 1500);
      player.scale.set(0.05, 0.05, 0.05);
    });

  } else {
    scene.add(player);
    return player;

  }
};
