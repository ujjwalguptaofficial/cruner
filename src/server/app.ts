import { Fort, MustacheViewEngine } from 'fortjs';
import { routes } from './routes';
import { IEventCallBack } from './interfaces';
import * as socketIo from "socket.io";

export class App extends Fort {

    constructor() {
        super();
        this.routes = routes;
        this.viewEngine = MustacheViewEngine;
    }

    static eventCallBack: IEventCallBack;

    initSocketIo() {
        const io = (socketIo as any)(this.httpServer);
        io.on("connection", (socket) => {
            console.log("user connected");
            socket.on('disconnect', () => {
                console.log('user disconnected');
            });

            // socket.on('ask', (question) => {
            //     console.log(`message is ${question}`);
            // });
        });
    }
}


