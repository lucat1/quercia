"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const __1 = require("..");
class ProgressPlugin {
    apply(compiler) {
        compiler.hooks.normalModuleFactory.tap('QuerciaProgress', factory => {
            factory.hooks.module.tap('QuerciaProgressFactory', module => {
                const path = module.resource;
                let file;
                if (/node_modules/.test(path)) {
                    let final; // the processed path
                    // node_modules module
                    const module = path.replace(/^(.*?)\/node_modules\//, '');
                    if (module.startsWith('@')) {
                        // scoped module
                        const parts = module.split(path_1.sep);
                        final = parts[0] + '/' + parts[1];
                    }
                    else {
                        final = module.split(path_1.sep)[0];
                    }
                    file = { type: 'module', path: final };
                }
                else {
                    // module outside of the node_modules folder
                    file = {
                        type: 'src',
                        path: path.replace(__1.default.root + '/', '')
                    };
                }
                console.log(file);
            });
        });
    }
}
exports.default = ProgressPlugin;
//# sourceMappingURL=progress-plugin.js.map