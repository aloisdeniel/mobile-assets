/*
 * Dependencies
 */

var jimp = require("jimp");
var path = require('path');
var changeCase = require('change-case');
var colorUtils = require('../colors-utils.js');

/*
 * Creates an icon from a mask logo.
 */
function createIcon(originalPath, foregroundColor, backgroundColor, callback) {
    jimp.read(originalPath, function (err, foreground) {
      if (err) {
        callback(err);
        return;
      }
      try {
        colorUtils.colorize(foreground.resize(1024,1024),foregroundColor);
        callback(null,foreground)
      } catch (e) {
        callback(e)
      }
    });
};

/*
 * Creates a compatible resource name from original image path.
 */
function createResourceName(originalPath) {
  var result = '';
  var parsed = path.parse(originalPath);
  var splits = parsed.dir.split(path.sep).filter(n => n.length > 0);

  for(var i = 0; i < splits.length; i++) {
    result += changeCase.pascalCase(splits[i]) + path.sep;
  }

  return result + changeCase.pascalCase(parsed.name);
}

/*
* Exposing module.
*/

module.exports = {
  createIcon: createIcon,
  createResourceName: createResourceName,
  icons: {
    // Square (Small)
    "/Icons/{pascalcase}_square-small.scale-100.png" : [71, 71],
    "/Icons/{pascalcase}_square-small.scale-125.png" : [89, 89],
    "/Icons/{pascalcase}_square-small.scale-150.png" : [107, 107],
    "/Icons/{pascalcase}_square-small.scale-200.png" : [142, 142],
    "/Icons/{pascalcase}_square-small.scale-400.png" : [284, 284],

    // Square (Medium)
    "/Icons/{pascalcase}_square-medium.scale-100.png" : [150, 150],
    "/Icons/{pascalcase}_square-medium.scale-125.png" : [188, 188],
    "/Icons/{pascalcase}_square-medium.scale-150.png" : [225, 225],
    "/Icons/{pascalcase}_square-medium.scale-200.png" : [300, 300],
    "/Icons/{pascalcase}_square-medium.scale-400.png" : [600, 600],

    // Square (Big)
    "/Icons/{pascalcase}_square-big.scale-100.png" : [310, 310],
    "/Icons/{pascalcase}_square-big.scale-125.png" : [388, 388],
    "/Icons/{pascalcase}_square-big.scale-150.png" : [465, 465],
    "/Icons/{pascalcase}_square-big.scale-200.png" : [620, 620],
    "/Icons/{pascalcase}_square-big.scale-400.png" : [1240, 1240],

    // Wide
    "/Icons/{pascalcase}_wide.scale-100.png" : [310, 150],
    "/Icons/{pascalcase}_wide.scale-125.png" : [388, 188],
    "/Icons/{pascalcase}_wide.scale-150.png" : [465, 225],
    "/Icons/{pascalcase}_wide.scale-200.png" : [620, 300],
    "/Icons/{pascalcase}_wide.scale-400.png" : [1240, 600],

    // Square (Icon)
    "/Icons/{pascalcase}_square-icon.scale-100.png" : [44, 44],
    "/Icons/{pascalcase}_square-icon.scale-125.png" : [55, 55],
    "/Icons/{pascalcase}_square-icon.scale-150.png" : [66, 66],
    "/Icons/{pascalcase}_square-icon.scale-200.png" : [88, 88],
    "/Icons/{pascalcase}_square-icon.scale-400.png" : [176, 176],
    "/Icons/{pascalcase}_square-icon.targetsize-16.png" : [16, 16],
    "/Icons/{pascalcase}_square-icon.targetsize-24.png" : [24, 24],
    "/Icons/{pascalcase}_square-icon.targetsize-48.png" : [48, 48],
    "/Icons/{pascalcase}_square-icon.targetsize-256.png" : [256, 256],

    // Store
    "/Icons/{pascalcase}_store.scale-100.png" : [50, 50],
    "/Icons/{pascalcase}_store.scale-125.png" : [63, 63],
    "/Icons/{pascalcase}_store.scale-150.png" : [75, 75],
    "/Icons/{pascalcase}_store.scale-200.png" : [100, 100],
    "/Icons/{pascalcase}_store.scale-400.png" : [200, 200],

    // Badge
    "/Icons/{pascalcase}_badge.scale-100.png" : [24, 24],
    "/Icons/{pascalcase}_badge.scale-125.png" : [30, 30],
    "/Icons/{pascalcase}_badge.scale-150.png" : [36, 36],
    "/Icons/{pascalcase}_badge.scale-200.png" : [48, 48],
    "/Icons/{pascalcase}_badge.scale-400.png" : [96, 96],

    // Splashscreen
    "/Icons/{pascalcase}_splashscreen.scale-100.png" : [620, 300],
    "/Icons/{pascalcase}_splashscreen.scale-125.png" : [775, 375],
    "/Icons/{pascalcase}_splashscreen.scale-150.png" : [930, 450],
    "/Icons/{pascalcase}_splashscreen.scale-200.png" : [1240, 600]
  },
  assets: {
    "/Assets/{pascalcase}.scale-100.png" : 150,
    "/Assets/{pascalcase}.scale-125.png" : 188,
    "/Assets/{pascalcase}.scale-150.png" : 225,
    "/Assets/{pascalcase}.scale-200.png" : 300,
    "/Assets/{pascalcase}.scale-400.png" : 600
  }
};
