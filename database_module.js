const sqlite3 = require("sqlite3").verbose();

class db{
    constructor(database_path)
    {
        this.conn = new sqlite3.Database(database_path,(err)=>{
            if(err) {
                console.log("[ERROR] While connecting to database with path '"+database_path+"'\n\t"+err.message);
            }
            else
                console.log("[OK] Connected to database.");
        })
    }

    create_tables()
    {
        var sql = "CREATE TABLE words(word TEXT PRIMARY KEY,easiness REAL default 0,\
                    date TEXT default CURRENT_DATE,starred BOOLEAN default 0)";

        this.conn.run(sql,(err)=>{
            if(err)
                console.log("[GOOD] Table 'words' already exists.\n\t"+err.message);
            else
                console.log("[OK] Table 'words' created.");
        });

        sql = "CREATE TABLE dumped_words (word TEXT PRIMARY KEY);";
        this.conn.run(sql,(err)=>{
            if(err)
                console.log("[GOOD] Table 'dumped_words' already exists.\n\t"+err.message);
            else
                console.log("[OK] Table 'dumped_words' created.");
        });
    }

    insert_dumped_word(word,callback)
    {
        this.conn.run("INSERT INTO dumped_words(word) VALUES (?)",[word],(err)=>{
            if(err)
            {
                console.log("[ERROR] while inserting '"+word+"' into 'dumped words'\n\t" + err.message);
                callback(true,word);     // true == error
            }
            else
            {
                console.log("[OK] Word : " + word + " inserted as dumped word.");
                callback(false,word);    // false == not error
            }
                
        });
    }

    insert(word,callback)
    {
        this.conn.run("INSERT INTO words(word) VALUES (?)",[word],(err)=>{
            if(err)
            {
                console.log("[ERROR] while inserting '"+word+"'\n\t" + err.message);
                callback(true,word);     // true == error
            }
            else
            {
                console.log("[OK] Word : " + word + " inserted");
                callback(false,word);    // false == not error
            }
                
        });
    }

    select_all(callback)
    {
        this.conn.all("SELECT * from words",function(err,rows){
            if(err)
            {
                callback(true,null);        // true == error
                console.log("[ERROR] Retreiving all words.\n\t" + err);
            }
            else
            {
                callback(false,rows);       // false == no error
            }
        })
    }

    check_dumped_word(word,callback)
    {
        this.conn.all("SELECT * from dumped_words where word='"+word+"';",function(err,rows){
            if(err)
            {
                callback(true,word);        // true == error
                console.log("[ERROR] Retreiving dumped word '"+word+"'.\n\t" + err);
            }
            else if(rows.length == 0)
            {
                callback(true,word);        // true == not found
            }
            else
            {
                callback(false,word);       // false == found
            }
        })
    }

    check_word(word,callback)
    {
        this.conn.all("SELECT * from words where word='"+word+"';",function(err,rows){
            if(err)
            {
                callback(true,word);        // true == error
                console.log("[ERROR] Retreiving word '"+word+"'.\n\t" + err);
            }
            else if(rows.length == 0)
            {
                callback(true,word);        // true == not found
            }
            else
            {
                callback(false,word,rows);       // false == no error
            }
        })
    }

    select_random(limit=20,callback)
    {
        this.conn.all("SELECT * FROM words ORDER BY random() limit "+limit+";",function(err,rows){
            if(err)
            {
                callback(true,null);        // true == error
                console.log("[ERROR] Retreiving random words.\n\t" + err);
            }
            else
            {
                callback(false,rows);       // false == no error
            }
        })
    }

    delete_word(word,callback)
    {
        this.conn.run("DELETE FROM words WHERE word='" + word +"';",(err)=>{
            if(err)
            {
                console.log("[ERROR] while deleting '"+word+"'\n\t" + err.message);
                callback(true);     // true == error
            }
            else
            {
                console.log("[OK] Word : " + word + " deleted.");
                callback(false);    // false == not error
            }
                
        });
    }

    delete_dumped_word(word,callback)
    {
        this.conn.run("DELETE FROM dumped_words WHERE word='" + word +"';",(err)=>{
            if(err)
            {
                console.log("[ERROR] while deleting '"+word+"' from 'dumped_words'\n\t" + err.message);
                callback(true);     // true == error
            }
            else
            {
                console.log("[OK] Word : " + word + " deleted from 'dumped_words'.");
                callback(false);    // false == not error
            }
                
        });
    }

    update_star(word,flag,callback){

        this.conn.run("UPDATE words SET starred="+flag+" WHERE word='"+word+"';",(err)=>{
            if(err)
            {
                console.log("[ERROR] while updating star of '"+word+"'\n\t" + err.message);
                callback(true);     // true == error
            }
            else
            {
                console.log("[OK] Word : " + word + " star updated.");
                callback(false);    // false == not error
            }
        })

    }

}

module.exports = db;