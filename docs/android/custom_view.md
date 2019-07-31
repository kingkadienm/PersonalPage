#安卓自定义View基础-坐标系

</span>
    </div>
    <h1 class="post-title">安卓自定义View基础-坐标系</h1>
  </header>

  <section class="post">
    <h2 id="一屏幕坐标系和数学坐标系的区别">一.屏幕坐标系和数学坐标系的区别</h2>

<p>由于移动设备一般定义屏幕左上角为坐标原点，向右为x轴增大方向，向下为y轴增大方向，
所以在手机屏幕上的坐标系与数学中常见的坐标系是稍微有点差别的，详情如下：</p>

<p>（<strong>PS：其中的∠a 是对应的，注意y轴方向！</strong>）</p>

<p><img src="http://gcsblog.oss-cn-shanghai.aliyuncs.com/blog/2019-04-29-071018.jpg?gcssloop" alt="数学坐标系" />
<img src="http://gcsblog.oss-cn-shanghai.aliyuncs.com/blog/2019-04-29-71019.jpg?gcssloop" alt="安卓屏幕坐标系" /></p>

<p><strong>实际屏幕上的默认坐标系如下：</strong></p>

<blockquote>
  <p>PS: 假设其中棕色部分为手机屏幕</p>
</blockquote>

<p><img src="http://gcsblog.oss-cn-shanghai.aliyuncs.com/blog/2019-04-29-071020.jpg?gcssloop" alt="屏幕默认坐标系示例" /></p>

<h2 id="二view的坐标系">二.View的坐标系</h2>

<p><strong>注意：View的坐标系统是相对于父控件而言的.</strong></p>

<div class="language-java highlighter-rouge"><pre class="highlight"><code><span class="n">getTop</span><span class="o">();</span>       <span class="c1">//获取子View左上角距父View顶部的距离</span>
<span class="n">getLeft</span><span class="o">();</span>      <span class="c1">//获取子View左上角距父View左侧的距离</span>
<span class="n">getBottom</span><span class="o">();</span>    <span class="c1">//获取子View右下角距父View顶部的距离</span>
<span class="n">getRight</span><span class="o">();</span>     <span class="c1">//获取子View右下角距父View左侧的距离</span>
</code></pre>
</div>

<p><strong>如下图所示：</strong></p>

<p><img src="http://gcsblog.oss-cn-shanghai.aliyuncs.com/blog/2019-04-29-071021.jpg?gcssloop" alt="View坐标系" /></p>

<h2 id="三motionevent中-get-和-getraw-的区别">三.MotionEvent中 get 和 getRaw 的区别</h2>

<div class="language-java highlighter-rouge"><pre class="highlight"><code><span class="n">event</span><span class="o">.</span><span class="na">getX</span><span class="o">();</span>       <span class="c1">//触摸点相对于其所在组件坐标系的坐标</span>
<span class="n">event</span><span class="o">.</span><span class="na">getY</span><span class="o">();</span>

<span class="n">event</span><span class="o">.</span><span class="na">getRawX</span><span class="o">();</span>    <span class="c1">//触摸点相对于屏幕默认坐标系的坐标</span>
<span class="n">event</span><span class="o">.</span><span class="na">getRawY</span><span class="o">();</span>
</code></pre>
</div>

<p><strong>如下图所示：</strong></p>

<blockquote>
  <p>PS:其中相同颜色的内容是对应的，其中为了显示方便，蓝色箭头向左稍微偏移了一点.</p>
</blockquote>

<p><img src="http://gcsblog.oss-cn-shanghai.aliyuncs.com/blog/2019-04-29-71022.jpg?gcssloop" alt="get雨getRaw区别" /></p>

<h2 id="四核心要点">四.核心要点</h2>

<table>
  <thead>
    <tr>
      <th style="text-align: center">序号</th>
      <th>要点</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="text-align: center">1</td>
      <td>在数学中常见的坐标系与屏幕默认坐标系的差别</td>
    </tr>
    <tr>
      <td style="text-align: center">2</td>
      <td>View的坐标系是相对于父控件而言的</td>
    </tr>
    <tr>
      <td style="text-align: center">3</td>
      <td>MotionEvent中get和getRaw的区别</td>
    </tr>
  </tbody>
</table>

