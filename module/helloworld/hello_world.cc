#include <iostream>

#include <node.h>
#include <v8.h>


using namespace std;
using namespace v8;

Handle<Value> Hello(const Arguments& args) {
	HandleScope scope;
	cout << "String!!" << endl;
	return scope.Close(String::New("Hello World!"));
}

Handle<Value> Hello_init(const Arguments& args) {
	HandleScope scope;
	for (int i = 0; i < args.Length(); i++) {
		if (args[i]->IsString()) {
			cout << "String!!" << endl;
		}
		else if (args[i]->IsFunction()) {
			cout << "Function!!" << endl;
		}
		else if (args[i]->IsObject()) {
			cout << "Object!!" << endl;
		}
		else if (args[i]->IsNumber()) {
			cout << "Number!!" << endl;
		}
	}

	int result = args[0]->Int32Value() + args[1]->Int32Value();

	return scope.Close(v8::Int32::New(result));
}


Handle<Value> Hello_loop(const Arguments& args) {
	HandleScope scope;
	if (args[0]->IsNumber() == false && args.Length() == 0) {
		cout << "false !" << endl;
		return scope.Close(v8::Boolean::New(false));
	}

	for (int i = 0; i < args[0]->Int32Value(); i++) {
		cout << i << endl;
	}
	return scope.Close(v8::Boolean::New(true));
}

void init(Handle<Object> exports) {
	exports->Set(String::NewSymbol("hello_world"),FunctionTemplate::New(Hello)->GetFunction());
	exports->Set(String::NewSymbol("hello_int"), FunctionTemplate::New(Hello_init)->GetFunction());
	exports->Set(String::NewSymbol("hello_loop"), FunctionTemplate::New(Hello_loop)->GetFunction());
}

NODE_MODULE(hello, init)
