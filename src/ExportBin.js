var fs = require('fs');
var getDirectories = function(rootDir, cb) {
  fs.readdir(rootDir, function(err, files) {
      var dirs = [];
      if(typeof(files)=="undefined") {
        cb(dirs);
        return [];
      }
      for (var index = 0; index < files.length; ++index) {
          var file = files[index];
          if (file[0] !== '.') {
              var filePath = rootDir + '/' + file;
              fs.stat(filePath, function(err, stat) {
                  if (stat.isDirectory()) {
                      dirs.push(this.file);
                  }
                  if (files.length === (this.index + 1)) {
                      return cb(dirs);
                  }
              }.bind({index: index, file: file}));
          }
      }
  });
}

module.exports = function ExportBin(dir = "./output/",ref) {
  dir = (dir[dir.length-1]=="/") ? dir : dir + "/";
  if(ref.options.inBrowser) return false;
  fs.access(dir, function(err){
    if(err) fs.mkdir(dir, function() {});
  });
  getDirectories(dir,function(dirs){
    var num = 1;
    for(var d in dirs){
      if(dirs[d].match(/^sequencer(.*)$/)==null) continue;
      var n = parseInt(dirs[d].match(/^sequencer(.*)$/)[1]);
      num = (n>=num)?(n+1):num;
    }
    fs.mkdir(dir+'sequencer'+num,function(){
      var root = dir+'sequencer'+num+'/';
      for(var image in ref.images) {
        var steps = ref.images[image].steps;
        for(var i in steps) {
          var datauri = steps[i].output.src;
          var ext = steps[i].output.format;
          var buffer = require('data-uri-to-buffer')(datauri);
          fs.writeFile(root+image+"_"+i+"."+ext,buffer,function(){

          });
        }
      }
    })
  });
}
