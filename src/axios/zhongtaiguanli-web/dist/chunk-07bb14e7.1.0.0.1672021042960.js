(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-07bb14e7"],{"084d":function(t,e,a){"use strict";a("8b1c")},"1b92":function(t,e,a){"use strict";var i=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"tabcard"},[a("div",{staticClass:"tab-list"},t._l(t.tabData,(function(e,i){return a("div",{key:i,staticClass:"tab-item",class:{selected:t.currentTab==i},on:{click:function(a){return t.onSelected(i,e.id)}}},[a("p",{staticClass:"title"},[t._v(t._s(e.title))]),a("div",{directives:[{name:"show",rawName:"v-show",value:0==i,expression:"index == 0"}],staticClass:"fiexed-text"},[t._v("实时数据")]),a("div",{staticClass:"main"},[a("p",{staticClass:"today"},[a("span",[t._v(t._s(e.data.today.title))]),a("span",{staticClass:"value"},[t._v(t._s(e.data.today.value))])]),a("p",{staticClass:"yesterday"},[a("span",[t._v(t._s(e.data.yesterday.title))]),a("span",{staticClass:"value"},[t._v(t._s(e.data.yesterday.value))])]),a("p",{staticClass:"ratio"},[a("span",[t._v(t._s(e.data.ratio.title))]),a("span",{staticClass:"value",class:t.upOrDwon(e.data.status)},[t._v("\n            "+t._s(e.data.ratio.value)+"\n            "),a("i",{staticClass:"iconfont",class:t.upOrDwonIcon(e.data.status)})])])])])})),0),a("div",{staticClass:"chart"},[a("div",{staticClass:"filter"},[a("el-select",{staticClass:"select",attrs:{placeholder:"请选择",disabled:t.selectDisabled},on:{change:t.selectChange},model:{value:t.select,callback:function(e){t.select=e},expression:"select"}},t._l(t.options,(function(t){return a("el-option",{key:t.value,attrs:{label:t.label,value:t.value}})})),1),"basic"==t.name?a("el-date-picker",{staticClass:"picker",attrs:{type:"dates","picker-options":t.pickerOptions,"value-format":"yyyyMMdd",clearable:!1,placeholder:"选择日期","prefix-icon":"el-icon-plus",disabled:t.disabled},on:{change:t.pickerChange},model:{value:t.dates,callback:function(e){t.dates=e},expression:"dates"}}):t._e(),"income"==t.name?a("el-date-picker",{staticClass:"picker",attrs:{type:"dates","picker-options":t.pickerOptions,"value-format":"yyyyMMdd",clearable:!1,placeholder:"选择日期","prefix-icon":"el-icon-plus",disabled:t.disabled},on:{change:t.pickerChange},model:{value:t.dates,callback:function(e){t.dates=e},expression:"dates"}}):t._e()],1),a("div",{directives:[{name:"loading",rawName:"v-loading",value:t.loading,expression:"loading"}],staticClass:"line"},[a("div",{staticStyle:{width:"100%",height:"280px"},attrs:{id:"chart"}})])])])},n=[],s=(a("55dd"),a("7f7f"),a("ddd9")),r=a("313e"),o=a.n(r),c=a("c1df"),l=a.n(c),u={props:{name:{type:String,default:"basic"},tabData:[Array,Object],options:{type:Array,default:function(){return[]}},data:{type:Object,default:function(){}},request:{type:Function,default:function(){}}},data:function(){return{getChartDataFlag:!1,currentTab:0,upOrDwonIcon:s["i"],upOrDwon:s["h"],loading:!0,select:this.tabData[0].select||"income"===this.name?"4":"1",dates:[],settingId:this.tabData[0].id,myChart:null,selectDisabled:!1,pickerOptions:{disabledDate:function(t){return t.getTime()>Date.now()}}}},mounted:function(){var t=this;this.getChartData(),window.onresize=function(){t.myChart.resize()}},beforeDestroy:function(){this.myChart&&(o.a.dispose(this.myChart),this.myChart=null),window.onresize=null},methods:{getChartData:function(){var t=this;if(!this.getChartDataFlag){this.getChartDataFlag=!0;var e={select:this.select,settingId:this.settingId};"basic"==this.name&&(e.dates=this.dates),"income"==this.name&&(e.dates=this.dates),this.myChart&&(this.myChart.showLoading({text:"请稍等...",color:"rgba(250, 171, 78, 1)"}),this.myChart.clear()),this.$emit("appChange"),this.request(e).then((function(e){if(t.$emit("onChangeAppSelect"),t.getChartDataFlag=!1,1==e[2]){var a=e[1],i=a.series,n=a.xAxis;t.loading=!1,t.initChart(i,n),t.selectDisabled=!1}})).catch((function(e){t.getChartDataFlag=!1}))}},onSelected:function(t,e){this.currentTab=t,this.settingId=e,this.select=this.tabData[0].select||"1",this.dates=[],this.getChartData(),this.$emit("onSwitchTab",t)},pickerChange:function(t){var e=5,a=this.dates.length;a>e&&(this.dates.sort().splice(5,a-e),this.$message({message:"最多只能选5个时间",type:"warning"})),this.getChartData()},selectChange:function(){this.selectDisabled=!0,this.dates=[],this.getChartData()},initChart:function(t,e){var a=t.map((function(a,i){var n=a.name,s=a.data;return t.length>1?n==l()().format("YYYYMMDD")?{name:n,type:"line",itemStyle:{color:"#f06a23"},lineStyle:{type:"solid"},symbolSize:"0",smooth:!0,showAllSymbol:!0,data:s.map((function(t,a){var i=e?l()(String(e.data[a])).format("E"):0;return{value:s[a],symbol:"6"===i||"7"===i?"circle":"emptyCircle"}})),areaStyle:{color:"#f99629"}}:{name:n,type:"line",lineStyle:{type:"dashed"},symbolSize:"0",smooth:!0,showAllSymbol:!0,data:s.map((function(t,a){var i=e?l()(String(e.data[a])).format("E"):0;return{value:s[a],symbol:"6"===i||"7"===i?"circle":"emptyCircle"}}))}:{name:n,type:"line",lineStyle:{type:"solid"},symbolSize:7,symbol:"circle",data:s.map((function(t,a){var i=e?l()(String(e.data[a])).format("E"):0;return{value:s[a],symbol:"6"===i||"7"===i?"circle":"emptyCircle"}}))}}));this.myChart=o.a.init(document.getElementById("chart"));var i={tooltip:{trigger:"axis"},grid:{left:55,right:55,width:"auto"},xAxis:{type:"category",data:e.data,boundaryGap:!1,axisTick:{lineStyle:{opacity:"0"}},axisLine:{lineStyle:{color:"#AEB6C1"}}},yAxis:{type:"value",splitLine:{lineStyle:{type:"dashed"}},axisLine:{lineStyle:{color:"#AEB6C1"}},axisTick:{lineStyle:{opacity:"0"}}},series:a};this.myChart.setOption(i),this.myChart.hideLoading()}},watch:{$route:function(t,e){var a=this;"overview_basic_basic"===t.name&&setTimeout((function(){a.getChartData()}),500)}},computed:{disabled:function(){return this.select!=this.options[0].value},title:function(){var t=["今日","昨日"],e=["昨日","前日"];return"basic"==this.name?t:e}}},d=u,p=(a("3ddd"),a("2877")),h=Object(p["a"])(d,i,n,!1,null,"4c3cb0ff",null);e["a"]=h.exports},"230b":function(t,e,a){},"244c":function(t,e,a){"use strict";a("4803")},"2f21":function(t,e,a){"use strict";var i=a("79e5");t.exports=function(t,e){return!!t&&i((function(){e?t.call(null,(function(){}),1):t.call(null)}))}},"31db":function(t,e,a){"use strict";var i=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"dialog"},[a("el-dialog",{attrs:{title:"基础数据概览设置",visible:t.dialogVisible,width:"50%"},on:{"update:visible":function(e){t.dialogVisible=e}}},[a("div",{directives:[{name:"loading",rawName:"v-loading",value:t.loading,expression:"loading"}],staticClass:"checkbox-list"},t._l(t.form.children,(function(e,i){return a("div",{key:i,staticClass:"checkbox-item"},[a("p",{staticClass:"title"},[t._v(t._s(e.basename))]),a("el-checkbox-group",{ref:e.basename,refInFor:!0,on:{change:t.boxChange},model:{value:t.setting_ids,callback:function(e){t.setting_ids=e},expression:"setting_ids"}},t._l(e.children,(function(e){return a("el-checkbox",{key:e.id,attrs:{label:e.id}},[t._v(t._s(e.basename))])})),1)],1)})),0),a("p",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{on:{click:function(e){t.dialogVisible=!1}}},[t._v("取 消")]),a("el-button",{staticClass:"dialogCloseBtn",attrs:{type:"primary"},on:{click:t.confirm}},[t._v("确 定")])],1)])],1)},n=[],s=(a("ac6a"),a("cf87")),r=1,o={data:function(){return{setting_ids:[],form:{},pid:"",count:1,dialogVisible:!1,loading:!1}},methods:{confirm:function(){var t=this;if(0!==this.count){if(!this.loading){var e=this.setting_ids.join(",");Object(s["B"])({pid:this.pid,setting_ids:e}).then((function(e){1===e[2]?(t.$message({message:e[3],type:"success"}),t.$emit("onChange"),t.dialogVisible=!1):t.$message({message:e[0],type:"error"})}))}}else this.$confirm("请至少选择一个",{type:"warning"}).then((function(){})).catch((function(){}))},boxChange:function(t){this.count=0;var e=[];this.$refs["逐日更新数据"]?e=this.$refs["逐日更新数据"][0].$el.children:this.$refs["逐时更新数据"]&&(e=this.$refs["逐时更新数据"][0].$el.children);for(var a=0;a<e.length;a++)-1!==e[a].className.indexOf("is-checked")&&this.count++}},watch:{dialogVisible:function(t){var e=this;t?(this.loading=!this.loading,Object(s["r"])({pid:this.pid}).then((function(t){if(1===t[2]){var a=[];t[1].children.forEach((function(t){t.children.forEach((function(t){var e=t.clicked,i=t.id;e==r&&a.push(i)}))})),e.form=t[1],e.setting_ids=a,e.loading=!e.loading}}))):this.setting_ids=[]}}},c=o,l=(a("4fb3"),a("2877")),u=Object(l["a"])(c,i,n,!1,null,"6f6d9d14",null);e["a"]=u.exports},"35c7":function(t,e,a){},"3ddd":function(t,e,a){"use strict";a("db59")},4803:function(t,e,a){},"4a38":function(t,e,a){"use strict";var i=a("3835");a("c5f6");e["a"]=function(t){t=parseFloat(t);var e=[[0,19],[20,39],[40,59],[60,79],[80,99],[100,Number.POSITIVE_INFINITY]],a=["#F2F4F7","#bad3f7","#a0c3f5","#85b2f1","#6ca1ef","#5291ec","#0caed4"];if(!t)return a[0];for(var n=0;n<e.length;n++){var s=Object(i["a"])(e[n],2),r=s[0],o=s[1],c=n+1;if(t<=r)return a[c];if(t>=r&&t<=o)return a[c]}}},"4f77":function(t,e,a){},"4fb3":function(t,e,a){"use strict";a("9469")},"55dd":function(t,e,a){"use strict";var i=a("5ca1"),n=a("d8e8"),s=a("4bf8"),r=a("79e5"),o=[].sort,c=[1,2,3];i(i.P+i.F*(r((function(){c.sort(void 0)}))||!r((function(){c.sort(null)}))||!a("2f21")(o)),"Array",{sort:function(t){return void 0===t?o.call(s(this)):o.call(s(this),n(t))}})},"6d27":function(t,e,a){},"7b5a":function(t,e,a){"use strict";a("d3ad")},"8a58":function(t,e,a){"use strict";a("4f77")},"8b1c":function(t,e,a){},9149:function(t,e,a){},9469:function(t,e,a){},a3d1:function(t,e,a){"use strict";var i=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{directives:[{name:"loading",rawName:"v-loading",value:t.loading,expression:"loading"}],staticClass:"card"},[a("div",{staticClass:"head"},[a("div",{staticClass:"title"},[a("div",{staticClass:"text"},[t._v(t._s(t.title))]),t.desc?a("el-tooltip",{staticClass:"desc",attrs:{effect:"dark",placement:"right"}},[a("div",{staticClass:"tooltip-content",attrs:{slot:"content"},domProps:{innerHTML:t._s(t.desc)},slot:"content"}),a("i",{staticClass:"el-icon-info"})]):t._e()],1),a("div",{staticClass:"rt"},[a("div",{staticClass:"tt"},t._l(t.tips,(function(e,i){return a("span",{key:i,staticClass:"tt-item"},[t._v(t._s(e))])})),0),t.option.length&&"渠道日新增Top5"!=t.title?a("div",{staticClass:"form"},[a("div",{staticClass:"select"},[a("el-radio-group",{attrs:{size:"mini"},on:{change:t.selectChange},model:{value:t.selected,callback:function(e){t.selected=e},expression:"selected"}},t._l(t.option,(function(e){return a("el-radio-button",{key:e.label,attrs:{label:e.value,value:e.value}},[t._v(t._s(e.label))])})),1)],1)]):t._e(),"渠道日新增Top5"==t.title?a("div",{staticClass:"form"},[a("div",{staticClass:"select"},[a("el-select",{on:{change:t.selectChange},model:{value:t.selectdate,callback:function(e){t.selectdate=e},expression:"selectdate"}},t._l(t.option,(function(t){return a("el-option",{key:t.label,attrs:{label:t.label,value:t.value}})})),1)],1)]):t._e()])]),t.ratio.date?a("div",{staticClass:"contrast"},[a("div",{staticClass:"head"},[a("div",{staticClass:"date"},[a("span",{staticClass:"key"},[t._v(t._s(t.ratio.date.key))]),a("span",{staticClass:"value"},[t._v(t._s(t.ratio.date.value))])]),a("div",{staticClass:"two"},[a("span",{staticClass:"key"},[t._v(t._s(t.ratio.two.key))]),a("span",{staticClass:"value"},[t._v(t._s(t.ratio.two.value))])])]),a("div",{staticClass:"item-list"},[a("div",{staticClass:"item",class:t.upOrDwon(t.ratio.ratio.status)},[a("span",{staticClass:"key"},[t._v("环比")]),a("span",{staticClass:"value"},[t._v(t._s(t.ratio.ratio.value))])]),a("div",{staticClass:"item",class:t.upOrDwon(t.ratio.weekRatio.status)},[a("span",{staticClass:"key"},[t._v("周同比")]),a("span",{staticClass:"value"},[t._v(t._s(t.ratio.weekRatio.value))])]),a("div",{staticClass:"item",class:t.upOrDwon(t.ratio.monthRatio.status)},[a("span",{staticClass:"key"},[t._v("月同比")]),a("span",{staticClass:"value"},[t._v(t._s(t.ratio.monthRatio.value))])])])]):t._e(),a("div",{staticClass:"chart"},[t.chartData.requestEnd?a(t.component,{tag:"component",attrs:{propsData:t.chartData,echartsProp:t.echartsProp}}):t._e()],1)])},n=[],s=a("ddd9"),r={props:{title:String,tips:{type:Array,default:function(){return[]}},option:{type:Array,default:function(){return[]}},echartsProp:{type:Object,default:function(){}},request:{type:Function,default:function(){}},desc:{type:String,default:""},component:Object},data:function(){return{upOrDwon:s["h"],loading:!0,ratio:{},selected:"1",chartData:{},selectdate:7}},mounted:function(){"渠道日新增Top5"==this.title&&this.option.length&&(this.selected=this.option[0].value),this.getData()},methods:{getData:function(){var t=this;this.loading=!0;var e=this.option.length?this.selected:null,a=this.option.length&&"渠道日新增Top5"==this.title?this.option[this.selectdate-1].label:null;this.request({select:e,date:a}).then((function(e){var a=e[1],i=a.echarts,n=a.ratio;if(1==e[2]){if(!i)return;t.chartData=i,n&&(t.ratio=n),t.chartData.requestEnd=!0,t.loading=!1}}))},selectChange:function(){this.chartData={},console.log(this.selected),console.log(this.selectdate),this.getData()}}},o=r,c=(a("b3df"),a("2877")),l=Object(c["a"])(o,i,n,!1,null,"b070cacc",null);e["a"]=l.exports},a844:function(t,e,a){"use strict";a("35c7")},a914:function(t,e,a){"use strict";a("6d27")},b3df:function(t,e,a){"use strict";a("230b")},c2f8:function(t,e,a){},cf87:function(t,e,a){"use strict";a.d(e,"X",(function(){return l})),a.d(e,"db",(function(){return u})),a.d(e,"Y",(function(){return d})),a.d(e,"Z",(function(){return p})),a.d(e,"bb",(function(){return h})),a.d(e,"ab",(function(){return f})),a.d(e,"cb",(function(){return v})),a.d(e,"eb",(function(){return y})),a.d(e,"H",(function(){return b})),a.d(e,"L",(function(){return m})),a.d(e,"I",(function(){return g})),a.d(e,"G",(function(){return _})),a.d(e,"K",(function(){return C})),a.d(e,"J",(function(){return x})),a.d(e,"M",(function(){return S})),a.d(e,"m",(function(){return D})),a.d(e,"n",(function(){return k})),a.d(e,"ob",(function(){return w})),a.d(e,"mb",(function(){return A})),a.d(e,"k",(function(){return O})),a.d(e,"l",(function(){return P})),a.d(e,"W",(function(){return E})),a.d(e,"qb",(function(){return L})),a.d(e,"yb",(function(){return I})),a.d(e,"zb",(function(){return F})),a.d(e,"Ab",(function(){return T})),a.d(e,"kb",(function(){return B})),a.d(e,"lb",(function(){return j})),a.d(e,"hb",(function(){return M})),a.d(e,"jb",(function(){return $})),a.d(e,"ib",(function(){return q})),a.d(e,"r",(function(){return z})),a.d(e,"B",(function(){return V})),a.d(e,"y",(function(){return Q})),a.d(e,"o",(function(){return R})),a.d(e,"s",(function(){return N})),a.d(e,"u",(function(){return U})),a.d(e,"A",(function(){return G})),a.d(e,"z",(function(){return W})),a.d(e,"F",(function(){return K})),a.d(e,"C",(function(){return Y})),a.d(e,"v",(function(){return X})),a.d(e,"E",(function(){return J})),a.d(e,"D",(function(){return H})),a.d(e,"t",(function(){return Z})),a.d(e,"p",(function(){return tt})),a.d(e,"q",(function(){return et})),a.d(e,"x",(function(){return at})),a.d(e,"w",(function(){return it})),a.d(e,"fb",(function(){return nt})),a.d(e,"pb",(function(){return st})),a.d(e,"nb",(function(){return rt})),a.d(e,"U",(function(){return ot})),a.d(e,"T",(function(){return ct})),a.d(e,"V",(function(){return lt})),a.d(e,"c",(function(){return ut})),a.d(e,"a",(function(){return dt})),a.d(e,"P",(function(){return pt})),a.d(e,"N",(function(){return ht})),a.d(e,"O",(function(){return ft})),a.d(e,"Q",(function(){return vt})),a.d(e,"d",(function(){return yt})),a.d(e,"b",(function(){return bt})),a.d(e,"tb",(function(){return mt})),a.d(e,"sb",(function(){return gt})),a.d(e,"wb",(function(){return _t})),a.d(e,"vb",(function(){return Ct})),a.d(e,"xb",(function(){return xt})),a.d(e,"R",(function(){return St})),a.d(e,"S",(function(){return Dt})),a.d(e,"rb",(function(){return kt})),a.d(e,"ub",(function(){return wt})),a.d(e,"e",(function(){return At})),a.d(e,"g",(function(){return Ot})),a.d(e,"h",(function(){return Pt})),a.d(e,"i",(function(){return Et})),a.d(e,"f",(function(){return Lt})),a.d(e,"j",(function(){return It})),a.d(e,"gb",(function(){return Ft}));a("8e6e"),a("ac6a"),a("456d");var i=a("ade3"),n=a("5b78");function s(t,e){var a=Object.keys(t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(t);e&&(i=i.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),a.push.apply(a,i)}return a}function r(t){for(var e=1;e<arguments.length;e++){var a=null!=arguments[e]?arguments[e]:{};e%2?s(Object(a),!0).forEach((function(e){Object(i["a"])(t,e,a[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(a)):s(Object(a)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(a,e))}))}return t}function o(t){return function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return n["a"].post(t,r({},e)).then((function(t){return t})).catch((function(){}))}}function c(t){return function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return n["a"].post(t,r({},e),{headers:{"Content-Type":"application/x-www-form-urlencoded"}}).then((function(t){return t})).catch((function(){}))}}var l=o("Quantity_Statistics/detail"),u=o("Quantity_Statistics/levelSecondList"),d=(o("Quantity_Statistics/checkDate"),o("Quantity_Statistics/createAlgorithm")),p=o("Quantity_Statistics/createQuantity"),h=o("Quantity_Statistics/diyList"),f=o("Quantity_Statistics/deleteQuantity"),v=o("Quantity_Statistics/grade"),y=o("Quantity_Statistics/weight"),b=o("Day_Active_Predict/calculatorList"),m=o("Day_Active_Predict/getDayActiveDefaultValue"),g=o("Day_Active_Predict/calculatorSave"),_=o("Day_Active_Predict/calculatorCount"),C=o("Day_Active_Predict/delete"),x=o("Day_Active_Predict/dayCalculator"),S=o("Day_Active_Predict/predictCompare"),D=o("Channel_Manage/list"),k=(o("App/getChannel"),o("Channel_Manage/save")),w=(o("Dashboard/index"),o("User_Statistics/download")),A=o("User_Statistics/active"),O=o("Behavior_Statistics/startTime"),P=o("Behavior_Statistics/useTime"),E=o("Order_Statistics/conversionFunnel"),L=(o("Order_Statistics/orderMoney"),o("Order_Statistics/orderChargeBack"),o("Order_Statistics/allIncome"),o("User_Statistics/userValue")),I=(o("Order_Statistics/repurchase"),o("system/adminUserList")),F=o("system/operationList"),T=o("system/operationLog"),B=c("Transaction_Program/save"),j=o("Transaction_Program/show"),M=o("Transaction_Program/landInfo"),$=o("Transaction_Program/materialList"),q=o("Transaction_Program/landSave"),z=(o("File/uploadImage"),o("Dashboard/dashboardSetting")),V=o("Dashboard/saveBoardSetting"),Q=o("Dashboard/incomePer"),R=o("Dashboard/activePayUserPer"),N=o("Dashboard/deviceActiveVersion"),U=o("Dashboard/deviceNewTop5"),G=o("Dashboard/orderConversionFunnel"),W=o("Dashboard/lifeCycle"),K=(o("Dashboard/lifeCycleValue"),o("Dashboard/lifeCyclePayValue"),o("Dashboard/userValue")),Y=(o("Dashboard/newUserPay"),o("Dashboard/sevenDayOrderRecycle")),X=o("Dashboard/firstBuyRebuyPer"),J=o("Dashboard/userRoi"),H=o("Dashboard/userKeep"),Z=o("Dashboard/deviceAddDis"),tt=o("Dashboard/baseDashboard"),et=o("Dashboard/baseDashboardLine"),at=o("Dashboard/incomeDashboardLine"),it=o("Dashboard/incomeDashboard"),nt=o("System/apps"),st=(o("system/menu"),o("admin/get"),o("admin/save"),o("User_Statistics/keep")),rt=o("User_Statistics/activeKeep"),ot=o("Ip/originList"),ct=o("Ip/addLandingPage"),lt=o("Ip/updateLandingPage"),ut=(o("Ip/originListWithTitle"),o("Ip/ipStatics"),o("Apartment_Manage/index")),dt=o("Apartment_Manage/create"),pt=o("Group_Manage/index"),ht=o("Group_Manage/create"),ft=o("Group_Manage/delete"),vt=o("Group_Manage/store"),yt=o("Apartment_Manage/store"),bt=o("Apartment_Manage/delete"),mt=o("income/index"),gt=o("income/incomeChannelList"),_t=o("income/storeIncomeChannel"),Ct=o("income/saveAd"),xt=o("income/updateChannelShow"),St=o("Invest_Statistics/investChannelList"),Dt=(o("Invest_Statistics/store_invest_channel"),o("Invest_Statistics/classify"),o("Invest_Statistics/invest_channels"),o("Invest_Statistics/services_types"),o("Invest_Statistics/updateChannelShow")),kt=(o("Invest_Statistics/index"),o("admin/index")),wt=o("income/operateList"),At=o("App/ipblack_city_add_province"),Ot=o("App/ipblack_city_list"),Pt=o("App/ipblack_ip_add"),Et=o("App/ipblack_ip_list"),Lt=o("App/ipblack_city_delete"),It=o("App/ipblck_ip_delete"),Ft=(o("Invest_Statistics/addInvestChannel"),o("System/getQuickAK"));o("System/addCpc"),o("System/getCpcList"),o("System/updateCpc")},d3ad:function(t,e,a){},db59:function(t,e,a){},ddd9:function(t,e,a){"use strict";a.d(e,"d",(function(){return ut})),a.d(e,"g",(function(){return dt})),a.d(e,"h",(function(){return bt})),a.d(e,"i",(function(){return mt})),a.d(e,"a",(function(){return gt})),a.d(e,"b",(function(){return _t})),a.d(e,"c",(function(){return ot})),a.d(e,"e",(function(){return ct})),a.d(e,"f",(function(){return lt}));a("ac6a");for(var i=a("cf87"),n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"bar1"},[a("div",{staticStyle:{width:"100%",height:"270px"},attrs:{id:t.id}})])},s=[],r=a("313e"),o=a.n(r),c={props:["propsData","echartsProp"],mounted:function(){var t=this.echartsProp.inverse,e=this.propsData,a=e.yAxis,i=e.series,n=a.data,s=i.data,r=o.a.init(document.getElementById(this.id)),c={backgroundColor:"#fff",tooltip:{axisPointer:{type:"shadow"}},grid:{top:17,bottom:47,x:130},yAxis:{type:"category",data:n,inverse:t,axisTick:{lineStyle:{opacity:"0"}},axisLine:{show:!1},axisLabel:{formatter:function(t){var e="",a=t.length,i=18,n=Math.ceil(a/i);if(a>i)for(var s=0;s<n;s++){var r="",o=s*i,c=o+i;r=s==n-1?t.substring(o,a):t.substring(o,c)+"\n",e+=r}else e=t;return e}}},xAxis:{show:!1,type:"value"},series:[{barWidth:"18",data:s,type:"bar",label:{show:!0,position:"right"},itemStyle:{color:"#FAAB4E"}}]};r.setOption(c)},computed:{id:function(){return Math.random()}}},l=c,u=(a("dff0"),a("2877")),d=Object(u["a"])(l,n,s,!1,null,"872226d8",null),p=d.exports,h=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"bar2"},[a("div",{staticStyle:{width:"100%",height:"200px"},attrs:{id:t.id}})])},f=[],v=(a("456d"),a("6762"),a("2fdb"),a("7f7f"),{props:["propsData","echartsProp"],mounted:function(){var t=this,e=this.propsData,a=e.yAxis,i=e.series,n=a.data,s=i.data.map((function(t,e){var a=t.name,i=t.data;return{name:a,data:i,type:"bar",stack:"two",barWidth:40,itemStyle:{}}}));try{s.forEach((function(e){Object.keys(t.echartsProp.series).includes("stack")&&(e.stack=null)}))}catch(l){}var r=o.a.init(document.getElementById(this.id)),c={tooltip:{trigger:"axis",axisPointer:{type:"shadow"}},grid:{top:0,bottom:20},yAxis:{type:"value",show:!1},xAxis:{type:"category",data:n,axisTick:{lineStyle:{opacity:"0"}},axisLine:{show:!1}},color:["#5291EC","#16C06F","#FFC706","#8267DB","#FF6573"],series:s};r.setOption(c)},computed:{id:function(){return Math.random()}}}),y=v,b=(a("7b5a"),Object(u["a"])(y,h,f,!1,null,"d469607e",null)),m=b.exports,g=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"bar3"},[a("div",{staticStyle:{width:"100%",height:"270px"},attrs:{id:t.id}})])},_=[],C=[],x=0;x<30;x++)0===x?C[0]=["score","amount","product"]:C[x]=[100*Math.random(),1e3*Math.random(),"07-".concat(x)];var S={props:["propsData"],mounted:function(){var t=this.propsData.dataset.source,e=o.a.init(document.getElementById(this.id)),a={barWidth:6,tooltip:{trigger:"axis",axisPointer:{type:"shadow",shadowStyle:{color:"rgba(150,150,150,0.1)"}}},emphasis:{itemStyle:{color:"#347FEF"}},dataset:{source:t},grid:{top:"10%",left:"3%",right:"4%",containLabel:!0},xAxis:{type:"category",axisTick:{lineStyle:{opacity:"0"}},axisLine:{lineStyle:{color:"#AEB6C1"}}},yAxis:{splitLine:{lineStyle:{type:"dashed"}},axisTick:{lineStyle:{opacity:"0"}},axisLine:{lineStyle:{color:"#AEB6C1"}}},series:[{type:"bar",encode:{y:"amount",x:"product"},itemStyle:{color:"#7BB1ED"}}]};e.setOption(a)},computed:{id:function(){return Math.random()}}},D=S,k=(a("244c"),Object(u["a"])(D,g,_,!1,null,"e2e1ad52",null)),w=k.exports,A=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"bar2"},[a("div",{staticStyle:{width:"100%",height:"200px"},attrs:{id:t.id}})])},O=[],P={props:["propsData","echartsProp"],mounted:function(){var t=this.propsData,e=t.yAxis,a=t.series,i=e.data,n=a.data.map((function(t,e){var a=t.name,i=t.data,n=t.type;return{name:a,data:i,type:n,stack:2===e?"":"1",barWidth:20,yAxisIndex:2===e?1:0}})),s=o.a.init(document.getElementById(this.id)),r={tooltip:{trigger:"axis",axisPointer:{type:"shadow"}},grid:{top:0,bottom:20},yAxis:[{type:"value",splitLine:{lineStyle:{color:"#fff"}},axisLine:{lineStyle:{color:"#AEB6C1"}}},{type:"value",axisLabel:{formatter:"{value} %"},splitLine:{lineStyle:{color:"#fff"}},axisLine:{lineStyle:{color:"#AEB6C1"}}}],xAxis:{type:"category",data:i,axisTick:{lineStyle:{opacity:"0"}},axisLine:{show:!1}},color:["#5291EC","#16C06F","#FFC706","#8267DB","#FF6573"],series:n};s.setOption(r)},computed:{id:function(){return Math.random()}}},E=P,L=(a("a914"),Object(u["a"])(E,A,O,!1,null,"f3fd5892",null)),I=L.exports,F=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"line1"},[a("div",{staticStyle:{width:"100%",height:"270px"},attrs:{id:t.id}})])},T=[],B=a("c1df"),j=a.n(B),M={props:["propsData"],beforeDestroy:function(){this.echarts&&(o.a.dispose(this.echarts),this.echarts=null)},data:function(){return{charts:null}},mounted:function(){var t=this.propsData,e=t.xAxis,a=t.series,i=e.data,n=a.map((function(t){for(var e=t.name,a=t.data,n=[],s=0;s<i.length;s++){var r=i[s],o=j()(String(r)).format("E");n.push({value:a[s],symbol:"6"===o||"7"===o?"circle":"emptyCircle",symbolSize:"6"===o||"7"===o?6:0})}return{name:e,data:n,type:"line"}}));this.echarts=o.a.init(document.getElementById(this.id));var s={tooltip:{trigger:"axis"},grid:{top:37,bottom:47},xAxis:{type:"category",data:i,boundaryGap:!1,axisTick:{lineStyle:{opacity:"0"}},axisLine:{lineStyle:{color:"#AEB6C1"}}},yAxis:{type:"value",splitLine:{lineStyle:{type:"dashed"}},axisLine:{lineStyle:{color:"#AEB6C1"}},axisTick:{lineStyle:{opacity:"0"}}},color:"#FF981F",series:n};this.echarts.setOption(s)},computed:{id:function(){return Math.random()}}},$=M,q=(a("8a58"),Object(u["a"])($,F,T,!1,null,"1e43c93e",null)),z=q.exports,V=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"lin2"},[a("div",{staticStyle:{width:"100%",height:"280px"},attrs:{id:t.id}})])},Q=[],R={props:["propsData"],data:function(){return{charts:null}},beforeDestroy:function(){this.echarts&&(o.a.dispose(this.echarts),this.echarts=null)},mounted:function(){var t=this.propsData,e=t.xAxis,a=t.series,i=[],n=a.map((function(t,a){var n=t.name,s=t.data;i.push(n);for(var r=[],o=0;o<e.data.length;o++){var c=e.data[o],l=j()(String(c)).format("E");r.push({value:s[o],symbol:"6"===l||"7"===l?"circle":"emptyCircle",symbolSize:"6"===l||"7"===l?6:0})}var u="";switch(a){case 0:u="#D667BD";break;case 1:u="#4CCBD5";break;case 2:u="#90BA61";break;case 3:u="#385BF1";break;case 4:u="#FF981F";break}return{name:n,type:"line",data:r,itemStyle:{color:u}}}));this.echarts=o.a.init(document.getElementById(this.id));var s={tooltip:{trigger:"axis"},legend:{data:i,bottom:-5},grid:{top:"10%",left:"3%",right:"4%",bottom:"10%",containLabel:!0},xAxis:{type:"category",data:e.data,boundaryGap:!1,axisLine:{lineStyle:{color:"#AEB6C1"}},axisTick:{lineStyle:{opacity:"0"}}},yAxis:{type:"value",splitLine:{lineStyle:{type:"dashed"}},axisTick:{lineStyle:{opacity:"0"}},axisLine:{lineStyle:{color:"#AEB6C1"}}},series:n};this.echarts.setOption(s)},computed:{id:function(){return Math.random()}}},N=R,U=(a("084d"),Object(u["a"])(N,V,Q,!1,null,"25c9a332",null)),G=U.exports,W=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"pie"},[a("div",{staticStyle:{width:"100%",height:"270px"},attrs:{id:t.id}})])},K=[],Y={props:["propsData"],mounted:function(){var t=this.propsData,e=t.legend,a=t.series,i=e.data.map((function(t){return{name:t,icon:"circle"}})),n=a.data.map((function(t,e){switch(e){case 1:t.itemStyle={color:"#FFAA46"};break;case 2:t.itemStyle={color:"#F35B5B"}}return t})),s=o.a.init(document.getElementById(this.id)),r={tooltip:{trigger:"item",formatter:"{b}: {c} ({d}%)"},legend:{type:"scroll",orient:"vertical",right:10,top:"5%",data:i},backgroundColor:"#fff",series:[{type:"pie",radius:["45%","70%"],avoidLabelOverlap:!1,label:{show:!0,position:"inner",formatter:function(t){var e=t.percent;return e>0?"".concat(e,"%"):""},fontSize:12},emphasis:{label:{show:!0,fontWeight:"bold"}},labelLine:{show:!0},data:n}]};s.setOption(r)},computed:{id:function(){return Math.random()}}},X=Y,J=(a("fc75"),Object(u["a"])(X,W,K,!1,null,"564059b8",null)),H=J.exports,Z=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"table"},[a("table",{staticStyle:{margin:"0 auto"}},[a("thead",[a("tr",t._l(t.propsData.tableData[0],(function(e,i){return a("th",{key:i},[t._v(t._s(e))])})),0)]),a("tbody",t._l(t.trs,(function(e,i){return a("tr",{key:i},t._l(e,(function(e,i){return a("td",{key:i,style:{backgroundColor:""+e.color}},[t._v(t._s(e.value))])})),0)})),0)])])},tt=[],et=a("4a38"),at={props:["propsData"],data:function(){return{trs:[]}},created:function(){this.getTr()},methods:{getTr:function(){for(var t=this.propsData.tableData,e=[],a=1;a<t.length;a++){var i=t[a].map((function(t,e){return e&&t?{color:Object(et["a"])(t),value:t}:{value:t}}));e.push(i)}this.trs=e}}},it=at,nt=(a("a844"),Object(u["a"])(it,Z,tt,!1,null,"7c853873",null)),st=nt.exports,rt=[];Object(i["u"])().then((function(t){t&&t[1].date.forEach((function(t,e){rt.push({value:e+1,label:t})}))}));var ot=[{value:"1",label:"今天对比昨天"},{value:"2",label:"最近7天"},{value:"3",label:"最近30天"},{value:"4",label:"最近60天"}],ct=[{value:"1",label:"最近7天"},{value:"2",label:"最近30天"},{value:"3",label:"最近60天"}],lt=[{value:"4",label:"今天对比昨天"},{value:"1",label:"最近7天"},{value:"2",label:"最近30天"},{value:"3",label:"最近60天"}],ut=[{id:7,title:"新激活设备",data:{status:0,today:{title:"今日实时",value:0},yesterday:{title:"昨日全天",value:0},ratio:{title:"昨日同期",value:0}}},{id:8,title:"活跃用户数",data:{status:0,today:{title:"今日实时",value:0},yesterday:{title:"昨日全天",value:0},ratio:{title:"昨日同期",value:0}}},{id:10,title:"人均启动次数",data:{status:0,today:{title:"今日实时",value:0},yesterday:{title:"昨日全天",value:0},ratio:{title:"昨日同期",value:0}}},{id:11,title:"均次使用时长",data:{status:0,today:{title:"今日实时",value:0},yesterday:{title:"昨日全天",value:0},ratio:{title:"昨日同期",value:0}}}],dt=[{id:19,title:"订单收入(元)",data:{status:0,today:{title:"今日",value:0},yesterday:{title:"昨日",value:0},ratio:{title:"环比",value:0}}},{id:17,title:"收入(元)",data:{status:0,today:{title:"昨日",value:0},yesterday:{title:"前日",value:0},ratio:{title:"环比",value:0}}},{id:18,title:"广告收入(元)",data:{status:0,today:{title:"昨日",value:0},yesterday:{title:"前日",value:0},ratio:{title:"环比",value:0}}},{id:20,title:"支出(元)",data:{status:0,today:{title:"昨日",value:0},yesterday:{title:"前日",value:0},ratio:{title:"环比",value:0}}},{id:21,title:"毛利(元)",data:{status:0,today:{title:"昨日",value:0},yesterday:{title:"前日",value:0},ratio:{title:"环比",value:0}}},{id:22,title:"单用户价值(元)",data:{status:0,today:{title:"昨日",value:0},yesterday:{title:"前日",value:0},ratio:{title:"环比",value:0}}}],pt=[{value:"1",label:"30天前"},{value:"2",label:"60天前"},{value:"3",label:"120天前"}],ht=[{value:"1",label:"订单量"},{value:"2",label:"订单金额"}],ft=[{value:"1",label:"新用户留存"},{value:"2",label:"活跃用户留存"}],vt=[{value:"1",label:"全部用户"},{value:"2",label:"付费用户"}],yt=[{value:"1",label:"全部"},{value:"2",label:"订单"},{value:"3",label:"广告"}];function bt(t){var e="";switch(t){case-1:e="down";break;case 0:break;case 1:e="up";break}return e}function mt(t){var e="";switch(t){case-1:e="icon-xiadie";break;case 1:e="icon-shangzhang";break}return e}var gt=[{id:16,title:"活跃用户付费用户占比",tips:["(今日)"],desc:"活跃用户付费用户占比=活跃会员（设备）数量/活跃用户（设备）数量<br>注意“活跃会员（设备）数量”为APP前端SDK上报的，并不完全等于活跃的付费账号数量。<br>如果APP的SDK版本较早可能会出现无活跃会员数据的情况。",request:i["o"],component:H},{id:12,title:"渠道新增分布",tips:["(前5位近7日)","(仅Android)"],desc:"指新增用户（设备）中前5名的渠道的近7日新增曲线。<br>方便及时查看主要新增渠道的变化趋势。",request:i["t"],component:G},{id:13,title:"版本活跃分布",tips:["(昨日)"],desc:"指昨天活跃用户（设备）数量中前6名的渠道号分布。<br>用于关注APP发版后新版的覆盖情况。",echartsProp:{inverse:!0},request:i["s"],component:p},{id:40,title:"渠道日新增Top5",desc:"近七日内，单日新增数量排前五的渠道",echartsProp:{inverse:!0},option:rt,request:i["u"],component:p},{id:14,title:"留存率",desc:"可以切换“新用户留存”和“活跃用户留存”。<br>X天新用户留存=当日新增用户在X天的活跃数/当日新用户数量<br>X天活跃用户留存=当日活跃用户在X天的活跃数/当日活跃用户数量",option:ft,request:i["D"],component:st},{id:15,title:"用户生命周期",desc:"当天新激活设备(n)启动次数累加总次数(m)，每天只记录1次启动，除以当天新激活设备(n)。如<br>1月1日新激活设备1000个，第2天启动设备600，第3天启动设备300，第4天启动设备100，则<br>第2天LT = (1000 + 600) / 1000，第3天LT = (1000 + 600 + 300) / 1000，第四天LT = <br>(1000 + 600 + 300 + 100) / 1000<br>可以筛选查看30天/60天前，到今天的LT。",tips:[],option:pt,request:i["z"],component:w}],_t=[{id:23,title:"收入占比",tips:["(昨日)"],desc:"昨天总收入中，订单收入和广告收入的占比。",request:i["y"],component:H},{id:25,title:"首日付费新用户",desc:"当天新增激活设备所注册的账号，以及这些账号在当天内完成支付的订单<br>（包括当天复购的订单）。",request:i["v"],option:ht,component:m},{id:27,title:"ROI",desc:"投资回报率（ROI）= 当日新增用户带来的总收入 / 当日推广金额<br>订单ROI=当日新增用户带来的订单收入 / 当日推广金额<br>广告ROI=当日新增用户带来的广告收入 / 当日推广金额",option:yt,request:i["E"],component:st},{id:24,title:"付费转化",desc:"指当天新增的设备，后续完成注册、下单、支付的数量。<br>这里展示的注册、下单、支付都仅限",echartsProp:{inverse:!1},request:i["A"],component:p},{id:26,title:"单用户价值",tips:["(近7日)"],desc:"单用户价值=总收入/活跃用户<br>单付费用户价值=支付成功金额/支付成功人数",request:i["F"],option:vt,component:z},{id:29,title:"毛利率",desc:"毛利=总收入-支出<br>毛利率=毛利/总收入",echartsProp:{series:{stack:null}},request:i["C"],tips:[""],component:I}]},dff0:function(t,e,a){"use strict";a("9149")},fc75:function(t,e,a){"use strict";a("c2f8")}}]);
//# sourceMappingURL=chunk-07bb14e7.1.0.0.1672021042960.js.map