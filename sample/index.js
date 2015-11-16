var assets = require('../');

assets.convertAssets('./in', '@3x', './out/android', assets.systems.android, "#ffffff", "#bfa9d7", function(err){

});

assets.convertAssets('./in', '@3x', './out/ios', assets.systems.ios,"#ffffff",  "#bfa9d7", function(err){

});

assets.convertAssets('./in', '@3x', './out/windows', assets.systems.windows, "#ffffff", "#7ab678", function(err){

});
