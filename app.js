var issue_key_word = 'Build';
var user_name = 'emptyzone';
var repository_name = 'emptyzone.github.com';

var sys = require('sys'),
    exec = require('child_process').exec;
var express = require("express");
var app = express();
var bodyParser = require('body-parser');
var port = Number(process.env.PORT || 4000);

app.use(bodyParser.json());
app.get('/', function(req, res){
            sys.puts('ignore get method');
            res.send('success');
        });

app.post('/', function(req, res){
            sys.puts('post method');
            var data = req.body;
            if(data.issue &&
               data.issue.title &&
               data.issue.title.indexOf(issue_key_word) != -1 &&
               data.issue.user &&
               data.issue.user.login &&
               data.issue.user.login == user_name &&
               data.repository &&
               data.repository.name &&
               data.repository.name == repository_name){
                exec('hexo migrate gist; hexo d;', function(error, stdout, stderr){
                        if(stderr){
                            sys.puts(stderr);
                        }
                        sys.puts(stdout);
                     });
                res.send('building');
            }else{
                res.send('not valid data');
                sys.puts('not valid post');
            }
         });

app.listen(port, function(){
            sys.puts("listening to : " + port);
           });