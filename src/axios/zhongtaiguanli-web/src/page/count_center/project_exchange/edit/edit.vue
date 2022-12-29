<template>
  <div class="edit">
    <div class="container">
      <h3>落地页名称</h3>
      <el-input placeholder class="weight" v-model="form.title" disabled></el-input>
      <h3>落地页URL</h3>
      <div class="copyUrl">
        <el-input placeholder="请输入内容" readonly v-model="form.url" ref="copy"></el-input>
        <el-button type="primary" style="margin-left: 10px;" @click="onCopy">复制</el-button>
      </div>
      <h3>选择展示样式</h3>
      <el-select v-model="form.style" placeholder="请选择">
        <el-option
          v-for="item in StyleOps"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <h3>渠道名称</h3>
      <el-input
        placeholder="仅限英文、数字、-，单次填写后不可变更"
        class="weight"
        v-model="form.origin"
        :disabled="Boolean(isEdit)"
        @focus="originNameOnFocus"
        @blur="originNameOnBlur"
      ></el-input>
      <h3>伪装地址</h3>
      <el-input placeholder="用于代替IP屏蔽后展示的网页" class="weight" v-model="form.joker_url"></el-input>
      <h3>
        落地页APP调序
        <el-button class="add-btn" type="primary" @click="onAdd">添加</el-button>
      </h3>
      <Dragger
        :animation="100"
        v-model="materialList"
        group="app"
        @start="drag=true"
        @end="drag=false"
      >
        <div class="list" v-for="(item, i) in materialList" :key="Math.random()">
          <el-select class="select" :value="item.id" @change="val => onHandleChange(val, i)">
            <el-option
              v-for="(_item, _i) in materialOriginList"
              :key="'b'+_item.id"
              :label="_item.app_name"
              :disabled="formatDisabled(_item.id)"
              :value="_item.id"
            ></el-option>
          </el-select>
          <el-button class="remove-btn" type="danger" @click="onRemove(i)">移除</el-button>
        </div>
      </Dragger>
    </div>
    <el-button type="primary" style="margin-top: 10px;" @click="onSubmit">保存</el-button>
    <span style="font-size: 12px; color: #999;margin-left: 10px;">（拖动调整显示顺序，保存后10分钟生效）</span>
  </div>
</template>

<script>
import {
  Transaction_Program_landInfo,
  Transaction_Program_materialList,
  Transaction_Program_landSave,
} from '@/config/api/index'
import Dragger from 'vuedraggable'

export default {
  components: {
    Dragger,
  },
  data() {
    return {
      form: {
        url: '',
        title: '',
        style: '1',
        origin: '',
        joker_url: '',
      },
      StyleOps: [
        {
          value: '1',
          label: '上下滑动大图',
        },
      ],
      materialOriginList: [],
      materialList: [],
      tips: false,
      isEdit: false,
    }
  },
  created() {
    this.fetchDetail()
  },
  methods: {
    async fetchDetail() {
      const [err, res] = await Transaction_Program_landInfo()

      if (err) return

      let {
        url = '',
        materials = [],
        style = '1',
        joker_url = '',
        origin = '',
      } = res

      this.form.url = url
      this.form.style = style
      this.form.joker_url = joker_url
      this.isEdit = this.form.origin = origin

      this.fetchMaterialList(materials)

      const app = this.$store.getters.getCurrentApp(this.$route.query.appId)
      let system = app.system == 1 ? 'Android_' : 'IOS_'
      this.form.title = system + app.title + '_内部换量'
    },
    async fetchMaterialList(selected) {
      const [err, res] = await Transaction_Program_materialList()

      if (err) return

      let materialList = []

      selected.forEach((v) => {
        const current = res.find((_) => _.id === v)

        if (current) {
          materialList.push(current)
        }
      })

      this.materialOriginList = res
      this.materialList = materialList
    },
    async onSubmit() {
      if (this.form.joker_url.indexOf('transaction.chucitech.cn') != -1) {
        this.$message.error('伪装地址不允许填写换量落地页的链接')
        return
      }
      const { materialList, form } = this

      if (materialList.some((v) => !v.id)) {
        this.$message({
          message: 'App选择不能为空',
          type: 'error',
        })
        return
      }

      const materials = materialList.map((v) => v.id)

      const [err, res] = await Transaction_Program_landSave({
        ...form,
        materials: materials.join(','),
      })

      if (err) {
        this.$message.error(err)
        return
      }

      this.$message({
        message: '保存成功',
        type: 'success',
      })

      this.fetchDetail()
    },
    onCopy() {
      this.$refs.copy.select()
      document.execCommand('Copy') // 执行浏览器复制命令
      this.$message({
        message: '复制成功',
        type: 'success',
      })
    },
    onAdd() {
      this.materialList.push({
        id: '',
        app_name: '',
        disabled: false,
      })
    },
    onRemove(index) {
      if (this.materialList.length > 1) {
        this.materialList.splice(index, 1)
      }
    },
    onHandleChange(val, index) {
      let { materialList, materialOriginList } = this

      // VUE对嵌套过深的数据更新问题处理
      this.$set(
        this.materialList,
        index,
        materialOriginList.find((v) => v.id === val)
      )
    },
    originNameOnFocus() {
      if (this.tips) return
      this.tips = true
      this.$alert('来源名称只可填写一次，填写后无法修改，请谨慎填写', '提示', {
        confirmButtonText: '确定',
      })
    },
    originNameOnBlur() {
      this.form.origin = this.form.origin.toLocaleUpperCase()
    },
    formatDisabled(val) {
      if (!val) return false

      return this.materialList.some((v) => v.id === val)
    },
  },
}
</script>

<style lang='scss' scoped>
.edit {
  background: #fff;
  padding: 20px;
}

.container {
  width: 450px;

  .copyUrl {
    display: flex;
  }

  .list {
    display: flex;
    margin-bottom: 10px;

    .select {
      flex-shrink: 0;
    }

    .remove-btn {
      margin-left: 10px;
    }
  }

  .add-btn {
    margin-left: 10px;
  }
}
</style>