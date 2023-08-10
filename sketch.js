let menuButton;
let buttonArray = [];
let windowArray = [];

let primaryColor;
let secondaryColor;
let accentColor;
let groundStyle;
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
  primaryColor = themeColors[0].primary;
  secondaryColor = themeColors[0].secondary;
  accentColor = themeColors[0].accent;
  groundStyle = 0;
  
  PE = new PhysicsEnvironment();
  drone = new Drone(0, nativeHeight*0.9);
  database_init();
  title_scene_init();
  options_scene_init();
  game_scene_init();
  leaderboard_scene_init();
  
  menuButton = new Button({
    content: '<',
    contentSize: 30,
    posX: 40,
    posY: 40,
    sizeX: 60,
    sizeY: 60,
    align: CORNER,
    onPressed: function () {
      SH.curr_scene='title_scene'
    },
  });
  
  // frameRate(10);
  
  SH = new SceneHandler();
  SH.scenes.push(title_scene);
  SH.scenes.push(options_scene);
  SH.scenes.push(leaderboard_scene);
  SH.scenes.push(game_scene);
  
  
  updateTheme();
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
  
  if (isTyping) {
    
    // enter to submit score
    if (key == "Enter" || key == " ") {
      isTyping = false;
      // retry if no name was input
      if (nameInput.length==0) {
        localEntries.splice(localEntries.length-1, 1);
        retry();
      } else {
        retryScreen.submitButton.onPressed();
      }
      return;
    }
    
    // backspace to remove last character
    else if (key == "Backspace") {
      nameInput.pop();
    }
    
    // valid character input
    else if (key.length == 1 && key != " ") {
      
      // push character if not over character limit
      if (nameInput.length < charLimit) {
        nameInput.push(key); 
      }
      
      // replace last character if over character limit
      else {
        nameInput[charLimit-1] = key;
      }
    }
    
    // escape to stop typing and retry
    else if (key == "Escape") {
      isTyping = false;
      retry();
    }
    
    // save name in local entries while typing
    if (isTyping) {
      localEntries[localEntries.length-1].name = nameInput.join("");
    }
    
    // activate submit button if more than one character is inputted
    if (nameInput.length != 0) {
      retryScreen.submitButton.isActive = true;
    } else {
      retryScreen.submitButton.isActive = false;
    }
  }
  
  // after name was inputted
  else if (key == " " || key == "r" || key == "Enter") {
    if (pressed.has("ControlLeft") || pressed.has("ControlRight")) {
      SH.curr_scene = 'game_scene';
    }
    retry();
  } else if (key == "Escape") {
    SH.curr_scene = 'title_scene';
  }
  
}

function keyReleased(evt) {
  pressed.delete(evt.code);
}

function retry() {
  drone.drone_points.forEach(point => {
    PE.destroyPoint(point);
  })
  demoDrone.drone_points.forEach(point => {
    PE.destroyPoint(point);
  })
  staticDrone.drone_points.forEach(point => {
    PE.destroyPoint(point);
  })
  drone.drone_points.forEach(point => {
    PE.destroyPoint(point);
  })
  demoDrone.drone_points.forEach(point => {
    PE.destroyPoint(point);
  })
  staticDrone.drone_points.forEach(point => {
    PE.destroyPoint(point);
  })
  // if (SH.getCurrSceneName() == 'game_scene') {
    drone = new Drone(0, nativeHeight*0.8);
  // } else if (SH.getCurrSceneName() == 'options_scene') {
    demoDrone = new Drone(nativeWidth*0.5, nativeHeight*0.9);
  // }
  
  updateTheme();
  
  retryScreen.active = false;
  retryScreen.submitButton.isActive = false;
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
  if (groundStyle == 0) {
    strokeWeight(5);
    fill(secondaryColor);
    stroke(secondaryColor);
    offsetX = nativeWidth/2*floor(camera.x/(nativeWidth/2));
    line(offsetX-nativeWidth*2, nativeHeight-floor_level, offsetX+nativeWidth*2, nativeHeight-floor_level);
    for (let i=-nativeWidth; i<nativeWidth; i+=nativeWidth/20) {
      quad(offsetX+i, nativeHeight-floor_level,
           offsetX+i+20, nativeHeight-floor_level,
           offsetX+i, nativeHeight-floor_level+20,
           offsetX+i-20, nativeHeight-floor_level+20);
    }
    line(offsetX-nativeWidth*2, nativeHeight-floor_level+20, offsetX+nativeWidth*2, nativeHeight-floor_level+20);
    line(offsetX-nativeWidth*2, nativeHeight-floor_level+40, offsetX+nativeWidth*2, nativeHeight-floor_level+40);

    line(offsetX-nativeWidth*2, ceiling_level, offsetX+nativeWidth*2, ceiling_level);
    for (let i=-nativeWidth; i<nativeWidth; i+=nativeWidth/20) {
      quad(offsetX+i, ceiling_level,
           offsetX+i+20, ceiling_level,
           offsetX+i, ceiling_level-20,
           offsetX+i-20, ceiling_level-20);
    }
    line(offsetX-nativeWidth*2, ceiling_level-20, offsetX+nativeWidth*2, ceiling_level-20);
    line(offsetX-nativeWidth*2, ceiling_level-40, offsetX+nativeWidth*2, ceiling_level-40);
  } else if (groundStyle == 1) {
    strokeWeight(10);
    fill(secondaryColor);
    stroke(secondaryColor);
    offsetX = nativeWidth/2*floor(camera.x/(nativeWidth/2));
    line(offsetX-nativeWidth*2, nativeHeight-floor_level, offsetX+nativeWidth*2, nativeHeight-floor_level);
    line(offsetX-nativeWidth*2, ceiling_level, offsetX+nativeWidth*2, ceiling_level);
    
    strokeWeight(5);
    line(offsetX-nativeWidth*2, nativeHeight-floor_level+20, offsetX+nativeWidth*2, nativeHeight-floor_level+20);
    line(offsetX-nativeWidth*2, ceiling_level-20, offsetX+nativeWidth*2, ceiling_level-20);
  }
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
  background(primaryColor);
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
    this.submitButton = new Button({
      content: 'SUBMIT',
      contentSize: 24,
      align: CENTER,
      isActive: false,
      posX: this.x,
      posY: this.y,
      sizeX: this.sizeX/3,
      sizeY: 60,
      onPressed: function () {
        isTyping = false;
        submitScore();
        this.isActive=false;
      },
    })
    
  }
  
  resetAnim() {
    this.fontSizeAnim.reset();
    this.highscoreSizeAnim.forEach(anim => {
      anim.reset();
    })
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
    
    if (this.active) {
      this.y = lerp(this.y, this.activeHeight, 0.1);
    } else { 
      this.y = lerp(this.y, this.inactiveHeight, 0.1);
      this.resetAnim();
      nameInput = [];
    }
    
    rectMode(CENTER);
    strokeWeight(5);
    stroke(secondaryColor);
    fill(primaryColor);
    rect(this.x, this.y, this.sizeX, this.sizeY);
    this.showResults();
  }
  
  showResults() {
    if (this.active) {
      this.fontSizeAnim.animate();
      this.highscoreSizeAnim.forEach(anim => {
        anim.animate();
      })
    }
    noStroke();
    fill(secondaryColor);
    const maxTextLength = 4;
    let textSizeMultiplier = maxTextLength/(finalScore.toString().length);
    textSizeMultiplier = textSizeMultiplier<1? textSizeMultiplier : 1;
  
    textSize(this.fontSizeAnim.val * textSizeMultiplier);
    text(finalScore, this.x, this.y-210);
    allEntries = savedEntries.concat(localEntries);
    
    textSize(this.highscoreSizeAnim[0].val*1.2);
    text('- HIGHSCORES -', this.x, this.y-60);
    textSize(this.highscoreSizeAnim[0].val);
    text(nameInput.join(""), this.x, this.y-140);
    let sortedEntries = [...allEntries];
    sortedEntries.sort((a, b) => b.score - a.score);
    // stats for nerds
    // print("# of entries:", sortedEntries.length);
    // let totalPositive = 0;
    // sortedEntries.forEach(entry => {
    //   if (entry.score >= 0) {
    //     totalPositive++;
    //   }
    // })
    // print("# of positive:", totalPositive);
    // print("# of negative:", sortedEntries.length-totalPositive);
    // sortedEntries.forEach(entry => {print(entry.name, entry.score)})
    
    for (let i=0; i<min(sortedEntries.length, 5); i++) {
      textAlign(LEFT)
      textSize(this.highscoreSizeAnim[i].val);
      text(sortedEntries[i].name, this.x-220, this.y + 40 + 70*i);
      textAlign(RIGHT)
      text(sortedEntries[i].score, this.x+220, this.y + 40 + 70*i);
    }
    
    this.submitButton.render();
    this.submitButton.posY = this.y+this.sizeY/2-60;
  }
  
  saveResult() {
    database.getScores(savedEntries);
    var result = {
      name: nameInput.join(""),
      score: finalScore
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
    score: finalScore
  }
  
  database.ref = database.getRef('week'+database.curr_week);
  database.ref.push(result);    
  
  localEntries.splice(localEntries.length-1, 1);
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