# Flutter实战项目

## 项目结构

```
lib/
├── main.dart
├── models/              # 数据模型
├── providers/           # 状态管理
├── screens/             # 页面
├── widgets/             # 组件
├── services/            # 服务层
├── utils/               # 工具类
└── constants/           # 常量
```

## 完整示例：待办应用

### 数据模型

```dart
// models/todo.dart
class Todo {
  final String id;
  final String title;
  final bool completed;
  final DateTime createdAt;
  
  Todo({
    required this.id,
    required this.title,
    this.completed = false,
    DateTime? createdAt,
  }) : createdAt = createdAt ?? DateTime.now();
  
  Todo copyWith({
    String? id,
    String? title,
    bool? completed,
    DateTime? createdAt,
  }) {
    return Todo(
      id: id ?? this.id,
      title: title ?? this.title,
      completed: completed ?? this.completed,
      createdAt: createdAt ?? this.createdAt,
    );
  }
  
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'completed': completed,
      'createdAt': createdAt.toIso8601String(),
    };
  }
  
  factory Todo.fromJson(Map<String, dynamic> json) {
    return Todo(
      id: json['id'],
      title: json['title'],
      completed: json['completed'] ?? false,
      createdAt: DateTime.parse(json['createdAt']),
    );
  }
}
```

### 状态管理

```dart
// providers/todo_provider.dart
import 'package:flutter/foundation.dart';
import '../models/todo.dart';
import '../services/todo_service.dart';

class TodoProvider with ChangeNotifier {
  final TodoService _service = TodoService();
  List<Todo> _todos = [];
  bool _loading = false;
  String? _error;
  
  List<Todo> get todos => _todos;
  bool get loading => _loading;
  String? get error => _error;
  
  Future<void> loadTodos() async {
    _loading = true;
    _error = null;
    notifyListeners();
    
    try {
      _todos = await _service.getTodos();
      _error = null;
    } catch (e) {
      _error = e.toString();
    } finally {
      _loading = false;
      notifyListeners();
    }
  }
  
  Future<void> addTodo(String title) async {
    final todo = Todo(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      title: title,
    );
    
    try {
      await _service.createTodo(todo);
      _todos.add(todo);
      notifyListeners();
    } catch (e) {
      _error = e.toString();
      notifyListeners();
    }
  }
  
  Future<void> toggleTodo(String id) async {
    final index = _todos.indexWhere((todo) => todo.id == id);
    if (index != -1) {
      final todo = _todos[index];
      final updatedTodo = todo.copyWith(completed: !todo.completed);
      
      try {
        await _service.updateTodo(updatedTodo);
        _todos[index] = updatedTodo;
        notifyListeners();
      } catch (e) {
        _error = e.toString();
        notifyListeners();
      }
    }
  }
  
  Future<void> deleteTodo(String id) async {
    try {
      await _service.deleteTodo(id);
      _todos.removeWhere((todo) => todo.id == id);
      notifyListeners();
    } catch (e) {
      _error = e.toString();
      notifyListeners();
    }
  }
}
```

### UI组件

```dart
// screens/todo_list_screen.dart
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/todo_provider.dart';
import '../widgets/todo_item.dart';

class TodoListScreen extends StatefulWidget {
  @override
  _TodoListScreenState createState() => _TodoListScreenState();
}

class _TodoListScreenState extends State<TodoListScreen> {
  final _controller = TextEditingController();
  
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<TodoProvider>().loadTodos();
    });
  }
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('待办事项'),
      ),
      body: Consumer<TodoProvider>(
        builder: (context, provider, child) {
          if (provider.loading) {
            return Center(child: CircularProgressIndicator());
          }
          
          if (provider.error != null) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text('错误: ${provider.error}'),
                  ElevatedButton(
                    onPressed: () => provider.loadTodos(),
                    child: Text('重试'),
                  ),
                ],
              ),
            );
          }
          
          if (provider.todos.isEmpty) {
            return Center(child: Text('暂无待办事项'));
          }
          
          return ListView.builder(
            itemCount: provider.todos.length,
            itemBuilder: (context, index) {
              final todo = provider.todos[index];
              return TodoItem(
                todo: todo,
                onToggle: () => provider.toggleTodo(todo.id),
                onDelete: () => provider.deleteTodo(todo.id),
              );
            },
          );
        },
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => _showAddDialog(context),
        child: Icon(Icons.add),
      ),
    );
  }
  
  void _showAddDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: Text('添加待办'),
          content: TextField(
            controller: _controller,
            decoration: InputDecoration(
              hintText: '输入待办事项',
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: Text('取消'),
            ),
            TextButton(
              onPressed: () {
                if (_controller.text.isNotEmpty) {
                  context.read<TodoProvider>().addTodo(_controller.text);
                  _controller.clear();
                  Navigator.pop(context);
                }
              },
              child: Text('添加'),
            ),
          ],
        );
      },
    );
  }
}
```

### 服务层

```dart
// services/todo_service.dart
import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/todo.dart';

class TodoService {
  final String baseUrl = 'https://api.example.com/todos';
  
  Future<List<Todo>> getTodos() async {
    final response = await http.get(Uri.parse(baseUrl));
    
    if (response.statusCode == 200) {
      final List<dynamic> data = json.decode(response.body);
      return data.map((json) => Todo.fromJson(json)).toList();
    } else {
      throw Exception('Failed to load todos');
    }
  }
  
  Future<Todo> createTodo(Todo todo) async {
    final response = await http.post(
      Uri.parse(baseUrl),
      headers: {'Content-Type': 'application/json'},
      body: json.encode(todo.toJson()),
    );
    
    if (response.statusCode == 201) {
      return Todo.fromJson(json.decode(response.body));
    } else {
      throw Exception('Failed to create todo');
    }
  }
  
  Future<Todo> updateTodo(Todo todo) async {
    final response = await http.put(
      Uri.parse('$baseUrl/${todo.id}'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode(todo.toJson()),
    );
    
    if (response.statusCode == 200) {
      return Todo.fromJson(json.decode(response.body));
    } else {
      throw Exception('Failed to update todo');
    }
  }
  
  Future<void> deleteTodo(String id) async {
    final response = await http.delete(Uri.parse('$baseUrl/$id'));
    
    if (response.statusCode != 200) {
      throw Exception('Failed to delete todo');
    }
  }
}
```

## 最佳实践总结

### 1. 项目结构

- **分层清晰**: Models-Providers-Screens-Widgets
- **组件复用**: 提取通用Widget
- **状态管理**: Provider/Riverpod/Bloc

### 2. 性能优化

- **const使用**: 尽可能使用const
- **ListView.builder**: 长列表优化
- **图片缓存**: 使用cached_network_image
- **代码分割**: 按需加载

### 3. 代码质量

- **命名规范**: 遵循Dart规范
- **类型安全**: 避免使用dynamic
- **错误处理**: try-catch处理异常
- **测试**: 单元测试和Widget测试

### 4. UI/UX

- **Material Design**: 遵循设计规范
- **响应式**: 适配不同屏幕
- **动画**: 流畅的过渡效果
- **可访问性**: 支持无障碍功能
