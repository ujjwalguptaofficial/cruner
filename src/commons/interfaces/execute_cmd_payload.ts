export interface IExecuteCommandPayload {
    tabId: string;
    commandText: string;
    isSystemCmd: boolean;
    cmdAppLocation?: string;
    cliAppRunValue: string;
}