import moment from "moment";
export const Mydata = {
  data() {
    return {
      searchForm: {
        //筛选项
        project: {
          appInfo: [],
        },
        appid: {
          appInfo: [],
        },
        platform: "",
        talent: {
          appInfo: [],
        },
        admin: {
          appInfo: [],
        },
        channel: {
          appInfo: [],
        },
        boost_status: "",
        time: [
          moment().subtract(7, "d").format("YYYY-MM-DD"),
          moment().subtract(1, "d").format("YYYY-MM-DD"),
        ],
      },
      boost_status_list: [
        {
          id: 1,
          title: "自然超期",
        },
        {
          id: 2,
          title: "无助推",
        },
        {
          id: 3,
          title: "助推中",
        },
        {
          id: 4,
          title: "助推结束",
        },
        {
          id: 5,
          title: "其他",
        },
      ],
      platform_id: [
        {
          id: "8",
          title: "巨量-星图",
        },
        {
          id: "9",
          title: "快手磁力聚星",
        },
      ],
      fixedcolumn: [
        // 固定的几个字段
        {
          label: "达人信息",
          prop: "self_custom",
          fixed: false,
          width: 100,
          value: 1000,
          ordernum: 1,
          association: [
            {
              label: "视频",
              prop: "video",
              fixed: false,
              width: 150,
              value: "0001",
              ordernum: 1.1,
            },
          ],
        },
        {
          label: "项目",
          prop: "project_name",
          fixed: false,
          value: 1001,
          ordernum: 2,
        },
        {
          label: "应用",
          prop: "app_name",
          fixed: false,
          value: 1002,
          ordernum: 3,
          association: [
            {
              label: "回传状态",
              fixed: false,
              ordernum: 3.1,
              width: 80,
              prop: "back_status",
            },
          ],
        },
        {
          label: "平台",
          prop: "platform",
          fixed: false,
          value: 1003,
          ordernum: 4,
        },
        {
          label: "订单ID",
          prop: "ad_id",
          fixed: false,
          value: 1004,
          ordernum: 5,
          width:130,
          association: [
            {
              label: "助推状态",
              prop: "boost_status",
              fixed: false,
              value: "0002",
              ordernum: 5.1,
            },
          ],
        },
        {
          label: "渠道号",
          prop: "channel",
          fixed: false,
          value: 1005,
          ordernum: 6,
          association: [
            {
              label: "助推状态",
              prop: "boost_status",
              fixed: false,
              value: "0002",
              ordernum: 5.1,
            },
          ],
        },
        {
          label: "渠道负责人",
          prop: "admin_name",
          fixed: false,
          value: 1007,
          ordernum: 7,
        },
        {
          label: "发布时间",
          prop: "send_time",
          fixed: false,
          value: 1006,
          ordernum: 8,
        },
      ],
      // 固定维度
      fixedcolumn2: [
        {
          label: "开始时间",
          prop: "date_b",
          sortable: "custom",
        },
        {
          label: "结束时间",
          prop: "date_e",
          sortable: "custom",
        },
        {
          label: "投放平台",
          prop: "platform",
        },
        {
          label: "应用",
          prop: "app_name",
        },
        {
          label: "渠道负责人",
          prop: "realname",
        },
      ],
      column2: [
        {
          label: "开始时间",
          prop: "date_b",
          sortable: "custom",
        },
        {
          label: "结束时间",
          prop: "date_e",
          sortable: "custom",
        },
        {
          label: "投放平台",
          prop: "platform",
        },
        {
          label: "应用",
          prop: "app_name",
        },
        {
          label: "渠道负责人",
          prop: "realname",
        },
        {
          label: "消耗目标",
          prop: "target_amount",
          sortable: "custom",
        },
        {
          label: "实际消耗",
          prop: "real_amount",
          sortable: "custom",
        },
        {
          label: "目标完成率",
          prop: "amount_finish_rate",
        },
        {
          label: "ROI目标",
          prop: "target_roi",
          sortable: "custom",
        },
        {
          label: "实际ROI",
          prop: "real_roi",
          sortable: "custom",
        },
        {
          label: "目标完成率",
          prop: "real_roi_finish_rate",
        },
        {
          label: "CPI目标",
          prop: "target_cpi",
          sortable: "custom",
        },
        {
          label: "实际CPI",
          prop: "real_cpi",
          sortable: "custom",
        },
        {
          label: "目标完成率",
          prop: "real_cpi_finish_rate",
        },
        {
          label: "新增目标",
          prop: "target_device_new",
          sortable: "custom",
        },
        {
          label: "实际新增",
          prop: "real_device_new",
          sortable: "custom",
        },
        {
          label: "目标完成率",
          prop: "real_device_new_finish_rate",
        },
        {
          label: "订单量目标",
          prop: "target_order_num",
          sortable: "custom",
        },
        {
          label: "实际订单量",
          prop: "real_order_num",
          sortable: "custom",
        },
        {
          label: "目标完成率",
          prop: "real_order_num_finish_rate",
        },
      ],
      comparison_data: [
        {
          title: "维度对比",
          value: 1,
        },
        {
          title: "时间对比",
          value: 2,
        },
      ],

      // 指示看板
      signboardInfo: [
        {
          label: "实际消耗",
          field: "real_price",
          number: 0,
          beforeunit: "￥",
          afterunit: "元",
        },
        {
          label: "新增",
          field: "device_new",
          number: 0,
          beforeunit: "",
          afterunit: "",
        },
        {
          label: "总收入",
          field: "total_income",
          number: 0,
          beforeunit: "￥",
          afterunit: "元",
        },
        {
          label: "总收入ROI",
          field: "total_income_roi",
          number: 0,
          beforeunit: "",
          afterunit: "",
          multiplyFlag100: true, // 需要乘以100
        },

        {
          label: "激活成本",
          field: "new_add_cost",
          number: 0,
          beforeunit: "￥",
          afterunit: "元",
        },
        {
          label: "组件曝光",
          field: "show",
          number: 0,
          beforeunit: "",
          afterunit: "",
        },
        {
          label: "组件点击",
          field: "click",
          number: 0,
          beforeunit: "",
          afterunit: "",
        },
        {
          label: "CTR",
          field: "ctr",
          number: 0,
          beforeunit: "",
          afterunit: "",
        },
        {
          label: "组件ECPM",
          field: "element_ecpm",
          number: 0,
          beforeunit: "￥",
          afterunit: "元",
        },
        {
          label: "CVR",
          field: "cvr",
          number: 0,
          beforeunit: "",
          afterunit: "",
          multiplyFlag100: true, // 需要乘以100
        },
        // {
        //     label: '激活成本',
        //     field: 'finish_play_rate',
        //     number: 0,
        //     beforeunit: "",
        //     afterunit: "%"
        // },
      ],
    };
  },
  methods: {
    // 格式化请求参数
    formatSearch(name) {
      let data = this.searchForm[name].appInfo.join()
        ? this.searchForm[name].appInfo.join()
        : undefined;
      return data;
    },
  },
};
