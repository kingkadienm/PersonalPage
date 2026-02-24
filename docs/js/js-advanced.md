# JavaScript进阶

## 执行上下文与作用域

- 全局执行上下文、函数执行上下文、eval
- 每个上下文包含：变量对象(VO/活动对象AO)、作用域链、this
- 作用域链由当前环境与上层环境的一系列变量对象组成，用于变量查找
- 词法作用域（静态）：作用域在书写时确定；闭包即函数记住其词法环境

## 闭包

```javascript
function createCounter() {
  let count = 0
  return function() {
    count++
    return count
  }
}
const counter = createCounter()
counter()
counter()
```

闭包 = 函数 + 其词法环境。常用场景：数据私有化、工厂函数、柯里化、防抖节流、循环中绑定正确的变量（用 let 或 IIFE）。

## this 绑定规则

1. 默认绑定：独立调用时，非严格模式指向 global/window，严格模式为 undefined
2. 隐式绑定：作为对象方法调用时指向该对象
3. 显式绑定：call、apply、bind 指定 this
4. new 绑定：构造函数调用时 this 指向新对象

```javascript
function fn() {
  console.log(this)
}
fn.call({ a: 1 })
fn.apply({ a: 1 }, [])
const bound = fn.bind({ a: 1 })
bound()
```

箭头函数不绑定 this，由外层决定；事件回调、定时器中需注意 this 指向。

## 原型与原型链

```javascript
function Person(name) {
  this.name = name
}
Person.prototype.sayHi = function() {
  return this.name
}
const p = new Person('Tom')
p.__proto__ === Person.prototype
Person.prototype.__proto__ === Object.prototype
Object.prototype.__proto__ === null
```

实例通过 __proto__ 指向构造函数的 prototype；查找属性时沿原型链向上直到 Object.prototype。ES6 class 是语法糖，本质仍是原型。

## 继承实现

```javascript
function Child() {
  Parent.call(this)
}
Child.prototype = Object.create(Parent.prototype)
Child.prototype.constructor = Child
```

ES6：class Child extends Parent { constructor() { super() } }

## 事件循环

- 调用栈执行同步代码；遇到异步 API 交给 Web API（或 Node 的 libuv），完成后将回调放入任务队列
- 宏任务：script、setTimeout、setInterval、I/O、UI 渲染
- 微任务：Promise.then/catch/finally、queueMicrotask、MutationObserver
- 每轮从宏任务队列取一个执行，然后清空微任务队列，再渲染（如需要），再取下一个宏任务

```javascript
console.log(1)
setTimeout(() => console.log(2), 0)
Promise.resolve().then(() => console.log(3))
console.log(4)
```

## 设计模式（简述）

- 单例：保证类只有一个实例
- 工厂：封装创建逻辑
- 观察者/发布订阅：解耦事件与处理
- 代理：为对象提供代理以控制访问
- 装饰器：动态给对象增加职责
- 策略：算法可替换
- 迭代器：统一遍历接口

## Proxy 与 Reflect

```javascript
const target = {}
const handler = {
  get(t, prop) {
    return Reflect.get(t, prop) || 0
  },
  set(t, prop, value) {
    if (prop === 'age' && value < 0) throw new Error('invalid')
    return Reflect.set(t, prop, value)
  }
}
const proxy = new Proxy(target, handler)
```

Reflect 方法与 Proxy 陷阱一一对应，用于默认行为的转发和统一错误形式。

## 生成器与迭代器

```javascript
function* gen() {
  yield 1
  yield 2
  return 3
}
const g = gen()
g.next()
g.next()
g.next()

const obj = {
  *[Symbol.iterator]() {
    yield 1
    yield 2
  }
}
[...obj]
```

迭代器协议：next() 返回 { value, done }；可迭代对象有 Symbol.iterator。for...of、展开运算符依赖迭代器。

## 防抖与节流

```javascript
function debounce(fn, delay) {
  let timer
  return function(...args) {
    clearTimeout(timer)
    timer = setTimeout(() => fn.apply(this, args), delay)
  }
}

function throttle(fn, delay) {
  let last = 0
  return function(...args) {
    const now = Date.now()
    if (now - last >= delay) {
      last = now
      fn.apply(this, args)
    }
  }
}
```

防抖：多次触发只执行最后一次。节流：固定时间间隔内只执行一次。用于 resize、scroll、输入联想等。

## 深拷贝

```javascript
function deepClone(obj, cache = new WeakMap()) {
  if (obj === null || typeof obj !== 'object') return obj
  if (cache.has(obj)) return cache.get(obj)
  const copy = Array.isArray(obj) ? [] : {}
  cache.set(obj, copy)
  for (const key of Object.keys(obj)) {
    copy[key] = deepClone(obj[key], cache)
  }
  return copy
}
```

注意循环引用（WeakMap）、Date/RegExp/函数等特殊类型、Symbol 键；生产环境可考虑 structuredClone 或 lodash.cloneDeep。

## 模块化（补充）

- CommonJS：require/module.exports，同步加载，Node 默认
- ES Module：import/export，静态分析，树摇友好
- AMD：define/require，异步，多用于传统浏览器
- UMD：兼容多种规范

## 性能与内存

- 避免全局变量和意外引用导致无法 GC
- 及时解绑事件、清除定时器、取消未完成请求
- 大数组/对象考虑分页、虚拟列表、Web Worker
- 使用 Chrome DevTools Performance/Memory 分析

## 安全

- 避免 eval、innerHTML 直接插不可信数据（XSS）
- 敏感操作需服务端校验（CSRF、权限）
- 密码等敏感数据不存前端，HTTPS 传输
