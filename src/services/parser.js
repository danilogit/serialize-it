const fs = require('fs');
const path = require('path');
const find = require('find');
const util = require('util');
const filePromise = util.promisify(find.file);
const _ = require('lodash');

class ParserService {

    constructor(filePath, options) {
        this.options = options;
        this.filePath = filePath;
    }


    readLines(filePath) {
        const content = fs.readFileSync(filePath, 'utf-8');
        const lines = content.split('\n');
        return lines;
    }

    parseLines(lines) {
        return lines.map((item, i) => {
            if (this.getClassname(item) !== null) {

                const implementations = this.getImplementations(item);
                const className = this.getClassname(item);
                const parents = this.getParents(item);
                const replacement = this.getReplacement(item, implementations);
                return {
                    // FIXME: Line numbers does not match.
                    lineNumber: i - 1,
                    original: item,
                    className,
                    serialized: (implementations !== null) ? implementations.includes('Serializable') : false,
                    parents,
                    implementations,
                    replacement
                }
            }
        })
            .filter((item) => {
                return item !== undefined;
            })
    }

    getReplacement(original, implementations) {
        if (implementations === null) {
            return `${original.replace(/(\s+[\{\n])/, ' implements Serializable$1')} /* Auto Serialized: ${new Date().toISOString()}, ${Buffer.from(original).toString('base64')} */ `;
        } else {
            if (!implementations.includes('Serializable')) {
                return `${original.replace(/(\s+[\{\n])/, ', Serializable$1')} /* Auto Serialized: ${new Date().toISOString()}, ${Buffer.from(original).toString('base64')} */ `;
            } else {
                return null;
            }
        }
    }

    // TODO: Do not consider comments. Eg. //public class LocalDataSourceConfiguration {
    getClassname(line) {
        const match = line.match(/(public|static|final|abstratic|private) +class (\w+(<.*?>)?)/);
        if (match != null) {
            return match[2];
        } else {
            return null;
        }
    }

    getParents(line) {
        console.log("Extracting extends:", line);
        const match = line.match(/extends (\w+(<.*?>)?,?\s+\w+(<.*?>)?|\w+)/i);
        if (match != null) {
            return match[1].match(/[\w\.]+(<.*?>)?/gi);
        } else {
            return null;
        }
    }

    // TODO: Class multiline statements aren't working.
    getImplementations(line) {
        console.log("Extracting implements:", line);
        const match = line.match(/implements (\w+(<.*?>)?(,?\s+\w+(<.*?>)?)+|\w+)/i);
        if (match != null) {
            return match[1].match(/[\w\.]+(<.*?>)?/gi);
        } else {
            return null;
        }
    }

    parseFile(file) {
        const lines = this.readLines(file);
        const classes = this.parseLines(lines);

        return {
            file,
            countClasses: classes.length,
            classes
        };
    }


    parse() {
        return new Promise((resolve, reject) => {
            find.file(new RegExp(this.options.filter), this.filePath, function (files) {
                return (files.length) ? resolve(files) : [];
            })
        })
            .then(files => {
                let parsedFiles = []
                files.forEach(file => {
                    if (this.options.excludes.length === 0) {
                        parsedFiles.push(this.parseFile(file));
                    } else {
                        const regex = "^(" + this.options.excludes.map(item => item.replace(/\//g, '\\/')).join('|') + ").*";
                        if (!file.match(new RegExp(regex))) {
                            parsedFiles.push(this.parseFile(file));
                        };
                    }
                })
                return parsedFiles;
            })
    }
}


module.exports = { ParserService }