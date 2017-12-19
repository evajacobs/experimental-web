const audioCtx = new (window.AudioContext || window.webkitAudioContext)(); // Our audio context
let request;
let source;
let playing = true;
let gainNode = null;
let mainBuffer;
let collisionBoolean;


const button = document.getElementsByClassName('soundImage');
const audioRange = document.getElementsByClassName('audioRange');

export default (collision) => {
  collisionBoolean = collision;

  if(collisionBoolean){
    loadSound(`flashbang.mp3`);
  }else {
    loadSound(`test.mp3`);
  }
  button[0].addEventListener(`click`, toggle);
  audioRange[0].addEventListener(`change`, changeVolume);

}

const loadSound = (file) => {

    const request = new XMLHttpRequest();
    request.open("GET", `./assets/sounds/${file}`, true);
    request.responseType = "arraybuffer";
    request.addEventListener(`load`, () => {
        audioCtx.decodeAudioData(request.response, (buffer) => {
             mainBuffer = buffer;
            playSound();  // don't start processing it before the response is there!
        }, (error) => {
            console.error("decodeAudioData error", error);
        });
    });
    request.send();

}

const playSound = () => {
  if(collisionBoolean){
    console.log('test');
    source = audioCtx.createBufferSource();
    source.buffer = mainBuffer;
    source.connect(audioCtx.destination);
    source.loop = false;
    source.start(0);
    collisionBoolean =  false;
  }else {
    if (!audioCtx.createGain)
      audioCtx.createGain = audioCtx.createGainNode;
      gainNode = audioCtx.createGain();
      source = audioCtx.createBufferSource();
      source.buffer = mainBuffer;

    // Connect source to a gain node
    source.connect(gainNode);
    // Connect gain node to destination
    gainNode.connect(audioCtx.destination);
    // Start playback in a loop
    source.loop = true;
    if (!source.start)
      source.start = source.noteOn;
      source.start(0);
  }
}



const changeVolume = (event) => {
  var volume = event.currentTarget.value;
  var fraction = parseInt(volume) / parseInt(100);
  gainNode.gain.value = fraction * fraction;
};

const stop = () => {
  if (!source.stop){
    source.stop = source.noteOff;
    source.stop(0);
  }
};

const  toggle = ()  => {
  collisionBoolean = false;
  playing ? stop() : playSound();
  playing = !playing;
};
