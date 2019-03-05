var form_container = function(){
    var predictor = document.createElement("div");
    predictor.id = "chrome-predictor";
    predictor.className = "container";
    predictor.style.position = "fixed";
    predictor.style.backgroundColor = "black";
    predictor.style.width = "inherit"; //25.9rem
    predictor.style.fontSize = "0.75rem";
    return predictor;
}

var form_row = function(){
    var row = document.createElement("div");
    row.className = "predictor-row";
    row.style.width = "inherit";
    row.style.position = "inherit";
    row.style.fontFamily = "Roboto";
    row.style.fontWeight = "lighter";
    row.style.backgroundColor = "#eeeeee";
    row.style.border = "1px #bbbbbb";
    row.style.borderRadius = "10px";
    row.style.border = "thin solid #aaaaaa";
    return row;
}

var form_column = function(text){
    var column = document.createElement("div");
    column.className = "predictor-column";
    column.innerHTML = text;
    column.style.width = "29.325%";
    column.style.position = "relative";
    column.style.color = "black";
    column.style.textAlign = "center";
    column.style.float = "left";
    column.style.padding = "2%";
    column.style.borderRadius = "inherit";

    column.addEventListener("mouseover", function(){
        column.style.backgroundColor = "#bbbbbb";
        column.style.color = "white";
    });

    column.addEventListener("mouseout", function(){
        column.style.backgroundColor = "inherit";
        column.style.color = "black";
    });

    return column;
}

var form_divider = function(){
    var divider = document.createElement("div");
    divider.className = "predictor-divider";
    width = "1px";
    height = "1rem";
    backgroundColor = "#eeeeee";
    float = "left";
    position = "relative";
    top = "50%";
    transform = "translateY(50%)";

    return divider;
}

var form_css_src = function(src, css_flag){
    var link_tag = document.createElement("link");
    link_tag.rel = "stylesheet";
    link_tag.href = src;
    if(css_flag == 1) {
        link_tag.type = "text/css";
        // link_tag.src = src;
        // link_tag.removeAttribute("href");
    }
    return link_tag;
}

var form_interface = function(){
    if(document.getElementById("predictor_wrapper") != null) return;

    var predictor = form_container();
    var row = form_row();
    for(var i = 1; i <= 3; i++) {
        row.append(form_column("OPTION " + i));
        // if(i != 3) row.append(form_divider());
    }
    predictor.append(row);
    // var css_src = form_css_src("../css/interface.css", 1);
    var font_src = form_css_src("https://fonts.googleapis.com/css?family=Roboto", 0);
    // document.body.append(css_src);

    var predictor_wrapper = document.createElement("div");
    predictor_wrapper.id = "predictor_wrapper";
    predictor_wrapper.style.position = "fixed";
    predictor_wrapper.style.bottom = "100px";
    predictor_wrapper.style.marginLeft = "35%";
    predictor_wrapper.style.marginRight = "35%";
    predictor_wrapper.style.width = "30%";
    predictor_wrapper.style.zIndex = "9999 !important";
    // predictor_wrapper.style.display = "none";

    predictor_wrapper.prepend(predictor);

    var page_wrapper = document.createElement("div");
    page_wrapper.id = "page_wrapper";
    while (document.body.childNodes.length) {
        page_wrapper.appendChild(document.body.firstChild);
    }
    predictor_wrapper.style.position = "absolute";
    page_wrapper.style.zIndex = "-9999 !important";
    document.body.prepend(predictor_wrapper);
    document.body.prepend(page_wrapper);
    document.body.append(font_src);
}

var relocate_script = function(down, left){
    var predictor = document.getElementById("predictor_wrapper");
    predictor.style.display = "inherit";
    // predictor.style.top = down+"px";
    // predictor.style.left = left+"px";
}

var hide_predictor = function(){
    var predictor = document.getElementById("predictor_wrapper");
    predictor.style.display = "none";
}

var bind_locator = function(element){
    var rect = element.getBoundingClientRect();
    console.log(rect.top + " : " + rect.left);
    element.addEventListener("focusin", show_predictor());
    element.addEventListener("focusout", hide_predictor());
}

var find_inputs = function(){
    // form_interface();

    var elems = document.getElementsByTagName('input');
    var count = 0;
    // var pins = [];
    if(elems.length != 0){
        console.log('detected an input dom element.');
        for(tag of elems){
            if(tag.getAttribute("type") == "text" || tag.getAttribute("type") == "search"){
                count++;
                // bind_locator(tag);
            }
        }
    }
    else {
        return;
    }
    console.log("found " + count + " input=text/search elements!");
}

find_inputs();
