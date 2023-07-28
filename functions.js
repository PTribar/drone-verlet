function distance(p0, p1) {
  let dx = p1.x - p0.x;
  let dy = p1.y - p0.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function clamp(val, minVal, maxVal) {
  return min(maxVal, max(minVal, val));
}