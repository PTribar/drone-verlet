class ExpandingArms {
  constructor(x, y, length) {
    this.x = x;
    this.y = y;
    this.vel_x = 0;
    this.vel_y = 0;
    this.swingSpeedX = random(0.007, 0.012);
    this.swingMagnitudeX = random(0.4, 0.8);
    this.swingSpeedY = random(0.004, 0.008);
    this.swingMagnitudeY = random(0.6, 1.2);
    this.activeMeter = 0;
    this.lifetime = 3000;
    this.age = 0;
    this.rotation = 0;
    this.size = 20;
    this.length = 0;
    this.expansion = 0;
    this.cameraShakeMagnitude = 0;
    this.sparks = [];
    this.isActive = false;
    this.renderColor = secondaryColor;
    
    this.shakeAnim = new AnimationValue(40, 0, PI/6, function(t){
      return sin(8*PI*t)*pow((t-1),2);
    }, 20);
    this.scaleAnim = new AnimationValue(30, 0.5, 1, 'quadratic-out', this.shakeAnim.totalFrames-10);
    this.lengthAnim = new AnimationValue(20, this.size*2, nativeHeight-this.size*4*2, 'quadratic-in', this.scaleAnim.totalFrames);
    this.pushAnim = new AnimationValue(40, 0, 200, 'linear', this.lengthAnim.totalFrames+60);
    
    this.lengthEndAnim = new AnimationValue(20, this.lengthAnim.val, this.size*3, 'quadratic-out', 30);
    this.scaleEndAnim = new AnimationValue(30, this.scaleAnim.val, 0, 'quadratic-in', this.lengthEndAnim.totalFrames);
    this.sizeEndAnim = new AnimationValue(20, 1, 0, 'quadratic-in', this.scaleEndAnim.totalFrames-10);
    this.sparksDelay = new AnimationValue(10, 1, 0);
    this.activeMoveAnim = new AnimationValue(500, 0, 1, 'ease-out-back');
  }
  update(floorLevel, ceilingLevel) {
    const gap = nativeHeight - floorLevel - ceilingLevel;
    const centerErr = closingCenter - this.y;

    this.age += 1;
    this.lifetime -= 1;
    this.lifetime = clamp(this.lifetime, 0, Infinity);
    this.activeMeter = clamp(this.activeMeter, 0, 100);
    if (this.activeMeter == 100) {
      this.isActive = true;
    }
    this.x += this.vel_x + cos(this.age*this.swingSpeedX)*this.swingSpeedX*this.swingMagnitudeX*gap/2;
    this.y += this.vel_y + cos(this.age*this.swingSpeedY)*this.swingSpeedY*this.swingMagnitudeY*gap/2+centerErr*0.002
    stroke('red');
    if (!this.isActive) {
      return;
    }
    
    let gapHeight = nativeHeight-floorLevel-ceilingLevel;
    this.activeMoveAnim.animate();
    this.y = lerp(this.y, ceilingLevel+gapHeight/2, this.activeMoveAnim.val);
    this.x = lerp(this.x, drone.x+drone.vel_x+nativeWidth*0.3, this.activeMoveAnim.val);
    
    this.lengthAnim.endVal = gapHeight-this.size*5;
    this.lengthEndAnim.startVal = this.lengthAnim.endVal;
    this.scaleEndAnim.startVal = this.scaleAnim.val;
  }
  
  render() {
    if (this.lifetime == 0) {
      return;
    }
    
    this.renderColor = color(red(secondaryColor),
                             green(secondaryColor),
                             blue(secondaryColor),
                             100+155*this.activeMeter/100);
    
    if (this.isActive) {
      this.lifetime = 1000;
    this.renderColor = color(red(secondaryColor),
                             green(secondaryColor),
                             blue(secondaryColor));
      
      this.size = lerp(this.size, 25, 0.01)

      this.expansion = -this.pushAnim.val;

      this.lengthAnim.animate();
      this.scaleAnim.animate();
      this.pushAnim.animate();
      this.shakeAnim.animate();

      this.expansion += this.pushAnim.val;

      this.cameraShakeMagnitude = lerp(this.cameraShakeMagnitude, 0, 0.05);

      if (this.pushAnim.isFinished) {
        this.lengthEndAnim.animate();
        this.scaleEndAnim.animate();
        this.sizeEndAnim.animate();
        this.lengthAnim.val = this.lengthEndAnim.val;
        this.scaleAnim.val = this.scaleEndAnim.val;
      }
      if (this.sizeEndAnim.isFinished) {
        this.sparksDelay.animate();
        if (this.sparksDelay.currFrame == this.sparksDelay.frames && this.sparksDelay.isPlaying) {
          for (let i=0; i<15; i++) {
            let spark = PE.createPoint(this.x, this.y);
            spark.x += random(-30, 30);
            spark.y += random(-30, 30);
            spark.lifetime = 10;
            this.sparks.push(spark);
          }
        }
      }
      this.sparks.forEach((spark, index) => {
        if (spark.lifetime == 0) {
          this.sparks.splice(index, 1);
          this.lifetime = 0;
        }
        push();
        strokeWeight(5);
        stroke(secondaryColor);
        line(spark.x, spark.y, spark.old_x, spark.old_y);
        pop();
      });
      this.length = this.lengthAnim.val;
      this.rotation = this.shakeAnim.val;
    } else {
      
      push();
      noFill();
      strokeCap(SQUARE);
      strokeWeight(12);
      stroke(secondaryColor);
      arc(this.x, this.y, this.size*8, this.size*8, 0, 2*PI*this.activeMeter/100);
      pop();
      
    }
    
    
    if (this.lifetime < 200) {
      this.renderColor = setBrightness(secondaryColor, brightness(secondaryColor)*sin(frameCount/2)/2+1/2);
    }
    
    push();
    translate(this.x, this.y);
    rotate(this.rotation);
    scale(this.sizeEndAnim.val);
    
    strokeWeight(8);
    stroke(this.renderColor);
    fill(primaryColor);
    rect(0, 0, this.size*2, this.length-this.size);
    
    fill(this.renderColor);
    rect(0, 0, this.size*0.4, this.length-this.size);
    
    // claw
    for (let i=0; i<2; i++) {
      rotate(PI*i)
      push();
      translate(0, -this.size*1.2);
      scale(this.scaleAnim.val);
      strokeWeight(12);
      stroke(primaryColor);
      fill(this.renderColor);
      beginShape();
      translate(0, this.length/2-this.size);
      vertex(this.size*0,this.size*0);
      vertex(this.size*4,this.size*2);
      // dent right
      vertex(this.size*4,this.size*3.6);
      vertex(this.size*4.4,this.size*3.6);
      vertex(this.size*4.4,this.size*4.4);
      vertex(this.size*1.6,this.size*4.4);
      vertex(this.size*1.6,this.size*3.6);
      vertex(this.size*2,this.size*3.6);
      // end dent right
      vertex(this.size*2,this.size*3);
      vertex(this.size*0,this.size*2);
      vertex(this.size*-2,this.size*3);
      // dent left
      vertex(this.size*-2,this.size*3.6);
      vertex(this.size*-1.6,this.size*3.6);
      vertex(this.size*-1.6,this.size*4.4);
      vertex(this.size*-4.4,this.size*4.4);
      vertex(this.size*-4.4,this.size*3.6);
      vertex(this.size*-4,this.size*3.6);
      // end dent left
      vertex(this.size*-4,this.size*2);    
      endShape(CLOSE);
      translate(0, this.size*1.8);
      scale(1, 0.5);
      rotate(PI/2);
      stroke(this.renderColor);
      fill(primaryColor);
      polygon(0, 0, this.size*1.6, 3);
      pop();
    }
    
    this.renderIcon();
    pop();
  }
  
  renderIcon(x=0, y=0, s=1) {
    push();
    translate(x, y);
    scale(s);
    rotate(PI/2);
    stroke(this.renderColor);
    fill(primaryColor);
    polygon(0, 0, this.size*2.8, 6);
    
    noStroke();
    fill(this.renderColor);
    rotate(-PI/2);
  
    for (let i=0; i<2; i++) {
      rotate(PI*i);
      beginShape();
      vertex(0,this.size*1.2);
      vertex(this.size*sqrt(3)/2*1.2,this.size/2*1.2);
      vertex(this.size*2*sqrt(3)/2,this.size);
      vertex(0,this.size*2);
      vertex(-this.size*2*sqrt(3)/2,this.size);
      vertex(-this.size*sqrt(3)/2*1.2,this.size/2*1.2);
      endShape(CLOSE);
    }
    rotate(PI/4);
    rect(0, 0, this.size, this.size);
    
    pop();
  }
}