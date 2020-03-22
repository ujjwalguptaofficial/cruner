export interface IEventCallBack {
    ask: (payload: { tabId: string; question: string; }) => void;
    print: (payload: { tabId: string; message: string; }) => void;
    closeProcess: (tabId: string) => void;
}