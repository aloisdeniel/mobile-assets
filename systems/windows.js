/*
* Dependencies
*/

var jimp = require("jimp");
var path = require('path');
var changeCase = require('change-case');
var colorUtils = require('../colors-utils.js');

function createIconWithOffset(offset, originalPath, foregroundColor, backgroundColor, callback) {
  jimp.read(originalPath, function (err, foreground) {
    if (err) {
      callback(err);
      return;
    }
    var iconSize = 512;

    var size = iconSize + 2*offset;

    var foregroundHex = colorUtils.createHex(foregroundColor);

    new jimp(size, size, foregroundHex, function (err, background) {
      if (err) {
        callback(err);
        return;
      }

      try {
        colorUtils.colorize(foreground,foregroundColor);
        foreground.resize(iconSize,iconSize);
        var icon = background.composite(foreground, offset, offset);
        callback(null,icon)
      } catch (e) {
        callback(e);
      }
    });
  });
}

/*
* Creates an icon from a mask logo.
*/
function createIcon(originalPath, foregroundColor, backgroundColor, callback) {

  createIconWithOffset(512,originalPath, foregroundColor, backgroundColor, function(err,bigIcon) {
    if (err) {
      callback(err);
      return;
    }

    createIconWithOffset(128,originalPath, foregroundColor, backgroundColor, function(err,smallIcon) {
      if (err) {
        callback(err);
        return;
      }

      callback(null,{
        big: bigIcon,
        small: smallIcon
      });

    });

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
    "/Icons/{pascalcase}_square-small.scale-100.png" : { small: true, w: 71, h:71 },
    "/Icons/{pascalcase}_square-small.scale-125.png" : { small: true, w:89, h:89},
    "/Icons/{pascalcase}_square-small.scale-150.png" : { small: true, w:107, h:107},
    "/Icons/{pascalcase}_square-small.scale-200.png" : { small: true, w:142, h:142},
    "/Icons/{pascalcase}_square-small.scale-400.png" : { small: true, w:284, h:284},

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
    "/Icons/{pascalcase}_square-icon.scale-100.png" : { small: true, w: 44, h:44},
    "/Icons/{pascalcase}_square-icon.scale-125.png" : { small: true, w: 55, h:55},
    "/Icons/{pascalcase}_square-icon.scale-150.png" : { small: true, w: 66, h:66},
    "/Icons/{pascalcase}_square-icon.scale-200.png" : { small: true, w: 88, h:88},
    "/Icons/{pascalcase}_square-icon.scale-400.png" : { small: true, w: 176, h:176},
    "/Icons/{pascalcase}_square-icon.targetsize-16.png" : { small: true, w: 16, h:16},
    "/Icons/{pascalcase}_square-icon.targetsize-24.png" : { small: true, w: 24, h:24},
    "/Icons/{pascalcase}_square-icon.targetsize-48.png" : { small: true, w: 48, h:48},
    "/Icons/{pascalcase}_square-icon.targetsize-256.png" : { small: true, w: 256, h:256},

    // Store
    "/Icons/{pascalcase}_store.scale-100.png" : [50, 50],
    "/Icons/{pascalcase}_store.scale-125.png" : [63, 63],
    "/Icons/{pascalcase}_store.scale-150.png" : [75, 75],
    "/Icons/{pascalcase}_store.scale-200.png" : [100, 100],
    "/Icons/{pascalcase}_store.scale-400.png" : [200, 200],

    // Badge
    "/Icons/{pascalcase}_badge.scale-100.png" : { small: true, w: 24, h:24},
    "/Icons/{pascalcase}_badge.scale-125.png" : { small: true, w: 30, h:30},
    "/Icons/{pascalcase}_badge.scale-150.png" : { small: true, w: 36, h:36},
    "/Icons/{pascalcase}_badge.scale-200.png" : { small: true, w: 48, h:48},
    "/Icons/{pascalcase}_badge.scale-400.png" : { small: true, w: 96, h:96},

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
