let insert_text = function(){
    console.log(document.activeElement);
    // console.log("uwu");
    // var selection = "<div class='predictor container'><div class='row'><div class='column one'>OPTION 1</div><div class='divider'></div><div class='column two'>OPTION 2</div><div class='divider'></div><div class='column three'>OPTION 3</div></div></div><link rel='stylesheet'  type='text/css' href='../css/interface.css'></style><link href='https://fonts.googleapis.com/css?family=Roboto' rel='stylesheet'>";
    // document.body.prepend(selection);
}

new chrome.declarativeContent.ShowPageAction(),
insert_text();
