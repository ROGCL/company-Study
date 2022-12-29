<template >
  <div class = "table-wrap">
    <div class = "table-option" v-if = "$slots['table-option'] || leadOut" >
      <slot name = "table-option" ></slot >
      <LeadOut
        v-if = "leadOut"
        :params = 'params'
        :column = 'column'
      />
    </div >
    <el-table
      :data = "data"
      style = "width: 100%"
      v-loading = "loading"
      border
    >

      <el-table-column
        v-for = "(item, i ) in column"
        :key = "i"
        :prop = "item.prop"
        :label = "item.label"
        :span-method = "onSpanOption"
        :width = "item.width"
      >
        <template #default = "scope" >
          <slot :name = "item.prop" :row = "scope.row" >
            {{scope.row[item.prop]}}
          </slot >
        </template >
      </el-table-column >
    </el-table >
    <div class = "table-footer" >
      <el-pagination
        background
        layout = "prev, pager, next"
        :total = "total"
        :current-page = "currentPage"
        @current-change = "onPageChange"
      >
      </el-pagination >
    </div >
  </div >
</template >

<script >
	import LeadOut from '@/component/lead-out'

	export default {
		name: 'tableLayout',
		components: {
			LeadOut
		},
		props: {
			data: {
				type: Array
			},
			column: {
				type: Array
			},
			total: {
				type: Number,
				default: 0
			},
			currentPage: {
				type: Number,
				default: 1
			},
			loading: {
				type: Boolean
			},
			leadOut: {
				type: Boolean
			},
			params: {
				type: Object
      }
		},
		mounted () {
			const page = {
				code: 0,
				data: [{}],
				currentPage: 1,
				total: 100,
				pageSize: ''
			}
		},
		methods: {
			onPageChange (current) {
				this.$emit('pageChange', current)
			},
			onSpanOption (obj) {
				this.$emit('spanOption', obj)
			}
		}
	}
</script >

<style lang = "less" scoped >
  .table-wrap {
    margin-top: 20px;
    .table-option {
      background-color: #fff;
      padding: 10px;
      display: flex;
      align-items: center;
      flex-direction: row-reverse;
    }
    .table-footer {
      display: flex;
      flex-direction: row-reverse;
      background-color: #fff;
      padding: 20px;
    }
  }
</style >
