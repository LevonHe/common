var babel = require('rollup-plugin-babel')
var pkg = require('../package.json')

var version = pkg.version

var banner = `/*!
  * ${pkg.name} v${version}
  * (c) ${new Date().getFullYear()} ${pkg.author}
  * @license MIT
  */`

function getCompiler() {
  return babel({
    babelrc: false,
    // presets: [
    //   [
    //     '@babel/preset-env',
    //     {
    //       targets: "> 0.25%, not dead",
    //       modules: false,
    //       loose: true
    //     }
    //   ]
    // ],
    exclude: 'node_modules/**',
    runtimeHelpers: true,
    plugins: [
      [
        "@babel/plugin-transform-runtime",
        {
          corejs: 2
        }
      ]
    ]
  })
}

exports.banner = banner
exports.getCompiler = getCompiler