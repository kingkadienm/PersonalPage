# JavaScript基础

## 语言概述

JavaScript 是一种动态类型、基于原型的多范式语言，主要用于浏览器和 Node.js。ES6(ES2015) 及后续版本带来 let/const、箭头函数、类、模块、Promise 等重大更新。

## 变量声明

```javascript
var a = 1
function f() {
  console.log(a)
  var a = 2
}
f()

let b = 1
const c = 2
{
  let d = 3
  const e = 4
}
```

- var：函数作用域，会提升（声明提升，赋值不提升）
- let/const：块作用域，存在暂时性死区，不允许重复声明
- const 必须初始化，引用类型不可改引用，可改属性

## 数据类型

### 基本类型（值类型）

- number：整数、小数、NaN、Infinity
- string：单引号、双引号、模板字符串
- boolean：true / false
- undefined：未赋值
- null：空引用
- symbol：唯一标识
- bigint：大整数

### 引用类型

- object：普通对象、数组、函数、日期、正则等
- typeof null === 'object'（历史遗留）

### 类型判断与转换

```javascript
typeof 42
typeof []
typeof null
Array.isArray([])
Object.prototype.toString.call([])

Number('123')
String(123)
Boolean(1)
```

## 运算符

- 算术：+ - * / % **
- 比较：== === != !== > < >= <=（推荐 === 避免隐式转换）
- 逻辑：&& || !
- 空值合并：??（仅 null/undefined 取右侧）
- 可选链：?.（属性或方法不存在时短路为 undefined）
- 赋值：= += -= 等
- 展开：...arr、...obj

## 字符串

```javascript
const s = 'Hello World'
s.length
s[0]
s.indexOf('o')
s.slice(0, 5)
s.split(' ')
s.replace('World', 'JS')
s.includes('Hello')
s.repeat(2)
'  ab  '.trim()
```

模板字符串：反引号、${} 插值、可多行。

## 数组

### 创建与基本操作

```javascript
const arr = [1, 2, 3]
const arr2 = new Array(5)
const arr3 = Array.from({ length: 3 }, (_, i) => i)

arr.length
arr.push(4)
arr.pop()
arr.unshift(0)
arr.shift()
arr.splice(1, 1, 'a')
arr.slice(0, 2)
arr.concat([4, 5])
arr.indexOf(2)
arr.includes(2)
arr.reverse()
arr.sort((a, b) => a - b)
```

### 遍历与迭代

```javascript
arr.forEach((item, index) => {})
for (const item of arr) {}
for (let i = 0; i < arr.length; i++) {}
```

### 映射、过滤、归约

```javascript
arr.map(x => x * 2)
arr.filter(x => x > 1)
arr.reduce((acc, cur) => acc + cur, 0)
arr.find(x => x > 1)
arr.findIndex(x => x > 1)
arr.some(x => x > 2)
arr.every(x => x > 0)
arr.flat()
arr.flatMap(x => [x, x * 2])
```

## 对象

### 创建与属性

```javascript
const obj = { a: 1, b: 2 }
const obj2 = new Object()
const key = 'name'
obj[key] = 'Tom'
obj.name
delete obj.a
'a' in obj
Object.keys(obj)
Object.values(obj)
Object.entries(obj)
Object.assign({}, obj)
```

### 解构

```javascript
const { a, b } = obj
const { a: x, b: y } = obj
const { a = 0 } = obj
const [first, ...rest] = arr
```

## 函数

### 定义方式

```javascript
function fn(a, b) {
  return a + b
}

const fn2 = function(a, b) {
  return a + b
}

const fn3 = (a, b) => a + b
const fn4 = (a, b) => {
  return a + b
}
```

### 参数

```javascript
function f(a, b = 0) {}
function g(...args) {}
function h({ a, b }) {}
```

### 箭头函数与 this

- 箭头函数没有自己的 this，继承外层
- 没有 arguments，可用 ...rest
- 不能作为构造函数（无 prototype）

## 条件与循环

```javascript
if (condition) {}
else if (condition) {}
else {}

switch (value) {
  case 1: break
  case 2: break
  default: break
}

while (condition) {}
do {} while (condition)

for (let i = 0; i < 10; i++) {}
for (const key in obj) {}
for (const value of iterable) {}
```

## 异常处理

```javascript
try {
  throw new Error('message')
} catch (e) {
  console.error(e.message)
} finally {
  console.log('cleanup')
}
```

## 异步基础

### 回调

```javascript
setTimeout(() => {}, 1000)
fs.readFile('file.txt', (err, data) => {})
```

### Promise

```javascript
const p = new Promise((resolve, reject) => {
  setTimeout(() => resolve(1), 1000)
})

p.then(value => console.log(value))
  .catch(err => console.error(err))
  .finally(() => {})

Promise.all([p1, p2])
Promise.race([p1, p2])
Promise.resolve(value)
Promise.reject(reason)
```

### async/await

```javascript
async function fetchData() {
  try {
    const res = await fetch(url)
    const data = await res.json()
    return data
  } catch (e) {
    console.error(e)
  }
}
```

## 类（ES6）

```javascript
class Person {
  constructor(name) {
    this.name = name
  }
  sayHi() {
    return `Hi, ${this.name}`
  }
  static create(name) {
    return new Person(name)
  }
}

class Student extends Person {
  constructor(name, grade) {
    super(name)
    this.grade = grade
  }
}
```

## 模块（ES6）

```javascript
// math.js
export const PI = 3.14
export function add(a, b) { return a + b }
export default function multiply(a, b) { return a * b }

// main.js
import multiply, { add, PI } from './math.js'
import * as math from './math.js'
```

## 常用全局与内置

- 全局：console、setTimeout、setInterval、parseInt、parseFloat、isNaN、encodeURIComponent
- 数组/对象/字符串方法见上文
- JSON.parse、JSON.stringify
- Date、Math、Map、Set、WeakMap、WeakSet
