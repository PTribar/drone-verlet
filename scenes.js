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
  droneControl();

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
  
}