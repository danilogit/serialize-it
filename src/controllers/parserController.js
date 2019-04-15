const { ParserService } = require('../services/parser');
const { SnapshotModel } = require('../orm/models/snapshotsModel');
const { ObjectId } = require('mongoose').Types;
const fs = require('fs');
const _ = require('lodash');

const createsSatistics = (data) => {

    let stats = {
        countFiles: 0,
        countClasses: 0,
        countClassesSerialized: 0,
        countClassesNotSerialized: 0,
        countReplacements: 0
    }

    stats.countFiles = data.length;
    data.forEach(file => {
        stats.countClasses += file.countClasses;
        file.classes.forEach(cls => {
            stats.countClassesSerialized += (cls.serialized) ? 1 : 0;
        });
        stats.countClassesNotSerialized = (stats.countClasses - stats.countClassesSerialized);
    })


    return stats;
}

const takeSnapshot = async (path) => {

    const optionsDefaults = {
        filter: '.java$',
        excludes: []
    }

    const options = {
        excludes: []
    }

    const p = new ParserService(path, _.defaults(options, optionsDefaults));
    const data = await p.parse();

    const snapshot = new SnapshotModel({
        files: data,
        rootDir: path,
        options,
        statistics: createsSatistics(data)
    })

    return await snapshot.save();
}


exports.welcome = async (req, res) => {
    res.send({ message: "Welcome" });
}

exports.viewFile = async (req, res) => {
    const path = decodeURIComponent(req.params.path);
    const fileContent = fs.readFileSync(path, 'utf-8');
    res.type('text/plain').send(fileContent);
}

exports.viewSnapshot = async (req, res) => {
    const id = req.params.id;

    const snapshot = await SnapshotModel.aggregate([
        {
            $match: {
                _id: ObjectId(id)
            }
        },
        {
            $project: {
                statistics: 1,
                date: { $dateToString: { date: "$_id" } },
                files: 1,
                options: 1
            }
        }
    ]);

    res.send(snapshot[0]);

}

exports.getSnapshots = async (req, res) => {

    const snapshots = await SnapshotModel.aggregate([
        { $match: {} },
        {
            $project: {
                statistics: 1,
                date: { $dateToString: { date: "$_id" } }
            }
        }
    ]);
    res.send(snapshots);
}


exports.parse = async (req, res) => {


    await takeSnapshot(req.query.path)


    await SnapshotModel.findOne();

    return res.send({});

}