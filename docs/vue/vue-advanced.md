# Vue进阶

## 组件深入

### 组件通信方式汇总

| 方式 | 场景 |
|------|------|
| props / $emit | 父子 |
| $refs | 父访问子实例 |
| $parent / $children | 父子（不推荐） |
| provide / inject | 祖先-后代 |
| 事件总线 $bus | 任意组件（简单项目） |
| Vuex | 全局状态 |

### 父子通信

```javascript
// 父
<child :msg="parentMsg" @update:msg="parentMsg = $event" />

// 子
props: ['msg'],
methods: {
  update() {
    this.$emit('update:msg', 'new value')
  }
}
```

.sync 修饰符：`:msg.sync="parentMsg"` 等价于 `:msg="parentMsg" @update:msg="parentMsg = $event"`。

### provide / inject

```javascript
// 祖先
provide() {
  return {
    theme: this.theme,
    getTheme: () => this.theme
  }
}

// 后代
inject: ['theme', 'getTheme']
```

适合主题、国际化等跨多层传递；注意 provide 默认非响应式，需要传 getter 或响应式对象。

### Vuex 状态管理

```javascript
// store/index.js
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    count: 0,
    user: null
  },
  getters: {
    doubleCount: state => state.count * 2,
    isLoggedIn: state => !!state.user
  },
  mutations: {
    increment(state, payload) {
      state.count += (payload && payload.amount) || 1
    },
    setUser(state, user) {
      state.user = user
    }
  },
  actions: {
    incrementAsync({ commit }, payload) {
      setTimeout(() => commit('increment', payload), 1000)
    },
    async fetchUser({ commit }) {
      const user = await api.getUser()
      commit('setUser', user)
    }
  },
  modules: {
    cart: cartModule
  }
})
```

规则：mutation 同步改 state，action 里可异步再 commit mutation；组件中 mapState、mapGetters、mapActions、mapMutations 简化使用。

## 插槽详解

### 默认插槽与具名插槽

```html
<!-- 子组件 -->
<div class="container">
  <header>
    <slot name="header"></slot>
  </header>
  <main>
    <slot></slot>
  </main>
  <footer>
    <slot name="footer"></slot>
  </footer>
</div>

<!-- 父组件 -->
<my-layout>
  <template #header><h1>标题</h1></template>
  <p>主体内容</p>
  <template #footer><p>页脚</p></template>
</my-layout>
```

### 作用域插槽

```html
<!-- 子组件 -->
<slot :user="user" :text="user.name"></slot>

<!-- 父组件 -->
<current-user>
  <template v-slot:default="slotProps">
    {{ slotProps.user.name }}
  </template>
</current-user>

<current-user v-slot="{ user }">
  {{ user.name }}
</current-user>
```

子组件在 slot 上绑定数据，父组件通过 v-slot 接收并使用，适合列表项自定义渲染等。

## 动态组件与 keep-alive

```html
<component :is="currentTabComponent"></component>

<keep-alive>
  <component :is="currentTabComponent"></component>
</keep-alive>

<keep-alive include="TabA,TabB" exclude="TabC" :max="10">
  <component :is="currentTab"></component>
</keep-alive>
```

:is 可以是组件名或组件选项对象。keep-alive 缓存不活动的组件实例，避免重复渲染；include/exclude 用组件 name，max 限制缓存数量。

## 自定义指令

```javascript
Vue.directive('focus', {
  inserted(el) {
    el.focus()
  }
})

Vue.directive('pin', {
  bind(el, binding) {
    el.style.position = 'fixed'
    el.style.top = binding.value + 'px'
  },
  update(el, binding) {
    el.style.top = binding.value + 'px'
  }
})
```

钩子：bind、inserted、update、componentUpdated、unbind。binding 包含 name、value、oldValue、arg、modifiers。

## 过滤器（Vue 2）

```javascript
filters: {
  capitalize: function (value) {
    if (!value) return ''
    value = value.toString()
    return value.charAt(0).toUpperCase() + value.slice(1)
  }
}
```

```html
{{ message | capitalize }}
```

Vue 3 已移除，可用方法或计算属性替代。

## Vue Router

### 基础配置

```javascript
const routes = [
  { path: '/', component: Home },
  { path: '/about', component: About },
  { path: '/user/:id', component: User, props: true },
  {
    path: '/dashboard',
    component: Dashboard,
    meta: { requiresAuth: true },
    children: [
      { path: 'profile', component: Profile }
    ]
  }
]

const router = new VueRouter({
  routes,
  mode: 'history',
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { selector: to.hash }
    return { x: 0, y: 0 }
  }
})
```

### 导航与传参

```javascript
this.$router.push('/user/123')
this.$router.push({ name: 'user', params: { id: 123 } })
this.$router.push({ path: '/user', query: { id: 123 } })
this.$router.replace(...)
this.$router.go(-1)

this.$route.params.id
this.$route.query.id
this.$route.meta
```

### 导航守卫

```javascript
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isAuthenticated()) {
    next('/login')
  } else {
    next()
  }
})

router.afterEach((to, from) => {
  // 无 next
})

// 组件内
beforeRouteEnter(to, from, next) {
  next(vm => {
    // 通过 vm 访问组件实例
  })
},
beforeRouteUpdate(to, from, next) { next() },
beforeRouteLeave(to, from, next) { next() }
```

## 混入（mixin）

```javascript
const myMixin = {
  data() {
    return { mixinMsg: 'mixin' }
  },
  created() {
    console.log('mixin created')
  },
  methods: {
    mixinMethod() {}
  }
}

new Vue({
  mixins: [myMixin],
  created() {
    console.log('component created')
  }
})
```

合并策略：data、methods 等以组件为准；生命周期钩子会都执行，先 mixin 后组件。命名冲突、多 mixin 时需注意顺序和可读性，复杂逻辑更推荐组合式函数或 Vue 3 Composition API。

## 插件

```javascript
const MyPlugin = {
  install(Vue, options) {
    Vue.prototype.$myMethod = function () {}
    Vue.directive('my-directive', {})
    Vue.mixin({ ... })
    Vue.component('MyComponent', { ... })
  }
}
Vue.use(MyPlugin, { someOption: true })
```

## 渲染函数与 JSX

```javascript
render(h) {
  return h('div', { class: 'wrapper' }, [
    h('h1', this.title),
    this.items.map(item => h('p', item.text))
  ])
}
```

用于需要完全编程式控制渲染时；也可在项目内配置 JSX 编写 render。

## 性能优化

- 路由懒加载：`component: () => import('./views/About.vue')`
- v-if / v-show 按需选用；长列表用虚拟滚动
- 合理使用 keep-alive 缓存页面
- 大列表或复杂表用 Object.freeze 避免响应式开销
- 事件、定时器在 beforeDestroy 中清理
- 使用生产构建、按需引入大型库

## 最佳实践小结

- 组件命名：多词、见名知意
- Props 定义类型和默认值，避免直接修改
- 事件名用 kebab-case
- 列表渲染始终写 key，且用稳定唯一 id
- 异步请求放 action 或 created/mounted，按需在 beforeDestroy 取消
- 大型应用用 Vuex 模块化、命名空间
- 表单用 v-model + 修饰符，复杂校验可配合 VeeValidate 等
