"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("@oclif/command");
const path_1 = require("path");
const fs_1 = require("./fs");
const pages_1 = require("./pages");
const config_1 = require("./config");
const build_1 = require("./build");
class Quercia extends command_1.Command {
    async run() {
        const { flags } = this.parse(Quercia);
        await fs_1.mkdir(Quercia.quercia);
        await pages_1.loadPages(Quercia.pages);
        this.log(`running in ${flags.watch ? 'watch' : 'build'}/${flags.mode}`);
        const cfg = config_1.config(flags.mode);
        if (flags.watch) {
            await build_1.watch(cfg);
        }
        else {
            await build_1.build(cfg);
        }
    }
    async catch(err) {
        this.log('Fatal error during the building process');
        this.error(err, { exit: 1 });
    }
}
exports.default = Quercia;
Quercia.description = 'bundle your application';
Quercia.args = [];
Quercia.flags = {
    version: command_1.flags.version({ char: 'v' }),
    help: command_1.flags.help({ char: 'h' }),
    watch: command_1.flags.boolean({
        char: 'w',
        default: false
    }),
    mode: command_1.flags.enum({
        char: 'm',
        options: ['production', 'development'],
        default: 'development',
        description: 'the webpack compilation mode'
    })
};
Quercia.root = process.cwd();
Quercia.pages = path_1.join(Quercia.root, 'pages');
Quercia.quercia = path_1.join(Quercia.root, '__quercia');
// the runtime entrypoint for webpack
Quercia.runtime = require.resolve('@quercia/runtime');
// list of pages files to be used as webpack inputs
Quercia.entries = {};
//# sourceMappingURL=index.js.map