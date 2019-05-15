class PredictionMatrix {
    constructor(bag, sequence) {
        this.matrix = {};
        this.reference = {
            'bag' : bag,
            'sequence' : sequence,
            'keys' : bag.keys()
        };

        var keys = this.reference['keys'];
        for(var key of keys) {
            this.matrix[key] = {};
            for(var key2 of keys) {
                this.matrix[key][key2] = 0;
            }
        }

        for(var i = 1; i < sequence.length; i++) {
            this.matrix[sequence[i]][sequence[i-1]]++;
        }

        for(var key of keys) {
            for(var key2 of keys) {
                this.matrix[key][key2] = this.matrix[key][key2]/this.reference['bag'].getBag()[key];
            }
        }
    }

    printMatrix() {
        for(var key of this.reference['keys']) {
            for(var key2 of this.reference['keys']) {
                console.log(this.matrix[key][key2]);
            }
        }
    }


    getTopRanks(word, ranks = 3) {
        var ranking = [];

        var nppCompare = function(a, b) {
            if(a.value > b.value) return -1;
            if(a.value < b.value) return 1;
            return 0;
        }

        var keys = this.reference['keys'];
        for(var key of keys) {
            var convertedPair = this.bayesComputation(word, key);
            ranking = ranking.concat(new npp.NameProbabilityPair(key, convertedPair));
            ranking.sort(nppCompare);
            if(ranking.length > ranks) {
                ranking = ranking.slice(0, ranks);
            }
        }
        return ranking;
    }

    bayesComputation(word, key) {
        var aGivenB = function(pmat, a, b) {
            return pmat.matrix[a][b];
        }

        var probOf = function(pmat, word) {
            return pmat.reference['bag'].getBag()[word]/pmat.reference['sequence'].length;
        }

        if(probOf(this, key) == 0 || aGivenB(this, key, word) == 0) {
            return 0;
        }
        else {
            return (aGivenB(this, key, word)*probOf(this, key))/probOf(this, word);
        }
    }

    merge(pm2) {
        this.reference['bag'].merge(pm2.reference['bag']);
        this.reference['sequence'] = sequence.mergeSequences(this.reference['sequence'], pm2.reference['sequence']);
    }
}
