/* TODO

:::QOL:::
1. submit button optimization
 > submitted notification

:::features:::
2. add achievements
3. drone customize
4. wacky mode

:::design:::
1. background (optional)

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
  
  getCurrSceneName() {
    if (typeof this.curr_scene == 'number') {
      return this.scenes[this.curr_scene].name;
    } else if (typeof this.curr_scene == 'string') {
      return this.curr_scene;
    }
  }
}


// title_scene code ----------------------------------
let startButton;
let optionsButton;
let staticDrone;
let droneFloatAnim;
let viewLogButton;
let leaderboardButton;
let updateLogWindow;

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
  
  viewLogButton = new Button({
    content: '?',
    contentSize: 32,
    align: CENTER,
    posX: nativeWidth-220,
    posY: nativeHeight-40,
    sizeX: 50,
    sizeY: 50,
    runningFunction: function () {
      if (this.isHovered) {
        updateLogWindow.visible = true;
      } else {
        updateLogWindow.visible = false;
      }
    }
  })

  leaderboardButton = new Button({
    content: '~',
    contentSize: 32,
    align: CENTER,
    posX: 40,
    posY: nativeHeight-40,
    sizeX: 50,
    sizeY: 50,
    onPressed: function () {
      leaderboard_scene_init();
      SH.curr_scene = 'leaderboard_scene';
    }
  })
  
  updateLogWindow = new Window({
    contents: [
      {content: 'v1.4 Patch Notes', contentAlign: CENTER, contentSize: 36},
      {content: '', contentAlign: CENTER, contentSize: 32},
      {content: '- system changes -', contentAlign: CENTER, contentSize: 32},
      {content: '', contentAlign: LEFT, contentSize: 12},
      {content: '1. score system optimized ', contentAlign: LEFT, contentSize: 24},
      {content: '', contentAlign: CENTER, contentSize: 32},
      {content: '- features -', contentAlign: CENTER, contentSize: 32},
      {content: '', contentAlign: LEFT, contentSize: 12},
      {content: '1. added sparks', contentAlign: LEFT, contentSize: 24},
      {content: ' * sparks will fly when crashing', contentAlign: LEFT, contentSize: 20},
    ],
    contentPosition: TOP,
    contentSize: 16,
    contentGap: 16,
    contentColor: secondaryColor,
    borderWeight: 8,
    align: CENTER,
    visible: false,
    fillColor: primaryColor,
    marginX: 50,
    marginY: 50,
    posX: nativeWidth/2,
    posY: nativeHeight/2,
    sizeX: nativeWidth*0.5,
    sizeY: nativeHeight*0.9,
  });
  
  staticDrone = new Drone(0, 0, true);
  droneFloatAnim = new AnimationValue(200, 0, 70, 'sin-in-out-return', 0, true);
}

function title_scene() {
  fill(secondaryColor);
  textSize(32);
  textAlign(RIGHT);
  text('v1.4', nativeWidth-16, nativeHeight-16);
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
  
  updateLogWindow.render();
  viewLogButton.render();
  leaderboardButton.render();
  
  if (pressed.has("Enter")) {
    SH.curr_scene = "game_scene";
  }
  
}


// options_scene code ----------------------------------

let defaultButton;
let revControlButton;
let thrustSensSlider;
let releaseSensSlider;
let maxThrustSlider;
let autoThrustSlider;
let themeSelector = [];
let groundSelector = [];
let themeColors = [
  {primary: 'black', secondary: 'white', accent: 'white'},
  {primary: 'navy', secondary: 'yellow', accent: 'cyan'},
  {primary: 'purple', secondary: 'pink', accent: 'greenyellow'},
  {primary: 'sienna', secondary: 'yellow', accent: 'gold'},
  {primary: 'darkslateblue', secondary: 'hotpink', accent: 'yellow'},
  {primary: 'rgb(251,202,213)', secondary: 'rgb(249,150,173)', accent: 'rgb(200,50,75)'},
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
    themeSelector[i].hoverFillColor = setBrightness(themeColors[i].primary, brightness(themeColors[i].primary)*0.5);
    themeSelector[i].pressFillColor = themeColors[i].secondary;
    
    themeSelector[i].borderColor = themeColors[i].secondary;
    themeSelector[i].hoverBorderColor = setBrightness(themeColors[i].secondary, brightness(themeColors[i].secondary)*0.5);
    themeSelector[i].pressBorderColor = themeColors[i].primary;
  }
  
  
  groundSelector.forEach(ground => {
    ground.fillColor = primaryColor;
    ground.hoverFillColor = setBrightness(primaryColor, brightness(primaryColor)*0.5);
    ground.pressFillColor = secondaryColor;
    ground.inactiveFillColor = ground.hoverFillColor;
    
    ground.borderColor = secondaryColor;
    ground.hoverBorderColor = setBrightness(secondaryColor, brightness(secondaryColor)*0.5);
    ground.pressBorderColor = primaryColor;
    ground.inactiveBorderColor = ground.hoverBorderColor;
    
    ground.contentColor = ground.borderColor
    ground.hoverContentColor = ground.hoverBorderColor
    ground.pressContentColor = ground.pressBorderColor
    ground.inactiveContentColor = ground.inactiveBorderColor
  })
  
  windowArray.forEach(window => {
    window.fillColor = primaryColor;    
    window.borderColor = secondaryColor;    
    window.contentColor = secondaryColor;
  });
  
  drone.fillColor = primaryColor;
  drone.strokeColor = accentColor;
  drone.trailColor = accentColor;
  
  demoDrone.fillColor = primaryColor;
  demoDrone.strokeColor = accentColor;
  demoDrone.trailColor = accentColor;
  
  staticDrone.fillColor = primaryColor;
  staticDrone.strokeColor = accentColor;
  
}

function resetValues() {
  revControlButton.value = false;
  thrustSensSlider.setValue(0.4);
  releaseSensSlider.setValue(0.1);
  maxThrustSlider.setValue(3000);
  autoThrustSlider.setValue(0);
  themeSelector[0].onPressed();
  groundSelector[0].onPressed();
}

function options_scene_init() {
  optionGap = 0.85;
  
  defaultButton = new Button({
    content: 'DEFAULT',
    contentSize: 25,
    posX: 50,
    posY: 200,
    sizeX: 200,
    sizeY: 50,
    onPressed: function () {
      resetValues();
    },
  });
  
  revControlButton = new Button({
    content: '',
    contentSize: 30,
    posX: nativeWidth*0.55,
    posY: 330 + 130*optionGap*0,
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
    posY:  330 + 130*optionGap*1,
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
    posY:  330 + 130*optionGap*2,
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
    posY:  330 + 130*optionGap*3,
    length: nativeWidth*0.3,
    handle: revControlButton.clone(),
    minValue: 3000,
    value: 3000,
    maxValue: 4000,
  })
  maxThrustSlider.handle.sizeX *= 0.2;
  
  autoThrustSlider = new Slider({
    posX: nativeWidth*0.55,
    posY:  330 + 130*optionGap*4,
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
    posY:  330 + 130*optionGap*5,
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
  
  for (let i=0; i<2; i++) {
    groundSelector.push(new Button({
      content: ''+i,
      contentSize: 32,
      posX: nativeWidth*0.55+80*i,
    posY:  330 + 130*optionGap*6,
      sizeX: 60,
      align: CENTER,
      borderWeight: 8,
      onPressed: function () {
        groundStyle = i;
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
  text('Reverse Controls', 50, 330 + 130*optionGap*0+20);
  text('Thrust Sensitivity', 50, 330 + 130*optionGap*1+20);
  text('Release Sensitivity', 50, 330 + 130*optionGap*2+20);
  text('Thrust Power', 50, 330 + 130*optionGap*3+20);
  text('Auto Thrust Power', 50, 330 + 130*optionGap*4+20);
  text('Theme', 50, 330 + 130*optionGap*5+20);
  text('Ground', 50, 330 + 130*optionGap*6+20);
  
  defaultButton.render();
  revControlButton.render();
  thrustSensSlider.render();
  releaseSensSlider.render();
  maxThrustSlider.render();
  autoThrustSlider.render();
  themeSelector.forEach(theme => {theme.render()});
  groundSelector.forEach(ground => {ground.render()});
  
  if (!revControlButton.options.value) {
    text('Q: Left, P: Right', nativeWidth*0.6, 330 + 130*optionGap*0+20);
  } else { 
    text('P: Left, Q: Right', nativeWidth*0.6, 330 + 130*optionGap*0+20);
  }
  text(nf(thrustSensSlider.value,0,1), nativeWidth*0.9, 330 + 130*optionGap*1+20);
  text(nf(releaseSensSlider.value,0,2), nativeWidth*0.9, 330 + 130*optionGap*2+20);
  text(round(maxThrustSlider.value,0), nativeWidth*0.9, 330 + 130*optionGap*3+20);
  text(round(autoThrustSlider.value,0), nativeWidth*0.9, 330 + 130*optionGap*4+20);
  
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

// leaderboard_scene code ----------------------------------


let leaderboardWindows = [];
let leaderboardOffset;
let leaderboardGap;
let leaderboardData = [];
let dragStart;
let dragEnd;
let lastRelativeMouseX;
let lastRelativeMouseY;
let scrollSpeed;

function leaderboard_scene_init() {
  
  for (let i=0; i<=database.curr_week; i++) {
    leaderboardData[i] = [];
    
    if (leaderboardData[i].length == 0) {
        database.getScores(leaderboardData[i], 'week'+i);
    }
    
    leaderboardWindows[i] = new Window({
      contents: [
        {content: '** LEADERBOARD **', contentAlign: CENTER, contentSize: 36},
          {content: '- week '+i+' -', contentAlign: CENTER, contentSize: 32},
          {content: '', contentAlign: CENTER, contentSize: 8},
      ],
      contentPosition: TOP,
      contentSize: 16,
      contentGap: 20,
      contentColor: secondaryColor,
      borderWeight: 8,
      align: CENTER,
      visible: true,
      fillColor: primaryColor,
      marginX: 50,
      marginY: 50,
      posX: nativeWidth/2,
      posY: nativeHeight/2,
      sizeX: nativeWidth*0.5,
      sizeY: nativeHeight*0.9,
    });
    
  }
  
  
  leaderboardOffset = nativeWidth/2;
  leaderboardGap = 50;
  
  lastRelativeMouseX = mouseX/resolution;
  scrollSpeed = 0;
  
}

function leaderboard_scene() {
  
  if ((frameCount-50) % 3600 == 0) {
    leaderboard_scene_init();
  }
  
  for (let i=0; i<leaderboardData.length; i++) {
    
    let sortedEntries = [...leaderboardData[i]];
    sortedEntries.sort((a, b) => b.score - a.score);
    for (let j=0; j<min(sortedEntries.length, 20); j++) {
      let content = (j+1)+((j>=9)?'. ':'.  ')+sortedEntries[j].name+
          ' '.repeat(10-sortedEntries[j].name.length)+
          ' '.repeat(7-(sortedEntries[j].score).toString().length)+sortedEntries[j].score;
      leaderboardWindows[i].contents[3+j] = {content: content,
                                             contentAlign: LEFT, contentSize: 28};
    }
    
  }
  
  let relativeMouseX = mouseX/resolution;
  let offsetMin = -(leaderboardWindows.length-2)*(leaderboardWindows[0].sizeX+leaderboardGap);
  let offsetMax = nativeWidth/2;
  
  if (mouseIsPressed) {
    scrollSpeed = relativeMouseX-lastRelativeMouseX;
    leaderboardOffset += scrollSpeed;
  } else {
    if (leaderboardOffset > offsetMax) {
      scrollSpeed = lerp(scrollSpeed, 0, 0.2);
      leaderboardOffset = lerp(leaderboardOffset+scrollSpeed, offsetMax, 0.1);
    } else if (leaderboardOffset < offsetMin) {
      scrollSpeed = lerp(scrollSpeed, 0, 0.2);
      leaderboardOffset = lerp(leaderboardOffset+scrollSpeed, offsetMin, 0.1);
    } else {
      scrollSpeed = lerp(scrollSpeed, 0, 0.1);
      leaderboardOffset += scrollSpeed;
    }
  }
  if (pressed.has("ArrowLeft")) {
    leaderboardOffset += 20;
  }
  if (pressed.has("ArrowRight")) {
    leaderboardOffset -= 20;
  }


  leaderboardWindows.forEach((window, index) => {
    window.posX = (leaderboardWindows.length-index-1)*(window.sizeX+leaderboardGap) + leaderboardOffset;
    window.render();
  })
  
  lastRelativeMouseX = relativeMouseX;
  
  menuButton.render();
}


// game_scene code ----------------------------------

let PE; // Physics Environment
let SH; // Scene Handler
var pressed = new Set();
let drone;
let finalScore;
let baseScore;
let localEntries = [];
let savedEntries = [];
let allEntries = [];
let retryScreen;
let prevScore;
let camera;

let textSizeAnim;
let canControl;
let groundedTimer;

let isTyping;
let nameInput = [];

// game_scene code ----------------------------------
function game_scene_init() {
  
  finalScore = 0;
  baseScore = 0;
  camera = createVector(0, 0);
  retryScreen = new RetryScreen();
  textSizeAnim = 250;
  canControl = true;
  groundedTimer = 0;
  isTyping = false;
}

function game_scene() {
  
  let dt = 1/60;
  camera.x = drone.center.x + nativeWidth/2 + drone.center.vel_x;
  textAlign(CENTER);
  noStroke();
  baseScore = drone.center.x/1000;
  
  // draw ground and follow drone
  push();
  translate(nativeWidth-camera.x, 0);
  
  
  // drone controls
  PE.simulate(dt);
  PE.points.forEach(point => {
    point.floor_level = 20 + 2/PI * (nativeHeight/2-60)*atan(baseScore/170);
    point.ceiling_level = 20 + 2/PI * (nativeHeight/2-60)*atan(baseScore/170);
  })
  droneControl(drone);

  drone.update();
  drone.render();
  
  drawGround(drone.drone_points[0].floor_level, drone.drone_points[0].ceiling_level);
  
  if (drone.onFloor) {
    groundedTimer += 1;
  } else {
    groundedTimer = 0;
  }
  pop();
  
  // update previous score
  if (canControl) {
    finalScore = int(baseScore);
  }
  // score animation and update
  if (finalScore - prevScore != 0) {
    textSizeAnim = 200;
  }
  prevScore = finalScore;
  
  const maxTextLength = 6;
  let textSizeMultiplier = maxTextLength/(finalScore.toString().length);
  textSizeMultiplier = textSizeMultiplier<1? textSizeMultiplier : 1;
  textSizeAnim = lerp(textSizeAnim, 150, 0.1);
  textSize(textSizeAnim*textSizeMultiplier);
  fill(secondaryColor);
  text(finalScore, nativeWidth/2, nativeHeight/3);
  
  
  // game over condition
  if (groundedTimer > 70 && finalScore != 0) {
    retryScreen.active = true;
    if (canControl) {
      isTyping = true;
      nameInput = [];
      retryScreen.saveResult();
    }
    canControl = false;
  }
  retryScreen.render();
  
  menuButton.render();
}


