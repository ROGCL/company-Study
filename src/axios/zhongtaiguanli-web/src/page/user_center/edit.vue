<template>
	<div class="page">
		<el-row>
			<el-col :lg="12" :xs="24">
				<el-form ref="form" :model="form" :rules="rule" label-width="100px" class="edit-form">
					<el-form-item label="账号" prop="adminName">
						<el-input v-model="form.adminName"></el-input>
					</el-form-item>
					<el-form-item label="密码" prop="password">
						<el-input v-model="form.password" type="password"></el-input>
					</el-form-item>
					<el-form-item label="手机号" prop="phone">
						<el-input v-model="form.phone"></el-input>
					</el-form-item>
					<el-form-item label="管理员权限">
						<el-switch v-model="form.manager"></el-switch>
					</el-form-item>
					<el-form-item label="邮箱" prop="email">
						<el-input v-model="form.email"></el-input>
					</el-form-item>
					<el-form-item label="分配App">
						<el-select v-model="form.app" filterable multiple placeholder="请选择">
							<el-option v-for="item in App" :key="item.id" :label="item.title" :value="item.id">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item v-for="(v, i) in form.app" :label="getAppName(v) + '权限'" :key="i">
						<el-tree ref="tree" show-checkbox default-expand-all node-key="id" highlight-current :data="tree.data"
							:props="tree.defaultProps">
						</el-tree>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="onSubmit">立即创建</el-button>
					</el-form-item>
				</el-form>
			</el-col>
		</el-row>
	</div>
</template>

<script>
	import {
		mapState,
		mapActions
	} from 'vuex'
	import {
		validator_username,
		validator_password_strength,
		validator_mobile
	} from '@/config/rule'

	export default {
		data() {
			return {
				form: {
					manager: false,
					adminName: '',
					password: '',
					email: '',
					phone: '',
					app: []
				},
				rule: {
					adminName: [{
						required: true,
						message: '请输入用户名',
						trigger: 'blur'
					}, {
						validator: validator_username,
						trigger: 'blur'
					}],
					password: [{
						required: true,
						message: '请输入密码',
						trigger: 'blur'
					}, {
						validator: validator_password_strength,
						trigger: 'blur'
					}],
					phone: [{
						required: true,
						message: '请输入手机号',
						trigger: 'blur'
					}, {
						validator: validator_mobile,
						trigger: 'blur'
					}]
				},
				tree: {
					data: [{
						id: 1,
						label: '用户分析',
						children: [{
							id: 2,
							label: '下载激活'
						}, {
							id: 3,
							label: '活跃用户'
						}, {
							id: 4,
							label: '留存用户'
						}, {
							id: 5,
							label: '用户流失率'
						}, {
							id: 6,
							label: '用户构成'
						}]
					}, {
						id: 7,
						label: '订单统计',
						children: [{
							id: 8,
							label: '订单转化漏斗'
						}, {
							id: 9,
							label: '订单金额统计'
						}, {
							id: 10,
							label: '退单金额统计'
						}, {
							id: 11,
							label: '转化率统计'
						}]
					}, {
						id: 12,
						label: '用户价值',
						children: [{
							id: 13,
							label: '用户生命周期'
						}, {
							id: 14,
							label: '用户生命周期价值'
						}, {
							id: 15,
							label: '用户价值'
						}, {
							id: 16,
							label: '新用户数据'
						}, {
							id: 17,
							label: '新用户支付数据'
						}, {
							id: 18,
							label: '投资回报率'
						}]
					}, {
						id: 19,
						label: '行为分析',
						children: [{
							id: 20,
							label: '启动次数'
						}, {
							id: 21,
							label: '使用时长'
						}]
					}, {
						id: 22,
						label: '费用支出',
						children: [{
							id: 23,
							label: '渠道投放统计'
						}]
					}],
					defaultProps: {
						children: 'children',
						label: 'label'
					}
				}
			}
		},
		mounted() {
			this.fetchApp()
		},
		computed: {
			...mapState({
				App: state => state.app.data
			})
		},
		methods: {
			...mapActions(['getApp', 'addUserManage']),
			async fetchApp() {
				const [err, res] = await this.getApp()

				if (err) return
			},
			onSubmit(res) {
				
			},
			getAppName(v) {
				if (!v) return

				const {
					App
				} = this

				return App.filter(_ => _.id === v)[0].title
			}
		}
	}
</script>

<style lang="less" scoped>
	.page {
		width: 100%;
		height: 100%;
		background-color: #fff;
		padding: 50px 20px;

		.edit-form {
			.el-select {
				width: 100%;
			}
		}
	}
</style>