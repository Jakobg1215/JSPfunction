import { argument, CommandContext, CommandDispatcher, literal, string } from "@jsprismarine/brigadier";
import Command from "@jsprismarine/prismarine/dist/src/command/Command";
import Player from "@jsprismarine/prismarine/dist/src/player/Player";
import type PluginApi from "@jsprismarine/prismarine/dist/src/plugin/api/versions/1.0/PluginApi";
import fs from 'fs';
import readline from 'readline';

export default class PluginBase {
    api: PluginApi;
    constructor(api: PluginApi) {
        this.api = api;
    }

    public async onEnable() {
        if (!fs.existsSync("./functions")) fs.mkdirSync("./functions");
        this.api.getServer().getCommandManager().registerClassCommand(new class FunctionCommmand extends Command {
            constructor() {
                super({
                    id: "functions:function",
                    description: "Runs commands in a function file",
                    permission: "functions.command.function"
                })
            }
            public async register(dispatcher: CommandDispatcher<any>) {
                dispatcher.register(
                    literal("function").then(
                        argument("function", string()).executes(
                            async (context: CommandContext<any>) => {
                                const infunction = context.getArgument("function");
                                const sender = context.getSource() as Player;
                                if (fs.existsSync(`./functions/${infunction}.mcfunction`)) {
                                    const lineReader = readline.createInterface({
                                        input: fs.createReadStream(`./functions/${infunction}.mcfunction`)
                                    });
                                    lineReader.on('line', function (line: any) {
                                        const commandManager = sender.getServer().getCommandManager();
                                        const incommand = line.slice(0).split(/ +/).shift().toLocaleLowerCase();
                                        // Thank you John.
                                        for (const command of commandManager.getCommandsList()) {
                                            if (command[0] === incommand) {
                                                commandManager.dispatchCommand(sender, line);
                                                break;
                                            };
                                        };
                                    });
                                } else return sender.sendMessage(`§c'${infunction}' function doesn't exist!`);
                            }
                        )
                    )
                );
            }
        }, this.api.getServer());
        //Thank you Filiph Sandström for the idea
        this.api.getServer().getCommandManager().registerClassCommand(new class ListFunctionsCommmand extends Command {
            constructor() {
                super({
                    id: "functions:listfunctions",
                    description: "Lists all functions in the function folder!",
                    permission: "functions.command.listfunction"
                })
            }
            public async register(dispatcher: CommandDispatcher<any>) {
                dispatcher.register(
                    literal("listfunctions").executes((context: CommandContext<any>) => {
                        const functionFiles = fs.readdirSync("./functions").filter(file => file.endsWith(".mcfunction"));
                        if (functionFiles.length > 0) return context.getSource().sendMessage(`${functionFiles}`);
                        return context.getSource().sendMessage("§cThere are no function files!")
                    },
                    )
                )
            }
        }, this.api.getServer());
    }

    public async onDisable() { }
}
