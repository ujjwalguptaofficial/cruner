const loggerType = process.env.logger;

export class Logger {
    static log(...messages) {
        console.log(...messages);
    }

    static error(...messages) {
        console.log('\x1b[33m%s\x1b[0m',...messages);
    }

    static debug(...messages) {

        if (loggerType === "verbose" || loggerType === "debug") {
            console.log(...messages);
        }
    }
}