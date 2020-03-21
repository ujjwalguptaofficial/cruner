export interface IEventCallBack {
    ask: (payload: { tabId: string; question: string; }) => void;
}