import { App } from "./app";
import * as path from "path";
import { IEventCallBack, ICmdResult } from "./interfaces";

export const createApp = async (eventCallBack?: IEventCallBack) => {
    App.eventCallBack = eventCallBack;
    const app = new App();
    await app.create({
        folders: [{
            alias: "/",
            path: path.join(__dirname, "../static")
        }],
        viewPath: path.join(__dirname, "../../src/server/views")
    });
    // app.initSocketIo();
    // app.logger.debug("socket server started")
    process.env.APP_URL = "http://localhost:4000";
    return app;
};

export function saveCommandResult(cmdResult: ICmdResult) {
    console.log("result", cmdResult);
    App.cmdResult[cmdResult.tabId] = cmdResult;
}
// if (process.env.NODE_ENV !== "test") {
//     createApp().then((app) => {
//         app.logger.debug(`Your fort is located at address - ${process.env.APP_URL}`);
//     }).catch(err => {
//         console.error(err);
//     });
// }

export let externalCommandCallBack: (payload) => void;

