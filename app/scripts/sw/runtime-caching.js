(function(global) {
  'use strict';

  global.toolbox.router.get('/(.*)', global.toolbox.fastest, {
    origin: /\.(?:googleapis|gstatic)\.com$/
  });
})(self);
