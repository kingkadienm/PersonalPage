# Python进阶

## 装饰器

```python
def deco(func):
    def wrapper(*args, **kwargs):
        print('before')
        result = func(*args, **kwargs)
        print('after')
        return result
    return wrapper

@deco
def f():
    pass

from functools import wraps
def deco2(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        return func(*args, **kwargs)
    return wrapper
```

带参装饰器：外层函数接收参数返回装饰器，内层装饰器接收 func。用于日志、计时、权限、重试等。

## 生成器与迭代器

```python
def gen():
    yield 1
    yield 2

g = gen()
next(g)
next(g)

(x*2 for x in range(5))
```

生成器节省内存，惰性求值。迭代器协议：__iter__ 和 __next__。

## 上下文管理器

```python
class Ctx:
    def __enter__(self):
        return self
    def __exit__(self, exc_type, exc_val, exc_tb):
        return False

with Ctx() as c:
    pass

from contextlib import contextmanager
@contextmanager
def ctx():
    yield
```

with 用于资源获取与释放、锁、事务等。

## 多线程与多进程

```python
import threading
def worker():
    pass
t = threading.Thread(target=worker)
t.start()
t.join()

import multiprocessing
def worker():
    pass
p = multiprocessing.Process(target=worker)
p.start()
p.join()
```

GIL 导致多线程适合 I/O 密集型；CPU 密集型多用多进程。注意线程安全（锁、队列）。

## 异步 asyncio

```python
import asyncio

async def fetch():
    await asyncio.sleep(1)
    return 1

async def main():
    tasks = [fetch() for _ in range(5)]
    results = await asyncio.gather(*tasks)

asyncio.run(main())
```

协程、async/await、事件循环；适合高并发 I/O。

## 类型提示

```python
def add(a: int, b: int) -> int:
    return a + b

from typing import List, Dict, Optional
def process(items: List[str]) -> Dict[str, int]:
    pass
```

提高可读性和 IDE 支持；可用 mypy 做静态检查。

## 数据类与枚举

```python
from dataclasses import dataclass
@dataclass
class Point:
    x: int
    y: int

from enum import Enum
class Color(Enum):
    RED = 1
    GREEN = 2
```

## 测试

```python
import unittest
class TestAdd(unittest.TestCase):
    def test_add(self):
        self.assertEqual(1 + 1, 2)
    def setUp(self):
        pass
    def tearDown(self):
        pass

if __name__ == '__main__':
    unittest.main()
```

pytest 更简洁：`def test_xxx(): assert ...`。

## 常用第三方库（概览）

- Web：Flask、Django、FastAPI
- 数据：pandas、numpy
- 请求：requests、httpx
- 数据库：SQLAlchemy、pymongo、redis
- 环境与打包：venv、pip、setuptools、poetry

## 代码规范与工具

- PEP 8 风格；Black 格式化；isort 排序 import；flake8/ pylint 检查；mypy 类型检查。
