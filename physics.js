class PhysicsEnvironment {
  constructor() {
    this.points = [];
    this.sticks = [];
    this.gravity_x = 0;
    this.gravity_y = 980;
  }
  
  simulate(dt) {
    // Update all points
    for (let point of this.points) {
      point.applyGravity(this.gravity_x, this.gravity_y);
      point.update(dt);
      point.resetForces();
    }

    // Update all sticks
    for (let i = 0; i < 10; i++) {
      for (let stick of this.sticks) {
        stick.update(dt);
      }
    }

    // Force points to stay inside the window borders
    for (let point of this.points) {
      point.constrain();
    }

    // Render all points and sticks
    for (let stick of this.sticks) {
      if (stick.visible) {
        stick.render();
      }
    }
    for (let point of this.points) {
      if (point.visible) {
        point.render();
      }
    }
  }
  
  createPoint(x, y, mass, pinned) {
    let point = new PhysicsPoint(x, y, mass, pinned);
    this.points.push(point);
    return point;
  }
  
  createStick(p0, p1, length) {
    let stick = new PhysicsStick(p0, p1, length); 
    this.sticks.push(stick);
    return stick;
  }
}

class PhysicsPoint {
  constructor(x, y, mass=1, pinned, visible=false) {
    this.x = x;
    this.y = y;
    this.old_x = x;
    this.old_y = y;
    this.force_x = 0;
    this.force_y = 0;
    this.bounce_index = 0.9;
    this.drag_index = 0.99;
    this.friction_index = 0.9;
    this.mass = mass;
    this.pinned = pinned;
    this.floor_level = 20;
    this.ceiling_level = 20;
    this.visible = visible;
  }
  update(dt) {
    if (!this.pinned) {
      let vel_x = (this.x - this.old_x);
      let vel_y = (this.y - this.old_y) * this.drag_index;

      // The current position becomes the old one
      this.old_x = this.x;
      this.old_y = this.y;

      // Compute the acceleration using a=F/m
      let acc_x = this.force_x / this.mass;
      let acc_y = this.force_y / this.mass;

      // Estimate the new position using Verlet integration
      this.x += vel_x + acc_x * dt*dt;
      this.y += vel_y + acc_y * dt*dt;
    }
  }
  constrain() {
    let vel_x = (this.x - this.old_x);
    let vel_y = (this.y - this.old_y);
    // if (this.x < 0) {
    //   this.x = 0;
    //   this.old_x = this.x + vel_x * this.bounce_index;
    //   this.old_y += vel_y * this.friction_index;
    // } else if (this.x > nativeWidth) {
    //   this.x = nativeWidth;
    //   this.old_x = this.x + vel_x * this.bounce_index;
    //   this.old_y += vel_y * this.friction_index;
    // }
    if (this.y < this.ceiling_level) {
      this.y = this.ceiling_level;
      this.old_y = this.y + vel_y * this.bounce_index;
      this.old_x += vel_x * this.friction_index;
    } else if (this.y > nativeHeight-this.floor_level) {
      this.y = nativeHeight-this.floor_level;
      this.old_y = this.y + vel_y * this.bounce_index;
      this.old_x += vel_x * this.friction_index;
    }
  }
  render() {
    noStroke();
    fill("white");
    circle(this.x, this.y, 5);
  }
  applyForce(x, y) {
    this.force_x += x;
    this.force_y += y;
  }
  applyGravity(x, y) {
    this.force_x += x*this.mass;
    this.force_y += y*this.mass;
  }
  resetForces() {
    this.force_x = 0;
    this.force_y = 0;
  }
}

class PhysicsStick {
  constructor(p0, p1, length=distance(p0, p1), visible=false) {
    this.p0 = p0;
    this.p1 = p1;
    this.length = length;
    this.visible = visible;
  }
  update(dt) {
    let dx = this.p1.x - this.p0.x;
    let dy = this.p1.y - this.p0.y;
    let dist = Math.sqrt(dx * dx + dy * dy);
    let diff = this.length - dist;
    let percent = (diff / dist) / 2;
    
    let offset_x = dx * percent;
    let offset_y = dy * percent;
    
    if (!this.p0.pinned) {
      this.p0.x -= offset_x;
      this.p0.y -= offset_y;
    }
    
    if (!this.p1.pinned) {
      this.p1.x += offset_x;
      this.p1.y += offset_y;
    }
  }
  render() {
    stroke('gray');
    line(this.p0.x, this.p0.y, this.p1.x, this.p1.y);
  }
}
