"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const __1 = require("..");
const pageLoader = function () {
    const ext = path_1.extname(this.resourcePath);
    const pagePath = JSON.stringify(this.resourcePath);
    const pageName = pagePath.replace(__1.default.pages + '/', '').replace(ext, '');
    return `
    (window.__P = window.__P || {})[${pageName}] = function() {
      return require(${pagePath});
    }
  `;
};
exports.default = pageLoader;
//# sourceMappingURL=page-loader.js.map