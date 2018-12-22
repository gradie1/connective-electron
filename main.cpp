#include <nan.h>


NAN_METHOD(Hello) {
    
    auto message = Nan::New("Hello from C++!").ToLocalChecked();
    
    info.GetReturnValue().Set(message);
}

// Module initialization logic
NAN_MODULE_INIT(Initialize) {
    
    NAN_EXPORT(target, Hello);
}

// Create the module called "addon" and initialize it with `Initialize` function (created with NAN_MODULE_INIT macro)
NODE_MODULE(addon, Initialize);