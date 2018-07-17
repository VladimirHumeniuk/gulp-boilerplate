import autoprefixer    from 'autoprefixer';
import cssnano         from 'cssnano';
import reporter        from 'postcss-reporter';
import assets          from 'postcss-assets';
import immutableCss    from 'immutable-css';
import messages        from 'postcss-browser-reporter';
import pxtorem         from 'postcss-pxtorem';

const PLUGINS = [
  assets({
    basePath: 'src/',
    loadPaths: ['images/', 'fonts/**/'],
    relative: true
  }),
  cssnano({
    autoprefixer: false,
    zindex: false
  }),
  immutableCss,
  pxtorem({
    rootValue: 16,
    unitPrecision: 5,
    propList: ['font', 'font-size', 'line-height', 'letter-spacing'],
    selectorBlackList: ['html', 'body'],
    replace: true,
    mediaQuery: false,
    minPixelValue: 0
  }),
  autoprefixer(),
  reporter({
    clearMessages: true,
    throwError: false
  }),
  messages({
    selector: 'body::before'
  })
]

export default PLUGINS;
