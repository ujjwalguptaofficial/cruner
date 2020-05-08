import { exec, ChildProcessWithoutNullStreams, spawn } from "child_process";
import { EventEmitter } from "events";
import { IAppInfo } from "../../commons";
const fkill = require('fkill');
export class CommandRunner {
    cmdString: string
    private childProcess_: ChildProcessWithoutNullStreams
    private onResolve_;
    private onReject_;

    event = new EventEmitter();
    constructor(cmd: string) {
        this.cmdString = cmd;
    }

    run() {
        return new Promise((res, rej) => {
            this.onResolve_ = res;
            this.onReject_ = rej;
            this.childProcess_ = spawn(this.cmdString, {
                detached: true,
                stdio: 'pipe',
                shell: true
            });
            //exec(this.cmdString);
            this.childProcess_.stdout.on('data', (data) => {
                this.event.emit("data", data.toString())
            });
            this.childProcess_.stderr.on('data', (data) => {
                this.event.emit("error", data.toString())
            });
            this.childProcess_.on("error", (err) => {
                rej(err);
            })
            this.childProcess_.on('exit', (code) => {
                res(code);
                this.quit();
            });
        })
    }

    runInSameShell() {
        return new Promise((res, rej) => {
            var command = exec(this.cmdString);
            command.on("error", function (err) {
                console.error(err);
            })
            command.stdout.on('data', function (data) {
                console.log(data.toString());
            });
            command.stderr.on('data', function (data) {
                console.log(data.toString());
            });
            command.on('exit', function (code) {
                res(code);
            });
        });
    }

    async quit() {
        // console.log("killing child process", this.childProcess_.pid)
        // // await fkill(this.childProcess_.pid);
        // // this.childProcess_.kill();
        process.kill(-this.childProcess_.pid);
    }

}
