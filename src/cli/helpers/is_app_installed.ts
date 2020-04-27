import { pathExists } from "fs-extra";
import { Config } from "../config";
export async function isAppInstalled() {
    return await pathExists(Config.installDir);
}