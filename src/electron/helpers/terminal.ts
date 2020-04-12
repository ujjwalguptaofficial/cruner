import { exec, ChildProcessWithoutNullStreams, spawn } from "child_process";
import { EventEmitter } from "events";
import { IAppInfo } from "../../commons";
import { spawn as ptySpawn, IPty } from "node-pty";

const shell = require('os').platform() === 'win32' ? 'powershell.exe' : 'bash';
export class Terminal {

    // private childProcess_: ChildProcessWithoutNullStreams
    pty: IPty
    private onResolve_;
    private onReject_;

    event = new EventEmitter();
    constructor() {
        this.pty = ptySpawn(shell, [], {
            name: 'xterm-color',
            // cols: 0,
            // rows: 0,
            cwd: process.env.HOME,
            env: process.env,
            handleFlowControl: true
        });
        this.pty.onData(data => {
            console.log("data", data.split(""), "len", data.length);
            this.event.emit("data", data)
        })
        this.pty.onExit(e => {
            this.event.emit("exit", e.exitCode);
        })
    }

    // write(cmd: string) {
    // this.childProcess_.write(cmd)
    // }

    runManual(info: IAppInfo, tabId: string) {
        return new Promise((res, rej) => {
            this.onResolve_ = res;
            this.onReject_ = rej;
            console.log("cmd is ", info);
            // this.childProcess_ = spawn(`${info.run}`, [`tab_id=${tabId}`, `port=4000`], {
            //     detached: true,
            //     stdio: 'pipe',
            //     shell: true,
            //     cwd: info.location,

            // });

            // this.childProcess_.stdout.on('data', (data) => {
            //     this.event.emit("data", data.toString())
            // });
            // this.childProcess_.stderr.on('data', (data) => {
            //     this.event.emit("error", data.toString())
            // });
            // this.childProcess_.on("error", (err) => {
            //     rej(err);
            // })
            // this.childProcess_.on('exit', (code) => {
            //     res(code);
            // });
        })
    }

    async quit() {
        this.pty.kill();
    }

}

