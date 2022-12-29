<template>
	<EmptyLayout>
		<div class="index-wrap" v-loading="show">
			<!-- 左侧 -->
			<div class="left">
				<div class="new-user border-img">
					<div class="wrap">
						<h2 class="title">新增用户</h2>
						<p class="num" :class="numTemplate(data.device_new.flag)">{{data.device_new.num}}</p>
						<p class="range">
							<i class="icon " :class="iconTemplate(data.device_new.flag)"></i>
							<span class="num">{{data.device_new.per}}</span>
						</p>
					</div>
				</div>
				<div class="active-user border-img">
					<div class="wrap">
						<h2 class="title">活跃用户</h2>
						<p class="num" :class="numTemplate(data.device_active.flag)">{{data.device_active.num}}</p>
						<p class="range">
							<i class="icon" :class="iconTemplate(data.device_active.flag)"></i>
							<span class="num">{{data.device_active.per}}</span>
						</p>
					</div>
				</div>
				<div class="add-user border-img">
					<div class="wrap">
						<h2 class="title">新增用户次日留存</h2>
						<p class="num" :class="numTemplate(data.lt.flag)">{{data.lt.num}}</p>
						<p class="range">
							<i class="icon" :class="iconTemplate(data.lt.flag)"></i>
							<span class="num">{{data.lt.per}}</span>
						</p>
					</div>
				</div>
				<div class="new-user-origin border-img">
					<h2 class="title">新增用户来源</h2>
					<div id="newUserOrigin"></div>
				</div>
			</div>
			<!-- 中间 -->
			<div class="center">
				<div class="top">
					<div id="map" style="width:43.9vw; height:39.1vw;"></div>
					<div id="active-top" style="width:20vw;height: 220px;"></div>
				</div>
				<div class="bottom">
					<h2 class="title">新用户转化</h2>
					<div id="newUserChange"></div>
				</div>
			</div>
			<!-- 右侧 -->
			<div class="right">
				<!-- 右侧的左侧 -->
				<div class="right-left">
					<div class="sum-income border-img">
						<div class="wrap">
							<h2 class="title">总收入</h2>
							<p class="num" :class="numTemplate(data.all_pay.flag)">{{data.all_pay.num}}</p>
							<p class="range">
								<i class="icon" :class="iconTemplate(data.all_pay.flag)"></i>
								<span class="num">{{data.all_pay.per}}</span>
							</p>
						</div>
					</div>
					<div class="sum-income border-img">
						<div class="wrap">
							<h2 class="title">注册用户数</h2>
							<p class="num" :class="numTemplate(data.user_new.flag)">{{data.user_new.num}}</p>
							<p class="range">
								<i class="icon" :class="iconTemplate(data.user_new.flag)"></i>
								<span class="num">{{data.user_new.per}}</span>
							</p>
						</div>
					</div>
					<div class="sum-income border-img">
						<div class="wrap">
							<h2 class="title">下单数量</h2>
							<p class="num" :class="numTemplate(data.order_num.flag)">{{data.order_num.num}}</p>
							<p class="range">
								<i class="icon" :class="iconTemplate(data.order_num.flag)"></i>
								<span class="num">{{data.order_num.per}}</span>
							</p>
						</div>
					</div>
					<div class="new-user-origin border-img">
						<h2 class="title">总收入</h2>
						<div id="orderOrigin"></div>
					</div>
				</div>
				<!-- 右侧的右侧 -->
				<div class="right-right">
					<div class="sum-income border-img">
						<div class="wrap">
							<h2 class="title">净利润</h2>
							<p class="num" :class="numTemplate(data.margin.flag)">{{data.margin.num}}</p>
							<p class="range">
								<i class="icon" :class="iconTemplate(data.margin.flag)"></i>
								<span class="num">{{data.margin.per}}</span>
							</p>
						</div>
					</div>

					<div class="sum-income border-img">
						<div class="wrap">
							<h2 class="title">ARPU</h2>
							<p class="num" :class="numTemplate(data.arpu.flag)">{{data.arpu.num}}</p>
							<p class="range">
								<i class="icon" :class="iconTemplate(data.arpu.flag)"></i>
								<span class="num">{{data.arpu.per}}</span>
							</p>
						</div>
					</div>
					<div class="sum-income border-img">
						<div class="wrap">
							<h2 class="title">成交订单数</h2>
							<p class="num" :class="numTemplate(data.order_num_pay.flag)">{{data.order_num_pay.num}}</p>
							<p class="range">
								<i class="icon" :class="iconTemplate(data.order_num_pay.flag)"></i>
								<span class="num">{{data.order_num_pay.per}}</span>
							</p>
						</div>
					</div>
					<div class="new-user-origin border-img">
						<h2 class="title">利润率</h2>
						<div id="profit"></div>
					</div>
				</div>
			</div>
		</div>
	</EmptyLayout>
</template>

<script>
	import {
		Dashboard_index
	} from '@/config/api/index'
	import geoJson from './chinaMap'
	import echarts from 'echarts'
	import EmptyLayout from '@/layout/basic/empty'
	export default {
		data() {
			return {
				show: true,
				data: {
					device_new: {
						flag: 1,
						num: '',
						per: ''
					},
					device_active: {
						flag: 1,
						num: '',
						per: ''
					},
					lt: {
						flag: 1,
						num: '',
						per: ''
					},
					all_pay: {
						flag: 1,
						num: '',
						per: ''
					},
					user_new: {
						flag: 1,
						num: '',
						per: ''
					},
					order_num: {
						flag: 1,
						num: '',
						per: ''
					},
					order_num_pay: {
						flag: 1,
						num: '',
						per: ''
					},
					arpu: {
						flag: 1,
						num: '',
						per: ''
					},
					margin: {
						flag: 1,
						num: '',
						per: ''
					},
				},
			}
		},
		created() {
			Dashboard_index().then(res => {
				if (res[2] == 1) {
					this.data = res[1];
					this.show = false;
					this.newUserOrigin();
					this.newUserChange();
					this.orderOrigin();
					this.profit();
					this.deviceActive();
					this.deviceActiveTop();

				}
			})
		},
		mounted() {},
		methods: {
			// 新增用户来源
			newUserOrigin() {
				let {
					device_new
				} = this.data.detail;
				var Chart = echarts.init(document.getElementById('newUserOrigin'));
				var option = {
					tooltip: {
						trigger: 'axis',
						axisPointer: {
							type: 'shadow'
						}
					},
					xAxis: {
						show: false,
						splitLine: {
							lineStyle: {
								type: 'dashed'
							}
						},
					},
					yAxis: {
						type: 'category',
						data: device_new.titles,
						axisLabel: {
							color: '#C9CBD2',
							fontSize: 12
						}
					},
					label: {
					},
					grid: {
						containLabel: true
					},
					series: [{
						type: 'bar',
						data: device_new.values,
						barCategoryGap: '30%',
						label: {
							show: true,
							color: '#fff',
							position: [15, 5],
							fontSize: 12,
							fontWeight: 600,
							formatter: ({
								data
							}) => {
								return data.toLocaleString();
							},
						},
						itemStyle: {
							normal: {
								color: function ({
									dataIndex
								}) {
									if (dataIndex % 2 == 0) {
										return new echarts.graphic.LinearGradient(
											1, 0, 0, 0, [{
													offset: 1,
													color: '#2b2c98'
												},
												{
													offset: 0.5,
													color: '#4c34b9'
												},
												{
													offset: 0.1,
													color: '#773ee3'
												},
											]
										)

									} else {
										return new echarts.graphic.LinearGradient(
											1, 0, 0, 0, [{
													offset: 1,
													color: '#1273E3'
												},
												{
													offset: 0.5,
													color: '#198AE0'
												},
												{
													offset: 0.1,
													color: '#26B5DA'
												},
											]
										)
									}
								}
							},
						}

					}, ]
				};
				Chart.setOption(option);
			},
			// 新增用户转化
			newUserChange() {
				let {
					titles,
					support,
					content
				} = this.data.user_conversion
				var Chart = echarts.init(document.getElementById('newUserChange'));
				var option = {
					tooltip: {
						trigger: 'axis',
						axisPointer: { // 坐标轴指示器，坐标轴触发有效
							type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
						},
						formatter: function (params) {
							var tar = params[1];
							return tar.name + ' : ' + tar.value;
						}
					},
					grid: {
						// left: '3%',
						// right: '4%',
						// bottom: '3%',
						containLabel: true
					},
					xAxis: {
						type: 'category',
						data: titles,
						axisLabel: {
							color: '#fff',
						},
					},
					yAxis: {
						splitLine: {
							lineStyle: {
								type: 'dashed'
							}
						},
						type: 'value',
						axisLabel: {
							color: '#fff',
						}
					},
					series: [{
							name: '辅助',
							type: 'bar',
							stack: '总量',
							itemStyle: {
								barBorderColor: 'rgba(0,0,0,0)',
								color: 'rgba(0,0,0,0)'
							},
							emphasis: {
								itemStyle: {
									barBorderColor: 'rgba(0,0,0,0)',
									color: 'rgba(0,0,0,0)'
								}
							},
							data: support
						},
						{
							name: '',
							type: 'bar',
							stack: '总量',
							label: {
								show: true,
								// position: 'inside',
								fontSize: 14,
								fontWeight: 600,
								formatter: ({
									data
								}) => {
									return data.toLocaleString();
								},
							},
							data: content,
							itemStyle: {
								normal: {
									color: function ({
										dataIndex
									}) {
										if (dataIndex % 2 == 0) {
											return new echarts.graphic.LinearGradient(
												0, 0, 0, 1, [{
														offset: 1,
														color: '#2b2c98'
													},
													{
														offset: 0.5,
														color: '#4c34b9'
													},
													{
														offset: 0.1,
														color: '#773ee3'
													},
												]
											)

										} else {
											return new echarts.graphic.LinearGradient(
												0, 0, 0, 1, [{
														offset: 1,
														color: '#1273E3'
													},
													{
														offset: 0.5,
														color: '#198AE0'
													},
													{
														offset: 0.1,
														color: '#26B5DA'
													},
												]
											)
										}
									}
								},
							}
						}
					]
				};
				Chart.setOption(option);
			},
			// 订单收入来源
			orderOrigin() {
				let {
					all_pay
				} = this.data.detail;
				var Chart = echarts.init(document.getElementById('orderOrigin'));
				var option = {
					tooltip: {
						trigger: 'axis',
						axisPointer: {
							type: 'shadow'
						}
					},
					xAxis: {
						show: false,
						splitLine: {
							lineStyle: {
								type: 'dashed'
							}
						},
					},
					yAxis: {
						type: 'category',
						data: all_pay.titles,
						axisLabel: {
							color: '#C9CBD2',
							fontSize: 12
						}

					},
					grid: {
						containLabel: true
					},
					series: [{
						type: 'bar',
						data: all_pay.values,
						barCategoryGap: '30%',
						label: {
							show: true,
							color: '#fff',
							position: [15, 5],
							fontSize: 12,
							fontWeight: 600,
							formatter: ({
								data
							}) => {
								return data.toLocaleString();
							},
						},
						itemStyle: {
							normal: {
								color: function ({
									dataIndex
								}) {
									if (dataIndex % 2 == 0) {
										return new echarts.graphic.LinearGradient(
											1, 0, 0, 0, [{
													offset: 1,
													color: '#2b2c98'
												},
												{
													offset: 0.5,
													color: '#4c34b9'
												},
												{
													offset: 0.1,
													color: '#773ee3'
												},
											]
										)

									} else {
										return new echarts.graphic.LinearGradient(
											1, 0, 0, 0, [{
													offset: 1,
													color: '#1273E3'
												},
												{
													offset: 0.5,
													color: '#198AE0'
												},
												{
													offset: 0.1,
													color: '#26B5DA'
												},
											]
										)
									}
								}
							},
						}

					}, ]
				};
				Chart.setOption(option);
			},
			// 利润率
			profit() {
				let {
					income_total,
					invest_total
				} = this.data.margin_percent;
				let data = [{
						name: '收入',
						value: income_total
					},
					{
						name: '支出',
						value: invest_total
					},
				];
				var Chart = echarts.init(document.getElementById('profit'));
				var option = {
					tooltip: {
						trigger: 'item',
						formatter: '{a} <br/>{b} : {c} ({d}%)'
					},
					series: [{
						name: '访问来源',
						type: 'pie',
						radius: '55%',
						center: ['50%', '60%'],
						data: data,
						// roseType: true,
						label: {
							show: true,
							color: '#fff',
							margin: 10,
							position: 'outer',
							alignTo: 'edge',
							formatter: ({
								percent,
								data
							}) => {
								return data.name + percent + '%';
							},

						},
						labelLine: {
							show: true
						},
						itemStyle: {
							normal: {
								color: function ({
									dataIndex
								}) {
									if (dataIndex % 2 == 0) {
										return new echarts.graphic.LinearGradient(
											1, 0, 0, 0, [{
													offset: 1,
													color: '#2b2c98'
												},
												{
													offset: 0.5,
													color: '#4c34b9'
												},
												{
													offset: 0.1,
													color: '#773ee3'
												},
											]
										)

									} else {
										return new echarts.graphic.LinearGradient(
											1, 0, 0, 0, [{
													offset: 1,
													color: '#1273E3'
												},
												{
													offset: 0.5,
													color: '#198AE0'
												},
												{
													offset: 0.1,
													color: '#26B5DA'
												},
											]
										)
									}
								}
							}
						}
					}]
				};
				Chart.setOption(option);
			},
			deviceActive() {
				var myChart = echarts.init(document.getElementById('map'));
				var cityname = [];
				echarts.registerMap('chinacity', geoJson);
				var mapFeatures = echarts.getMap('chinacity').geoJson.features;
				mapFeatures.forEach(function (v) {
					// 地区名称
					var name = v.properties.name;
					cityname.push(name)
				});
				var option = {
					title: {
						text: '全国活跃用户分布',
						left: 'center',
						textStyle: {
							color: 'white',
						},
					},
					visualMap: {
						show: true,
						type: 'continuous',
						min: 0,
						max: this.data.ips[0].value,
						realtime: false,
						showLabel: true,
						right: '-10px',
						bottom: '20%',
						textStyle: {
							color: 'white',
						},
						calculable: true,
						inRange: {
							color: ["#bae7ff", "#8cceff", "#2e9cff", "#0e74de", "#055cc1", "#0050b3"]
						}
					},

					tooltip: {
						trigger: 'item',
						formatter: '{b}<br/>{c} 人',
					},
					toolbox: {
						show: true,
						feature: {
							restore: {},
							saveAsImage: {
								pixelRatio: 4
							}
						}
					},
					series: [{
						name: '总人口',
						type: 'map',
						mapType: 'chinacity',
						label: {
							normal: {
								show: false
							}
						},
						top: '40px',
						roam: false,
						data: this.data.ips
					}, ]
				}
				myChart.setOption(option);
			},
			deviceActiveTop(data) {
				var data = this.data.ips
				var yData = [];
				var barData = [];
				for (var i = 0; i < 10; i++) {
					barData.push(data[i]);
					yData.push(i + data[i].name);
				}
				var Chart = echarts.init(document.getElementById('active-top'));
				var option = {
					title: {
						// text: '活跃用户排行',
						textStyle: {
							color: 'white'
						}
					},
					tooltip: {
						trigger: 'axis',
						axisPointer: {
							type: 'shadow'
						}
					},
					// label: {
					// 	show: true
					// },
					grid: {
						left: '3%',
						right: '4%',
						bottom: '3%',
						containLabel: true
					},
					xAxis: {
						show: false,
						type: 'value',
						boundaryGap: [0, 0.01]
					},
					yAxis: {
						type: 'category',
						inverse: true,
						nameGap: 16,
						axisLine: {
							show: false,
							lineStyle: {
								color: '#ddd'
							}
						},
						axisTick: {
							show: false,
							lineStyle: {
								color: '#ddd'
							}
						},
						axisLabel: {
							interval: 0,
							margin: 100,
							textStyle: {
								color: '#455A74',
								align: 'left',
								fontSize: 14
							},
							rich: {
								a: {
									color: '#fff',
									backgroundColor: '#FAAA39',
									width: 20,
									height: 20,
									align: 'center',
									borderRadius: 2
								},
								b: {
									color: '#fff',
									backgroundColor: '#4197FD',
									width: 20,
									height: 20,
									align: 'center',
									borderRadius: 2
								}
							},
							formatter: function (params) {
								if (parseInt(params.slice(0, 1)) < 3) {
									return [
										'{a|' + (parseInt(params.slice(0, 1)) + 1) + '}' + '  ' + params.slice(1)
									].join('\n')
								} else {
									return [
										'{b|' + (parseInt(params.slice(0, 1)) + 1) + '}' + '  ' + params.slice(1)
									].join('\n')
								}
							}
						},
						data: yData
					},
					series: [{
						// name: '2011年',
						type: 'bar',
						data: barData,
						barMaxWidth: 15,
						itemStyle: {
							normal: {
								color: function ({
									dataIndex
								}) {
									if (dataIndex % 2 == 0) {
										return new echarts.graphic.LinearGradient(
											1, 0, 0, 0, [{
													offset: 1,
													color: '#2b2c98'
												},
												{
													offset: 0.5,
													color: '#4c34b9'
												},
												{
													offset: 0.1,
													color: '#773ee3'
												},
											]
										)

									} else {
										return new echarts.graphic.LinearGradient(
											1, 0, 0, 0, [{
													offset: 1,
													color: '#1273E3'
												},
												{
													offset: 0.5,
													color: '#198AE0'
												},
												{
													offset: 0.1,
													color: '#26B5DA'
												},
											]
										)
									}
								},
								barBorderRadius: 5
							},
						}
					}]
				};
				Chart.setOption(option);
			},
			numTemplate(flag) {
				return flag > 0 ? 'up' : 'dowm';
				
			},
			iconTemplate(flag) {
				return flag > 0 ? 'el-icon-caret-top' : 'el-icon-caret-bottom';
			}
		},
		components: {
			EmptyLayout
		},
	}
</script>

<style lang="less" scoped>
	html {
		font-size: 14px;
	}

	/deep/ .el-main {
		padding: 0; 
		background-image: linear-gradient(to top, #041847, #041643, #020b2f, #020727);
	}

	.index-wrap {
		padding: 1vw 1vw 0;
		display: flex;
	}

	#newUserOrigin,
	#orderOrigin {
		position: relative;
		top: -35px;
		left: -15px;
	}

	#profit {
		top: -80px;
	}

	.border-img {
		border: 2px solid transparent;
		border-image: url('./img.png') 2 stretch;
		margin-bottom: 8px;
		background: rgba(10, 70, 157, 0.2);

		* {
			margin: 0;
			padding: 0;
		}

		.wrap {
			padding: 28px 0 0 27px;

			.title {
				color: white;
				font-size: 1.1vw;
			}

			>.num {
				font-size: 1.1vw;
				margin: 0.5vw 0 0.4vw 0;
			}

			.up {
				color: rgba(255, 26, 76, 1);
			}

			.dowm {
				color: #44F436;
			}

			.el-icon-caret-top {
				font-size: 0.9vw;
				color: #FF1A4C;
			}

			.el-icon-caret-bottom {
				font-size: 0.9vw;
				color: #62D059;
			}

			.range {
				.icon {
					vertical-align: middle;
				}

				.num {
					color: rgba(255, 255, 255, 1);
					font-size: 0.8vw;
					margin-left: 8px;
				}
			}
		}
	}

	.left {

		.new-user,
		.active-user,
		.add-user,
		.new-user-origin {
			width: 13vw;
			height: 142px;
		}

		.new-user-origin {
			padding: 0;
			width: 13vw;
			height: 369px;

			.title {
				color: white;
				font-size: 1vw;
				margin: 28px 0 0 27px;
			}

			#newUserOrigin {
				width: 20vw;
				height: 380px;

				/deep/ canvas {
					width: 15vw !important;
				}
			}
		}
	}

	.center {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		margin: 0 52px;

		.top {
			position: relative;
		}

		.bottom {
			width: 20vw;
			position: relative;
			left: -11vw;
			bottom: 10%;

			.title {
				color: rgba(238, 238, 238, 1);
				font-size: 16px;
			}

			#newUserChange {
				width: 44.5vw;
				height: 27.7vw;
			}
		}
	}

	.right {
		display: flex;

		.sum-income {
			width: 13vw;
			height: 142px;
		}

		.right-left {
			.border-img {
				margin: 0 9px 8px 0;
			}

			.new-user-origin {
				padding: 0;
				width: 13vw;
				height: 369px;

				.title {
					color: white;
					font-size: 16px;
					margin: 28px 0 0 27px;
				}

				#orderOrigin {
					width: 20vw;
					height: 380px;

					/deep/ canvas {
						width: 15vw !important;
					}
				}
			}
		}

		.right-right {
			.new-user-origin {
				padding: 0;
				width: 13vw;
				height: 369px;

				.title {
					color: white;
					font-size: 16px;
					margin: 28px 0 0 27px;
				}

				#profit {
					width: 13vw;
					height: 369px;

					/deep/ canvas {
						width: 13vw;
						height: 18vw;
					}
				}
			}
		}
	}

	#active-top {
		position: absolute;
		top: 15vw;
		left: -7vw;
	}
</style>