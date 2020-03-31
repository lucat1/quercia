import { Command, flags } from '@oclif/command';
export default class Quercia extends Command {
    static description: string;
    static args: never[];
    static flags: {
        version: import("@oclif/parser/lib/flags").IBooleanFlag<void>;
        help: import("@oclif/parser/lib/flags").IBooleanFlag<void>;
        watch: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        mode: flags.IOptionFlag<"development" | "production">;
    };
    static root: string;
    static pages: string;
    static quercia: string;
    static runtime: string;
    static entries: {
        [key: string]: string;
    };
    run(): Promise<void>;
    catch(err: Error): Promise<void>;
}
//# sourceMappingURL=index.d.ts.map