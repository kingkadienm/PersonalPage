# Go基础

## 语言概述

Go 是静态类型、编译型语言，语法简洁，内置并发（goroutine、channel），适合后端服务、云原生与工具开发。

## 环境与运行

```bash
go version
go run main.go
go build -o app
go mod init example.com/app
go get package
```

## 变量与常量

```go
var a int = 1
var b = 2
c := 3

var d, e int = 4, 5
f, g := 6, "six"

const Pi = 3.14
const (
    A = 1
    B = 2
)
const (
    X = iota
    Y
    Z
)
```

:= 用于函数内；常量可用 iota 递增。

## 基本类型

- 整型：int、int8、int16、int32、int64、uint 等
- 浮点：float32、float64
- 复数：complex64、complex128
- 布尔：bool
- 字符串：string（只读字节切片）
- 字节：byte（uint8）、rune（int32，Unicode 码点）

类型转换：`int32(x)`，需显式转换。

## 字符串操作

```go
s := "hello"
len(s)
s[0]
s[1:4]
"he" + "llo"
strings.Contains(s, "ell")
strings.Split(s, "l")
strings.Join([]string{"a", "b"}, ",")
strings.Replace(s, "l", "L", -1)
strconv.Itoa(42)
strconv.Atoi("42")
```

## 数组与切片

```go
var arr [5]int
arr := [5]int{1, 2, 3}
arr := [...]int{1, 2, 3}

slice := []int{1, 2, 3}
slice := make([]int, 5, 10)
len(slice)
cap(slice)
slice = append(slice, 4)
copy(dst, src)
```

数组长度固定、值类型；切片动态、引用类型。切片底层是数组，注意共享底层导致的修改影响。

## 映射

```go
m := map[string]int{"a": 1, "b": 2}
m := make(map[string]int)
m["a"] = 1
v, ok := m["a"]
delete(m, "a")
```

未存在的 key 返回零值；用 ok 判断是否存在。

## 控制流

```go
if x > 0 {
}

if v, err := f(); err != nil {
}

for i := 0; i < 10; i++ {
}

for k, v := range m {
}

for {
    break
    continue
}
```

没有 while，用 for 替代；range 可遍历切片、映射、通道。

## 函数

```go
func add(a, b int) int {
    return a + b
}

func div(a, b int) (int, error) {
    if b == 0 {
        return 0, errors.New("division by zero")
    }
    return a / b, nil
}

func sum(nums ...int) int {
    total := 0
    for _, n := range nums {
        total += n
    }
    return total
}
```

多返回值、命名返回值、可变参数；错误通常作为最后一个返回值。

## 方法

```go
type Point struct{ X, Y float64 }

func (p Point) Distance() float64 {
    return math.Sqrt(p.X*p.X + p.Y*p.Y)
}

func (p *Point) Scale(f float64) {
    p.X *= f
    p.Y *= f
}
```

值接收者 vs 指针接收者：需修改或结构体大时用指针；接口满足时值/指针有区别。

## 结构体

```go
type Person struct {
    Name string
    Age  int
}

p := Person{Name: "Tom", Age: 18}
p.Name
pp := &p
pp.Age
```

结构体是值类型；嵌入（匿名字段）实现组合。

## 接口

```go
type Writer interface {
    Write([]byte) (int, error)
}

var w Writer = os.Stdout
```

接口是方法集合；类型无需显式声明实现某接口，只要方法匹配即可（隐式实现）。空接口 interface{} 可接受任意类型（Go 1.18+ 可用 any）。

## 错误处理

```go
if err != nil {
    return err
}

if errors.Is(err, ErrNotFound) {
}

var e *MyError
if errors.As(err, &e) {
}
```

不要忽略错误；errors.Is、errors.As 用于错误判断与包装。

## 并发

### Goroutine

```go
go doSomething()
```

### Channel

```go
ch := make(chan int)
ch := make(chan int, 10)

ch <- 1
v := <-ch
close(ch)

for v := range ch {
}
```

无缓冲 channel 同步收发；有缓冲可暂存。关闭后仍可接收剩余值，再接收得零值并 ok==false。

### Select

```go
select {
case v := <-ch1:
case ch2 <- 1:
case <-time.After(time.Second):
default:
}
```

用于多 channel 的等待与超时。

## 包与可见性

- 首字母大写：包外可见；小写：包内可见。
- 每个目录一个包；import 路径与 go.mod 中模块路径一致。
- init() 在包被引用时自动执行。
