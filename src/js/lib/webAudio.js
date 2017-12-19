const audioCtx = new (window.AudioContext || window.webkitAudioContext)(); // Our audio context
const loader = require(`webaudio-buffer-loader`);
let playing = true;
let sourceMainAudio;
let sourceCollision;
let gainNode = null;
let collision = false;
let collect = false;
let loadBuffers;

const buffers = [`./assets/sounds/backgroundSound.mp3`, `./assets/sounds/flashbang.mp3`, `./assets/sounds/collect.wav` ];


const button = document.getElementsByClassName(`soundImage`);
const audioRange = document.getElementsByClassName(`audioRange`);

export default (collisionBoolean, collectBoolean) => {

  collision = collisionBoolean;
  collect = collectBoolean;

  if (!loadBuffers) {
    loader(buffers, audioCtx, function(err, loadedBuffers) {
      loadBuffers = loadedBuffers;
      finishedLoading(loadedBuffers);
    });
  } else {
    playCollisionOrCollect();
  }


  button[0].addEventListener(`click`, toggle);
  audioRange[0].addEventListener(`change`, changeVolume);
};

function finishedLoading(loadedBuffers) {
  gainNode = audioCtx.createGain();
  sourceMainAudio  = audioCtx.createBufferSource();
  sourceMainAudio.buffer = loadedBuffers[0];

  sourceMainAudio.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  sourceMainAudio.start(0);
}

const playSoundMain = () => {
  gainNode.gain.value = 1;
};

const changeVolume = event => {
  const volume = event.currentTarget.value;
  const fraction = parseInt(volume) / parseInt(100);
  console.log(fraction * fraction);
  gainNode.gain.value = fraction * fraction;
};

const stop = () => {
  gainNode.gain.value = 0;
};

const  toggle = ()  => {
  playing ? stop() : playSoundMain();
  playing = !playing;
};

const playCollisionOrCollect = () => {
  if (collision) {
    playsound(1);
    collision = false;
  } else if (collect) {
    playsound(2);
    collect = false;
  }
};

const playsound = index => {
  sourceCollision = audioCtx.createBufferSource();
  sourceCollision.buffer = loadBuffers[index];
  sourceCollision.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  sourceCollision.start(0);
};
