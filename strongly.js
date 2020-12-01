/*
MIT License

Copyright (c) 2020 Steve Beeblebrox

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
class StronglyJSType {
  #f; #n; #t; #w; #d;
  constructor(fallback, name = typeof fallback, test = (o) => typeof o === typeof fallback, wrapper = (o) => o, data = {}) {
    if(typeof name !== 'string') throw new TypeError(`Cannot convert '${name}' to 'string'`);
    if(typeof test !== 'function') throw new TypeError(`Cannot convert '${test}' to 'function'`);
    if(typeof wrapper !== 'function') throw new TypeError(`Cannot convert '${wrapper}' to 'function'`);
    this.#f = fallback;
    this.#n = name;
    this.#t = test;
    this.#w = wrapper;
    this.#d = data;
  }
  get fallback() {return this.#f}
  get name() {return this.#n}
  get data() {return this.#d}
  allows(o) {return this.#t(o)}
  wrap(o) {return this.#w(o)}
}
class StronglyJS {
  static #TYPES = {
    __proto__: null,
    NUMBER: new StronglyJSType(0, 'number', (o) => typeof o === 'number' || o instanceof Number),
    BIGINT: new StronglyJSType(0n),
    NUMERICAL: new StronglyJSType(0, 'numerical', (o) => typeof o === 'number' || typeof o === 'bigint' || o instanceof Number),
    INTEGER: new StronglyJSType(0, 'integer', Number.isInteger),
    BOOLEAN: new StronglyJSType(false, 'boolean', (o) => typeof o === 'boolean' || o instanceof Boolean),
    STRING: new StronglyJSType('', 'string', (o) => typeof o === 'string' || o instanceof String),
    SYMBOL: new StronglyJSType(undefined, 'symbol', (o) => typeof o === 'symbol'),
    ARRAY: new StronglyJSType([], 'array', (o) => o instanceof Array),
    REGEXP: new StronglyJSType(/.*/g, 'regexp', (o) => o instanceof RegExp),
    ELEMENT: new StronglyJSType(undefined, 'element', (o) => o instanceof HTMLElement),
    FUNCTION: new StronglyJSType(function() {}),
    ASYNCFUNCTION: new StronglyJSType(async function() {}, 'async function', (o) => o instanceof (async function () {}).constructor),
    GENERATORFUNCTION: new StronglyJSType(function*() {}, 'generator function', (o) => o instanceof (function* () {}).constructor),
    ANY: new StronglyJSType({}, 'any', (o) => true),
    ARRAYOF: (t) => new StronglyJSType([], t.name + ' array', (o) => o instanceof Array && o.every((i) => t.allows(i))),
    NULLABLE: (t) => new StronglyJSType(null, 'nullable ' + t.name, (o) => o === null || t.allows(o)),
    TUPLEOF: (...t) => new StronglyJSType(t.map(o => o.fallback), t.map(o => o.name).join(', ') + ' tuple', (o) => o instanceof Array && t.every((i, n) => i.allows(o[n])),
    function(l) {return new Proxy(l, {
      set: (o, p, v) => {
          let i = parseInt(p);
          if(Number.isInteger(i) && i < this.data.length && i > -1)
            if(this.data[i].allows(v)) o[p] = v;
            else throw new TypeError(`Value '${v}' is not assignable to type '${this.data[i].name}'`);
          else throw new TypeError(`Cannot modify property '${p}' of '${this.name}'`);
      },
      deleteProperty: (o, p) => {
          throw new TypeError(`Cannot delete property '${p}' of '${this.name}'`);
      }
    })}, t),
    UNDEFINED: new StronglyJSType(undefined),
    NULL: new StronglyJSType(null, 'null', (o) => o === null)
  }
  static get TYPES() {return {...this.#TYPES}}
  static strongProp(on, name, type, value = type.fallback) {
    if(!type.allows(value)) throw new TypeError(`Default value '${value}' is not assignable to type '${type.name}'`);
    Object.defineProperty(on, name, {
      get: function() {
        return type.wrap(value);
      },
      set: function(newValue) {
         if(!type.allows(newValue)) throw new TypeError(`Value '${newValue}' is not assignable to type '${type.name}'`);
         value = newValue;
      }
    });
  }
  static strongFunc(on, name, func, argTypes, returnType) {
    on[name] = function() {
      for(let i = 0; i < argTypes.length; i++) if(!argTypes[i].allows(arguments[i])) throw new TypeError(`Argument '${arguments[i]}' is not assignable to type '${argTypes[i].name}'`);
        let value = func(...arguments);
        if(!returnType.allows(value)) throw new TypeError(`Return value '${value}' is not assignable to type '${returnType.name}'`);
        return value;
    }
  }
}
