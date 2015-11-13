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
  jimp.read(path.join(__dirname,"./assets/ios_icon_background.png"), function (err, background) {
    if (err) {
      callback(err);
      return;
    }

    jimp.read(originalPath, function (err, foreground) {
      if (err) {
        callback(err);
        return;
      }
      try {
        var iconSize = 840;
        var originalIconSize = background.bitmap.width;

        colorUtils.shiftColor(background, "#54c5ef",backgroundColor);
        colorUtils.colorize(foreground.resize(iconSize,iconSize),foregroundColor);
        var offset = (originalIconSize - iconSize) / 2;
        var icon = background.composite(foreground, offset, offset);

        callback(null,icon)
      } catch (e) {
        callback(e)
      }
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
    if(i != 0) { result += "_"; }
    result += changeCase.camelCase(splits[i]);
  }

  if(result.length > 0) { result += "__"; }

  return result + changeCase.camelCase(parsed.name);
}

/*
* Exposing module.
*/

module.exports = {
  createIcon: createIcon,
  createResourceName: createResourceName,
  icons: {
    // Store icon
    "/icons/store_{camelcase}.png" : [1024, 1024],

    // App icons
    "/icons/iphone_{camelcase}@3x.png" : [180, 180],
    "/icons/iphone_{camelcase}@2x.png" : [120, 120],
    "/icons/ipad-pro_{camelcase}@2x.png" : [167, 167],
    "/icons/ipad_{camelcase}@2x.png" : [152, 152],
    "/icons/ipad_{camelcase}.png" : [76, 76],

    //Spotlight icons
    "/icons/spotlight_iphone6-plus_{camelcase}@3x.png" : [180, 180],
    "/icons/spotlight_iphone6_{camelcase}@2x.png" : [120, 120],
    "/icons/spotlight_iphone5_{camelcase}@2x.png" : [80, 80],
    "/icons/spotlight_ipad-pro_{camelcase}@2x.png" : [120, 120],
    "/icons/spotlight_ipad_{camelcase}@2x.png" : [120, 120],
    "/icons/spotlight_ipad_{camelcase}.png" : [60, 60],

    //Settings icons
    "/icons/settings_{camelcase}@3x.png" : [87, 87],
    "/icons/settings_{camelcase}@2x.png" : [58, 58],
    "/icons/settings_{camelcase}.png" : [29, 29]
  },
  assets: {
    "/assets/{camelcase}@2x.png" : 264,
    "/assets/{camelcase}@3x.png" : 401
  }
};
