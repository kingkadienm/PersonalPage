# Go实战项目

## 项目结构

```
project/
├── cmd/
│   └── server/
│       └── main.go      # 应用入口
├── internal/
│   ├── handler/         # HTTP处理器
│   ├── service/         # 业务逻辑
│   ├── repository/      # 数据访问
│   └── model/          # 数据模型
├── pkg/                 # 可复用包
├── config/              # 配置文件
├── migrations/          # 数据库迁移
├── tests/               # 测试
├── go.mod
└── go.sum
```

## 完整示例：RESTful API

### 主程序

```go
// cmd/server/main.go
package main

import (
    "log"
    "net/http"
    "yourproject/internal/handler"
    "yourproject/internal/repository"
    "yourproject/internal/service"
)

func main() {
    // 初始化依赖
    userRepo := repository.NewUserRepository()
    userService := service.NewUserService(userRepo)
    userHandler := handler.NewUserHandler(userService)
    
    // 路由设置
    http.HandleFunc("/api/users", userHandler.HandleUsers)
    http.HandleFunc("/api/users/", userHandler.HandleUser)
    
    log.Println("Server starting on :8080")
    log.Fatal(http.ListenAndServe(":8080", nil))
}
```

### 数据模型

```go
// internal/model/user.go
package model

import "time"

type User struct {
    ID        int       `json:"id"`
    Username  string    `json:"username"`
    Email     string    `json:"email"`
    CreatedAt time.Time `json:"created_at"`
}
```

### Repository层

```go
// internal/repository/user_repository.go
package repository

import (
    "database/sql"
    "yourproject/internal/model"
)

type UserRepository interface {
    Create(user *model.User) error
    GetByID(id int) (*model.User, error)
    GetAll() ([]*model.User, error)
    Update(user *model.User) error
    Delete(id int) error
}

type userRepository struct {
    db *sql.DB
}

func NewUserRepository() UserRepository {
    // 初始化数据库连接
    db, _ := sql.Open("postgres", "connection string")
    return &userRepository{db: db}
}

func (r *userRepository) Create(user *model.User) error {
    query := `INSERT INTO users (username, email) VALUES ($1, $2) RETURNING id, created_at`
    return r.db.QueryRow(query, user.Username, user.Email).Scan(&user.ID, &user.CreatedAt)
}

func (r *userRepository) GetByID(id int) (*model.User, error) {
    user := &model.User{}
    query := `SELECT id, username, email, created_at FROM users WHERE id = $1`
    err := r.db.QueryRow(query, id).Scan(&user.ID, &user.Username, &user.Email, &user.CreatedAt)
    if err != nil {
        return nil, err
    }
    return user, nil
}
```

### Service层

```go
// internal/service/user_service.go
package service

import (
    "errors"
    "yourproject/internal/model"
    "yourproject/internal/repository"
)

type UserService interface {
    CreateUser(username, email string) (*model.User, error)
    GetUser(id int) (*model.User, error)
    GetAllUsers() ([]*model.User, error)
}

type userService struct {
    repo repository.UserRepository
}

func NewUserService(repo repository.UserRepository) UserService {
    return &userService{repo: repo}
}

func (s *userService) CreateUser(username, email string) (*model.User, error) {
    if username == "" {
        return nil, errors.New("username cannot be empty")
    }
    if email == "" {
        return nil, errors.New("email cannot be empty")
    }
    
    user := &model.User{
        Username: username,
        Email:    email,
    }
    
    if err := s.repo.Create(user); err != nil {
        return nil, err
    }
    
    return user, nil
}

func (s *userService) GetUser(id int) (*model.User, error) {
    return s.repo.GetByID(id)
}

func (s *userService) GetAllUsers() ([]*model.User, error) {
    return s.repo.GetAll()
}
```

### Handler层

```go
// internal/handler/user_handler.go
package handler

import (
    "encoding/json"
    "net/http"
    "strconv"
    "yourproject/internal/service"
)

type UserHandler struct {
    service service.UserService
}

func NewUserHandler(svc service.UserService) *UserHandler {
    return &UserHandler{service: svc}
}

func (h *UserHandler) HandleUsers(w http.ResponseWriter, r *http.Request) {
    switch r.Method {
    case http.MethodGet:
        h.getAllUsers(w, r)
    case http.MethodPost:
        h.createUser(w, r)
    default:
        http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
    }
}

func (h *UserHandler) createUser(w http.ResponseWriter, r *http.Request) {
    var req struct {
        Username string `json:"username"`
        Email    string `json:"email"`
    }
    
    if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }
    
    user, err := h.service.CreateUser(req.Username, req.Email)
    if err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }
    
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusCreated)
    json.NewEncoder(w).Encode(user)
}

func (h *UserHandler) getAllUsers(w http.ResponseWriter, r *http.Request) {
    users, err := h.service.GetAllUsers()
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
    
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(users)
}
```

### 测试

```go
// internal/service/user_service_test.go
package service

import (
    "testing"
    "yourproject/internal/model"
    "yourproject/internal/repository"
)

type mockUserRepository struct {
    users []*model.User
}

func (m *mockUserRepository) Create(user *model.User) error {
    user.ID = len(m.users) + 1
    m.users = append(m.users, user)
    return nil
}

func (m *mockUserRepository) GetByID(id int) (*model.User, error) {
    for _, user := range m.users {
        if user.ID == id {
            return user, nil
        }
    }
    return nil, errors.New("user not found")
}

func TestCreateUser(t *testing.T) {
    repo := &mockUserRepository{}
    svc := NewUserService(repo)
    
    user, err := svc.CreateUser("testuser", "test@example.com")
    if err != nil {
        t.Fatalf("Expected no error, got %v", err)
    }
    
    if user.Username != "testuser" {
        t.Errorf("Expected username 'testuser', got '%s'", user.Username)
    }
}
```

## 最佳实践总结

### 1. 项目结构

- **分层架构**: Handler-Service-Repository
- **依赖注入**: 通过接口解耦
- **包组织**: internal和pkg分离

### 2. 错误处理

- **错误包装**: 使用fmt.Errorf和%w
- **错误类型**: 定义自定义错误类型
- **错误检查**: 使用errors.Is和errors.As

### 3. 并发安全

- **Mutex**: 保护共享资源
- **Channel**: 协程间通信
- **Context**: 取消和超时控制

### 4. 测试

- **单元测试**: 测试每个函数
- **表驱动测试**: 多场景测试
- **基准测试**: 性能测试
