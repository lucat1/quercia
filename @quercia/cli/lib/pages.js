"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const _1 = require(".");
const fs_1 = require("./fs");
exports.loader = require.resolve('./webpack/page-loader.js');
// loadPages fetches the pages to be compiled with webpack
async function loadPages(root) {
    const paths = await fs_1.readdir(root);
    paths.forEach(path => {
        const key = 'pages/' + path.replace(root + '/', '').replace(path_1.extname(path), '');
        _1.default.entries[key] = exports.loader + '!' + path;
    });
}
exports.loadPages = loadPages;
//# sourceMappingURL=pages.js.map