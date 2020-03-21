import { App } from "./app";
import * as path from "path";
import { IEventCallBack } from "./interfaces";

export const createApp = async (eventCallBack?: IEventCallBack) => {
    App.eventCallBack = eventCallBack;
    const app = new App();
    await app.create({
        folders: [{
            alias: "/",
            path: path.join(__dirname, "../static")
        }]
    });
    app.initSocketIo();
    process.env.APP_URL = "http://localhost:4000";
    return app;
};
// if (process.env.NODE_ENV !== "test") {
//     createApp().then((app) => {
//         app.logger.debug(`Your fort is located at address - ${process.env.APP_URL}`);
//     }).catch(err => {
//         console.error(err);
//     });
// }

export let externalCommandCallBack: (payload) => void;

