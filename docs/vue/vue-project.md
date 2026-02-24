# Vue实战项目

## 项目结构

```
project/
├── src/
│   ├── assets/          # 静态资源
│   ├── components/      # 组件
│   │   ├── common/      # 通用组件
│   │   └── business/    # 业务组件
│   ├── views/           # 页面
│   ├── router/          # 路由配置
│   ├── store/           # 状态管理
│   │   ├── modules/     # 模块化store
│   │   └── index.js
│   ├── api/            # API接口
│   ├── utils/           # 工具函数
│   ├── styles/         # 样式文件
│   ├── App.vue
│   └── main.js
├── public/
└── package.json
```

## 完整示例：Todo应用

### 组件设计

```vue
<!-- TodoItem.vue -->
<template>
  <div class="todo-item" :class="{ completed: todo.completed }">
    <input
      type="checkbox"
      :checked="todo.completed"
      @change="toggleTodo"
    />
    <span class="todo-text">{{ todo.text }}</span>
    <button @click="deleteTodo">删除</button>
  </div>
</template>

<script>
export default {
  name: 'TodoItem',
  props: {
    todo: {
      type: Object,
      required: true
    }
  },
  methods: {
    toggleTodo() {
      this.$emit('toggle', this.todo.id)
    },
    deleteTodo() {
      this.$emit('delete', this.todo.id)
    }
  }
}
</script>
```

### 状态管理

```javascript
// store/modules/todos.js
export default {
  namespaced: true,
  state: {
    todos: []
  },
  mutations: {
    ADD_TODO(state, todo) {
      state.todos.push(todo)
    },
    TOGGLE_TODO(state, id) {
      const todo = state.todos.find(t => t.id === id)
      if (todo) {
        todo.completed = !todo.completed
      }
    },
    DELETE_TODO(state, id) {
      state.todos = state.todos.filter(t => t.id !== id)
    }
  },
  actions: {
    addTodo({ commit }, text) {
      const todo = {
        id: Date.now(),
        text,
        completed: false
      }
      commit('ADD_TODO', todo)
    }
  },
  getters: {
    completedTodos: state => state.todos.filter(t => t.completed),
    activeTodos: state => state.todos.filter(t => !t.completed)
  }
}
```

### API封装

```javascript
// api/todos.js
import axios from 'axios'

const api = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 10000
})

export default {
  getTodos() {
    return api.get('/todos')
  },
  createTodo(todo) {
    return api.post('/todos', todo)
  },
  updateTodo(id, todo) {
    return api.put(`/todos/${id}`, todo)
  },
  deleteTodo(id) {
    return api.delete(`/todos/${id}`)
  }
}
```

## 最佳实践总结

### 1. 组件设计原则

- **单一职责**: 每个组件只做一件事
- **可复用性**: 提取通用逻辑为组件
- **Props验证**: 始终定义props类型
- **事件命名**: 使用kebab-case

### 2. 状态管理策略

- **组件状态**: 仅组件使用的状态放在组件内
- **共享状态**: 使用Vuex管理
- **服务器状态**: 使用Vuex actions处理

### 3. 性能优化

- **v-if vs v-show**: 频繁切换用v-show
- **key的使用**: 列表使用唯一key
- **计算属性缓存**: 复杂计算使用computed
- **异步组件**: 路由懒加载

### 4. 代码组织

- **模块化**: 按功能拆分模块
- **命名规范**: 统一命名风格
- **注释文档**: 关键逻辑添加注释
- **类型检查**: 使用TypeScript或PropTypes

## 路由与权限

```javascript
// router/index.js
const routes = [
  { path: '/login', component: Login },
  {
    path: '/admin',
    component: Layout,
    meta: { requiresAuth: true, roles: ['admin'] },
    children: [
      { path: 'users', component: UserList }
    ]
  }
]

router.beforeEach((to, from, next) => {
  const token = store.getters.token
  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else if (to.meta.roles && !to.meta.roles.includes(store.getters.role)) {
    next('/403')
  } else {
    next()
  }
})
```

## 请求封装与错误处理

```javascript
// api/request.js
import axios from 'axios'

const instance = axios.create({
  baseURL: process.env.VUE_APP_BASE_URL,
  timeout: 10000
})

instance.interceptors.request.use(config => {
  config.headers.Authorization = `Bearer ${getToken()}`
  return config
})

instance.interceptors.response.use(
  res => res.data,
  err => {
    if (err.response?.status === 401) {
      clearToken()
      router.push('/login')
    }
    return Promise.reject(err)
  }
)
```

## 环境与构建

- 环境变量：.env、.env.production；VUE_APP_ 前缀可在代码中访问。
- 生产构建：vue-cli-service build；可配置 splitChunks、cdn、gzip。
- 部署：静态资源可部署到 CDN；History 模式需服务端 fallback 到 index.html。
