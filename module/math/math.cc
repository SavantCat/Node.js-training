#include <iostream>
#include<math.h>
#include <node.h>
#include <v8.h>


using namespace std;
using namespace v8;

Handle<Value> IsPrime(const Arguments& args) {
	HandleScope scope;
	double num,i;

	if (args[0]->IsNumber() == false && args.Length() == 0) {
		cout << "Error !" << endl;
		return scope.Close(v8::Boolean::New(false));
	}

	num = double(args[0]->NumberValue());
	//cout << num << endl;
	for (i = 2; i < num; i++){
		//cout << i << endl;
		if (fmod(num,i) == 0){
			return scope.Close(v8::Boolean::New(false));
		}
	}
	//cout << i << endl;
	return scope.Close(v8::Boolean::New(true));
}

Handle<Value> exp_01(const Arguments& args) {
	HandleScope scope;
	double num, i,sum=0;

	if (args[0]->IsNumber() == false && args.Length() == 0) {
		cout << "Error !" << endl;
		return scope.Close(v8::Boolean::New(false));
	}

	num = double(args[0]->NumberValue());

	//cout << num << endl;
	for (i = 1; i <= num; i++){
		sum += pow(i,i);
	}
	//cout << i << endl;
	return scope.Close(v8::Number::New(sum));
}

Handle<Value> sourt(const Arguments& args) {
	HandleScope scope;
	double num, i, sum = 0;

	if (args[0]->IsNumber() == false && args.Length() == 0) {
		cout << "Error !" << endl;
		return scope.Close(v8::Boolean::New(false));
	}

	num = double(args[0]->NumberValue());

	//cout << num << endl;
	for (i = 1; i <= num; i++){
		sum += pow(i, i);
	}
	//cout << i << endl;
	return scope.Close(v8::Number::New(sum));
}

void init(Handle<Object> exports) {
	exports->Set(String::NewSymbol("IsPrime"), FunctionTemplate::New(IsPrime)->GetFunction());
	exports->Set(String::NewSymbol("exp_01"), FunctionTemplate::New(exp_01)->GetFunction());
}

NODE_MODULE(math, init)
