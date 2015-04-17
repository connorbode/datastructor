var env   = process.env.NODE_ENV || 'dev';
var gulp  = require('gulp');
var kexec = require('kexec');

debugger;

switch (env) {
  case "prod":
    require('./dist');
    break;

  case "dev":
    kexec('gulp', ['nodemon']); // replace process
    break;
}