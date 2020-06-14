const chokidar = require("chokidar");
const EventEmitter = require("events").EventEmitter;
const readLastLines = require("read-last-lines");

class Observer extends EventEmitter {
  constructor() {
    super();
  }

  watchFile(targetFile) {
    try {
      console.log(
        `[${new Date().toLocaleString()}] Watching for file changes on: ${targetFile}`
      );
      let watcher = chokidar.watch(targetFile, { persistent: true });
      watcher.on("change", async filePath => {
        console.log(
          `[${new Date().toLocaleString()}] ${filePath} has been updated.`
        );
        let updatedContent = await readLastLines.read(filePath, 1);
        this.emit("file-updated", { message: updatedContent });
      });
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = Observer;
