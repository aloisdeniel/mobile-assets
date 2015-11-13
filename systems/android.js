/*
 * Dependencies
 */

var jimp = require("jimp");
var path = require('path');
var mkdirp = require('mkdirp');
var changeCase = require('change-case');
var tinycolor = require('tinycolor2');

/*
 * Creates an icon from a mask logo.
 */
function createIcon(originalPath, foregroundColor, backgroundColor, callback) {

      jimp.read(path.join(__dirname,"./assets/android_icon_background.png"), function (err, background) {

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
                var foregroundRgb = tinycolor(foregroundColor).toRgb();

                // 0. Generate icon with background

                var backgroundHsv = tinycolor(backgroundColor).toHsv();
                var defaultBackgroundHsv = tinycolor("#2196f3").toHsv();
                var hsv = {
                  h: backgroundHsv.h - defaultBackgroundHsv.h,
                  s: backgroundHsv.s - defaultBackgroundHsv.s,
                  v: backgroundHsv.v - defaultBackgroundHsv.v
                }

                foreground.resize(1024,1024).color([
                    { apply: 'lighten', params: [ 100 ] },
                    { apply: 'red', params: [ foregroundRgb.r ] },
                    { apply: 'green', params: [ foregroundRgb.g ] },
                    { apply: 'blue', params: [ foregroundRgb.b ] }
                ]);

                var icon = background.color([
                    { apply: 'hue', params: [ hsv.h ] },
                    { apply: (hsv.s < 0) ? 'desaturate' : 'saturate', params: [ Math.abs(hsv.s) ] },
                    { apply: (hsv.v < 0) ? 'darken' : 'lighten', params: [ Math.abs(hsv.v) ] }
                ]).composite(foreground, 512, 512);

                callback(null,icon)
            } catch (e) {
              callback(e)
            }
          });
    });
}

/*
 * Creates a compatible resource name from original image path.
 */
function createResourceName(originalPath) {

  var result = '';
  var parsed = path.parse(originalPath);
  var splits = parsed.dir.split(path.sep).filter(n => n.length > 0);

  for(var i = 0; i < splits.length; i++) {
    if(i != 0) { result += "_"; }
    result += changeCase.camelCase(splits[i]).toLowerCase();
  }

  if(result.length > 0) { result += "__"; }

  return result + changeCase.camelCase(parsed.name).toLowerCase();
}

/*
 * Exposing module.
 */

module.exports = {
  createIcon: createIcon,
  createResourceName: createResourceName,
  icons: {
    "/drawable-ldpi/{lowercase}.png" : [36, 36],
    "/drawable-mdpi/{lowercase}.png" : [48, 48],
    "/drawable-hdpi/{lowercase}.png" : [72, 72],
    "/drawable-xhdpi/{lowercase}.png" : [96, 96],
    "/drawable-xxhdpi/{lowercase}.png" : [144, 144],
    "/drawable-xxxhdpi/{lowercase}.png" : [192, 192],
    "/{lowercase}_market.png" : [512, 512]
  },
  assets: {
    "/drawable-ldpi/{lowercase}.png" : 120,
    "/drawable-mdpi/{lowercase}.png" : 160,
    "/drawable-hdpi/{lowercase}.png" : 240,
    "/drawable-xhdpi/{lowercase}.png" : 320,
    "/drawable-xxhdpi/{lowercase}.png" : 480,
    "/drawable-xxxhdpi/{lowercase}.png" : 640
  }
};
