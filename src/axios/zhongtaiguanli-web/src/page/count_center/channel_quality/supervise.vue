<template>
  <div>
    <div class="container">
      <div class="top">
        <div class="formula-view">
          <h2 class="tips">公式预览:</h2>
          <div class="box">
            <p v-for="(item, index) in views" :key="index">{{ item }}</p>
          </div>
        </div>
      </div>
      <div class="bottom">
        <div class="parent-wrap" v-for="(item ,index) in List" :key="index">
          <div class="parent">
            <div class="title">{{ item.index_name }}</div>
            <div class="scale">
              <span>权重</span>
              <el-input v-model="item.weight" placeholder="比例"></el-input>
              <span>%</span>
            </div>
          </div>
          <div class="childs">
            <div
              class="child-item"
              v-for="(child_item, child_index) in item.children"
              :key="child_index"
            >
              <div class="hd">
                <div class="title">二级指标</div>
                <div class="handle">
                  <div
                    class="remove"
                    @click="remove(index, child_index)"
                    v-if="child_index !== item.children.length - 1 || item.children.length > 1"
                  >-</div>
                  <div
                    class="add"
                    @click="add(index)"
                    v-if="child_index == item.children.length - 1"
                  >+</div>
                </div>
              </div>
              <div class="content-wrap">
                <ul class="content-list">
                  <li class="content-item">
                    <div class="item">
                      <el-radio v-model="child_item.type" :label="1">中台数据</el-radio>
                      <el-select
                        v-model="child_item.quality_index_id_type_1"
                        placeholder="请选择"
                        :disabled="child_item.type !== 1"
                        @change="selectChange(index, child_index, $event)"
                      >
                        <el-option
                          v-for="option in child_item.zhongtai_options"
                          :key="option.value"
                          :label="option.label"
                          :value="option.value"
                          :disabled="option.disabled"
                        ></el-option>
                      </el-select>
                    </div>
                    <div class="item">
                      <el-radio v-model="child_item.type" :label="2">上传数据</el-radio>
                      <el-select
                        v-model="child_item.quality_index_id_type_2"
                        placeholder="请选择"
                        :disabled="child_item.type !== 2"
                        @change="selectChange(index, child_index, $event)"
                      >
                        <el-option
                          v-for="option in child_item.diy_options"
                          :key="option.value"
                          :label="option.label"
                          :value="option.value"
                          :disabled="option.disabled"
                        ></el-option>
                      </el-select>
                    </div>
                    <div class="item maxValueOrMinValue">
                      <div>
                        <span>最小值：</span>
                        <el-input
                          v-model="child_item.min_value"
                          placeholder="请输入内容"
                          @change="checkMax_valueOrMin_value(index, child_index)"
                        ></el-input>
                      </div>
                      <div>
                        <span>最大值：</span>
                        <el-input
                          v-model="child_item.max_value"
                          placeholder="请输入内容"
                          @change="checkMax_valueOrMin_value(index, child_index)"
                        ></el-input>
                      </div>
                    </div>
                    <div class="item scale-wrap">
                      <div class="scale">
                        <span>权重</span>
                        <el-input v-model="child_item.weight" placeholder="比例"></el-input>
                        <span>%</span>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div class="btn">
          <el-button type="primary" @click="submit">保存修改</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  Quantity_Statistics,
  Quantity_Statistics_levelSecondList,
  Quantity_Statistics_createAlgorithm,
} from '@/config/api/index'

export default {
  data() {
    return {
      List: [],
      parent: true,
      child: true,
      views: [],
      selectList: {},
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      // 改变过后的select数据结构
      let selectList = {}
      // 获取select数据,然后改变数据结构
      await Quantity_Statistics_levelSecondList().then((res) => {
        for (const key in res[1]) {
          selectList[key] = []
          for (const key_key in res[1][key]) {
            selectList[key].push({
              value: Number(key_key),
              label: res[1][key][key_key],
            })
          }
        }
      })
      this.selectList = selectList
      await Quantity_Statistics().then((res) => {
        res[1].forEach((item) => {
          // 如果没有二级指标的话就给一个默认的
          if (!item.children.length) {
            item.children.push({
              type: 1,
              quality_index_id: '',
              quality_index_id_type_1: '',
              quality_index_id_type_2: '',
              zhongtai_options: this.selectList.zhongtai,
              diy_options: this.selectList.diy,
              time_range: ['2020-05-01', '2020-05-02'],
              index_name: '',
              max_value: 1,
              min_value: 0.01,
              weight: 100,
            })
          }
          item.children.forEach((item_child) => {
            let { type, quality_index_id } = item_child
            // 中台数据的v-model,和上传数据的v-model用的是同一个,在选择的时候他们会互相影响, 所以要分开使用不同的v-model
            switch (type) {
              case 1:
                item_child.quality_index_id_type_1 = quality_index_id
                item_child.quality_index_id_type_2 = ''
                break
              case 2:
                item_child.quality_index_id_type_2 = quality_index_id
                item_child.quality_index_id_type_1 = ''
                break
            }
            item_child.zhongtai_options = selectList.zhongtai
            item_child.diy_options = selectList.diy
            item_child.time_range = ['2020-05-01', '2020-05-02']
          })
        })

        this.List = res[1]
      })
      this.getViews()
    },
    // 计算权重 看有没有大于或小于100
    weightCompute(sumArr) {
      // 规定必须得刚好等于 100
      const result = 100
      const reducer = (accumulator, currentValue) => accumulator + currentValue
      return sumArr.reduce(reducer) == result
    },
    // 一级指标权重
    parentWeight() {
      let sum = []
      for (let i = 0; i < this.List.length; i++) {
        const { weight } = this.List[i]
        sum.push(Number(weight))
      }
      if (!this.weightCompute(sum)) {
        this.$notify.error({
          title: '错误',
          message: '一级权重大于或小于100，请重新输入',
        })
        this.parent = false
      } else {
        this.parent = true
      }
    },
    // 二级指标权重
    childChange() {
      let sum = []
      this.List.forEach((item) => {
        let weightSum = 0
        item.children.forEach(({ weight }) => {
          weightSum += Number(weight)
        })
        sum.push(weightSum)
      })

      for (let i = 0; i < sum.length; i++) {
        if (sum[i] != 100) {
          this.child = false
          break
        } else {
          this.child = true
        }
      }
    },
    selectChange(parent_index, child_index, val) {
      let data = this.List[parent_index].children[child_index]
      let { type, zhongtai_options, diy_options } = data
      data.quality_index_id = val
      switch (type) {
        case 1:
          for (let i = 0; i < zhongtai_options.length; i++) {
            if (zhongtai_options[i].value == val) {
              data.index_name = zhongtai_options[i].label
              break
            }
          }
          break
        case 2:
          for (let i = 0; i < diy_options.length; i++) {
            if (diy_options[i].value == val) {
              data.index_name = diy_options[i].label
              break
            }
          }
          break
      }
    },
    checkMax_valueOrMin_value(parent_index, child_index) {
      let { max_value, min_value } = this.List[parent_index].children[
        child_index
      ]
      if (max_value < min_value) {
        this.$notify.error({
          title: '错误',
          message: '最大值必须大于最小值',
        })
        this.child = false
      } else {
        this.child = true
      }
    },
    // 增加二级指标
    async add(parent_index) {
      let data = this.List[parent_index].children
      data.push({
        type: 1,
        quality_index_id: '',
        quality_index_id_type_1: '',
        quality_index_id_type_2: '',
        zhongtai_options: this.selectList.zhongtai,
        diy_options: this.selectList.diy,
        time_range: ['2020-05-01', '2020-05-02'],
        index_name: '',
        max_value: 1,
        min_value: 0.01,
        weight: 0,
      })
    },
    // 删除二级指标
    remove(parent_index, child_index) {
      this.List[parent_index].children.splice(child_index, 1)
    },
    getViews() {
      let views = []
      this.List.forEach(({ index_name, weight, children }) => {
        let str = `${index_name}${weight}% (`
        let childStr = []
        children.forEach(({ quality_index_id, weight, index_name }) => {
          childStr.push(`${index_name} ${weight}% `)
        })
        str += ` ${childStr.join('+')})`
        views.push(str)
      })
      this.views = views
    },
    submit() {
      this.parentWeight()
      this.childChange()
      if (this.parent && this.child) {
        Quantity_Statistics_createAlgorithm({
          data: this.List,
        }).then((res) => {
          if (res[2] == 1) {
            this.$message({
              message: '保存成功',
              type: 'success',
            })
            this.getList()
          }
        })
      } else if (!this.child) {
        this.$notify.error({
          title: '错误',
          message: '二级权重大于或小于100，请重新输入',
        })
      }
    },
  },
}
</script>

<style lang='scss' scoped>
li {
  list-style: none;
}

.top,
.bottom {
  background-color: #fff;
  padding: 22px;
}

.top {
  display: flex;
  align-items: center;
  margin-bottom: 20px;

  .formula-view {
    display: flex;

    .tips {
      font-size: 14px;
      margin-right: 20px;
    }

    .box {
      padding: 0 20px;
      max-height: 200px;
      border: 1px solid #ccc;
      overflow-y: scroll;
    }
  }
}

.bottom {
  .el-input {
    width: 70px;
    margin-right: 5px;
  }

  .parent-wrap {
    .parent {
      width: 300px;
      display: flex;
      position: relative;

      .title {
        line-height: 40px;
      }

      .scale {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);

        .el-input {
          margin: 0 10px;
        }
      }
    }

    .childs {
      min-height: 300px;
      border-left: 1px solid #ccc;
      margin: 0 0 0 30px;
      position: relative;
      padding-top: 30px;

      .child-item {
        margin-bottom: 20px;

        .hd {
          display: flex;
          align-items: center;

          .handle {
            display: flex;
            margin-left: 15px;

            .add,
            .remove {
              width: 20px;
              height: 20px;
              border: 2px solid #ccc;
              border-radius: 50%;
              text-align: center;
              color: #ccc;
              cursor: pointer;
            }

            .add {
              border-color: #409eff;
              color: #409eff;
              margin-left: 10px;
            }

            .remove {
              line-height: 12px;
              border-color: #f56c6c;
              color: #f56c6c;
            }
          }

          &::before {
            content: '';
            display: inline-block;
            width: 60px;
            height: 1px;
            background: #ccc;
            margin-right: 5px;
          }
        }

        .content-wrap {
          margin: 30px 0 0 70px;

          .content-item {
            width: 300px;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            position: relative;

            .item {
              display: flex;
              align-items: center;
              margin-bottom: 20px;
            }

            .scale-wrap {
              .scale {
                position: absolute;
                right: -17px;

                .el-input {
                  margin: 0 10px;
                }
              }
            }

            .maxValueOrMinValue {
              > div {
                margin: 10px 0;
              }

              display: block;

              .el-input {
                width: 100px;
              }
            }
          }
        }
      }
    }
  }

  .btn {
    padding-left: 50%;

    .el-button {
      transform: translateX(-50%);
    }
  }
}
</style>