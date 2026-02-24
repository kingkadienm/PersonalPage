# React基础

## 什么是React

React 是用于构建用户界面的 JavaScript 库，采用声明式、组件化、单向数据流。核心概念：组件、JSX、虚拟 DOM、状态与属性。配合 React Router、状态管理库、构建工具可构建完整前端应用。

## 环境与创建项目

```bash
npx create-react-app my-app
cd my-app
npm start
```

或 Vite：`npm create vite@latest my-app -- --template react`。

## JSX 语法

- 标签类似 HTML，可嵌入表达式 `{expression}`；属性用 camelCase（如 className、onClick）；必须有一个根元素或 Fragment。
- 条件：`{condition && <A />}`、`{condition ? <A /> : <B />}`。
- 列表：map 返回元素，每个元素需稳定 key（不要用 index 作 key，列表会变时）。

```javascript
const name = 'Tom'
const element = <h1>Hello, {name}</h1>

const list = items.map(item => (
  <li key={item.id}>{item.text}</li>
))
```

## 组件

### 函数组件（推荐）

```javascript
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>
}
```

### 类组件

```javascript
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>
  }
}
```

组件名大写；组件返回单个根元素（或 Fragment <>...</>）。

## Props

- 只读，父传子；可传任意类型（字符串、数字、对象、函数、元素）。
- 解构：`function Welcome({ name, age }) { ... }`。
- 默认值：`Welcome.defaultProps = { name: 'Guest' }` 或函数参数默认值。
- 子元素：通过 props.children 访问。

## State（类组件）

```javascript
class Counter extends React.Component {
  constructor(props) {
    super(props)
    this.state = { count: 0 }
  }

  increment = () => {
    this.setState({ count: this.state.count + 1 })
    this.setState(prev => ({ count: prev.count + 1 }))
  }

  render() {
    return (
      <div>
        <span>{this.state.count}</span>
        <button onClick={this.increment}>+1</button>
      </div>
    )
  }
}
```

setState 可能是异步的，更新依赖前一个 state 时用函数形式。不要直接修改 this.state。

## 事件处理

- 事件名 camelCase（onClick、onChange）。
- 传函数引用：`onClick={handleClick}`，不要 `onClick={handleClick()}`（会立即执行）。
- 阻止默认：e.preventDefault()。
- 传参：`onClick={() => handleClick(id)}` 或 `onClick={handleClick.bind(this, id)}`。

## 条件渲染

- `condition && <A />`
- `condition ? <A /> : <B />`
- 提前 return 不渲染：`if (!isValid) return null`

## 列表与 key

- key 在兄弟间必须唯一且稳定，用于复用与重排；不要用随机数或 index（列表会增删时）。
- key 放在 map 最外层元素上。

## 表单受控组件

```javascript
const [value, setValue] = useState('')
<input
  value={value}
  onChange={e => setValue(e.target.value)}
/>
```

输入值由 state 控制，单一数据源；textarea、select 同理。

## 状态提升

多个组件需要同一份数据时，把 state 放到最近的公共父组件，通过 props 下发，通过回调函数把子组件的变更传回父组件更新 state。

## 组合与继承

- 组合：用 props.children 或自定义 props（如 left、right）插入内容，优于继承。
- React 不推荐用继承扩展组件，用组合和 props 实现复用。

## 生命周期（类组件）

- 挂载：constructor → render → componentDidMount
- 更新：setState/父传新 props → render → componentDidUpdate
- 卸载：componentWillUnmount

常用：componentDidMount 请求数据、订阅；componentWillUnmount 取消订阅、清定时器。

## 函数组件 + Hooks（推荐）

- useState：`const [state, setState] = useState(initial)`。
- useEffect：`useEffect(() => { ... return cleanup }, [deps])`，deps 为空数组只执行一次，不传每次渲染后执行。
- 更多见《React Hooks》文档。

## 注意事项

- 不可变数据：不要直接改 state/props，用新对象或数组（展开运算符、concat、filter 等）。
- 受控与非受控：表单推荐受控；文件输入等可为非受控。
- 避免在 render 中创建新函数/对象导致子组件无谓重渲染，可用 useCallback、useMemo 或把回调定义在组件外。
