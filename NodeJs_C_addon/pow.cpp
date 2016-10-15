// pow.cpp
#include <cmath>
#include <nan.h>

int myHello(double a, double b){
    printf("[myHello] a = %f, b = %f\n", a, b);
    return 99;
}

void hello(const Nan::FunctionCallbackInfo<v8::Value>& info) {

    if (info.Length() < 2) {
        Nan::ThrowTypeError("Wrong number of arguments");
        return;
    }

    if (!info[0]->IsNumber() || !info[1]->IsNumber()) {
        Nan::ThrowTypeError("Both arguments should be numbers");
        return;
    }

    double arg0 = info[0]->NumberValue();
    double arg1 = info[1]->NumberValue();
    v8::Local<v8::Number> num = Nan::New(myHello(arg0, arg1));

    info.GetReturnValue().Set(num);
}

void Pow(const Nan::FunctionCallbackInfo<v8::Value>& info) {

    if (info.Length() < 2) {
        Nan::ThrowTypeError("Wrong number of arguments");
        return;
    }

    if (!info[0]->IsNumber() || !info[1]->IsNumber()) {
        Nan::ThrowTypeError("Both arguments should be numbers");
        return;
    }

    double arg0 = info[0]->NumberValue();
    double arg1 = info[1]->NumberValue();
    v8::Local<v8::Number> num = Nan::New(pow(arg0, arg1));

    info.GetReturnValue().Set(num);
}

void Init(v8::Local<v8::Object> exports) { 
    
    /*export pow function*/
    exports->Set(Nan::New("pow").ToLocalChecked(),
                 Nan::New<v8::FunctionTemplate>(Pow)->GetFunction());
    
    /*export hello function*/
    exports->Set(Nan::New("hello").ToLocalChecked(),
                 Nan::New<v8::FunctionTemplate>(hello)->GetFunction());    
}

NODE_MODULE(pow, Init) 
