<template>
  <div class="page">
    <div class="step">
      <div
        class="step-item"
        :class="{'active': stepActive ===i}"
        v-for="(item, i) in steps"
        :key="i"
        :data-rank="i+1"
      >{{item}}</div>
    </div>
    <div class="content">
      <el-form
        ref="userForm"
        :model="userForm"
        label-width="80px"
        :rules="userRules"
        v-if="stepActive=== 0"
      >
        <el-form-item label="账号" required prop="adminName">
          <el-input v-model="userForm.adminName"></el-input>
        </el-form-item>
        <el-form-item label="密码" required prop="password">
          <el-input v-model="userForm.password" disabled></el-input>
        </el-form-item>
        <el-form-item label="真实姓名" required prop="realname">
          <el-input v-model="userForm.realname"></el-input>
        </el-form-item>
        <el-form-item label="手机号" required prop="phone">
          <el-input v-model="userForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" required prop="email">
          <el-input v-model="userForm.email"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="onSave">保存并下一步</el-button>
        </el-form-item>
      </el-form>
      <!-- :model="authForm"  -->
      <el-form ref="authForm"  label-width="80px" v-if="stepActive===1">
        <el-form-item label>
          <el-tree
            ref="AuthTree"
            :data="AuthTree"
            :props="treeProps"
            show-checkbox
            node-key="id"
            default-expand-all
          ></el-tree>
        </el-form-item>
        <el-form-item label="选择APP">
          <el-select
            v-model="currentApp"
            placeholder="请选择"
            @change="onChangeApp"
            class="app-control"
            filterable
          >
            <template #prefix>
              <span class="iconfont" :class="systemIcon"></span>
            </template>
            <el-option v-for="item in app" :key="item.id" :value="item.id" :label="item.title">
              <span
                class="iconfont"
                :class="formatSystem(item.system)"
              >{{ item.title }}{{ item.type === 1 ? '(已分配权限)': ''}}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-tree
            ref="AppAuthTree"
            :data="AppAuthTree"
            :props="treeProps"
            show-checkbox
            node-key="id"
            default-expand-all
          ></el-tree>
        </el-form-item>
        <el-form-item class="operate">
          <el-button type="primary" size="small" @click="onSubmitAuth">保存至当前APP</el-button>
          <el-button type="primary" size="small" @click="showCopy = true">保存并复制当前权限到其他APP</el-button>
          <el-button type="primary" size="small" @click="onToThreeStep">下一步</el-button>
        </el-form-item>
      </el-form>
      <div class="account-info" v-if="stepActive===2">
        <div class="tip">请复制账号密码交付用户，并提醒用户及时登录修改密码。</div>
        <div class="copy-password">
          <el-input ref="copyInput" type="textarea" rows="5" :value="accountInfo" readonly></el-input>
          <div>
            <el-button type="primary" size="small" class="copy-btn" @click="onCopy">复制</el-button>
          </div>
        </div>
      </div>
    </div>
    <el-dialog :visible.sync="showCopy" title="请选择">
      <el-select class="copy-control" v-model="copyApp" placeholder="请选择" multiple filterable>
        <el-option v-for="item in app" :key="item.id" :value="item.id" :label="item.title">
          <span
            class="iconfont"
            :class="formatSystem(item.system)"
          >{{ item.title }}{{ item.type === 1 ? '(已分配权限)': ''}}</span>
        </el-option>
      </el-select>
      <div slot="footer" class="dialog-footer">
        <div class="option-item">
          <el-button type="primary" @click="onCopyAll">全选</el-button>
          <el-button type="danger" @click="copyApp = []">清空</el-button>
        </div>
        <div class="option-item">
          <el-button type="primary" @click="onSubmitCopyAuth" :loading='btnLoading'>保 存</el-button>
          <el-button @click="showCopy = false">取 消</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { api } from '@/config/api'
import {
  validator_username,
  validator_password,
  validator_mobile,
} from '@/config/rule'

export default {
  data() {
    return {
      steps: ['填写用户信息', '编辑权限信息', '获取账号密码'],
      stepActive: 0,
      userForm: {
        adminName: '',
        password: '',
        realname: '',
        phone: '',
        email: '',
      },
      userRules: {
        adminName: [
          { validator: validator_username, trigger: 'blur' },
          { required: true, message: '请输入账号' },
        ],
        password: [
          { validator: validator_password, trigger: 'blur' },
          { required: true, message: '请输入密码' },
        ],
        email: [
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' },
          { required: true, message: '请输入邮箱' },
        ],
        realname: [{ required: true, message: '请输入真实姓名' }],
        phone: [
          { validator: validator_mobile, trigger: 'blur' },
          { required: true, message: '请输入手机号' },
        ],
      },
      currentApp: '',
      AuthTree: [],
      AppAuthTree: [],
      treeProps: {
        children: 'children',
        label: 'name',
      },
      showCopy: false,
      copyApp: [],
      app: [],
      adminId: '',
      loading: false,
      accountInfo: '',
      authSaved: false,
      btnLoading:false,
    }
  },
  mounted() {
    this.userForm.password = this.randomPassword(16)
  },
  computed: {
    systemIcon(vm) {
      const { app, currentApp } = vm
      const _currentApp = _.find(app, (v) => v.id === currentApp)

      if (!_currentApp) return ''

      return this.formatSystem(_currentApp.system)
    },
  },
  methods: {
    onSave() {
      this.$refs['userForm'].validate(async (valid, data) => {
        if (!valid) {
          return false
        }

        const [err, res] = await this.$http.post(api.admin.edit, {
          ...this.userForm,
        })

        if (err) return

        this.$message({
          message: '创建成功，请分配权限',
          type: 'success',
        })

        this.accountInfo = `中台地址：https://madmin.nineton.cn，账号：${this.userForm.adminName}，密码：${this.userForm.password}\n中台chrome插件使用：https://shimo.im/docs/zdkyB4zM44iYgPA6`
        this.stepActive = 1
        this.adminId = res.adminId
        this.fetchApp()
      })
    },
    async fetchApp() {
      const { adminId } = this

      if (!adminId) return

      const [err, res] = await this.$http.post(api.admin.app, {
        adminId,
      })

      if (err) return

      this.app = res

      if (res.length) {
        this.currentApp = res[0].id
        this.fetchAuth()
      }
    },
    async fetchMenu() {
      const { currentApp } = this

      if (!currentApp) return

      const [err, res] = await this.$http.post(api.admin.menu, {
        appId: currentApp,
      })

      if (err) return

      this.AuthTree = res.splice(0, res.length - 1)
      this.AppAuthTree = res.splice(res.length - 1, res.length)
    },
    async fetchAuth() {
      const { currentApp, adminId } = this

      if (!currentApp) return

      await this.fetchMenu()

      const [err, res] = await this.$http.post(api.admin.auth_detail, {
        appId: currentApp,
        adminId,
      })

      if (err) return

      const { adminAuth = '', authArr = '' } = res

      this.$refs['AuthTree'].setCheckedKeys(adminAuth.split(','))
      this.$refs['AppAuthTree'].setCheckedKeys(authArr.split(','))
    },
    async onSubmitAuth() {
      const { currentApp, adminId } = this

      const adminAuth = this.$refs['AuthTree'].getCheckedKeys().join(',')
      const authArr = this.$refs['AppAuthTree'].getCheckedKeys().join(',')

      if (!currentApp) return

      const [err, res] = await this.$http.post(api.admin.edit_auth, {
        appId: currentApp,
        adminId,
        adminAuth,
        authArr: {
          [currentApp]: authArr,
        },
      })

      if (err) return

      this.authSaved = true
      this.$message({
        message: '保存权限成功',
        type: 'success',
      })
      this.fetchApp()
    },
    onChangeApp(val) {
      this.currentApp = val
      this.$refs['AppAuthTree'].setCheckedKeys([])

      this.fetchAuth()
    },
    async onSubmitCopyAuth() {
      const { currentApp, adminId, copyApp } = this
      this.btnLoading = true;
      const adminAuth = this.$refs['AuthTree'].getCheckedKeys().join(',')
      const authArr = this.$refs['AppAuthTree'].getCheckedKeys().join(',')

      if (!currentApp) return

      let _copyApp = {}

      copyApp.forEach((v) => {
        _copyApp[v] = authArr
      })

      const [err, res] = await this.$http.post(api.admin.edit_auth, {
        appId: currentApp,
        adminId,
        adminAuth,
        authArr: {
          [currentApp]: authArr,
          ..._copyApp,
        },
      })

      if (err) return

      this.$message({
        message: '保存成功',
        type: 'success',
      })
      this.authSaved = true;
      this.btnLoading = false;
      this.copyApp = []
      this.showCopy = false
      this.fetchApp()
    },
    onCopyAll() {
      this.copyApp = this.app.map((v) => v.id)
    },
    formatSystem(code) {
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
    randomPassword(length) {
      length = Number(length)
      // Limit length
      if (length < 6) {
        length = 6
      } else if (length > 16) {
        length = 16
      }
      let passwordArray = [
        'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        'abcdefghijklmnopqrstuvwxyz',
        '1234567890',
      ]
      var password = []
      let n = 0

      for (let i = 0; i < length; i++) {
        // If password length less than 9, all value random
        if (password.length < length - 3) {
          // Get random passwordArray index
          let arrayRandom = Math.floor(Math.random() * 3)
          // Get password array value
          let passwordItem = passwordArray[arrayRandom]
          // Get password array value random index
          // Get random real value
          let item =
            passwordItem[Math.floor(Math.random() * passwordItem.length)]
          password.push(item)
        } else {
          // If password large then 9, lastest 4 password will push in according to the random password index
          // Get the array values sequentially
          let newItem = passwordArray[n]
          let lastItem = newItem[Math.floor(Math.random() * newItem.length)]
          // Get array splice index
          let spliceIndex = Math.floor(Math.random() * password.length)
          password.splice(spliceIndex, 0, lastItem)
          n++
        }
      }

      return password.join('')
    },
    onCopy() {
      this.$refs['copyInput'].select()
      document.execCommand('Copy') // 执行浏览器复制命令
      this.$message({
        message: '复制成功',
        type: 'success',
      })
    },
    onToThreeStep() {
      if (!this.authSaved) {
        this.$message({
          message: '还未保存该用户的APP权限。请保存后再进行下一步',
          type: 'warning',
        })
        return
      }

      this.stepActive = 2
    },
  },
}
</script>

<style lang='scss' scoped>
$step-active-color: #1890ff;

.page {
  padding: 20px;
  background: #fff;

  .step {
    width: 100%;
    max-width: 800px;
    height: 60px;
    display: flex;
    align-items: center;
    margin-bottom: 40px;
    background-color: #efefef;

    .step-item + .step-item {
      &::after {
        position: absolute;
        content: '';
        width: 32px;
        height: 32px;
        left: -32px;
        top: 50%;
        transform: translateY(-50%);
        background: url('./img/step-arrow.png') no-repeat center;
        background-size: cover;
      }
    }

    &-item {
      flex-basis: 0;
      flex: 1;
      position: relative;
      padding-left: 70px;

      &.active {
        color: $step-active-color;

        &::before {
          color: $step-active-color;
          border-color: $step-active-color;
        }
      }

      &::before {
        content: attr(data-rank);
        position: absolute;
        left: 20px;
        top: 50%;
        transform: translateY(-50%);
        width: 30px;
        height: 30px;
        border-radius: 50%;
        border: 2px solid #555;
        color: #555;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }

  .content {
    width: 500px;

    /deep/.operate {
      display: flex;
      align-items: center;

      .el-button + .el-button {
        margin-left: 10px;
      }
    }
  }

  /deep/ .app-control {
    width: 100%;
  }

  /deep/ .copy-control {
    width: 100%;

    .el-select__tags {
      width: 100%;
    }

    .el-input__inner {
      height: 100px;
    }
  }

  .dialog-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .option-item {
      display: flex;
      align-items: center;
    }
  }

  .account-info {
    width: 100%;

    .tip {
      color: #666;
      font-size: 14px;
      margin-bottom: 10px;
    }
    .copy-password {
      width: 100%;
      display: flex;
      align-items: center;

      .copy-btn {
        margin-left: 10px;
      }
    }
  }
}
</style>