class Button {
  constructor(options) {
    this.options = options;
    
    this.content = options.content || '';
    this.contentSize = options.contentSize || 12;
    this.contentOffsetX = options.contentOffsetX || 0;
    this.contentOffsetY = options.contentOffsetY || 0;
    this.screenScale = options.screenScale || 1;
    this.posX = options.posX;
    this.posY = options.posY;
    this.sizeX = options.sizeX;
    this.sizeY = options.sizeY || options.sizeX;
    this.align = options.align || CORNER;
    
    this.visible = options.visible!=null? options.visible : true;
    this.rounded = options.rounded || [0,0,0,0];
    this.contentColor = options.contentColor || color('black');
    this.hoverContentColor = options.hoverContentColor || color('black');
    this.pressContentColor = options.pressContentColor || color('white');
    this.fillColor = options.fillColor || color('white');
    this.hoverFillColor = options.hoverFillColor || color('grey');
    this.pressFillColor = options.pressFillColor || color('black');
    this.borderColor = options.borderColor || color('black');
    this.hoverBorderColor = options.hoverBorderColor || color('black');
    this.pressBorderColor = options.pressBorderColor || color('white');
    this.borderWeight = options.borderWeight || 2;
    
    this.isHovered = false;
    this.isFirstPressed = false;
    this.isPressed = false;
    this.onPressed = options.onPressed || function () {return};
  }
  
  render() {
    this.checkMouse();
    
    if (!this.visible) return;
    
    push();
    strokeWeight(this.borderWeight);
    if (this.isPressed) {
      stroke(this.pressBorderColor);
      fill(this.pressFillColor);
    } else if (this.isHovered) {
      stroke(this.hoverBorderColor);
      fill(this.hoverFillColor);
    } else {
      stroke(this.borderColor);
      fill(this.fillColor);  
    }
    
    rectMode(this.align);
    rect(this.posX, this.posY, this.sizeX, this.sizeY, this.rounded[0], this.rounded[1], this.rounded[2], this.rounded[3]);
    
    
    // content and its colors
    noStroke();
    if (this.isPressed) {
      fill(this.pressContentColor);
    } else if (this.isHovered) {
      fill(this.hoverContentColor);
    } else {
      fill(this.contentColor);  
    }
    
    textAlign(CENTER);
    textSize(this.contentSize);
    if (this.align == CENTER) {
      text(this.content, this.posX + this.contentOffsetX, this.posY+this.contentSize/2 + this.contentOffsetY);
    } else if (this.align == CORNER) {
      text(this.content, this.posX+this.sizeX/2 + this.contentOffsetX, this.posY+this.sizeY/2+this.contentSize/2 + this.contentOffsetY);
    }
    pop();
  }
  
  checkMouse() {
    
    let xAxisAligned = false;
    let yAxisAligned = false;
    let relativeMouseX = mouseX/resolution;
    let relativeMouseY = mouseY/resolution;
    
    if (this.align == CENTER) {
      xAxisAligned = this.posX-this.sizeX/2<=relativeMouseX && relativeMouseX<=this.posX+this.sizeX/2;
      yAxisAligned = this.posY-this.sizeY/2<=relativeMouseY && relativeMouseY<=this.posY+this.sizeY/2;
    } else if (this.align == CORNER) {
      xAxisAligned = this.posX<=relativeMouseX && relativeMouseX<=this.posX+this.sizeX;
      yAxisAligned = this.posY<=relativeMouseY && relativeMouseY<=this.posY+this.sizeY;
    }
    
    
    this.isHovered = xAxisAligned && yAxisAligned;

    if (mouseIsPressed) {
      this.isPressed = this.isHovered && this.isFirstPressed; 
    } else {
      this.isFirstPressed = this.isHovered;
      if (this.isPressed) {
        this.isPressed = false;
        this.onPressed();
      }
    }
  }
  
  clone() {
    return new Button(this.options);
  }
}

class Slider {
  constructor(options) {
    this.options = options;
    
    this.posX = options.posX; 
    this.posY = options.posY; 
    this.screenScale = options.screenScale || 1;
    this.length = options.length;
    this.handle = options.handle;
    this.minValue = options.minValue || 0;
    this.maxValue = options.maxValue || 1;
    this.value = options.value || this.minValue;
    this.held = false;
    this.trackColor = options.trackColor || color('grey');
    this.trackWeight = options.trackWeight || 8;
    
    this.segments = floor(options.segments) || 0;
    
    // remove button properties
    this.handle.posX = this.posX + (this.value - this.minValue)/(this.maxValue-this.minValue)*this.length;
    this.handle.posY = this.posY;
    this.handle.align = CENTER;
    this.handle.screenScale = this.screenScale;
    this.handle.onPressed = function () {return};

    this.trackButton = new Button({
      posX: this.posX,
      posY: this.posY-this.handle.sizeY/2,
      sizeX: this.length,
      sizeY: this.handle.sizeY,
      visible: false,
    })                                         
    

  }
    
  calcValue() {
    const ratio = (this.handle.posX-this.posX)/this.length;
    this.value = ratio*(this.maxValue-this.minValue) + this.minValue;
  }
  
  update() {
    let relativeMouseX = mouseX/resolution;
    
    if (this.handle.isPressed || this.trackButton.isPressed || this.held) {
      this.held = true;
      
      if (this.segments>0) {
        const segmentLength = this.length/this.segments;
        const segmentMultiplier = floor((relativeMouseX-this.posX+segmentLength/2)/segmentLength);
        this.handle.posX = this.posX+segmentMultiplier*segmentLength;
        
      } else {
        this.handle.posX = relativeMouseX;
      }
      
    }
    if (!mouseIsPressed) {
      this.held = false;
    }
    this.handle.posX = min(this.posX+this.length, max(this.posX, this.handle.posX));
  }
  
  render() {
    this.calcValue();
    this.update();
    
    push();
    stroke(this.trackColor);
    strokeWeight(this.trackWeight);
    
    line(this.posX, this.posY, this.posX+this.length, this.posY);    
    pop();
    this.trackButton.render();
    this.handle.render();
  }
  
  clone() {
    return new Slider(this.options);
  }
}