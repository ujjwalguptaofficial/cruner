import * as JsStore from 'jsstore';
import { IDataBase, DATA_TYPE, ITable } from 'jsstore';

const getWorkerPath = () => {
    if (process.env.NODE_ENV === 'development') {
        return require("file-loader?name=scripts/[name].[hash].js!jsstore/dist/jsstore.worker.js");
    }
    else {
        return require("file-loader?name=scripts/[name].[hash].js!jsstore/dist/jsstore.worker.min.js");
    }
};

// This will ensure that we are using only one instance. 
// Otherwise due to multiple instance multiple worker will be created.
const workerPath = getWorkerPath();
console.log("worker path", workerPath.default);
export const idbCon = new JsStore.Connection(new Worker(workerPath.default));
export const dbname = 'CRUNER';

window["idbCon"] = idbCon;

const getDatabase = () => {
    const tblStudent: ITable = {
        name: 'Apps',
        columns: {
            id: {
                primaryKey: true,
                autoIncrement: true
            },
            name: {
                notNull: true,
                dataType: DATA_TYPE.String,
                unique: true
            },
            command: {
                notNull: true,
                dataType: DATA_TYPE.String,
                unique: true
            },
            location: {
                notNull: true,
                dataType: DATA_TYPE.String
            },
            main: {
                notNull: true,
                dataType: DATA_TYPE.String
            },
            target: {
                notNull: true,
                dataType: DATA_TYPE.String
            },
            commandToRun: {
                notNull: true,
                dataType: DATA_TYPE.String
            }

        }
    };
    const dataBase: IDataBase = {
        name: dbname,
        tables: [tblStudent]
    };
    return dataBase;
};

export const initJsStore = () => {

    const dataBase = getDatabase();
    idbCon.initDb(dataBase);

};

export function getAllApps() {
    return idbCon.select({
        from: "Apps"
    })
}