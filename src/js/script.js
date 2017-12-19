import {createScene, scene, renderer, camera} from './lib/createScene';
import createLights from './lib/createLights';
import createPlayer from './lib/createPlayer';
import createEnemy from './lib/createEnemy';
import createMoon from './lib/createMoon';
import createTriangle from './lib/createTriangle';
import webAudio from './lib/webAudio';
import createStars from './lib/createStars';
import createExplosion from './lib/createExplosion';

const THREE = require(`three`);
const OBJLoader = require(`three-obj-loader`);
OBJLoader(THREE);

let state = `startup`;
let firstRender = true;

const playButton = document.getElementsByClassName(`play_button_svg`);
const instructions = document.getElementsByClassName(`cameraControl`);
const world = document.getElementsByClassName(`world`);
const endscreen = document.getElementsByClassName(`endscreen`);

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

let enemies = [], triangles = [], stars = [];

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
const emotionOverlay = document.getElementsByClassName(`emotionOverlay`)[0];
const boosterOverlay = document.getElementsByClassName(`boosterOverlay`)[0];
const distance = document.getElementsByClassName(`distance`)[0];

let ang = 0;
let currentSec = 0;
let emotion;

const emotions = [`angry`, `sad`, `surprised`, `happy`];
let startDrawingTimer;
let collisionBoolean = false;
let collectBoolean = false;
let loopWorldBoolean = true;

let emotioncorrect = false;
let speedEnemey = 10;
let speedMoon = 1.5;
let speedstars = 2;

let distancePlayer = 0


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
      }else if(loopWorldBoolean){
        loopWorld();
      }
    }
  }

  if(state === `endscreen`) {
    state = ``;
    animateEndscreen();
  }
  requestAnimationFrame(drawLoop);
};

const animateEndscreen = () => {
  anim = world[0].animate([
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
    endscreen[0].style.display = `flex`;
    world[0].style.display = `none`;
    document.getElementsByClassName('endscreenScore')[0].innerHTML = `score: ${  score}`;
    document.getElementsByClassName('play_again_button_svg')[0].addEventListener(`click`, clickHandlerPlayAgain);
    anim = endscreen[0].animate([
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
}

const clickHandlerPlayAgain = () => {
  timer = false;
  boosterOverlay.classList.add(`hidden`);
  renderer.domElement.classList.remove(`blur`)
  speedEnemey = 10;
  speedMoon = 1.5;
  speedstars = 2;


  anim = endscreen[0].animate([
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
    state = `world`;
    endscreen[0].style.display = `none`;
    lives = 3;
    score = 0;
    drawLives();
    scoreElement.innerHTML = `<h1 class="scoreTitle" >score</h1> <p class="scoreText"> ${score}</p>`;
    for(let i = 0; i < enemies.length; i ++){
      enemies[i].position.z -=2000;
    }
    for(let i = 0; i < triangles.length; i ++){
      triangles[i].position.z -= 2000;
    }
    world[0].style.display = `inline`;
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
}

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
        let xHead =  Math.ceil(ctrack.getCurrentPosition()[41][0]);
        if (xHead > 200) {
          player.position.x = 200;
        } else if (xHead < 40) {
          player.position.x = 1400;
        }else {
          player.position.x = mapRange(xHead, 200, 40, 200, 1400);
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

const mapRange = (value, low1, high1, low2, high2) => {
  return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
};

const updateFaceData = data => {
  if (checkEmotions) {
    emotionsTracked.push(data);
  }
};

const clickHandlerStart = () => {
  webAudio(collisionBoolean, collectBoolean);
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
  stars = createStars(THREE, scene);

  enemies = createEnemy(THREE, enemies, scene);
  triangles = createTriangle(THREE, triangles, triangleXpos, scene);
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
  if(lives > 0) {
    for (let i = 0;i < lives;i ++) {
      const oneLive = document.createElement(`img`);
      oneLive.setAttribute(`src`, `assets/liveFull.png`);
      livesElement.appendChild(oneLive);
    }
  }else {
    setTimeout(() => {
      state = `endscreen`;
    }, 1500);
  }

}

const createScore = () => {
  scoreElement = document.createElement(`div`);
  scoreElement.classList.add(`score`);
  scoreElement.innerHTML = `<h1 class="scoreTitle" >score</h1> <p class="scoreText"> ${score}</p>`;
  const parrent = document.getElementsByClassName(`world`)[0];
  parrent.appendChild(scoreElement);
};

const loopWorld = () => {
  let playerObject = player;
  const playerBox = new THREE.Box3().setFromObject(playerObject);

  moveMoon();

  for (let i = 0;i < enemies.length;i ++) {
    moveEnemy(i);
    let enemyObject = enemies[i];
    const enemyBox = new THREE.Box3().setFromObject(enemyObject);
    let collision = playerBox.intersectsBox(enemyBox);
    if(collision && emotionActif === false && emotioncorrect === false) {
      createExplosion(THREE, scene, enemyObject.position.x,enemyObject.position.y, enemyObject.position.z)
      console.log(enemyObject.position.x,enemyObject.position.y, enemyObject.position.z );
      enemyObject.position.z -= 2000;
      lives --;
      drawLives();
      collisionBoolean = true;
      webAudio(collisionBoolean , collectBoolean );
    }else {
      collisionBoolean = false;
    }
  }

  for (let i = 0;i < triangles.length;i ++) {
    moveTriangle(i);
    let triangleObject = triangles[i];
    const triangleBox = new THREE.Box3().setFromObject(triangleObject);
    let collision = playerBox.intersectsBox(triangleBox);
    if(collision && emotionActif === false) {
      score += 1;
      scoreElement.innerHTML = `<h1 class="scoreTitle" >score</h1> <p class="scoreText"> ${score}</p>`;
      triangleObject.position.z -= 2000;
      if(i === 0){
        triangleXpos = calculateTriangleXpos();
      }
      triangleObject.position.x = triangleXpos;
      collectBoolean = true;
      webAudio(collisionBoolean, collectBoolean);
    }else {
      collectBoolean = false;
    }

    for(let i = 0; i < stars.length; i++){
      moveStars(i);
    }
  }

  distancePlayer = Math.floor(moon.position.z + player.position.z);
    if(distancePlayer < 200 && distancePlayer > -2100) {
      document.getElementsByClassName("st2")[0].setAttribute("y1", mapRange(-distancePlayer, 200, -2100, 173.6, 50));
      document.getElementsByClassName("st2")[0].setAttribute("y2", mapRange(-distancePlayer, 200, -2100, 173.6, 50));
    }

  renderer.render(scene, camera);

};

const moveEnemy = i => {
  if (enemies) {
    currentEnemy = enemies[i];
    currentEnemy.rotation.x += Math.random() * - 0.05;
    currentEnemy.rotation.y += Math.random() *  - 0.05;
    currentEnemy.position.z +=  speedEnemey;

      // Reset z-position to reuse enemies
    if (currentEnemy.position.z > 2000) {
      currentEnemy.position.z -= 2000;
      currentEnemy.position.x = Math.random() * (window.innerWidth/2) - (window.innerWidth/4);
    }
  }

};

const moveTriangle = i => {
  if (triangles) {
    let currentTriangle = triangles[i];
    currentTriangle.rotation.x += Math.random() * - 0.05;
    currentTriangle.rotation.y += Math.random() *  - 0.05;
    currentTriangle.position.z +=  speedEnemey;

    // Reset z-position to reuse triangles
    if (currentTriangle.position.z > 2000){
      currentTriangle.position.z -= 2000;
      if(i === 0){
        triangleXpos = calculateTriangleXpos();
      }
      currentTriangle.position.x = triangleXpos;
    }
  }

};

const moveStars = i => {
  if (stars) {
    let currentStar = stars[i];
    currentStar.position.z +=  speedstars;

    if (currentStar.position.z > 2000){
      currentStar.position.z -= 2000;
    }
  }

};

const moveMoon = () => {
  moon.rotation.y += 0.005;
  moon.position.z += speedMoon;
}

const calculateTriangleXpos = () => {
  return Math.random() * (800) - (400);
}

let triangleXpos = calculateTriangleXpos();


//EMOTIONS

const startEmotions = () => {
  if (!timer) {
    timer = true;
    // setTimeout(() => showEmotions(), 5000);
    setTimeout(() => {
      showEmotions()
      emotionOverlay.classList.remove(`hidden`);
    }, 10000);

  }
};

const showEmotions =  () => {
  loopWorldBoolean = false;
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
  grd.addColorStop(0, `#00ff75`);
  grd.addColorStop(1, `#00ffff`);
  ctx.fillStyle = grd;
  ctx.beginPath();
  ctx.moveTo(300, 350);
  ctx.lineTo(300, 150);
  ctx.arc(300, 350, 250, calcDeg(0), calcDeg(ang), false);
  ctx.lineTo(300, 300);
  ctx.fill();
};

const drawCircle = () => {
  ctx.globalCompositeOperation = `destination-over`;
  ctx.fillStyle = `white`;
  ctx.beginPath();
  ctx.arc(300, 350, 230, calcDeg(0), calcDeg(360), false);
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
    scoreElement.innerHTML = `<h1 class="scoreTitle" >score</h1> <p class="scoreText"> ${score}</p>`;
    emotioncorrect = true;
  } else {
    emotionContainer[0].innerHTML = `<div> <img class="emotionResultImg" src="assets/svg/cancel.svg" alt="" /> <p class="emotionResultText" >Not ${emotion} enough<p/> <div/>`;
    emotioncorrect = false;
  }
  emotionsTracked = [];

  setTimeout(() => {
    removeEmotion();
    emotionOverlay.classList.add(`hidden`);
  }, 2000);

};

const removeEmotion = () => {
  loopWorldBoolean = true;
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

  if(timer){
    setTimeout(() => {
      showEmotions();
      emotionOverlay.classList.remove(`hidden`);
    },  Math.floor((Math.random() * 25000) + 15000));
  }


  setTimeout(() => {
    ctx.clearRect(0, 0, 600, 600);
  }, 100);

  if(!emotioncorrect){
    renderer.domElement.classList.add(`blur`)
    setTimeout(() => {
      renderer.domElement.classList.remove(`blur`)
    }, 6000);
  }else{
    boosterOverlay.classList.remove(`hidden`);
    speedEnemey = 100;
    speedMoon = 2;
    speedstars = 5;
    setTimeout(() => {
      boosterOverlay.classList.add(`hidden`);
      speedEnemey = 10;
      speedMoon = 1.5;
      speedstars = 2;
      emotioncorrect = false;
    }, 4000);
  }

};


init();
