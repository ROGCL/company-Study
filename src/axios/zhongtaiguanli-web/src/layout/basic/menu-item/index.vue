<template >
  <component :is="currentItemComponent" :index="menu.path" :key="menu.path">
    <template slot="title" v-if="hasChildren">
      <i :class="menu['meta'].icon" v-if="menu['meta'].icon"></i>
      <span slot="title">{{menu['meta'].name}}</span>
    </template>
    <template v-else>
      <i :class="menu['meta'].icon" v-if="menu['meta'].icon"></i>
      <span slot="title">{{menu['meta'].name}}</span>
    </template>
    <!-- 这里用了递归生成菜单项 -->
    <menu-item
      :menu="child"
      :key="child.name"
      v-for="child in menu.children"
      v-if="hasChildren && child['meta'] && child['meta'].menu"
    />
  </component>
</template >

<script >
import _ from 'lodash'

export default {
  name: 'menu-item',
  props: {
    menu: Object,
  },
  data() {
    return {
      hasChildren: false,
    }
  },
  computed: {
    currentItemComponent() {
      const hasChildren = this.getChildren()

      return hasChildren ? 'el-submenu' : 'el-menu-item'
    },
  },
  methods: {
    getChildren() {
      const children = this.menu['children'] || []
      const _children = children.filter((v) => v.meta && v.meta.menu)
      const is = !!_children.length

      this.hasChildren = is

      return is
    }
  },
}
</script >

<style lang = "less" scoped >
</style >