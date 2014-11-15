#include <iostream>
#include <node.h>
#include <v8.h>

using namespace std;
using namespace v8;

int n = 0;



Handle<Value> value_A(const Arguments& args) {
	HandleScope scope;
	n = args[0]->Int32Value();
	return scope.Close(v8::Int32::New(n));
}

Handle<Value> value_B(const Arguments& args) {
	HandleScope scope;
	//n = args[0]->Int32Value();
	return scope.Close(v8::Int32::New(n));
}

void init(Handle<Object> exports) {
	exports->Set(String::NewSymbol("value_A"), FunctionTemplate::New(value_A)->GetFunction());
	exports->Set(String::NewSymbol("value_B"), FunctionTemplate::New(value_B)->GetFunction());
}

NODE_MODULE(variable, init)