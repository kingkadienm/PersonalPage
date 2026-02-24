# CSS进阶

## CSS预处理器

### Sass/SCSS

```scss
// 变量
$primary-color: #007bff;
$font-size: 16px;

// 嵌套
.nav {
    ul {
        margin: 0;
        padding: 0;
        list-style: none;
        
        li {
            display: inline-block;
            
            a {
                text-decoration: none;
                color: $primary-color;
                
                &:hover {
                    color: darken($primary-color, 10%);
                }
            }
        }
    }
}

// Mixin
@mixin flex-center {
    display: flex;
    justify-content: center;
    align-items: center;
}

.container {
    @include flex-center;
}

// 继承
%button-base {
    padding: 10px 20px;
    border: none;
    cursor: pointer;
}

.button-primary {
    @extend %button-base;
    background-color: $primary-color;
}
```

## BEM命名规范

```css
/* Block */
.card { }

/* Element */
.card__header { }
.card__body { }
.card__footer { }

/* Modifier */
.card--large { }
.card--highlighted { }
.card__header--bold { }
```

## CSS架构

### OOCSS (面向对象CSS)

```css
/* 结构 */
.button {
    padding: 10px 20px;
    border: none;
    cursor: pointer;
}

/* 皮肤 */
.button-primary {
    background-color: blue;
    color: white;
}

.button-secondary {
    background-color: gray;
    color: black;
}
```

### SMACSS (可扩展模块化CSS)

```css
/* Base */
body { margin: 0; }

/* Layout */
.l-header { }
.l-main { }
.l-footer { }

/* Module */
.button { }
.card { }

/* State */
.is-hidden { display: none; }
.is-active { }

/* Theme */
.theme-dark { }
```

## 性能优化

### 选择器性能

```css
/* 避免 */
div > div > div > p { }

/* 推荐 */
.content p { }
```

### 避免重排和重绘

```css
/* 使用transform代替top/left */
.element {
    transform: translateX(100px);
    /* 而不是 */
    /* left: 100px; */
}

/* 使用will-change提示浏览器 */
.animated {
    will-change: transform;
}
```

### 使用contain属性

```css
.component {
    contain: layout style paint;
}
```

## 现代CSS特性

### CSS Grid高级用法

```css
.container {
    display: grid;
    grid-template-areas:
        "header header header"
        "sidebar main main"
        "footer footer footer";
    grid-template-columns: 200px 1fr 1fr;
    grid-template-rows: auto 1fr auto;
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main { grid-area: main; }
.footer { grid-area: footer; }
```

### CSS自定义属性

```css
:root {
    --spacing-unit: 8px;
    --spacing-xs: calc(var(--spacing-unit) * 1);
    --spacing-sm: calc(var(--spacing-unit) * 2);
    --spacing-md: calc(var(--spacing-unit) * 4);
}

.element {
    margin: var(--spacing-md);
}
```

### 容器查询

```css
@container (min-width: 500px) {
    .card {
        display: grid;
        grid-template-columns: 1fr 1fr;
    }
}
```

## 动画性能

```css
/* 使用transform和opacity */
.animate {
    transform: translateX(100px);
    opacity: 0.5;
    transition: transform 0.3s, opacity 0.3s;
}

/* 避免动画以下属性 */
/* width, height, top, left, margin, padding */
```

## 最佳实践

1. **使用CSS变量**: 提高可维护性
2. **模块化**: 使用BEM或其他命名规范
3. **移动优先**: 从移动端开始设计
4. **性能**: 避免复杂选择器和频繁重排
5. **可访问性**: 考虑颜色对比度和焦点状态
6. **浏览器兼容**: 使用autoprefixer
7. **代码组织**: 按功能模块组织CSS
8. **注释**: 添加必要的注释说明
