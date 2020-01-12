var express = require('express');
const db_module = require('./database_module');
var bodyParser = require("body-parser");
var _ = require('lodash');

var db = new db_module('./my_db.db');

db.create_tables();


var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('res'));             // use res directory for static files
app.set('views','./res');
app.set('view engine','pug');
var config = require('./config.json');      // configuration file

app.get('/',function(req,res){

    // for debugging

    res.render('paragraph');
    return;

    // real code ---
    
    db.select_random(20,function(err,rows){
        console.log(rows);
        if(rows)
        {
            res.render('index',{words:rows});
            console.log("[OK] Home Page rendered.");
        }
    })
})

app.get('/bulk-insert',function(req,res){
    res.render('bulk_insert');
})

app.get('/paragraph',function(req,res){
    res.render('paragraph');
})

app.post('/bulk_insert',function(req,res){
    var words = JSON.parse(req.body.words);
    console.log(words);
    var flags = new Array(words.length);
    var finished = _.after(words.length,doRender);
    for(i=0; i<words.length;i++)
    {
        var j = i;
        db.insert(words[j],function(err,word){
            if(err)
                flags[words.indexOf(word)] = true;        // error
            else
            flags[words.indexOf(word)]= false;        // no error
            finished();
        })
    }
    function doRender()
    {
        res.send(flags);
    }
})

app.post('/bulk_star_insert',function(req,res){
    var words = JSON.parse(req.body.words);
    console.log(words);
    var flags = new Array(words.length);
    var finished = _.after(words.length,doRender);
    for(i=0; i<words.length;i++)
    {
        var j = i;
        db.star_insert(words[j],function(err,word){
            if(err)
                flags[words.indexOf(word)] = true;        // error
            else
            flags[words.indexOf(word)]= false;        // no error
            finished();
        })
    }
    function doRender()
    {
        res.send(flags);
    }
})

app.post('/bulk_dump_insert',function(req,res){
    console.log(req.body);
    var words = JSON.parse(req.body.words);
    console.log(words);
    var flags = new Array(words.length);
    var finished = _.after(words.length,doRender);
    for(i=0; i<words.length;i++)
    {
        var j = i;
        db.insert_dumped_word(words[j],function(err,word){
            if(err)
                flags[words.indexOf(word)] = true;        // error
            else
            flags[words.indexOf(word)]= false;        // no error
            finished();
        })
    }
    function doRender()
    {
        res.send(flags);
    }
})

app.post('/check_words',function(req,res){
    var words = JSON.parse(req.body.words);
    console.log(words);
    var flags = new Array(words.length);
    var finished = _.after(words.length,doRender);
    for(i=0; i<words.length;i++)
    {
        var j = i;
        db.check_dumped_word(words[j],function(err,word){
            if(err)
            {
                // not dumped word
                // check for important word
                db.check_word(word,function(err,ret_word,rows){
                    if(err)
                    {
                        //not actual word also
                        flags[words.indexOf(word)] = 2;        // error     ==> new word
                        finished();
                    }
                    else
                    {
                        console.log(rows);
                        if(rows[0].starred == 1)
                            flags[words.indexOf(word)] = 3;     // 3 == starred 
                        else
                            flags[words.indexOf(word)] = 1;             // it is a actual word
                        finished();
                    }
                        
                })
                
            }
            else
            {
                flags[words.indexOf(word)]= 0;        // no error => dumped word
                finished();
            }
                
        })
    }
    function doRender()
    {
        res.send(flags);
    }
})

app.post('/new_word',function(req,res){

    db.insert(req.body.word,function(err){
        if(err)
            res.send(true);        // error
        else
            res.send(false);         // success
    });  
})

app.post('/new_dumped_word',function(req,res){
    db.insert_dumped_word(req.body.word,function(err){
        if(err)
            res.send(true);        // error
        else
            res.send(false);         // success
    }); 
})

app.post('/delete_word',function(req,res){
    
    console.log("[REQ] Delete "+req.body.word);
    console.log(req.body.word);
    db.delete_word(req.body.word,function(err){
        if(err)
            res.send(true);         // failure
        else
            res.send(false);        // success
    })
})

app.post('/delete_dumped_word',function(req,res){
    
    console.log("[REQ] Delete dumped word : "+req.body.word);
    console.log(req.body.word);
    db.delete_dumped_word(req.body.word,function(err){
        if(err)
            res.send(true);         // failure
        else
            res.send(false);        // success
    })
})

app.post('/starred_field_update',function(req,res){
    
    console.log("[REQ] STAR "+req.body.word+"\t"+req.body.flag);
    db.update_star(req.body.word,req.body.flag,function(err){
        if(err)
            res.send(true);         // failed
        else
            res.send(false);        // success
    })

})

app.post('/check_word',function(req,res){
    console.log("[REQ] Check if word : "+req.body.word);
    db.check_word(req.body.word,function(not_found){
        if(not_found)
            res.send(true);     // not found
        else
            res.send(false);       // found

    })
})

app.post('/check_dumped_word',function(req,res){
    console.log("[REQ] Check if dumped word : "+req.body.word);
    db.check_dumped_word(req.body.word,function(not_found){
        if(not_found)
            res.send(true);     // not found
        else
            res.send(false);       // found

    })
})

var server = app.listen(8080,'192.168.0.105',function(){
    console.log('[OK] Server listening on port '+config.port)
})