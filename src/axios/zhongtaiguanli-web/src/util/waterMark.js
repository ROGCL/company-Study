var waterMarkDiv = null
var waterMarkCanvas = null

function waterMark (text) {
  if (waterMarkDiv) {
    return
  }

  waterMarkDiv = document.createElement('div');
  var style = waterMarkDiv.style;
  style.position = 'fixed';
  style.left = 0;
  style.top = '-10%';
  style.width = '200%';
  style.height = '200%';
  style.opacity = '0.2';
  style.background = "url(" + textBecomeImg(text, 16, "#666") + ")";
  style.zIndex = 9999999991;
  style.transform = "translateX(-100px) rotate(-30deg)";
  style.pointerEvents = "none";
  document.body.appendChild(waterMarkDiv)
}

function textBecomeImg (text, fontsize, fontcolor) {
  if (waterMarkCanvas) {
    return
  }

  waterMarkCanvas = document.createElement('canvas');
  var $buHeight = 0;
  if (fontsize <= 32) { $buHeight = 99; }
  else if (fontsize > 32 && fontsize <= 60) { $buHeight = 2; }
  else if (fontsize > 60 && fontsize <= 80) { $buHeight = 4; }
  else if (fontsize > 80 && fontsize <= 100) { $buHeight = 6; }
  else if (fontsize > 100) { $buHeight = 10; }
  waterMarkCanvas.height = fontsize + $buHeight;
  waterMarkCanvas.padding = 30;
  var context = waterMarkCanvas.getContext('2d');
  context.clearRect(0, 0, waterMarkCanvas.width * 2, waterMarkCanvas.height);
  context.fillStyle = fontcolor;
  context.font = fontsize + "px Arial";
  context.textAlign = "center";
  context.textBaseline = 'middle';
  context.fillText(text, 0, fontsize / 2);

  waterMarkCanvas.width = 450;
  waterMarkCanvas.height = 200;
  context.fillStyle = fontcolor;
  context.font = fontsize + "px Arial";
  context.textBaseline = 'middle';
  context.fillText(text, 0, fontsize / 2);
  var dataUrl = waterMarkCanvas.toDataURL('image/png');
  return dataUrl;
}

function removeWaterMark () {
  if (waterMarkDiv) {
    waterMarkDiv.remove()
    waterMarkDiv = null

  }

  if (waterMarkCanvas) {
    waterMarkCanvas.remove()
    waterMarkCanvas = null
  }
}

export default waterMark
export {
  waterMark,
  removeWaterMark
}