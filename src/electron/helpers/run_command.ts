// import { exec, ChildProcessWithoutNullStreams, spawn } from "child_process";
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
                cwd: process.env.HOME,
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

            // this.childProcess_ =   spawn(this.cmdString, {
            //     detached: true,
            //     stdio: 'pipe',
            //     shell: true,

            // });
            //exec(this.cmdString);
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
        // console.log("killing child process", this.childProcess_.pid)
        // // await fkill(this.childProcess_.pid);
        // // this.childProcess_.kill();
        // process.kill(-this.childProcess_.pid);
        this.childProcess_.kill();
    }

}

