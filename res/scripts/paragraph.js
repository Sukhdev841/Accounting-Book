function paragraph()
{
    var paragraph_ = document.getElementById("paragraph_text_area").value;
    
    var result = document.getElementById("result_paragraph");

    var words = paragraph_.split('\n');         // <=== first splitter is applied here
    var spliters = ['\t','.',',',' ',':',';','"',"'",'?'];
    
    for(ii=0; ii<spliters.length; ii++)
    {
        var temp = [];
        for(i=0; i<words.length;i++)
        {
            if(words[i].includes(spliters[ii]))
            {
                var x = words[i].split(spliters[ii]);

                for(j=0;j<x.length;j++)
                {
                    if(x[j] != "")
                        temp.push(x[j]);
                }
                    
            }
            else
                temp.push(words[i]);
        }
        
        words = temp;
    }

    words = [... new Set(words)];

    var xhr = new XMLHttpRequest();
    xhr.open("POST", '/check_words', true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhr.onreadystatechange = function() { // Call a function when the state changes.
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            // Request finished. Do processing here.
            var res = JSON.parse(xhr.responseText);
            var bw_div = document.getElementById("bw_div");
            bw_div.parentNode.removeChild(bw_div);
            
            console.log(res);

            var new_paragraph = '';

            for(i=0; i<paragraph_.length;)
            {
                temp = '';
                while(i < paragraph_.length && !spliters.includes(paragraph_[i]))
                {
                    temp += paragraph_[i++];
                }
                if(temp != '')
                {
                    var index_ = words.indexOf(temp);
                    var a_tag = "<a class='no_decoration' href=\
                    'https://www.google.com/search?q="+temp+"' target='_blank'>";
                    if(res[index_] == 1)
                    {
                        new_paragraph += a_tag + '<mark class="word_highlight">'+temp+"</mark></a>";
                    }
                    else if(res[index_] == 2)
                    {
                        new_paragraph += a_tag + '<span class="new_word_highlight">'+temp+"</span></a>";
                    }
                    else if(res[index_] == 3)
                    {
                        new_paragraph += a_tag + '<span class="star_highlight">'+temp+"</span></a>";
                    }
                    else
                        new_paragraph += temp;
                }
                if( i<paragraph_.length)
                    new_paragraph += paragraph_[i];
                i++;
            }
            document.getElementById("result_paragraph").style.display = "block";
            result.innerHTML += new_paragraph;
            add_words_html(res,words);
            
        }
    }
    xhr.send("words="+JSON.stringify(words));

    console.log(words);
}

function add_words_html(res_stored,words)
{
    // console.log(res_stored)
    document.getElementById("classification_container").style.display = "block";
    for(i=0; i<words.length; i++)
    {
        var word = words[i];
        var index_ = words.indexOf(word);
        if(res_stored[index_] == 2)
        {
            add_new_word_html(word);
        }
    }
}

function add_new_word_html(word)
{
    var normal_words_column = document.getElementById("new_words_column");

    var html = "<div class='column_word_unit new_word_background' id='"+word+"\
            ' draggable='true' ondragstart='drag(event)'>"+word+"</div>";

    normal_words_column.childNodes[1].innerHTML += html;
}

function max_(var1,var2)
{
    if(var1 > var2)
        return var1;
    return var2;
}

function allowDrop(ev) {
    ev.preventDefault();
  }
  
  function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
  }
  
  function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");

    

    if(ev.target.id=="new_words_column")
    {
        document.getElementById(data).classList.remove("normal_word_background");
        document.getElementById(data).classList.remove("starred_word_background");
        document.getElementById(data).classList.add("new_word_background");
    }
    else if(ev.target.id=="normal_words_column")
    {
        document.getElementById(data).classList.remove("starred_word_background");
        document.getElementById(data).classList.remove("new_word_background");
        document.getElementById(data).classList.add("normal_word_background");
    }
    else if(ev.target.id=="starred_words_column")
    {
        document.getElementById(data).classList.remove("normal_word_background");
        document.getElementById(data).classList.remove("new_word_background");
        document.getElementById(data).classList.add("starred_word_background");
    }
    else
    {
        //delete element
    }
    //reset_height();

    ev.target.appendChild(document.getElementById(data));
  }


function submit_catogrised_words()
{
    var normal_words = document.getElementById("normal_words_column").childNodes[1];
    var new_words = document.getElementById("new_words_column").childNodes[1];
    var starred_words = document.getElementById("starred_words_column").childNodes[1];

    var _normal_words = [];
    var _new_words = [];
    var _starred_words = [];

    // all new words will be inserted as "dumped words"
    for(var child=new_words.firstChild; child!==null; child=child.nextSibling) {
        _new_words.push(child.innerHTML);
    }

    for(var child=normal_words.firstChild; child!==null; child=child.nextSibling) {
        _normal_words.push(child.innerHTML);
    }

    for(var child=starred_words.firstChild; child!==null; child=child.nextSibling) {
        _starred_words.push(child.innerHTML);
    }

    // dumped words == new words

    var index = ['/bulk_dump_insert','/bulk_insert','/bulk_star_insert'];
    var request = new XMLHttpRequest();
    (function loop(i, length) {
        if (i>= length) {
            //var msg = 'dumped words';
            var msg = _new_words.length + ' dumped words, '+_normal_words.length + ' normal words and ' + _starred_words + ' starred words inserted.';
            final_success_notification(msg);
            document.getElementById("classification_container").style.display = "none";
            return;
        }
        var words_;
        if( i== 0)
            words_ = _new_words;
        else if(i==1)
            words_ = _normal_words;
        else
            words_ = _starred_words;

        if(words_.length > 0)
        {
            request.open("POST", index[i], true);
            request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            request.onreadystatechange = function() {
                if(request.readyState === XMLHttpRequest.DONE && request.status === 200) {
                    var res = JSON.parse(request.responseText);
                    console.log(res + " for request index : " + i)
                    loop(i + 1, length);
                }
            }
            request.send("words="+JSON.stringify(words_));
        }
        else
            loop(i+1,length);
    })(0, index.length);

}