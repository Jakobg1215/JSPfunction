//Thank you Filiph Sandström for the idea!
const Plugin = require("../base/BasePlugin");
const fs = require("fs");
const { literal, } = require("@jsprismarine/brigadier");
module.exports = class sendPacket extends Plugin {
    constructor(pluginData) {
        super(pluginData);
        this.getApi().getServer().getCommandManager().registerClassCommand(
            {
                id: "functions:listfunction",
                description: "Lists all functions in the function folder!",
                permission: "functions.command.listfunction",
                register: Dispatcher => {
                    Dispatcher.register(
                        literal("listfunction").executes(
                            context => {
                                const functionFiles = fs.readdirSync("./functions").filter(file => file.endsWith(".mcfunction"));
                                return context.getSource().sendMessage(`${functionFiles}`);
                            },
                        ),
                    );
                },
            },
            this.getApi().getServer(),
        );
    };
};
