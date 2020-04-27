import { IPC_EVENTS, EventExistResult, EventExistPayload, IAskRequestPayload, IAskResponsePayload, ICmdResponsePayload, IPrintRequestPayload, IExecuteCommandPayload } from "../commons";
import { isCmdExist, CommandRunner, Terminal } from "./helpers";
const electron = require('electron');
const path = require('path')
const url = require('url');
import { initCli } from "../cli/index";
import { isArgsSupplied } from "../cli/helpers";
// const { createApp, saveCommandResult } = require("../server/bin/app")

export class ElectronApp {
    private mainWindow_;
    private app_;

    private tabs: {
        tabId: string,
        process: Terminal
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
        process.chdir(homeDir);
        initCli();
    }

    createWindow_() {
        const shouldShowWindow = !isArgsSupplied();
        console.log("shouldShowWindow", shouldShowWindow);
        this.mainWindow_ = new electron.BrowserWindow({
            show: shouldShowWindow,
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
        return this.tabs.findIndex(q => q.tabId === tabId);
    }

    removeTab(tabId) {
        const index = this.getCommandIndex(tabId);
        if (index >= 0) {
            this.tabs[index].process.quit();
            this.tabs.splice(index, 1);
        }
    }

    // sendCommandFinished(tabId: string) {
    //     this.mainWindow_.send(IPC_EVENTS.ExecuteCommandFinished, {
    //         tabId: tabId
    //     })
    // }

    listenEvents() {
        // console.log("dirname", npm.globalDir)
        console.log("current dir", process.cwd())
        electron.ipcMain.on(IPC_EVENTS.NewTab, async (event, tabId) => {
            console.log("tabid", tabId);
            const cmd = new Terminal();
            this.tabs.push({
                tabId: tabId,
                process: cmd
            })

            cmd.event.on("data", msg => {
                this.mainWindow_.send(IPC_EVENTS.Data, {
                    tabId: tabId,
                    data: msg
                })
            });

            cmd.event.on("exit", msg => {
                this.removeTab(tabId)
            });
        });

        electron.ipcMain.on(IPC_EVENTS.Data, (event, args) => {
            this.tabs[this.getCommandIndex(args.tabId)].process.pty.write(args.data);
        });

        electron.ipcMain.on(IPC_EVENTS.CloseTab, async (event, args) => {
            this.removeTab(args.tabId);
        })

    }
}