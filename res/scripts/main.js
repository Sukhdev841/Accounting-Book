
function hide_notification()
{
    document.getElementById("notification").style.visibility = "hidden";
}

function show_notification()
{
    document.getElementById("notification").style.visibility = "visible";
    setTimeout(hide_notification,3000);
}

function final_success_notification(message)
{
    var notification_div = document.getElementById("notification");
    notification_div.childNodes[0].style.backgroundColor = "green";
    notification_div.childNodes[1].childNodes[0].src = './icons/success.png';
    notification_div.childNodes[2].innerHTML = message;
    show_notification();
}

function success_notification(word)
{
    var notification_div = document.getElementById("notification");
    notification_div.childNodes[0].style.backgroundColor = "green";
    notification_div.childNodes[1].childNodes[0].src = './icons/success.png';
    notification_div.childNodes[2].innerHTML = '"' + word +'" inserted successfully.';
    show_notification();
}

function failure_notification(word)
{
    var notification_div = document.getElementById("notification");
    notification_div.childNodes[0].style.backgroundColor = "red";
    notification_div.childNodes[1].childNodes[0].src = './icons/error.png';
    notification_div.childNodes[2].innerHTML = 'Failed to save "' + word + '".';
    show_notification();
}

function add_word()
{   
    var xhr = new XMLHttpRequest();
    var new_word = document.getElementById("word_input").value;
    xhr.open("POST", '/new_word', true);
    //Send the proper header information along with the request
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhr.onreadystatechange = function() { // Call a function when the state changes.
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            // Request finished. Do processing here.
            var res = xhr.responseText;
            console.log(res == 'true');
            if(res == 'true')
            {
                // failed to insert word
                failure_notification(new_word);
            }
            else
            {
                // word inserted successfully
                success_notification(new_word);
            }
        }
    }
    xhr.send("word="+new_word);
    document.getElementById("word_input").value = "";
}

function star_clicked(parent_tag)
{
    var word = parent_tag.id;
    console.log(parent_tag);
    var element = parent_tag.childNodes[3].childNodes[0];
    var flag;

    var xhr = new XMLHttpRequest();
    xhr.open("POST", '/starred_field_update', true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    if(element.classList.contains("hollow_star"))
    {
        // star is unclicked
        flag = 1;
    }
    else
    {
        //star is clicked
        flag = 0;
    }

    xhr.onreadystatechange = function() { // Call a function when the state changes.
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            // Request finished. Do processing here.
            var res = xhr.responseText;
            console.log(res == 'true');
            if(res == 'true')
            {
                // failed to update star of word
                console.log("Failed to delete word");
            }
            else
            {
                if(flag == 1)
                {
                    element.classList.remove('hollow_star');
                    element.classList.add('filled_star');
                }
                else
                {
                    element.classList.remove('filled_star');
                    element.classList.add('hollow_star');
                }
            }
        }
    }
    xhr.send("word="+word+"&flag="+flag);
}

function delete_word(parent_tag)
{
    console.log(parent_tag);
    var new_word = parent_tag.id;
    console.log(new_word);
    var xhr = new XMLHttpRequest();
    xhr.open("POST", '/delete_word', true);
    //Send the proper header information along with the request
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhr.onreadystatechange = function() { // Call a function when the state changes.
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            // Request finished. Do processing here.
            var res = xhr.responseText;
            console.log(res == 'true');
            if(res == 'true')
            {
                // failed to delete word
                //failure_notification(new_word);
                console.log("Failed to delete word");
            }
            else
            {
                // word deleted successfully
                //success_notification(new_word);
                console.log("Word deleted sucessfully");
                parent_tag.parentNode.removeChild(parent_tag);
            }
        }
    }
    xhr.send("word="+new_word);
}