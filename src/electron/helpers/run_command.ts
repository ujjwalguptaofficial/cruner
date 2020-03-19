import { exec, ChildProcess } from "child_process";
import { EventEmitter } from "events";
const fkill = require('fkill');
export class CommandRunner {
    cmdString: string
    private childProcess_: ChildProcess
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
            this.childProcess_ = exec(this.cmdString);
            this.childProcess_.stdout.on('data', (data) => {
                this.event.emit("data", data.toString())
            });
            this.childProcess_.stderr.on('data', (data) => {
                this.event.emit("error", data.toString())
            });
            this.childProcess_.on("error", function (err) {
                rej(err);
            })
            this.childProcess_.on('exit', (code) => {
                res(code);
            });
        })

    }

    // onStdData(callBack: (msg: string) => void) {
    //     // this.childProcess_.stdout.on('data', function (data) {
    //     //     console.log('data', data);
    //     //     callBack(data.toString());
    //     // });
    // }

    // onStdError(callBack: (msg: string) => void) {
    //     // this.childProcess_.stderr.on('data', function (data) {
    //     //     callBack(data.toString());
    //     // });
    // }

    async quit() {
        console.log("killing child process", this.childProcess_.pid)
        await fkill(this.childProcess_.pid);
        // this.childProcess_.kill();
    }

}

// = function (cmd: string, stdDataCallBack: (msg: string) => void, stdErrCallBack: (msg: string) => void) {
//     return new Promise(function (res, rej) {
//         var command = exec(cmd);
//         command.on("error", function (err) {
//             rej(err);
//         })
//         command.stdout.on('data', function (data) {
//             stdDataCallBack(data.toString());
//         });
//         command.stderr.on('data', function (data) {
//             stdErrCallBack(data.toString());
//         });
//         command.on('exit', function (code) {
//             res(code);
//         });
//         command.
//     });
// }