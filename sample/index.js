var assets = require('../');

assets.convertAssets('./in', '@3x', './out/android', assets.systems.android, "#7ab678", "#ffffff", function(err){

});

assets.convertAssets('./in', '@3x', './out/ios', assets.systems.ios,  "#7ab678", "#ffffff", function(err){

});
