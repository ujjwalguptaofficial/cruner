import { DefaultController } from "./controllers/default_controller";
import { ParentRoute } from "fortjs";
import { CmdController } from "./controllers/cmd_controller";

export const routes: ParentRoute[] = [{
    path: "/*",
    controller: DefaultController
}, {
    path: "/cmd",
    controller: CmdController
}];