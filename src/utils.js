export function getCurrentOrientation() {
  return window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
}

export function getScale(resWidth, resHeight, screenNewWidth, screenNewHeight) {
  let screenWidth = resWidth;
  let screenHeight = resHeight;
  let newScaleX = screenNewWidth / screenWidth;
  let newScaleY = screenNewHeight / screenHeight;
  return newScaleX < newScaleY ? newScaleX : newScaleY;
}