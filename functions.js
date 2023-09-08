function distance(p0, p1) {
  let dx = p1.x - p0.x;
  let dy = p1.y - p0.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function clamp(val, minVal, maxVal) {
  return min(maxVal, max(minVal, val));
}

function sign(val) {
  if (val != 0) {
    return abs(val)/val;
  } else {
    return 0;
  }
}
  
function setBrightness(col, targetBright) {
  let currBright = brightness(col);
  let ratio = targetBright/currBright;
  
  if (ratio)
    return color(red(col)*ratio, green(col)*ratio, blue(col)*ratio);
  else
    return color(0);
}
function setOpacity(col, targetOpacity) {
  return color(red(col), green(col), blue(col), targetOpacity);
}

function polygon(x, y, radius, npoints) {
  let angle = TWO_PI / npoints;
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + cos(a) * radius;
    let sy = y + sin(a) * radius;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}