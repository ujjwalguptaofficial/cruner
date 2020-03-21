
import { Controller, DefaultWorker, Worker, textResult, HTTP_METHOD, jsonResult } from "fortjs";
import { getUniqId } from "../helpers";
import { IResult } from "../interfaces";
import { App } from "../app";

export class CmdController extends Controller {

    @DefaultWorker()
    async index() {

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
}