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
    this.hoverContentColor = options.hoverContentColor || setBrightness(this.contentColor, brightness(this.contentColor)*1.2);
    this.pressContentColor = options.pressContentColor || setBrightness(this.contentColor, brightness(this.contentColor)*0.8);
    this.inactiveContentColor = options.inactiveContentColor || setBrightness(this.contentColor, brightness(this.contentColor)*0.8);
    
    this.fillColor = options.fillColor || color('white');
    this.hoverFillColor = options.hoverFillColor || setBrightness(this.fillColor, brightness(this.fillColor)*1.5);
    this.pressFillColor = options.pressFillColor || setBrightness(this.fillColor, brightness(this.fillColor)*0.3);
    this.inactiveFillColor = options.inactiveFillColor || setBrightness(this.fillColor, brightness(this.fillColor)*0.8);
    
    this.borderColor = options.borderColor || this.contentColor;
    this.hoverBorderColor = options.hoverBorderColor || this.hoverContentColor;
    this.pressBorderColor = options.pressBorderColor || this.pressContentColor;
    this.inactiveBorderColor = options.inactiveBorderColor || this.inactiveContentColor;
    this.borderWeight = options.borderWeight || 4;
    
    this.isActive = options.isActive!=null? options.isActive : true;
    this.isHovered = false;
    this.isFirstPressed = false;
    this.isPressed = false;
    this.onPressed = options.onPressed || function () {return};
    this.runningFunction = options.runningFunction || function () {return};
                                                       
    buttonArray.push(this);
  }
    
  render() {
    this.checkMouse();
    this.runningFunction();

    if (!this.visible) return;
    
    push();
    strokeWeight(this.borderWeight);
    if (!this.isActive) {
      stroke(this.inactiveBorderColor);
      fill(this.inactiveFillColor);
    } else if (this.isPressed) {
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
    if (!this.isActive) {
      fill(this.inactiveContentColor);
    } else if (this.isPressed) {
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
    
    if (!this.isActive) return;

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
    
  setValue(val) {
    this.handle.posX = this.posX + (val - this.minValue)/(this.maxValue-this.minValue)*this.length;
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
  
class Window {
  constructor(options) {
    this.options = options;
    
    this.contents = options.contents || [];
    this.contentSize = options.contentSize || 12;
    this.marginX = options.marginX || 0;
    this.marginY = options.marginY || 0;
    this.contentGap = options.contentGap || 0;
    this.posX = options.posX;
    this.posY = options.posY;
    this.sizeX = options.sizeX;
    this.sizeY = options.sizeY || options.sizeX;
    this.align = options.align || CORNER;
    this.contentPosition = options.contentPosition || TOP;
    this.contentAlign = options.contentAlign || LEFT;
    
    this.contentColor = options.contentColor || color('black');
    this.fillColor = options.fillColor || color('white');
    this.borderColor = options.borderColor || this.contentColor;
    this.borderWeight = options.borderWeight || 2;
    
    this.visible = options.visible!=null? options.visible : true;
    this.rounded = options.rounded || [0,0,0,0];
    this.runningFunction = options.runningFunction || function () {return;};
  }
  
  render() {
    this.runningFunction();
    if (!this.visible) return;
    
    push();
    strokeWeight(this.borderWeight);
    stroke(this.borderColor);
    fill(this.fillColor);  
    
    rectMode(this.align);
    rect(this.posX, this.posY, this.sizeX, this.sizeY, this.rounded[0], this.rounded[1], this.rounded[2], this.rounded[3]);
    
    
    // content and its colors
    noStroke();
    fill(this.contentColor);  
    
    let currContentPosY = 0;
    this.contents.forEach(content => {
      
      textAlign(content.contentAlign);
      textSize(content.contentSize);
      let contentPositionOffset = 0;
      let contentAlignOffset = 0;

      if (this.contentPosition == TOP) {
        contentPositionOffset = content.contentSize;
      } else if (this.contentPosition == CENTER) {
        contentPositionOffset = this.sizeY/2+content.contentSize/2-this.marginY;
      } else if (this.contentPosition == BOTTOM) {
        contentPositionOffset = this.sizeY;
      }
      if (content.contentAlign == CENTER) {
        contentAlignOffset = this.sizeX/2-this.marginX;
      } else if (content.contentAlign == RIGHT) {
        contentAlignOffset = this.sizeX;
      }
      if (this.align == CENTER) {
        contentAlignOffset -= this.sizeX/2;
        contentPositionOffset -= this.sizeY/2;
      }

      text(content.content,
           this.marginX + this.posX+contentAlignOffset,
           this.marginY + this.posY+contentPositionOffset+currContentPosY);
      currContentPosY += content.contentSize + this.contentGap;
    })
    pop();
  }
}
  