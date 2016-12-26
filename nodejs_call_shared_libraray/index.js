var ffi = require('ffi');
 
var libm = ffi.Library('./lib_a.so', {
  'test_lib_a': [ 'void', [ 'int' ] ]
});
libm.test_lib_a(0);
 
