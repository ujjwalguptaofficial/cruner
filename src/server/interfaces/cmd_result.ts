import { COMMAND_TYPE } from "../enums";

export interface ICmdResult {
    tabId: string;
    type: COMMAND_TYPE;
    result: any;
}
