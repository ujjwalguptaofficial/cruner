import { ElectronApp } from "./electron_app";
import { addArg } from "../commons";

console.log("index.ts", process.argv)
// Electron 6 introduces a chrome-sandbox that requires root to run. This can fail. Disable sandbox via --no-sandbox
// addArg(process.argv, '--no-sandbox');
// console.log("index.ts", process.argv)
const app = new ElectronApp();
// setTimeout(() => {
app.init();
// }, 100);


process.on("uncaughtException", ex => {
    console.log(ex.name, ex.message);
    process.exit();
});