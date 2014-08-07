var issue_key_word = 'Build';
var user_name = 'emptyzone';
var repository_name = 'emptyzone.github.com';

var sys = require('sys'),
    exec = require('child_process').exec;
var app = require('http').createServer(handler);
var port = Number(process.env.PORT || 4000);

sys.puts("listening to : " + port);
app.listen(port);

function handler (req, res) {
    if (req.method == "POST") {
        var data = '';
        req.on('data', function(chunk) {
               data += chunk;
            });
        req.on('end', function() {
               sys.puts('Received body data:');
               data = JSON.parse(data);
               if(data.action == 'opened' &&
                   data.issue &&
                   data.issue.title &&
                   data.issue.title.indexOf(issue_key_word) != -1 &&
                   data.issue.user &&
                   data.issue.user.login &&
                   data.issue.user.login == user_name &&
                   data.repository &&
                   data.repository.name &&
                   data.repository.name == repository_name){
                    exec('hexo migrate gist; hexo d; hexo clean;', puts);
               }else{
                    sys.puts('POST DATA NOT ACCEPTED');
               }
            });
    }else{
        sys.puts('ABORT GET REQUEST');
    }
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.write("success");
    res.end();
}

function puts(error, stdout, stderr) {sys.puts(stdout)}