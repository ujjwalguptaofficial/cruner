import { ElectronApp } from "./electron_app";
import { addArg, Logger } from "../commons";

const app = new ElectronApp();
app.init();

process.on("uncaughtException", ex => {
    Logger.log(ex.name, ex.message);
    process.exit();
});