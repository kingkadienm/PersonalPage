# CSS基础

## 概述

CSS（层叠样式表）用于描述 HTML 的呈现：布局、颜色、字体、动画等。层叠指多条规则可作用于同一元素，通过选择器优先级和顺序决定最终样式。

## 引入方式

- 内联：`<div style="color: red">`
- 内部：`<style>...</style>`
- 外部：`<link rel="stylesheet" href="style.css">`
- @import：在 CSS 内 `@import url('other.css');`（少用，影响加载）

## 选择器

### 基本选择器

- 元素：`p {}`
- 类：`.classname {}`
- ID：`#id {}`
- 通配：`* {}`
- 属性：`[attr]`、`[attr=val]`、`[attr^=val]`、`[attr$=val]`、`[attr*=val]`

### 组合选择器

- 后代：`A B`
- 子：`A > B`
- 相邻兄弟：`A + B`
- 通用兄弟：`A ~ B`

### 伪类（状态/位置）

- 链接：`:link`、`:visited`、`:hover`、`:active`
- 结构：`:first-child`、`:last-child`、`:nth-child(n)`、`:nth-of-type(n)`、`:not(selector)`
- 表单：`:focus`、`:checked`、`:disabled`、`:valid`、`:invalid`

### 伪元素

- `::before`、`::after`（需 content）
- `::first-line`、`::first-letter`、`::selection`

### 优先级（从低到高）

内联 > ID > 类/属性/伪类 > 元素/伪元素；同级别按出现顺序后覆盖前；!important 最高（慎用）。

## 盒模型

- 内容 content、内边距 padding、边框 border、外边距 margin。
- box-sizing：content-box（默认，width/height 只含 content）；border-box（含 padding、border）。
- 块级：独占一行，可设宽高；行内：不独占，宽高无效；inline-block：行内但可设宽高。
- margin 折叠：相邻块级元素垂直 margin 会合并。

## 常用单位

- px、em（相对当前元素或继承的 font-size）、rem（相对根 font-size）。
- %：相对父元素对应属性（宽高、字体等）。
- vw、vh、vmin、vmax：视口比例。
- 无单位：line-height 数字、animation-delay 的 0。

## 文本与字体

- font-family、font-size、font-weight、font-style、line-height。
- text-align、text-decoration、text-indent、letter-spacing、word-spacing、white-space。
- color、direction、writing-mode。

## 背景

- background-color、background-image、background-repeat、background-position、background-size（cover/contain/具体值）。
- background-attachment：scroll/fixed。
- 多背景：逗号分隔多组值。

## 布局

### 文档流与定位

- position: static（默认）、relative（相对自身）、absolute（相对最近非 static 祖先）、fixed（相对视口）、sticky（滚动到阈值后固定）。
- top/right/bottom/left 对 non-static 生效；z-index 控制层叠。

### Flexbox

- 容器：display: flex；flex-direction（row/column）；flex-wrap；justify-content；align-items；align-content（多行）；gap。
- 项目：flex-grow、flex-shrink、flex-basis；flex 简写；align-self；order。

### Grid

- 容器：display: grid；grid-template-columns/rows；gap；align-items；justify-items；place-content。
- 项目：grid-column/row（span n 或起止线）；grid-area。

## 过渡与动画

- transition: property duration timing-function delay。
- @keyframes name { from {} to {} } 或 0% 100%。
- animation: name duration timing-function delay iteration-count direction fill-mode。

## 响应式与媒体查询

```css
@media (max-width: 768px) {
  .sidebar { display: none; }
}
@media (min-width: 769px) and (max-width: 1024px) {
  .container { width: 90%; }
}
```

常用：min-width、max-width、orientation、prefers-reduced-motion。

## 变量（自定义属性）

```css
:root {
  --primary: #007bff;
  --spacing: 8px;
}
.box {
  color: var(--primary);
  margin: var(--spacing);
}
```

## 常用技巧

- 居中：flex（justify-content + align-items）或 grid（place-items: center）或 position + transform。
- 清除浮动：父级 overflow: hidden 或 ::after { clear: both }。
- 单行省略：overflow: hidden; text-overflow: ellipsis; white-space: nowrap;。
- 多行省略：-webkit-line-clamp + display: -webkit-box + -webkit-box-orient: vertical。
