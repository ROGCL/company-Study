export const myMixins = {
  data() {
    return {
      column: [
        {
          label: "开始时间",
          prop: "date_b",
          fixed: false,
        },
        {
          label: "结束时间",
          prop: "date_e",
          fixed: false,
        },
        {
          label: "投放平台",
          prop: "invest_channel_name",
          fixed: false,
        },
        {
          label: "应用",
          prop: "app_name",
          fixed: false,
        },
        {
          label: "渠道负责人",
          prop: "admin_name",
          fixed: false,
        },
        {
          label: "消耗目标（元）",
          prop: "target_amount",
          fixed: false,
        },
        // {
        //   label: "ROI目标",
        //   prop: "target_roi",
        //   fixed: false,
        // },
        {
          label: "回收目标（元）",
          prop: "target_recycling",
          fixed: false,
        },
        {
          label: "新增目标",
          prop: "target_device_new",
          fixed: false,
        },
        {
          label: "订单量目标",
          prop: "target_order_num",
          fixed: false,
        },
        {
          label: "目标添加人",
          prop: "target_admin_name",
          fixed: false,
        },
        {
          label: "添加时间",
          prop: "create_time",
          width:150,
          fixed: false,
        },
        {
          label: "操作",
          prop: "operate",
          width:100,
          fixed: false,
        },
      ],
    };
  },
};
