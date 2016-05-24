/**
 * Created by Zell on 5/04/2016.
 */
var crypto = require('crypto');
var fs = require('fs');
var path = require('path');

var password = 'testTest12345';
var extFileName = '.encrypted';
var algo = 'aes-128-cbc';

function encrypt(file) {
    var cipher = crypto.createCipher(algo, password);
    var read = fs.createReadStream(file);
    var write = fs.createWriteStream(file + extFileName);
    read.pipe(cipher).pipe(write);
    read.on('close', function () {
        fs.unlink(file);
    });
}

function decrypt(file) {
    var decipher = crypto.createDecipher(algo, password);
    var read = fs.createReadStream(file);
    var write = fs.createWriteStream(path.resolve(path.dirname(file), path.basename(file, extFileName)));
    read.pipe(decipher).pipe(write);
    read.on('close', function () {
        fs.unlink(file);
    });
}

function test(dir, mode){
    var files = fs.readdir(dir, function (err, files) {
        if (err) {
            console.log('error while parsing files list');
        }
        files.forEach(function (element) {
            element = path.resolve(dir, element);
            fs.stat(element, function (err, file) {
                if (file.isDirectory()) {
                    test2(element,mode);
                } if (file.isFile()) {
                    if (mode == 'encrypt' && path.extname(element) != extFileName) {
                        encrypt(element);
                    }
                    if (mode == 'decrypt' && path.extname(element) == extFileName) {
                        decrypt(element);
                    }
                }
            });
        })
    });
}

test('./node_modules', 'decrypt');