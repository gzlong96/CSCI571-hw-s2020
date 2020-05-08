function load_all(){
    load_headlines();
    load_wordcloud();
    load_cnn_fox();
    // document.getElementById('headline_page').style.display = 'none';
    document.getElementById('search_page').style.display = 'none';
    default_input();
}

function load_headlines(){
    fetch('/headlines')
    .then(response => response.json())
    .then(function(response) {
        // console.log(response)
        // console.log(response.articles[0])
        slider_div = document.getElementById('slider');
        // for (var i=0; i<response.articles.length; ++i){
        //     article = response.articles[i]
        //     var new_img = document.createElement("img");
        //     new_img.setAttribute('class', 'slider_image')
        //     new_img.setAttribute('id', 'slider_image' + i)
        //     new_img.setAttribute('src', article.urlToImage)
        //     slider_div.appendChild(new_img)
        // }

        var length = response.articles.length;
        var pointer = 1;
        document.getElementById('slider_img').src = response.articles[0].urlToImage;
        document.getElementById('slider_text').children[0].innerHTML = response.articles[0].title;
        document.getElementById('slider_text').children[1].innerHTML = response.articles[0].description;
        document.getElementById('slider_a').href = response.articles[0].url;
        setInterval(function(){
                document.getElementById('slider_img').src = response.articles[pointer].urlToImage;
                document.getElementById('slider_text').children[0].innerHTML = response.articles[pointer].title;
                document.getElementById('slider_text').children[1].innerHTML = response.articles[pointer].description;
                document.getElementById('slider_a').href = response.articles[pointer].url;
                pointer = (pointer + 1) % length;
            }, 4000);
        }
    )
}

function load_wordcloud(){
    fetch('/wordcloud')
    .then(response => response.json())
    .then(function(response) {
        wordcloud(response.words)
    })
}


function wordcloud(myWords){
    // set the dimensions and margins of the graph
    // append the svg object to the body of the page

    // Constructs a new cloud layout instance. It run an algorithm to find the position of words that suits your requirements
    // Wordcloud features that are different from one word to the other must be here
    var layout = d3.layout.cloud()
    .size([220, 220])
    // .words(myWords.map(function(d) { return {text: d.word, size:8 + d.size * 0.7 + Math.random() * 10}; }))
    .words(myWords.map(function(d) { return {text: d.word, size:d.size}; }))
    .padding(2)        //space between words
    .rotate(function() { return ~~(Math.random() * 2) * 90; })
    .fontSize(function(d) { return d.size; })      // font size of words
    .on("end", draw);
    layout.start();

    // This function takes the output of 'layout' above and draw the words
    // Wordcloud features that are THE SAME from one word to the other can be here
    function draw(words) {
        var svg = d3.select("#my_dataviz").append("svg")
        .attr("width", layout.size()[0])
        .attr("height", layout.size()[1])
        .append("g")
        .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
        .selectAll("text")
        .data(words)
        .enter().append("text")
        .style("font-size", function(d) { return d.size + "px"; })
        // .style("fill", "#69b3a2")
        .attr("text-anchor", "middle")
        .style("font-family", "Impact")
        .attr("transform", function(d) {
                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            }
        )
        .text(function(d) { return d.text; });
    }
}

function load_cnn_fox(){
    fetch('/cnn')
    .then(response => response.json())
    .then(function(response) {
            // console.log(response)
            // console.log(response.articles[0])
            var news_list = document.getElementById('cnn_container').children;
            for (var i=0; i<response.articles.length; ++i){
                news_list[i].children[0].href = response.articles[i].url;
                news_list[i].children[0].children[0].src = response.articles[i].urlToImage;
                news_list[i].children[0].children[1].innerHTML = response.articles[i].title;
                news_list[i].children[0].children[2].innerHTML = response.articles[i].description;
            }
        })
        fetch('/fox')
        .then(response => response.json())
        .then(function(response) {
            // console.log(response)
            // console.log(response.articles[0])
            var news_list = document.getElementById('fox_container').children;
            for (var i=0; i<response.articles.length; ++i){
                news_list[i].children[0].href = response.articles[i].url;
                news_list[i].children[0].children[0].src = response.articles[i].urlToImage;
                news_list[i].children[0].children[1].innerHTML = response.articles[i].title;
                news_list[i].children[0].children[2].innerHTML = response.articles[i].description;
            }
        }
    )
}

function change_page(mode){
    if (mode==0){
        document.getElementById('headline_page').style.display='block';
        document.getElementById('search_page').style.display='none';
        document.getElementById('google_new').classList.replace('bar2', 'bar1');
        document.getElementById('search').classList.replace('bar1', 'bar2');    
    }
    else{
        document.getElementById('headline_page').style.display='none';
        document.getElementById('search_page').style.display='block';
        document.getElementById('google_new').classList.replace('bar1', 'bar2');
        document.getElementById('search').classList.replace('bar2', 'bar1');  
    }
}

function search(){
    var form = document.getElementById('search_form');
    form.hidden_submit.click();
    if (!form.reportValidity()) return;

    var formData = new FormData(form);

    if (formData.get('from') > formData.get('to')){
        alert("Incorrect Time!")
        return
    }

    url = '/news_card?keyword=' + encodeURI(formData.get('keyword')) 
        + '&from=' + encodeURI(formData.get('from')) 
        + '&to=' + encodeURI(formData.get('to')) 
        + '&category=' + encodeURI(formData.get('category')) 
        + '&source=' + encodeURI(formData.get('source'));
    

    fetch(url)
    .then(response => response.json())
    .then(function(response) {
            if ('message' in response){
                alert(response.message);
                return
            }
            clear_cards();
            // console.log(response.articles)
            // console.log(response.articles[0])
            var news_list = document.getElementById('news_cards');

            for (var i=0; i<response.articles.length; ++i){
                var node=document.getElementById("sample").cloneNode(true);
                node.style.display = 'block';
                node.id = 'card' + i;
                node.children[0].children[0].src = response.articles[i].urlToImage;
                node.children[1].children[0].innerHTML = response.articles[i].title;
                node.children[1].children[1].innerHTML = '<span style="font-weight:bold"> Author: <\/span>' + response.articles[i].author +'<br>';
                node.children[1].children[2].innerHTML = '<span style="font-weight:bold"> Source: <\/span>' + response.articles[i].source.name+'<br>';
                node.children[1].children[3].innerHTML = '<span style="font-weight:bold"> Date: <\/span>' + publishedAt_to_string(response.articles[i].publishedAt)+'<br>';
                node.children[1].children[1].style.display = 'none';
                node.children[1].children[2].style.display = 'none';
                node.children[1].children[3].style.display = 'none';
                node.children[1].children[4].innerHTML = truncate_des(response.articles[i].description);
                node.children[1].children[5].innerHTML = response.articles[i].description;
                node.children[1].children[5].style.display = 'none';
                node.children[1].children[6].href = response.articles[i].url;
                node.children[1].children[6].style.display = 'none';
                node.children[2].style.display = 'none';
                news_list.appendChild(node);
            }
            if (response.articles.length <= 5){
                document.getElementById("show").style.display = 'none';
            }
            else{
                document.getElementById("show").style.display = 'block';
                document.getElementById("show").innerHTML = 'Show More';
                for (var i=5; i<response.articles.length; ++i){
                    document.getElementById("card" + i).style.display = 'none';
                }
            }
            // console.log(111)
            // console.log(response.articles.length)
            if (response.articles.length == 0){

                var nr_text = document.createElement('p');
                nr_text.setAttribute('style', 'margin-left:320px');
                nr_text.innerHTML = 'No results';
                news_list.appendChild(nr_text);
            }
        }
    )
}


function show_more_or_less(button){
    if (button.innerHTML == "Show More"){
        button.innerHTML = "Show Less";
        for (var i=5; i<document.getElementById('news_cards').children.length; ++i){
            document.getElementById("card" + i).style.display = 'block';
        }
    }
    else{
        button.innerHTML = "Show More";
        for (var i=5; i<document.getElementById('news_cards').children.length; ++i){
            document.getElementById("card" + i).style.display = 'none';
        } 
    }
}


function get_source(){
    var form = document.getElementById('search_form');
    var formData = new FormData(form);
    url = '/get_source?category=' + encodeURI(formData.get('category'));
    
    fetch(url)
    .then(response => response.json())
    .then(function(response) {
            // console.log(response)
            // console.log(response.articles[0])
            var source_list = document.getElementById("source_opt");

            while(source_list.hasChildNodes()) {
                source_list.removeChild(source_list.firstChild);
            }

            var new_opt=document.createElement("option");
            new_opt.innerHTML= "All";
            new_opt.value = "all";
            source_list.appendChild(new_opt);

            for (var i=0; i<response.articles.length; ++i){
                var new_opt=document.createElement("option");
                new_opt.innerHTML= response.articles[i].name;
                new_opt.value = response.articles[i].id;
                source_list.appendChild(new_opt);
            }
        }
    )
}


function clear_cards(){
    var source_list = document.getElementById("news_cards");

    while(source_list.hasChildNodes()) {
        source_list.removeChild(source_list.firstChild);
    }
    document.getElementById("show").style.display = 'none';
}

function default_input(){
    var form = document.getElementById("search_form");
    form.keyword.value = '';
    form.category.value = 'all';
    get_source();
    form.source.value = 'all';

    var day1 = new Date();
    day1.setTime(day1.getTime() - 24*60*60*1000*7);
    var s1 = date_to_string(day1);
    form.from.value = s1;

    var day2 = new Date();
    // day2.setTime(day2.getTime());
    var s2 = date_to_string(day2);
    // console.log(s2)
    form.to.value = s2;
}

function date_to_string(date){
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    if (month < 10){
        month = '0' + month;
    }
    if (day < 10){
        day = '0' + day;
    }
    return year + "-" + month + "-" + day
}

function publishedAt_to_string(publishedAt){
    return publishedAt.substring(5,7) + '/' + publishedAt.substring(8,10) + '/' + publishedAt.substring(0,4)
}


function clear_button(){
    clear_cards();
    default_input();
}

function show_detail(node){
    if (node.getAttribute('_state') == '1'){
        node.setAttribute('_state', '0')
        return;
    }
    // console.log(2);block
    node.children[1].children[1].style.display = 'block';
    node.children[1].children[2].style.display = 'block';
    node.children[1].children[3].style.display = 'block';
    node.children[1].children[5].style.display = 'block';
    node.children[1].children[6].style.display = 'block';
    node.children[1].children[4].style.display = 'none';
    node.children[2].style.display = 'block';
    node.style.height = 'auto';
}

function hide_detail(x){
    // console.log(1);
    node = x.parentNode;
    node.children[1].children[1].style.display = 'none';
    node.children[1].children[2].style.display = 'none';
    node.children[1].children[3].style.display = 'none';
    node.children[1].children[5].style.display = 'none';
    node.children[1].children[6].style.display = 'none';
    node.children[1].children[4].style.display = 'inline'
    node.children[2].style.display = 'none';
    node.style.height = '140px';
    node.setAttribute('_state', '1')
}

function truncate_des(description){
    var splited = description.split(' ');
    var truncated = splited[0];
    for (var i=0; i<splited.length; ++i){
        if (truncated.length + splited[i].length < 50){
            truncated = truncated + ' ' + splited[i];
        }
        else{
            truncated = truncated +'...';
            break
        }
    }
    return truncated
}
// TODO cut word, autocomplete