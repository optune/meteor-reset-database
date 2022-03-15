Package.describe({
  name: "optune:reset-database",
  summary:
    "Gives you methods to clear your Mongo database and collections for testing purposes",
  version: "1.0.0",
  git: "https://github.com/xolvio/cleaner.git",
  documentation: "README.md",
  debugOnly: true,
});

Package.onUse(function (api) {
  api.versionsFrom("2.0");
  
  api.use(["ecmascript", "mongo"]);
  
  api.mainModule("src/resetDatabase.js", ["client", "server"]);
});
