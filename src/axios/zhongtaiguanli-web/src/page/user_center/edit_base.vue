<template>
  <div class="page">
    <el-row>
      <el-col :lg="12" :xs="24">
        <el-form ref="form" :model="form" :rules="rules" label-width="100px" class="edit-form">
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="form.email" type="text"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="form.phone" type="text"></el-input>
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
import store from 'store2'
import { validator_mobile } from '@/config/rule'
import { mapActions, mapState, mapGetters } from 'vuex'

export default {
  data() {
    return {
      form: {
        email: '',
        phone: '',
      },
      rules: {
        email: [
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' },
        ],
        phone: [{ validator: validator_mobile, trigger: 'blur' }],
      },
    }
  },
  created() {
    const user = store.get('user') || {}
    const { email, phone } = user

    this.form = {
      email,
      phone,
    }
  },
  methods: {
    ...mapActions(['LOGOUT']),
    async onSubmit() {
      this.$refs['form'].validate(async (valid) => {
        if (!valid) return false

        const { form } = this

        const [err1, res1] = await axios.post(api.User.baseSave, {
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
          message: '用户信息修改成功',
          type: 'success',
        })
        let user = JSON.parse(localStorage.getItem('user'))
        res1.adminInfo.login_token = user.login_token
        res1.adminInfo.login_expire = user.login_expire
        localStorage.setItem('user', JSON.stringify(res1.adminInfo))
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