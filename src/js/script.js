  const THREE = require(`three`);
  const OBJLoader = require(`three-obj-loader`);
  OBJLoader(THREE);

  import createPlayer from './lib/createPlayer'
  import createEnemy from './lib/createEnemy'
  import createTriangle from './lib/createTriangle'
  import createLights from './lib/createLights'

  const init = () => {
    navigator.mediaDevices.getUserMedia({video: true})
    .then(stream => {
    videoEl.srcObject = stream;
    });

    createScene();
    player = createPlayer(THREE, scene, player );
    createLights(THREE, scene);
    enemies = createEnemy(THREE, enemies, scene);
    triangles = createTriangle(THREE, triangles, scene);
    createLives();

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
    container;

  let enemies = [], triangles = [];

  let currentEnemy, triangle;
  let player;


  const createLives = () => {
    // instantiate loader
    const loader = new THREE.ImageLoader();
    // load a image resource
    loader.load(`assets/liveFull.png`,

    image => {
      const canvas = document.querySelector(`.world canvas`);
      const lives = document.createElement(`canvas`);
      const context = lives.getContext(`2d`);
      context.drawImage(image, 120, 120);
      canvas.appendChild(lives);
    }
  );
  };

  const createScene = () => {

    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;

    scene = new THREE.Scene();

    aspectRatio = WIDTH / HEIGHT;
    fieldOfView = 60;
    nearPlane = 1;
    farPlane = 4000;
    camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);

    camera.position.set(0,-1000, 2000);

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

    triangles[i].rotation.x += Math.random() * - 0.05;
    triangles[i].rotation.y += Math.random() *  - 0.05;

    triangle = triangles[i];

    triangle.position.z +=  10;

  };

  const loop = () => {

    for (let i = 0;i < enemies.length;i ++) {
      moveEnemy(i);
    }

    for (let i = 0;i < triangles.length;i ++) {
      moveTriangle(i);

    }
    renderer.render(scene, camera);

    const originPoint = player.mesh.position.clone();

    for (let vertexIndex = 0;vertexIndex < player.mesh.children[0].geometry.vertices.length;vertexIndex ++) {
      const localVertex = player.mesh.children[0].geometry.vertices[vertexIndex].clone();
      const globalVertex = localVertex.applyMatrix4(player.mesh.matrix);
      const directionVector = globalVertex.sub(player.mesh.position);

      const ray = new THREE.Raycaster(originPoint, directionVector.clone().normalize());
      const collisionResultsEnemies = ray.intersectObjects(enemies);
      const collisionResultsTriangles = ray.intersectObjects(triangles);
      if (collisionResultsEnemies.length > 0 && collisionResultsEnemies[0].distance < directionVector.length())
        console.log("hit");

      if (collisionResultsTriangles.length > 0 && collisionResultsTriangles[0].distance < directionVector.length())
        console.log("hit");


    }
  };


  // emotion ----

const videoEl = document.getElementById(`video`);
const playButton = document.getElementsByClassName(`play_button_svg`);
const instructions = document.getElementsByClassName(`cameraControl`);
const world = document.getElementsByClassName(`world`);

let anim;
let worldOn = false;
let timer = false;
let checkEmotions = false;


let emotionsTracked = [];

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
      worldOn = true;
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

  /*********** setup of emotion detection *************/
  const vid = document.getElementById(`video`);
  const text = document.getElementsByClassName(`cameraControlTextStep2`);
  const overlay = document.getElementById(`overlay`);
  const overlayCC = overlay.getContext(`2d`);

  vid.addEventListener(`canplay`, () => {

    startVideo();
  });


    // set eigenvector 9 and 11 to not be regularized. This is to better detect motion of the eyebrows
  pModel.shapeModel.nonRegularizedVectors.push(9);
  pModel.shapeModel.nonRegularizedVectors.push(11);

  const ctrack = new clm.tracker({useWebGL: true});
  ctrack.init(pModel);
  let trackingStarted = false;

  const startVideo = () => {
      // start tracking
    ctrack.start(vid);
    trackingStarted = true;
      // start loop to draw face
    drawLoop();
  };

  const drawLoop = () => {
    requestAnimationFrame(drawLoop);
    overlayCC.clearRect(0, 0,  vid.width,  vid.height);
    if (ctrack.getCurrentPosition()) {
      ctrack.draw(overlay);
      if (ctrack.getScore() > 0.6) {
        text[0].innerHTML = `We've found your face!`;
        playButton[0].addEventListener(`click`, clickHandlerStart);
        playButton[0].style.opacity = 1;
        playButton[0].style.cursor = `pointer`;
        //playButton[0].classList.add("play-button-active");

      } else {
        text[0].innerHTML = `We're looking for your face ...`;
        playButton[0].removeEventListener(`click`, clickHandlerStart);
        playButton[0].style.opacity = 0.3;
        playButton[0].style.cursor = `default`;
        //playButton[0].classList.remove("play-button-active");
      }

      if(worldOn){

        if(!timer){
          timer = true;
          setTimeout(() => {
            startEmotion();
          }, 5000);
        }

        if(Math.ceil(ctrack.getCurrentPosition()[41][0]) > 120 && player.mesh.position.x > -window.innerWidth){
          player.mesh.position.x = -map_range(Math.ceil(ctrack.getCurrentPosition()[41][0]));
        } else if(Math.ceil(ctrack.getCurrentPosition()[41][0]) < 110 && player.mesh.position.x < window.innerWidth){
          player.mesh.position.x = -map_range(Math.ceil(ctrack.getCurrentPosition()[41][0]));
        }


        if(Math.ceil(ctrack.getCurrentPosition()[41][1]) > 91 && player.mesh.position.y > -window.innerHeight ){
          player.mesh.position.y = -map_rangeY(Math.ceil(ctrack.getCurrentPosition()[41][1]));

        } else if(Math.ceil(ctrack.getCurrentPosition()[41][1]) < 81 && player.mesh.position.y < window.innerHeight){
        player.mesh.position.y = -map_rangeY(Math.ceil(ctrack.getCurrentPosition()[41][1]));
        }
      }
    }
    const cp = ctrack.getCurrentParameters();

    const er = ec.meanPredict(cp);
    if (er) {
      updateData(er);
    }
  };

  delete emotionModel[`disgusted`];
  delete emotionModel[`fear`];
  const ec = new emotionClassifier();
  ec.init(emotionModel);
  const emotionData = ec.getBlank();

  const updateData = data => {
    if(checkEmotions){
      emotionsTracked.push(data);
    }
  };

  const map_range = (value) => {
    return -window.innerWidth + (window.innerWidth - -window.innerWidth) * (value - 30) / (200 - 30);
  }

  const map_rangeY = (value) => {
    return 10 + (window.innerWidth - 10) * (value - 30) / (143 - 30);
  }


  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  const emotionText = document.getElementsByClassName(`emotionText`);
  const emotionContainer = document.getElementsByClassName(`emotionContainer`);

  let ang = 0;
  let currentSec = 0;
  let count = 1;
  let emotion;

  const emotions = ["angry", "sad", "surprised" ,"happy"];
  let intervalCountdown;
  let startDrawingTimer;

  const startEmotion =  () => {

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
    startDrawingTimer = setInterval( updateTime, 50 );

    drawCircle();
  }

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
  }

  const  updateTime = () => {
    if(currentSec === 51){
      checkEmotions = false;
      currentSec = 0;
      clearInterval(startDrawingTimer);
      ctx.clearRect(0,0, 600,600);
      drawCircle();
      checkEmotion();
    }else {
      checkEmotions = true;
      currentSec ++;
      drawSeconds();
    }
  }


  const drawSeconds = () =>{
    ang = 0.007 * (( currentSec * 1000 ) );
    var grd=ctx.createLinearGradient(0,170,360,0);
    grd.addColorStop(0,"#0071bc");
    grd.addColorStop(1,"#00ffff");
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.moveTo( 300, 300 );
    ctx.lineTo( 300, 100 );
    ctx.arc( 300, 300, 250, calcDeg( 0 ), calcDeg( ang ), false );
    ctx.lineTo( 300, 300 );
    ctx.fill();
  }

  const drawCircle = () =>{
    console.log('test');
    ctx.globalCompositeOperation='destination-over';
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc( 300, 300, 230, calcDeg( 0 ), calcDeg( 360 ), false );
    ctx.closePath();
    ctx.save();
    ctx.globalCompositeOperation='source-over';
    ctx.shadowBlur=20;
    ctx.shadowColor="black";
    ctx.fill();
    ctx.restore();
  }

  const calcDeg = ( deg ) =>{
    return (Math.PI/180) * (deg - 90);
  }

  const checkEmotion = () => {

    console.log(emotionsTracked);
    const lastItem = emotionsTracked.pop()

    console.log(lastItem[emotions.indexOf(emotion)].value);

    if(lastItem[emotions.indexOf(emotion)].value > 0.2){
      emotionContainer[0].innerHTML = `<div> <img class="emotionResultImg" src="assets/svg/correct.svg" alt=""/> <p class="emotionResultText"> ${emotion} face check<p/> </div>`;
    }else {
      emotionContainer[0].innerHTML = `<div> <img class="emotionResultImg" src="assets/svg/cancel.svg" alt="" /> <p class="emotionResultText" >Not ${emotion} enough<p/> <div/>`;
    }
    emotionsTracked = [];
    console.log(emotionsTracked);

    setTimeout(() => {
      removeEmotion();
    }, 2000);

  }

  const removeEmotion = () => {

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
      startEmotion();
    }, 5000);

    setTimeout(() => {
      ctx.clearRect(0,0, 600,600);
    }, 100);
  }


  init();
