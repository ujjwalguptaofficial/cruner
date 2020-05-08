const ora = require('ora');

let oraInstance;
export class Spinner {
    static start(message: string) {
        oraInstance = ora(message);
        oraInstance.start();
    }

    // stop() {
    //     oraInstance.succeed();
    // }

    static succeed() {
        oraInstance.succeed();
    }

    static fail(message?: string) {
        oraInstance.fail(message);
    }
}