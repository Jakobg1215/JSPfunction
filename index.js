const { readdirSync, statSync } = require('fs');
const fs = require('fs');
const Path = require('path');

class JoinMessage {
    constructor(api) {
        this.api = api;
        this.events = {};
        this.commands = {};
        this.loadCommands(__dirname + '/src/commands/');
    };
    loadCommands(filePath) {
        let commandFiles = this.getFiles(filePath);
        commandFiles.forEach((fileName) => {
            const CommandClass = require(fileName);
            const command = new CommandClass(this);
            this.commands[command.emitter] = this.events[command.emitter] ? [...this.events[command.emitter], command] : [command];
        });
        return;
    };
    onEnable() {
        if (!fs.existsSync("./functions")) fs.mkdirSync("./functions");
        this.api.getLogger().info('Functions are ready to go!');
    };
    onDisable() {
        this.api.getLogger().info('Functions are now disabled!');
    };
    getFiles(folderPath) {
        const entries = readdirSync(folderPath).map((entries) => Path.join(folderPath, entries));
        const dirPath = entries.filter((entry) => statSync(entry).isFile());
        const dirFiles = entries.filter((entry) => !dirPath.includes(entry)).reduce((entry, entries) => entry.concat(this.getFiles(entries)), []);
        return [...dirPath, ...dirFiles];
    };
};
module.exports.default = JoinMessage;
