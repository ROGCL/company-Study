<template >
  <div class="home">
    <div class="search-wrap">
      <el-form :inline="true" :model="model" ref="searchForm" :label-width="width">
        <el-row>
          <slot></slot>
          <el-col :lg="mdSpan" :xl='mdSpan' :sm='12' :xs='24'>
            <el-form-item :class="flexFlag?'btnOption':''">
              <slot name="btn-option"></slot>
              <slot name="more_option"></slot>
              <el-button type="primary" @click="onSubmit">查询</el-button>
              <slot name="ggwgl"></slot>
              <!-- <el-button @click = "onReset" >重置</el-button > -->
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template >

<script >
export default {
  name: 'formLayout',
  props: {
    value: {
      type: Object,
    },
    width: {
      type: String,
    },
    mdSpan: {
      type: Number,
      default: 6,
    },
    flexFlag: {
      type: Boolean,
    },
  },
  data() {
    return {
      model: this.value,
    }
  },
  watch: {
    value(val) {
      this.model = val
    },
    model(val) {
      this.$emit('input', val)
    },
  },
  methods: {
    onSubmit() {
      this.$emit('onSubmit', this.model)
    },
    onReset() {
      this.$refs['searchForm'].resetFields()
    },
  },
}
</script >

<style lang = "less" scoped >
.home{
  width: 100%;
}
.search-wrap {
  background-color: #fff;
  padding: 22px 5px 0;

  .btn-option {
    margin-left: 20px;
  }

  /deep/.el-col {
    .el-form-item {
      width: 100%;
      display: flex;
      padding: 0 20px;

      .el-form-item__content {
        flex: 1;
        text-align: left;
        .el-select {
          width: 100%;
        }
        .el-range-editor.el-input__inner {
          width: 100%;
        }
      }
    }
  }
}
.btnOption {
  display: flex;
  flex-direction: column;
  align-items: flex-end;   
}

</style >
