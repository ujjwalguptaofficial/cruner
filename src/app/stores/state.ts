import { IAppInfo } from "../../commons/index";
import { join } from "path";
export default {
    apps: [{
        name: "Demo",
        command: "demo",
        location: join(process.cwd(), "../commander-client-javascript"),
        run: "node test/src/index.js"
    } as IAppInfo]
}