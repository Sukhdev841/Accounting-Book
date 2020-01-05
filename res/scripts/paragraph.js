function paragraph()
{
    var paragraph_ = document.getElementById("paragraph_text_area").value;
    
    var result = document.getElementById("result_paragraph");

    var words = paragraph_.split('\n');         // <=== first splitter is applied here
    var spliters = ['\t','.',',',' ',':',';','"',"'"];
    
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
                        new_paragraph += a_tag + '<mark class="word_highlight">'+temp+"</mark></a>";
                    else if(res[index_] == 2)
                        new_paragraph += a_tag + '<span class="new_word_highlight">'+temp+"</span></a>";
                    else if(res[index_] == 3)
                        new_paragraph += a_tag + '<span class="star_highlight">'+temp+"</span></a>";
                    else
                        new_paragraph += temp;
                }
                if( i<paragraph_.length)
                    new_paragraph += paragraph_[i];
                i++;
            }

            result.innerHTML += new_paragraph;
            
        }
    }
    xhr.send("words="+JSON.stringify(words));

    console.log(words);
}