const ora = require('ora');

let oraInstance;
export class Spinner {
    static start(message: string) {
        oraInstance = ora(message);
        oraInstance.start();
    }

    static stop() {
        oraInstance.succeed();
    }

    static succeed(message?: string) {
        oraInstance.succeed(message);
    }

    static fail(message?: string) {
        if (oraInstance) {
            oraInstance.fail(message);
        }

    }
}