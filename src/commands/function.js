const Plugin = require("../base/BasePlugin");
const fs = require("fs");
module.exports = class sendPacket extends Plugin {
    constructor(pluginData) {
        super(pluginData);
        this.getApi().getServer().getCommandManager().registerClassCommand(
            {
                id: "functions:function",
                description: "Runs commands in a function file",
                execute: (sender, args) => {
                    if (fs.existsSync(`./plugins/mcfunctions/functions/${args[0]}.mcfunction`)) {
                        const lineReader = require('readline').createInterface({
                            input: fs.createReadStream(`./plugins/mcfunctions/functions/${args[0]}.mcfunction`)
                        });
                        lineReader.on('line', function (line) {
                            const commandManager = sender.getServer().getCommandManager();
                            const Arguments = line.slice(0).split(/ +/);
                            const Command = Arguments.shift().toLocaleLowerCase();
                            // Thank you John
                            for (const command of commandManager.getCommands()) {
                                const cmdname = command.id.split(":").pop();
                                if (cmdname === Command) {
                                    command.execute(sender, Arguments);
                                };
                            };
                        });
                    } else return sender.sendMessage(`§c'${args[0]}' function doesn't exist!`)
                },
            },
            this.getApi().getServer(),
        );
    };
};