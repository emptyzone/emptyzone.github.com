var issue_label = 'blog',
    sender_name = 'emptyzone',
    repository_name = 'emptyzone.github.com';

var commit_name = 'songchenwen',
    commit_email = 'emptyzone.0@gmail.com';

var sys = require('sys'),
    fs = require('fs'),
    hexo_init = require('hexo').init,
    exec = require('child_process').exec;

var app = require('express')();
var bodyParser = require('body-parser');
var port = Number(process.env.PORT || 4000);
var cwd = process.cwd();
var db_file = 'db.json';
var isBuilding = false;

app.use(bodyParser.json());
app.get('/', function(req, res){
            sys.puts('ignore get method');
            res.send('success');
        });

app.post('/', function(req, res){
            sys.puts('post method');
            var data = req.body;
            if(isValidData(data)){
                res.send('building');
                build();
            }else{
                res.send('not valid data');
                sys.puts('not valid post');
            }
         });

function isValidData(data){
    if(data.issue &&
       data.repository &&
       data.repository.name &&
       data.repository.name == repository_name &&
       data.sender &&
       data.sender.login &&
       data.sender.login == sender_name){
        if(data.action){
            var action = data.action;
            if(action == 'labeled' || action == 'unlabeled'){
                if(data.label && data.label.name && data.label.name == issue_label){
                    return true;
                }
            }
            if(action == 'opened' || action == 'reopened' || action == 'closed'){
                var labels = data.issue.labels;
                if(labels){
                    for(var i = 0; i < labels.length; i++){
                        if(labels[i] && labels[i].name && labels[i].name == issue_label){
                            return true;
                        }
                    }
                }
            }
        }
        
    }
    return false;
}

function build(){
    if(isBuilding){
        sys.puts('Hexo is currently building, not gonna build again.');
        return;
    }
    isBuilding = true;
    hexo.call('clean', {}, function(){
              sys.puts('build start');
              hexo.call('migrate', {_ : ['issue']}, function(){
                        sys.puts('migrate from issue complete');
                        configureGit(function(){
                                     sys.puts('start deploying');
                                     hexo.call('deploy', {_ : ['-g']},function(){
                                               sys.puts('deploy finished');
                                               hexo.util.file2.rmdir('.deploy', function(err){
                                                                        if(err){
                                                                            sys.puts('\n\ndelete deploy dir error\n\n');
                                                                        }
                                                                        sys.puts('clean deploy dir');
                                                                        hexo.call('clean', {}, function(){
                                                                                  sys.puts('clean public dir');
                                                                                  isBuilding = false;
                                                                                  sys.puts('ready for another deploy');
                                                                                  });
                                                                        });
                                               });
                                     });
                        });
              });
    
}

function configureGit(callback){
    exec('sh /app/configure_git.sh', function(error, stdout, stderr){
            if(error){
                sys.puts('configure git error: ' + stderr);
                isBuilding = false;
                return;
            }
            sys.puts(stdout);
            callback();
         });
}

hexo_init({command: 'version'}, function(){
            app.listen(port, function(){
                       isBuilding = false;
                       sys.puts("listening to : " + port);
                       build();
                     });
          });
