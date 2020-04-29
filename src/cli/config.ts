const path = require("path");
export class Config {
    static get globalPrefix() {
        let globalPrefix = "";
        if (process.env.PREFIX) {
            globalPrefix = process.env.PREFIX
        } else if (process.platform === 'win32') {
            // c:\node\node.exe --> prefix=c:\node\
            globalPrefix = path.dirname(process.execPath)
        } else {
            // /usr/local/bin/node --> prefix=/usr/local
            globalPrefix = path.dirname(path.dirname(process.execPath))

            // destdir only is respected on Unix
            if (process.env.DESTDIR) {
                globalPrefix = path.join(process.env.DESTDIR, globalPrefix)
            }
        }
        return globalPrefix;
    }

    static get installDir() {
        return (process.platform !== 'win32')
            ? path.resolve(Config.globalPrefix, 'lib', 'cruner_apps')
            : path.resolve(Config.globalPrefix, 'cruner_apps')
        // return path.join(Config.globalPrefix, "cruner_apps");
    }

    static get binDir() {
        return (process.platform !== 'win32')
            ? path.resolve(Config.globalPrefix, 'bin')
            : Config.globalPrefix
    }
}