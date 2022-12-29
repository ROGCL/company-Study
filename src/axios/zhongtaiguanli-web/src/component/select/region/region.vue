<template>
  <el-cascader :options="options" :props="props" filterable v-model="value" @change="handleChange"></el-cascader>
</template>

<script>
import { get } from '@/config/api/xhr'
export default {
  data() {
    return {
      props: {
        label: 'name',
        value: 'name',
        children: 'districts',
      },
      options: [],
      value: [],
    }
  },
  created() {
    get({
      url:
        'https://restapi.amap.com/v3/config/district?key=0c0c6174529b0062f65d138acb6c5863&subdistrict=2&extensions=base',
    }).then((res) => {
      let FrontCity = [
        '北京市',
        '上海市',
        '天津市',
        '重庆市',
        '石家庄市',
        '沈阳市',
        '哈尔滨市',
        '杭州市',
        '福州市',
        '济南市',
        '广州市',
        '武汉市',
        '成都市',
        '昆明市',
        '兰州市',
        '台北市',
        '南宁市',
        '银川市',
        '太原市',
        '长春市',
        '南京市',
        '合肥市',
        '南昌市',
        '郑州市',
        '长沙市',
        '海口市',
        '贵阳市',
        '西安市',
        '西宁市',
        '呼和浩特市',
        '拉萨市',
        '乌鲁木齐市',
        '',
      ]

      let data = JSON.parse(res).districts[0].districts

      function query(arr) {
        for (let i = 0; i < arr.length; i++) {
          // 省/直辖市..
          if (arr[i].districts.length) {
            query(arr[i].districts)
            // 市..
          } else {
            arr[i].districts = null
          }
          moveCity(arr, arr[i], i)
        }
      }

      // 四直辖市排前面，各省省会排前面
      function moveCity(CityList, CurrentCity, CurrentIndex) {
        if (FrontCity.includes(CurrentCity.name)) {
          CityList.unshift(...CityList.splice(CurrentIndex, 1))
        }
      }

      query(data)

      this.options = data
    })
  },
  methods: {
    handleChange(values) {
      this.$emit('update:region', values)
    },
  },
}
</script>

<style lang='scss' scoped>
</style>