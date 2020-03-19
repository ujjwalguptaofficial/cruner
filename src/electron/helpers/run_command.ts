import { exec } from "child_process";

export const runCommand = function (cmd: string, stdDataCallBack: (msg: string) => void, stdErrCallBack: (msg: string) => void) {
    return new Promise(function (res, rej) {
        var command = exec(cmd);
        command.on("error", function (err) {
            rej(err);
        })
        command.stdout.on('data', function (data) {
            stdDataCallBack(data.toString());
        });
        command.stderr.on('data', function (data) {
            stdErrCallBack(data.toString());
        });
        command.on('exit', function (code) {
            res(code);
        });
    });
}