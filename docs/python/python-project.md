# Python实战项目

## 项目结构

```
project/
├── app/
│   ├── __init__.py
│   ├── models/         # 数据模型
│   ├── views/          # 视图/路由
│   ├── services/       # 业务逻辑
│   ├── utils/          # 工具函数
│   └── config.py       # 配置
├── tests/              # 测试
├── requirements.txt     # 依赖
├── .env                # 环境变量
└── main.py             # 入口文件
```

## 完整示例：RESTful API

### Flask项目

```python
# app/__init__.py
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from config import Config

db = SQLAlchemy()
migrate = Migrate()

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    db.init_app(app)
    migrate.init_app(app, db)
    
    from app.views import api_bp
    app.register_blueprint(api_bp)
    
    return app
```

### 数据模型

```python
# app/models/user.py
from app import db
from datetime import datetime

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'created_at': self.created_at.isoformat()
        }
    
    def __repr__(self):
        return f'<User {self.username}>'
```

### 业务逻辑

```python
# app/services/user_service.py
from app.models.user import User
from app import db

class UserService:
    @staticmethod
    def create_user(username, email):
        if User.query.filter_by(username=username).first():
            raise ValueError('Username already exists')
        if User.query.filter_by(email=email).first():
            raise ValueError('Email already exists')
        
        user = User(username=username, email=email)
        db.session.add(user)
        db.session.commit()
        return user
    
    @staticmethod
    def get_user(user_id):
        return User.query.get_or_404(user_id)
    
    @staticmethod
    def get_all_users():
        return User.query.all()
    
    @staticmethod
    def update_user(user_id, **kwargs):
        user = User.query.get_or_404(user_id)
        for key, value in kwargs.items():
            if hasattr(user, key):
                setattr(user, key, value)
        db.session.commit()
        return user
    
    @staticmethod
    def delete_user(user_id):
        user = User.query.get_or_404(user_id)
        db.session.delete(user)
        db.session.commit()
```

### API路由

```python
# app/views/api.py
from flask import Blueprint, request, jsonify
from app.services.user_service import UserService

api_bp = Blueprint('api', __name__, url_prefix='/api')

@api_bp.route('/users', methods=['POST'])
def create_user():
    data = request.get_json()
    try:
        user = UserService.create_user(
            username=data['username'],
            email=data['email']
        )
        return jsonify(user.to_dict()), 201
    except ValueError as e:
        return jsonify({'error': str(e)}), 400

@api_bp.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = UserService.get_user(user_id)
    return jsonify(user.to_dict())

@api_bp.route('/users', methods=['GET'])
def get_all_users():
    users = UserService.get_all_users()
    return jsonify([user.to_dict() for user in users])
```

### 测试

```python
# tests/test_user_service.py
import unittest
from app import create_app, db
from app.models.user import User
from app.services.user_service import UserService

class UserServiceTestCase(unittest.TestCase):
    def setUp(self):
        self.app = create_app('testing')
        self.app_context = self.app.app_context()
        self.app_context.push()
        db.create_all()
    
    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.app_context.pop()
    
    def test_create_user(self):
        user = UserService.create_user('testuser', 'test@example.com')
        self.assertIsNotNone(user.id)
        self.assertEqual(user.username, 'testuser')
    
    def test_get_user(self):
        user = UserService.create_user('testuser', 'test@example.com')
        found_user = UserService.get_user(user.id)
        self.assertEqual(found_user.id, user.id)
```

## 最佳实践总结

### 1. 项目结构

- **模块化**: 按功能拆分模块
- **分层架构**: Models-Services-Views
- **配置管理**: 使用环境变量

### 2. 代码质量

- **类型提示**: 使用typing模块
- **文档字符串**: 为函数添加docstring
- **代码规范**: 遵循PEP 8
- **静态检查**: 使用mypy

### 3. 测试

- **单元测试**: unittest或pytest
- **集成测试**: 测试API端点
- **覆盖率**: 使用coverage.py

### 4. 部署

- **虚拟环境**: 使用venv隔离依赖
- **依赖管理**: requirements.txt
- **容器化**: Docker部署
- **CI/CD**: GitHub Actions或GitLab CI
