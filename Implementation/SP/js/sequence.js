'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var createSequence = function(source) {
    var sequence = ['\n'];
    var lines = source.split("\n");
    for(var i = 0; i < lines.length; i++) {
        var text = lines[i].split(" ");
        for (var j = 0; j < text.length; j++){
            sequence = sequence.concat([text[j]]);
        }
    }
    return sequence;
}

var mergeSequences = function(destination, source) {
    var result = [].concat(destination).concat(source);
    return result;
}

exports.default = {
    createSequence : createSequence,
    mergeSequences : mergeSequences
};

module.exports = exports['default'];
