(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-720a53d9"],{"2f21":function(t,e,a){"use strict";var s=a("79e5");t.exports=function(t,e){return!!t&&s((function(){e?t.call(null,(function(){}),1):t.call(null)}))}},"55dd":function(t,e,a){"use strict";var s=a("5ca1"),r=a("d8e8"),o=a("4bf8"),i=a("79e5"),n=[].sort,l=[1,2,3];s(s.P+s.F*(i((function(){l.sort(void 0)}))||!i((function(){l.sort(null)}))||!a("2f21")(n)),"Array",{sort:function(t){return void 0===t?n.call(o(this)):n.call(o(this),r(t))}})},"5e7d":function(t,e,a){"use strict";a.d(e,"b",(function(){return o})),a.d(e,"a",(function(){return n})),a.d(e,"c",(function(){return i}));var s=a("c1df"),r=a.n(s),o={shortcuts:[{text:"昨天",onClick:function(t){var e=new Date,a=new Date;a.setTime(a.getTime()-864e5),t.$emit("pick",[a,e])}},{text:"近一周",onClick:function(t){var e=new Date,a=new Date;a.setTime(a.getTime()-6048e5),t.$emit("pick",[a,e])}},{text:"近30天",onClick:function(t){var e=r()().subtract(1,"months").format("YYYY-MM-DD"),a=r()().format("YYYY-MM-DD");t.$emit("pick",[e,a])}},{text:"近60天",onClick:function(t){var e=r()().subtract(2,"months").format("YYYY-MM-DD"),a=r()().format("YYYY-MM-DD");t.$emit("pick",[e,a])}},{text:"近90天",onClick:function(t){var e=r()().subtract(3,"months").format("YYYY-MM-DD"),a=r()().format("YYYY-MM-DD");t.$emit("pick",[e,a])}},{text:"本月",onClick:function(t){var e=new Date,a=e.getFullYear(),s=e.getMonth()+1,r=new Date(a+"-"+s+"-01");t.$emit("pick",[r,e])}},{text:"上个月",onClick:function(t){var e=r()().subtract(1,"months").endOf("month"),a=e.format("YYYY-MM-DD"),s=e.format("YYYY-MM-01");t.$emit("pick",[s,a])}}]},i=function(t){return[{label:"天",value:1,disabled:!1},{label:"周",value:2,disabled:r()(t[1]).diff(r()(t[0]),"days")<7},{label:"月",value:3,disabled:r()(t[1]).diff(r()(t[0]),"months")<1}]},n=[{label:"总订单统计",value:0,disabled:!1}]},8485:function(t,e,a){"use strict";a.r(e);var s=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"home"},[a("FilterLayout",{on:{onSubmit:t.onSubmit},model:{value:t.searchForm,callback:function(e){t.searchForm=e},expression:"searchForm"}},[a("el-col",{attrs:{md:12,lg:6,sm:24}},[a("el-form-item",{attrs:{label:"时间",prop:"time"}},[a("dataPicker",{attrs:{datevalue:t.searchForm.time},on:{"update:datevalue":function(e){return t.$set(t.searchForm,"time",e)}}})],1)],1),a("el-col",{attrs:{md:6,sm:12}},[a("el-form-item",{attrs:{label:"收入渠道",prop:"res"}},[a("el-select",{attrs:{placeholder:"全部收入渠道","popper-append-to-body":!1,multiple:"","multiple-limit":10,filterable:""},model:{value:t.searchForm.res,callback:function(e){t.$set(t.searchForm,"res",e)},expression:"searchForm.res"}},t._l(t.resource,(function(t,e){return a("el-option",{key:e,attrs:{label:t.title,value:t.id}})})),1)],1)],1),a("el-col",{attrs:{md:6,sm:12}},[a("el-form-item",{attrs:{label:"广告类型",prop:"adCate"}},[a("el-select",{attrs:{placeholder:"全部广告类型","popper-append-to-body":!1,multiple:"","multiple-limit":10,filterable:""},model:{value:t.searchForm.adCate,callback:function(e){t.$set(t.searchForm,"adCate",e)},expression:"searchForm.adCate"}},t._l(t.ad_cate,(function(t,e){return a("el-option",{key:e,attrs:{label:t.title,value:t.id}})})),1)],1)],1),a("el-col",{attrs:{md:6,sm:12}},[a("el-form-item",{attrs:{label:"APP",prop:"appIds"}},[a("el-select",{attrs:{placeholder:"全部APP","popper-append-to-body":!1,multiple:"","multiple-limit":10,filterable:""},on:{change:function(e){return t.changeApp()}},model:{value:t.searchForm.appIds,callback:function(e){t.$set(t.searchForm,"appIds",e)},expression:"searchForm.appIds"}},t._l(t.apps,(function(t,e){return a("el-option",{key:e,attrs:{label:t.title,value:t.id}})})),1)],1)],1),a("el-col",{attrs:{md:6,sm:12}},[a("el-form-item",{attrs:{label:"广告位",prop:"positionIds"}},[a("el-select",{attrs:{placeholder:"全部广告位","popper-append-to-body":!1,multiple:"","multiple-limit":10,filterable:""},on:{change:function(e){return t.changePosition()}},model:{value:t.searchForm.positionIds,callback:function(e){t.$set(t.searchForm,"positionIds",e)},expression:"searchForm.positionIds"}},t._l(t.positions,(function(t,e){return a("el-option",{key:e,attrs:{label:t.title,value:t.id}})})),1)],1)],1),a("el-button",{attrs:{slot:"ggwgl"},on:{click:t.goAdsense},slot:"ggwgl"},[t._v(" 广告位关联 ")])],1),a("div",{staticClass:"showlist"},[a("div",{staticClass:"show-item"},[a("div",{staticClass:"title"},[t._v("请求:")]),a("div",{staticClass:"content"},[a("div",{staticClass:"count"},[t._v(t._s(t.tableData.sumArr.request_th))]),a("div",{staticClass:"rate",style:t.getcolors(t.tableData.sumArr.request_th_rate)},[t._v("\n          "+t._s(t.tableData.sumArr.request_th_rate)+"\n        ")])])]),a("div",{staticClass:"show-item"},[a("div",{staticClass:"title"},[t._v("展示:")]),a("div",{staticClass:"content"},[a("div",{staticClass:"count"},[t._v(t._s(t.tableData.sumArr.show_th))]),a("div",{staticClass:"rate",style:t.getcolors(t.tableData.sumArr.show_th_rate)},[t._v("\n          "+t._s(t.tableData.sumArr.show_th_rate)+"\n        ")])])]),a("div",{staticClass:"show-item"},[a("div",{staticClass:"title"},[t._v("点击:")]),a("div",{staticClass:"content"},[a("div",{staticClass:"count"},[t._v(t._s(t.tableData.sumArr.click_th))]),a("div",{staticClass:"rate",style:t.getcolors(t.tableData.sumArr.click_th_rate)},[t._v("\n          "+t._s(t.tableData.sumArr.click_th_rate)+"\n        ")])])]),a("div",{staticClass:"show-item"},[a("div",{staticClass:"title"},[t._v("收入:")]),a("div",{staticClass:"content"},[a("div",{staticClass:"count"},[t._v(t._s(t.tableData.sumArr.cost))]),a("div",{staticClass:"rate",style:t.getcolors(t.tableData.sumArr.cost_rate)},[t._v("\n          "+t._s(t.tableData.sumArr.cost_rate)+"\n        ")])])]),a("div",{staticClass:"show-item"},[a("div",{staticClass:"title"},[t._v("CPM:")]),a("div",{staticClass:"content"},[a("div",{staticClass:"count"},[t._v(t._s(t.tableData.sumArr.cpm))]),a("div",{staticClass:"rate",style:t.getcolors(t.tableData.sumArr.cpm_rate)},[t._v("\n          "+t._s(t.tableData.sumArr.cpm_rate)+"\n        ")])])]),a("div",{staticClass:"show-item"},[a("div",{staticClass:"title"},[t._v("CPC:")]),a("div",{staticClass:"content"},[a("div",{staticClass:"count"},[t._v(t._s(t.tableData.sumArr.cpc))]),a("div",{staticClass:"rate",style:t.getcolors(t.tableData.sumArr.cpc_rate)},[t._v("\n          "+t._s(t.tableData.sumArr.cpc_rate)+"\n        ")])])]),a("div",{staticClass:"show-item"},[a("div",{staticClass:"title"},[t._v("CTR:")]),a("div",{staticClass:"content"},[a("div",{staticClass:"count"},[t._v(t._s(t.tableData.sumArr.ctr))]),a("div",{staticClass:"rate",style:t.getcolors(t.tableData.sumArr.ctr_rate)},[t._v("\n          "+t._s(t.tableData.sumArr.ctr_rate)+"\n        ")])])])]),a("TableLayout",{attrs:{column:t.column,data:t.tableData.data,total:t.tableData.total,loading:t.tableData.loading,currentPage:t.tableOpt.currentPage,params:t.searchForm,leadOut:!0},on:{sizeChange:t.onSizeChange,pageChange:t.onPageChange,sortChange:t.onSortChange}},[a("div",{attrs:{slot:"table-option"},slot:"table-option"},[a("el-checkbox",{staticStyle:{"margin-left":"20px"},on:{input:t.changeTableList},model:{value:t.flexFlag,callback:function(e){t.flexFlag=e},expression:"flexFlag"}},[t._v("冻结维度项\n      ")])],1)])],1)},r=[],o=(a("8e6e"),a("3835")),i=(a("55dd"),a("96cf"),a("1da1")),n=(a("ac6a"),a("456d"),a("ade3")),l=a("c1df"),c=a.n(l),u=a("2ef0"),p=a.n(u),d=a("2f62"),m=a("2b38"),b=a("bb8b"),h=a("5e7d");function f(t,e){var a=Object.keys(t);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(t);e&&(s=s.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),a.push.apply(a,s)}return a}function v(t){for(var e=1;e<arguments.length;e++){var a=null!=arguments[e]?arguments[e]:{};e%2?f(Object(a),!0).forEach((function(e){Object(n["a"])(t,e,a[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(a)):f(Object(a)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(a,e))}))}return t}var g={components:{FilterLayout:m["a"],TableLayout:b["a"]},data:function(){return{flexFlag:!1,select:"1",searchForm:{time:[c()().subtract(1,"d").format("YYYY-MM-DD"),c()().subtract(1,"d").format("YYYY-MM-DD")],adTypes:[],positionIds:[],appIds:[],res:[],channel:[],adCate:[]},vipOptions:[{label:"否",value:0,disabled:!1},{label:"是",value:1,disabled:!1}],column:[{label:"ID",prop:"id",allowFixed:!0},{label:"时间",prop:"date",sortable:"custom",allowFixed:!0},{label:"APP",prop:"bu_app_id",allowFixed:!0},{label:"广告位",prop:"bu_adpositionid_name",allowFixed:!0},{label:"广告类型",prop:"bu_adtypemine_name",allowFixed:!0},{label:"广告名称",prop:"title",allowFixed:!0},{label:"收入渠道",prop:"channel_income",allowFixed:!0},{label:"日活",prop:"active"},{label:"启动",prop:"times"},{label:"收入",prop:"cost",sortable:"custom"},{label:"请求量（本地）",prop:"ad_pull_num",sortable:"custom"},{label:"下发成功(本地)",prop:"request",sortable:"custom"},{label:"展示量(本地)",prop:"show",sortable:"custom"},{label:"点击量(本地)",prop:"click",sortable:"custom"},{label:"请求量(三方)",prop:"request_th",sortable:"custom"},{label:"请求占比",prop:"request_th_rate"},{label:"下发成功（三方）",prop:"return_count_th",sortable:"custom"},{label:"展示量(三方)",prop:"show_th",sortable:"custom"},{label:"展示量占比",prop:"show_th_rate"},{label:"点击量(三方)",prop:"click_th",sortable:"custom"},{label:"填充率",prop:"GFR",sortable:"custom"},{label:"展示（三方）/请求（本地）",prop:"show_pull",sortable:"custom"},{label:"展示率",prop:"show_rate",sortable:"custom"},{label:"CPM",prop:"cpm",sortable:"custom"},{label:"CPC",prop:"cpc",sortable:"custom"},{label:"CTR",prop:"ctr",sortable:"custom"}],tableOpt:{currentPage:1,pageSize:10},countBar:{},pickerOptions:h["b"],sort:{prop:"",order:""}}},mounted:function(){this.fetchList(),this.fetchCount(),this.getAdApp(),this.getAdCate(),this.getResource()},computed:v(v({},Object(d["d"])({positions:function(t){return t.position.data},apps:function(t){return t.ad_app.data},adTypes:function(t){return t.ad_types.data},resource:function(t){return t.resource.data},ad_cate:function(t){return t.ad_cate.data},tableData:function(t){return t.ad_index.list},count:function(t){return t.ad_index.count.data},countLoading:function(t){return t.ad_index.count.loading}})),{},{countData:function(){var t=this.count;if(!t||!Object.keys(t).length)return{legendData:[],xAxisData:[],data:[],yName:"单"};var e=t.date,a=t.list,s=e,r=Object.keys(a),o=p.a.values(a);return{legendData:r,xAxisData:s,data:o,yName:"单"}},countBarData:function(){var t=this.countBar;if(!t||!Object.keys(t).length)return{tooltip:{trigger:"axis",borderRadius:6},xAxis:[],yAxis:[],series:[],legend:[]};var e=t.list,a=["新增","注册","下单","支付成功","退单  "],s=p.a.values(e).map((function(t){return t.data})),r=s&&s.length?s[0]:[];return{tooltip:{trigger:"axis",borderRadius:6,formatter:function(t){var e=t[0],a=t[1],s=e.data,o=(a.data/r[a["dataIndex"]-1]*100).toFixed(0);return a["dataIndex"]?"订单数: ".concat(s,"<br>转化率: ").concat("NAN"!==o?o:0,"%"):"订单数: ".concat(s)}},legend:{data:["订单数","转化率"]},xAxis:[{type:"category",data:a,axisTick:{alignWithLabel:!0}}],yAxis:[{type:"value",scale:!0,name:"订单数"},{type:"value",scale:!0,name:"转化率",show:!1}],series:[{name:"订单数",type:"bar",barWidth:"60%",data:r},{name:"转化率",type:"line",data:r}]}},timeTypeConfig:function(){var t=this.searchForm.time;return Object(h["c"])(t)}}),methods:v(v({},Object(d["b"])(["getAdIndexList","getAdIndexCount","getAdApp","getPosition","getAdTypes","getAdCate","getResource"])),{},{changeTableList:function(t){this.column.forEach((function(e){e.fixed=e.allowFixed&&t?"left":""}))},getcolors:function(t){if(void 0!==t)return t+="",{color:-1==t.indexOf("-")?"#f56c6c":"#67c23a"}},changeApp:function(){this.getPosition({appIds:this.searchForm.appIds.join(","),timeBegin:this.searchForm["time"][0],timeEnd:this.searchForm["time"][1]})},changePosition:function(){this.getAdTypes({positionIds:this.searchForm.positionIds.join(",")})},onSubmit:function(t){this.tableOpt.currentPage=1,this.fetchList(),this.fetchCount()},onPageChange:function(t){this.tableOpt.currentPage=t,this.fetchList()},onSizeChange:function(t){this.tableOpt.pageSize=t,this.fetchList()},onSortChange:function(t){var e=t.prop,a=t.order;this.sort={prop:e,order:a},this.tableOpt.currentPage=1,this.fetchList()},onSelectChange:function(){this.fetchCount()},fetchList:function(){var t=Object(i["a"])(regeneratorRuntime.mark((function t(){var e,a,s,r,i,n;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return e=this.searchForm,a=this.tableOpt,s=this.sort,t.next=3,this.getAdIndexList(v(v(v(v({},e),a),s),{},{navCate:2,adTypes:e["adTypes"].join(","),positionIds:e["positionIds"].join(","),appIds:e["appIds"].join(","),res:e["res"].join(","),adCate:e["adCate"].join(","),timeBegin:e["time"][0],timeEnd:e["time"][1]}));case 3:if(r=t.sent,i=Object(o["a"])(r,2),n=i[0],i[1],!n){t.next=9;break}return t.abrupt("return");case 9:case"end":return t.stop()}}),t,this)})));function e(){return t.apply(this,arguments)}return e}(),fetchCount:function(){var t=Object(i["a"])(regeneratorRuntime.mark((function t(){var e,a,s,r,i;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return e=this.searchForm,a=this.select,t.next=3,this.getAdIndexCount(v(v({},e),{},{select:a,navCate:1,adTypes:e["adTypes"].join(","),positionIds:e["positionIds"].join(","),appIds:e["appIds"].join(","),res:e["res"].join(","),adCate:e["adCate"].join(","),timeBegin:e["time"][0],timeEnd:e["time"][1]}));case 3:if(s=t.sent,r=Object(o["a"])(s,2),i=r[0],r[1],!i){t.next=9;break}return t.abrupt("return");case 9:case"end":return t.stop()}}),t,this)})));function e(){return t.apply(this,arguments)}return e}(),goAdsense:function(){console.log(1),this.$router.push({path:"/business_center/ad_index/adsense"})}})},_=g,C=(a("c83f"),a("2877")),x=Object(C["a"])(_,s,r,!1,null,"b080d6d6",null);e["default"]=x.exports},bfa9:function(t,e,a){},c83f:function(t,e,a){"use strict";a("bfa9")}}]);
//# sourceMappingURL=chunk-720a53d9.1.0.0.1672021042960.js.map