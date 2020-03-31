"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const webpack_sources_1 = require("webpack-sources");
function getHash(chunk) {
    return chunk.contentHash['javascript'];
}
class ManifestPlugin {
    apply(compiler) {
        compiler.hooks.emit.tap('QuerciaManifest', compilation => {
            const chunks = compilation.chunks;
            const assets = { pages: {} };
            const pages = assets.pages;
            for (const chunk of chunks) {
                // handle pages chunks
                if (chunk.name.startsWith('pages/')) {
                    const key = chunk.name.replace('pages/', '');
                    pages[key] =
                        chunk.name + '-' + getHash(chunk) + '.js';
                    continue;
                }
                // handle normal chunks
                if (['webpack-runtime', 'vendor', 'runtime'].includes(chunk.name)) {
                    assets[chunk.name] =
                        chunk.name + '-' + getHash(chunk) + '.js';
                }
            }
            assets.pages = pages;
            compilation.assets['manifest.json'] = new webpack_sources_1.RawSource(JSON.stringify(assets, null, 2));
        });
    }
}
exports.default = ManifestPlugin;
//# sourceMappingURL=manifest-plugin.js.map