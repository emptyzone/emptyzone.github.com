var issue_label = 'blog',
    sender_name = 'emptyzone',
    repository_name = 'emptyzone.github.com';

var commit_name = 'songchenwen',
    commit_email = 'emptyzone.0@gmail.com';

var sys = require('sys'),
    hexo_init = require('hexo').init,
    exec = require('child_process').exec;

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
                    for(var item in labels){
                        if(item.name && item.name == issue_label){
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
    sys.puts('build start');
    hexo.call('migrate', {_ : ['issue']}, function(){
                    sys.puts('migrate from issue complete');
                    configureGit(function(){
                                 sys.puts('start deploying');
                                 hexo.call('deploy', function(){
                                           sys.puts('deploy finished');
                                           });
                           });
              });
}

function configureGit(callback){
    exec('sh /app/configure_git.sh', function(error, stdout, stderr){
            if(error){
                sys.puts('error: ' + stderr);
                return;
            }
            sys.puts(stdout);
            callback();
         });
}

hexo_init({command: 'version'}, function(){
            app.listen(port, function(){
                     sys.puts("listening to : " + port);
                       build();
                     });
          });
