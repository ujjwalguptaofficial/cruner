import { exec, ChildProcessWithoutNullStreams, spawn } from "child_process";
import { EventEmitter } from "events";
import { IAppInfo } from "../../commons";
// const fkill = require('fkill');
import { spawn as ptySpawn, IPty } from "node-pty";
// var pty = require('node-pty');

var shell = require('os').platform() === 'win32' ? 'powershell.exe' : 'bash';
export class CommandRunner {
    cmdString: string
    // private childProcess_: ChildProcessWithoutNullStreams
    private childProcess_: IPty
    private onResolve_;
    private onReject_;

    event = new EventEmitter();
    constructor(cmd: string) {
        this.cmdString = cmd;
    }



    run() {
        console.log('cmd', this.cmdString)
        return new Promise((res, rej) => {
            this.onResolve_ = res;
            this.onReject_ = rej;
            this.childProcess_ = ptySpawn(shell, [], {
                name: 'xterm-color',
                // cols: 0,
                // rows: 0,
                // cwd: process.env.HOME,
                env: process.env,
                handleFlowControl: true
            });
            this.childProcess_.onData(data => {
                console.log("data", data, "len", data.length);
                this.event.emit("data", data)
            })
            this.childProcess_.onExit(e => {
                res(e.exitCode);
            })
            this.childProcess_.write(this.cmdString + "\r")
        })
    }



    async quit() {
        this.childProcess_.kill();
    }

}

