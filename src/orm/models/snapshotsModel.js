const mongoose = require('mongoose');

const SnapshotSchema = new mongoose.Schema({
      files: Object,
      rootDir: String,
      statistics: Object,
      options: Object
});

const SnapshotModel = mongoose.model('snapshot', SnapshotSchema);

module.exports = {SnapshotModel};