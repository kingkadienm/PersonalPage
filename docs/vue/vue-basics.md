# Vue基础

## 什么是Vue

Vue是一套用于构建用户界面的渐进式JavaScript框架。Vue被设计为可以自底向上逐层应用：核心库只关注视图层，易于上手；配合生态（Vue Router、Vuex、Vue CLI等）可构建复杂单页应用。

特点：响应式数据绑定、组件化开发、虚拟DOM、单文件组件(.vue)、轻量易学。

## 安装与创建项目

```bash
# 通过CDN引入（学习用）
<script src="https://cdn.jsdelivr.net/npm/vue@2/dist/vue.js"></script>

# 通过Vue CLI创建项目（生产用）
npm install -g @vue/cli
vue create my-project
```

## 实例与数据

```javascript
var vm = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!',
    count: 0,
    user: { name: 'Tom', age: 18 }
  }
})

vm.message
vm.count = 1
vm.$data
vm.$el
```

data必须是函数（组件中）返回对象，这样每个组件实例维护独立数据副本。

## 模板语法

### 插值

```html
<span>Message: {{ msg }}</span>
<span v-once>只渲染一次: {{ msg }}</span>
<div v-html="rawHtml"></div>
<div v-bind:id="dynamicId"></div>
<button :disabled="isDisabled">按钮</button>
```

双大括号会将数据解释为普通文本；v-html会输出真正的HTML（注意XSS）；v-once一次渲染后不随数据更新。

### 指令列表

| 指令 | 说明 |
|------|------|
| v-if / v-else-if / v-else | 条件渲染 |
| v-show | 切换display |
| v-for | 列表渲染 |
| v-on / @ | 绑定事件 |
| v-bind / : | 绑定属性 |
| v-model | 双向绑定表单 |
| v-slot / # | 插槽 |
| v-pre | 不编译 |
| v-cloak | 防止闪屏 |

### 修饰符

```html
<button @click.stop="doThis">阻止冒泡</button>
<form @submit.prevent="onSubmit">阻止默认</form>
<input @keyup.enter="submit">
<input v-model.lazy="msg">
<input v-model.number="age">
<input v-model.trim="name">
```

常用：.stop、.prevent、.capture、.self、.once、.passive；按键：.enter、.tab、.delete、.esc、.space、方向键；v-model：.lazy、.number、.trim。

## 计算属性与侦听器

### 计算属性

```javascript
computed: {
  reversedMessage: function () {
    return this.message.split('').reverse().join('')
  },
  fullName: {
    get() {
      return this.firstName + ' ' + this.lastName
    },
    set(value) {
      const names = value.split(' ')
      this.firstName = names[0]
      this.lastName = names[names.length - 1]
    }
  }
}
```

有缓存，依赖不变不会重新计算；适合依赖其它数据派生的数据。

### 侦听器

```javascript
watch: {
  question: function (newVal, oldVal) {
    this.answer = 'Waiting...'
    this.debouncedGetAnswer()
  },
  'obj.a': function (val) {
    console.log('obj.a changed:', val)
  },
  deep: true
}
```

适合执行异步或开销较大的操作；deep可深度监听对象内部变化。

## 条件渲染

```html
<div v-if="type === 'A'">A</div>
<div v-else-if="type === 'B'">B</div>
<div v-else>Not A/B/C</div>

<div v-show="ok">Hello!</div>

<template v-if="loginType === 'username'">
  <label>Username</label>
  <input placeholder="Enter username" key="username">
</template>
<template v-else>
  <label>Email</label>
  <input placeholder="Enter email" key="email">
</template>
```

v-if 切换会销毁/重建元素；v-show 只切换 display。频繁切换用 v-show，很少改变用 v-if。用 key 避免复用导致的状态错乱。

## 列表渲染

```html
<li v-for="(item, index) in items" :key="item.id">
  {{ index }} - {{ item.text }}
</li>

<li v-for="(value, key) in object">
  {{ key }}: {{ value }}
</li>

<li v-for="n in 10">{{ n }}</li>

<div v-for="item in items" :key="item.id">
  <span>{{ item.text }}</span>
</div>
```

key 必须稳定唯一，推荐用 id，不要用 index。可遍历数组、对象、数字范围。

## 事件处理

```html
<button @click="counter += 1">Add 1</button>
<button @click="greet">Greet</button>
<button @click="greet($event)">Greet</button>
<button @click="warn('msg', $event)">Warn</button>
```

方法里可通过参数接收 event；内联可传 $event。修饰符见上文。

## Class 与 Style 绑定

```html
<div :class="{ active: isActive, 'text-danger': hasError }"></div>
<div :class="[activeClass, errorClass]"></div>
<div :class="[isActive ? activeClass : '', errorClass]"></div>
<div :class="{ [activeClass]: isActive }"></div>

<div :style="{ color: activeColor, fontSize: fontSize + 'px' }"></div>
<div :style="[baseStyles, overridingStyles]"></div>
<div :style="{ display: ['-webkit-box', '-ms-flexbox', 'flex'] }"></div>
```

class 和 style 都支持对象、数组、以及对象数组组合；style 的数组可覆盖前面的属性。

## 表单输入绑定

```html
<input v-model="message">
<textarea v-model="message"></textarea>
<input type="checkbox" v-model="checked">
<input type="checkbox" v-model="checkedNames" value="Jack">
<input type="radio" v-model="picked" value="a">
<select v-model="selected">
  <option value="a">A</option>
</select>
<select v-model="selected" multiple>
```

v-model 在 input/textarea 上等价于 :value + @input；checkbox 可绑定布尔或数组；radio、select 绑定选中的 value。

## 组件基础

### 注册

```javascript
Vue.component('button-counter', {
  data: function () {
    return { count: 0 }
  },
  template: '<button @click="count++">Clicked {{ count }} times</button>'
})
```

### Props

```javascript
Vue.component('blog-post', {
  props: ['title', 'likes', 'isPublished', 'commentIds', 'author'],
  props: {
    title: String,
    likes: Number,
    isPublished: Boolean,
    commentIds: Array,
    author: Object,
    callback: Function,
    contactsPromise: Promise
  },
  props: {
    title: {
      type: String,
      required: true
    },
    likes: {
      type: Number,
      default: 0
    }
  }
})
```

props 单向数据流，子组件不要直接修改；需要修改时在子组件用本地 data 或触发事件由父组件改。

### 事件

```javascript
this.$emit('enlarge-text', 0.1)
```

父组件 @enlarge-text="handleEnlarge" 可接收参数。

### 插槽（基础）

```html
<component>
  <p>默认插槽内容</p>
</component>
```

## 生命周期

| 钩子 | 说明 |
|------|------|
| beforeCreate | 实例初始化后，data/methods 未注入 |
| created | 实例创建完成，可访问 data/methods，未挂载 DOM |
| beforeMount | 挂载开始前 |
| mounted | 挂载完成，可访问 $el |
| beforeUpdate | 数据更新导致重渲染前 |
| updated | 虚拟 DOM 重新渲染并应用后 |
| beforeDestroy | 实例销毁前 |
| destroyed | 实例销毁后 |

```javascript
new Vue({
  created() {
    console.log('created')
  },
  mounted() {
    console.log('mounted')
  }
})
```

常用：created 请求数据、mounted 操作 DOM 或第三方库、beforeDestroy 清理定时器/监听。
