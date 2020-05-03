import { readFile } from "fs-extra";
import * as Path from "path";
import { IAppInfo } from "../interfaces";

export async function getAppInfo(url: string) {
    const pathOfPackage = Path.join(url, "cruner.json");
    const contents = await readFile(pathOfPackage, {
        encoding: "utf8"
    });
    return JSON.parse(contents) as IAppInfo;
}