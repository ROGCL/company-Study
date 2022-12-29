<template>
  <div class="header">
    <div class="home">
      <div
        v-if="showCollapse"
        class="icon-collapse"
        :class="{ active: !collapse }"
        @click="handleCollapse"
      >
        <i :class="collapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'"></i>
      </div>
      <el-menu
        :default-active="menuIndex"
        class="header-menu"
        mode="horizontal"
        background-color="#fff"
        text-color="rgba(0,0,0,.65)"
        active-text-color="#000"
        :router="true"
      >
        <el-menu-item :index="item.path" :key="i" v-for="(item, i) in menu">
          <i :class="item['meta'].icon" v-if="item['meta'].icon"></i>
          {{ item.meta.name }}
        </el-menu-item>
        <el-menu-item @click="onLinkQuickBI()">
          <i class="el-icon-s-promotion"></i>
          Quick BI
        </el-menu-item>
        <el-menu-item>
          <el-dropdown class="drop" placement="bottom-end" @command="goDOM">
            <div class="user-center"><i class="el-icon-tickets"></i> 开发文档</div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="edit_pwd" style="text-align:center"
                >数据中台开发文档</el-dropdown-item
              >
              <el-dropdown-item command="edit_base" style="text-align:center"
                >广告中台开发文档</el-dropdown-item
              >
              <span style="font-size:12px;padding:0 20px">文档访问密码都为
                <span style="font-weight: bolder; color:#1890ff">zhongtai.999</span>
              </span>
            </el-dropdown-menu>
          </el-dropdown>
        </el-menu-item>
      </el-menu>
    </div>
    <div class="end">
      <div class="notice" v-if="notice">
        <el-popover
          placement="right-end"
          width="220"
          v-model="visibleNotice"
          trigger="manual"
          popper-class="password-notice"
        >
          <div>
            <div>
              <b>密码的安全级别过低</b>
            </div>
            <div>请点击右侧前往修改密码</div>
          </div>
          <i
            class="el-icon-warning"
            slot="reference"
            @click="visibleNotice = !visibleNotice"
          ></i>
        </el-popover>
      </div>
      <el-dropdown class="drop" placement="bottom-end" @command="handleCommand">
        <div class="user-center">{{ user.name }}</div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item icon="el-icon-user" command="edit_pwd"
            >修改密码</el-dropdown-item
          >
          <el-dropdown-item icon="el-icon-user" command="edit_base"
            >个人中心</el-dropdown-item
          >
          <el-dropdown-item icon="el-icon-s-home" divided command="logout"
            >退出登录</el-dropdown-item
          >
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  props: {
    showCollapse: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      collapse: false,
      visibleNotice: false,
      notice: false,
    };
  },
  created() {
    if (!this.user.pass_intensity) {
      this.notice = true;
      setTimeout(() => {
        this.visibleNotice = true;
      }, 500);
    }
  },
  computed: {
    ...mapState({
      user: (state) => state.user.data,
    }),
    menu: (vm) =>
      vm.$router.options.routes.filter((v) => v.meta && v.meta.menu),
    menuIndex() {
      return this.$route.matched[0].path || "";
    },
  },
  methods: {
    ...mapActions(["LOGOUT"]),
    handleCollapse() {
      this.collapse = !this.collapse;

      this.$emit("collapse", this.collapse);
    },
    async handleCommand(command) {
      if (command === "logout") {
        const [err, res] = await this.LOGOUT();

        if (err) {
          return;
        }

        this.$router.push({ path: "/login" });
        return;
      }

      if (command === "edit_pwd") {
        this.$router.push({ path: "/user_center/edit_pwd" });
        return;
      }

      if (command === "edit_base") {
        this.$router.push({ path: "/user_center/edit_base" });
        return;
      }
    },
    goDOM(command) {
      if (command === "edit_pwd") {
        window.open("http://apidoc.nineton.cn/#/4");
        return;
      }

      if (command === "edit_base") {
        window.open("http://apidoc.nineton.cn/#/30");
        return;
      }
    },
    onLinkQuickBI() {
      window.open("https://bi.aliyun.com/view");
    },
  },
};
</script>

<style lang="less" scoped>
.img {
  width: 10px;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  padding-right: 20px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  height: 100%;
  .header-menu {
    :global {
      .el-menu.el-menu--horizontal {
        border-bottom: none;
      }

      .el-menu-item:hover {
        background-color: #fff !important;
      }
    }
  }

  .home {
    display: flex;
    align-items: center;
    height: 100%;
    .icon-collapse {
      color: rgba(0, 0, 0, 0.65);
      font-size: 20px;
      cursor: pointer;
      user-select: none;
      height: 100%;
      width: 80px;
      display: flex;
      align-items: center;
      justify-content: center;
      &:active,
      &:hover {
        background-color: #e6f7ff;
      }
      &.active {
        color: #1890ff;
      }
    }

    .app-check {
      margin: 0 20px;
    }
  }

  .end {
    height: 100%;
    display: flex;
    align-items: center;

    .notice {
      margin-right: 20px;
      i {
        color: #e6a23c;
        font-size: 24px;
      }
    }

    .drop {
      height: 100%;
      .user-center {
        width: 80px;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        &:active,
        &:hover {
          background-color: #e6f7ff;
        }
      }
    }
  }
}
</style>
