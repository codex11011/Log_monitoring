const Observer = require("./services/observer.js");
// let filePath = "Performance/logs/info.log";
const EventEmitter = require("events").EventEmitter;

class WatchLog extends EventEmitter {
  constructor(filePath) {
    super();
    this.filePath = filePath;
    this.observer = new Observer();
  }
  veryCarefully() {
    this.observer.on("file-updated", log => {
      this.emit("get_updatedContent", { content: log.message });
    });

    this.observer.watchFile(this.filePath);
  }
}

module.exports = WatchLog;
