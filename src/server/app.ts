import { Fort, MustacheViewEngine } from 'fortjs';
import { routes } from './routes';
import { IEventCallBack, ICmdResult } from './interfaces';
// import * as socketIo from "socket.io";



export class App extends Fort {

    constructor() {
        super();
        this.routes = routes;
        this.viewEngine = MustacheViewEngine;
    }

    static eventCallBack: IEventCallBack;

    static cmdResult: { [tabId: string]: ICmdResult } = {};

    // static socketClients = {};

    // static sendAskResponse(tabId: string, answer: string) {
    //     const savedSocket = this.socketClients[tabId];
    //     if (savedSocket != null) {
    //         savedSocket.emit("ask_finished", answer);
    //     }
    // }

    // initSocketIo() {
    //     const io = (socketIo as any)(this.httpServer);
    //     io.on("connection", (socket) => {
    //         this.logger.debug("tabId", socket.handshake.query['tab_id'])
    //         // App.socketClients[socket.handshake.query['tab_id']] = socket;

    //         console.log("user connected");
    //         socket.on('disconnect', () => {
    //             console.log('user disconnected');
    //         });

    //         // socket.on('ask', (question) => {
    //         //     console.log(`message is ${question}`);
    //         // });
    //     });
    // }
}


