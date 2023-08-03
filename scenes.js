/* TODO

:::QOL:::
1. submit button optimization
 > be active once typing started
 > submitted notification
2. follow drone in options 
3. restart without typing using space/r

:::features:::
1. view highscores in menu
2. add achievements
3. drone customize
4. wacky mode
5. weekly leaderboards

:::design:::
1. background (optional)
2. color selector

*/

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
  fill(secondaryColor);
  textSize(32);
  textAlign(RIGHT);
  text('v1.0', nativeWidth, nativeHeight-16);
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
let themeSelector = [];
let themeColors = [
  {primary: 'black', secondary: 'white', accent: 'white'},
  {primary: 'navy', secondary: 'yellow', accent: 'cyan'},
  {primary: 'purple', secondary: 'pink', accent: 'greenyellow'},
  {primary: 'sienna', secondary: 'yellow', accent: 'gold'},
  {primary: 'darkslateblue', secondary: 'hotpink', accent: 'yellow'},
];
let demoDrone;
let optionGap;

function updateTheme() {
  buttonArray.forEach(button => {
    button.fillColor = secondaryColor;
    button.hoverFillColor = setBrightness(secondaryColor, 70);
    button.pressFillColor = primaryColor;
    button.inactiveFillColor = button.hoverFillColor;
    
    button.borderColor = primaryColor;
    button.hoverBorderColor = setBrightness(primaryColor, brightness(primaryColor)*0.5);
    button.pressBorderColor = secondaryColor;
    button.inactiveBorderColor = button.hoverBorderColor;
    
    button.contentColor = primaryColor;
    button.hoverContentColor = setBrightness(primaryColor, brightness(primaryColor)*0.5);
    button.pressContentColor = secondaryColor;
    button.inactiveContentColor = button.hoverContentColor;
    
  });
  for (let i=0; i<themeSelector.length; i++) {
    themeSelector[i].fillColor = themeColors[i].primary;
    themeSelector[i].borderColor = themeColors[i].secondary;
    
    themeSelector[i].hoverFillColor = setBrightness(themeColors[i].secondary, 70);
    themeSelector[i].pressFillColor = primaryColor;
    
    themeSelector[i].hoverBorderColor = setBrightness(themeColors[i].primary, brightness(themeColors[i].primary)*0.5);
    themeSelector[i].pressBorderColor = themeColors[i].secondary;
    
    themeSelector[i].hoverContentColor = setBrightness(themeColors[i].primary, brightness(themeColors[i].primary)*0.5);
    themeSelector[i].pressContentColor = themeColors[i].secondary;
    
  }
  
  drone.fillColor = primaryColor;
  drone.strokeColor = accentColor;
  
  demoDrone.fillColor = primaryColor;
  demoDrone.strokeColor = accentColor;
  
  staticDrone.fillColor = primaryColor;
  staticDrone.strokeColor = accentColor;
  
}

function options_scene_init() {
  optionGap = 0.9;
  
  revControlButton = new Button({
    content: '',
    contentSize: 30,
    posX: nativeWidth*0.55,
    posY: nativeHeight*0.3*optionGap - 20,
    sizeX: 40,
    sizeY: 40,
    align: CENTER,
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
    posY: nativeHeight*0.4*optionGap-20,
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
    posY: nativeHeight*0.5*optionGap-20,
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
    posY: nativeHeight*0.6*optionGap-20,
    length: nativeWidth*0.3,
    handle: revControlButton.clone(),
    minValue: 3000,
    value: 3000,
    maxValue: 4000,
  })
  maxThrustSlider.handle.sizeX *= 0.2;
  
  autoThrustSlider = new Slider({
    posX: nativeWidth*0.55,
    posY: nativeHeight*0.7*optionGap-20,
    length: nativeWidth*0.3,
    handle: revControlButton.clone(),
    minValue: 0,
    value: 0,
    maxValue: 1000,
  })
  autoThrustSlider.handle.sizeX *= 0.2;
  
  for (let i=0; i<themeColors.length; i++) {
    themeSelector.push(new Button({
      posX: nativeWidth*0.55+80*i,
      posY: nativeHeight*0.8*optionGap-20,
      sizeX: 60,
      fillColor: themeColors[i].primary,
      borderColor: themeColors[i].secondary,
      align: CENTER,
      borderWeight: 8,
      onPressed: function () {
        primaryColor = themeColors[i].primary;
        secondaryColor = themeColors[i].secondary;
        accentColor = themeColors[i].accent;
        updateTheme();
      },
    }))
  }
  
  demoDrone = new Drone(nativeWidth/2, nativeHeight*0.9);
}

function options_scene() {
  fill(secondaryColor);
  textSize(48);
  textAlign(CENTER);
  text('OPTIONS', nativeWidth/2, nativeHeight*0.1);
  textSize(32);
  textAlign(LEFT);
  text('Reverse Controls', 50, nativeHeight*0.3*optionGap);
  text('Thrust Sensitivity', 50, nativeHeight*0.4*optionGap);
  text('Release Sensitivity', 50, nativeHeight*0.5*optionGap);
  text('Thrust Power', 50, nativeHeight*0.6*optionGap);
  text('Auto Thrust Power', 50, nativeHeight*0.7*optionGap);
  text('Theme', 50, nativeHeight*0.8*optionGap);
  
  revControlButton.render();
  thrustSensSlider.render();
  releaseSensSlider.render();
  maxThrustSlider.render();
  autoThrustSlider.render();
  themeSelector.forEach(theme => {theme.render()});
  
  if (!revControlButton.options.value) {
    text('Q: Left, P: Right', nativeWidth*0.6, nativeHeight*0.3*optionGap);
  } else { 
    text('P: Left, Q: Right', nativeWidth*0.6, nativeHeight*0.3*optionGap);
  }
  text(nf(thrustSensSlider.value,0,1), nativeWidth*0.9, nativeHeight*0.4*optionGap);
  text(nf(releaseSensSlider.value,0,2), nativeWidth*0.9, nativeHeight*0.5*optionGap);
  text(round(maxThrustSlider.value,0), nativeWidth*0.9, nativeHeight*0.6*optionGap);
  text(round(autoThrustSlider.value,0), nativeWidth*0.9, nativeHeight*0.7*optionGap);
  
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

let PE; // Physics Environment
let SH; // Scene Handler
var pressed = new Set();
let drone;
let score;
let localEntries = [];
let savedEntries = [];
let allEntries = [];
let retryScreen;
let prevScore;
let camera;

let textSizeAnim;
let canControl;
let isGrounded;
let groundedTimer;

let isTyping;
let prevInput = [];
let nameInput = [];

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
  fill(secondaryColor);
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
    }
    canControl = false;
  }
  retryScreen.render();
  
  menuButton.render();
}