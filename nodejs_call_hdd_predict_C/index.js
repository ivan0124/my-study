var ffi = require('ffi')
var ref = require('ref')
var arrayType = require('ref-array')

var int = ref.types.int
var double = ref.types.double
var intArray = arrayType(int)
var doubleArray = arrayType(double)

var libm = ffi.Library('./hddPredict.so', {
  'hddPredict': [ 'int', [ 'int', intArray] ]
});

var hdd_smart = new intArray(6)
hdd_smart[0] = 1      //for intercept
hdd_smart[1] = 130312 //smart 5
hdd_smart[2] = 85617  //smart 9
hdd_smart[3] = 4937   //smart 187
hdd_smart[4] = 24     //smart 192
hdd_smart[5] = 312    //smart 197

var r =libm.hddPredict(hdd_smart.length, hdd_smart)
console.log("return: " + r);
