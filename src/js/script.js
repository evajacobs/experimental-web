import {createScene, scene, renderer, camera} from './lib/createScene';
import createLights from './lib/createLights';
import createPlayer from './lib/createPlayer';
import createEnemy from './lib/createEnemy';
import createMoon from './lib/createMoon';
import createTriangle from './lib/createTriangle';

const THREE = require(`three`);
const OBJLoader = require(`three-obj-loader`);
OBJLoader(THREE);

let state = `startup`;
let firstRender = true;

const playButton = document.getElementsByClassName(`play_button_svg`);
const instructions = document.getElementsByClassName(`cameraControl`);
const world = document.getElementsByClassName(`world`);

//variables tracking face
const videoEl = document.getElementById(`video`);
const videoHelmet = document.getElementById(`videoHelmet`);
const text = document.getElementsByClassName(`cameraControlTextStep2`);
const overlay = document.getElementById(`overlay`);
const overlayCC = overlay.getContext(`2d`);

// set vector 9 and 11 to not be regularized. This is to better detect motion of the eyebrows
pModel.shapeModel.nonRegularizedVectors.push(9);
pModel.shapeModel.nonRegularizedVectors.push(11);

const ctrack = new clm.tracker({useWebGL: true});
ctrack.init(pModel);

delete emotionModel[`disgusted`];
delete emotionModel[`fear`];
const ec = new emotionClassifier();
ec.init(emotionModel);
// const emotionData = ec.getBlank();

//variables webanimations
let anim;

let enemies = [], triangles = [];

let currentEnemy,
  triangle,
  player,
  scoreElement;

let score = 0;
let lives = 3;

let moon;
let emotionActif = false;

//variables emotions
let timer = false;
let checkEmotions = false;
let emotionsTracked = [];

const canvas = document.getElementById(`canvas`);
const ctx = canvas.getContext(`2d`);
const emotionText = document.getElementsByClassName(`emotionText`);
const emotionContainer = document.getElementsByClassName(`emotionContainer`);

let ang = 0;
let currentSec = 0;
let emotion;

const emotions = [`angry`, `sad`, `surprised`, `happy`];
let startDrawingTimer;


const init = () => {

  if (state === `startup`) {
    renderStartup();
  }

};

const renderStartup = () => {
  streamVideo(videoEl);
  videoEl.addEventListener(`canplay`, () =>  startVideo());
};

const streamVideo = $videoEl => {
  navigator.mediaDevices.getUserMedia({video: true})
    .then(stream => {
      $videoEl.srcObject = stream;
    });
};

const startVideo = () => {
    // start tracking
  ctrack.start(videoEl);

  drawLoop();
};

const drawLoop = () => {

  trackFace();

  if (state === `world` && firstRender === true) {
    firstRender = false;
    renderWorld();
  }

  if (state === `world`) {
    if(scene) {
      if (!player) {
        player = createPlayer(THREE, OBJLoader, scene);
        window.threePlayer = player;
      }else {
        loopWorld();
      }
    }
  }
  requestAnimationFrame(drawLoop);
};

const trackFace = () => {

  overlayCC.clearRect(0, 0,  videoEl.width,  videoEl.height);

  if (ctrack.getCurrentPosition()) {
    ctrack.draw(overlay); //draw face tracking

    if (ctrack.getScore() > 0.6) {
      text[0].innerHTML = `We've found your face!`;
      playButton[0].addEventListener(`click`, clickHandlerStart);
      playButton[0].style.opacity = 1;
      playButton[0].style.cursor = `pointer`;

    } else {
      text[0].innerHTML = `We're looking for your face ...`;
      playButton[0].removeEventListener(`click`, clickHandlerStart);
      playButton[0].style.opacity = 0.3;
      playButton[0].style.cursor = `default`;
    }

    if (state === `world`) {

      startEmotions();

      if (player) {

        if (Math.ceil(ctrack.getCurrentPosition()[41][0]) > 120 && player.position.x > 200) {
          player.position.x = mapRange(Math.ceil(ctrack.getCurrentPosition()[41][0]));
        } else if (Math.ceil(ctrack.getCurrentPosition()[41][0]) < 110 && player.position.x < 1400) {
          player.position.x = mapRange(Math.ceil(ctrack.getCurrentPosition()[41][0]));
        }
      }

    }

  }


  const cp = ctrack.getCurrentParameters();

  const er = ec.meanPredict(cp);
  if (er) {
    updateFaceData(er);
  }

};

const mapRange = value => {
  return 200 + (1400 - 200) * (value - 200) / (30 - 200);
};

const updateFaceData = data => {
  if (checkEmotions) {
    emotionsTracked.push(data);
  }
};

const clickHandlerStart = () => {
  anim = instructions[0].animate([
    {
      opacity: `1`,
      easing: `ease-out`
    },
    {
      opacity: `0`,
    }
  ], {
    fill: `forwards`,
    duration: 300,
    iterations: 1
  });
  anim.finished.then(() => {
    world[0].style.display = `inline`;
    state = `world`;
    instructions[0].style.display = `none`;

    anim = world[0].animate([
      {
        opacity: `0`,
        easing: `ease-out`
      },
      {
        opacity: `1`,
      }
    ], {
      fill: `forwards`,
      duration: 400,
      iterations: 1
    });

  });
};


const renderWorld = () => {
  streamVideo(videoHelmet);
  createScene(THREE);
  createLights(THREE, scene);

  enemies = createEnemy(THREE, enemies, scene);
  triangles = createTriangle(THREE, triangles, scene);
  moon = createMoon(THREE, moon, scene);
  createLives();
  createScore();

};


const createLives = () => {
  const livesElement = document.createElement(`div`);
  livesElement.classList.add(`lives`);
  const parrent = document.getElementsByClassName(`world`)[0];
  parrent.appendChild(livesElement);
  drawLives();
};

const drawLives = () => {
  const livesElement = document.getElementsByClassName(`lives`)[0];
  livesElement.innerHTML = '';
  for (let i = 0;i < lives;i ++) {
    const oneLive = document.createElement(`img`);
    oneLive.setAttribute(`src`, `assets/liveFull.png`);
    livesElement.appendChild(oneLive);
  }
}

const createScore = () => {
  scoreElement = document.createElement(`h1`);
  scoreElement.classList.add(`score`);
  scoreElement.innerHTML = `score: ${  score}`;
  const parrent = document.getElementsByClassName(`world`)[0];
  parrent.appendChild(scoreElement);
};

const loopWorld = () => {
  let playerObject = player;
  const playerBox = new THREE.Box3().setFromObject(playerObject);

  for (let i = 0;i < enemies.length;i ++) {
    moveEnemy(i);
    let enemyObject = enemies[i];
    const enemyBox = new THREE.Box3().setFromObject(enemyObject);
    let collision = playerBox.intersectsBox(enemyBox);
    if(collision && emotionActif === false) {
      enemyObject.position.z -= 2000;
      lives --;
      drawLives();
    }
  }

  for (let i = 0;i < triangles.length;i ++) {
    moveTriangle(i);
    let triangleObject = triangles[i];
    const triangleBox = new THREE.Box3().setFromObject(triangleObject);
    let collision = playerBox.intersectsBox(triangleBox);
    if(collision && emotionActif === false) {
      score += 1;
      scoreElement.innerHTML = `score: ${  score}`;
      triangleObject.position.z -= 2000;
    }
  }

  renderer.render(scene, camera);

};

const moveEnemy = i => {
  if (enemies) {
    currentEnemy = enemies[i];
    currentEnemy.rotation.x += Math.random() * - 0.05;
    currentEnemy.rotation.y += Math.random() *  - 0.05;
    currentEnemy.position.z +=  10;

      // Reset z-position to reuse enemies
    if (currentEnemy.position.z > 2000) currentEnemy.position.z -= 2000;
  }

};

const moveTriangle = i => {
  if (triangles) {
    let currentTriangle = triangles[i];
    currentTriangle.rotation.x += Math.random() * - 0.05;
    currentTriangle.rotation.y += Math.random() *  - 0.05;
    currentTriangle.position.z +=  10;

    // Reset z-position to reuse triangles
    if (currentTriangle.position.z > 2000) currentTriangle.position.z -= 2000;
  }

};


//EMOTIONS

const startEmotions = () => {
  if (!timer) {
    timer = true;
    setTimeout(() => showEmotions(), 10000);
  }
};

const showEmotions =  () => {
  emotionActif = true;
  anim = canvas.animate([
    {
      opacity: `0`,
      easing: `ease-in`
    },
    {
      opacity: `1`,
    }
  ], {
    fill: `forwards`,
    duration: 200,
    iterations: 1
  });


  countdown();
  startDrawingTimer = setInterval(updateTime, 50);

  drawCircle();
};

const countdown = () => {
  emotion = emotions[Math.floor(Math.random() * emotions.length)];
  emotionText[0].innerHTML = `Make ${emotion === `angry` ? `an` : `a`} </br> <span>${emotion}</span></br>face`;
  emotionText[0].classList.add(`EmotionToMake`);

  anim = emotionContainer[0].animate([
    {
      opacity: `0`,
      easing: `ease-in`
    },
    {
      opacity: `1`,
    }
  ], {
    fill: `forwards`,
    duration: 200,
    iterations: 1
  });
};

const  updateTime = () => {
  if (currentSec === 51) {
    checkEmotions = false;
    currentSec = 0;
    clearInterval(startDrawingTimer);
    ctx.clearRect(0, 0, 600, 600);
    drawCircle();
    checkEmotion();
  } else {
    checkEmotions = true;
    currentSec ++;
    drawSeconds();
  }
};


const drawSeconds = () => {
  ang = 0.007 * ((currentSec * 1000));
  const grd = ctx.createLinearGradient(0, 170, 360, 0);
  grd.addColorStop(0, `#0071bc`);
  grd.addColorStop(1, `#00ffff`);
  ctx.fillStyle = grd;
  ctx.beginPath();
  ctx.moveTo(300, 300);
  ctx.lineTo(300, 100);
  ctx.arc(300, 300, 250, calcDeg(0), calcDeg(ang), false);
  ctx.lineTo(300, 300);
  ctx.fill();
};

const drawCircle = () => {
  ctx.globalCompositeOperation = `destination-over`;
  ctx.fillStyle = `white`;
  ctx.beginPath();
  ctx.arc(300, 300, 230, calcDeg(0), calcDeg(360), false);
  ctx.closePath();
  ctx.save();
  ctx.globalCompositeOperation = `source-over`;
  ctx.shadowBlur = 20;
  ctx.shadowColor = `black`;
  ctx.fill();
  ctx.restore();
};

const calcDeg = deg => {
  return (Math.PI / 180) * (deg - 90);
};

const checkEmotion = () => {

  const lastItem = emotionsTracked.pop();

  if (lastItem[emotions.indexOf(emotion)].value > 0.2) {
    emotionContainer[0].innerHTML = `<div> <img class="emotionResultImg" src="assets/svg/correct.svg" alt=""/> <p class="emotionResultText"> ${emotion} face check<p/> </div>`;
    score += 100;
    scoreElement.innerHTML = `score: ${  score}`;
  } else {
    emotionContainer[0].innerHTML = `<div> <img class="emotionResultImg" src="assets/svg/cancel.svg" alt="" /> <p class="emotionResultText" >Not ${emotion} enough<p/> <div/>`;
  }
  emotionsTracked = [];

  setTimeout(() => {
    removeEmotion();
  }, 2000);

};

const removeEmotion = () => {
  emotionActif = false;
  emotionContainer[0].innerHTML = `<p class="emotionText"></p>`;

  anim = canvas.animate([
    {
      opacity: `1`,
      easing: `ease-out`
    },
    {
      opacity: `0`,
    }
  ], {
    fill: `forwards`,
    duration: 100,
    iterations: 1
  });

  setTimeout(() => {
    showEmotions();
  }, 5000);

  setTimeout(() => {
    ctx.clearRect(0, 0, 600, 600);
  }, 100);
};


init();
