(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-6024a775"],{"41f9":function(t,e,n){},"5e7d":function(t,e,n){"use strict";n.d(e,"b",(function(){return i})),n.d(e,"a",(function(){return o})),n.d(e,"c",(function(){return c}));var a=n("c1df"),r=n.n(a),i={shortcuts:[{text:"昨天",onClick:function(t){var e=new Date,n=new Date;n.setTime(n.getTime()-864e5),t.$emit("pick",[n,e])}},{text:"近一周",onClick:function(t){var e=new Date,n=new Date;n.setTime(n.getTime()-6048e5),t.$emit("pick",[n,e])}},{text:"近30天",onClick:function(t){var e=r()().subtract(1,"months").format("YYYY-MM-DD"),n=r()().format("YYYY-MM-DD");t.$emit("pick",[e,n])}},{text:"近60天",onClick:function(t){var e=r()().subtract(2,"months").format("YYYY-MM-DD"),n=r()().format("YYYY-MM-DD");t.$emit("pick",[e,n])}},{text:"近90天",onClick:function(t){var e=r()().subtract(3,"months").format("YYYY-MM-DD"),n=r()().format("YYYY-MM-DD");t.$emit("pick",[e,n])}},{text:"本月",onClick:function(t){var e=new Date,n=e.getFullYear(),a=e.getMonth()+1,r=new Date(n+"-"+a+"-01");t.$emit("pick",[r,e])}},{text:"上个月",onClick:function(t){var e=r()().subtract(1,"months").endOf("month"),n=e.format("YYYY-MM-DD"),a=e.format("YYYY-MM-01");t.$emit("pick",[a,n])}}]},c=function(t){return[{label:"天",value:1,disabled:!1},{label:"周",value:2,disabled:r()(t[1]).diff(r()(t[0]),"days")<7},{label:"月",value:3,disabled:r()(t[1]).diff(r()(t[0]),"months")<1}]},o=[{label:"总订单统计",value:0,disabled:!1}]},9738:function(t,e,n){"use strict";n.r(e);var a=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"computed"},[n("div",{staticClass:"filter"},[n("span",{staticClass:"label"},[t._v("指标以及评分明细：")]),n("el-date-picker",{attrs:{type:"daterange","range-separator":"~","start-placeholder":"开始日期","end-placeholder":"结束日期","picker-options":t.pickerOptions,"value-format":"yyyy-MM-dd",clearable:!1,"append-to-body":!1,"unlink-panels":""},model:{value:t.time,callback:function(e){t.time=e},expression:"time"}}),n("el-button",{attrs:{type:"primary"},on:{click:t.search}},[t._v("查询")]),n("el-button",{on:{click:t.clear}},[t._v("重置")])],1),n("div",{staticClass:"table"},[n("el-button",{staticClass:"downDataToExcel",attrs:{type:"primary",size:"small",icon:"el-icon-download"},on:{click:t.downDataToExcel}},[t._v("导出")]),n("el-table",{staticStyle:{width:"100%"},attrs:{data:t.tableData,border:""}},[n("el-table-column",{attrs:{prop:"date",label:"日期"}}),n("el-table-column",{attrs:{prop:"active",label:"实际日活"}}),n("el-table-column",{attrs:{prop:"value",label:"预期每日新增"}}),n("el-table-column",{attrs:{prop:"day1_value",label:"预测30天后"}}),n("el-table-column",{attrs:{prop:"day2_value",label:"预测60天后"}}),n("el-table-column",{attrs:{prop:"day3_value",label:"预测90天后"}}),n("el-table-column",{attrs:{prop:"day4_value",label:"预测180天后"}}),n("el-table-column",{attrs:{prop:"day5_value",label:"预测365天后"}})],1),n("el-pagination",{staticClass:"pagination",attrs:{background:"",layout:"prev, pager, next",total:t.total},on:{"current-change":t.currentChange}})],1)])},r=[],i=(n("8e6e"),n("ac6a"),n("456d"),n("ade3")),c=(n("7f7f"),n("cff8"),n("2f62")),o=n("cf87"),u=n("c1df"),s=n.n(u),d=n("b9b3"),l=n("5e7d");function f(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(t);e&&(a=a.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,a)}return n}function p(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?f(Object(n),!0).forEach((function(e){Object(i["a"])(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):f(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}var b={name:"computed",data:function(){return{time:[s()().subtract(30,"d").format("YYYY-MM-DD"),s()().format("YYYY-MM-DD")],pickerOptions:l["b"],tableData:[],total:0,currentPage:1,excelData:[]}},created:function(){this.Day_Active_Predict_dayCalculator()},methods:{Day_Active_Predict_dayCalculator:function(t){var e=this;Object(o["J"])({navCate:2,currentPage:this.currentPage,pageSize:t?1e5:10,timeBegin:this.time[0],timeEnd:this.time[1]}).then((function(n){var a=n[1],r=a.total,i=a.list;"excel"==t?e.excelData=i.map((function(t){var e=t.date,n=t.active,a=t.value,r=t.day1_value,i=t.day2_value,c=t.day3_value,o=t.day4_value,u=t.day5_value;return{"日期":e,"实际日活":n,"预期每日新增":a,"预测30天后":r,"预测60天后":i,"预测90天后":c,"预测180天后":o,"预测365天后":u}})):(e.total=r,e.tableData=i)}))},downDataToExcel:function(){var t=this;Object(o["J"])({navCate:2,currentPage:this.currentPage,pageSize:1e5,timeBegin:this.time[0],timeEnd:this.time[1]}).then((function(e){var n=["日期","实际日活","预期每日新增","预测30天后","预测60天后","预测90天后","预测180天后","预测365天后"],a=e[1].list;a=a.map((function(t){return[t.date,t.active,t.value,t.day1_value,t.day2_value,t.day3_value,t.day4_value,t.day5_value]}));var r=t.$store.getters.getCurrentApp(t.$route.query.appId),i=r["title"],c="1"===r["system"]?"[安卓]":"[苹果]",o=t.$route.meta.name,u=t.time[0],s=t.time[1];Object(d["a"])(n,a,"".concat(i," ").concat(c,"-").concat(o,"-").concat(u,"-").concat(s))}))},search:function(){this.Day_Active_Predict_dayCalculator()},clear:function(){this.time=[s()().subtract(30,"d").format("YYYY-MM-DD"),s()().format("YYYY-MM-DD")]},currentChange:function(t){this.currentPage=t},fetchData:function(){return this.excelData}},watch:{currentPage:function(t){this.Day_Active_Predict_dayCalculator()}},computed:p({},Object(c["d"])({appArr:function(t){return t.app.data}}))},m=b,v=(n("ce15"),n("2877")),y=Object(v["a"])(m,a,r,!1,null,"d763db00",null);e["default"]=y.exports},ce15:function(t,e,n){"use strict";n("41f9")},cf87:function(t,e,n){"use strict";n.d(e,"X",(function(){return s})),n.d(e,"db",(function(){return d})),n.d(e,"Y",(function(){return l})),n.d(e,"Z",(function(){return f})),n.d(e,"bb",(function(){return p})),n.d(e,"ab",(function(){return b})),n.d(e,"cb",(function(){return m})),n.d(e,"eb",(function(){return v})),n.d(e,"H",(function(){return y})),n.d(e,"L",(function(){return _})),n.d(e,"I",(function(){return h})),n.d(e,"G",(function(){return D})),n.d(e,"K",(function(){return g})),n.d(e,"J",(function(){return O})),n.d(e,"M",(function(){return S})),n.d(e,"m",(function(){return Y})),n.d(e,"n",(function(){return P})),n.d(e,"ob",(function(){return C})),n.d(e,"mb",(function(){return w})),n.d(e,"k",(function(){return k})),n.d(e,"l",(function(){return M})),n.d(e,"W",(function(){return A})),n.d(e,"qb",(function(){return j})),n.d(e,"yb",(function(){return x})),n.d(e,"zb",(function(){return I})),n.d(e,"Ab",(function(){return L})),n.d(e,"kb",(function(){return T})),n.d(e,"lb",(function(){return Q})),n.d(e,"hb",(function(){return E})),n.d(e,"jb",(function(){return $})),n.d(e,"ib",(function(){return U})),n.d(e,"r",(function(){return B})),n.d(e,"B",(function(){return V})),n.d(e,"y",(function(){return z})),n.d(e,"o",(function(){return F})),n.d(e,"s",(function(){return G})),n.d(e,"u",(function(){return J})),n.d(e,"A",(function(){return K})),n.d(e,"z",(function(){return R})),n.d(e,"F",(function(){return q})),n.d(e,"C",(function(){return N})),n.d(e,"v",(function(){return W})),n.d(e,"E",(function(){return H})),n.d(e,"D",(function(){return X})),n.d(e,"t",(function(){return Z})),n.d(e,"p",(function(){return tt})),n.d(e,"q",(function(){return et})),n.d(e,"x",(function(){return nt})),n.d(e,"w",(function(){return at})),n.d(e,"fb",(function(){return rt})),n.d(e,"pb",(function(){return it})),n.d(e,"nb",(function(){return ct})),n.d(e,"U",(function(){return ot})),n.d(e,"T",(function(){return ut})),n.d(e,"V",(function(){return st})),n.d(e,"c",(function(){return dt})),n.d(e,"a",(function(){return lt})),n.d(e,"P",(function(){return ft})),n.d(e,"N",(function(){return pt})),n.d(e,"O",(function(){return bt})),n.d(e,"Q",(function(){return mt})),n.d(e,"d",(function(){return vt})),n.d(e,"b",(function(){return yt})),n.d(e,"tb",(function(){return _t})),n.d(e,"sb",(function(){return ht})),n.d(e,"wb",(function(){return Dt})),n.d(e,"vb",(function(){return gt})),n.d(e,"xb",(function(){return Ot})),n.d(e,"R",(function(){return St})),n.d(e,"S",(function(){return Yt})),n.d(e,"rb",(function(){return Pt})),n.d(e,"ub",(function(){return Ct})),n.d(e,"e",(function(){return wt})),n.d(e,"g",(function(){return kt})),n.d(e,"h",(function(){return Mt})),n.d(e,"i",(function(){return At})),n.d(e,"f",(function(){return jt})),n.d(e,"j",(function(){return xt})),n.d(e,"gb",(function(){return It}));n("8e6e"),n("ac6a"),n("456d");var a=n("ade3"),r=n("5b78");function i(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(t);e&&(a=a.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,a)}return n}function c(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?i(Object(n),!0).forEach((function(e){Object(a["a"])(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}function o(t){return function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return r["a"].post(t,c({},e)).then((function(t){return t})).catch((function(){}))}}function u(t){return function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return r["a"].post(t,c({},e),{headers:{"Content-Type":"application/x-www-form-urlencoded"}}).then((function(t){return t})).catch((function(){}))}}var s=o("Quantity_Statistics/detail"),d=o("Quantity_Statistics/levelSecondList"),l=(o("Quantity_Statistics/checkDate"),o("Quantity_Statistics/createAlgorithm")),f=o("Quantity_Statistics/createQuantity"),p=o("Quantity_Statistics/diyList"),b=o("Quantity_Statistics/deleteQuantity"),m=o("Quantity_Statistics/grade"),v=o("Quantity_Statistics/weight"),y=o("Day_Active_Predict/calculatorList"),_=o("Day_Active_Predict/getDayActiveDefaultValue"),h=o("Day_Active_Predict/calculatorSave"),D=o("Day_Active_Predict/calculatorCount"),g=o("Day_Active_Predict/delete"),O=o("Day_Active_Predict/dayCalculator"),S=o("Day_Active_Predict/predictCompare"),Y=o("Channel_Manage/list"),P=(o("App/getChannel"),o("Channel_Manage/save")),C=(o("Dashboard/index"),o("User_Statistics/download")),w=o("User_Statistics/active"),k=o("Behavior_Statistics/startTime"),M=o("Behavior_Statistics/useTime"),A=o("Order_Statistics/conversionFunnel"),j=(o("Order_Statistics/orderMoney"),o("Order_Statistics/orderChargeBack"),o("Order_Statistics/allIncome"),o("User_Statistics/userValue")),x=(o("Order_Statistics/repurchase"),o("system/adminUserList")),I=o("system/operationList"),L=o("system/operationLog"),T=u("Transaction_Program/save"),Q=o("Transaction_Program/show"),E=o("Transaction_Program/landInfo"),$=o("Transaction_Program/materialList"),U=o("Transaction_Program/landSave"),B=(o("File/uploadImage"),o("Dashboard/dashboardSetting")),V=o("Dashboard/saveBoardSetting"),z=o("Dashboard/incomePer"),F=o("Dashboard/activePayUserPer"),G=o("Dashboard/deviceActiveVersion"),J=o("Dashboard/deviceNewTop5"),K=o("Dashboard/orderConversionFunnel"),R=o("Dashboard/lifeCycle"),q=(o("Dashboard/lifeCycleValue"),o("Dashboard/lifeCyclePayValue"),o("Dashboard/userValue")),N=(o("Dashboard/newUserPay"),o("Dashboard/sevenDayOrderRecycle")),W=o("Dashboard/firstBuyRebuyPer"),H=o("Dashboard/userRoi"),X=o("Dashboard/userKeep"),Z=o("Dashboard/deviceAddDis"),tt=o("Dashboard/baseDashboard"),et=o("Dashboard/baseDashboardLine"),nt=o("Dashboard/incomeDashboardLine"),at=o("Dashboard/incomeDashboard"),rt=o("System/apps"),it=(o("system/menu"),o("admin/get"),o("admin/save"),o("User_Statistics/keep")),ct=o("User_Statistics/activeKeep"),ot=o("Ip/originList"),ut=o("Ip/addLandingPage"),st=o("Ip/updateLandingPage"),dt=(o("Ip/originListWithTitle"),o("Ip/ipStatics"),o("Apartment_Manage/index")),lt=o("Apartment_Manage/create"),ft=o("Group_Manage/index"),pt=o("Group_Manage/create"),bt=o("Group_Manage/delete"),mt=o("Group_Manage/store"),vt=o("Apartment_Manage/store"),yt=o("Apartment_Manage/delete"),_t=o("income/index"),ht=o("income/incomeChannelList"),Dt=o("income/storeIncomeChannel"),gt=o("income/saveAd"),Ot=o("income/updateChannelShow"),St=o("Invest_Statistics/investChannelList"),Yt=(o("Invest_Statistics/store_invest_channel"),o("Invest_Statistics/classify"),o("Invest_Statistics/invest_channels"),o("Invest_Statistics/services_types"),o("Invest_Statistics/updateChannelShow")),Pt=(o("Invest_Statistics/index"),o("admin/index")),Ct=o("income/operateList"),wt=o("App/ipblack_city_add_province"),kt=o("App/ipblack_city_list"),Mt=o("App/ipblack_ip_add"),At=o("App/ipblack_ip_list"),jt=o("App/ipblack_city_delete"),xt=o("App/ipblck_ip_delete"),It=(o("Invest_Statistics/addInvestChannel"),o("System/getQuickAK"));o("System/addCpc"),o("System/getCpcList"),o("System/updateCpc")}}]);
//# sourceMappingURL=chunk-6024a775.1.0.0.1672021042960.js.map