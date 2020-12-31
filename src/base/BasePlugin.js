module.exports = class BasePlugin {
    constructor(plugin, emitter) {
        this.plugin = plugin;
        this.api = plugin.api;
        this.emitter = emitter;
    };
    getPlugin() {
        return this.plugin;
    };
    getApi() {
        return this.api;
    };
};