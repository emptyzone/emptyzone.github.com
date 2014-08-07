var issue_key_word = 'Build';
var user_name = 'emptyzone';
var repository_name = 'emptyzone.github.com';

var sys = require('sys'),
    hexo_init = require('./node_modules/hexo/lib/init');
var app = require('express')();
var bodyParser = require('body-parser');
var port = Number(process.env.PORT || 4000);
var cwd = process.cwd();

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
                res.send('building');
                build();
            }else{
                res.send('not valid data');
                sys.puts('not valid post');
            }
         });

app.listen(port, function(){
            sys.puts("listening to : " + port);
           });

function build(){
    hexo_init(cwd, {_ : ['migrate', 'gist']}, function(){
              sys.puts('migrate from gist complete');
              hexo.call('generate', function(){
                            sys.puts('build finished');
                        });
         });
}