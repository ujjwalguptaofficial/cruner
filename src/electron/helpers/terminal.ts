import { EventEmitter } from "events";
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
            // cwd: process.env.HOME,
            env: process.env,
            handleFlowControl: true
        });
        this.pty.onData(data => {
            // console.log("data", data.split(""), "len", data.length);
            this.event.emit("data", data)
        })
        this.pty.onExit(e => {
            this.event.emit("exit", e.exitCode);
        })
    }

    async quit() {
        this.pty.kill();
    }

}

