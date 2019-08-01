
# 安卓自定义View基础-坐标系



## 一.屏幕坐标系和数学坐标系的区别

由于移动设备一般定义屏幕左上角为坐标原点，向右为x轴增大方向，向下为y轴增大方向，
所以在手机屏幕上的坐标系与数学中常见的坐标系是稍微有点差别的，详情如下：

（**PS：其中的∠a 是对应的，注意y轴方向！**）

![数学坐标系](http://gcsblog.oss-cn-shanghai.aliyuncs.com/blog/2019-04-29-071018.jpg?gcssloop)
![安卓屏幕坐标系](http://gcsblog.oss-cn-shanghai.aliyuncs.com/blog/2019-04-29-71019.jpg?gcssloop)

**实际屏幕上的默认坐标系如下：**

> PS: 假设其中棕色部分为手机屏幕

![屏幕默认坐标系示例](http://gcsblog.oss-cn-shanghai.aliyuncs.com/blog/2019-04-29-071020.jpg?gcssloop)

## 二.View的坐标系

注意：View的坐标系统是相对于父控件而言的.
```text
getTop    获取子View左上角距父View顶部的距离
getLef    获取子View左上角距父View左侧的距离
getBottom 获取子View右下角距父View顶部的距离
getRight  获取子View右下角距父View左侧的距离
```

**如下图所示：**

![View坐标系](http://gcsblog.oss-cn-shanghai.aliyuncs.com/blog/2019-04-29-071021.jpg?gcssloop)

## 三.MotionEvent中 get 和 getRaw 的区别

event.getX    触摸点相对于其所在组件坐标系的坐标

event.getY    

event.getRawX 触摸点相对于屏幕默认坐标系的坐标

event.getRawY 



**如下图所示：**

> PS:其中相同颜色的内容是对应的，其中为了显示方便，蓝色箭头向左稍微偏移了一点.

![get雨getRaw区别](http://gcsblog.oss-cn-shanghai.aliyuncs.com/blog/2019-04-29-71022.jpg?gcssloop)

## 四.核心要点

* 在数学中常见的坐标系与屏幕默认坐标系的差别
* View的坐标系是相对于父控件而言的   
* MotionEvent中get和getRaw的区别
   