/*!
  * @jslib-book/clone v1.0.0
  * (c) 2024 
  * @license MIT
  */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (factory());
}(this, (function () { 'use strict';

  function type(data) {
    return Object.prototype.toString.call(data).slice(8, -1).toLowerCase();
  }

  function clone(source) {
    var t = type(source);
    if (t !== 'object' && t !== 'array') {
      return source;
    }
    var target;
    if (t === 'object') {
      target = {};
      for (var i in source) {
        if (source.hasOwnProperty(i)) {
          target[i] = clone(source[i]);
        }
      }
    } else {
      target = [];
      for (var _i = 0; _i < source.length; _i++) {
        target[_i] = clone(source[_i]);
      }
    }
  }
  var a = {
    c: 1
  };
  var b = clone(a);

})));
