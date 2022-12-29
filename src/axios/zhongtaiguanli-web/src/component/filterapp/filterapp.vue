<template>
  <el-form-item :label="label">
    <el-select v-model="id" filterable placeholder="请选择App" @change="change" :disabled="disabled">
      <template #prefix>
        <span class="iconfont" :class="currentAppIcon"></span>
      </template>
      <el-option v-for="item in Apps" :key="item.value" :label="item.label" :value="item.value">
        <span style="float: left" :class="item.icon"></span>
        <span style="float: left">{{ item.label }}</span>
      </el-option>
    </el-select>
  </el-form-item>
</template>

<script>
import { System_apps } from '@/config/api/index'
import { getAppIcon } from './util'
export default {
  props: {
    label: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    optionAll: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      id: '',
      Apps: [],
      currentAppIcon: '',
    }
  },
  created() {
    this.getApps()
  },
  methods: {
    getApps() {
      System_apps().then((res) => {
        if (res[2] === 1) {
          this.Apps = res[1].map(({ id, title, system }) => {
            return {
              value: id,
              label: title,
              icon: getAppIcon(system),
              systemName: system == '1' ? '安卓' : '苹果',
            }
          })

          if (this.optionAll) {
            this.Apps.unshift({
              label: '全部',
              value: '',
            })
          }
          this.change(this.Apps[0].value)
          this.id = this.Apps[0].value
        }
      })
    },
    change(appId) {
      this.currentAppIcon = this.Apps.filter(
        ({ value }) => appId == value
      )[0].icon
      let currentAppName =
        this.Apps.filter(({ value }) => appId == value)[0].label +
        `【${this.Apps.filter(({ value }) => appId == value)[0].systemName}】`
      this.$nextTick(() => {
        this.$emit('update:appId', this.id)
        this.$emit('update:currentAppName', currentAppName)
      })
    },
  },
}
</script>

<style lang='scss' scoped>
</style>