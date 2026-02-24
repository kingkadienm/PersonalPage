# Go进阶

## 接口深入

### 空接口

```go
var i interface{}
i = 42
i = "hello"
i = true

// 类型断言
if str, ok := i.(string); ok {
    fmt.Println("String:", str)
}

// 类型开关
switch v := i.(type) {
case int:
    fmt.Println("Integer:", v)
case string:
    fmt.Println("String:", v)
default:
    fmt.Println("Unknown type")
}
```

### 接口组合

```go
type Reader interface {
    Read([]byte) (int, error)
}

type Writer interface {
    Write([]byte) (int, error)
}

type ReadWriter interface {
    Reader
    Writer
}
```

## 反射

```go
import "reflect"

type Person struct {
    Name string
    Age  int
}

func inspect(v interface{}) {
    t := reflect.TypeOf(v)
    v := reflect.ValueOf(v)
    
    for i := 0; i < t.NumField(); i++ {
        field := t.Field(i)
        value := v.Field(i)
        fmt.Printf("%s: %v\n", field.Name, value.Interface())
    }
}
```

## 上下文(Context)

```go
import (
    "context"
    "time"
)

// 创建上下文
ctx := context.Background()
ctx, cancel := context.WithTimeout(ctx, 5*time.Second)
defer cancel()

// 传递上下文
func process(ctx context.Context) {
    select {
    case <-ctx.Done():
        fmt.Println("Context cancelled")
        return
    case <-time.After(2 * time.Second):
        fmt.Println("Processing complete")
    }
}
```

## 错误处理最佳实践

```go
// 自定义错误类型
type MyError struct {
    Code    int
    Message string
}

func (e *MyError) Error() string {
    return fmt.Sprintf("Error %d: %s", e.Code, e.Message)
}

// 错误包装
func doSomething() error {
    err := someOperation()
    if err != nil {
        return fmt.Errorf("doSomething failed: %w", err)
    }
    return nil
}

// 错误检查
if err != nil {
    if errors.Is(err, ErrNotFound) {
        // 处理特定错误
    }
    var myErr *MyError
    if errors.As(err, &myErr) {
        // 处理自定义错误
    }
}
```

## 并发模式

### Worker Pool

```go
func workerPool(jobs <-chan int, results chan<- int) {
    for i := 0; i < 3; i++ {
        go func() {
            for job := range jobs {
                results <- job * 2
            }
        }()
    }
}

jobs := make(chan int, 100)
results := make(chan int, 100)

go workerPool(jobs, results)

for i := 0; i < 10; i++ {
    jobs <- i
}
close(jobs)

for i := 0; i < 10; i++ {
    fmt.Println(<-results)
}
```

### 扇入扇出

```go
func fanIn(input1, input2 <-chan string) <-chan string {
    output := make(chan string)
    go func() {
        for {
            select {
            case s := <-input1:
                output <- s
            case s := <-input2:
                output <- s
            }
        }
    }()
    return output
}
```

## 测试

```go
import "testing"

func TestAdd(t *testing.T) {
    result := Add(2, 3)
    if result != 5 {
        t.Errorf("Add(2, 3) = %d; want 5", result)
    }
}

func BenchmarkAdd(b *testing.B) {
    for i := 0; i < b.N; i++ {
        Add(1, 2)
    }
}
```

## Web开发

### HTTP服务器

```go
package main

import (
    "fmt"
    "net/http"
)

func handler(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintf(w, "Hello, World!")
}

func main() {
    http.HandleFunc("/", handler)
    http.ListenAndServe(":8080", nil)
}
```

### JSON处理

```go
import "encoding/json"

type Person struct {
    Name string `json:"name"`
    Age  int    `json:"age"`
}

// 编码
person := Person{Name: "John", Age: 30}
data, _ := json.Marshal(person)

// 解码
var p Person
json.Unmarshal(data, &p)
```

## 性能优化

### 内存优化

```go
// 使用对象池
var pool = sync.Pool{
    New: func() interface{} {
        return make([]byte, 1024)
    },
}

buf := pool.Get().([]byte)
defer pool.Put(buf)
```

### 避免不必要的分配

```go
// 预分配切片容量
slice := make([]int, 0, 100)

// 重用缓冲区
var buf bytes.Buffer
buf.Reset()
```

## 最佳实践

1. **错误处理**: 总是检查错误，不要忽略
2. **接口设计**: 接口应该小而专注
3. **并发安全**: 使用mutex保护共享资源
4. **资源管理**: 使用defer确保资源释放
5. **命名规范**: 遵循Go命名约定
6. **文档注释**: 为导出的函数和类型添加注释
7. **测试**: 编写单元测试和基准测试
8. **代码格式化**: 使用gofmt格式化代码
