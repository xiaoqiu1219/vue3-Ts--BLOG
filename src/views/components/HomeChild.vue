<template>
  <div>
    子组件
    <p>姓名：{{ userName }}，号码：{{ userNumber }}</p>
    <input type="text" v-model="userName" />
    <input type="number" name="phone" v-model="userNumber" />
    <button @click="handleChildClick">子组件点击按钮</button>
    <button @click="handleEdit">子组件编辑</button>
    <hr />
    <p>父组件传来的值</p>
    <input type="text" v-model="localFatherInfo.name" />
    <input type="number" v-model="localFatherInfo.number" />
    <!-- 如果直接使用fatherInfo会爆红，因为不允许子组件修改父组件传输的数据 -->
    <button @click="handleFatherData">查看父组件传值</button>
  </div>
</template>
<script lang="ts">
export default {
  name: 'HomeChild',
}
</script>
<script lang="ts" setup>
import { ref } from 'vue'
import type { FatherData } from '@/views/types/homeChild.ts'
// 接收父组件值
// 默认接收，参数会爆红
// defineProps<{ fatherInfo: FatherData }>()
// defineProps(['fatherInfo'])
const props = defineProps<{ fatherInfo: FatherData }>()

// 只复制一次，无需 watch——将父组件 props 拷贝到本地 ref 以避免直接修改 props
const localFatherInfo = ref<FatherData>({ ...props.fatherInfo })
// 查看父组件传来的数据
function handleFatherData() {
  console.log('fatherInfo')
}
// 子组件内部值
const userName = ref('我是子组件')
const userNumber = ref(13333333333)

// 选择向外抛出的值
defineExpose({ userName, userNumber })

// 子组件向父组件传递事件
// 定义两种可能的 对象 类型
type EmptyObject = Record<string, never> // 严格空对象 {}
type InfoObject = {
  name?: string
  number: number
}
// 事件集合

const emit = defineEmits<{
  handleChildClick: [id: number, title: string]
  handleEdit: [info: EmptyObject | InfoObject]
}>()

// 向父组件发射点击事件，携带 id 和标题
const handleChildClick = () => emit('handleChildClick', 123, '点击子组件')
// 向父组件发射编辑事件，携带编辑对象数据
const handleEdit = () => emit('handleEdit', { name: '子组件名字', number: 1333333333 })
</script>
<style lang="less" scoped></style>
