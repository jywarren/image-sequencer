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

module.exports = function ExportBin(ref) {
  if(ref.options.inBrowser) return false;
  fs.access('./output/', function(err){
    if(err) fs.mkdir('output', function() {});
  });
  getDirectories('./output',function(dirs){
    var num = 1;
    for(var d in dirs){
      if(dirs[d].match(/^sequencer(.*)$/)==null) continue;
      var n = parseInt(dirs[d].match(/^sequencer(.*)$/)[1]);
      num = (n>=num)?(n+1):num;
    }
    fs.mkdir('output/sequencer'+num,function(){
      var root = 'output/sequencer'+num+'/';
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
