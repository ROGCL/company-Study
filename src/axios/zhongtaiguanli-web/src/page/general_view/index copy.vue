<template>
	<EmptyLayout>
		<div class="page">
			<div class="count-bar">
				<el-row :gutter="20">
					<el-col :md="12" :lg="8" :sm="8" v-for="(v, i) in countArr" :key="i">
						<div class="count-item">
							<div class="title">{{ v.name }}</div>
							<div class="count">{{ general[v.key] }}</div>
						</div>
					</el-col>
				</el-row>
			</div>
		</div>
	</EmptyLayout>
</template>

<script>
	import {
		mapState,
		mapActions,
		mapMutations
	} from 'vuex'
	import EmptyLayout from '@/layout/basic/empty'

	export default {
		components: {
			EmptyLayout
		},
		data() {
			return {
				countArr: [{
					name: '新增用户',
					key: 'user_new'
				}, {
					name: '活跃用户',
					key: 'device_active'
				}, {
					name: '总收入',
					key: 'order_price_pay'
				}, {
					name: '注册用户',
					key: 'device_new'
				}, {
					name: '订单数量',
					key: 'order_num_pay'
				}, {
					name: 'ARPU',
					key: 'arpu'
				}]
			}
		},
		mounted() {
			this.fetchData()
		},
		computed: {
			...mapState({
				general: state => state.general.data
			})
		},
		methods: {
			...mapActions(['getGeneral']),
			async fetchData() {
				const [err, res] = await this.getGeneral()

				if (err) return
			}
		}
	}
</script>

<style lang="less" scoped>
	.page {
		width: 100%;
		height: 100%;
		position: relative;

		.count-bar {
			.el-col {
				margin-top: 30px;
			}

			.count-item {
				width: 100%;
				height: 200px;
				background-color: #fff;
				box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.1);
				border-radius: 10px;
				overflow: hidden;
				display: flex;
				align-items: center;
				flex-direction: column;
				justify-content: center;

				.title {
					font-size: 18px;
				}

				.count {
					color: #002140;
					font-size: 30px;
					margin-top: 15px;
				}
			}
		}
	}
</style>