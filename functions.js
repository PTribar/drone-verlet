function distance(p0, p1) {
  let dx = p1.x - p0.x;
  let dy = p1.y - p0.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function clamp(val, minVal, maxVal) {
  return min(maxVal, max(minVal, val));
}
  
function setBrightness(col, targetBright) {
  let currBright = brightness(col);
  let ratio = targetBright/currBright;
  
  if (ratio)
    return color(red(col)*ratio, green(col)*ratio, blue(col)*ratio);
  else
    return color(0);
}