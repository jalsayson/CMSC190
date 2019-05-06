const wordbag = require('./wordBag');
const sequence = require('./sequence');
const predictionmatrix = require('./predictionMatrix');

var x1 = sequence.createSequence('i am what i want to be');
var x = new wordbag.WordBag(x1);
var xx = new predictionmatrix.PredictionMatrix(x, x1);

var y1 = sequence.createSequence('i am inevitable but i am iron man');
var y = new wordbag.WordBag(y1);
var yy = new predictionmatrix.PredictionMatrix(y, y1);

xx.merge(yy);

xx.reference['bag'].printBag();
console.log(xx.reference['sequence']);
