<template>
  <div class="page">
    <el-row>
      <el-col :lg="12" :xs="24">
        <el-form ref="form" :model="form" :rules="rule" label-width="100px" class="edit-form">
          <el-form-item label="旧密码" prop="oldPassword">
            <el-input v-model="form.oldPassword" type="password"></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="newPassword">
            <el-input v-model="form.newPassword" type="password"></el-input>
          </el-form-item>
          <el-form-item label="确认新密码" prop="newPasswordConfirm">
            <el-input v-model="form.newPasswordConfirm" type="password"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">确认修改</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import axios from '@/util/axios'
import { api } from '@/config/api'
import {
  validator_password,
} from '@/config/rule'
import { mapActions } from 'vuex'

export default {
  data() {
    const validator_password_confirm = (rule, value, callback) => {
      if (value !== this.form.newPassword) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }

    return {
      form: {
        oldPassword: '',
        newPassword: '',
        newPasswordConfirm: '',
      },
      rule: {
        oldPassword: [
          {
            required: true,
            message: '请输入旧密码',
            trigger: 'blur',
          }
        ],
        newPassword: [
          {
            required: true,
            message: '请输入新密码',
            trigger: 'blur',
          },
          {
            validator: validator_password,
            trigger: 'blur',
          },
        ],
        newPasswordConfirm: [
          {
            required: true,
            message: '请输入确认新密码',
            trigger: 'blur',
          },
          {
            validator: validator_password_confirm,
            trigger: 'blur',
          },
        ],
      },
    }
  },
  methods: {
    ...mapActions(['LOGOUT']),
    async onSubmit() {
      this.$refs['form'].validate(async (valid) => {
        if (!valid) return false

        const { form } = this

        const [err1, res1] = await axios.post(api.User.editPwd, {
          ...form,
        })

        if (err1) {
          this.$message({
            showClose: true,
            message: err1,
            type: 'error',
          })
          return
        }

        this.$message({
          showClose: true,
          message: '修改密码成功,请重新登录',
          type: 'success',
        })

        const [err2, res2] = await this.LOGOUT()

        if (err2) {
          return
        }

        setTimeout(() => {
          this.$router.push({
            path: '/login',
          })
        }, 1000)
      })
    },
  },
}
</script>

<style lang="less" scoped>
.page {
  width: 100%;
  height: 100%;
  background-color: #fff;
  padding: 50px 20px;

  .edit-form {
    .el-select {
      width: 100%;
    }
  }
}
</style>