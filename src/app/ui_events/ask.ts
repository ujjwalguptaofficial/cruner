import { vueApp } from "../app_bus";
import { UiEventList } from "./ui_event_list";
import { getUniqId } from "../helpers";
import { AskResult } from "./interfaces";


export const eventCollection: {
    onResolve: (result) => void,
    // onReject,
    id: string
}[] = [];

vueApp.$on(UiEventList.AskFinished, (result: AskResult) => {
    const index = eventCollection.findIndex(q => q.id === result.id);
    eventCollection[index].onResolve(result.answer);
});

export function ask(message: string, id) {
    return new Promise((res, rej) => {
        vueApp.$emit(UiEventList.Ask, {
            payload: {
                message
            },
            id
        })
    })

}