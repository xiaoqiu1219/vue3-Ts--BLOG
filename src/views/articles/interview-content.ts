/**
 * 高级前端面试精准答案 — 文章内容数据
 * 共 11 个模块、24 道面试题
 */

export interface QAItem {
  id: string
  title: string
  answer: string // HTML 格式
}

export interface SectionData {
  id: string
  number: string
  label: string
  questions: QAItem[]
}

// ===== 语法高亮辅助函数 =====
function hl(code: string, lang = 'js'): string {
  const escaped = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  return `<pre data-lang="${lang}"><code>${escaped}</code></pre>`
}

export const articleSections: SectionData[] = [
  // ==================== 一、JavaScript 核心 ====================
  {
    id: 'js-core',
    number: '一、',
    label: 'JavaScript 核心',
    questions: [
      {
        id: 'event-loop',
        title: 'Q1: 说一下事件循环机制，微任务和宏任务的区别？',
        answer: `
<p>JS 是单线程语言，通过事件循环（Event Loop）来实现异步非阻塞。</p>

<p><strong>执行流程：</strong></p>
<ol>
  <li>同步代码在调用栈中执行，遇到异步任务交给 Web API / libuv 处理</li>
  <li>异步任务完成后，回调进入对应的任务队列</li>
  <li>调用栈清空后，事件循环先从<strong>微任务队列</strong>取出所有任务执行，直到微任务队列清空</li>
  <li>然后从<strong>宏任务队列</strong>取出一个任务执行</li>
  <li>每执行完一个宏任务，<strong>立刻再清空微任务队列</strong>，循环往复</li>
</ol>

<p><strong>宏任务：</strong> <code>setTimeout</code>、<code>setInterval</code>、<code>I/O</code>、<code>UI 渲染</code>、<code>setImmediate(Node)</code>、<code>MessageChannel</code></p>

<p><strong>微任务：</strong> <code>Promise.then/catch/finally</code>、<code>MutationObserver</code>、<code>queueMicrotask</code>、<code>process.nextTick(Node，优先级高于 Promise)</code></p>

<p><strong>关键面试点：</strong></p>
${hl(`console.log('1');
setTimeout(() => console.log('2'), 0);
Promise.resolve().then(() => console.log('3'));
console.log('4');
// 输出：1 → 4 → 3 → 2
// 原因：同步代码先执行完 → 清空微任务(3) → 取一个宏任务(2)`)}
`
      },
      {
        id: 'closure',
        title: 'Q2: 讲讲闭包的理解，以及你项目中的实际应用？',
        answer: `
<p><strong>定义：</strong> 闭包 = 函数 + 该函数能访问的外部词法环境。当一个函数可以记住并访问它被创建时所在的词法作用域，即使这个函数在它被定义的作用域之外被调用，就形成了闭包。</p>

<p><strong>底层原理：</strong> 函数执行时会创建执行上下文和词法环境，内部函数持有对外部词法环境的引用。即使外部函数执行完毕，只要内部函数还存在引用，外部函数的变量对象就不会被 GC 回收。</p>

<p><strong>项目实际应用：</strong></p>

<p><strong>1. 防抖/节流</strong>（企尚公众号项目的搜索输入框）：</p>
${hl(`function debounce(fn, delay) {
  let timer = null;  // 闭包变量，timer 持续可访问
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}
// 设备查询搜索框，用户连续输入时只触发最后一次
const searchDevice = debounce((keyword) => {
  api.queryDevice({ keyword }).then(setList);
}, 300);`)}

<p><strong>2. 请求拦截器中的 Token 存储</strong>（时励员工管理系统）：</p>
${hl(`// 闭包缓存 token，避免频繁读取 localStorage
function createAuthManager() {
  let cachedToken = null;
  return {
    getToken() {
      if (!cachedToken) {
        cachedToken = localStorage.getItem('token');
      }
      return cachedToken;
    },
    clearToken() {
      cachedToken = null;
      localStorage.removeItem('token');
    }
  };
}`)}

<p><strong>3. 循环中绑定事件</strong>（经典问题，实际项目中用 let 块级作用域替代闭包解决）：</p>
${hl(`// 错误：var 没有块级作用域，所有回调打印同一个 i
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0); // 3 3 3
}
// 解决1：闭包
for (var i = 0; i < 3; i++) {
  (function(j) { setTimeout(() => console.log(j), 0); })(i); // 0 1 2
}
// 解决2：let 块级作用域（现代方案）
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0); // 0 1 2
}`)}

<p><strong>注意事项：</strong> 闭包会导致变量不被 GC 回收，使用完要及时清理引用（比如组件卸载时清除定时器、移除事件监听）。</p>
`
      },
      {
        id: 'promise-async',
        title: 'Q3: Promise 和 async/await 的底层原理？如何处理并发？',
        answer: `
<p><strong>Promise 原理：</strong></p>
<ul>
  <li>Promise 有三种状态：pending → fulfilled / rejected，状态一旦改变不可逆转</li>
  <li><code>.then()</code> 和 <code>.catch()</code> 返回新的 Promise，实现链式调用</li>
  <li>通过发布-订阅模式，同一 Promise 可以注册多个回调，状态变更时批量触发</li>
</ul>

<p><strong>手写简化版 Promise：</strong></p>
${hl(`class MyPromise {
  constructor(executor) {
    this.state = 'pending';
    this.value = undefined;
    this.callbacks = [];
    const resolve = (val) => {
      if (this.state !== 'pending') return;
      this.state = 'fulfilled';
      this.value = val;
      this.callbacks.forEach(cb => cb.onFulfilled(val));
    };
    const reject = (err) => {
      if (this.state !== 'pending') return;
      this.state = 'rejected';
      this.value = err;
      this.callbacks.forEach(cb => cb.onRejected(err));
    };
    try { executor(resolve, reject); } catch (e) { reject(e); }
  }
  then(onFulfilled, onRejected) {
    return new MyPromise((resolve, reject) => {
      const handler = () => {
        try {
          const result = onFulfilled(this.value);
          result instanceof MyPromise ? result.then(resolve, reject) : resolve(result);
        } catch (e) { reject(e); }
      };
      this.state === 'fulfilled' ? handler() : this.callbacks.push({ onFulfilled: handler, onRejected });
    });
  }
}`)}

<p><strong>async/await 本质：</strong> Generator + 自动执行器的语法糖。<code>await</code> 相当于 <code>yield</code>，外层包装了一个自动执行 next() 的协程调度器。遇到 await 时，将后续代码包装成微任务，让出执行权。</p>

<p><strong>项目中的并发处理（博通 IOT 后台管理系统）：</strong></p>
${hl(`// 场景：仪表盘首页需要同时获取卡片数据、设备统计、订单概览
// Promise.all：全部成功才返回，有一个失败就整体失败
const [cards, devices, orders] = await Promise.all([
  api.getCardStats(),
  api.getDeviceStats(),
  api.getOrderOverview()
]);

// Promise.allSettled：不管成败都返回，适用于部分失败不影响整体的场景
const results = await Promise.allSettled([
  api.getCardStats(),
  api.getDeviceStats(),
  api.getOrderOverview()
]);
results.forEach(r => r.status === 'rejected' ? console.warn(r.reason) : useData(r.value));

// 并发控制：对接多渠道支付时，限制同时最多 3 个并发
async function concurrentControl(tasks, limit = 3) {
  const results = [];
  const executing = [];
  for (const task of tasks) {
    const p = Promise.resolve().then(() => task());
    results.push(p);
    if (limit <= tasks.length) {
      const e = p.then(() => executing.splice(executing.indexOf(e), 1));
      executing.push(e);
      if (executing.length >= limit) await Promise.race(executing);
    }
  }
  return Promise.all(results);
}`)}
`
      },
    ],
  },

  // ==================== 二、Vue 深度 ====================
  {
    id: 'vue-deep',
    number: '二、',
    label: 'Vue 深度',
    questions: [
      {
        id: 'vue-reactivity',
        title: 'Q4: Vue2 和 Vue3 响应式原理的根本区别？',
        answer: `
<p><strong>Vue2 —— <code>Object.defineProperty</code>：</strong></p>
${hl(`// Vue2 的实现思路
function defineReactive(obj, key) {
  let val = obj[key];
  const dep = new Dep();
  Object.defineProperty(obj, key, {
    get() {
      Dep.target && dep.addSub(Dep.target); // 依赖收集
      return val;
    },
    set(newVal) {
      if (val === newVal) return;
      val = newVal;
      dep.notify(); // 派发更新
    }
  });
}`)}

<p><strong>致命缺陷：</strong></p>
<ol>
  <li>无法检测对象属性的<strong>新增和删除</strong>（需要用 <code>Vue.set</code> / <code>Vue.delete</code>）</li>
  <li>无法监听数组<strong>通过索引修改元素</strong>（<code>arr[0] = 'x'</code> 不触发更新）</li>
  <li>无法监听数组 <code>.length</code> 修改</li>
  <li>初始化时需要递归遍历所有属性，性能瓶颈</li>
</ol>
<p>Vue2 对数组的 hack：重写了 <code>push/pop/shift/unshift/splice/sort/reverse</code> 七个方法。</p>

<p><strong>Vue3 —— <code>Proxy</code>：</strong></p>
${hl(`// Vue3 的实现思路
function reactive(target) {
  return new Proxy(target, {
    get(target, key, receiver) {
      track(target, key); // 依赖收集
      const result = Reflect.get(target, key, receiver);
      return isObject(result) ? reactive(result) : result; // 惰性递归
    },
    set(target, key, value, receiver) {
      const oldValue = target[key];
      const result = Reflect.set(target, key, value, receiver);
      if (oldValue !== value) trigger(target, key); // 派发更新
      return result;
    },
    deleteProperty(target, key) {
      const had = Reflect.has(target, key);
      const result = Reflect.deleteProperty(target, key);
      if (had) trigger(target, key);
      return result;
    }
  });
}`)}

<p><strong>优势：</strong></p>
<ol>
  <li>代理整个对象，天然支持属性增删</li>
  <li>天然支持数组的索引修改和 <code>.length</code></li>
  <li>惰性响应式：只有访问到的嵌套对象才会被递归代理，初始化更快</li>
  <li>支持 Map / Set / WeakMap / WeakRef 等新数据结构</li>
</ol>

<p><strong>博通互联官网项目实际对比：</strong>从 Vue2 切到 Vue3 + TS 后，列表数据的动态字段不需要再用 <code>$set</code> 了，直接 <code>obj.newField = value</code> 即可。配合 Composition API 把设备查询逻辑抽成 <code>useDeviceQuery</code> composable，多个页面复用，代码量减少约 40%。</p>
`
      },
      {
        id: 'composition-vs-options',
        title: 'Q5: Composition API 和 Options API 实际怎么选？',
        answer: `
<p><strong>Options API 的问题：</strong></p>
${hl(`// 同一个"设备搜索"逻辑被迫分散在 3 个选项中
export default {
  data() { return { keyword: '', list: [] }; },
  methods: { async search() { this.list = await api.query(this.keyword); } },
  watch: { keyword: 'search' }
}
// 当组件有 5 个以上逻辑关注点时，options 会非常长且难以维护`)}

<p><strong>Composition API 的解决方式：</strong></p>
${hl(`// 单一逻辑关注点聚合在一起，一个 composable 搞定
function useDeviceSearch() {
  const keyword = ref('');
  const list = ref([]);
  const loading = ref(false);
  const search = async () => {
    loading.value = true;
    try { list.value = await api.query(keyword.value); }
    finally { loading.value = false; }
  };
  watch(keyword, search);
  return { keyword, list, loading, search };
}
// 在组件中：const { keyword, list, search } = useDeviceSearch();`)}

<p><strong>选择标准：</strong></p>
<ul>
  <li>简单组件（2-3 个数据/方法）：Options API 更直觉，代码更少</li>
  <li>复杂组件（多个逻辑域）、需要逻辑复用、需要 TS 类型推导：Composition API</li>
  <li>团队新人多：Options API 学习成本低</li>
  <li>追求长期可维护性：Composition API</li>
</ul>

<p><strong>项目实践（博通 IOT）：</strong>我把仪表盘的数据获取、图表配置、定时刷新逻辑抽成 <code>useDashboard</code>、<code>useChartOption</code>、<code>usePolling</code> 三个 composable，组件文件从 600 行精简到 200 行。</p>
`
      },
      {
        id: 'vue3-diff',
        title: 'Q6: Vue3 diff 算法相比 Vue2 的优化？',
        answer: `
<p><strong>Vue2 —— 双端对比（头头、尾尾、头尾、尾头）：</strong></p>
<ul>
  <li>对整棵 VNode 树做全量 diff，即使是静态文本节点也要比较</li>
  <li>四个指针分别从新旧列表两端向中间收缩，通过四次尝试找到可复用节点</li>
</ul>

<p><strong>Vue3 —— 增加了编译时优化：</strong></p>

<p><strong>1. 静态标记（PatchFlag）：</strong></p>
${hl(`<!-- 编译后带 PatchFlag，只对比动态部分 -->
<div :class="{ active }">{{ name }}</div>
<!-- 会被标记为 PatchFlag.CLASS | PatchFlag.TEXT，跳过 style、props 等的对比 -->`, 'html')}

<p><strong>2. 静态提升（HoistStatic）：</strong></p>
${hl(`// 静态节点提升到 render 函数外部，每次渲染复用同一个 VNode
const _hoisted_1 = createVNode('div', { class: 'header' }, '我是静态的');
// 初始化只创建一次，后续 diff 直接跳过`)}

<p><strong>3. 事件监听缓存（CacheHandlers）：</strong></p>
${hl(`<button @click="handleClick">点击</button>
<!-- 编译后只缓存函数引用，不再每次重建，避免子组件不必要的更新 -->`, 'html')}

<p><strong>4. 最长递增子序列（LIS）优化移动：</strong></p>
${hl(`// 核心：找出无需移动的最长递增子序列，只移动不在该序列中的节点
// 比如旧 [a,b,c,d] → 新 [a,c,b,d]，LIS 是 [a,b,d]，只移动 c
// 将 O(n²) 优化到 O(n log n)`)}

<p><strong>博通 IOT 虚拟表格实战：</strong></p>
<ul>
  <li>View Design 的 Table 组件在大数据下默认渲染全部数据，导致 5000 行数据初始化卡顿 3 秒+</li>
  <li>我二次封装实现了虚拟滚动：计算容器高度和行高，只渲染<strong>可视区 + 上下缓冲区</strong>的 DOM</li>
  <li>用 <code>transform: translateY(offset)</code> 撑开滚动条，避免频繁销毁重建 DOM</li>
  <li>首次渲染从 5000 行降到约 20 行 DOM，首屏渲染时间从 3s 降到 200ms</li>
</ul>
${hl(`// 核心思路
function useVirtualScroll(totalCount, itemHeight, containerHeight) {
  const startIndex = ref(0);
  const endIndex = ref(0);
  const bufferCount = 5; // 缓冲区行数

  const handleScroll = (scrollTop) => {
    startIndex.value = Math.max(0, Math.floor(scrollTop / itemHeight) - bufferCount);
    endIndex.value = Math.min(totalCount, Math.ceil((scrollTop + containerHeight) / itemHeight) + bufferCount);
  };

  const visibleData = computed(() =>
    allData.value.slice(startIndex.value, endIndex.value)
  );
  const wrapperStyle = computed(() => ({
    height: \`\${totalCount * itemHeight}px\`,
    paddingTop: \`\${startIndex.value * itemHeight}px\`
  }));

  return { visibleData, wrapperStyle, handleScroll };
}`)}
`
      },
      {
        id: 'pinia-vs-vuex',
        title: 'Q7: Pinia 相比 Vuex 的优势？实际怎么选？',
        answer: `
<table>
  <thead>
    <tr><th>维度</th><th>Vuex 4</th><th>Pinia</th></tr>
  </thead>
  <tbody>
    <tr><td>模块</td><td>嵌套 modules，命名空间 namepaced</td><td>扁平化，多个独立 store</td></tr>
    <tr><td>TS 支持</td><td>类型推导弱，需要额外类型定义</td><td>原生 TS，完整类型推导</td></tr>
    <tr><td>mutations</td><td>必须通过 mutation 修改 state</td><td>直接修改（底层仍走 Proxy）</td></tr>
    <tr><td>代码量</td><td>store/module/mutation/action 四件套</td><td>一个 setup 函数搞定</td></tr>
    <tr><td>体积</td><td>~12KB</td><td>~2.7KB</td></tr>
    <tr><td>DevTools</td><td>支持</td><td>支持（更好用）</td></tr>
  </tbody>
</table>

<p><strong>Pinia 实际用法的代码对比：</strong></p>
${hl(`// Vuex：需要四件套
const store = createStore({
  state: { devices: [] },
  mutations: { SET_DEVICES(state, data) { state.devices = data; } },
  actions: { async fetchDevices({ commit }) {
    const res = await api.getDevices();
    commit('SET_DEVICES', res.data);
  }},
  getters: { onlineDevices: state => state.devices.filter(d => d.online) }
});

// Pinia：直接在 setup 里写，跟 Composition API 一样
const useDeviceStore = defineStore('device', () => {
  const devices = ref([]);
  const onlineDevices = computed(() => devices.value.filter(d => d.online));
  const fetchDevices = async () => {
    devices.value = (await api.getDevices()).data;
  };
  return { devices, onlineDevices, fetchDevices };
});`)}

<p><strong>项目实践：</strong>博通互联官网从 Vuex 迁到 Pinia 后，store 代码量减少了约 50%，且不再需要手写类型定义文件。</p>
`
      },
      {
        id: 'vue-component-communication',
        title: 'Q8: Vue 组件通信有哪些方式？',
        answer: `
<p><strong>1. 父传子 <code>props</code> / 子传父 <code>emit</code>（标准父子通信）：</strong></p>
${hl(`<!-- 父 -->
<DeviceCard :device="device" @delete="handleDelete" />
<!-- 子 -->
<script setup>
const props = defineProps<{ device: Device }>();
const emit = defineEmits<{ delete: [id: string] }>();
emit('delete', props.device.id);
</script>`, 'html')}

<p><strong>2. <code>v-model</code> / <code>defineModel</code> (Vue3.4+)（表单类双向绑定）：</strong></p>
${hl(`<!-- 父 -->
<DeviceForm v-model:name="deviceName" />
<!-- 子 -->
<script setup>
const name = defineModel<string>('name', { required: true });
</script>`, 'html')}

<p><strong>3. <code>provide</code> / <code>inject</code>（跨层级，适合主题、语言、全局配置）：</strong></p>
${hl(`// 祖先组件
provide('theme', ref('dark'));
// 任意后代组件
const theme = inject('theme');`)}

<p><strong>4. Pinia</strong>（全局状态，适合用户信息、权限、多组件共享数据）</p>

<p><strong>5. <code>ref</code> + <code>defineExpose</code>（父调用子方法/获取子数据）：</strong></p>
${hl(`<!-- 父 -->
<DeviceTable ref="tableRef" />
<script setup>
const tableRef = ref();
tableRef.value.refresh(); // 直接调用子组件暴露的方法
</script>
<!-- 子 -->
<script setup>
const refresh = () => { /* ... */ };
defineExpose({ refresh });
</script>`, 'html')}

<p><strong>6. mitt / tiny-emitter</strong>（无关系组件间的松耦合通信，Vue3 移除 <code>$on/$off</code> 后替代方案）</p>

<p><strong>博通 IOT 项目实际选型：</strong></p>
<ul>
  <li>父子组件：<code>props + emit</code>，表单用 <code>v-model</code></li>
  <li>设备列表 → 设备详情抽屉：<code>ref + defineExpose</code></li>
  <li>全局 token / 用户权限 / 字典数据：Pinia</li>
  <li>跨页面的"刷新设备状态"通知：mitt（<code>emitter.emit('refresh-devices')</code>）</li>
</ul>
`
      },
    ],
  },

  // ==================== 三、TypeScript ====================
  {
    id: 'typescript',
    number: '三、',
    label: 'TypeScript',
    questions: [
      {
        id: 'ts-generics',
        title: 'Q9: TypeScript 的泛型，项目中的实际例子？',
        answer: `
<p><strong>项目中的 axios 请求封装（时励 + 博通项目都用这个模式）：</strong></p>
${hl(`// 后端统一返回格式
interface ApiResponse<T> {
  code: number;
  data: T;
  message: string;
}

// 泛型约束：T 必须是一个对象类型
async function request<T>(config: AxiosRequestConfig): Promise<ApiResponse<T>> {
  const res = await axios(config);
  return res.data;
}

// 使用时指定具体类型
interface DeviceInfo {
  id: string;
  name: string;
  status: 'online' | 'offline';
}

interface PaginatedData<T> {
  list: T[];
  total: number;
  page: number;
}

// 嵌套泛型：分页设备列表
const { data } = await request<PaginatedData<DeviceInfo>>({
  url: '/api/devices',
  method: 'GET'
});
// data.list 自动推导为 DeviceInfo[]，写代码时有完整提示`, 'ts')}

<p><strong>公共组件封装中的泛型约束（博通 IOT Table 封装）：</strong></p>
${hl(`// 约束传入的列配置必须包含 key（数据字段名）
interface Column<T> {
  key: keyof T;       // T 的字段名，不是任意字符串
  title: string;
  width?: number;
  render?: (row: T) => VNode;
}

// 泛型函数限制表格数据类型必须有 id 字段
function useTable<T extends { id: string }>(columns: Column<T>[]) {
  const data = ref<T[]>([]);
  const selectedIds = computed(() => data.value.map(row => row.id));
  // ...
  return { data, selectedIds };
}

// 使用
interface CardRecord { id: string; iccid: string; status: number; }
const { data, selectedIds } = useTable<CardRecord>([
  { key: 'iccid', title: 'ICCID' },     // 有类型检查，打错字编译报错
  { key: 'status', title: '状态' }
]);`, 'ts')}
`
      },
      {
        id: 'type-vs-interface',
        title: 'Q10: type 和 interface 的区别？什么时候用哪个？',
        answer: `
<table>
  <thead>
    <tr><th></th><th>interface</th><th>type</th></tr>
  </thead>
  <tbody>
    <tr><td>声明合并</td><td>支持同名自动合并</td><td>不支持，报错</td></tr>
    <tr><td>继承方式</td><td><code>extends</code></td><td><code>&amp;</code> 交叉类型</td></tr>
    <tr><td>联合/交叉</td><td>不支持直接写联合</td><td>支持 <code>type A = B | C</code></td></tr>
    <tr><td>映射类型</td><td>不支持</td><td>支持 <code>type Readonly&lt;T&gt; = {readonly [K in keyof T]: T[K]}</code></td></tr>
    <tr><td>元组</td><td>不支持</td><td>支持 <code>type Pair = [string, number]</code></td></tr>
  </tbody>
</table>

<p><strong>选择原则——用 interface，除非你需要 type 的独有能力：</strong></p>
${hl(`// ✅ interface：描述对象形状（主要使用场景）
interface DeviceInfo {
  id: string;
  name: string;
}

// ✅ interface：需要 declaration merging（第三方库扩展）
interface Window {
  __APP_CONFIG__: Record<string, string>;
}

// ✅ type：需要联合类型
type Status = 'online' | 'offline' | 'maintenance';

// ✅ type：需要映射类型
type PartialDevice = Partial<DeviceInfo>;

// ✅ type：需要元组
type ApiResult = [Error | null, DeviceInfo?];`, 'ts')}
`
      },
    ],
  },

  // ==================== 四、工程化 & 构建工具 ====================
  {
    id: 'engineering',
    number: '四、',
    label: '工程化 & 构建工具',
    questions: [
      {
        id: 'webpack-vs-vite',
        title: 'Q11: Webpack 和 Vite 的本质区别？',
        answer: `
<p><strong>核心差异：bundle vs ESM。</strong></p>

<p><strong>Webpack 的工作流程：</strong></p>
<ol>
  <li>从入口文件出发，递归解析所有依赖，构建依赖图</li>
  <li>对所有模块进行编译（babel/ts-loader、css-loader 等）</li>
  <li>打包成一个或多个 bundle 文件</li>
  <li>启动 devServer，浏览器加载打包后的 bundle</li>
</ol>
<p>问题：项目越大，启动越慢。博通 IOT 项目用 Webpack 时冷启动约 45 秒，HMR 约 2-3 秒。</p>

<p><strong>Vite 的工作流程：</strong></p>
<ol>
  <li><strong>预构建</strong>：用 esbuild（Go 编写，比 babel 快 10-100 倍）将 node_modules 依赖预打包成 ESM</li>
  <li><strong>源码按需编译</strong>：浏览器请求哪个文件，Vite 实时编译哪个文件（利用浏览器原生 ESM import）</li>
  <li><strong>HMR</strong>：通过 WebSocket 推送变更，只精确更新变更的模块，不重新打包整个 bundle</li>
</ol>

<p><strong>为什么 Vite 快：</strong></p>
<ul>
  <li>esbuild 用 Go 编写，不是 JS，编译阶段有数量级差异</li>
  <li>源码按需编译，不需要全量打包后再启动</li>
  <li>HMR 只失效变更模块链，复杂度 O(变化量) 而不是 O(项目规模)</li>
  <li>利用浏览器 HTTP/2 多路复用，小模块并发加载</li>
</ul>

<p><strong>选型建议：</strong>新项目直接用 Vite。老项目升级需要评估：Webpack 生态插件多，复杂配置场景 Webpack 更灵活。博通项目从 Webpack 切到 Vite 后，冷启动从 45s 降到 3s，HMR 基本秒更。</p>
`
      },
      {
        id: 'cicd',
        title: 'Q12: 你们项目的 CI/CD 流程怎么做的？',
        answer: `
<p>以诚讯德通信的项目为例，基于 GitLab CI：</p>

${hl(`# .gitlab-ci.yml
stages:
  - lint
  - build
  - deploy-test
  - deploy-prod

# 1. 代码规范检查
lint:
  stage: lint
  script:
    - npm run lint          # eslint + prettier 检查
    - npm run type-check    # TypeScript 类型检查
  only:
    - merge_requests
    - develop

# 2. 构建
build:
  stage: build
  script:
    - npm ci --cache .npm   # 用 ci 不用 install，保证依赖一致
    - npm run build
  artifacts:
    paths:
      - dist/
    expire_in: 7 days
  only:
    - develop
    - master

# 3. 部署测试环境
deploy-test:
  stage: deploy-test
  script:
    - scp -r dist/* user@test-server:/var/www/app/
    - ssh user@test-server "nginx -s reload"
  only:
    - develop

# 4. 部署生产环境（需要手动触发）
deploy-prod:
  stage: deploy-prod
  script:
    - scp -r dist/* user@prod-server:/var/www/app/
  when: manual
  only:
    - master`, 'yaml')}

<p><strong>关键实践：</strong></p>
<ul>
  <li><code>npm ci</code> 而不是 <code>npm install</code>，基于 lock 文件严格安装，防止 CI 环境和本地依赖版本不一致</li>
  <li>构建产物 <code>dist/</code> 设置 7 天缓存，方便快速回滚到之前的构建版本</li>
  <li>生产部署设置 <code>when: manual</code>，需要负责人手动触发</li>
  <li>每次 MR 自动在测试环境生成预览链接（配合 Nginx 子目录），方便产品和测试验收</li>
</ul>
`
      },
    ],
  },

  // ==================== 五、性能优化 ====================
  {
    id: 'performance',
    number: '五、',
    label: '性能优化',
    questions: [
      {
        id: 'virtual-scroll',
        title: 'Q13: 你的虚拟表格具体是怎么实现的？',
        answer: `
<p>博通 IOT 项目中，设备管理页面有 5000+ 设备记录，View Design Table 直接渲染导致严重卡顿。我基于 View Design Table 二次封装了虚拟滚动：</p>

${hl(`<template>
  <div class="virtual-table" @scroll="onScroll" ref="containerRef">
    <!-- 撑开滚动条的总高度 -->
    <div :style="{ height: \`\${totalHeight}px\`, position: 'relative' }">
      <!-- 实际渲染的区域，用 translateY 偏移 -->
      <table :style="{ transform: \`translateY(\${offsetY}px)\` }">
        <thead>...</thead>
        <tbody>
          <tr v-for="row in visibleData" :key="row.id">
            <!-- 渲染列 -->
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
interface VirtualScrollOptions {
  total: number;
  itemHeight: number;
  containerHeight: number;
  bufferCount?: number;  // 缓冲区行数，默认 5
}

function useVirtualScroll(options: VirtualScrollOptions) {
  const { total, itemHeight, containerHeight, bufferCount = 5 } = options;
  const scrollTop = ref(0);

  // 可视区域能放多少行
  const visibleCount = Math.ceil(containerHeight / itemHeight);

  // 计算起止索引
  const startIndex = computed(() =>
    Math.max(0, Math.floor(scrollTop.value / itemHeight) - bufferCount)
  );
  const endIndex = computed(() =>
    Math.min(total, startIndex.value + visibleCount + bufferCount * 2)
  );

  // 偏移量
  const offsetY = computed(() => startIndex.value * itemHeight);
  const totalHeight = total * itemHeight;

  const onScroll = (e: Event) => {
    scrollTop.value = (e.target as HTMLElement).scrollTop;
  };

  return { startIndex, endIndex, offsetY, totalHeight, onScroll };
}

// 使用
const { startIndex, endIndex, offsetY, totalHeight, onScroll } =
  useVirtualScroll({ total: 5000, itemHeight: 48, containerHeight: 600 });

const visibleData = computed(() =>
  allData.value.slice(startIndex.value, endIndex.value)
);
</script>`, 'html')}

<p><strong>关键实现要点：</strong></p>
<ul>
  <li>外层容器固定高度 <code>overflow: auto</code>，内层用 <code>height: totalHeight</code> 撑开原生滚动条（用户感知不到是虚拟的）</li>
  <li><code>transform: translateY</code> 而不是 <code>margin-top/padding-top</code>，避免触发重排（transform 只触发合成，走 GPU）</li>
  <li>上下各多渲染 5 行（缓冲区），防止快速滚动时出现空白</li>
  <li>如果行高不定时，需要维护一个行高缓存数组，滚动时动态修正 offsetY</li>
</ul>
`
      },
      {
        id: 'perf-optimization',
        title: 'Q14: 你主导过性能优化，具体做了什么？数据对比？',
        answer: `
<p><strong>博通互联官网首屏优化（Vue3 + TS + Element-UI）：</strong></p>

<table>
  <thead>
    <tr><th>优化项</th><th>优化前</th><th>优化后</th><th>方法</th></tr>
  </thead>
  <tbody>
    <tr><td>首屏加载</td><td>4.2s</td><td>1.1s</td><td>路由懒加载 + 组件异步引入</td></tr>
    <tr><td>JS Bundle</td><td>2.8MB</td><td>820KB</td><td>splitChunks 分包 + tree-shaking</td></tr>
    <tr><td>图片资源</td><td>未优化</td><td>减少 60%</td><td>WebP + 懒加载 + 压缩</td></tr>
    <tr><td>Lighthouse</td><td>42 分</td><td>91 分</td><td>综合优化</td></tr>
  </tbody>
</table>

<p><strong>具体措施：</strong></p>

<p><strong>1. 路由懒加载：</strong></p>
${hl(`// 原来：所有页面组件同步 import，全打在一个 chunk
import DeviceList from '@/views/DeviceList.vue';

// 优化后：按路由拆分 chunk
const routes = [
  { path: '/devices', component: () => import('@/views/DeviceList.vue') },
  { path: '/orders', component: () => import('@/views/OrderList.vue') }
];`, 'ts')}

<p><strong>2. Element-UI 按需引入：</strong></p>
${hl(`// 原来：全量引入 1.2MB
import ElementPlus from 'element-plus';
// 优化后：unplugin-vue-components 自动按需引入，只打包用到的组件`, 'ts')}

<p><strong>3. splitChunks 分包策略：</strong></p>
${hl(`// vite.config.ts
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        'vue-vendor': ['vue', 'vue-router', 'pinia'],
        'ui-vendor': ['element-plus'],
        'chart-vendor': ['echarts'],
      }
    }
  }
}
// 效果：业务代码改动时，vendor 包缓存命中率高，用户二次访问直接走浏览器缓存`, 'ts')}

<p><strong>4. 数据预加载：</strong></p>
${hl(`// 利用浏览器空闲时间预加载设备数据
requestIdleCallback(() => {
  api.prefetchDevices().then(data => store.setDevices(data));
});`)}

<p><strong>5. Nginx 配置 gzip + 缓存：</strong></p>
${hl(`gzip on;
gzip_types text/css application/javascript application/json image/svg+xml;
gzip_min_length 1024;
gzip_comp_level 6;

location ~* \\.(js|css|png|jpg|svg|woff2)$ {
  expires 365d;
  add_header Cache-Control "public, immutable";
}`, 'nginx')}
`
      },
      {
        id: 'debug-lag',
        title: 'Q15: 怎么排查页面卡顿？',
        answer: `
<p><strong>我在时励员工管理系统遇到过列表页面频繁卡顿的问题，排查步骤如下：</strong></p>

<p><strong>1. Chrome DevTools Performance 面板录制：</strong></p>
<ul>
  <li>操作卡顿页面，录制 3-5 秒的性能数据</li>
  <li>看 Main 线程：如果出现黄色长条（Long Task &gt; 50ms），说明 JS 执行耗时</li>
  <li>看 Frames：如果大量红色（掉帧），说明渲染耗时</li>
  <li>当时发现每次滚动都在执行 <code>Array.filter</code> + 全量 DOM 更新，Long Task 达到了 180ms</li>
</ul>

<p><strong>2. 定位具体代码：</strong></p>
<ul>
  <li>Bottom-Up 视图按耗时排序，定位到具体函数</li>
  <li>发现是 watch 监听了一个大数组，每次微小变化都触发排序和过滤重新计算</li>
</ul>

<p><strong>3. 修复方案：</strong></p>
${hl(`// 问题代码：每次数据变化都全量重算
watch(allDevices, (val) => {
  filteredDevices.value = val
    .filter(d => d.status === currentFilter.value)  // 每次重新 filter
    .sort((a, b) => b.time - a.time);               // 每次重新 sort
}, { deep: true });

// 修复后：用 computed 做缓存 + 排序用索引
const filteredDevices = computed(() => {
  const filtered = allDevices.value.filter(d => d.status === statusFilter.value);
  return filtered.sort((a, b) => b.time - a.time);
  // Vue3 computed 自动缓存，依赖不变就不重新计算
});`)}

<p><strong>4. 其他排查工具：</strong></p>
<ul>
  <li><strong>Memory 面板</strong>：排查内存泄漏（看 Heap Snapshot 中 Detached DOM 节点数量），组件卸载后定时器/事件监听是否清理</li>
  <li><strong>Rendering → Paint Flashing</strong>：绿色闪烁代表重绘区域，频繁大面积闪烁说明需要减少重绘</li>
  <li><strong>Layers 面板</strong>：确认 <code>transform</code> 动画确实在合成层上执行，没有触发重排</li>
</ul>
`
      },
    ],
  },

  // ==================== 六、安全 ====================
  {
    id: 'security',
    number: '六、',
    label: '安全',
    questions: [
      {
        id: 'payment-security',
        title: 'Q16: 支付体系前端如何保证安全？',
        answer: `
<p>在诚讯德做的支付模块，对接了微信支付和支付宝。前端安全措施：</p>

<p><strong>1. HTTPS 全站加密</strong> — 防止中间人攻击，所有支付请求走 HTTPS。</p>

<p><strong>2. Token 存储策略：</strong></p>
${hl(`// access_token 用 httpOnly cookie（前端不可读，JS 无法窃取）
// refresh_token 存在 localStorage，但配合短期过期策略

// 请求拦截器统一加签
request.interceptors.request.use(config => {
  // CSRF Token：每次请求从 cookie 读 csrf_token 放入 header
  const csrfToken = getCookie('csrf_token');
  if (csrfToken) config.headers['X-CSRF-Token'] = csrfToken;
  return config;
});`)}

<p><strong>3. 金额处理：</strong></p>
${hl(`// 前端绝对不直接用 JS 浮点数做金额计算
// 错误示例：0.1 + 0.2 = 0.30000000000000004
// 正确做法：使用 big.js 或者金额传给后端计算，前端只做展示
import Big from 'big.js';
const total = new Big('19.90').plus(new Big('0.10')).toString(); // "20.00"`)}

<p><strong>4. 支付按钮防重：</strong></p>
${hl(`const paying = ref(false);
const handlePay = async () => {
  if (paying.value) return;      // 防重复点击
  paying.value = true;
  try {
    await api.submitPay(params);  // 后端生成预支付订单
  } finally {
    paying.value = false;         // 必须 finally 中重置
  }
};`)}

<p><strong>5. 支付结果校验：</strong></p>
${hl(`// 前端获取支付结果后，必须向服务端二次确认
// 不能仅依赖前端回调判断支付成功
const verifyPayment = async (orderId: string) => {
  const { data } = await api.queryOrderStatus(orderId);
  if (data.status === 'paid') {
    // 服务端确认支付成功，前端做后续跳转
  }
};

// 轮询查询支付结果，设置超时兜底
const pollPayment = (orderId: string) => {
  return new Promise((resolve, reject) => {
    const timer = setInterval(async () => {
      const res = await api.queryOrderStatus(orderId);
      if (res.data.status === 'paid') { clearInterval(timer); resolve(res); }
    }, 3000);
    setTimeout(() => { clearInterval(timer); reject(new Error('支付超时')); }, 120000);
  });
};`)}

<p><strong>6. CSP 内容安全策略：</strong></p>
${hl(`# 限制 script 来源，防止 XSS 注入
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' *.trusted-cdn.com; connect-src 'self' *.api.com`, 'nginx')}
`
      },
      {
        id: 'realname-auth',
        title: 'Q17: 实名认证模块前端怎么做的？',
        answer: `
<p>企尚公众号的核心功能就是实名认证。流程：OCR 识别身份证 → 人脸识别 → 绑定手机号。</p>

<p><strong>1. 身份证 OCR + 脱敏处理：</strong></p>
${hl(`// 用户上传身份证照片后，先在前端做裁剪压缩
async function compressIdCard(file: File): Promise<File> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  const img = await createImageBitmap(file);
  // 限制最大尺寸 1080px，压缩质量 0.8
  const scale = Math.min(1080 / img.width, 1);
  canvas.width = img.width * scale;
  canvas.height = img.height * scale;
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return new Promise(resolve =>
    canvas.toBlob(blob => resolve(new File([blob!], file.name, { type: 'image/jpeg' })), 'image/jpeg', 0.8)
  );
}

// 预览时脱敏展示
const maskIdCard = (id: string) => id.replace(/(\\d{4})\\d{10}(\\d{4})/, '$1**********$2');
const maskName = (name: string) => name[0] + '*'.repeat(name.length - 1);`)}

<p><strong>2. 上传到后端时走加密通道：</strong></p>
${hl(`// 用 RSA 公钥加密敏感字段，后端用私钥解密
// 即使传输过程中被截获，也无法解密
import JSEncrypt from 'jsencrypt';
const encrypt = new JSEncrypt();
encrypt.setPublicKey(PUBLIC_KEY);
const encryptedId = encrypt.encrypt(idCardNumber);`)}

<p><strong>3. 图片安全校验：</strong></p>
${hl(`// 上传前校验类型、大小
const beforeUpload = (file: File) => {
  const isJpgOrPng = ['image/jpeg', 'image/png'].includes(file.type);
  if (!isJpgOrPng) { message.error('只支持 JPG/PNG 格式'); return false; }
  const isLt5M = file.size / 1024 / 1024 < 5;
  if (!isLt5M) { message.error('图片不能超过 5MB'); return false; }
  return true;
};`)}
`
      },
    ],
  },

  // ==================== 七、UniApp 跨端 ====================
  {
    id: 'uniapp',
    number: '七、',
    label: 'UniApp 跨端',
    questions: [
      {
        id: 'uniapp-pitfalls',
        title: 'Q18: UniApp 从 0 到 1 搭建公众号，遇到过哪些坑？',
        answer: `
<p>企尚 QISHANG 公众号是从零搭建的，技术栈 UniApp。我踩过的主要坑：</p>

<p><strong>1. 微信登录流程的坑：</strong></p>
${hl(`// 登录兜底策略（简历提到的核心优化）
async function login() {
  // uni.login 获取 code
  const { code } = await uni.login();
  // 用 code 向自己后端换取 token
  const { data } = await api.wxLogin(code);
  if (data.token) {
    uni.setStorageSync('token', data.token);
    return;
  }
  // 兜底1：code 可能失效（用户多次登录），提示重新授权
  if (data.code === 'CODE_INVALID') {
    return uni.showModal({
      title: '请重新授权',
      success: (res) => res.confirm && login()
    });
  }
  // 兜底2：服务端异常，降级为手机号登录
  return fallbackToPhoneLogin();
}`)}

<p><strong>2. 支付对接多渠道（微信支付 + 支付宝）：</strong></p>
${hl(`// 条件编译处理平台差异
async function pay(orderInfo: OrderInfo) {
  // #ifdef MP-WEIXIN
  const res = await uni.requestPayment({
    timeStamp: orderInfo.timeStamp,
    nonceStr: orderInfo.nonceStr,
    package: orderInfo.package,
    signType: 'MD5',
    paySign: orderInfo.paySign,
  });
  // #endif

  // #ifdef H5
  // H5 端微信支付走 JSAPI 不同的流程，需要 redirect_url
  window.location.href = orderInfo.mweb_url;
  // #endif
}`)}

<p><strong>3. 小程序包体积限制（2MB 主包）：</strong></p>
<ul>
  <li>图片资源统一放 CDN，不打包到小程序内</li>
  <li>非首页路由用分包加载：</li>
</ul>
${hl(`{
  "subPackages": [{
    "root": "pages/sub/device",
    "pages": ["detail", "history"]
  }],
  "preloadRule": {
    "pages/index/index": {
      "network": "all",
      "packages": ["pages/sub/device"]  // 首页预加载子包，提升体验
    }
  }
}`, 'json')}

<p><strong>4. 样式兼容：</strong></p>
${hl(`/* 小程序里某些 CSS 不生效：不支持 backdrop-filter、不支持 position: fixed 嵌套 */
/* 条件编译样式 */
/* #ifdef H5 */
.header { backdrop-filter: blur(10px); }
/* #endif */
/* #ifdef MP-WEIXIN */
.header { background: rgba(255,255,255,0.95); }  /* 用半透明背景替代 */
/* #endif */`, 'scss')}
`
      },
    ],
  },

  // ==================== 八、系统设计 & 架构 ====================
  {
    id: 'architecture',
    number: '八、',
    label: '系统设计 & 架构',
    questions: [
      {
        id: 'component-library',
        title: 'Q19: 如果让你从零设计一个前端组件库？',
        answer: `
<p>我在诚讯德牵头做了公司内部的公共组件库，基于 Element-UI 二次封装了 20+ 业务组件。</p>

<p><strong>整体架构设计：</strong></p>
${hl(`packages/
├── components/          # 组件源码
│   ├── device-selector/
│   │   ├── index.vue
│   │   └── types.ts
│   └── ...
├── docs/                # VitePress 文档
├── play/                # 本地开发预览
└── utils/               # 工具函数`)}

<p><strong>核心实践：</strong></p>

<p><strong>1. 统一规范：</strong></p>
${hl(`// 所有组件遵循统一的 Props 和 Emits 规范
// 每个组件导出的类型必须包含：
interface DeviceSelectorProps {
  modelValue: string | string[];     // 支持 v-model
  multiple?: boolean;                // 是否多选
  disabled?: boolean;
  placeholder?: string;
}
interface DeviceSelectorEmits {
  (e: 'update:modelValue', value: string | string[]): void;
  (e: 'change', value: string | string[]): void;
}`, 'ts')}

<p><strong>2. 按需引入：</strong></p>
${hl(`// vite.config.ts 用 unplugin-vue-components 做到自动按需引入
import Components from 'unplugin-vue-components/vite';
Components({
  resolvers: [{
    type: 'component',
    resolve: (name) => {
      if (name.startsWith('My')) {
        return { name, from: '@company/ui' };
      }
    }
  }]
});`, 'ts')}

<p><strong>3. 单元测试：</strong></p>
${hl(`// 每个组件写 Vitest + @vue/test-utils 测试
describe('DeviceSelector', () => {
  it('should render options', async () => {
    const wrapper = mount(DeviceSelector, {
      props: { options: [{ id: '1', name: 'Device 1' }] }
    });
    await wrapper.find('.trigger').trigger('click');
    expect(wrapper.text()).toContain('Device 1');
  });
});`, 'ts')}

<p><strong>4. 版本管理：</strong>语义化版本 + CHANGELOG.md，breaking change 走 major 版本。</p>
`
      },
      {
        id: 'permission-system',
        title: 'Q20: 权限控制系统怎么设计？在路由的什么位置校验？',
        answer: `
<p>时励员工后台管理系统是典型的企业权限管理平台，我做了<strong>路由级 + 按钮级 + 接口级</strong>三层权限控制。权限校验的核心流程全部在 <code>router.beforeEach</code> 这个全局前置守卫中完成。</p>

<p><strong>完整时序流程：</strong></p>
<div class="flow-chart">用户访问 /devices
    │
    ▼
router.beforeEach ──→ 判断：token 存在？
    │                    ├─ 否 → 跳转 /login，流程结束
    │                    └─ 是 ↓
    │              判断：动态路由已添加？
    │                    ├─ 是 → 直接放行（next）
    │                    └─ 否 ↓
    │              1. 调接口获取用户权限列表
    │              2. 根据权限生成动态路由
    │              3. 用 router.addRoute() 动态注册
    │              4. 把权限列表存入 Pinia store
    │              5. next({ ...to, replace: true }) 重入当前路由
    │                    │
    │                    ▼
    │              再次进入 beforeEach → 路由已添加 → 放行
    │                    │
    │                    ▼
    │              组件渲染 → 按钮级 v-permission 指令生效</div>

<p><strong>具体代码实现：</strong></p>
${hl(`// router/index.ts
import { createRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { usePermissionStore } from '@/stores/permission';

// 静态路由：不需要权限，所有人可访问
const staticRoutes = [
  { path: '/login', name: 'Login', component: () => import('@/views/Login.vue') },
  { path: '/403', name: '403', component: () => import('@/views/403.vue') },
  { path: '/404', name: '404', component: () => import('@/views/404.vue') },
];

const router = createRouter({
  history: createWebHistory(),
  routes: staticRoutes,
});

// ============ 权限校验的核心入口 ============
// 在这里，router.beforeEach，不是 afterEach
// 因为 afterEach 执行时路由已经跳完了，无法拦截

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore();
  const permissionStore = usePermissionStore();

  // ----- 第一步：登录态校验 -----
  const token = userStore.token || localStorage.getItem('token');

  if (!token) {
    // 未登录：白名单路由放行（/login），其他全部跳到登录页
    if (to.path === '/login') return next();
    return next({ path: '/login', query: { redirect: to.fullPath } });
  }

  // ----- 第二步：已登录但访问 login → 重定向到首页 -----
  if (to.path === '/login') {
    return next({ path: '/' });
  }

  // ----- 第三步：动态路由是否已添加（关键判断） -----
  // hasRoutes 是一个简单的标记，存在 store 里
  // 用来区分"首次进入"和"后续导航"
  if (!permissionStore.hasRoutes) {
    try {
      // 3.1 调后端接口，一次性拿到两个东西：
      //     - menus：用户有权限的菜单/路由列表
      //     - permissions：用户拥有的按钮级权限标识数组
      const { menus, permissions } = await api.getUserPermissions();

      // 3.2 权限标识列表存入 store，供按钮级 v-permission 指令使用
      permissionStore.setPermissions(permissions);

      // 3.3 后端返回的菜单转成路由配置，动态注册
      const dynamicRoutes = menus.map(menu => ({
        path: menu.path,
        name: menu.name,
        component: () => import(\`@/views/\${menu.component}.vue\`), // 动态 import
        meta: {
          title: menu.title,
          icon: menu.icon,
          permission: menu.permission, // 该路由所需的权限标识
        },
      }));

      // 3.4 核心：addRoute 动态注入路由
      dynamicRoutes.forEach(route => router.addRoute('layout', route));

      // 3.5 兜底：404 页面也动态加进去（必须放在最后）
      router.addRoute('layout', {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('@/views/404.vue'),
      });

      // 3.6 标记已添加，下次 beforeEach 跳过这步
      permissionStore.setHasRoutes(true);

      // 3.7 关键：replace: true 重入当前路由
      next({ ...to, replace: true });

    } catch (err) {
      userStore.clearToken();
      next({ path: '/login' });
    }
    return;
  }

  // ----- 第四步：路由已添加，正常放行 -----
  if (to.meta.permission) {
    const hasPermission = permissionStore.permissions.includes(to.meta.permission as string);
    if (!hasPermission) {
      return next({ path: '/403' });
    }
  }

  next();
});

export default router;`, 'ts')}

<p><strong>关键细节拆解：</strong></p>

<p><strong>1. 为什么是 <code>beforeEach</code> 而不是 <code>afterEach</code>？</strong></p>
<ul>
  <li><code>beforeEach</code>：路由跳转前触发，可以调用 <code>next(false)</code> 或 <code>next('/login')</code> 来<strong>阻断</strong>跳转</li>
  <li><code>afterEach</code>：路由跳转完成后触发，此时页面已经开始渲染了，无法拦截</li>
  <li>权限校验必须在页面渲染之前完成，所以必须用 <code>beforeEach</code></li>
</ul>

<p><strong>2. 为什么用了 <code>next({ ...to, replace: true })</code> 而不是直接 <code>next()</code>？</strong></p>
<ul>
  <li>首次进入时，动态路由还没添加，当前 <code>to</code> 匹配不到任何组件</li>
  <li><code>addRoute</code> 之后需要让同一个路径重新匹配一次</li>
  <li><code>replace: true</code> 是关键——它会在历史记录栈中替换当前记录，不会产生多余的导航历史</li>
</ul>

<p><strong>3. Vite 中动态 import 的路径问题：</strong></p>
${hl(`// Vite 中需要预声明所有可能的组件路径
const modules = import.meta.glob('@/views/**/*.vue');

function getComponent(componentPath: string) {
  return modules[\`@/views/\${componentPath}.vue\`];
}`, 'ts')}

<p><strong>按钮级权限（在组件内生效）：</strong></p>
${hl(`// directives/permission.ts
const vPermission: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const { value } = binding; // 需要的权限标识，如 'device:delete'
    const permissions = useUserStore().permissions;
    if (!permissions.includes(value)) {
      el.parentNode?.removeChild(el); // 无权限直接移除 DOM
    }
  }
};`, 'ts')}
${hl(`<el-button v-permission="'device:delete'" @click="deleteDevice">删除</el-button>`, 'html')}

<p><strong>接口级权限（兜底）：</strong></p>
${hl(`request.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 403) {
      router.replace('/403');
    }
    return Promise.reject(err);
  }
);`, 'ts')}
`
      },
      {
        id: 'vue2-to-vue3',
        title: 'Q21: Vue2 迁移到 Vue3 怎么规划？',
        answer: `
<p>假如公司存量 Vue2 项目需要迁移，我的方案：</p>

<p><strong>第一步：兼容性评估（1 周）</strong></p>
<ul>
  <li>盘点项目依赖：哪些第三方库还不支持 Vue3（如一些老旧 UI 组件库）</li>
  <li>分析代码量、组件数量、API 使用情况</li>
</ul>

<p><strong>第二步：渐进式迁移（分批进行）</strong></p>
${hl(`// 阶段1：Vue2 项目中引入 @vue/compat（兼容构建）
// 同时支持 Vue2 Options API 和 Vue3 Composition API
// npm install vue@3 @vue/compat

// 阶段2：先迁移公共组件和工具函数
// 将 mixin 改写成 composable（这是迁移中最常见的改动）
// 之前
export const deviceMixin = {
  data() { return { devices: [] }; },
  methods: { async fetchDevices() { /*...*/ } }
};
// 之后
export function useDevices() {
  const devices = ref<Device[]>([]);
  const fetchDevices = async () => { /*...*/ };
  return { devices, fetchDevices };
}

// 阶段3：逐个页面迁移
// 删除 .sync 修饰符（Vue3 废弃），改用 v-model:propName
// $listeners 合并到了 $attrs
// filters 废弃，改用 computed 或全局方法`)}

<p><strong>第三步：测试验证</strong></p>
<ul>
  <li>两套版本并行跑一段时间，通过灰度发布逐步切流量</li>
  <li>观察监控（错误率、性能指标），确认无回归后全量切换</li>
</ul>

<p><strong>迁移检查清单：</strong></p>
<table>
  <thead>
    <tr><th>Vue2</th><th>Vue3</th></tr>
  </thead>
  <tbody>
    <tr><td><code>Vue.set(obj, key, val)</code></td><td><code>obj[key] = val</code></td></tr>
    <tr><td><code>$listeners</code></td><td>合并到 <code>$attrs</code></td></tr>
    <tr><td><code>filters</code></td><td><code>computed</code> 或工具函数</td></tr>
    <tr><td><code>v-model="val"</code></td><td>不变，但 <code>.sync</code> → <code>v-model:prop</code></td></tr>
    <tr><td><code>$on/$off/$once</code></td><td>移除，用 <code>mitt</code></td></tr>
    <tr><td><code>new Vue()</code></td><td><code>createApp()</code></td></tr>
    <tr><td><code>Vue.prototype.xxx</code></td><td><code>app.config.globalProperties.xxx</code></td></tr>
    <tr><td><code>&lt;transition&gt;</code> 内不再支持 <code>v-if/v-else</code></td><td>用 <code>v-if/v-else</code> 在 transition 外</td></tr>
  </tbody>
</table>
`
      },
    ],
  },

  // ==================== 九、AI 辅助编程 ====================
  {
    id: 'ai-impact',
    number: '九、',
    label: 'AI 辅助编程',
    questions: [
      {
        id: 'ai-opinion',
        title: 'Q22: 结合你自身，你觉得 AI 的发展对你造成了什么影响？你怎么看待 AI？',
        answer: `
<p>这个问题从两个角度回答——<strong>AI 对我个人的实际影响</strong>，和<strong>我对 AI 的底层看法</strong>。</p>

<p><strong>一、对我个人的影响：用得好是杠杆，用不好是拐杖。</strong></p>
<p>我这一两年最大的变化是，写代码的方式彻底变了。以前接到一个需求，先打开 VS Code 开始写，写着写着发现类型定义要写一堆，工具函数要写一堆，半天过去了核心逻辑还没开始。现在我的流程是：先用 AI 把架子、类型定义、样板代码生成出来，我把精力集中在业务逻辑设计和边界条件处理上。</p>
<p>举一个实际例子：博通 IOT 项目里，我要给所有设备的 API 接口做统一的错误处理和重试逻辑。以前我可能要花一下午写好所有接口的包装函数。现在我把一个接口的写法给 AI 看，让它帮我扩展到全部 30 个接口，5 分钟拿到结果，我再花 20 分钟检查调整。节省出来的时间，我用在思考"这个重试策略在并发场景下会不会有问题""超时时间设多少合适"这些 AI 回答不好的问题上。</p>
<p>但坦白说，我也踩过坑。有段时间过度依赖 AI，一个简单的排序函数也让它写，结果面试前自己手写快排居然卡住了。这件事让我警醒：<strong>AI 是放大器，不是替代器。它可以放大你的能力，但前提是你自身有能力。</strong> 现在我给自己立了规矩——核心算法、业务关键逻辑、安全相关代码，必须关掉 AI 自己写。那些"如果不靠 AI 写不出来"的代码，恰恰是最该手写的东西。</p>

<p><strong>二、我对 AI 的底层看法：不会替代前端工程师，但会重新定义这个岗位。</strong></p>
<p>我的判断是三层：</p>
<p><strong>第一层——AI 能做的事：</strong>写 CRUD 页面、生成表单、写常规的工具函数、翻译技术文档。这些活 AI 已经做得比大部分初级工程师好了。如果一个人的日常工作 80% 是这个层面的内容，确实需要焦虑。</p>
<p><strong>第二层——AI 做不好的事：</strong>架构设计（在多个方案中做 trade-off）、性能优化的根因定位（需要理解业务场景和数据特征）、跨部门需求沟通（产品经理说的话和实际想要的是两回事）、安全事故的应急响应。这些需要的是经验判断力、系统思维、沟通能力，不是 token 预测能解决的。</p>
<p><strong>第三层——我的定位：</strong>我 5 年经验，做过从 0 到 1 的项目，主导过支付和实名这类高风险模块，带过团队规范建设。这些经历积累的判断力和推动力，才是我的核心竞争力。AI 对我而言是一个效率工具，让我从"写代码"升级到"用代码解决问题"。</p>

<blockquote>总结一句话：我不焦虑 AI 会替代我，我焦虑的是，如果有一天一个更会用 AI 的前端工程师替代了我，那才是真正的问题。所以我现在刻意训练的方向不是"写更多代码"，而是"用更少的时间做更正确的决策"。</blockquote>
`
      },
    ],
  },

  // ==================== 十、软技能高频问题 ====================
  {
    id: 'soft-skills',
    number: '十、',
    label: '软技能高频问题',
    questions: [
      {
        id: 'writing-habit',
        title: 'Q23: 你作为掘金人气作者，一般写什么？怎么保持技术沉淀？',
        answer: `
<p><strong>写什么：</strong>主要是实际项目踩坑总结和源码解读。比如写过"Vue3 Proxy 响应式原理从源码看起"、"UniApp 微信支付全流程踩坑指南"这类文章。</p>
<p><strong>怎么沉淀：</strong></p>
<ul>
  <li>遇到非 trivial 的 bug，解决后立刻记下复现步骤和根因分析</li>
  <li>每完成一个大功能模块，写一篇复盘笔记（技术决策的原因、方案的 trade-off）</li>
  <li>不是为写而写——只有当我认为"这篇文章对其他人有用"的时候才会发表</li>
</ul>
<p><strong>为什么面试官在意这个：</strong>证明你有持续学习习惯、能把复杂问题讲清楚、有社区影响力。</p>
`
      },
      {
        id: 'team-standards',
        title: 'Q24: 你牵头制定过前端规范，遇到了什么阻力？',
        answer: `
<p>在诚讯德，公司前端团队 6 个人，之前各写各的，代码风格差异很大。</p>

<p><strong>我推的规范包括：</strong></p>
<ol>
  <li>ESLint + Prettier 配置（提交时自动格式化，<code>lint-staged</code> + <code>husky</code>）</li>
  <li>Git 提交规范（commitlint + conventional commits）</li>
  <li>组件命名规范（大驼峰、业务前缀）</li>
  <li>目录结构约定（<code>src/views/模块名/</code> 下统一放该模块的所有文件）</li>
</ol>

<p><strong>遇到的阻力：</strong></p>
<ul>
  <li>老同事觉得"搞这么多限制浪费时间"</li>
  <li>推 ESLint 时，老项目一跑上千个报错，大家觉得没法修</li>
</ul>

<p><strong>解决方法：</strong></p>
<ol>
  <li><strong>自动化优先</strong>：ESLint 的 <code>--fix</code> 能自动修的让它自动修，减少人工介入</li>
  <li><strong>分阶段推进</strong>：新文件强制规范，老文件暂不强制（设 <code>warn</code> 而非 <code>error</code>）</li>
  <li><strong>沉没成本策略</strong>：先在新项目（企尚公众号）全面推行，大家看到了好处（Code Review 时间从 40 分钟降到 15 分钟），再推广到老项目</li>
  <li><strong>以身作则</strong>：我先把最难啃的老项目规范改完，形成示范</li>
</ol>
`
      },
    ],
  },
]
