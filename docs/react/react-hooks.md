# React Hooks

## 为什么用 Hooks

- 在函数组件中使用 state 与生命周期，避免类组件的 this 与繁琐生命周期。
- 逻辑复用通过自定义 Hook 抽取，替代 HOC 与 render props。
- 更细粒度的状态与 effect，便于理解和测试。

## useState

```javascript
const [state, setState] = useState(initialState)
setState(newState)
setState(prev => prev + 1)
```

- initialState 可以是值或函数（惰性初始化，仅首次执行）。
- 更新函数形式用于依赖前一次 state；多次 setState 在事件处理中可能被合并。
- 对象/数组更新需不可变，用展开或新引用。

## useEffect

```javascript
useEffect(() => {
  // 副作用
  return () => { /* 清理 */ }
}, [dep1, dep2])
```

- 默认每次渲染后执行；依赖数组为空 [] 仅挂载后执行一次；不传依赖则每次执行。
- 清理函数在下次 effect 前或组件卸载时执行；常用于订阅、定时器、手动 DOM 监听。
- 依赖要写全，否则易出现闭包陈旧值或多余执行；lint 规则会提示。

## useContext

```javascript
const ThemeContext = createContext(defaultValue)
const value = useContext(ThemeContext)
```

- 消费最近一层 Provider 的 value；无 Provider 时用 defaultValue。
- value 变化会导致所有消费者重渲染；可拆 Provider 或配合 memo/useMemo 优化。

## useReducer

```javascript
const [state, dispatch] = useReducer(reducer, initialArg, init)
```

- 适合 state 结构复杂或更新逻辑多的情况；dispatch 稳定，便于向下传递。
- init 为可选初始化函数：state = init(initialArg)。

## useCallback

```javascript
const fn = useCallback(() => { doSomething(a, b) }, [a, b])
```

- 返回记忆化回调；依赖不变则引用不变，用于避免子组件因回调引用变化而重渲染。
- 依赖要完整；过度使用反而增加记忆成本。

## useMemo

```javascript
const value = useMemo(() => compute(a, b), [a, b])
```

- 记忆化计算结果；依赖不变则返回上次结果。
- 用于昂贵计算或稳定引用（如传给子组件的对象/数组）；不要所有计算都包一层。

## useRef

```javascript
const ref = useRef(initialValue)
ref.current
```

- 可变引用，变更 current 不触发重渲染。
- 用途：DOM 引用、保存上一次值、保存定时器/订阅 ID 等。
- forwardRef 可转发 ref 到子组件。

## useImperativeHandle

```javascript
useImperativeHandle(ref, () => ({
  focus: () => { inputRef.current.focus() }
}), [])
```

- 与 forwardRef 配合，自定义暴露给父组件的实例方法，而不是直接暴露 DOM。

## useLayoutEffect

- 与 useEffect 签名相同，但同步在 DOM 变更后、浏览器绘制前执行。
- 用于需要同步读取布局或避免闪烁的 DOM 操作；避免在内部做耗时逻辑阻塞绘制。

## 自定义 Hook

- 以 use 开头的函数，内部可调用其它 Hook；用于抽取有状态逻辑。
- 每次调用拥有独立 state；可接收参数、返回状态与操作方法。

```javascript
function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth)
  useEffect(() => {
    const handler = () => setWidth(window.innerWidth)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])
  return width
}
```

## 规则与注意

- 只在顶层调用 Hook，不在条件、循环或嵌套函数中调用。
- 只在 React 函数组件或自定义 Hook 中调用。
- 自定义 Hook 间可组合；依赖数组要如实填写，便于正确执行与清理。
