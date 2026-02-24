# React进阶

## 状态管理

### Redux

```javascript
import { createStore } from 'redux'

function counter(state = { count: 0 }, action) {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 }
    case 'DECREMENT':
      return { count: state.count - 1 }
    default:
      return state
  }
}

const store = createStore(counter)

store.dispatch({ type: 'INCREMENT' })
```

### React-Redux

```javascript
import { connect } from 'react-redux'

const mapStateToProps = state => ({
  count: state.count
})

const mapDispatchToProps = dispatch => ({
  increment: () => dispatch({ type: 'INCREMENT' })
})

export default connect(mapStateToProps, mapDispatchToProps)(Counter)
```

## 路由

### React Router

```javascript
import { BrowserRouter, Route, Link } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <div>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
        </nav>

        <Route exact path="/" component={Home} />
        <Route path="/about" component={About} />
      </div>
    </BrowserRouter>
  )
}
```

## 性能优化

### React.memo

```javascript
const MyComponent = React.memo(function MyComponent({ name }) {
  return <div>{name}</div>
})
```

### useMemo

```javascript
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(a, b)
}, [a, b])
```

### useCallback

```javascript
const memoizedCallback = useCallback(
  () => {
    doSomething(a, b)
  },
  [a, b]
)
```

### 代码分割

```javascript
const OtherComponent = React.lazy(() => import('./OtherComponent'))

function MyComponent() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <OtherComponent />
      </Suspense>
    </div>
  )
}
```

## 高级模式

### 高阶组件(HOC)

```javascript
function withSubscription(WrappedComponent, selectData) {
  return class extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        data: selectData(DataSource, props)
      }
    }

    componentDidMount() {
      DataSource.addChangeListener(this.handleChange)
    }

    componentWillUnmount() {
      DataSource.removeChangeListener(this.handleChange)
    }

    handleChange = () => {
      this.setState({
        data: selectData(DataSource, this.props)
      })
    }

    render() {
      return <WrappedComponent data={this.state.data} {...this.props} />
    }
  }
}
```

### Render Props

```javascript
class Mouse extends React.Component {
  constructor(props) {
    super(props)
    this.state = { x: 0, y: 0 }
  }

  handleMouseMove = (event) => {
    this.setState({
      x: event.clientX,
      y: event.clientY
    })
  }

  render() {
    return (
      <div style={{ height: '100vh' }} onMouseMove={this.handleMouseMove}>
        {this.props.render(this.state)}
      </div>
    )
  }
}

function App() {
  return (
    <Mouse render={({ x, y }) => (
      <h1>The mouse position is ({x}, {y})</h1>
    )} />
  )
}
```

## 错误边界

```javascript
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.log(error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>
    }

    return this.props.children
  }
}
```

## 最佳实践

1. **组件拆分**: 保持组件小而专注
2. **Props类型检查**: 使用PropTypes或TypeScript
3. **避免直接修改state**: 使用setState或useState
4. **key的使用**: 列表渲染时使用唯一key
5. **避免在render中创建函数**: 使用useCallback
6. **合理使用useMemo**: 避免过度优化
7. **代码分割**: 使用React.lazy和Suspense
8. **错误处理**: 使用错误边界捕获组件错误
