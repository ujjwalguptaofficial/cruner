const loggerType = process.env.logger;

export class Logger {
    static log(...messages) {
        console.log(messages);
    }

    static debug(...messages) {

        if (loggerType === "verbose" || loggerType === "debug") {
            console.log(messages);
        }
    }
}