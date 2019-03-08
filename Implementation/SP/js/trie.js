class PTNode {
    constructor(value){
        this.value = value;
        this.final = 0;
        this.children = {};
    }

    hasChild(value){
        var keys = Object.keys(this.children);
        for(var key of keys) {
            if(value == key) return true;
        }
        return false;
    }

    hasChildren(){
        return Object.keys(this.children).length;
    }

    getChildren(){
        return Object.keys(this.children);
    }
}

class PrefixTree{
    constructor(){
        this.head = new PTNode(null);
    }

    // insert(word){
    //     var nav = this.head;
    //     var src = word;
    //     var hasProperty = function(object, property){
    //         return Object.prototype.hasOwnProperty.call(object, property);
    //     }
    //     do {
    //         console.log(src);
    //         //check if word head is in children
    //         var check = false;
    //         var keys =
    //         if(check){
    //             nav.children[src[0]] = new PTNode(src[0]);
    //             if(src.length == 0) nav.children[src[0]].final = 1;
    //         }
    //         nav = nav.children[src[0]];
    //         src = src.slice(1);
    //     }while(nav.final != 1);
    // }

    insert(word){
        var insert_helper = function(nav, word){
            var keys = Object.keys(nav.children);
            var check = true;
            for(var key of keys){
                if(key == word[0]){
                    check = false;
                    break;
                }
            }
            if(check){
                //insert node
                nav.children[word[0]] = new PTNode(word[0]);
            }
            if(word.slice(1).length == 0) nav.children[word[0]].final = 1;
            if(word.slice(1).length != 0) insert_helper(nav.children[word[0]], word.slice(1));
        }
        insert_helper(this.head, word);
    }

    print_all(){
        var print_helper = function(nav, word){
            if(nav.final){
                console.log(word+nav.value);
            }
            var keys = Object.keys(nav.children);
            for(var key of keys){
                print_helper(nav.children[key], (nav.value != null?word+nav.value:word));
            }
        }
        print_helper(this.head, "");
    }

    word_search(term){
        var print_helper = function(nav, word){
            if(nav.final){
                // console.log(word+nav.value);
                results = results.concat(word+nav.value);
            }
            if(!nav.hasChildren()) return;
            for(var key of nav.getChildren()){
                print_helper(nav.children[key], (nav.value != null?word+nav.value:word));
            }
        }
        var nav = this.head;
        var src = term;
        var results = [];

        if(term == "") {
            print_helper(nav, "", results);
        }

        else{
            while(src.length > 1){
                if(nav.hasChild(src[0])){
                    nav = nav.children[src[0]];
                    src = src.slice(1);
                }
                else break;
            }
            if(!nav.hasChild(src[0])) return "empty";
            print_helper(nav.children[src[0]], term.slice(0,term.length-1), results);
        }
        
        return results;
    }

}

const main = function(){
    var pt = new PrefixTree();
    var words = ["harry", "potter", "pooper", "hairy", "harriet"];
    for(var word of words){
        pt.insert(word);
    }
    console.log(pt.word_search(""));
}

main();
/*
REFERENCES:
    - general prefix tree reference:
    https://medium.com/@dookpham/predictive-text-autocomplete-using-a-trie-prefix-tree-data-structure-in-javascript-part-1-6ff7fa83c74b
    - prefix tree visualization
    https://www.cs.usfca.edu/~galles/visualization/Trie.html
*/
