# Strongly-JS ![GitHub](https://img.shields.io/github/license/SteveBeeblebrox/Strongly-JS?style=flat-square) ![GitHub last commit](https://img.shields.io/github/last-commit/SteveBeeblebrox/Strongly-JS?style=flat-square) ![GitHub issues](https://img.shields.io/github/issues-raw/SteveBeeblebrox/Strongly-JS?style=flat-square) ![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/SteveBeeblebrox/Strongly-JS?style=flat-square) ![GitHub contributors](https://img.shields.io/github/contributors/SteveBeeblebrox/Strongly-JS?color=007EC6&style=flat-square) ![GitHub Repo stars](https://img.shields.io/github/stars/SteveBeeblebrox/Strongly-JS?style=flat-square)
Strongly typed functions and variables for vanilla JavaScript
## Types
### Built-In Types
#### Simple
Simple types are predefined filters that allow certain values.
+ `NUMBER`: This type allows any number (Including `NaN` and `Infinity`).
+ `BIGINT`: This type allows any BigInt object.
+ `NUMERICAL`: This simple type allows any number or BigInt object (Including `NaN` and `Infinity`).
+ `INTEGER`: This type allows any number with no non-zero decimals (Does not allow `NaN` or `Infinity`).
+ `BOOLEAN`: This type allows any true or false value or an expresion that evaluates to true or false.
+ `STRING`: This simple type allows any form of JavaScript string (Literal or object).
+ `CHARACTER`: This type allows any form of JavaScript string (Literal or object) with a length of 1.
+ `SYMBOL`: This type allows any symbol object.
+ `ARRAY`: This type allows an array of any length containing any values.
+ `REGEXP`: This simple type allows any Regexp object (Literal or object).
+ `ELEMENT`: This type allows any HTML DOM Element.
+ `FUNCTION`: This type allows any type of function (Including classes).
+ `ASYNCFUNCTION`: This type allows any async function.
+ `GENERATORFUNCTION`: This type allows any generator function.
+ `OBJECT`: This type allows any object.
+ `SIMPLEOBJECT`: This type allows any object that has the default object prototype somewhere in its prototype chain. This means the object will have methods like `toString` (unless they were deleted).
+ `ANY`: This type allows any value (Type is not checked).
+ `UNDEFINED`: This simple type allows only `undefined` or no value.
+ `NULL`: This type only allows `null`.
#### Complex
Complex types are actually just helper functions that give more control over allowed values. All of the following reuire one (or more) arguments. Complex types can be chained together.
+ `ARRAYOF`: Unlike the `ARRAY` type which allows an array containing any values, the `ARRAYOF` complex type restricts what values the array can contain based off of the type passed to it. In addition to reassigning the whole array, other operations such as modifiying part of it at an index are also subject to type checking.
+ `NULLABLE`: This complex type allows `null` or whatever value is passed to it.
+ `TUPLEOF`: The tuple restricts the types of values in an array and keeps the length fixed. Additionally, unlike the `ARRAYOF` type, each value in a tuple can be assigned a seperate type. This is achieved by passing the types (in order) to the complex type. In addition to reassigning the whole array, other operations such as modifiying part of the tuple at an index are also subject to type checking.
+ `NUMBERRANGEOF`: This type allows any value that is a valid `NUMBER` value and is also between the two arguments inclusively.
+ `BIGINTRANGEOF`: This type allows any value that is a valid `BIGINT` value and is also between the two arguments inclusively.
+ `NUMERICALRANGEOF`: This type allows any value that is a valid `NUMERICAL` value and is also between the two arguments inclusively.
+ `INTEGERRANGEOF`: This type allows any value that is a valid `INTEGER` and is also between the two arguments inclusively.
### Custom Types
#### Creation
Strongly JS allows users to define new types in addition to the built-in types above. New types are created through the `StronglyJSType` constructor.
#### Arguments
+ `fallback`: This argument is the default value for a Strongly typed property.
+ `name`: This argument is the name of the type as a string. The name will show up in error messages.
+ `test`: This is a function used to determine if a value is allowed for this type. It is given the value in question and should return true or false depending on if that value is allowed for this type.
+ `wrapper`: This argument is a function that can be used to wrap or modify the result of getting the value of any property or function of this type. It is given the original value as a single parameter and should return the new value. The wrapper argument can be used with Proxys to control operations on the values within a strongly typed variable.
+ `data`: The data argument can be used to store whatever other information about the type may be needed. This argument should be an object. Other function passed in the constructor that need to access the data should use the function syntax instead of the lambda syntax so they have access to `this`.  
  
Not all of these arguments are needed. In most cases only `fallback`, `name`, and `test` are required to make a type (`wrapper` and `data` are usually used in things like the `TUPLEOF` type where values inside the object must be managed as well as the object itself).
## Strongly Typed Functions
### Creation
Strongly typed functions can be created using the static method `defineFunction` inside of `StronglyJS`.
### Arguments
+ `on`: This argument is the object to define the function on. `globalThis` can be used here to define a global function.
+ `name`: This argument is the name of the function to define as a string.
+ `func`: This is the actual body of the function as a lambda or function.
+ `argTypes`: The argument types are an array of StronglyJSTypes in the order that they should be passed to the function.
+ `returnType`: The return type is a StronglyJSType that the function should return.
## Strongly Typed Properties
Strongly typed properties can be created using the static method `defineProperty` inside of `StronglyJS`.
### Creation
### Arguments
+ `on`: This argument is the object to define the property on. `globalThis` can be used here to define a global property.
+ `name`: This argument is the name of the property to define as a string.
+ `type`: This is the StronglyJSType of the property.
+ `value`: This optional argument specifies a starting value for this property. If not provided, the property's type's default value is used.
