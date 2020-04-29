import { exists, mkdir } from "fs-extra";

export function ensureDir(path: string) {
    return new Promise((res, rej) => {
        exists(path, (isExist) => {
            if (!isExist) {
                mkdir(path).then(res).catch(rej);
            }
            else {
                res();
            }
        });

    })
}