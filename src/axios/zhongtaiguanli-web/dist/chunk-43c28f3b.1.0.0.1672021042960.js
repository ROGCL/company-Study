(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-43c28f3b"],{"06bb":function(t,e,a){"use strict";a("f122")},"096b":function(t,e,a){"use strict";a("2c96")},"2c96":function(t,e,a){},"2f21":function(t,e,a){"use strict";var n=a("79e5");t.exports=function(t,e){return!!t&&n((function(){e?t.call(null,(function(){}),1):t.call(null)}))}},"55dd":function(t,e,a){"use strict";var n=a("5ca1"),i=a("d8e8"),o=a("4bf8"),r=a("79e5"),l=[].sort,s=[1,2,3];n(n.P+n.F*(r((function(){s.sort(void 0)}))||!r((function(){s.sort(null)}))||!a("2f21")(l)),"Array",{sort:function(t){return void 0===t?l.call(o(this)):l.call(o(this),i(t))}})},"5e7d":function(t,e,a){"use strict";a.d(e,"b",(function(){return o})),a.d(e,"a",(function(){return l})),a.d(e,"c",(function(){return r}));var n=a("c1df"),i=a.n(n),o={shortcuts:[{text:"昨天",onClick:function(t){var e=new Date,a=new Date;a.setTime(a.getTime()-864e5),t.$emit("pick",[a,e])}},{text:"近一周",onClick:function(t){var e=new Date,a=new Date;a.setTime(a.getTime()-6048e5),t.$emit("pick",[a,e])}},{text:"近30天",onClick:function(t){var e=i()().subtract(1,"months").format("YYYY-MM-DD"),a=i()().format("YYYY-MM-DD");t.$emit("pick",[e,a])}},{text:"近60天",onClick:function(t){var e=i()().subtract(2,"months").format("YYYY-MM-DD"),a=i()().format("YYYY-MM-DD");t.$emit("pick",[e,a])}},{text:"近90天",onClick:function(t){var e=i()().subtract(3,"months").format("YYYY-MM-DD"),a=i()().format("YYYY-MM-DD");t.$emit("pick",[e,a])}},{text:"本月",onClick:function(t){var e=new Date,a=e.getFullYear(),n=e.getMonth()+1,i=new Date(a+"-"+n+"-01");t.$emit("pick",[i,e])}},{text:"上个月",onClick:function(t){var e=i()().subtract(1,"months").endOf("month"),a=e.format("YYYY-MM-DD"),n=e.format("YYYY-MM-01");t.$emit("pick",[n,a])}}]},r=function(t){return[{label:"天",value:1,disabled:!1},{label:"周",value:2,disabled:i()(t[1]).diff(i()(t[0]),"days")<7},{label:"月",value:3,disabled:i()(t[1]).diff(i()(t[0]),"months")<1}]},l=[{label:"总订单统计",value:0,disabled:!1}]},"8bb5":function(t,e,a){"use strict";var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"count-wrap"},[t._t("title"),a("div",{staticClass:"count-option"},[a("el-form",{attrs:{inline:!0}},[a("el-row",[t._t("option"),a("div",{staticClass:"cetent"},[t._t("cetent")],2)],2)],1),a("div",{staticClass:"extra"},[t._t("extra",(function(){return[Object.keys(t.countInfo).length?a("div",{staticClass:"tag"},[a("div",{staticClass:"tag-item"},[a("div",{staticClass:"name"},[t._v(t._s(t.countShow))]),a("div",{staticClass:"value"},[t._v(t._s(t.countInfo.total))])]),a("div",{staticClass:"tag-item"},[a("div",{staticClass:"name"},[t._v("平均:")]),a("div",{staticClass:"value"},[t._v(t._s(t.countInfo.avg))])])]):t._e()]}))],2),a("div",{staticClass:"extra"},[t._t("extras",(function(){return[t.countInfoArr.length<=2&&t.countInfoArr.length?a("div",{staticClass:"tags"},t._l(t.countInfoArr,(function(e,n){return a("div",{key:n,staticStyle:{display:"flex"}},[a("div",{staticClass:"tag-item",staticStyle:{"font-weight":"bolder"}},[t._v("\n              "+t._s(e.name)+"：\n            ")]),a("div",{staticClass:"tag-item"},[a("div",{staticClass:"name"},[t._v("合计")]),a("div",{staticClass:"value"},[t._v("\n                "+t._s(t._f("countInfoFilters")(e.total,e))+"\n              ")])]),a("div",{staticClass:"tag-item"},[a("div",{staticClass:"name"},[t._v("均值:")]),a("div",{staticClass:"value"},[t._v(t._s(t._f("countInfoFilters")(e.avg,e)))])])])})),0):t._e(),t.countInfoArr.length>2&&t.countInfoArr.length?a("div",{staticClass:"tags"},[t._l(t.countInfoArr.slice(0,2),(function(e,n){return a("div",{key:n,staticStyle:{display:"flex"}},[a("div",{staticClass:"tag-item",staticStyle:{"font-weight":"bolder"}},[t._v("\n              "+t._s(e.name)+"：\n            ")]),a("div",{staticClass:"tag-item"},[a("div",{staticClass:"name"},[t._v("合计")]),a("div",{staticClass:"value"},[t._v("\n                "+t._s(t._f("countInfoFilters")(e.total,e))+"\n              ")])]),a("div",{staticClass:"tag-item"},[a("div",{staticClass:"name"},[t._v("均值:")]),a("div",{staticClass:"value"},[t._v(t._s(t._f("countInfoFilters")(e.avg,e)))])])])})),a("el-dropdown",{staticStyle:{"z-index":"9999"}},[a("span",{staticClass:"el-dropdown-link"},[t._v("\n              详情"),a("i",{staticClass:"el-icon-arrow-down el-icon--right"})]),a("el-dropdown-menu",{attrs:{slot:"dropdown"},slot:"dropdown"},t._l(t.countInfoArr.slice(2),(function(e,n){return a("el-dropdown-item",{key:n},[t._v("\n                "+t._s(e.name)+"： 合计"+t._s(t._f("countInfoFilters")(e.total,e))+"，均值 "+t._s(t._f("countInfoFilters")(e.avg,e))+"\n              ")])})),1)],1)],2):t._e()]}))],2)],1),a("div",{ref:"count",staticStyle:{width:"100%",height:"400px"}}),t._t("option-two")],2)},i=[],o=(a("c5f6"),a("ac6a"),a("7f7f"),a("28a5"),a("c1df")),r=a.n(o),l=a("2ef0"),s=a.n(l),c={name:"countLayout",props:{type:{validator:function(t){return-1!==["line","bar","newBar","mix","newMix"].indexOf(t)},default:"line"},option:{type:Object,default:function(){return{}}},loading:{type:Boolean,default:!1},countInfo:{type:Object,default:function(){return{}}},countInfoArr:{type:Array,default:function(){return[]}}},data:function(){return{countShow:"合计:",$count:null}},mounted:function(){var t=this;this.$count=this.$echarts.init(this.$refs.count),window.onresize=function(){t.$count&&t.$count.resize()},"bar"!==this.type?"newBar"!==this.type?"mix"!==this.type?("newMix"===this.type&&this.drawNewMixCount(),this.drawCount()):this.drawMixCount():this.drawNewBarCount():this.drawBarCount()},watch:{option:function(t){"bar"!==this.type?"newBar"!==this.type?"mix"!==this.type?"newMix"!==this.type?this.drawCount(t):this.drawNewMixCount():this.drawMixCount():this.drawNewBarCount(t):this.drawBarCount(t)},loading:function(t){t?this.$count.showLoading():this.$count.hideLoading()}},filters:{countInfoFilters:function(t,e){var a=s.a.cloneDeep(t+"").split(".");return e.hasPercentSign?parseFloat(t).toLocaleString()+"%":parseFloat(t).toLocaleString("zh",{minimumFractionDigits:a.length>1?a[1].length:0})}},methods:{drawCount:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:this.option,e=t.editData,a=t.legendData,n=void 0===a?[]:a,i=t.xAxisData,o=void 0===i?[]:i,l=t.data,s=void 0===l?[]:l,c=t.yName,u=void 0===c?"":c,d=t.yScale,h=void 0!==d&&d,p=t.formatter,f=void 0===p?function(t){return t}:p,m=t.xName,b=void 0===m?"":m;this.countShow="百分比"===u?"":"合计:";var v,g=this.type;if(e){var y=[];for(var x in s){var C={};for(var w in C.name=x,C.data=[],s[x])C.data.push(s[x][w]);y.push(C)}v=y.map((function(t){return{name:t.name,type:g,symbolSize:"7",smooth:!0,showAllSymbol:!0,hoverAnimation:!1,data:t.data.map((function(t,e){var a=o?r()(String(t.date)).format("E"):0;return{value:String(t.value),cycle:t.cycle,rate:t.rate,symbol:"6"===a||"7"===a?"circle":"emptyCircle"}}))}}))}else v=s.map((function(t){return{name:t.name,type:g,symbolSize:"7",smooth:!0,showAllSymbol:!0,hoverAnimation:!1,data:t.data.map((function(t,e){var a=o?r()(o[e]).format("E"):0;return{value:t,symbol:"6"===a||"7"===a?"circle":"emptyCircle"}}))}}));this.$count.clear(),this.$count.setOption({tooltip:{trigger:"axis",borderRadius:6,formatter:function(t){var a="".concat(t[0].name," <br/>");return t.length&&t.forEach((function(t){var n="百分比"===u?"%":"",i=void 0===t.data.rate?"":"同比：".concat(t.data.rate,"% 环比：").concat(t.data.cycle,"% <br/>");a+=e?t["seriesName"]+": "+f(t["value"])+n+"<br>"+i:t["seriesName"]+": "+f(t["value"])+"<br>"})),a}},noDataLoadingOption:{text:"暂无数据",effect:"bubble",effectOption:{effect:{n:0}}},legend:{data:n},grid:{left:"3%",right:"6%",bottom:"3%",containLabel:!0},xAxis:{type:"category",name:b,data:o,axisLabel:{fontSize:12,color:"#8C8C8C"}},yAxis:{type:"value",name:u,scale:h,splitLine:{lineStyle:{type:"dashed"}},axisLabel:{fontSize:13,color:"#8C8C8C",padding:[0,10,0,0],formatter:function(t){var e="百分比"===u?"%":"";return f&&f(t)+e}}},series:v})},drawBarCount:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:this.option,e=t.xAxis,a=void 0===e?[]:e,n=t.yAxis,i=void 0===n?[]:n,o=t.series,r=void 0===o?[]:o,l=t.legend,s=void 0===l?[]:l,c=t.tooltip,u=void 0===c?{trigger:"axis",borderRadius:6}:c;this.$count.clear(),this.$count.setOption({color:["#3398DB"],tooltip:u,legend:s,grid:{left:"3%",right:"6%",bottom:"3%",containLabel:!0},xAxis:a,yAxis:i,series:r})},drawNewBarCount:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:this.option,e=t.legendData,a=void 0===e?[]:e,n=t.xAxisData,i=void 0===n?[]:n,o=t.data,r=void 0===o?[]:o,l=t.yName,s=void 0===l?"":l,c=t.allName,u=void 0===c?"合计":c,d=t.yScale,h=void 0!==d&&d,p=t.formatter,f=void 0===p?function(t){if(t.length){var e="".concat(t[0].axisValueLabel,"<br/>"),a=0;return t.forEach((function(t){a+=Number(t.value),a=Number(a.toFixed(2)),e+="".concat(t.marker).concat(t.seriesName,"：").concat(t.value,"<br/>")})),u?e+"".concat(u,"：").concat(a.toFixed(2),"<br/>"):e}return""}:p,m=r.map((function(t){return{type:"bar",stack:"two",name:t.name,data:t.data,label:t.showlabel?{normal:{show:!0,position:"top",textStyle:{color:"#000"}}}:""}}));this.$count.clear(),this.$count.setOption({tooltip:{trigger:"axis",borderRadius:6,axisPointer:{type:"shadow"},formatter:function(t){return f(t)}},legend:{data:a},grid:{left:"3%",right:"6%",bottom:"3%",containLabel:!0},xAxis:{type:"category",data:i,axisLabel:{fontSize:12,color:"#8C8C8C"}},yAxis:{type:"value",name:s,scale:h,splitLine:{lineStyle:{type:"dashed"}},axisLabel:{fontSize:13,color:"#8C8C8C",padding:[0,10,0,0]}},color:["#5291EC","#16C06F","#FFC706","#8267DB","#FF6573"],series:m})},drawMixCount:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:this.option,e=t.legendData,a=void 0===e?[]:e,n=t.xAxisData,i=void 0===n?[]:n,o=t.data,r=void 0===o?[]:o,l=t.yAxis,s=void 0===l?{}:l,c=t.formatter,u=void 0===c?function(t){if(t.length){var e="".concat(t[0].axisValueLabel,"<br/>"),a=0;return t.forEach((function(t){a+=Number(t.value),e+="".concat(t.marker).concat(t.seriesName,"：").concat(t.value,"<br/>")})),e+"合计：".concat(a,"<br/>")}return""}:c;this.$count.clear(),this.$count.setOption({tooltip:{trigger:"axis",borderRadius:6,axisPointer:{type:"shadow"},formatter:function(t){return u(t)}},legend:{data:a},grid:{left:"3%",right:"6%",bottom:"3%",containLabel:!0},xAxis:{type:"category",data:i,axisLabel:{fontSize:12,color:"#8C8C8C"}},yAxis:s,color:["#5291EC","#FFC706","#8267DB","#16C06F","#FF6573"],series:r})},drawNewMixCount:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:this.option,e=t.legendData,a=void 0===e?[]:e,n=t.xAxisData,i=void 0===n?[]:n,o=t.data,l=void 0===o?[]:o,s=t.yAxis,c=void 0===s?{}:s,u=t.formatter,d=void 0===u?function(t){return""}:u;console.log(l);var h,p=["#FF981F","#5291ec"];h=l.map((function(t,e){return{name:t.name,type:"line",symbolSize:"7",smooth:!0,showAllSymbol:!0,hoverAnimation:!1,yAxisIndex:t.yAxisIndex,data:t.data.map((function(t,e){var a=i?r()(i[e]).format("E"):0;return{value:t,symbol:"6"===a||"7"===a?"circle":"emptyCircle"}})),itemStyle:1==l.length?{color:"#FF981F"}:2==l.length?{color:p[e]}:{}}})),console.log(h),this.$count.clear(),console.log(i,c),this.$count.setOption({tooltip:{trigger:"axis",formatter:function(t){return d(t)}},legend:{data:a},grid:{left:"3%",right:"6%",bottom:"3%",containLabel:!0},xAxis:{type:"category",data:i,axisLabel:{fontSize:12,color:"#8C8C8C"},axisTick:{alignWithLabel:!0}},yAxis:c,color:["#FFC706","#5291EC","#8267DB","#16C06F","#FF6573"],series:h})}}},u=c,d=(a("096b"),a("2877")),h=Object(d["a"])(u,n,i,!1,null,"504f9ee7",null);e["a"]=h.exports},b6ff:function(t,e,a){"use strict";a.r(e);var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"home"},[a("FilterLayout",{on:{onSubmit:t.onSubmit},model:{value:t.searchForm,callback:function(e){t.searchForm=e},expression:"searchForm"}},[a("el-col",{attrs:{md:12,lg:6,sm:24}},[a("el-form-item",{attrs:{label:"时间",prop:"time"}},[a("dataPicker",{attrs:{datevalue:t.searchForm.time},on:{"update:datevalue":function(e){return t.$set(t.searchForm,"time",e)}}})],1)],1),a("el-col",{attrs:{md:6,sm:12}},[a("el-form-item",{attrs:{label:"用户渠道",prop:"channel"}},[a("SelectChannel",{attrs:{multi:""},model:{value:t.searchForm.channel,callback:function(e){t.$set(t.searchForm,"channel",e)},expression:"searchForm.channel"}})],1)],1),a("el-col",{attrs:{md:5,sm:12}},[a("el-form-item",{attrs:{label:"回收来源",prop:"type"}},[a("el-radio-group",{model:{value:t.searchForm.type,callback:function(e){t.$set(t.searchForm,"type",e)},expression:"searchForm.type"}},t._l(t.source,(function(e,n){return a("el-radio-button",{key:n,attrs:{label:e.value}},[t._v(t._s(e.label))])})),1)],1)],1)],1),a("CountLayout",{attrs:{option:t.countData.data,loading:t.countData.loading,countInfo:t.countData.totalInfo,type:"mix"},scopedSlots:t._u([{key:"option",fn:function(){return[a("el-col",{attrs:{md:12,lg:6,sm:24}},[a("el-form-item",{attrs:{label:"筛选项"}},[a("el-select",{attrs:{placeholder:"请选择筛选项","popper-append-to-body":!1},on:{change:t.onSelectChange},model:{value:t.select,callback:function(e){t.select=e},expression:"select"}},t._l(t.selectOption,(function(t,e){return a("el-option",{key:e,attrs:{label:t.label,value:t.value}})})),1)],1)],1)]},proxy:!0}])}),a("TableLayout",{attrs:{column:t.column,data:t.tableData.data,total:t.tableData.total,loading:t.tableData.loading,currentPage:t.tableOpt.currentPage,params:t.searchForm,leadOut:!0,headerCellStyle:t.headerCellStyle},on:{pageChange:t.onPageChange,sizeChange:t.onSizeChange}})],1)},i=[],o=(a("8e6e"),a("456d"),a("6762"),a("ac6a"),a("7f7f"),a("3835")),r=(a("96cf"),a("1da1")),l=a("ade3"),s=a("c1df"),c=a.n(s),u=a("2f62"),d=a("2b38"),h=a("bb8b"),p=a("8bb5"),f=a("5e7d"),m=a("bbb5");function b(t,e){var a=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),a.push.apply(a,n)}return a}function v(t){for(var e=1;e<arguments.length;e++){var a=null!=arguments[e]?arguments[e]:{};e%2?b(Object(a),!0).forEach((function(e){Object(l["a"])(t,e,a[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(a)):b(Object(a)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(a,e))}))}return t}var g={components:{FilterLayout:d["a"],TableLayout:h["a"],CountLayout:p["a"],SelectChannel:m["a"]},data:function(){return{select:"1",searchForm:{time:[c()().subtract(30,"d").format("YYYY-MM-DD"),c()().format("YYYY-MM-DD")],channel:[],select:"",type:"all"},selectOption:[{label:"1日回收",value:"1"},{label:"2日回收",value:"2"},{label:"3日回收",value:"3"},{label:"4日回收",value:"4"},{label:"5日回收",value:"5"},{label:"6日回收",value:"6"},{label:"7日回收",value:"7"},{label:"14日回收",value:"14"},{label:"30日回收",value:"30"},{label:"60日回收",value:"60"},{label:"90日回收",value:"90"},{label:"180日回收",value:"180"},{label:"365日回收",value:"365"}],source:[{label:"全部",value:"all",disabled:!1},{label:"广告",value:"advert",disabled:!1},{label:"订单",value:"order",disabled:!1}],orderOptions:[{label:"全部",value:"",disabled:!1}],column:[{prop:"date",label:"日期",width:"100"},{prop:"device_new",label:"激活数"},{prop:"day_into",label:"投资金额"},{prop:"day1",label:"1日回收"},{prop:"roi1",label:"1日回报率"},{prop:"day2",label:"2日回收"},{prop:"roi2",label:"2日回报率"},{prop:"day3",label:"3日回收"},{prop:"roi3",label:"3日回报率"},{prop:"day7",label:"7日回收"},{prop:"roi7",label:"7日回报率"},{prop:"day14",label:"14日回收"},{prop:"roi14",label:"14日回报率"},{prop:"day30",label:"30日回收"},{prop:"roi30",label:"30日回报率"},{prop:"day60",label:"60日回收"},{prop:"roi60",label:"60日回报率"},{prop:"day90",label:"90日回收"},{prop:"roi90",label:"90日回报率"},{prop:"day180",label:"180日回收"},{prop:"roi180",label:"180日回报率"},{prop:"day365",label:"365日回收"},{prop:"roi365",label:"365日回报率"}],tableOpt:{currentPage:1,pageSize:10},tableData:{data:[],total:0,loading:!1,currentPage:1,pageSize:10},countBar:{},pickerOptions:f["b"],countData:{data:{},loading:!1,totalInfo:{}}}},mounted:function(){this.fetchData(),this.fetchCount()},methods:v(v({},Object(u["b"])(["getOrderIncomeOriginList"])),{},{onSubmit:function(t){this.tableOpt.currentPage=1,this.fetchData(),this.fetchCount()},onPageChange:function(t){this.tableOpt.currentPage=t,this.fetchData()},onSizeChange:function(t){this.tableOpt.pageSize=t,this.fetchData()},onSelectChange:function(){this.fetchCount()},fetchData:function(){var t=Object(r["a"])(regeneratorRuntime.mark((function t(){var e,a,n,i,r,l,s,c,u;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return e=this.searchForm,a=this.tableOpt,this.tableData.loading=!0,t.next=4,this.$http.post("Order_Statistics/incomeOrigin",v(v(v({},e),a),{},{navCate:2,channel:e["channel"].join(","),timeBegin:e["time"][0],timeEnd:e["time"][1]}));case 4:if(n=t.sent,i=Object(o["a"])(n,2),r=i[0],l=i[1],this.tableData.loading=!1,!r){t.next=11;break}return t.abrupt("return");case 11:s=l.list,c=l.currentPage,u=l.total,this.tableData.data=s,this.tableData.currentPage=c,this.tableData.total=u;case 15:case"end":return t.stop()}}),t,this)})));function e(){return t.apply(this,arguments)}return e}(),fetchCount:function(){var t=Object(r["a"])(regeneratorRuntime.mark((function t(){var e,a,n,i,r,l,s,c,u,d;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return e=this.searchForm,a=this.select,this.countData.loading=!0,t.next=4,this.$http.post("Order_Statistics/incomeOrigin",v(v({},e),{},{select:a,navCate:1,channel:e["channel"].join(","),timeBegin:e["time"][0],timeEnd:e["time"][1]}));case 4:if(n=t.sent,i=Object(o["a"])(n,2),r=i[0],l=i[1],this.countData.loading=!1,!r){t.next=12;break}return this.countData.data={legendData:[],xAxisData:[],data:[],yAxis:[{type:"value",name:"回收金额（元）"},{type:"value",name:"ROI（%）"}]},t.abrupt("return");case 12:s=l.date,c=l.data,u=l.totalInfo,d=c.map((function(t){return"ROI"===t.name?v(v({},t),{},{yAxisIndex:1,smooth:!0}):v(v({},t),{},{stack:"money",smooth:!0})})),this.countData.totalInfo=u,this.countData.data={legendData:c,xAxisData:s,data:d,yAxis:[{type:"value",name:"回收金额（元）"},{type:"value",name:"ROI（%）"}],formatter:function(t){if(t.length){var e="".concat(t[0].axisValueLabel,"<br/>");return t.forEach((function(t){"ROI"!==t.seriesName?e+="".concat(t.marker).concat(t.seriesName,"：").concat(t.value,"<br/>"):e+="".concat(t.marker).concat(t.seriesName,"：").concat(t.value,"%<br/>")})),e}return""}};case 16:case"end":return t.stop()}}),t,this)})));function e(){return t.apply(this,arguments)}return e}(),headerCellStyle:function(t){t.rowIndex;var e=t.columnIndex,a=[3,4,7,8,11,12,15,16,19,20];if(a.includes(e))return"background:#e6e6e6;"}})},y=g,x=a("2877"),C=Object(x["a"])(y,n,i,!1,null,"46e190c2",null);e["default"]=C.exports},bbb5:function(t,e,a){"use strict";var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("div",{staticStyle:{display:"flex"}},[a("el-cascader-multi",{attrs:{data:t.options,clearable:"",filterable:"","collapse-tags":"","append-to-body":!1},on:{change:t.change},model:{value:t.insideValue,callback:function(e){t.insideValue=e},expression:"insideValue"}}),t.multi?a("el-button",{staticStyle:{"margin-left":"20px"},attrs:{type:"primary"},on:{click:t.open}},[t._v("批量")]):t._e()],1),a("el-dialog",{attrs:{title:"批量筛选",visible:t.dialogTableVisible,"close-on-press-escape":!1,"close-on-click-modal":!1},on:{"update:visible":function(e){t.dialogTableVisible=e},close:t.cancel}},[a("el-input",{attrs:{type:"textarea",rows:6,placeholder:"请输入内容，回车分割"},on:{input:t.search},model:{value:t.textarea,callback:function(e){t.textarea=e},expression:"textarea"}}),a("el-button",{staticStyle:{"margin-top":"20px"},attrs:{type:"warning",plain:""},on:{click:t.clear}},[t._v("清空")]),a("el-divider",[t._v("搜索结果（"+t._s(t.compress_result.length)+"）；"),a("span",{staticStyle:{color:"#67c23a"}},[t._v("已选择（"+t._s(t.checkList.length)+"）")])]),t.compress_result.length>0?[a("el-checkbox",{attrs:{indeterminate:t.isIndeterminate},on:{change:t.handleCheckAllChange},model:{value:t.checkAll,callback:function(e){t.checkAll=e},expression:"checkAll"}},[t._v("全选")]),a("el-checkbox-group",{on:{change:t.handleCheckedItem},model:{value:t.checkList,callback:function(e){t.checkList=e},expression:"checkList"}},t._l(t.compress_result,(function(t,e){return a("el-checkbox",{key:e,attrs:{label:t}})})),1)]:a("div",{staticStyle:{"text-align":"center"}},[t._v("暂无相关渠道")]),a("div",[t.compress_result.length>0?a("el-button",{staticStyle:{"margin-top":"20px"},attrs:{type:"primary"},on:{click:t.confirm}},[t._v("确定\n      ")]):t._e(),a("el-button",{staticStyle:{"margin-top":"20px"},attrs:{type:"info"},on:{click:t.cancel}},[t._v("取消")])],1)],2)],1)},i=[],o=(a("8e6e"),a("456d"),a("55dd"),a("3835")),r=(a("96cf"),a("1da1")),l=(a("28a5"),a("ade3")),s=(a("ac6a"),a("c5f6"),a("2f62")),c=a("2ef0"),u=a.n(c);function d(t,e){var a=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),a.push.apply(a,n)}return a}function h(t){for(var e=1;e<arguments.length;e++){var a=null!=arguments[e]?arguments[e]:{};e%2?d(Object(a),!0).forEach((function(e){Object(l["a"])(t,e,a[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(a)):d(Object(a)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(a,e))}))}return t}var p={props:{multi:{type:Boolean,default:!1},value:{type:[String,Number,Array],default:""},optionsList:{type:Array,default:function(){return[]}},paramFlag:{type:Boolean,default:!1},haveAll:{type:Boolean,default:!0},disabled:{type:Boolean,default:!1}},data:function(){return{timer:null,isIndeterminate:!0,checkAll:!1,checkList:[],compress_result:[],channelChildrens:[],textarea:"",dialogTableVisible:!1,insideValue:[],options:[],optionsCopy:[],all:!1,cakey:1,selected:[]}},mounted:function(){this.paramFlag?this.opertionListFun(this.optionsList):this.channel.length?this.opertionListFun(this.channel):this.fetchChannel()},watch:{optionsList:{handler:function(){this.opertionListFun(this.optionsList)},deep:!0,immediate:!0},insideValue:function(t){if(t.length){this.clear();var e=[];t.forEach((function(t){e.push(t[1])})),this.$emit("input",e)}else this.$emit("input",t)}},computed:h({},Object(s["d"])({channel:function(t){return t.channel.data}})),methods:h(h({search:function(){var t=this;this.timer&&clearTimeout(this.timer),this.timer=setTimeout((function(){var e=t.textarea.split(/[\n,]/g);t.compress_result=u.a.compact(u.a.intersection(e,t.channelChildrens)),t.handleCheckAllChange(!0)}),300)},handleCheckAllChange:function(t){this.checkAll=!0,this.checkList=t?this.compress_result:[],this.isIndeterminate=!1},handleCheckedItem:function(t){var e=t.length;this.checkAll=e===this.compress_result.length,this.isIndeterminate=e>0&&e<this.compress_result.length},open:function(){this.dialogTableVisible=!0,this.insideValue=[]},confirm:function(){this.$message.info("请选择"),0!=this.checkList.length&&(this.dialogTableVisible=!1,this.$message.success("批量筛选成功，请点击查询"),this.$emit("input",this.checkList))},clear:function(){this.textarea="",this.checkList="",this.compress_result="",this.checkAll=!1},cancel:function(){this.dialogTableVisible=!1},opertionListFun:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],e=[],a=t.map((function(t){var a=[];return a=t.channels?t.channels.map((function(t){return e.push(t),{label:t||t.title||t.label,value:t||t.id||t.value}})):t.children.map((function(t){return{label:t.title||t.label,value:t.id||t.value}})),{label:t.label||t.title,value:t.value||t.id,children:a}}));this.channelChildrens=e,this.options=a,this.optionsCopy=a},change:function(t){this.$emit("change",t)},removetag:function(t){var e={stopPropagation:function(){}};try{this.$refs.cascader.clearValue(e)}catch(a){this.$refs.cascader.handleClear(e)}}},Object(s["b"])(["getChannel"])),{},{fetchChannel:function(){var t=Object(r["a"])(regeneratorRuntime.mark((function t(){var e,a,n,i;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,this.getChannel();case 2:if(e=t.sent,a=Object(o["a"])(e,2),n=a[0],i=a[1],!n){t.next=8;break}return t.abrupt("return");case 8:this.opertionListFun(i);case 9:case"end":return t.stop()}}),t,this)})));function e(){return t.apply(this,arguments)}return e}(),onFilter:function(t){this.options=t?this.optionsCopy.filter((function(e){if(~e.indexOf(t)||~e.toUpperCase().indexOf(t.toUpperCase()))return!0})):this.optionsCopy},onInputAll:function(t){this.insideValue=t?this.options:[]},isSameArray:function(t,e){var a=t.concat([]),n=e.concat([]),i=a.sort().join(""),o=n.sort().join("");return i===o}})},f=p,m=(a("06bb"),a("2877")),b=Object(m["a"])(f,n,i,!1,null,"b91e7e3e",null);e["a"]=b.exports},f122:function(t,e,a){}}]);
//# sourceMappingURL=chunk-43c28f3b.1.0.0.1672021042960.js.map