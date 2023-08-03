class Drone {
  constructor(x, y, isStatic=false) {
    this.x = x;
    this.y = y;
    this.body_size = 100;
    this.wing_size = 50;
    this.leg_length = 30;
    this.left_thrust = 0;
    this.left_force = createVector(0, 0);
    this.left_rotation = 0;
    this.right_thrust = 0;
    this.right_force = createVector(0, 0);
    this.right_rotation = 0;
    this.maxThrust = 4000;
    this.static = isStatic;
    this.strokeColor = 'white';
    this.fillColor = 'black';
    
    this.center = PE.createPoint(this.x, this.y);
    
    this.body_points = [
      PE.createPoint(this.x+this.body_size/2, this.y+this.body_size/5),
      PE.createPoint(this.x-this.body_size/2, this.y+this.body_size/5),
      PE.createPoint(this.x-this.body_size/2, this.y-this.body_size/5),
      PE.createPoint(this.x+this.body_size/2, this.y-this.body_size/5),
      
      PE.createPoint(this.x+this.body_size/2.5, this.y+this.body_size/5),
      PE.createPoint(this.x-this.body_size/2.5, this.y+this.body_size/5),
    ];
    
    this.body_sticks = [
      PE.createStick(this.body_points[0], this.body_points[4]),
      PE.createStick(this.body_points[4], this.body_points[5]),
      PE.createStick(this.body_points[5], this.body_points[1]),
      PE.createStick(this.body_points[1], this.body_points[2]),
      PE.createStick(this.body_points[2], this.body_points[3]),
      PE.createStick(this.body_points[3], this.body_points[0]),
      PE.createStick(this.body_points[0], this.center),
      PE.createStick(this.body_points[1], this.center),
      PE.createStick(this.body_points[2], this.center),
      PE.createStick(this.body_points[3], this.center),
    ];
    
    this.left_points = [
      PE.createPoint(this.x+this.wing_size-(this.body_size*1.3), this.y+10),
      PE.createPoint(this.x-this.wing_size-(this.body_size*1.3), this.y+10),
      PE.createPoint(this.x-this.wing_size-(this.body_size*1.3), this.y-10),
      PE.createPoint(this.x+this.wing_size-(this.body_size*1.3), this.y-10),
    ];
    
    this.left_sticks = [
      PE.createStick(this.left_points[0], this.left_points[1]),
      PE.createStick(this.left_points[1], this.left_points[2]),
      PE.createStick(this.left_points[2], this.left_points[3]),
      PE.createStick(this.left_points[3], this.left_points[0]),
      PE.createStick(this.left_points[2], this.left_points[0]),
      PE.createStick(this.left_points[1], this.left_points[3]),
    ];
    
    this.right_points = [
      PE.createPoint(this.x+this.wing_size+(this.body_size*1.3), this.y+10),
      PE.createPoint(this.x-this.wing_size+(this.body_size*1.3), this.y+10),
      PE.createPoint(this.x-this.wing_size+(this.body_size*1.3), this.y-10),
      PE.createPoint(this.x+this.wing_size+(this.body_size*1.3), this.y-10),
    ];
    
    this.right_sticks = [
      PE.createStick(this.right_points[0], this.right_points[1]),
      PE.createStick(this.right_points[1], this.right_points[2]),
      PE.createStick(this.right_points[2], this.right_points[3]),
      PE.createStick(this.right_points[3], this.right_points[0]),
      PE.createStick(this.right_points[2], this.right_points[0]),
      PE.createStick(this.right_points[1], this.right_points[3]),
    ];
    
    this.left_links = [
      PE.createStick(this.body_points[1], this.left_points[0]),
      PE.createStick(this.body_points[2], this.left_points[3]),
      PE.createStick(this.body_points[1], this.left_points[3]),
      PE.createStick(this.body_points[2], this.left_points[0]),
    ];
    this.right_links = [
      PE.createStick(this.body_points[0], this.right_points[1]),
      PE.createStick(this.body_points[3], this.right_points[2]),
      PE.createStick(this.body_points[0], this.right_points[2]),
      PE.createStick(this.body_points[3], this.right_points[1]),
    ];
    this.middle_links = [
      PE.createStick(this.left_points[0], this.right_points[1]),
      PE.createStick(this.left_points[3], this.right_points[2]),
    ];
    
    this.leg_points = [
      PE.createPoint(this.body_points[4].x, this.body_points[4].y+this.leg_length),
      PE.createPoint(this.body_points[0].x, this.body_points[0].y+this.leg_length),
      PE.createPoint(this.body_points[5].x, this.body_points[5].y+this.leg_length),
      PE.createPoint(this.body_points[1].x, this.body_points[1].y+this.leg_length),
    ]
    
    this.leg_sticks = [
      PE.createStick(this.body_points[4], this.leg_points[0]),
      PE.createStick(this.leg_points[0], this.leg_points[1]),
      PE.createStick(this.leg_points[1], this.body_points[0]),
      PE.createStick(this.body_points[4], this.leg_points[1]),
      PE.createStick(this.body_points[0], this.leg_points[0]),
      
      PE.createStick(this.body_points[5], this.leg_points[2]),
      PE.createStick(this.leg_points[2], this.leg_points[3]),
      PE.createStick(this.leg_points[3], this.body_points[1]),
      PE.createStick(this.body_points[5], this.leg_points[3]),
      PE.createStick(this.body_points[1], this.leg_points[2]),
    ]
    
    this.support_links = [
      PE.createStick(this.body_points[4], this.leg_points[2]),
      PE.createStick(this.body_points[5], this.leg_points[1]),
      PE.createStick(this.left_points[1], this.leg_points[3]),
      PE.createStick(this.right_points[0], this.leg_points[0]),
      
      PE.createStick(this.left_points[2], this.body_points[2]),
      PE.createStick(this.right_points[3], this.body_points[3]),
    ]
    
    this.drone_points = this.body_points.concat(this.left_points).
                  concat(this.right_points).concat(this.leg_points);
    
    this.drone_points.forEach(pt => {pt.pinned = this.static});
  }
  
  update(debug = false) {
    this.x = this.center.x;
    this.y = this.center.y;
    
    
    this.left_force = createVector(
      -(this.left_points[0].x-this.left_points[3].x + this.left_points[1].x-this.left_points[2].x)/2,
      -(this.left_points[0].y-this.left_points[3].y + this.left_points[1].y-this.left_points[2].y)/2,
    )
    this.left_force.setMag(this.left_thrust);

    this.right_force = createVector(
      -(this.right_points[0].x-this.right_points[3].x + this.right_points[1].x-this.right_points[2].x)/2,
      -(this.right_points[0].y-this.right_points[3].y + this.right_points[1].y-this.right_points[2].y)/2,
    )
    this.right_force.setMag(this.right_thrust);
    
    this.left_points.forEach(point => {
      point.applyForce(this.left_force.x, this.left_force.y);
    })
    this.right_points.forEach(point => {
      point.applyForce(this.right_force.x, this.right_force.y);
    })
    
    if (debug) {
      this.debug();
    }
  }
  
  isGrounded() {
    let onFloor = false;
    let onCeiling = false;
    this.drone_points.forEach(point => {
      if (!onFloor) {
        onFloor = point.y+1 >= nativeHeight-point.floor_level;
      }
    })
    
    return onFloor;
  }
  
  render() {
    push();
    strokeWeight(5);
    stroke(this.strokeColor);
    strokeCap(SQUARE);
    noFill();
    // left frame
    beginShape();
    vertex(this.left_points[0].x, this.left_points[0].y);
    vertex(this.left_points[3].x, this.left_points[3].y);
    vertex(this.left_points[2].x, this.left_points[2].y);
    vertex(this.left_points[1].x, this.left_points[1].y);
    endShape();
    
    // right frame
    beginShape();
    vertex(this.right_points[0].x, this.right_points[0].y);
    vertex(this.right_points[3].x, this.right_points[3].y);
    vertex(this.right_points[2].x, this.right_points[2].y);
    vertex(this.right_points[1].x, this.right_points[1].y);
    endShape();
    
    // links
    strokeWeight(10);
    beginShape(LINES);
    vertex((this.left_points[0].x+this.left_points[3].x)/2,
           (this.left_points[0].y+this.left_points[3].y)/2);
    vertex((this.right_points[1].x+this.right_points[2].x)/2,
           (this.right_points[1].y+this.right_points[2].y)/2);
    endShape();
    
    
    // body
    fill(this.fillColor);
    strokeWeight(5);
    beginShape();
    vertex(this.body_points[0].x, this.body_points[0].y);
    vertex(this.body_points[1].x, this.body_points[1].y);
    vertex(this.body_points[2].x, this.body_points[2].y);
    vertex(this.body_points[3].x, this.body_points[3].y);
    endShape(CLOSE);
    
    
    // eyes
    beginShape(LINES);
    vertex(this.left_points[3].x+(this.right_points[2].x-this.left_points[3].x)/1.75,
           this.left_points[3].y+(this.right_points[2].y-this.left_points[3].y)/1.75);
    vertex(this.left_points[0].x+ (this.right_points[1].x-this.left_points[0].x)/1.75,
           this.left_points[0].y+ (this.right_points[1].y-this.left_points[0].y)/1.75);
    
    vertex(this.left_points[3].x+ (this.right_points[2].x-this.left_points[3].x)/2.25,
           this.left_points[3].y+ (this.right_points[2].y-this.left_points[3].y)/2.25);
    vertex(this.left_points[0].x+ (this.right_points[1].x-this.left_points[0].x)/2.25,
           this.left_points[0].y+ (this.right_points[1].y-this.left_points[0].y)/2.25);
    endShape();
    
    // legs
    beginShape(LINES);
    vertex(this.body_points[4].x, this.body_points[4].y);
    vertex(this.leg_points[0].x, this.leg_points[0].y);
    vertex(this.body_points[5].x, this.body_points[5].y);
    vertex(this.leg_points[2].x, this.leg_points[2].y);
    endShape();
    
    
    // propellers
    strokeWeight(10);
    
    const leftPropRatio = (ratio) => {
      return createVector(this.left_points[2].x+(this.left_points[3].x-this.left_points[2].x)*ratio,
                          this.left_points[2].y+(this.left_points[3].y-this.left_points[2].y)*ratio);
    }
    
    var leftPropDir = createVector(leftPropRatio(0.9).x-leftPropRatio(0.1).x,
                                   leftPropRatio(0.9).y-leftPropRatio(0.1).y);
    leftPropDir.rotate(PI/2).normalize();
    var leftPropSpan = 0.8;
    this.left_rotation += this.left_thrust/5000;
    
    beginShape(LINES);
    vertex(leftPropRatio(0.5-leftPropSpan/2 * sin(this.left_rotation)).x+leftPropDir.x*15,
           leftPropRatio(0.5-leftPropSpan/2 * sin(this.left_rotation)).y+leftPropDir.y*15);
    
    vertex(leftPropRatio(0.5+leftPropSpan/2 * sin(this.left_rotation)).x+leftPropDir.x*15,
           leftPropRatio(0.5+leftPropSpan/2 * sin(this.left_rotation)).y+leftPropDir.y*15);
    endShape();
    
    
    
    const rightPropRatio = (ratio) => {
      return createVector(this.right_points[2].x+(this.right_points[3].x-this.right_points[2].x)*ratio,
                          this.right_points[2].y+(this.right_points[3].y-this.right_points[2].y)*ratio);
    }
    
    var rightPropDir = createVector(rightPropRatio(0.9).x-rightPropRatio(0.1).x,
                                   rightPropRatio(0.9).y-rightPropRatio(0.1).y);
    rightPropDir.rotate(PI/2).normalize();
    var rightPropSpan = 0.8;
    this.right_rotation += this.right_thrust/5000;
    
    beginShape(LINES);
    vertex(rightPropRatio(0.5-rightPropSpan/2 * sin(this.right_rotation)).x+rightPropDir.x*15,
           rightPropRatio(0.5-rightPropSpan/2 * sin(this.right_rotation)).y+rightPropDir.y*15);
    
    vertex(rightPropRatio(0.5+rightPropSpan/2 * sin(this.right_rotation)).x+rightPropDir.x*15,
           rightPropRatio(0.5+rightPropSpan/2 * sin(this.right_rotation)).y+rightPropDir.y*15);
    endShape();
    
    pop();
    
  }
  
  debug() {
    
    let left_center = createVector(
      ((this.left_points[0].x + this.left_points[1].x)/2 + (this.left_points[2].x + this.left_points[3].x)/2)/2,
      ((this.left_points[0].y + this.left_points[1].y)/2 + (this.left_points[2].y + this.left_points[3].y)/2)/2
    )    
    let right_center = createVector(
      ((this.right_points[0].x + this.right_points[1].x)/2 + (this.right_points[2].x + this.right_points[3].x)/2)/2,
      ((this.right_points[0].y + this.right_points[1].y)/2 + (this.right_points[2].y + this.right_points[3].y)/2)/2
    )
    
    stroke('lime');
    line(left_center.x, left_center.y, left_center.x+this.left_force.x/this.maxThrust*800, left_center.y+this.left_force.y/this.maxThrust*800);
    
    stroke('red');
    line(right_center.x, right_center.y, right_center.x+this.right_force.x/this.maxThrust*800, right_center.y+this.right_force.y/this.maxThrust*800);
  }
  
}