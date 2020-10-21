var Person = function () {
  this.name = "andrew";
  this.age = 33;
  this.title = "web developer";
};
Person.prototype.sayHello = function () {
  console.log("Hello: ", this.name);
};
Person.prototype.sayAge = function () {
  console.log("Age: ", this.age);
};
Person.prototype.sayTitle = function () {
  console.log("Title: ", this.title);
};
var andrew = new Person();
andrew.sayHello();
andrew.sayAge();
andrew.sayTitle();
