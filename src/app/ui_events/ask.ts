import { vueApp } from "../app_bus";
// import { UiEventList } from "./ui_event_list";
// import { getUniqId } from "../helpers";
import { AskResult } from "./interfaces";
import { IPC_EVENTS } from "src/commons";


export const eventCollection: {
    onResolve: (result) => void,
    // onReject,
    id: string
}[] = [];

vueApp.$on(IPC_EVENTS.AskFinished, (result: AskResult) => {
    const index = eventCollection.findIndex(q => q.id === result.id);
    eventCollection[index].onResolve(result.answer);
});

export function ask(message: string, id: string) {
    return new Promise((res, rej) => {
        vueApp.$emit(IPC_EVENTS.Ask, {
            payload: {
                message
            },
            id
        })
    })

}