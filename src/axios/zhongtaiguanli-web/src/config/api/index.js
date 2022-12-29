import { get, post, form } from './helpers'

const Quantity_Statistics = post('Quantity_Statistics/detail')
const Quantity_Statistics_levelSecondList = post('Quantity_Statistics/levelSecondList')
const Quantity_StatisticscheckDate = post('Quantity_Statistics/checkDate')
const Quantity_Statistics_createAlgorithm = post('Quantity_Statistics/createAlgorithm')
const Quantity_Statistics_createQuantity = post('Quantity_Statistics/createQuantity')
const Quantity_Statistics_diyList = post('Quantity_Statistics/diyList')
const Quantity_Statistics_deleteQuantity = post('Quantity_Statistics/deleteQuantity')
const Quantity_Statistics_grade = post('Quantity_Statistics/grade')
const Quantity_Statistics_weight = post('Quantity_Statistics/weight')
const Day_Active_Predict_calculatorList = post('Day_Active_Predict/calculatorList')
const Day_Active_Predict_getDayActiveDefaultValue = post('Day_Active_Predict/getDayActiveDefaultValue')
const Day_Active_Predict_calculatorSave = post('Day_Active_Predict/calculatorSave')
const Day_Active_Predict_calculatorCount = post('Day_Active_Predict/calculatorCount')
const Day_Active_Predict_delete = post('Day_Active_Predict/delete')
const Day_Active_Predict_dayCalculator = post('Day_Active_Predict/dayCalculator')
const Day_Active_Predict_predictCompare = post('Day_Active_Predict/predictCompare')
const Channel_Manage_list = post('Channel_Manage/list')
const App_getChannel = post('App/getChannel')
const Channel_Manage_save = post('Channel_Manage/save')
const Dashboard_index = post('Dashboard/index')
const User_Statistics_download = post('User_Statistics/download')
const User_Statistics_active = post('User_Statistics/active')
const Behavior_Statistics_startTime = post('Behavior_Statistics/startTime')
const Behavior_Statistics_useTime = post('Behavior_Statistics/useTime')
const Order_Statistics_conversionFunnel = post('Order_Statistics/conversionFunnel')
const Order_Statistics_orderMoney = post('Order_Statistics/orderMoney')
const Order_Statistics_orderChargeBack = post('Order_Statistics/orderChargeBack')
const Order_Statistics_allIncome = post('Order_Statistics/allIncome')
const User_Statistics_userValue = post('User_Statistics/userValue')
const Order_Statistics_repurchase = post('Order_Statistics/repurchase')
const system_adminUserList = post('system/adminUserList')
const system_operationList = post('system/operationList')
const system_operationLog = post('system/operationLog')
const Transaction_Program_save = form('Transaction_Program/save')
const Transaction_Program_show = post('Transaction_Program/show')
const Transaction_Program_landInfo = post('Transaction_Program/landInfo')
const Transaction_Program_materialList = post('Transaction_Program/materialList')
const Transaction_Program_landSave = post('Transaction_Program/landSave')
const File_uploadImage = post('File/uploadImage')
const Dashboard_dashboardSetting = post('Dashboard/dashboardSetting')
const Dashboard_saveBoardSetting = post('Dashboard/saveBoardSetting')
const Dashboard_incomePer = post('Dashboard/incomePer')
const Dashboard_activePayUserPer = post('Dashboard/activePayUserPer')
const Dashboard_deviceActiveVersion = post('Dashboard/deviceActiveVersion')
const Dashboard_deviceNewTop5 = post('Dashboard/deviceNewTop5')
const Dashboard_orderConversionFunnel = post('Dashboard/orderConversionFunnel')
const Dashboard_lifeCycle = post('Dashboard/lifeCycle')
const Dashboard_lifeCycleValue = post('Dashboard/lifeCycleValue')
const Dashboard_lifeCyclePayValue = post('Dashboard/lifeCyclePayValue')
const Dashboard_userValue = post('Dashboard/userValue')
const Dashboard_newUserPay = post('Dashboard/newUserPay')
const Dashboard_sevenDayOrderRecycle = post('Dashboard/sevenDayOrderRecycle')
const Dashboard_firstBuyRebuyPer = post('Dashboard/firstBuyRebuyPer')
const Dashboard_userRoi = post('Dashboard/userRoi')
const Dashboard_userKeep = post('Dashboard/userKeep')
const Dashboard_deviceAddDis = post('Dashboard/deviceAddDis')
const Dashboard_baseDashboard = post('Dashboard/baseDashboard')
const Dashboard_baseDashboardLine = post('Dashboard/baseDashboardLine')
const Dashboard_incomeDashboardLine = post('Dashboard/incomeDashboardLine')
const Dashboard_incomeDashboard = post('Dashboard/incomeDashboard')
const System_apps = post('System/apps')
const system_menu = post('system/menu')
const admin_get = post('admin/get')
const admin_save = post('admin/save')
const User_Statistics_keep = post('User_Statistics/keep')
const User_Statistics_activeKeep = post('User_Statistics/activeKeep')
const Ip_originList = post('Ip/originList')
const Ip_addLandingPage = post('Ip/addLandingPage')
const Ip_updateLandingPage = post('Ip/updateLandingPage')
const Ip_originListWithTitle = post('Ip/originListWithTitle')
const Ip_ipStatics = post('Ip/ipStatics')
const Apartment_Manage_index = post('Apartment_Manage/index')
const Apartment_Manage_create = post('Apartment_Manage/create')
const Group_Manage_index = post('Group_Manage/index')
const Group_Manage_create = post('Group_Manage/create')
const Group_Manage_delete = post('Group_Manage/delete')
const Group_Manage_store = post('Group_Manage/store')
const Apartment_Manage_store = post('Apartment_Manage/store')
const Apartment_Manage_delete = post('Apartment_Manage/delete')
const income_index = post('income/index')
const income_incomeChannelList = post('income/incomeChannelList')
const income_storeIncomeChannel = post('income/storeIncomeChannel')
const income_saveAd = post('income/saveAd')
const income_updateChannelShow = post('income/updateChannelShow')
const Invest_Statistics_investChannelList = post('Invest_Statistics/investChannelList')
const Invest_Statistics_store_invest_channel = post('Invest_Statistics/store_invest_channel')
const Invest_Statistics_classify = post('Invest_Statistics/classify')
const Invest_Statistics_invest_channels = post('Invest_Statistics/invest_channels')
const Invest_Statistics_services_types = post('Invest_Statistics/services_types')
const Invest_Statistics_updateChannelShow = post('Invest_Statistics/updateChannelShow')
const Invest_Statistics_index = post('Invest_Statistics/index')
const admin_index = post('admin/index')
const income_operateList = post('income/operateList')
const App_ipblack_city_add_province = post('App/ipblack_city_add_province')
const App_ipblack_city_list = post('App/ipblack_city_list')
const App_ipblack_ip_add = post('App/ipblack_ip_add')
const App_ipblack_ip_list = post('App/ipblack_ip_list')
const App_ipblack_city_delete = post('App/ipblack_city_delete')
const App_ipblck_ip_delete = post('App/ipblck_ip_delete')
const Invest_Statistics_addInvestChannel = post('Invest_Statistics/addInvestChannel')
const System_getQuickAK = post('System/getQuickAK')
const System_addCpc = post('System/addCpc')
const System_getCpcList = post('System/getCpcList')
const System_updateCpc = post('System/updateCpc')

export {
  Quantity_Statistics,
  Quantity_Statistics_levelSecondList,
  Quantity_StatisticscheckDate,
  Quantity_Statistics_createAlgorithm,
  Quantity_Statistics_createQuantity,
  Quantity_Statistics_diyList,
  Quantity_Statistics_deleteQuantity,
  Quantity_Statistics_grade,
  Quantity_Statistics_weight,
  Day_Active_Predict_calculatorList,
  Day_Active_Predict_getDayActiveDefaultValue,
  Day_Active_Predict_calculatorSave,
  Day_Active_Predict_calculatorCount,
  Day_Active_Predict_delete,
  Day_Active_Predict_dayCalculator,
  Day_Active_Predict_predictCompare,
  Channel_Manage_list,
  App_getChannel,
  Channel_Manage_save,
  Dashboard_index,
  User_Statistics_download,
  User_Statistics_active,
  Behavior_Statistics_startTime,
  Behavior_Statistics_useTime,
  Order_Statistics_conversionFunnel,
  Order_Statistics_orderMoney,
  Order_Statistics_orderChargeBack,
  Order_Statistics_allIncome,
  User_Statistics_userValue,
  Order_Statistics_repurchase,
  system_adminUserList,
  system_operationList,
  system_operationLog,
  Transaction_Program_save,
  Transaction_Program_show,
  Transaction_Program_landInfo,
  Transaction_Program_materialList,
  Transaction_Program_landSave,
  File_uploadImage,
  Dashboard_dashboardSetting,
  Dashboard_saveBoardSetting,
  Dashboard_incomePer,
  Dashboard_activePayUserPer,
  Dashboard_deviceActiveVersion,
  Dashboard_deviceNewTop5,
  Dashboard_orderConversionFunnel,
  Dashboard_lifeCycle,
  Dashboard_lifeCycleValue,
  Dashboard_lifeCyclePayValue,
  Dashboard_userValue,
  Dashboard_newUserPay,
  Dashboard_sevenDayOrderRecycle,
  Dashboard_firstBuyRebuyPer,
  Dashboard_userRoi,
  Dashboard_userKeep,
  Dashboard_deviceAddDis,
  Dashboard_baseDashboard,
  Dashboard_baseDashboardLine,
  Dashboard_incomeDashboardLine,
  Dashboard_incomeDashboard,
  System_apps,
  system_menu,
  admin_get,
  admin_save,
  User_Statistics_keep,
  User_Statistics_activeKeep,
  Ip_originList,
  Ip_addLandingPage,
  Ip_updateLandingPage,
  Ip_originListWithTitle,
  Ip_ipStatics,
  Apartment_Manage_index,
  Apartment_Manage_create,
  Group_Manage_index,
  Group_Manage_create,
  Group_Manage_delete,
  Group_Manage_store,
  Apartment_Manage_store,
  Apartment_Manage_delete,
  income_index,
  income_incomeChannelList,
  income_storeIncomeChannel,
  income_saveAd,
  income_updateChannelShow,
  Invest_Statistics_investChannelList,
  Invest_Statistics_store_invest_channel,
  Invest_Statistics_classify,
  Invest_Statistics_invest_channels,
  Invest_Statistics_services_types,
  Invest_Statistics_updateChannelShow,
  Invest_Statistics_index,
  admin_index,
  income_operateList,
  App_ipblack_city_add_province,
  App_ipblack_city_list,
  App_ipblack_ip_add,
  App_ipblack_ip_list,
  App_ipblack_city_delete,
  App_ipblck_ip_delete,
  Invest_Statistics_addInvestChannel,
  System_getQuickAK,
  System_addCpc,
  System_getCpcList,
  System_updateCpc
}
