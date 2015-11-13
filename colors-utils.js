var tinycolor = require('tinycolor2');

function differenceHsv(color1,color2){
  var hsv1 = tinycolor(color1).toHsv();
  var hsv2 = tinycolor(color2).toHsv();
  return {
    h: hsv1.h - hsv2.h,
    s: hsv1.s - hsv2.s,
    v: hsv1.v - hsv2.v,
  };
}

function shiftColor(img, color2, color1) {
  var hsv = differenceHsv(color1,color2);
  return img.color([
      { apply: 'hue', params: [ hsv.h ] },
      { apply: (hsv.s < 0) ? 'desaturate' : 'saturate', params: [ Math.abs(hsv.s) ] },
      { apply: (hsv.v < 0) ? 'darken' : 'lighten', params: [ Math.abs(hsv.v) ] }
  ]);
}

function colorize(img, color) {
  var rgb = tinycolor(color).toRgb();
  return img.color([
      { apply: 'lighten', params: [ 100 ] },
      { apply: 'red', params: [ rgb.r ] },
      { apply: 'green', params: [ rgb.g ] },
      { apply: 'blue', params: [ rgb.b ] }
  ]);
}

module.exports = {
  colorize: colorize,
  shiftColor: shiftColor
};
