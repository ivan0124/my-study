
var spawn = require('child_process').spawn
var env = process.env

var opts = { cwd: './',
             env: process.env
           }
// can modify child env with needed key-value pairs
opts.env['YEAR']=2013
opts.env['BASIN']='SC'

var RCall = ['--no-restore','--no-save','a.R']
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
