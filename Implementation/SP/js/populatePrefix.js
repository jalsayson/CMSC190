/*
This file is generated by the Java program in the word-processing folder located outside the Chrome
extension directory (AutoPrefixTree.java). Said program dynamically makes insertion code for the
prefix tree stored in the local storage based on the words stored from words_alpha.txt, located in
the same directory as AutoPrefixTree.java.
*/

const populateTrie = function(){
    var tree = new PrefixTree();

    tree.insert("the");
    tree.insert("be");
    tree.insert("to");
    tree.insert("of");
    tree.insert("and");
    tree.insert("a");
    tree.insert("in");
    tree.insert("that");
    tree.insert("have");
    tree.insert("i");
    tree.insert("it");
    tree.insert("for");
    tree.insert("not");
    tree.insert("on");
    tree.insert("with");
    tree.insert("he");
    tree.insert("as");
    tree.insert("you");
    tree.insert("do");
    tree.insert("at");
    tree.insert("this");
    tree.insert("but");
    tree.insert("his");
    tree.insert("by");
    tree.insert("from");
    tree.insert("they");
    tree.insert("we");
    tree.insert("say");
    tree.insert("her");
    tree.insert("she");
    tree.insert("or");
    tree.insert("an");
    tree.insert("will");
    tree.insert("my");
    tree.insert("one");
    tree.insert("all");
    tree.insert("would");
    tree.insert("there");
    tree.insert("their");
    tree.insert("what");
    tree.insert("so");
    tree.insert("up");
    tree.insert("out");
    tree.insert("if");
    tree.insert("about");
    tree.insert("who");
    tree.insert("get");
    tree.insert("which");
    tree.insert("go");
    tree.insert("me");
    tree.insert("when");
    tree.insert("make");
    tree.insert("can");
    tree.insert("like");
    tree.insert("time");
    tree.insert("no");
    tree.insert("just");
    tree.insert("him");
    tree.insert("know");
    tree.insert("take");
    tree.insert("people");
    tree.insert("into");
    tree.insert("year");
    tree.insert("your");
    tree.insert("good");
    tree.insert("some");
    tree.insert("could");
    tree.insert("them");
    tree.insert("see");
    tree.insert("other");
    tree.insert("than");
    tree.insert("then");
    tree.insert("now");
    tree.insert("look");
    tree.insert("only");
    tree.insert("come");
    tree.insert("its");
    tree.insert("over");
    tree.insert("think");
    tree.insert("also");
    tree.insert("back");
    tree.insert("after");
    tree.insert("use");
    tree.insert("two");
    tree.insert("how");
    tree.insert("our");
    tree.insert("work");
    tree.insert("first");
    tree.insert("well");
    tree.insert("way");
    tree.insert("even");
    tree.insert("new");
    tree.insert("want");
    tree.insert("because");
    tree.insert("any");
    tree.insert("these");
    tree.insert("give");
    tree.insert("day");
    tree.insert("most");
    tree.insert("us");

    console.log("insert")

    chrome.storage.local.set({ "prefixTree" : tree });
}

populateTrie();
