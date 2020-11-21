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
  #a; #b; #c;
  constructor(fallback, name = typeof fallback, test = (o) => typeof o === typeof fallback) {
    if(typeof name !== 'string') throw new TypeError(`Cannot convert '${typeof b}' to 'string'`);
    if(typeof test !== 'function') throw new TypeError(`Cannot convert '${typeof c}' to 'string'`);
    this.#a = fallback;
    this.#b = name;
    this.#c = test;
  }
  get fallback() { return this.#a}
  get name() { return this.#b}
  allows(o) {return this.#c(o)}
}
class StronglyJS {
  static #TYPES = {
    __proto__: null,
	NUMBER: new StronglyJSType(0),
	BOOLEAN: new StronglyJSType(false),
	STRING: new StronglyJSType(''),
	FUNCTION: new StronglyJSType(function() {}),
	BIGINT: new StronglyJSType(0n),
	UNDEFINED: new StronglyJSType(undefined),
	SYMBOL: new StronglyJSType(undefined, 'symbol', (o) => typeof o === 'symbol'),
	ARRAY: new StronglyJSType([], 'array', (o) => o instanceof Array),
	REGEXP: new StronglyJSType(/.*/g, 'regexp', (o) => o instanceof RegExp),
	ELEMENT: new StronglyJSType(undefined, 'element', (o) => o instanceof HTMLElement)
  }
  static get TYPES() {return {...this.#TYPES}}
  static strongProp(on, name, strongValue) {
    Object.defineProperty(on, name, {
      get: function() {
        return strongValue;
      },
      set: function(value) {
         if(typeof value !== typeof strongValue) throw new TypeError();
         strongValue = value;
      }
    });
    return on[name];
  }
}
