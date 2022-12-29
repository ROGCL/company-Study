<template >
  <div class="sider-wrap">
    <div class="logo">
      <img src="./img/logo.png" alt />
    </div>
    <div class="app-check" v-show="showAppCheck">
      <SelectApp v-model="appId" @change="fetchMenu" />
    </div>
    <el-menu unique-opened class="sider" :collapse="collapse" background-color="#001529"
      text-color="rgba(255,255,255,.65)" active-text-color="#fff" :collapse-transition="false" :router="true"
      :default-active="$route.path" @select="onReportAction">
      <MenuItem v-for="item in partRoute" :menu="item" :key="item.name" v-if="item['meta'] && item['meta'].menu" />
    </el-menu>
  </div>
</template >

<script >
import MenuItem from '../menu-item'
import { mapState, mapActions } from 'vuex'
import { getRouteInfo } from '@/util/getRoutes'
import SelectApp from '@/component/select-app'

export default {
  components: {
    MenuItem,
    SelectApp,
  },
  props: {
    collapse: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isCollapse: false,
      appId: '',
      showAppCheck: false,
    }
  },
  mounted() {
    const { appId } = this.$route.query

    if (appId) {
      this.appId = appId
      this.getChannel({ appId: appId })
      this.getAppVersion({ appId: appId })
    }

    this.showAppCheck = this.$route.matched[0].name === 'count_center'
  },
  computed: {
    ...mapState({
      menu: (state) => state.user.menu,
    }),
    partRoute: function () {
      const routes = this.$router.options.routes
      console.log(routes)
      const menu = routes.filter(
        (v) => v.meta && v.meta.menu && this.$route.matched[0].path === v.path
      )

      return this.menu && !!menu && !!menu.length ? menu[0].children : []
    },
  },
  watch: {
    $route(data) {
      this.showAppCheck = data.matched[0].name === 'count_center'
    },
  },
  methods: {
    ...mapActions(['getChannel', 'getAppVersion', 'GET_AUTH_MENU']),
    onReportAction(path) {
      const currentApp = this.$store.getters.getCurrentApp(
        this.$route.query.appId
      )
      const info = getRouteInfo(path)

      if (info.meta) {
        this.$http.post('Action_Log/addAction', {
          target_name: info.meta.name,
          title: path.indexOf('count_center') > 0 ? currentApp.title : '',
        })
      }
    },
    async fetchMenu(val) {
      const loading = this.$loading({
        lock: true,
        text: '获取权限中...',
        background: 'rgba(0, 0, 0, 0.7)',
      })

      const [err, res] = await this.GET_AUTH_MENU({ appId: val || '' })

      loading.close()

      if (err) {
        this.$notify.error({
          title: '获取权限出错',
          message: err,
        })
        return
      }

      if (val) {
        this.getChannel({ appId: val })
        this.getAppVersion({ appId: val })
      }

      this.$router.replace(res[0].path + '?appId=' + val)
    },
  },
}
</script >

<style lang = "less" scoped >
.sider-wrap .sider {
  overflow-y: scroll;
}
.sider-wrap .sider::-webkit-scrollbar {
    display: none; /* Chrome Safari */
}

.sider-wrap {
  height: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  box-shadow: 2px 0 6px rgba(0, 21, 41, 0.3);

  .logo {
    width: 100%;
    height: 60px;
    flex-shrink: 0;
    background: #002140;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-left: 22px;
    white-space: nowrap;
    overflow: hidden;
    cursor: pointer;

    img {
      width: 150px;
      height: 15px;
    }
  }

  .app-check {
    width: 100%;
    background-color: #002140;
    padding: 10px 15px;

    /deep/ .el-select {
      width: 100%;

      .el-input__inner {
        background-color: #3d4973;
        border: none;
        color: rgba(255, 255, 255, 0.65);
      }

      .el-input__prefix {
        display: flex;
        align-items: center;
        left: 0;
        width: 30px;
        justify-content: center;

        .iconfont {
          color: rgba(255, 255, 255, 0.65);
        }
      }
    }
  }

  .sider {
    width: 100%;
    flex: 1;
    flex-basis: 0;
    border-right: none;

    /deep/ .el-menu {
      .el-submenu__title {
        &:hover {
          background-color: initial !important;
        }
      }

      .collapse-transition {
        color: initial;
      }

      .el-menu-item {
        &.is-active {
          background-color: #1890ff !important;
        }
      }
    }
  }
}
</style >