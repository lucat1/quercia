"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const webpack = require("webpack");
// webpack compiler related variables
exports.entry = require.resolve('@quercia/runtime');
// build builds the webpack bundle
function build(config) {
    return new Promise((res, rej) => {
        const compiler = webpack(config);
        compiler.run((err, stats) => {
            if (err || stats.hasErrors()) {
                return rej(err || stats.compilation.errors);
            }
            res(stats);
        });
    });
}
exports.build = build;
async function watch(config) {
    const compiler = webpack(config);
    compiler.watch({}, (err, stats) => {
        if (err || stats.hasErrors()) {
            console.log(err ? [err] : stats.compilation.errors);
        }
    });
}
exports.watch = watch;
//# sourceMappingURL=build.js.map