/*
 * Dependencies
 */

var jimp = require("jimp");
var path = require('path');
var mkdirp = require('mkdirp');
var changeCase = require('change-case');
var tinycolor = require('tinycolor2');

function initDensityFolders(outputFolder) {
  var folders = {
    xxxhdpi: path.join(outputFolder,"drawable-xxxhdpi"),
    xxhdpi: path.join(outputFolder,"drawable-xxhdpi"),
    xhdpi: path.join(outputFolder,"drawable-xhdpi"),
    hdpi: path.join(outputFolder,"drawable-hdpi"),
    mdpi: path.join(outputFolder,"drawable-mdpi"),
    ldpi: path.join(outputFolder,"drawable-ldpi")
  }

  for (var k in folders) {
    mkdirp.sync(folders[k]);
  }

  return folders;
}

function createIcon(originalPath, outputFolder, foregroundColor, backgroundColor, callback) {


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

              var folders = initDensityFolders(outputFolder);

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

              icon.clone().write(path.join(outputFolder,"/appicon_hd.png"));
              icon.clone().resize(512,512).write(path.join(outputFolder,"/appicon_market.png"));
              icon.clone().resize(192,192).write(path.join(folders.xxxhdpi,"appicon.png"));
              icon.clone().resize(144,144).write(path.join(folders.xxhdpi,"appicon.png"));
              icon.clone().resize(96,96).write(path.join(folders.xhdpi,"appicon.png"));
              icon.clone().resize(72,72).write(path.join(folders.hdpi,"appicon.png"));
              icon.clone().resize(48,48).write(path.join(folders.mdpi,"appicon.png"));
              icon.clone().resize(36,36).write(path.join(folders.ldpi,"appicon.png"));

              callback()
          } catch (e) {
            callback(e)
          }
        });
  });
}

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

module.exports = {
  createIcon: createIcon,
  createResourceName: createResourceName,
  densities: {
    "/drawable-ldpi/{lowercase}.png" : 120,
    "/drawable-mdpi/{lowercase}.png" : 160,
    "/drawable-hdpi/{lowercase}.png" : 240,
    "/drawable-xhdpi/{lowercase}.png" : 320,
    "/drawable-xxhdpi/{lowercase}.png" : 480,
    "/drawable-xxxhdpi/{lowercase}.png" : 640
  }
};
