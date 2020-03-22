import { IPC_EVENTS, EventExistResult, EventExistPayload, IAskRequestPayload, IAskResponsePayload, ICmdResponsePayload, IPrintRequestPayload, IExecuteCommandPayload } from "../commons";
import { isCmdExist, CommandRunner } from "./helpers";
const electron = require('electron');
const path = require('path')
const url = require('url');
const { createApp, saveCommandResult } = require("../server/bin/app")

export class ElectronApp {
    private mainWindow_;
    private app_;

    private cmdEventsList_: {
        tabId: string,
        process: CommandRunner
    }[] = [];

    init() {
        this.app_ = electron.app;
        // This method will be called when Electron has finished
        // initialization and is ready to create browser windows.
        // Some APIs can only be used after this event occurs.
        this.app_.on('ready', this.onReady.bind(this))

        // Quit when all windows are closed.
        this.app_.on('window-all-closed', () => {
            // On OS X it is common for applications and their menu bar
            // to stay active until the user quits explicitly with Cmd + Q
            if (process.platform !== 'darwin') {
                this.app_.quit()
            }
        })

        this.app_.on('activate', () => {
            // On OS X it's common to re-create a window in the app when the
            // dock icon is clicked and there are no other windows open.
            if (this.mainWindow_ === null) {
                this.createWindow_()
            }
        })

    }

    async onReady() {
        this.createWindow_();
        const homeDir = require('os').homedir();
        // process.chdir('/tmp');
        process.chdir(homeDir);
        // // console.log("homeDir", homeDir)
        // await CommandRunner(`cd ${homeDir}`, (msg) => {
        //     console.log(msg);
        // }, err => {
        //     console.log(err);
        // })
        // console.log("homeDir", homeDir)
        // console.log('createApp', createApp)
        await createApp({
            ask: (payload: IAskRequestPayload) => {
                this.mainWindow_.send(IPC_EVENTS.Ask, payload)
            },
            print: (payload: IPrintRequestPayload) => {
                this.mainWindow_.send(IPC_EVENTS.Print, payload)
            }
        });
    }

    createWindow_() {
        this.mainWindow_ = new electron.BrowserWindow({
            webPreferences: {
                nodeIntegration: true
            }
        });
        this.mainWindow_.loadURL(url.format({
            pathname: path.join(__dirname, '../index.html'),
            protocol: 'file:'

        }))

        // Open the DevTools.
        this.mainWindow_.webContents.openDevTools()

        // Emitted when the window is closed.
        this.mainWindow_.on('closed', () => {
            // Dereference the window object, usually you would store windows
            // in an array if your app supports multi windows, this is the time
            // when you should delete the corresponding element.
            this.mainWindow_ = null
        })

        this.listenEvents();
    }

    getCommandIndex(tabId: string) {
        return this.cmdEventsList_.findIndex(q => q.tabId === tabId);
    }

    listenEvents() {
        electron.ipcMain.on(IPC_EVENTS.IsEventExist, async (event, args: EventExistPayload) => {
            // console.log("event", event, "args", args, "window", this.mainWindow_)
            this.mainWindow_.send(IPC_EVENTS.IsEventExist, {
                commandText: args.commandText,
                commandName: args.commandName,
                tabId: args.tabId,
                result: await isCmdExist(args.commandName),
                isSystemCmd: true
            } as EventExistResult)
        })

        electron.ipcMain.on(IPC_EVENTS.ExecuteCommand, async (event, args: IExecuteCommandPayload) => {
            const cmd = new CommandRunner(args.commandText);
            const tabId = args.tabId
            this.cmdEventsList_.push({
                tabId: tabId,
                process: cmd
            })

            cmd.event.on("data", msg => {
                this.mainWindow_.send(IPC_EVENTS.ExecuteCommand, {
                    tabId: tabId,
                    data: msg
                })
            });
            cmd.event.on("error", msg => {
                this.mainWindow_.send(IPC_EVENTS.ExecuteCommand, {
                    tabId: tabId,
                    error: msg
                })
            });

            if (args.isSystemCmd) {
                await cmd.run();
            }
            else {
                await cmd.runManual({
                    command: "",
                    location: args.cmdAppLocation,
                    run: args.cliAppRunValue,
                    name: ""
                }, tabId);
            }

            this.mainWindow_.send(IPC_EVENTS.ExecuteCommandFinished, {
                tabId: args.tabId
            })
            this.cmdEventsList_.splice(this.getCommandIndex(tabId), 1);
            console.log("cmd finished", this.cmdEventsList_.length)
            // this.cmdEventsList_.pop();
            // console.log("event", event, "args", args, "window", this.mainWindow_)

        })

        electron.ipcMain.on(IPC_EVENTS.KillCommand, async (event, args) => {
            console.log("recieved kill", args);
            await this.cmdEventsList_.find(q => q.tabId === args.tabId).process.quit();
        })

        electron.ipcMain.on(IPC_EVENTS.CmdRequestFinished, async (event, args: ICmdResponsePayload) => {
            console.log("args", args);
            saveCommandResult(args)
        })
    }
}