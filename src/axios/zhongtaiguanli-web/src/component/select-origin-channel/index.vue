<template>
  <el-select
    v-model="insideValue"
    placeholder="全部渠道"
    :popper-append-to-body="false"
    :reserve-keyword="true"
    filterable
    multiple
    collapse-tags
    :filter-method="onFilter"
  >
    <div class="check-all">
      <el-checkbox v-model="all" @input="onInputAll">全部勾选</el-checkbox>
    </div>
    <el-option v-for="(v, i) in options" :key="i" :label="v" :value="v" />
  </el-select>
</template>

<script>
export default {
  props: {
    value: {
      type: [String, Number, Array],
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
    params: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      insideValue: '',
      options: [],
      optionsCopy: [],
      all: false,
    }
  },
  mounted() {
    this.fetchChannel()

    this.insideValue = this.value
  },
  watch: {
    value(val) {
      this.insideValue = val
    },
    insideValue(val) {
      if (val.length) {
        this.all = this.isSameArray(val, this.options)
      }

      this.$emit('input', val)
    },
  },
  methods: {
    async fetchChannel() {
      const [err, res] = await this.$http.post('Ip/originList', {
        ...this.params
      })

      if (err) return

      this.options = res
      this.optionsCopy = res
    },
    onFilter(query) {
      if (query) {
        //val存在
        this.options = this.optionsCopy.filter((item) => {
          if (
            !!~item.indexOf(query) ||
            !!~item.toUpperCase().indexOf(query.toUpperCase())
          ) {
            return true
          }
        })
      } else {
        this.options = this.optionsCopy
      }
    },
    onInputAll(val) {
      if (val) {
        this.insideValue = this.options
      } else {
        this.insideValue = []
      }
    },
    isSameArray(originArr1, originArr2) {
      const arr1 = originArr1.concat([])
      const arr2 = originArr2.concat([])

      const _arr1 = arr1.sort().join('')
      const _arr2 = arr2.sort().join('')

      return _arr1 === _arr2
    },
  },
}
</script>

<style lang="less" scoped>
.check-all {
  padding: 0 20px;
  text-align: right;
}
</style>