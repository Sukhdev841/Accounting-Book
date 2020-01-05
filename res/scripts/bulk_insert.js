
function insertion_success(word)
{
    var new_child = "<a class='no_decoration bw_word float_left green_background' href=\
    'https://www.google.com/search?q="+word+"' target='_blank'>" + word+ "</a>";
    document.getElementById("result").innerHTML += new_child;
}

function insertion_failed(word)
{
    var new_child = "<a class='no_decoration bw_word float_left red_background' href=\
    'https://www.google.com/search?q="+word+"' target='_blank'>" + word+ "</a>";
    document.getElementById("result").innerHTML += new_child;
}

function bulk_insertion()
{
    var words = document.getElementById("bulk_words").value.split('\n');
    console.log(words);
    var xhr = new XMLHttpRequest();
    xhr.open("POST", '/bulk_insert', true);
    //Send the proper header information along with the request
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhr.onreadystatechange = function() { // Call a function when the state changes.
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            // Request finished. Do processing here.
            var res = JSON.parse(xhr.responseText);

            var bw_div = document.getElementById("bw_div");

            bw_div.parentNode.removeChild(bw_div);

            for(i=0; i<words.length;i++)
            {
                if(res[i] == true)
                    insertion_failed(words[i]);
                else
                    insertion_success(words[i]);
            }
        }
    }
    xhr.send("words="+JSON.stringify(words));
}