
import { Controller, DefaultWorker, Worker, textResult, HTTP_METHOD, jsonResult, Route } from "fortjs";
import { getUniqId } from "../helpers";
import { IResult } from "../interfaces";
import { App } from "../app";

export class CmdController extends Controller {

    @DefaultWorker()
    async index() {
        return jsonResult(App.cmdResult);
    }

    @Worker([HTTP_METHOD.Post])
    async ask() {
        const question = this.body.question;
        const tabId = this.body.tabId;
        const id = getUniqId();
        App.eventCallBack.ask({
            question: question,
            tabId
        });
        return jsonResult({
            success: true,
            data: {
                id
            }
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
        const id = this.query.id || this.body.id;
        const result = App.cmdResult[id];
        if (result != null) {
            delete App.cmdResult[id];
            return jsonResult(result);
        }
    }
}