# React实战项目

## 项目结构

```
project/
├── src/
│   ├── components/      # 组件
│   │   ├── common/      # 通用组件
│   │   └── features/    # 功能组件
│   ├── pages/          # 页面
│   ├── hooks/          # 自定义Hooks
│   ├── store/          # 状态管理
│   │   ├── slices/     # Redux slices
│   │   └── store.js
│   ├── api/           # API接口
│   ├── utils/         # 工具函数
│   ├── styles/        # 样式文件
│   ├── App.js
│   └── index.js
├── public/
└── package.json
```

## 完整示例：待办应用

### 自定义Hook

```javascript
// hooks/useTodos.js
import { useState, useEffect } from 'react'

export function useTodos() {
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchTodos()
  }, [])

  const fetchTodos = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/todos')
      const data = await response.json()
      setTodos(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const addTodo = async (text) => {
    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      })
      const newTodo = await response.json()
      setTodos([...todos, newTodo])
    } catch (err) {
      setError(err.message)
    }
  }

  return { todos, loading, error, addTodo, fetchTodos }
}
```

### 组件实现

```javascript
// components/TodoList.js
import React from 'react'
import { useTodos } from '../hooks/useTodos'
import TodoItem from './TodoItem'

function TodoList() {
  const { todos, loading, error } = useTodos()

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <ul>
      {todos.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  )
}
```

### Redux Toolkit

```javascript
// store/slices/todosSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export const fetchTodos = createAsyncThunk(
  'todos/fetchTodos',
  async () => {
    const response = await fetch('/api/todos')
    return response.json()
  }
)

const todosSlice = createSlice({
  name: 'todos',
  initialState: {
    items: [],
    loading: false,
    error: null
  },
  reducers: {
    addTodo: (state, action) => {
      state.items.push(action.payload)
    },
    toggleTodo: (state, action) => {
      const todo = state.items.find(t => t.id === action.payload)
      if (todo) todo.completed = !todo.completed
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  }
})

export const { addTodo, toggleTodo } = todosSlice.actions
export default todosSlice.reducer
```

## 最佳实践总结

### 1. 组件设计

- **函数组件**: 优先使用函数组件和Hooks
- **组件拆分**: 保持组件小而专注
- **Props类型**: 使用PropTypes或TypeScript
- **Memo优化**: 合理使用React.memo

### 2. 状态管理

- **本地状态**: useState处理组件内部状态
- **共享状态**: Context或Redux
- **服务器状态**: React Query或SWR

### 3. 性能优化

- **代码分割**: React.lazy和Suspense
- **Memoization**: useMemo和useCallback
- **虚拟列表**: react-window处理长列表
- **图片优化**: 使用懒加载和WebP

### 4. 测试策略

- **单元测试**: Jest测试工具函数
- **组件测试**: React Testing Library
- **E2E测试**: Cypress或Playwright
