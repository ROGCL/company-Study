<template>
  <div class="fugou">
    <div class="filter">
      <p>来源用户时间</p>
      <div class="item" v-for="(item, index) in origin_times" :key="index">
        <el-date-picker v-model="origin_times[index]" value-format="yyyy-MM-dd" />
        <div class="btn">
          <el-button type="danger" @click="removeDate(index)">移除</el-button>
          <el-button type="primary" @click="addDate" v-if="index == origin_times.length - 1">新增</el-button>
        </div>
      </div>
      <p>统计该批用户复购订单截止时间</p>
      <div class="end-time">
        <el-date-picker
          v-model="end_time"
          type="date"
          placeholder="选择日期"
          value-format="yyyy-MM-dd"
        />
      </div>
      <el-button type="primary" @click="submit">确认导出</el-button>
    </div>
  </div>
</template>

<script>
import { pickerOptions } from '@/config/option'
import { Order_Statistics_repurchase } from '@/config/api/index'
import moment from 'moment'

let defaultDate = moment().format('YYYY-MM-DD')

export default {
  data() {
    return {
      pickerOptions,
      origin_times: [defaultDate],
      end_time: defaultDate,
    }
  },
  mounted() {},
  methods: {
    removeDate(index) {
      if (this.origin_times.length > 1) {
        this.origin_times.splice(index, 1)
      }
    },
    addDate() {
      this.origin_times.push(defaultDate)
    },
    submit() {
      Order_Statistics_repurchase({
        origin_times: this.origin_times,
        end_time: this.end_time,
      }).then((res) => {
        if (res[2] == 1) {
          this.$message({
            message: res[3],
            type: 'success',
          })
        } else {
          this.$message({
            message: res[0],
          })
        }
      })
    },
  },
}
</script>

<style lang="scss">
.filter {
  padding: 22px;
  background: #fff;

  .item {
    display: flex;
    margin-bottom: 10px;

    .btn {
      margin-left: 10px;
    }
  }

  .end-time {
    margin-bottom: 20px;
  }
}
</style>