<template >
  <el-container >
    <el-container >
      <el-header class = "header-wrap" >
        <Header @collapse = "onCollapse" :showCollapse = "false" />
      </el-header >
      <el-main >
        <div class = "breadcrumb-wrap" v-if="$route.name != 'general_view'">
          <el-breadcrumb separator-class = "el-icon-arrow-right" >
            <el-breadcrumb-item
              v-for = "(item, index) in breadcrumb"
              :key = "index"
            >
              {{ item['meta'].name }}
            </el-breadcrumb-item >
          </el-breadcrumb >
        </div >
        <router-view v-if = "!Object.keys($slots).length" />
        <slot v-else />
      </el-main >
    </el-container >
  </el-container >
</template >

<script >
	import Header from '../header'

	export default {
		components: {
			Header
		},
		data () {
			return {
				collapse: false,
				breadcrumb: []
			}
		},
		created () {
			this.getBreadcrumb()
		},
		watch: {
			$route (to, from) {
				this.getBreadcrumb()
			}
		},
		methods: {
			onCollapse (collapse) {
				this.collapse = collapse
			},
			getBreadcrumb () {
				this.breadcrumb = this.$route.matched
			}
		}
	}
</script >

<style lang = "less" scoped >
  .header-wrap {
    padding: 0;
  }

  .breadcrumb-wrap {
    padding: 20px;
    background-color: #fff;
    margin-bottom: 20px;
  }
</style >