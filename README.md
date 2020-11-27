# Strongly-JS ![GitHub](https://img.shields.io/github/license/SteveBeeblebrox/Strongly-JS?style=flat-square) ![GitHub last commit](https://img.shields.io/github/last-commit/SteveBeeblebrox/Strongly-JS?style=flat-square) ![GitHub issues](https://img.shields.io/github/issues-raw/SteveBeeblebrox/Strongly-JS?style=flat-square) ![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/SteveBeeblebrox/Strongly-JS?style=flat-square) ![GitHub contributors](https://img.shields.io/github/contributors/SteveBeeblebrox/Strongly-JS?color=007EC6&style=flat-square) ![GitHub Repo stars](https://img.shields.io/github/stars/SteveBeeblebrox/Strongly-JS?style=flat-square)
Strongly typed functions and variables for vanilla JavaScript
## Built-In Types
### Simple
Simple types are predefined filters that allow certain values.
+ `NUMBER`: This type allows any number (Including `NaN` and `Infinity`).
+ `BIGINT`: This type allows any BigInt object.
+ `NUMERICAL`: This simple type allows any number or BigInt object (Including `NaN` and `Infinity`).
+ `INTEGER`: This type allows any number with no non-zero decimals (Does not allow `NaN` or `Infinity`).
+ `BOOLEAN`: This type allows any true or false value or an expresion that evaluates to true or false.
+ `STRING`: This type simple allows any form of JavaScript string (Literal or object).
+ `SYMBOL`: This type allows any symbol object.
+ `ARRAY`: This type allows an array of any length containing any values.
+ `REGEXP`: This simple type allows any Regexp object (Literal or object).
+ `ELEMENT`: This type allows any HTML DOM Element.
+ `FUNCTION`: This type allows any type of function (Including classes).
+ `ANY`: This type allows any value (Type is not checked).
+ `UNDEFINED`: This simple type allows only `undefined` or no value.
+ `NULL`: This type only allows `null`.
### Complex
Complex types are actually just helper functions that give more control over allowed values. All of the following reuire one (or more) arguments. Complex types can be chained together.
+ `ARRAYOF`: Unlike the `ARRAY` type which allows an array containing any values, the `ARRAYOF` complex type restricts what values the array can contain based off of the type passed to it.
+ `NULLABLE`: This complex type allows `null` or whatever value is passed to it.
## Strongly Typed Functions
### Creation
#### Arguments
## Strongly Typed Parameters
### Creation
#### Arguments
