# Python基础

## 语言概述

Python 是解释型、动态类型、支持多范式的语言，强调可读性和简洁性。广泛应用于 Web、数据分析、自动化、AI 等。

## 环境与运行

```bash
python3 --version
python3 script.py
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install package
pip freeze > requirements.txt
```

## 变量与基本类型

```python
x = 10
f = 3.14
s = "hello"
b = True
n = None

type(x)
isinstance(x, int)
```

整数无上限（受内存限制）；除法 / 得浮点，// 整除，% 取余，** 幂。

## 字符串

```python
s = "hello"
s = 'hello'
s = """多行
字符串"""
s = r"\n 原始字符串"

s[0]
s[-1]
s[1:4]
s[:3]
s[2:]
s[::-1]

len(s)
s + " world"
s * 2
"he" in s
s.upper()
s.lower()
s.strip()
s.split(',')
','.join(['a', 'b'])
s.replace('l', 'L')
s.format(name='Tom')
f"{s} world"
```

## 列表

```python
lst = [1, 2, 3]
lst = list(range(5))
lst[0]
lst[-1]
lst[1:3]
lst.append(4)
lst.extend([5, 6])
lst.insert(0, 0)
lst.remove(2)
lst.pop()
lst.pop(0)
lst.index(3)
lst.count(2)
lst.sort()
lst.reverse()
lst.clear()
```

列表推导式：`[x*2 for x in lst]`、`[x for x in lst if x > 0]`。

## 元组

```python
t = (1, 2, 3)
t = 1, 2, 3
t[0]
a, b, c = t
```

不可变，可哈希时可作字典键；常用于返回多值、保护数据不被修改。

## 字典

```python
d = {'a': 1, 'b': 2}
d = dict(a=1, b=2)
d['a']
d.get('c', 0)
d['c'] = 3
del d['c']
'a' in d
d.keys()
d.values()
d.items()

{k: v*2 for k, v in d.items()}
```

## 集合

```python
s = {1, 2, 3}
s = set([1, 2, 2, 3])
s.add(4)
s.remove(1)
s.discard(1)
1 in s
s1 | s2
s1 & s2
s1 - s2
```

无序、不重复，用于去重和集合运算。

## 控制流

```python
if x > 0:
    pass
elif x == 0:
    pass
else:
    pass

for i in range(10):
    print(i)
for k, v in d.items():
    print(k, v)

while condition:
    break
    continue
```

## 函数

```python
def greet(name, greeting='Hello'):
    return f"{greeting}, {name}"

def f(*args, **kwargs):
    pass

lambda x: x * 2
```

*args 为元组，**kwargs 为字典。参数顺序：位置参数、*args、默认参数、**kwargs。

## 文件操作

```python
with open('file.txt', 'r', encoding='utf-8') as f:
    content = f.read()
    lines = f.readlines()
    for line in f:
        print(line.strip())

with open('out.txt', 'w', encoding='utf-8') as f:
    f.write('hello')
```

模式：r、w、a、r+、rb、wb。推荐 with 自动关闭。

## 异常处理

```python
try:
    risky()
except ValueError as e:
    print(e)
except (TypeError, KeyError):
    pass
except Exception as e:
    raise
finally:
    cleanup()
```

## 类与对象

```python
class Person:
    def __init__(self, name):
        self.name = name

    def greet(self):
        return f"Hi, {self.name}"

    @classmethod
    def from_birth(cls, name, year):
        return cls(name)

    @staticmethod
    def is_valid_name(name):
        return len(name) > 0

class Student(Person):
    def __init__(self, name, grade):
        super().__init__(name)
        self.grade = grade
```

## 模块与包

```python
# mymodule.py
def fn():
    pass

# main.py
import mymodule
from mymodule import fn
import mymodule as m
```

包：含 __init__.py 的目录；可 `from package import module`。

## 常用标准库

- os / pathlib：路径与文件系统
- sys：系统参数、stdin/stdout
- json：JSON 读写
- re：正则
- datetime：日期时间
- collections：defaultdict、Counter、deque
- itertools：迭代工具
- argparse：命令行参数
