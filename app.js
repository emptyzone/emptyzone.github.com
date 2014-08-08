var issue_label = 'blog',
    sender_name = 'emptyzone',
    repository_name = 'emptyzone.github.com';

var commit_name = 'songchenwen',
    commit_email = 'emptyzone.0@gmail.com';

var sys = require('sys'),
    hexo_init = require('hexo').init,
    async = require('async'),
    child_process = require('child_process'),
    exec = child_process.exec,
    spawn = child_process.spawn;

var app = require('express')();
var bodyParser = require('body-parser');
var port = Number(process.env.PORT || 4000);
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
                output('building');
                build(res);
            }else{
                output(res, 'not valid post data');
                output.end();
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

function build(res){
    if(isBuilding){
        sys.puts('Hexo is currently building, not gonna build again.');
        return;
    }
    isBuilding = true;
    configureGit(res, function()){
        var commands = [
                        ['clean'],
                        ['migrate', 'issue'],
                        ['deploy', '-g'],
                        ['clean']
                        ];
        async.eachSeries(commands, function(item, next){
                         run('hexo', item, res, function(error){
                             if(error){
                             isBuilding = false;
                             output(res, 'error: ' + error + ' command: hexo ' + item.join(' '));
                             res.statusCode = 500;
                             res.end();
                             }else{
                             next();
                             }
                             });
                         }, function(){
                         isBuilding = false;
                         output(res, 'ready for another deploy');
                         res.end();
                         });
    }
}

function output(res, content){
    sys.puts(content);
    res.write(content);
}

function configureGit(res, callback){
    exec('sh /app/configure_git.sh', function(error, stdout, stderr){
            if(error){
                output(res, 'configure git error: ' + stderr);
                isBuilding = false;
                return;
            }
            output(res, stdout);
            callback();
         });
}

var run = function(command, args, res, callback){
    var cp = spawn(command, args, {});
    
    cp.stdout.on('data', function(data){
                 output(res, data);
                 });
    
    cp.stderr.on('data', function(data){
                 output(res, data);
                 });
    
    cp.on('close', callback);
};

hexo_init({command: 'version'}, function(){
            app.listen(port, function(){
                       isBuilding = false;
                       sys.puts("listening to : " + port);
                       build();
                     });
          });
