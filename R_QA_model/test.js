
var spawn = require('child_process').spawn
var fs = require('fs');
var testDataFile = './test_data.txt'

try{
  var data_format = fs.readFileSync( 'data.format', 'utf8');
  //remove /r/n
  var data_format = data_format.toString().replace(/(?:\\[rn])+/g,'');
  //remove space
  //var data_format = data_format.toString().replace(/\s+/g,'');
  var format = data_format.split(/\s+/g);
  for (var i =0 ; i < format.length ; i++){
    if (format[i].length > 0){
      console.log('format['+i+'] = ' + format[i]);
    }
  } 
  console.log('data_format = ' + data_format);


  fs.writeFile(testDataFile, data_format, function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("The file was saved!");
  });

  //according data_formt to generate test data
  fs.appendFile(testDataFile, '1 8 1761 4 0 30 0 0', function (err) {

  }); 
 
}
catch(e){
  console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!');
  console.error(e);
  process.exit();
}



var env = process.env
var opts = { cwd: './',
             env: process.env
           }

var RCall = ['--no-restore','--no-save','myPredictCode.R','111,222,333']
var R  = spawn('Rscript', RCall, opts)

R.on('exit',function(code){
  console.log('got exit code: '+code)
  if(code==1){
            // do something special
  }else{
  }
  return null
})

R.stdout.on('data', (data) => {
  console.log('stdout:' + data);
});
