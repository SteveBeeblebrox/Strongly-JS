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
class StronglyJS {
  static #TYPES = {
    __proto__: null
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
class StronglyJSType {
  #a; #b; #c;
  constructor(a, b = typeof a, c = (o) => typeof o === typeof a) {
    if(typeof b !== 'string') throw new TypeError(`Cannot convert '${typeof b}' to 'string'`);
    if(typeof c !== 'function') throw new TypeError(`Cannot convert '${typeof c}' to 'string'`);
    this.#a = a;
    this.#b = b;
    this.#c = c;
  }
  get fallback() { return this.#a}
  get name() { return this.#b}
  allows(o) {return this.#c(o)}
}
