
import { Controller, DefaultWorker, Worker, textResult, HTTP_METHOD, jsonResult, Route } from "fortjs";
import { getUniqId } from "../helpers";
import { IResult, ICmdResult } from "../interfaces";
import { App } from "../app";

export class CmdController extends Controller {

    @DefaultWorker()
    async index() {
        return jsonResult(App.cmdResult);
    }

    @Worker([HTTP_METHOD.Post])
    @Route("/ask")
    async ask() {
        const question = this.body.question;
        const tabId = this.body.tabId;
        // const id = getUniqId();
        App.eventCallBack.ask({
            question: question,
            tabId
        });
        return jsonResult({
            success: true,
            data: {
                tabId
            }
        } as IResult);
    }


    @Worker([HTTP_METHOD.Post])
    @Route("/print")
    async print() {
        const message = this.body.message;
        const tabId = this.body.tabId;
        // const id = getUniqId();
        App.eventCallBack.print({
            message: message,
            tabId
        });
        return jsonResult({
            success: true
        } as IResult);
    }

    // @Worker([HTTP_METHOD.Post])
    // @Route("/cmd_finished")
    // async cmdFinished() {
    //     // App.sendAskResponse(this.body.tabId, this.body.answer);
    //     return textResult("ok");
    // }

    @Worker()
    @Route("/result")
    async cmdResult() {
        const tabId = this.query.tabId || this.body.tabId;
        const result = App.cmdResult[tabId];
        if (result != null) {
            setTimeout(() => {
                App.eventCallBack.closeProcess(tabId);
            }, 100);
            delete App.cmdResult[tabId];
            return jsonResult(result);
        }
        return jsonResult({

        })
    }
}