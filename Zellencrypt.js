/**
 * Created by Zell on 5/04/2016.
 */
var crypto = require('crypto');
var fs = require('fs');
var path = require('path');

var password = 'testTest12345';
var extFileName = '.encrypted';
var algo = 'aes-128-cbc';
var queue = [];

function encrypt(file) {
    var cipher = crypto.createCipher(algo, password);
    var read = fs.createReadStream(file);
    var write = fs.createWriteStream(file + extFileName);
    read.pipe(cipher).pipe(write);
    write.on('close', function () {
        fs.unlink(file);
    }).on('error', function () {
        write.on('unpipe', function () {
            enqueue([encrypt, file]);
        });
    });
    read.on('error', function () {
        enqueue([encrypt, file]);
    }).on('close', function () {
        retry();
    });
}

function decrypt(file) {
    var decipher = crypto.createDecipher(algo, password);
    var read = fs.createReadStream(file);
    var write = fs.createWriteStream(path.resolve(path.dirname(file), path.basename(file, extFileName)));
    read.pipe(decipher).pipe(write);
    write.on('close', function () {
        fs.unlink(file);
    }).on('error', function () {
        write.on('unpipe', function () {
            enqueue([decrypt, file]);
        });
    });
    read.on('error', function () {
        enqueue([decrypt, file]);
    }).on('close', function () {
        retry();
    });
}
//enqueue and retry, fix the EMFILE "too many open files" error
function enqueue(elem) {
    queue.push(elem);
}

function retry() {
    var elem = queue.shift();
    if (elem) {
        elem[0](elem[1]);
    }
}

var listFiles = function (dir, callback) {
    var list = [];
    var files = fs.readdir(dir, function (err, files) {
        if (err) {
            console.log('error while parsing files list');
        }
        var fileCount = files.length;
        //if empty
        if (!fileCount) {
            return callback(list);
        }
        files.forEach(function (element) {
            element = path.resolve(dir, element);
            fs.stat(element, function (err, file) {
                if (file.isDirectory()) {
                    listFiles(element, function (children) {
                        list = list.concat(children);
                        if (!--fileCount) {
                            return callback(list)
                        }
                    });
                } else {
                    list.push(element);
                    if (!--fileCount) {
                        return callback(list)
                    }
                }
            });
        })
    });
};

function testZellCrypt(filePath, mode) {
    listFiles(filePath, function (results) {
        results.forEach(function (element) {
            element = path.resolve(filePath, element);
            fs.stat(element, function () {
                if (mode == 'encrypt' && path.extname(element) != extFileName) {
                    encrypt(element);
                }
                if (mode == 'decrypt' && path.extname(element) == extFileName) {
                    decrypt(element);
                }
            });
        });
    });
}

testZellCrypt('./node_modules', 'decrypt');