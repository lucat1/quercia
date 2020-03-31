"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const fs_1 = require("fs");
// mkdir creates a folder at the given path if ti does
// not exist. Erorrs if the path is a file
async function mkdir(path) {
    try {
        const stat = await fs_1.promises.stat(path);
        if (stat.isFile()) {
            console.error('File at `' + path + '` should be a folder!');
            process.exit(1);
        }
    }
    catch (_) {
        await fs_1.promises.mkdir(path);
    }
}
exports.mkdir = mkdir;
// readdir reads a directory recursively
async function readdir(folder) {
    const files = await fs_1.promises.readdir(folder);
    const result = await Promise.all(files.map(async (file) => {
        const path = path_1.join(folder, file);
        if (!(await fs_1.promises.stat(path)).isFile()) {
            return await readdir(path);
        }
        return path;
    }));
    return result.flat();
}
exports.readdir = readdir;
//# sourceMappingURL=fs.js.map