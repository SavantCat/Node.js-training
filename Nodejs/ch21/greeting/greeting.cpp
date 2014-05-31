#include <node.h>
#include <v8.h>
#include <iostream>
#include <string.h>

using namespace v8;
using namespace std;

class GreetingCpp {
public:
  GreetingCpp() {};
  ~GreetingCpp();
  string Hello(const string& name);
private:
  string Greet(const string& greet, const string& name);
};

GreetingCpp::~GreetingCpp() {}

string GreetingCpp::Greet(const string& greet, const string& name) {
  return greet + ", " + name + "!";
}

string GreetingCpp::Hello(const string& name) {
  string greet = "Hello";
  return GreetingCpp::Greet(greet, name);
}

class GreetingJS : public node::ObjectWrap {
public:
  GreetingJS() {};
  ~GreetingJS() {
    delete greetingCpp;
  }
private:
  GreetingCpp *greetingCpp;

  static Handle<Value> New(const Arguments& args) {
    HandleScope scope;
    GreetingJS* greetingJS = new GreetingJS();
    greetingJS->Wrap(args.This());
    greetingJS->greetingCpp = new GreetingCpp();
    return args.This();
  }

  static Handle<Value> Hello(const Arguments& args) {
    HandleScope scope;
    GreetingJS* greetingJS = ObjectWrap::Unwrap<GreetingJS>(args.This());
    GreetingCpp* greetingCpp = greetingJS->greetingCpp;
    string name = "World";
    if (args.Length() == 1 && args[0]->IsString()) {
      name = *String::Utf8Value(args[0]->ToString());
    }
    string result(greetingCpp->Hello(name));
    return scope.Close(String::New(result.c_str()));
  }

public:
  static void InitGreeting(Handle<Object> target) {
    HandleScope scope;
    Local<FunctionTemplate> class_tmpl = FunctionTemplate::New(GreetingJS::New);
    class_tmpl->SetClassName(String::New("Greeting"));
    Local<ObjectTemplate> inst_tmpl = class_tmpl->InstanceTemplate();
    inst_tmpl->SetInternalFieldCount(1);

    NODE_SET_PROTOTYPE_METHOD(class_tmpl, "hello", GreetingJS::Hello);

    target->Set(String::New("Greeting"), class_tmpl->GetFunction());
  }
};

NODE_MODULE(greeting, GreetingJS::InitGreeting);
