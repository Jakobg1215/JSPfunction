const Plugin = require("../base/BasePlugin");
const fs = require("fs");
module.exports = class sendPacket extends Plugin {
    constructor(pluginData) {
        super(pluginData);
        this.getApi().getServer().getCommandManager().registerClassCommand(
            {
                id: "functions:listfunction",
                description: "Lists all functions in the function folder!",
                execute: (sender, args) => {
                    const functionFiles = fs.readdirSync("./functions").filter(file => file.endsWith(".mcfunction"));
                    return sender.sendMessage(`${functionFiles}`);
                },
            },
            this.getApi().getServer(),
        );
    };
};