const Plugin = require("../base/BasePlugin");
const fs = require("fs");
const { literal, argument, string } = require("@jsprismarine/brigadier");
module.exports = class sendPacket extends Plugin {
    constructor(pluginData) {
        super(pluginData);
        this.getApi().getServer().getCommandManager().registerClassCommand(
            {
                id: "functions:function",
                description: "Runs commands in a function file",
                permission: "functions.command.function",
                register: Dispatcher => {
                    Dispatcher.register(
                        literal("function").then(
                            argument("function", string()).executes(
                                async context => {
                                    const infunction = context.getArgument("function");
                                    const sender = context.getSource();
                                    if (fs.existsSync(`./functions/${infunction}.mcfunction`)) {
                                        const lineReader = require('readline').createInterface({
                                            input: fs.createReadStream(`./functions/${infunction}.mcfunction`),
                                        });
                                        lineReader.on('line', function (line) {
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
            },
            this.getApi().getServer()
        );
    };
};
