import { MongoInternals } from "meteor/mongo";

let resetDatabase;
if (Meteor.isServer) {
  const _resetDatabase = function (options) {
    if (process.env.NODE_ENV !== "development") {
      throw new Error(
        "resetDatabase is not allowed outside of a development mode. " +
          "Aborting."
      );
    }

    options = options || {};
    let excludedCollections = ["system.indexes"];
    if (options.excludedCollections) {
      excludedCollections = excludedCollections.concat(
        options.excludedCollections
      );
    }

    const db =
      options.db || MongoInternals.defaultRemoteCollectionDriver().mongo.db;
    const getCollections = Meteor.wrapAsync(db.collections, db);
    const collections = getCollections();
    const appCollections = collections.filter(function (col) {
      const isExcluded = (
        col.collectionName.indexOf("velocity") === 0 ||
        excludedCollections.indexOf(col.collectionName) !== -1
      )
      return !isExcluded
    });

    appCollections.forEach(function (appCollection) {
      const remove = Meteor.wrapAsync(appCollection.remove, appCollection);
      remove({}, {});
    });
  };

  Meteor.methods({
    resetDatabase: function (options) {
      _resetDatabase(options);
    },
  });

  resetDatabase = function (options, callback) {
    _resetDatabase(options);
    if (typeof callback === "function") {
      callback();
    }
  };
}

if (Meteor.isClient) {
  resetDatabase = function (options, callback) {
    Meteor.call("resetDatabase", options, callback);
  };
}

export { resetDatabase };
