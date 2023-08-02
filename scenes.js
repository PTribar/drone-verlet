class SceneHandler {
  constructor(curr_scene=0) {
    this.curr_scene = curr_scene;
    this.scenes = [];
  }
  
  render(scene_id) {
    if (typeof scene_id == 'number') {
      this.scenes[scene_id]();
    } else if (typeof scene_id == 'string') {
      this.scenes.forEach(scene => {
        if (scene.name == scene_id) {
          scene();
        }
      });
    }
    
  }
}
// title_scene code ----------------------------------
let startButton;
let optionsButton;
let staticDrone;
let droneFloatAnim;

function title_scene_init() {
  startButton = new Button({
    content: 'START',
    contentSize: 32,
    align: CENTER,
    posX: nativeWidth/2,
    posY: nativeHeight*0.6,
    sizeX: 350,
    sizeY: 80,
    onPressed: function () {
      SH.curr_scene = 'game_scene'
      retry();
    }
  })
  optionsButton = new Button({
    content: 'OPTIONS',
    contentSize: 32,
    align: CENTER,
    posX: nativeWidth/2,
    posY: startButton.posY + startButton.sizeY+40,
    sizeX: 350,
    sizeY: 80,
    onPressed: function () {
      SH.curr_scene = 'options_scene';
      retry();
    }
  })
  staticDrone = new Drone(0, 0, true);
  droneFloatAnim = new AnimationValue(200, 0, 70, 'sin-in-out-return', 0, true);
}

function title_scene() {
  fill(255);
  textSize(96);
  textAlign(CENTER);
  text('DRONE VERLET', nativeWidth/2, nativeHeight*0.45);
  startButton.render();
  optionsButton.render();
  droneFloatAnim.animate();
  push();
  translate(nativeWidth/2, nativeHeight*0.23 + droneFloatAnim.val);
  rotate(PI/10);
  staticDrone.left_thrust = 4000;
  staticDrone.right_thrust = 3500;
  staticDrone.render();
  pop();
}


// options_scene code ----------------------------------

let revControlButton;
let thrustSensSlider;
let releaseSensSlider;
let maxThrustSlider;
let autoThrustSlider;
let demoDrone;

function options_scene_init() {
  revControlButton = new Button({
    content: '',
    contentSize: 30,
    posX: nativeWidth*0.55,
    posY: nativeHeight*0.3 - 20,
    sizeX: 40,
    sizeY: 40,
    align: CENTER,
    contentColor: color('black'),
    fillColor: color('white'),
    borderColor: color('black'),
    borderWeight: 2,
    onPressed: function () {
      if (this.content=='') {
        this.content='X'; 
        this.options.value = true;
      }
      else {
        this.content='';
        this.options.value = false;
      }
    },
    value: false,
  });
  
  thrustSensSlider = new Slider({
    posX: nativeWidth*0.55,
    posY: nativeHeight*0.4-20,
    length: nativeWidth*0.3,
    handle: revControlButton.clone(),
    minValue: 0.1, 
    value: 0.4,
    maxValue: 1.0,
    segments: 9,
  })
  thrustSensSlider.handle.sizeX *= 0.2;
  
  releaseSensSlider = new Slider({
    posX: nativeWidth*0.55,
    posY: nativeHeight*0.5-20,
    length: nativeWidth*0.3,
    handle: revControlButton.clone(),
    minValue: 0.01,
    value: 0.1,
    maxValue: 0.2,
    segments: 19,
  })
  releaseSensSlider.handle.sizeX *= 0.2;
  
  maxThrustSlider = new Slider({
    posX: nativeWidth*0.55,
    posY: nativeHeight*0.6-20,
    length: nativeWidth*0.3,
    handle: revControlButton.clone(),
    minValue: 3000,
    value: 3000,
    maxValue: 4000,
  })
  maxThrustSlider.handle.sizeX *= 0.2;
  
  autoThrustSlider = new Slider({
    posX: nativeWidth*0.55,
    posY: nativeHeight*0.7-20,
    length: nativeWidth*0.3,
    handle: revControlButton.clone(),
    minValue: 0,
    value: 0,
    maxValue: 1000,
  })
  autoThrustSlider.handle.sizeX *= 0.2;
  
  demoDrone = new Drone(nativeWidth/2, nativeHeight*0.9);
}

function options_scene() {
  fill(255);
  textSize(48);
  textAlign(CENTER);
  text('OPTIONS', nativeWidth/2, nativeHeight*0.1);
  textSize(32);
  textAlign(LEFT);
  text('Reverse Controls', 50, nativeHeight*0.3);
  text('Thrust Sensitivity', 50, nativeHeight*0.4);
  text('Release Sensitivity', 50, nativeHeight*0.5);
  text('Thrust Power', 50, nativeHeight*0.6);
  text('Auto Thrust Power', 50, nativeHeight*0.7);
  
  revControlButton.render();
  thrustSensSlider.render();
  releaseSensSlider.render();
  maxThrustSlider.render();
  autoThrustSlider.render();
  
  if (!revControlButton.options.value) {
    text('Q: Left, P: Right', nativeWidth*0.6, nativeHeight*0.3);
  } else { 
    text('P: Left, Q: Right', nativeWidth*0.6, nativeHeight*0.3);
  }
  text(nf(thrustSensSlider.value,0,1), nativeWidth*0.9, nativeHeight*0.4);
  text(nf(releaseSensSlider.value,0,2), nativeWidth*0.9, nativeHeight*0.5);
  text(round(maxThrustSlider.value,0), nativeWidth*0.9, nativeHeight*0.6);
  text(round(autoThrustSlider.value,0), nativeWidth*0.9, nativeHeight*0.7);
  
  let dt = 1/60;
  camera.x = 0;
  droneControl(demoDrone);
  drawGround(demoDrone.body_points[0].floor_level, demoDrone.body_points[0].ceiling_level);
  // drone controls
  PE.simulate(dt);
  demoDrone.update();
  demoDrone.render();
  
  menuButton.render();
}


// game_scene code ----------------------------------
function game_scene_init() {
  
  score = 0;
  camera = createVector(0, 0);
  retryScreen = new RetryScreen();
  textSizeAnim = 250;
  canControl = true;
  isGrounded = false;
  groundedTimer = 0;
  isTyping = false;
  canSubmit = false;
}

function game_scene() {
  
  let dt = 1/60;
  camera.x = drone.center.x + nativeWidth/2;
  textAlign(CENTER);
  noStroke();
  score = drone.center.x/1000;
  
  // score animation and update
  if (int(score) - int(prevScore) != 0) {
    textSizeAnim = 200;
  }
  textSizeAnim = lerp(textSizeAnim, 150, 0.1);
  textSize(textSizeAnim);
  fill('white');
  text(int(score), nativeWidth/2, nativeHeight/3);
  
  // draw ground and follow drone
  push();
  translate(nativeWidth-camera.x, 0);
  drawGround(PE.points[0].floor_level, PE.points[0].ceiling_level);
  
  
  // drone controls
  PE.simulate(dt);
  PE.points.forEach(point => {
    point.floor_level = 20 + 2/PI * (nativeHeight/2-60)*atan(score/170);
    point.ceiling_level = 20 + 2/PI * (nativeHeight/2-60)*atan(score/170);
  })
  droneControl(drone);

  drone.update();
  drone.render();
  pop();
  
  // update previous score
  prevScore = score;
  
  // check if grounded
  isGrounded = drone.isGrounded();
  if (isGrounded) {
    groundedTimer += 1;
  } else {
    groundedTimer = 0;
  }
  
  // game over condition
  if (groundedTimer > 70 && int(score) != 0) {
    retryScreen.active = true;
    if (canControl) {
      isTyping = true;
      prevInput = [];
      nameInput = [];
      retryScreen.saveResult();
      submitButtonActive = true;
    }
    canControl = false;
  }
  retryScreen.render();
  
  menuButton.render();
}
