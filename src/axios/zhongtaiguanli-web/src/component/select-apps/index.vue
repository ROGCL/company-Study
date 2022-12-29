<template>
  <el-select
    class="app-control"
    v-model="insideValue"
    filterable
    :popper-append-to-body="false"
    placeholder="请选择"
    :disabled="disabled"
    @change="onHandleChange"
    multiple
    collapse-tags
    :clearable='true'
  >
    <template #prefix>
      <span v-if="systemIcon" class="iconfont" :class="systemIcon"></span>
    </template>
    <el-option label="全部" v-if="haveAll" value="all"></el-option>
    <el-option v-for="item in App" :key="item.id" :value="item.id" :label="item.title">
      <span class="iconfont" :class="formatSystemIcon(item.system)">{{ item.title }}</span>
    </el-option>
  </el-select>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  props: {
    value: {
      type: [String, Number,Array],
      default: '',
    },
    haveAll: {
      type: Boolean,
      default: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      insideValue: [],
      list: [],
    }
  },
  mounted() {
    if (!this.App.length) {
      this.fetchApp()
    }

    this.insideValue = this.value
  },
  watch: {
    value(val) {
      this.insideValue = val
    },
    insideValue(val) {
      this.$emit('input', val)
    },
  },
  computed: {
    ...mapState({
      App: (state) => state.app.data,
    }),
    systemIcon(vm) {
      const { App, insideValue } = vm
      const _currentApp = App.find((v) => v.id === insideValue)

      if (!_currentApp) return ''

      return this.formatSystemIcon(_currentApp.system)
    },
  },
  methods: {
    ...mapActions(['getApp']),
    async fetchApp() {
      const [err, res] = await this.getApp()

      this.tableData.loading = false

      if (err) return

      this.list = res
    },
    formatSystemIcon(code) {
      switch (String(code)) {
        case '1':
          return 'icon-anzhuo'
        case '2':
          return 'icon-ios'
        case '3':
          return 'icon-weixin'
        case '4':
          return 'icon-baidu'
        case '5':
          return 'icon-chrome'
        default:
          return ''
      }
    },
    onHandleChange(val) {
      for (var key of val) {
        if (key == 'all') {
          let arr = []
          this.insideValue = []
          this.App.forEach((item) => {
            arr.push(item.id)
          })
          this.insideValue = [...arr]
          this.$emit('change', arr)
        }else{
          this.$emit('change', val)

        }
      }

    },
  },
}
</script>

<style lang="less" scoped>
/deep/.app-control {
  width: 100%;

  .el-select-dropdown__item.selected {
    .iconfont {
      font-weight: normal;
    }
  }
  .iconfont {
    font-weight: normal;
  }
}
</style>