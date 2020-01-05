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

app.post('/new_word',function(req,res){

    db.insert(req.body.word,function(err){
        if(err)
            res.send(true);        // error
        else
            res.send(false);         // success
    });
    
})

app.post('/delete_word',function(req,res){
    
    console.log(req.body.word);
    db.delete_word(req.body.word,function(err){
        if(err)
            res.send(true);         // failure
        else
            res.send(false);        // success
    })
})

app.post('/starred_field_update',function(req,res){
    
    db.update_star(req.body.word,req.body.flag,function(err){
        if(err)
            res.send(true);         // failed
        else
            res.send(false);        // success
    })

})

var server = app.listen(config.port,function(){
    console.log('[OK] Server listening on port '+config.port)
})