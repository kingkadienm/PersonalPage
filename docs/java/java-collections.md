# 集合框架详解

## 体系总览

- **Collection**：List（有序可重复）、Set（不重复）、Queue（队列）。
- **Map**：key-value，key 不重复。
- 常用实现：ArrayList、LinkedList、HashSet、LinkedHashSet、TreeSet、HashMap、LinkedHashMap、TreeMap、ConcurrentHashMap、ArrayDeque、PriorityQueue。

## ArrayList

- 基于动态数组；默认容量 10，首次 add 时分配；扩容为约 1.5 倍（oldCapacity + oldCapacity >> 1），然后拷贝到新数组。
- 随机访问 get/set 按下标 O(1)；尾部 add O(1) 均摊；中间 add/remove 需移动元素 O(n)。
- 非线程安全；多线程用 CopyOnWriteArrayList（写时复制）或 Collections.synchronizedList。
- 删除元素时用迭代器 remove 或从后往前删，避免下标错乱。

## LinkedList

- 双向链表；实现 List 与 Deque。头尾增删 addFirst/Last、removeFirst/Last、offer/poll 均为 O(1)。
- 按下标 get/set 需遍历，O(n)；中间插入删除若已有迭代器位置也是 O(1)。
- 相比 ArrayList 更耗内存（节点指针）；随机访问多选 ArrayList，头尾操作或频繁插入删除可考虑 LinkedList。

## HashSet / LinkedHashSet / TreeSet

- **HashSet**：基于 HashMap，元素存 key，value 为固定 Object；无序；add/remove/contains O(1) 均摊。元素必须正确实现 equals 和 hashCode。
- **LinkedHashSet**：继承 HashSet，内部用链表维护插入顺序；迭代顺序即插入顺序。
- **TreeSet**：基于红黑树，元素有序（自然顺序或 Comparator）；add/remove/contains O(log n)。元素需 Comparable 或构造时传 Comparator；不允许 null（除非 Comparator 支持）。

## HashMap 核心原理

### 结构（JDK8）

- 数组 + 链表 + 红黑树。数组元素为 Node（链表节点）或 TreeNode（红黑树节点）。
- hash 计算：`(h = key.hashCode()) ^ (h >>> 16)` 再与 (length - 1) 做与运算得下标，高 16 位参与运算减少碰撞。
- 链表长度超过 8 且数组长度 ≥ 64 时，该桶转为红黑树；树节点数 ≤ 6 时退化为链表。

### put 过程

1. 若 table 为空，resize() 初始化（默认 16）。
2. 计算下标，若桶为空，直接 newNode 放进去。
3. 若桶有节点：key 相同则覆盖 value；否则若为树则走红黑树插入；否则遍历链表，有相同 key 则覆盖，否则尾插，插完后若链表长度 ≥ 8 则 treeifyBin（可能扩容或转树）。
4. size 超过 threshold（capacity * loadFactor，默认 0.75）则 resize() 扩容。

### 扩容机制

- 新容量为旧容量 2 倍；threshold = 新容量 * loadFactor。
- 迁移时节点要么留在原下标，要么移动到「原下标 + 旧容量」位置（因为容量为 2 的幂，多出一位决定新位置）。JDK8 中链表会拆成两条链，相对 JDK7 头插改尾插，避免环链。

### 负载因子

- 默认 0.75：在空间与碰撞之间折中。过小扩容频繁；过大碰撞多、链表/树变长。一般不改。

### 为什么 1.8 引入红黑树

- 链表过长时 get/put 退化为 O(n)；红黑树保证在 hash 碰撞严重时仍为 O(log n)，防止恶意 hash 导致性能雪崩。

### 必会问题简答

- **HashMap put 过程**：见上「put 过程」。
- **ConcurrentHashMap 如何保证线程安全**：JDK8 用 CAS + synchronized 锁桶头节点；put 时若桶为空则 CAS 放节点，否则 synchronized 锁住桶头再插；扩容时多线程协助迁移。见 [Java 并发](/java/java-concurrent)。

## LinkedHashMap

- 继承 HashMap，在节点上增加 before/after 指针形成双向链表；可保持插入顺序或访问顺序（accessOrder=true 时用于 LRU）。
- 重写 afterNodeAccess、afterNodeInsertion 等钩子，便于实现 LRU 缓存。

## TreeMap

- 基于红黑树；key 有序（自然顺序或 Comparator）；get/put/remove O(log n)；不支持 null key（除非 Comparator 处理）。

## ConcurrentHashMap

- **JDK7**：分段锁 Segment[]，每段一把锁；先定位段再段内操作；并发度受 Segment 数量限制。
- **JDK8**：取消 Segment，数组 + 链表 + 红黑树；锁粒度是桶（数组元素）。put：桶为空则 CAS 放节点；否则 synchronized 锁桶头，再链表插入或树插入。get 无锁（volatile 读）。size 用 baseCount + CounterCell[] 累加。扩容时多线程可协助 transfer。
- 不允许 null key 和 null value（与 HashMap 不同），避免并发下二义性。

## fail-fast

- 使用迭代器遍历时，若在遍历过程中（非通过迭代器自身 remove）结构性修改集合（add/remove），会抛 ConcurrentModificationException。
- 原理：迭代器内部维护 expectedModCount，与集合的 modCount 比较；集合修改会递增 modCount，迭代器 next 时检查不一致即抛异常。
- 解决：用迭代器的 remove；或使用 CopyOnWriteArrayList、ConcurrentHashMap 等并发集合；或改用 for 下标遍历（仅部分集合适用且仍有并发问题需另处理）。

## 线程安全集合选型

- List：CopyOnWriteArrayList（读多写少）、Collections.synchronizedList。
- Set：Collections.synchronizedSet、CopyOnWriteArraySet、ConcurrentHashMap.newKeySet()。
- Map：ConcurrentHashMap。
- Queue：ArrayBlockingQueue、LinkedBlockingQueue、ConcurrentLinkedQueue 等。

## 常用工具

- **Collections**：sort、binarySearch、reverse、shuffle、synchronizedXxx、unmodifiableXxx、emptyXxx、singletonList。
- **Arrays**：asList、sort、binarySearch、copyOf、equals、toString。Arrays.asList 返回的列表固定大小，不能 add/remove。
