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
  static valueAsString(o) { try { return `${o}`; } catch { return 'unknown'; } }
  constructor(fallback, name = typeof fallback, test = (o) => typeof o === typeof fallback, wrapper = (o) => o, data = {}) {
    if(typeof name !== 'string') throw new TypeError(`Cannot convert '${StronglyJSType.valueAsString(name)}' to 'string'`);
    if(typeof test !== 'function') throw new TypeError(`Cannot convert '${StronglyJSType.valueAsString(test)}' to 'function'`);
    if(typeof wrapper !== 'function') throw new TypeError(`Cannot convert '${StronglyJSType.valueAsString(wrapper)}' to 'function'`);
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
class StronglyJSTypes {
  static NUMBER = new StronglyJSType(0, 'number', (o) => typeof o === 'number' || o instanceof Number)
  static NUMBERRANGEOF = (a, b) => new StronglyJSType(a, 'number range between ' + a + ' and ' + b, (o) => this.NUMBER.allows(o) && o >= a && o <= b)
  static BIGINT = new StronglyJSType(0n)
  static BIGINTRANGEOF = (a, b) => new StronglyJSType(a, 'bigint range between ' + a + ' and ' + b, (o) => this.BIGINT.allows(o) && o >= a && o <= b)
  static NUMERICAL = new StronglyJSType(0, 'numerical', (o) => typeof o === 'number' || typeof o === 'bigint' || o instanceof Number)
  static NUMERICALRANGEOF = (a, b) => new StronglyJSType(a, 'numerical range between ' + a + ' and ' + b, (o) => this.NUMERICAL.allows(o) && o >= a && o <= b)
  static INTEGER = new StronglyJSType(0, 'integer', Number.isInteger)
  static INTEGERRANGEOF = (a, b) => new StronglyJSType(a, 'integer range between ' + a + ' and ' + b, (o) => this.INTEGER.allows(o) && o >= a && o <= b)
  static BOOLEAN = new StronglyJSType(false, 'boolean', (o) => typeof o === 'boolean' || o instanceof Boolean)
  static STRING = new StronglyJSType('', 'string', (o) => typeof o === 'string' || o instanceof String)
  static CHARACTER = new StronglyJSType('\u0000', 'character', (o) => (typeof o === 'string' || o instanceof String) && o.length === 1)
  static SYMBOL = new StronglyJSType(undefined, 'symbol', (o) => typeof o === 'symbol')
  static ARRAY = new StronglyJSType([], 'array', (o) => o instanceof Array)
  static REGEXP = new StronglyJSType(/.*/g, 'regexp', (o) => o instanceof RegExp)
  static ELEMENT = new StronglyJSType(undefined, 'element', (o) => o instanceof HTMLElement)
  static FUNCTION = new StronglyJSType(function() {})
  static ASYNCFUNCTION = new StronglyJSType(async function() {}, 'async function', (o) => o instanceof (async function () {}).constructor)
  static GENERATORFUNCTION = new StronglyJSType(function*() {}, 'generator function', (o) => o instanceof (function* () {}).constructor)
  static OBJECT = new StronglyJSType({})
  static SIMPLEOBJECT = new StronglyJSType({}, 'simple object', (o) => Object.prototype.isPrototypeOf(o))
  static ANY = new StronglyJSType({}, 'any', (o) => true)
  static ARRAYOF = (t) => new StronglyJSType([], t.name + ' array', (o) => o instanceof Array && o.every((i) => t.allows(i)))
  static NULLABLE = (t) => new StronglyJSType(null, 'nullable ' + t.name, (o) => o === null || t.allows(o))
  static TUPLEOF = (...t) => new StronglyJSType(t.map(o => o.fallback), t.map(o => o.name).join(', ') + ' tuple', (o) => o instanceof Array && t.every((i, n) => i.allows(o[n])),
  function(l) {return new Proxy(l, {
    set: (o, p, v) => {
        let i = parseInt(p);
        if(Number.isInteger(i) && i < this.data.length && i > -1)
          if(this.data[i].allows(v)) o[p] = v;
          else throw new TypeError(`Value '${StronglyJSType.valueAsString(v)}' is not assignable to type '${this.data[i].name}'`);
        else throw new TypeError(`Cannot modify property '${StronglyJSType.valueAsString(p)}' of '${this.name}'`);
    },
    deleteProperty: (o, p) => {
        throw new TypeError(`Cannot delete property '${StronglyJSType.valueAsString(p)}' of '${this.name}'`);
    }
  })}, t)
  static UNDEFINED = new StronglyJSType(undefined)
  static NULL = new StronglyJSType(null, 'null', (o) => o === null)
}
class StronglyJS {
  static defineProperty(on, name, type, value = type.fallback) {
    if(!type.allows(value)) throw new TypeError(`Default value '${StronglyJSType.valueAsString(value)}' is not assignable to type '${type.name}'`);
    Object.defineProperty(on, name, {
      get: function() {
        return type.wrap(value);
      },
      set: function(newValue) {
         if(!type.allows(newValue)) throw new TypeError(`Value '${StronglyJSType.valueAsString(newValue)}' is not assignable to type '${type.name}'`);
         value = newValue;
      }
    });
  }
  static defineFunction(on, name, func, argTypes, returnType) {
    on[name] = function() {
      for(let i = 0; i < argTypes.length; i++) if(!argTypes[i].allows(arguments[i])) throw new TypeError(`Argument '${StronglyJSType.valueAsString(arguments[i])}' is not assignable to type '${argTypes[i].name}'`);
        let value = func(...arguments);
        if(!returnType.allows(value)) throw new TypeError(`Return value '${StronglyJSType.valueAsString(value)}' is not assignable to type '${returnType.name}'`);
        return value;
    }
  }
}
