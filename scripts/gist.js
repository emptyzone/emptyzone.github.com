var github = require('octonode');

var gist_id = '37657e6aed5abc69fcec';
var md_suffix = '.md';

var log = hexo.log;
var file = hexo.util.file2;
var destDir = hexo.config.source_dir + '/_posts/';

function gist(args, callback){
    var gist = github.client().gist();
    log.i("requesting gist api content");
    gist.get(gist_id, function(err, body, headers){
                if(!err){
                    var files = body.files;
                    for(var fileName in files){
                        if(fileName.indexOf(md_suffix, fileName.length - md_suffix.length) !== -1){
                            var destFile = destDir + fileName;
                            log.i('writing gist file to: ' + destFile);
                            file.writeFile(destFile, files[fileName].content);
                        }else{
                            log.i('ignored gist file: ' + fileName);
                        }
                    }
                }else{
                    log.e('requesting gist api error');
                }
                callback();
             });
}

hexo.extend.migrator.register("gist", gist);