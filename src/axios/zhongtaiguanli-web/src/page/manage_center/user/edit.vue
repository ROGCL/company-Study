<template>
  <div class="page">
    <div class="content">
      <el-form ref="userForm" :model="userForm" label-width="80px" :rules="userRules">
        <el-form-item label="账号" required prop="adminName">
          <el-input v-model="userForm.adminName" disabled></el-input>
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
          <el-button type="primary" size="small" @click="onSave">确认修改</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { api } from '@/config/api'
import { validator_mobile } from '@/config/rule'

export default {
  data() {
    return {
      userForm: {
        adminName: '',
        password: '',
        realname: '',
        phone: '',
        email: '',
      },
      userRules: {
        adminName: [{ required: true, message: '请输入账号' }],
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
      adminId: '',
    }
  },
  mounted() {
    this.adminId = this.$route.query.id
    this.fetchDetail()
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
    async fetchDetail() {
      const { adminId } = this

      if (!adminId) return

      const [err, res] = await this.$http.post(api.admin.detail, {
        adminId,
      })

      if (err) return

      this.userForm = {
        ...this.userForm,
        ...res,
      }
    },
    onSave() {
      this.$refs['userForm'].validate(async (valid, data) => {
        const { adminId } = this

        if (!adminId) return

        if (!valid) {
          return false
        }

        const [err, res] = await this.$http.post(api.admin.edit, {
          ...this.userForm,
          adminId,
        })

        if (err) return

        this.$message({
          message: '编辑成功',
          type: 'success',
        })

        this.$router.go(-1)
      })
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

    .operate {
      display: flex;
      align-items: center;

      /deep/.el-button {
        width: 200px;
        height: 40px;
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
}
</style>