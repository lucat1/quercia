"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const enhanced_resolve_1 = require("enhanced-resolve");
const manifest_plugin_1 = require("./webpack/manifest-plugin");
const _1 = require(".");
// config configures the webpack bundler
function config(mode) {
    return {
        mode,
        devtool: mode == 'development' ? 'source-map' : false,
        output: {
            path: _1.default.quercia,
            filename: '[name]-[contenthash].js',
            publicPath: '/__quercia/'
        },
        entry: Object.assign({ runtime: _1.default.runtime }, _1.default.entries),
        resolve: {
            alias: {
                // prevent duplicate react versions
                react: enhanced_resolve_1.sync(process.cwd(), 'react'),
                'react-dom': enhanced_resolve_1.sync(process.cwd(), 'react-dom')
            }
        },
        plugins: [new manifest_plugin_1.default()],
        optimization: {
            runtimeChunk: {
                name: _ => `webpack-runtime`
            },
            splitChunks: {
                chunks: 'all',
                cacheGroups: {
                    runtime: {
                        test: /(node_modules|@quercia\/quercia)/,
                        name: 'vendor',
                        priority: -10
                    },
                    default: {
                        minChunks: 2,
                        priority: -20,
                        reuseExistingChunk: true
                    }
                }
            }
        }
    };
}
exports.config = config;
//# sourceMappingURL=config.js.map