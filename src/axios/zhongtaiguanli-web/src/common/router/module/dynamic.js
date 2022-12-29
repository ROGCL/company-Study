const BasicLayout = resolve => require([ '@/layout/basic' ], resolve)
const CommonLayout = resolve => require([ '@/layout/common' ], resolve)

const DynamicRoute = () => ([
  {
    path: '/count_center',
    name: 'count_center',
    authority: '29',
    component: BasicLayout,
    meta: { auth: true, menu: true, name: '统计中心', icon: 'el-icon-s-order' },
    children: [
      {
        path: '/count_center/all/home',
        name: 'count_home',
        authority: '1000',
        meta: { auth: true, menu: true, name: '首页', icon: 'el-icon-view', OffAppId: true },
        component: resolve => require([ '@/page/count_center/all/home' ], resolve),
      }, {
        path: '/count_center/overview',
        name: 'overview',
        authority: '76',
        component: CommonLayout,
        meta: { auth: true, menu: true, name: '概览', icon: 'el-icon-view' },
        children: [
          {
            path: '/count_center/overview/basic/basic',
            name: 'overview_basic_basic',
            authority: '77',
            component: resolve => require([ '@/page/count_center/overview/basic/basic' ], resolve),
            meta: { auth: true, menu: true, name: '基础数据概览', desc: '基础概览数据每小时更新1次，用户分析中的数据10分钟更新一次，对比下可能有出入。<br>今日实时：指的是该指标，在今日截止最近的整点累计的数据。<br>昨日全天：指的是该指标昨日全天的数据。<br/>昨日同期：指的是该指标在最近过去的整点前的1小时的数据，与昨日同期做对比的上升或下降。<br>折线图-今日对比昨天：描述的是今日该指标逐小时的数据，与昨天同期的相比。<br>折线图-最近7天/30天/60天：描述的是该指标逐天的趋势。' }
          }, {
            path: '/count_center/overview/income/income',
            name: 'overview_income_income',
            authority: '78',
            component: resolve => require([ '@/page/count_center/overview/income/income' ], resolve),
            meta: { auth: true, menu: true, name: '收入支出概览', desc: '收入支出概览受限于多方数据同步、上传，故数据每天更新1次，展现的最新数据为昨日数据。<br>昨日：指的是该指标昨日全天的数据。<br>前日：指的是该指标前天全天的数据。<br>环比：指的是该指标昨天全天的数据，与前天全天的数据做对比的上升或下降。<br>折线图-最近7天/30天/60天：描述的是该指标逐天的趋势。' }
          },
        ]
      }, {
        path: '/count_center/user_analyse',
        name: 'user_analyse',
        authority: '1',
        component: CommonLayout,
        meta: { auth: true, menu: true, name: '用户分析', icon: 'el-icon-s-custom' },
        children: [
          {
            path: '/count_center/user_analyse/down_active',
            name: 'down_active',
            authority: '2',
            component: resolve => require([ '@/page/count_center/user_analyse/down_active' ], resolve),
            meta: { auth: true, menu: true, name: '新增用户', desc: '买量数：<br> 买量数指该渠道的激活数中有部分设备是通过花钱投放带来的，非自然新增。<br>当渠道属于FD（信息流投放渠道）时，该渠道的买量数=激活数。<br>当渠道有CPD（应用商店投放）时，该渠道的买量数=CPD下载*CVR（应用商店下载-激活转化率）<br>激活数：<br>激活数等同于新增数，指新增的设备数量。<br>通过集成在APP内的SDK进行的自动统计，单个设备重复下载安装会不会重复记录。' }
          }, {
            path: '/count_center/user_analyse/active_user',
            name: 'active_user',
            authority: '3',
            component: resolve => require([ '@/page/count_center/user_analyse/active_user' ], resolve),
            meta: { auth: true, menu: true, name: '活跃用户', desc: '在所查看时段启动过APP的用户（设备），维度为独立设备。活跃用户中包含当日新增的用户。' }
          }, {
            path: '/count_center/user_analyse/retention_user',
            name: 'retention_user',
            authority: '140',
            component: resolve => require([ '@/page/count_center/user_analyse/retention_user' ], resolve),
            meta: { auth: true, menu: true, name: '新付费用户留存', desc: '新增用户留存：<br>新付费用户留存为当前时间段第一次付费用户数（设备维度）在后续时间周期的活跃情况<br>例如x日新付费用户为100人，这100人在x+n日活跃的有80，则x+n日留存率为80%。<br><br>活跃用户留存:<br>某天活跃的用户(设备)， 在多天之后继续活跃的数量。<br>活跃用户X日留存=第一天的活跃用户(设备)在第X天活跃的数量/第一 天活跃用户(设备)的数量' }
          },{
            path: '/count_center/user_analyse/keep_user',
            name: 'keep_user',
            authority: '4',
            component: resolve => require([ '@/page/count_center/user_analyse/keep_user' ], resolve),
            meta: { auth: true, menu: true, name: '新用户留存', desc: '某天新增的用户（设备），在多天之后继续活跃的数量。<br>新用户X日留存=第一天的新增用户（设备）在第X天活跃的数量/第一天新增用户（设备）的数量。' }
          }, {
            path: '/count_center/user_analyse/active_user_keep',
            name: 'active_user_keep',
            authority: '115',
            component: resolve => require([ '@/page/count_center/user_analyse/active_user_keep' ], resolve),
            meta: { auth: true, menu: true, name: '活跃用户留存', desc: '某天活跃的用户（设备），在多天之后继续活跃的数量。<br>活跃用户X日留存=第一天的活跃用户（设备）在第X天活跃的数量/第一天活跃用户（设备）的数量<br>注意活跃用户包含当天的新增用户。' }
          }, {
            path: '/count_center/user_analyse/churn_user',
            name: 'churn_user',
            authority: '5',
            component: resolve => require([ '@/page/count_center/user_analyse/churn_user' ], resolve),
            meta: { auth: true, menu: true, name: '用户流失率', desc: '流失率（30天）：<br>某一天的新增用户当中，在30天后(含当日)没有启动过应用的用户，占当天新增用户的百分比。<br>流失率（60天）：<br>某一天的新增用户当中，在60天后(含当日)没有启动过应用的用户，占当天新增用户的百分比。' }
          }, {
            path: '/count_center/user_analyse/start_sum',
            name: 'user_analyse_start_sum',
            authority: '127',
            component: resolve => require([ '@/page/count_center/user_analyse/start_sum' ], resolve),
            meta: { auth: true, menu: true, name: '累积启动次数', desc: '' }
          }, {
            path: '/count_center/user_analyse/start_times',
            name: 'start_times',
            authority: '17',
            component: resolve => require([ '@/page/count_center/user_analyse/start_times' ], resolve),
            meta: { auth: true, menu: true, name: '启动次数', desc: '启动次数：<br>通过集成在APP内的SDK进行的自动统计，用户打开App算一次启动。启动后进入后台30秒内再次进入，只计一次启动，进入后台超30秒算新启动。<br>人均启动次数：<br>人均启动次数 = 启动次数 / 活跃用户' }
          }, {
            path: '/count_center/user_analyse/duration_of_use',
            name: 'duration_of_use',
            authority: '18',
            component: resolve => require([ '@/page/count_center/user_analyse/duration_of_use' ], resolve),
            meta: { auth: true, menu: true, name: '使用时长', desc: '单次使用时长：<br>单次使用时长=总使用时长/启动次数<br>日均使用时长：<br>日均使用时长=总使用时长/总日活' }
          }
        ]
      }, {
        path: '/count_center/order_count',
        name: 'order_count',
        authority: '20',
        component: CommonLayout,
        meta: { auth: true, menu: true, name: '收入统计', icon: 'el-icon-s-order' },
        children: [
          {
            path: '/count_center/order_count/all_income',
            name: 'all_income',
            authority: '46',
            component: resolve => require([ '@/page/count_center/order_count/all_income' ], resolve),
            meta: { auth: true, menu: true, name: '总收入统计', desc: '总收入=支付成功订单收入+广告收入<br>其中广告收入包含手动上传的广告收入和自动拉取的广告收入<br>广告和订单的收入占比，指广告收入和订单收入在总收入中的占比。' }
          }, {
            path: '/count_center/order_count/interest_rate',
            name: 'interest_rate',
            authority: '111',
            component: resolve => require([ '@/page/count_center/order_count/interest_rate' ], resolve),
            meta: { auth: true, menu: true, name: '毛利率', desc: '支出：<br>买量所消耗的成本，以渠道为单位，由中台自动拉取或增长部手动上传。<br>毛利：<br>毛利=总收入-支出<br>毛利率：<br>毛利率=毛利/总收入' }
          }, {
            path: '/count_center/order_count/ad_income',
            name: 'ad_income',
            authority: '47',
            component: resolve => require([ '@/page/count_center/order_count/ad_income' ], resolve),
            meta: { auth: true, menu: true, name: '广告收入', desc: '包含通过api自动获取的广告收益，以及手动上传的广告收入。<br>其中广点通和穿山甲均为自动拉取的广告收入。<br>手动上传的广告收入，除了手动上传的以外，还可能包含一些稍小的渠道的自动拉取收入。<br>某渠道广告收入=某渠道广告曝光/总曝光*总广告收入' }
          }, {
            path: '/count_center/order_count/order_amount',
            name: 'order_amount',
            authority: '14',
            component: resolve => require([ '@/page/count_center/order_count/order_amount' ], resolve),
            meta: { auth: true, menu: true, name: '订单收入', desc: '数据总览<br>总客单价=订单总金额/付费用户数<br>会员ARPU=订单总金额/日活<br>首购用户=首日付费新老用户总和<br>首购客单价=首购用户所产生的订单总金额/首购用户数<br>首购会员ARPU=首购用户所产生的订单总金额/日活<br>复购老用户客单价=复购老用户所产生的订单总金额/复购老用户数<br>复购会员ARPU=复购老用户所产生的订单总金额/日活<br>首购数据<br>首购新用户客单价=首购新用户所产生的订单总金额/首购新用户数<br>新用户首购周期（h）=首日激活的新用户付费的总时长(以小时计算)/首购新用户数<br>首购老用户客单价=首购老用户所产生的订单总金额/首购老用户数<br>老用户首购周期（d）=当日老用户产生首购总时长（以天计算，周期计算起点以激活时间算）/首购老用户数<br>首日新用户会员ARPU=首购新用户所产生的订单总金额/日活<br>首日老用户会员ARPU=首购老用户所产生的订单总金额/日活<br>首购新用户订单占比=首购新用户订单量/总订单量<br>首购新用户订单金额占比=首购新用户订单总金额/订单总金额<br>首购老用户订单占比=首购老用户订单量/总订单量<br>首购老用户订单金额占比=首购老用户订单总金额/订单总金额<br>复购数据<br>老用户复购周期（d）=当日老用户产生复购的总时长（以天计算，周期计算起点以激活时间算）/复购老用户数<br>复购老用户订单占比=复购老用户订单量/总订单量<br>复购老用户订单金额占比=复购付费老用户订单总金额/订单总金额<br>' }
          }, {
            path: '/count_center/order_count/order_funnel',
            name: 'order_funnel',
            authority: '13',
            component: resolve => require([ '@/page/count_center/order_count/order_funnel' ], resolve),
            meta: { auth: true, menu: true, name: '付费转化', desc: '激活：<br>所查看时间范围内新增的设备数量。<br>注册：<br>当天新增设备带来的新注册设备数量。筛选多日则是当天新增设备带来的注册用户数相加。<br>下单：<br>新增设备注册的用户，在新增当天的下单数量，包含当天重复下单的订单。筛选多日则是当天新增设备带来的下单数相加。<br>支付成功：<br>新增设备注册的用户，在新增当天的完成支付的订单数量。包含复购订单。筛选多日则是当天新增设备带来的支付订单数量相加。' }
          }, {
            path: '/count_center/order_count/new_user',
            name: 'new_user',
            authority: '10',
            component: resolve => require([ '@/page/count_center/order_count/new_user' ], resolve),
            meta: { auth: true, menu: true, name: '新用户订单', desc: '新用户数量：<br>等同于激活数、新增数，指新增的设备数量。通过IMEI、OAID、AndroidID的核对，单个设备重复安装同一款APP不会重复记录。<br>新用户订单数量：<br>当天/周/月内的新用户（设备）在当下的天/周/月内，总共带来的支付订单数量。<br>当天新增激活设备所注册的账号，以及这些账号在当天内完成支付的订单（包括当天复购的订单）。' }
          }, {
            path: '/count_center/order_count/new_user_pay',
            name: 'new_user_pay',
            authority: '11',
            component: resolve => require([ '@/page/count_center/order_count/new_user_pay' ], resolve),
            meta: { auth: true, menu: true, name: '新用户支付', desc: '新用户成交金额：<br>当天/周/月内的新用户（设备）在当下的天/周/月内，总共带来的订单收入。<br>当天/周/月新增激活设备所注册的账号，以及这些账号在当天/周/月内完成支付的订单的订单金额（包括当天/周/月复购的订单）。<br>新用户客单价：<br>当天/周/月内的新用户（设备）在当下的天/周/月内，平均每台设备带来的订单收入。<br>当天/周/月新增激活设备所注册的账号，以及这些账号在当天/周/月内完成支付的订单的订单金额除以当天/周/月新增激活设备（包括当天/周/月复购的订单）。' }
          }, {
            path: '/count_center/order_count/return_on_investment',
            name: 'return_on_investment',
            authority: '12',
            component: resolve => require([ '@/page/count_center/order_count/return_on_investment' ], resolve),
            meta: { auth: true, menu: true, name: '订单与广告ROI', desc: 'X日投资回报率（ROI）= 当日新增用户在X天内带来的订单收入 / 当日推广金额。<br>投资金额：<br>买量所消耗的成本，以渠道为单位，由中台自动拉取或增长部手动上传。<br>广告ROI：<br>当日全部新增用户在X天内带来的广告收入/当日推广金额<br>例子：<br>2020年1月1日的投放支出5000元，1月1日的新增用户在1月1日带来广告收入1000元，1月2日带来广告收入2000元。<br>则2020年1月1日的新增用户，2日广告ROI=（1000.00+2000.00）/5000.00=60.00%。<br>订单ROI：<br>当日全部新增用户在X天内带来的订单收入/当日推广金额<br>例子：<br>2020年1月1日投放消耗5000元。当日的新增用户，在1月1日带来收入1000元，则日期<br>20200101，1日回收1000.00，ROI为20.00%<br>2020年1月1日投放消耗5000元。当日的新增用户，截至1月2日带来收入2000元，则日期<br>20200102，2日回收2000.00，ROI为40.00%' }
          }, {
            path: '/count_center/order_count/order_income_origin',
            name: 'order_income_origin',
            authority: '69',
            component: resolve => require([ '@/page/count_center/order_count/order_income_origin' ], resolve),
            meta: { auth: true, menu: true, name: '回收统计', desc: '投入：<br>买量所消耗的成本，以渠道为单位，由中台自动拉取或增长部手动上传。<br>广告回收：<br>当日全部新增用户在X天内带来的广告收入<br>例子：<br>2020年1月1日的新增用户，在1月1日带来广告收入1000元，1月2日带来广告收入2000元。<br>则2020年1月1日的新增用户，2日回收1000.00+2000.00=3000.00。<br>新增用户的单日广告收入的计算方式：<br>2020年1月1日的新增用户，在1月2日带来的广告收入=<br>1月1日的新增用户在1月2日的开屏广告曝光*开屏ecpm/1000<br>1月1日的新增用户在1月2日的图片广告曝光*开屏ecpm/1000<br>1月1日的新增用户在1月2日的视频广告曝光*开屏ecpm/1000<br>订单回收：<br>当日全部新增用户在X天内带来的订单收入<br>例子：<br>2020年1月1日的新增用户，在1月1日带来订单收入1000元，则日期20200101，1日回收1000.00。<br>2020年1月1日的新增用户，截至1月2日带来订单收入2000元，则日期20200102，2日回收2000.00。<br>X日投资回报率（ROI）= 当日新增用户在X天内带来的订单收入 / 当日推广金额。<br>广告ROI：<br>当日全部新增用户在X天内带来的广告收入/当日推广金额<br>例子：<br>2020年1月1日的投放支出5000元，1月1日的新增用户在1月1日带来广告收入1000元，1月2日带来广告收入2000元。<br>则2020年1月1日的新增用户，2日广告ROI=（1000.00+2000.00）/5000.00=60.00%。<br>订单ROI：<br>当日全部新增用户在X天内带来的订单收入/当日推广金额<br>例子：<br>2020年1月1日投放消耗5000元。当日的新增用户，在1月1日带来收入1000元，则日期<br>20200101，1日回收1000.00，ROI为20.00%<br>2020年1月1日投放消耗5000元。当日的新增用户，截至1月2日带来收入2000元，则日期<br>20200102，2日回收2000.00，ROI为40.00%' }
          },
          {
            path: '/count_center/order_count/order_income_origin_v2',
            name: 'order_income_origin_v2',
            authority: '150',
            component: resolve => require([ '@/page/count_center/order_count/order_income_origin_v2' ], resolve),
            meta: { auth: true, menu: true, name: '回收统计v2', desc: '投入：<br>买量所消耗的成本，以渠道为单位，由中台自动拉取或增长部手动上传。<br>广告回收：<br>当日全部新增用户在X天内带来的广告收入<br>例子：<br>2020年1月1日的新增用户，在1月1日带来广告收入1000元，1月2日带来广告收入2000元。<br>则2020年1月1日的新增用户，2日回收1000.00+2000.00=3000.00。<br>新增用户的单日广告收入的计算方式：<br>2020年1月1日的新增用户，在1月2日带来的广告收入=<br>1月1日的新增用户在1月2日的开屏广告曝光*开屏ecpm/1000<br>1月1日的新增用户在1月2日的图片广告曝光*开屏ecpm/1000<br>1月1日的新增用户在1月2日的视频广告曝光*开屏ecpm/1000<br>订单回收：<br>当日全部新增用户在X天内带来的订单收入<br>例子：<br>2020年1月1日的新增用户，在1月1日带来订单收入1000元，则日期20200101，1日回收1000.00。<br>2020年1月1日的新增用户，截至1月2日带来订单收入2000元，则日期20200102，2日回收2000.00。<br>X日投资回报率（ROI）= 当日新增用户在X天内带来的订单收入 / 当日推广金额。<br>广告ROI：<br>当日全部新增用户在X天内带来的广告收入/当日推广金额<br>例子：<br>2020年1月1日的投放支出5000元，1月1日的新增用户在1月1日带来广告收入1000元，1月2日带来广告收入2000元。<br>则2020年1月1日的新增用户，2日广告ROI=（1000.00+2000.00）/5000.00=60.00%。<br>订单ROI：<br>当日全部新增用户在X天内带来的订单收入/当日推广金额<br>例子：<br>2020年1月1日投放消耗5000元。当日的新增用户，在1月1日带来收入1000元，则日期<br>20200101，1日回收1000.00，ROI为20.00%<br>2020年1月1日投放消耗5000元。当日的新增用户，截至1月2日带来收入2000元，则日期<br>20200102，2日回收2000.00，ROI为40.00%' }
          },
        ]
      }, {
        path: '/count_center/user_cost',
        name: 'user_cost',
        authority: '22',
        component: CommonLayout,
        meta: { auth: true, menu: true, name: '用户价值', icon: 'el-icon-s-claim' },
        children: [
          {
            path: '/count_center/user_cost/user_value',
            name: 'user_value',
            authority: '9',
            component: resolve => require([ '@/page/count_center/user_cost/user_value' ], resolve),
            meta: { auth: true, menu: true, name: '用户价值', desc: '单用户价值(ARPU)： <br>即Average Revenue Per User,每个用户在单位时间内(以日、周、月为主，含当日)所产生的价值。<br>单用户价值=总收入/活跃用户<br>单付费用户价值(ARPPU)：<br>即Average Revenue Per Pay User,每个付费用户在单位时间内(以日、周、月为主，含当日)所产生的付费价值。<br>单付费用户价值=支付成功金额/支付成功人数<br>会员价值 = 会员收入（订单收入）/ 日活 ，等同于商业化报表里的“整体会员arpu”<br>广告价值 = 广告收入 / 日活，等同于商业化报表里的“整体广告arpu”<br>新用户价值 = 新用户回收均值 / 新增用户均值</br>新用户会员价值 = 新用户会员回收均值 / 新增用户均值</br>新用户广告价值 = 新用户广告回收均值 / 新增用户均值' }
          }, {
            path: '/count_center/user_cost/keep_lt',
            name: 'keep_lt',
            authority: '45',
            component: resolve => require([ '@/page/count_center/user_cost/keep_lt' ], resolve),
            meta: { auth: true, menu: true, name: 'LT', desc: '用户首次启动应用到所查看时间段内，在应用内产生广告收益、购买收益的估算。<br>如1月1日新激活设备1000个，这批新激活设备在第2天启动设备600，第3天设备用户300，第4天启动设备100，则第2天LT = (1000 + 600) / 1000，第3天LT = (1000 + 600 + 300) / 1000，第四天LT = (1000 + 600 + 300 + 100) / 1000' }
          }, {
            path: '/count_center/user_cost/allLTV',
            name: 'user_life_cost',
            authority: '79',
            component: resolve => require([ '@/page/count_center/user_cost/allLTV' ], resolve),
            meta: { auth: true, menu: true, name: '全部LTV', desc: '新用户激活到所查看时间段内，在应用内产生广告收益、购买收益。<br>1月1日的7日全部的LTV = 1月1日新增用户7日回收金额/1月1日新增用户数。<br>对于30以上的LTV,广告回收金额只取到30日' }
          }, {
            path: '/count_center/user_cost/payLTV',
            name: 'user_life_cost_pay',
            authority: '80',
            component: resolve => require([ '@/page/count_center/user_cost/payLTV' ], resolve),
            meta: { auth: true, menu: true, name: '付费LTV', desc: '指新增设备在一段时间内，完成过付款的设备平均支付金额。<br>1月1日的3日付费LTV=1月1日的3日订单回收/1月1日的新增设备。' }
          }, {
            path: '/count_center/user_cost/order_first_rate',
            name: 'order_first_rate',
            authority: '104',
            component: resolve => require([ '@/page/count_center/user_cost/order_first_rate' ], resolve),
            meta: { auth: true, menu: true, name: '新设备首单完成率', desc: '指某天的新增设备，在X天后有多少完成了首单。<br>X日首单完成率=当日新增设备中在X日内完成首单的设备/当日新增设备' }
          }, {
            path: '/count_center/user_cost/order_repeat_rate',
            name: 'order_repeat_rate',
            authority: '105',
            component: resolve => require([ '@/page/count_center/user_cost/order_repeat_rate' ], resolve),
            meta: { auth: true, menu: true, name: '新设备复购完成率', desc: '指某天的新增设备，在X天后有多少完成了复购（二次及以上的购买）。<br>X日复购完成率=当日新增设备中在X日内完成2单以及以上的设备/当日新增设备' }
          }, {
            path: '/count_center/user_cost/order_average_income',
            name: 'order_average_income',
            authority: '106',
            component: resolve => require([ '@/page/count_center/user_cost/order_average_income' ], resolve),
            meta: { auth: true, menu: true, name: '新设备平均订单收入', desc: '指某天的新增设备，在X天后平均每台带来了多少订单收入。<br>X日新设备平均订单收入=当日新增设备中在X日内支付订单的总金额/当日新增设备' }
          }
        ]
      }, {
        path: '/count_center/channel_quality',
        name: 'channel_quality',
        authority: '50',
        component: CommonLayout,
        meta: { auth: true, menu: true, name: '渠道质量管理', icon: 'el-icon-help' },
        children: [
          {
            path: '/count_center/channel_quality/trend',
            name: 'trend',
            authority: '51',
            component: resolve => require([ '@/page/count_center/channel_quality/trend' ], resolve),
            meta: { auth: true, menu: true, name: '渠道质量趋势', desc: '' }
          }, {
            path: '/count_center/channel_quality/supervise',
            name: 'supervise',
            authority: '52',
            component: resolve => require([ '@/page/count_center/channel_quality/supervise' ], resolve),
            meta: { auth: true, menu: true, name: '算法管理', desc: '' }
          }, {
            path: '/count_center/channel_quality/score',
            name: 'score',
            authority: '53',
            component: resolve => require([ '@/page/count_center/channel_quality/score' ], resolve),
            meta: { auth: true, menu: true, name: '指标以及评分明细', desc: '总得分=∑(一级指标得分 * 一级指标权重)备注：标颜色的为一级指标，如数量得分一级指标得分（以数量得分为例）=【{（log日活-log日活最小值）/（log日活最大值-log日活最小值）} * 日活权重+{（log新增-log新增最小值）/（log新增最大值-log新增最小值）} * 新增权重】* 100' }
          }, {
            path: '/count_center/channel_quality/updata',
            name: 'keep_l-reset',
            authority: '54',
            component: resolve => require([ '@/page/count_center/channel_quality/updata' ], resolve),
            meta: { auth: true, menu: true, name: '上传数据', desc: '' }
          }
        ]
      }, {
        path: '/count_center/day_active',
        name: 'count_center_day_active',
        authority: '56',
        component: CommonLayout,
        meta: { auth: true, menu: true, name: '日活预测模型', icon: 'el-icon-s-marketing' },
        children: [
          {
            path: '/count_center/day_active/computed',
            name: 'computed',
            authority: '57',
            component: resolve => require([ '@/page/count_center/day_active/computed' ], resolve),
            meta: { auth: true, menu: true, name: '现有数据预测', desc: '预期每日新增：首次安装启动应用的设备。(预期每日新增=近7天新增总人数/7)。<br/>实际日活：指启动应用的用户(去重，即1台设备打开多次会被计为1个活跃用户)。<br/>预测目标DAU：预期每日新增 *（1+∑N天后的留存率）' }
          }, {
            path: '/count_center/day_active/contrast',
            name: 'contrast',
            authority: '58',
            component: resolve => require([ '@/page/count_center/day_active/contrast' ], resolve),
            meta: { auth: true, menu: true, name: '历史预测结果', desc: '' }
          }, {
            path: '/count_center/day_active/custom',
            name: 'custom',
            authority: '59',
            component: resolve => require([ '@/page/count_center/day_active/custom/custom' ], resolve),
            meta: { auth: true, menu: true, name: '自定义预测', desc: '' }
          }
        ]
      }, {
        path: '/count_center/project_exchange',
        name: 'count_center_project_exchange',
        authority: '72',
        component: CommonLayout,
        meta: { auth: true, menu: true, name: '项目换量', icon: 'el-icon-refresh' },
        children: [
          {
            path: '/count_center/project_exchange/edit',
            name: 'edit',
            authority: '74',
            component: resolve => require([ '@/page/count_center/project_exchange/edit/edit' ], resolve),
            meta: { auth: true, menu: true, name: '落地页编辑', desc: '用于本APP在其他落地页上的展示。' }
          }, {
            path: '/count_center/project_exchange/material',
            name: 'material',
            authority: '75',
            component: resolve => require([ '@/page/count_center/project_exchange/material/material' ], resolve),
            meta: { auth: true, menu: true, name: '素材编辑', desc: '' }
          }
        ]
      }, {
        path: '/count_center/ip_attribution',
        name: 'count_center_ip_attribution',
        authority: '81',
        component: CommonLayout,
        meta: { auth: true, menu: true, name: '投放效果监测', icon: 'el-icon-location-outline' },
        children: [
          {
            path: '/count_center/ip_attribution/web_admin',
            name: 'count_center_ip_attribution_web_admin',
            authority: '82',
            component: resolve => require([ '@/page/count_center/ip_attribution/web_admin' ], resolve),
            meta: { auth: true, menu: true, name: '投放管理', desc: '用于落地页、内部换量和付费广告投放的渠道的新建和管理。<br>投放方式：指该渠道的新设备是以哪种来源新增的，如果有需要支持新的投放方式，需要通知中台<br>排期新增。<br>渠道名称：用于备注该渠道的名称，一般是付费投放的广告账户、落地页的活动名称等。<br>浏览量（PV）：用于投放方式为落地页和内部换量，表示落地页/换量页面的浏览量。如果为其<br>他投放方式浏览量显示为空。<br>独立访客（UV）：用于投放方式为落地页和内部换量，表示落地页/换量页面独立访问的设备<br>数。如果为其他投放方式独立访客显示为空。<br>归因新增：指该渠道新增设备数量。<br>归因活跃：指该渠道的活跃设备数量。活跃设备数量包含当日新增设备数量。<br>查看：点击去看该归因渠道更多天的历史数据。<br>获取URL：如果投放方式为落地页，获取URL用于获取网页埋点。如果投放方式为付费广告投<br>放，获取URL用于获取监测链接。<br>回收统计：统计的数据为该渠道建立期初至今所有用户带来的总回收、订单回收、广告回收' }
          }, {
            path: '/count_center/ip_attribution/web_admin/add_special',
            name: 'web_admin_add_special',
            authority: '82',
            component: resolve => require([ '@/page/count_center/ip_attribution/web_admin/add_special' ], resolve),
            meta: { auth: true, menu: false, name: '投放管理-添加' }
          }, {
            path: '/count_center/ip_attribution/web_admin/add_baidu',
            name: 'web_admin_add_baidu',
            authority: '82',
            component: resolve => require([ '@/page/count_center/ip_attribution/web_admin/add_baidu' ], resolve),
            meta: { auth: true, menu: false, name: '投放管理-添加' }
          },
          {
            path: '/count_center/ip_attribution/web_admin/add_xingtu',
            name: 'web_admin_add_xingtu',
            authority: '82',
            component: resolve => require([ '@/page/count_center/ip_attribution/web_admin/add_xingtu' ], resolve),
            meta: { auth: true, menu: false, name: '投放管理-添加' }
          },
          {
            path: '/count_center/ip_attribution/web_admin/add_tengxun',
            name: 'web_admin_add_tengxun',
            authority: '82',
            component: resolve => require([ '@/page/count_center/ip_attribution/web_admin/add_tengxun' ], resolve),
            meta: { auth: true, menu: false, name: '投放管理-添加' }
          },
          {
            path: '/count_center/ip_attribution/web_admin/add_kuaishou',
            name: 'web_admin_add_kuaishou',
            authority: '82',
            component: resolve => require([ '@/page/count_center/ip_attribution/web_admin/add_kuaishou' ], resolve),
            meta: { auth: true, menu: false, name: '投放管理-添加' }
          },
          {
            path: '/count_center/ip_attribution/statistics',
            name: 'count_center_ip_attribution_statistics',
            authority: '84',
            component: resolve => require([ '@/page/count_center/ip_attribution/statistics' ], resolve),
            meta: { auth: true, menu: true, name: '外部投放效果统计', desc: '用于查看投放方式为落地页，和付费广告投放的投放渠道的历史数据。' }
          }, {
            path: '/count_center/ip_attribution/inside',
            name: 'count_center_ip_attribution_inside',
            authority: '96',
            component: resolve => require([ '@/page/count_center/ip_attribution/inside' ], resolve),
            meta: { auth: true, menu: true, name: '内部换量效果统计', desc: '用于查看投放方式为内部换量的投放渠道的历史数据。' }
          }
        ]
      }, {
        path: '/count_center/put_in_data',
        name: 'put_in_data',
        authority: '21',
        component: CommonLayout,
        meta: { auth: true, menu: true, name: '费用支出', icon: 'el-icon-s-promotion' },
        children: [
          {
            path: '/count_center/put_in_data/put_in_data_count',
            name: 'put_in_data_count',
            authority: '19',
            component: resolve => require([ '@/page/count_center/put_in_data/put_in_data_count' ], resolve),
            meta: { auth: true, menu: true, name: '渠道投放统计', desc: '渠道投放统计：所选时间段内，市场部渠道投放开销' }
          },
          {
            path: '/count_center/ip_attribution/cost',
            name: 'count_center_ip_attribution_cost',
            authority: '147',
            component: resolve => require([ '@/page/count_center/ip_attribution/cost' ], resolve),
            meta: { auth: true, menu: true, name: '项目运维成本', desc: '' }
          }, 
        ]
      }, {
        path: '/count_center/other/',
        name: 'count_center_other',
        authority: '24',
        component: CommonLayout,
        meta: { auth: true, menu: true, name: '其他内容', icon: 'el-icon-s-cooperation' },
        children: [
          {
            path: '/count_center/other/all_order',
            name: 'all_order',
            authority: '41',
            component: resolve => require([ '@/page/count_center/other/all_order' ], resolve),
            meta: { auth: true, menu: true, name: '全部订单', desc: '' }
          }, {
            path: '/count_center/other/registered_user',
            name: 'registered_user',
            authority: '42',
            component: resolve => require([ '@/page/count_center/other/registered_user' ], resolve),
            meta: { auth: true, menu: true, name: '注册用户', desc: '' }
          }, {
            path: '/count_center/other/SDK_count',
            name: 'SDK_count',
            authority: '43',
            component: resolve => require([ '@/page/count_center/other/SDK_count' ], resolve),
            meta: { auth: true, menu: true, name: 'SDK统计', desc: '' }
          }, {
            path: '/count_center/other/channel_control',
            name: 'channel_control',
            authority: '67',
            component: resolve => require([ '@/page/count_center/other/channel_control' ], resolve),
            meta: { auth: true, menu: true, name: '渠道控制', desc: '用来控制中台部分功能（如商务日报周报月报、渠道质量评估等）所展示的渠道。<br/>商务、市场、运营经常会对某个APP中几个重要渠道，进行数据监控。由于Android会有大量测试、废弃渠道，所以需要筛选渠道来排除测试、废弃渠道的影响。<br/>新增渠道控制后，如后续新增需要筛选渠道展示的功能，则统一在渠道控制处进行控制。<br/>修改渠道之后于第二天统计时生效<br/>部分渠道筛选用来发送邮件。若没有勾选任何渠道，则不发送该APP的邮件。' }
          }
        ]
      }
    ]
  }, {
    path: '/business_center',
    name: 'business_center',
    authority: '38',
    component: BasicLayout,
    meta: { auth: true, menu: true, name: '商务数据', icon: 'el-icon-s-marketing' },
    children: [
      {
        path: '/business_center/ad_index',
        name: 'ad_index',
        authority: '39',
        component: resolve => require([ '@/page/business_center/ad_index' ], resolve),
        meta: { auth: true, menu: true, name: '广告收入统计', icon: 'el-icon-s-marketing' },
      },
      {
        path: '/business_center/ad_index/adsense',
        name: 'adsense',
        authority: '39',
        component: resolve => require([ '@/page/business_center/ad_index/adsense' ], resolve),
        meta: { auth: true, menu: false, name: '广告位关联' }
      },
      {
        path: '/business_center/statements',
        name: 'statements',
        authority: '133',
        component: resolve => require([ '@/page/business_center/statements' ], resolve),
        meta: { auth: true, menu: true, name: '商业化报表', icon: 'el-icon-s-marketing' }
      },
      /* {
        path: '/business_center/increase',
        name: 'increase',
        authority: '133',
        component: resolve => require([ '@/page/business_center/increase' ], resolve),
        meta: { auth: true, menu: true, name: '增长部报表', icon: 'el-icon-s-marketing' }
      }, */
      {
        path: '/business_center/incomeTotal',
        name: 'business_center_incomeTotal',
        authority: '87',
        component: CommonLayout,
        meta: { auth: true, menu: true, name: '收入总汇', icon: 'el-icon-s-management' },
        children: [
          {
            path: '/business_center/incomeTotal/detail',
            name: 'business_center_incomeTotal_detail',
            authority: '90',
            component: resolve => require([ '@/page/business_center/incomeTotal/detail' ], resolve),
            meta: { auth: true, menu: true, name: '收入详情' },
          }, {
            path: '/business_center/incomeTotal/Administration',
            name: 'business_center_incomeTotal_Administration',
            authority: '93',
            component: resolve => require([ '@/page/business_center/incomeTotal/Administration' ], resolve),
            meta: { auth: true, menu: true, name: '收入渠道管理' },
          }, {
            path: '/business_center/incomeTotal/operationLog',
            name: 'business_center_incomeTotal_operationLog',
            authority: '88',
            component: resolve => require([ '@/page/business_center/incomeTotal/operationLog' ], resolve),
            meta: { auth: true, menu: true, name: '收入总汇操作记录' },
          },
          {
            path: '/business_center/incomeTotal/originOrderDetail/v1',
            name: 'originOrderDetail_v1',
            authority: '142',
            component: resolve => require([ '@/page/business_center/incomeTotal/originOrderDetail/v1' ], resolve),
            meta: { auth: true, menu: true, name: '项目原始订单明细' },
          }
          ,  {
            path: '/business_center/incomeTotal/originOrderDetail',
            name: 'originOrderDetail',
            authority: '114',
            component: resolve => require([ '@/page/business_center/incomeTotal/originOrderDetail' ], resolve),
            meta: { auth: true, menu: true, name: '项目原始订单明细v1' },
          },  {
            path: '/business_center/incomeTotal/app_and_banner',
            name: 'app_and_banner',
            authority: '119',
            component: resolve => require([ '@/page/business_center/incomeTotal/app_and_banner' ], resolve),
            meta: { auth: true, menu: true, name: 'APP广告收入关联' },
          }
        ]
      }, {
        path: '/business_center/expenditure',
        name: 'business_center_expenditure',
        authority: '91',
        component: CommonLayout,
        meta: { auth: true, menu: true, name: '投放支出', icon: 'el-icon-s-management' },
        children: [
          {
            path: '/business_center/expenditure/operational_delivery',
            name: 'business_center_operational_delivery',
            authority: '139',
            component: resolve => require([ '@/page/business_center/expenditure/operational_delivery/home.vue' ], resolve),
            meta: { auth: true, menu: true, name: '运营投放数据',desc: `返点金额=账面消耗-实际消耗<br>激活成本=消耗/新增下单数=下单的人数<br>下单率=下单数/新增<br>支付成功数=订单支付成功的人数<br>支付成功率=支付成功数/下单数<br>付费成本=消耗/支付成功数<br>激活付费率=支付成功数/新增<br>总收入=新增用户带来的订单&广告的总收入<br>总收入ROI=总收入/消耗<br>客单价=订单收入/支付成功数<br>CVR=新增/组件点击<br>PVR=新增/组件曝光<br>组件ECPM=实际消耗/组件曝光*1000<br> CPC=实际消耗/组件点击<br>CTR=组件点击/组件曝光<br> 新增ARPU=总收入/新增` },
          },
          /* {
            path: '/business_center/expenditure/spend_summary',
            name: 'business_center_spend_summary',
            authority: '92',
            component: resolve => require([ '@/page/business_center/expenditure/spend_summary' ], resolve),
            meta: { auth: true, menu: true, name: '投放支出汇总' },
          },  */
          {
            path: '/business_center/expenditure/key_behavior_monitoring',
            name: 'business_center_key_behavior_monitoring',
            authority: '149',
            component: resolve => require([ '@/page/business_center/expenditure/key_behavior_monitoring/home.vue' ], resolve),
            meta: { auth: true, menu: true, name: '关键行为监测',desc: `设备行为完成数：新增中完成了对应关键行为的数量<br>预估报表“达成率”：设备行为完成数/渠道新增<br>0-3h：从激活开始在3小时内达成行为的设备数<br>0-3h达成率：0-3h/渠道新增<br><12h：从激活开始达成行为的时间大于12小时的设备数<br>24h内设备行为完成数:从激活开始24h内行为完成设备数<br>回传平台行为数:新增用户中行为回传平台的设备数<br>回传时长均值:从激活到关键行为上报平台的平均耗时<br>未回传平台行为数:24h内设备行为完成数-回传平台行为数<br>投放数据报表“达成率”:回传平台行为数/渠道新增<br>行为成本：投放金额/回传平台行为数` },
          },
          {
            path: '/business_center/expenditure/spend_detail',
            name: 'business_center_spend_detail',
            authority: '131',
            component: resolve => require([ '@/page/business_center/expenditure/spend_detail' ], resolve),
            meta: { auth: true, menu: true, name: '投放支出明细' },
          }, {
            path: '/business_center/expenditure/banner_flow',
            name: 'banner_flow',
            authority: '129',
            component: resolve => require([ '@/page/business_center/expenditure/banner_flow' ], resolve),
            meta: { auth: true, menu: true, name: '广告账户流水' },
          }, {
            path: '/business_center/expenditure/put_approve',
            name: 'put_approve',
            authority: '116',
            component: resolve => require([ '@/page/business_center/expenditure/put_approve' ], resolve),
            meta: { auth: true, menu: true, name: '打款记录详情' },
          }, {
            path: '/business_center/expenditure/Administration',
            name: 'business_center_expenditure_Administration',
            authority: '94',
            component: resolve => require([ '@/page/business_center/expenditure/Administration' ], resolve),
            meta: { auth: true, menu: true, name: '投放渠道管理' },
          },
          {
            path: '/business_center/expenditure/target_delivery',
            name: 'business_center_target_delivery',
            authority: '146',
            component: resolve => require([ '@/page/business_center/expenditure/target_delivery' ], resolve),
            meta: { auth: true, menu: true, name: '投放目标管理' },
          },
        ]
      }, {
        path: '/business_center/planmonitor',
        name: 'business_center_planmonitor',
        authority: '97',
        component: CommonLayout,
        meta: { auth: true, menu: true, name: '信息流效果监测', icon: 'el-icon-s-management' },
        children: [
          {
            path: '/business_center/planmonitor/plan',
            name: 'business_center_planmonitor_plan',
            authority: '99',
            component: resolve => require([ '@/page/business_center/planmonitor/plan' ], resolve),
            meta: { auth: true, menu: true, name: '投放计划效果监测', desc: '' }
          }, {
            path: '/business_center/planmonitor/recycle_plan',
            name: 'recycle_plan',
            authority: '110',
            component: resolve => require([ '@/page/business_center/planmonitor/recycle_plan' ], resolve),
            meta: { auth: true, menu: true, name: '分计划逐日回收', desc: '' }
          }, {
            path: '/business_center/planmonitor/no_api_plan',
            name: 'no_api_plan',
            authority: '103',
            component: resolve => require([ '@/page/business_center/planmonitor/no_api_plan' ], resolve),
            meta: { auth: true, menu: true, name: '无API平台计划管理', desc: '' }
          }, {
            path: '/business_center/planmonitor/huge_advertiser',
            name: 'huge_advertiser',
            authority: '112',
            component: resolve => require([ '@/page/business_center/planmonitor/huge_advertiser' ], resolve),
            meta: { auth: true, menu: true, name: '巨量引擎广告主关联', desc: '' }
          }, {
            path: '/business_center/planmonitor/magnetic_app',
            name: 'magnetic_app',
            authority: '113',
            component: resolve => require([ '@/page/business_center/planmonitor/magnetic_app' ], resolve),
            meta: { auth: true, menu: true, name: '磁力引擎广告主关联', desc: '' }
          }, {
            path: '/business_center/planmonitor/baidu_advertiser',
            name: 'baidu_advertiser',
            authority: '130',
            component: resolve => require([ '@/page/business_center/planmonitor/baidu_advertiser' ], resolve),
            meta: { auth: true, menu: true, name: '百度SEM广告主关联', desc: '' }
          }, {
            path: '/business_center/planmonitor/tengxun_advertiser',
            name: 'tengxun_advertiser',
            authority: '141',
            component: resolve => require([ '@/page/business_center/planmonitor/tengxun_advertiser' ], resolve),
            meta: { auth: true, menu: true, name: '腾讯广告主关联', desc: '' }
          },{
            path: '/business_center/planmonitor/xingtu_advertiser',
            name: 'xingtu_advertiser',
            authority: '134',
            component: resolve => require([ '@/page/business_center/planmonitor/xingtu_advertiser' ], resolve),
            meta: { auth: true, menu: true, name: '星图广告主关联', desc: '' }
          },{
            path: '/business_center/planmonitor/juxing_advertiser',
            name: 'juxing_advertiser',
            authority: '143',
            component: resolve => require([ '@/page/business_center/planmonitor/juxing_advertiser' ], resolve),
            meta: { auth: true, menu: true, name: '聚星广告主关联', desc: '' }
          },{
            path: '/business_center/planmonitor/sougou_advertiser',
            name: 'sougou_advertiser',
            authority: '148',
            component: resolve => require([ '@/page/business_center/planmonitor/sougou_advertiser' ], resolve),
            meta: { auth: true, menu: true, name: '搜狗广告主关联', desc: '' }
          },
          {
            path: '/business_center/source_material',
            name: 'source_material',
            authority: '138',
            component: resolve => require([ '@/page/business_center/source_material' ], resolve),
            meta: { auth: true, menu: true, name: '素材分析' }
          }
          , {
            path: '/business_center/planmonitor/baidu_advertiser/authorize',
            name: 'magnetic_app_authorize',
            authority: '113',
            component: resolve => require([ '@/page/business_center/planmonitor/baidu_advertiser/authorize' ], resolve),
            meta: { auth: true, menu: false, name: '授权管理', desc: '' }
          },
          , {
            path: '/business_center/planmonitor/magnetic_app/authorize',
            name: 'magnetic_app_authorize',
            authority: '113',
            component: resolve => require([ '@/page/business_center/planmonitor/magnetic_app/authorize' ], resolve),
            meta: { auth: true, menu: false, name: '授权管理', desc: '' }
          },
          {
            path: '/business_center/planmonitor/xingtu_advertiser/authorize',
            name: 'xingtu_advertiser_authorize',
            authority: '113',
            component: resolve => require([ '@/page/business_center/planmonitor/xingtu_advertiser/authorize' ], resolve),
            meta: { auth: true, menu: false, name: '授权管理', desc: '' }
          },
          {
            path: '/business_center/planmonitor/juxing_advertiser/authorize',
            name: 'juxing_advertiser_authorize',
            authority: '113',
            component: resolve => require([ '@/page/business_center/planmonitor/juxing_advertiser/authorize' ], resolve),
            meta: { auth: true, menu: false, name: '授权管理', desc: '' }
          },
          {
            path: '/business_center/planmonitor/event_back_edit',
            name: 'event_back_edit',
            authority: '117',
            component: resolve => require([ '@/page/business_center/planmonitor/event_back_edit' ], resolve),
            meta: { auth: true, menu: true, name: '事件转化回传控制', desc: '' }
          }, {
            path: '/business_center/planmonitor/event_back_edit_record',
            name: 'event_back_edit_record',
            authority: '118',
            component: resolve => require([ '@/page/business_center/planmonitor/event_back_edit_record' ], resolve),
            meta: { auth: true, menu: true, name: '事件回传控制修改记录', desc: '' }
          }, {
            path: '/business_center/planmonitor/channel_recycle',
            name: 'business_channel_recycle',
            authority: '124',
            component: resolve => require([ '@/page/business_center/planmonitor/channel_recycle' ], resolve),
            meta: { auth: true, menu: true, name: '渠道分时回收情况', desc: '' }
          }
        ]
      }, {
        path: '/business_center/finance_check',
        name: 'finance_check',
        authority: '107',
        component: CommonLayout,
        meta: { auth: true, menu: true, name: '财务对账', icon: 'el-icon-s-management' },
        children: [
          {
            path: '/business_center/finance_check/finance_expenditure',
            name: 'finance_expenditure',
            authority: '108',
            component: resolve => require([ '@/page/business_center/finance_check/finance_expenditure' ], resolve),
            meta: { auth: true, menu: true, name: '财务支出对账表', desc: '' }
          }, {
            path: '/business_center/finance_check/finance_business',
            name: 'finance_business',
            authority: '109',
            component: resolve => require([ '@/page/business_center/finance_check/finance_business' ], resolve),
            meta: { auth: true, menu: true, name: '商业化财务对账表', desc: '' }
          }
        ]
      }, {
        path: '/business_center/check_data',
        name: 'business_check_data',
        authority: '120',
        component: CommonLayout,
        meta: { auth: true, menu: true, name: '数据核对', icon: 'el-icon-s-management' },
        children: [
          {
            path: '/business_center/check_data/check_expenditure',
            name: 'business_check_expenditure',
            authority: '121',
            component: resolve => require([ '@/page/business_center/check_data/check_expenditure' ], resolve),
            meta: { auth: true, menu: true, name: '支出核对', desc: '' }
          }, {
            path: '/business_center/check_data/check_order',
            name: 'business_check_order',
            authority: '122',
            component: resolve => require([ '@/page/business_center/check_data/check_order' ], resolve),
            meta: { auth: true, menu: true, name: '订单收入核对', desc: '' }
          }, {
            path: '/business_center/check_data/check_banner',
            name: 'business_check_banner',
            authority: '123',
            component: resolve => require([ '@/page/business_center/check_data/check_banner' ], resolve),
            meta: { auth: true, menu: true, name: '广告收入核对', desc: '' }
          }
        ]
      },
      {
        path: '/business_center/expenditure/cash_flow_record',
        name: 'cash_flow_record',
        authority: '125',
        component: resolve => require([ '@/page/business_center/expenditure/cash_flow_record' ], resolve),
        meta: { auth: true, menu: true, name: '文件上传中心',icon: 'el-icon-s-management' },
      },
      {
        path: '/business_center/ugc',
        name: 'ugc',
        authority: '136',
        component: resolve => require([ '@/page/manage_center/ugc' ], resolve),
        meta: { auth: true, menu: true, name: 'UGC预警监控', icon: 'el-icon-s-custom' }
      },
    ]
  }, {
    path: '/manage_center',
    name: 'manage_center',
    authority: '30',
    component: BasicLayout,
    meta: { auth: true, menu: true, name: '管理中心', icon: 'el-icon-s-tools' },
    children: [
      // {
      //   path: '/manage_center/ugc',
      //   name: 'ugc',
      //   authority: '136',
      //   component: resolve => require([ '@/page/manage_center/ugc' ], resolve),
      //   meta: { auth: true, menu: true, name: 'UGC预警监控', icon: 'el-icon-s-custom' }
      // },
      {
        path: '/manage_center/user_manage',
        name: 'user_manage',
        authority: '26',
        component: resolve => require([ '@/page/manage_center/user' ], resolve),
        meta: { auth: true, menu: true, name: '用户管理', icon: 'el-icon-s-custom' }
      },
       {
        path: '/manage_center/user_manage/add',
        name: 'user_manage_add',
        authority: '27',
        component: resolve => require([ '@/page/manage_center/user/add' ], resolve),
        meta: { auth: true, menu: false, name: '用户添加' }
      }, 
       {
        path: '/manage_center/user_manage/login_list',
        name: 'user_manage_login_list',
        authority: '27',
        component: resolve => require([ '@/page/manage_center/user/login_list' ], resolve),
        meta: { auth: true, menu: false, name: '用户登录授权管理' }
      }, {
        path: '/manage_center/user_manage/edit',
        name: 'user_manage_edit',
        authority: '31',
        component: resolve => require([ '@/page/manage_center/user/edit' ], resolve),
        meta: { auth: true, menu: false, name: '用户修改' }
      }, {
        path: '/manage_center/user_manage/edit_auth',
        name: 'user_manage_edit_auth',
        authority: '102',
        component: resolve => require([ '@/page/manage_center/user/edit_auth' ], resolve),
        meta: { auth: true, menu: false, name: '权限分配' }
      },/*  {
        path: '/manage_center/app_manage',
        name: 'app_manage',
        authority: '32',
        component: resolve => require([ '@/page/manage_center/app' ], resolve),
        meta: { auth: true, menu: true, name: 'App管理', icon: 'el-icon-s-help' }
      }, */ {
        path: '/manage_center/device_manage',
        name: 'device_manage',
        authority: '126',
        component: resolve => require([ '@/page/manage_center/device' ], resolve),
        meta: { auth: true, menu: true, name: '用户设备管理', icon: 'el-icon-s-custom' }
      }, {
        path: '/manage_center/app_market',
        name: 'app_market',
        authority: '132',
        component: resolve => require([ '@/page/manage_center/app_market' ], resolve),
        meta: { auth: true, menu: true, name: '应用商店投放管理', icon: 'el-icon-s-help' }
      },
      {
        path: '/manage_center/manual_data_update',
        name: 'manual_data_update',
        authority: '135',
        component: resolve => require([ '@/page/manage_center/manual_data_update' ], resolve),
        meta: { auth: true, menu: true, name: '数据手动同步', icon: 'el-icon-s-custom' }
      },
     /*  {
        path: '/manage_center/project',
        name: 'manage_center_project',
        authority: '86',
        component: resolve => require([ '@/page/manage_center/project' ], resolve),
        meta: { auth: true, menu: true, name: '项目组管理', icon: 'el-icon-s-help' }
      }, */ /* {
        path: '/manage_center/department',
        name: 'manage_center_department',
        authority: '85',
        component: resolve => require([ '@/page/manage_center/department' ], resolve),
        meta: { auth: true, menu: true, name: '部门管理', icon: 'el-icon-s-help' }
      }, */{
        path: '/manage_center/framework',
        name: 'manage_center_framework',
        authority: '137',
        component: resolve => require([ '@/page/manage_center/framework' ], resolve),
        meta: { auth: true, menu: true, name: '项目架构', icon: 'el-icon-s-help' }
      },
       {
        path: '/manage_center/ipblacklist',
        name: 'manage_center_ipblacklist',
        authority: '95',
        component: resolve => require([ '@/page/manage_center/ipblacklist' ], resolve),
        meta: { auth: true, menu: true, name: '内部换量IP黑名单', icon: 'el-icon-s-help', desc: '用于内部换量功能的IP屏蔽，屏蔽一些特定的审核地区和IP。' }
      }, {
        path: '/manage_center/app_manage/log',
        name: 'app_log',
        authority: '71',
        component: resolve => require([ '@/page/manage_center/log' ], resolve),
        meta: { auth: true, menu: true, name: '操作日志', icon: 'el-icon-document' }
      }, {
        path: '/manage_center/app_manage/add',
        name: 'app_manage_add',
        authority: '33',
        component: resolve => require([ '@/page/manage_center/app/add' ], resolve),
        meta: { auth: true, menu: false, name: 'App添加' }
      }, {
        path: '/manage_center/app_manage/edit',
        name: 'app_manage_edit',
        authority: '34',
        component: resolve => require([ '@/page/manage_center/app/edit' ], resolve),
        meta: { auth: true, menu: false, name: 'App编辑' }
      }, 
      {
        path: '/manage_center/other',
        name: 'other',
        authority: '35',
        component: resolve => require([ '@/page/manage_center/other' ], resolve),
        meta: { auth: true, menu: true, name: '其他内容', icon: 'el-icon-s-cooperation' }
      }
    ]
  }
])

export default DynamicRoute