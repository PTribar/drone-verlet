let menuButton;

// game_scene code ----------------------------------

let PE; // Physics Environment
let SH; // Scene Handler
var pressed = new Set();
let drone;
let score;
let localEntries = [];
let savedEntries = [];
let allEntries = [];
let retryScreen;
let submitButtonActive = false;
let prevScore;
let camera;

let textSizeAnim;
let canControl;
let isGrounded;
let groundedTimer;

let canSubmit;
let isTyping;
let prevInput = [];
let nameInput = [];
// --------------


let database;


let font;
let scores;

let resolution = 1;
let dynamicResolution = true;
let nativeWidth = 1440;
let nativeHeight = 1280;


function preload() {
  font = loadFont('PressStart2P-Regular.ttf');
}

function setup() {
  createCanvas(nativeWidth*resolution, nativeHeight*resolution);
  textFont(font);
  
  PE = new PhysicsEnvironment();
  drone = new Drone(0, nativeHeight*0.9);
  title_scene_init();
  options_scene_init();
  game_scene_init();
  
  menuButton = new Button({
    content: '<',
    contentSize: 30,
    posX: 40,
    posY: 40,
    sizeX: 60,
    sizeY: 60,
    align: CORNER,
    contentColor: color('black'),
    fillColor: color('white'),
    borderColor: color('black'),
    borderWeight: 2,
    onPressed: function () {
      SH.curr_scene='title_scene'
    },
  });
  
  
  // frameRate(10);
  
  SH = new SceneHandler();
  SH.scenes.push(title_scene);
  SH.scenes.push(options_scene);
  SH.scenes.push(game_scene);
  
  database_init();
  
}
function mousePressed() {
  // print(mouseX, mouseY);
}

function keyPressed(evt) {
  const {code} = evt;

  if (!pressed.has(code)) {
    pressed.add(code);
  }
  
  const charLimit = 10;
  
  prevInput = [...nameInput];
  
  if (isTyping) {
    if (key == "Enter") {
      isTyping = false;
      canSubmit = true;
    } else if (key == "Backspace") {
      nameInput.pop();
    } else if (key.length == 1) {
      if (nameInput.length < charLimit) {
        nameInput.push(key); 
      } else {
        nameInput[charLimit-1] = key;
      }
    }
    if (isTyping) {
      localEntries[localEntries.length-1].name = nameInput.join("");
    }
  }
  else if (key == "Enter" && canSubmit) {
    submitScore();
  }
  else if (key == " " || key == "r" || key == "Enter") {
    retry();
  }
  else if (key == "Escape") {
    SH.curr_scene = 'title_scene';
  }
  
}

function keyReleased(evt) {
  pressed.delete(evt.code);
}

function retry() {
  drone = new Drone(0, nativeHeight*0.8);
  demoDrone = new Drone(nativeWidth*0.5, nativeHeight*0.9);
  // staticDrone = new Drone(0, 0);
  retryScreen.active = false;
  canControl = true;
}

function droneControl(drone) {
  let tapLeft = false;
  let tapRight = false;
  
  touches.forEach(touch => {
    if (touch.x < windowWidth/2) {
      tapLeft = true;
    } else {
      tapRight = true;
    }
  })
  
  const leftControl = !revControlButton.options.value?"KeyQ":"KeyP";
  const rightControl = !revControlButton.options.value?"KeyP":"KeyQ";
  
  
  if ((pressed.has(leftControl) || tapLeft) && canControl) {
    drone.left_thrust = lerp(drone.left_thrust, maxThrustSlider.value, thrustSensSlider.value);
  } else {
    drone.left_thrust = lerp(drone.left_thrust, autoThrustSlider.value, releaseSensSlider.value);
  }
  if ((pressed.has(rightControl) || tapRight) && canControl) {
    drone.right_thrust = lerp(drone.right_thrust, maxThrustSlider.value, thrustSensSlider.value);
  } else {
    drone.right_thrust = lerp(drone.right_thrust, autoThrustSlider.value, releaseSensSlider.value);
  }
}

function drawGround(floor_level, ceiling_level) {
  push();
  strokeWeight(5);
  fill('white');
  stroke('white');
  offsetX = 70*10*floor(camera.x/(70*10));
  line(offsetX-nativeWidth*2, nativeHeight-floor_level, offsetX+nativeWidth*2, nativeHeight-floor_level);
  for (let i=0; i<nativeWidth/10; i++) {
    quad(offsetX-nativeWidth*2+70*i, nativeHeight-floor_level,
         offsetX-nativeWidth*2+70*i+20, nativeHeight-floor_level,
         offsetX-nativeWidth*2+70*i, nativeHeight-floor_level+20,
         offsetX-nativeWidth*2+70*i-20, nativeHeight-floor_level+20);
  }
  line(offsetX-nativeWidth*2, nativeHeight-floor_level+20, offsetX+nativeWidth*2, nativeHeight-floor_level+20);
  
  line(offsetX-nativeWidth*2, ceiling_level, offsetX+nativeWidth*2, ceiling_level);
  for (let i=0; i<nativeWidth/10; i++) {
    quad(offsetX-nativeWidth*2+70*i, ceiling_level,
         offsetX-nativeWidth*2+70*i+20, ceiling_level,
         offsetX-nativeWidth*2+70*i, ceiling_level-20,
         offsetX-nativeWidth*2+70*i-20, ceiling_level-20);
  }
  line(offsetX-nativeWidth*2, ceiling_level-20, offsetX+nativeWidth*2, ceiling_level-20);
  pop();
}

function draw() {
  if (dynamicResolution) {
    if (windowHeight/windowWidth<nativeHeight/nativeWidth) {
      resolution = windowHeight/nativeHeight;
    } else {
      resolution = windowWidth/nativeWidth;
    }
    // resolution = 1;
    
    resizeCanvas(nativeWidth*resolution, nativeHeight*resolution);
  }
  background(0);
  scale(resolution);
  
  SH.render(SH.curr_scene);
}



class RetryScreen {
  constructor(active) {
    this.x = nativeWidth/2;
    this.y = nativeHeight*1.5;
    this.sizeX = nativeWidth*0.4;
    this.sizeY = nativeHeight*0.7
    this.inactiveHeight = nativeHeight+this.sizeY;
    this.activeHeight = nativeHeight/2;
    this.active = false;
    
    
    this.fontSizeAnim = new AnimationValue(50, 0, 130, 'ease-out-back', 20);
    this.highscoreSizeAnim = []
    for (let i=0; i<10; i++) {
      this.highscoreSizeAnim.push(new AnimationValue(30, 0, 30, 'ease-out-back', 30+4*i));
    }
    
    this.submitButtonTimer = new AnimationValue(40, 100, 0);
    this.submitButton = createButton('Submit');
    this.submitButton.position(this.x-this.sizeX/5, this.activenativeHeight+this.sizeY/2-120);
    this.submitButton.size(this.sizeX/2.5,70);
    this.submitButton.hide();
    this.submitButton.mousePressed(submitScore);
    this.submitButton.style("border", "4px solid white");
    this.submitButton.style("padding", "0px");
    this.submitButton.style("font-size", "24px");
  }
  
  resetAnim() {
    this.fontSizeAnim.reset();
    this.highscoreSizeAnim.forEach(anim => {
      anim.reset();
    })
    this.submitButtonTimer.reset();
  }
  
  render() {
    let dynamicX = windowWidth/2;
    let dynamicY = windowHeight/2;
    let dynamicSizeX = width*0.4;
    let dynamicSizeY = height*0.7;
    let dynamicInactiveHeight = windowHeight+this.sizeY;
    let dynamicActiveHeight = windowHeight/2;
    let dynamicFontSize = 24*resolution+"px";
    let dynamicBorderSize = 4*resolution+"px";
    
    this.submitButton.style("border",  dynamicBorderSize+" solid white");
    this.submitButton.style("font-size", dynamicFontSize);
    this.submitButton.position(dynamicX-dynamicSizeX/5, dynamicSizeY*1.15-dynamicSizeY*0.06/2);
    this.submitButton.size(dynamicSizeX/2.5,dynamicSizeY*0.06);
    if (this.active) {
      this.y = lerp(this.y, this.activeHeight, 0.1);
      this.submitButtonTimer.animate();
    } else { 
      this.y = lerp(this.y, this.inactiveHeight, 0.1);
      this.resetAnim();
      canSubmit = false;
      prevInput = [];
      nameInput = [];
    }
    
    if (canSubmit) {
      this.submitButton.show();
    } else {
      this.submitButton.hide();
    }
    
    rectMode(CENTER);
    strokeWeight(5);
    stroke('white');
    fill('black');
    rect(this.x, this.y, this.sizeX, this.sizeY);
    this.showResults();
  }
  
  showResults() {
    let finalScore = int(score);
    if (this.active) {
      this.fontSizeAnim.animate();
      this.highscoreSizeAnim.forEach(anim => {
        anim.animate();
      })
    }
    noStroke();
    fill('white');
    textSize(this.fontSizeAnim.val);
    text(finalScore, this.x, this.y-210);
    
    allEntries = localEntries.concat(savedEntries);
    
    textSize(this.highscoreSizeAnim[0].val*1.2);
    text('- HIGHSCORES -', this.x, this.y-60);
    textSize(this.highscoreSizeAnim[0].val);
    text(nameInput.join(""), this.x, this.y-140);
    let sortedEntries = [...allEntries];
    sortedEntries.sort((a, b) => b.score - a.score);
  
    
    for (let i=0; i<min(sortedEntries.length, 5); i++) {
      textAlign(LEFT)
      textSize(this.highscoreSizeAnim[i].val);
      text(sortedEntries[i].name, this.x-220, this.y + 40 + 70*i);
      textAlign(RIGHT)
      text(sortedEntries[i].score, this.x+220, this.y + 40 + 70*i);
    }
  }
  
  saveResult() {
    var result = {
      name: nameInput.join(""),
      score: int(score)
    }
    
    localEntries[localEntries.length] = {
      name: result.name,
      score: result.score
    };
  }
  

}

function submitScore() {
  var result = {
    name: nameInput.join(""),
    score: int(score)
  }
  database.ref.push(result);    
  
  localEntries.splice(localEntries.length-1, 1);
  canSubmit = false;
}

class AnimationValue {
  constructor(frames, startVal, endVal, easing='linear', delay=0, onLoop=false) {
    this.currFrame = -delay;
    this.delay = delay;
    this.frames = frames;
    this.startVal = startVal;
    this.val = startVal;
    this.endVal = endVal;
    this.isPlaying = false;
    this.easing = easing;
    this.onLoop = onLoop;
  }
  
  animate() {
    var t = max(0, this.currFrame/this.frames);
    if (this.easing == 'quadratic-in') {
      this.val = lerp(this.startVal, this.endVal, t);
    } else if (this.easing == 'quadratic-out') { 
      this.val = lerp(this.startVal, this.endVal, -t*(t-2));
    } else if (this.easing === 'ease-out-back') {
      const c1 = 1;
      const c3 = c1 + 1;

      let easeFunc = 1 + c3 * pow(t - 1, 3) + c1 * pow(t - 1, 2);

      this.val = lerp(this.startVal, this.endVal, easeFunc);
    } else if (this.easing === 'sin-in-out-return') {
      this.val = lerp(this.startVal, this.endVal, (sin((t-1/4)*2*PI)+1)/2);
    } else {
      this.val = lerp(this.startVal, this.endVal, t);
    }
    
    this.currFrame += 1;
    if (this.currFrame >= this.frames) {
      this.isPlaying = false;
      this.currFrame = this.frames;
      
      if (this.onLoop) {
      this.isPlaying = false;
        this.currFrame = 0;
      }
    } else {
      this.isPlaying = true;
    }
  }
  
  reset() {
    if (this.currFrame > 0) {
      this.currFrame = 0;
    } else {
      this.currFrame = -this.delay;
    }
    this.val = this.startVal;
  }
}