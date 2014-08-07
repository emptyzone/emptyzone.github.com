var github = require('octonode'),
    async = require('async');

var gist_migrator = hexo.config.gist_migrator;
var file_suffix = (gist_migrator && gist_migrator.file_suffix) ? gist_migrator.file_suffix : '.md';

var log = hexo.log;
var file = hexo.util.file2;
var destDir = hexo.config.source_dir + '/_posts/';

var config_lost_warn = '\ngist_migrator not configured.\nAdd\n    gist_migrator : \n    gist_id : your gist id\nto _config.yml';

function gist(args, callback){
    if(!gist_migrator || !gist_migrator.gist_id){
        log.w(config_lost_warn);
        callback();
        return;
    }
    var gist_id = gist_migrator.gist_id;
    var gist = github.client().gist();
    log.i("requesting api content");
    gist.get(gist_id, function(err, body, headers){
                if(!err){
                    var files = body.files;
                    var fileNames = [];
                    for(var f in files){
                        fileNames.push(f);
                    }
                    async.each(fileNames, function(fileName, cb){
                                    if(fileName.indexOf(file_suffix, fileName.length - file_suffix.length) !== -1){
                                        log.i('writing to: ' + fileName);
                                        file.writeFile(destDir + fileName, files[fileName].content, cb);
                                    }else{
                                        log.i('ignored: ' + fileName);
                                        cb();
                                    }
                               }, function(err){
                                    callback();
                               });
                }else{
                    log.e('requesting api error');
                    callback();
                }
             });
}

hexo.extend.migrator.register("gist", gist);