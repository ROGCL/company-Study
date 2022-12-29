<template>
	<div class="dialog">
		<el-dialog :visible.sync="dialogVisible" width="30%" @close="edit = false" :close-on-click-modal="false">
			<el-form label-position="left">
				<filterapp v-bind:appId.sync="form.appid" label="选择App" :disabled="edit" />
				<el-form-item label="选择日期">
					<el-date-picker v-model="form.date" value-format="yyyy-MM-dd" type="date" style="width:230px" :disabled="edit" :picker-options="pickerOptions"></el-date-picker>
				</el-form-item>
				<el-form-item label="输入Cpc">
					<el-input v-model="form.cpc" placeholder="请输入" style="width:230px" @blur="blur"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
						<el-button @click="dialogVisible = false">取 消</el-button>
						<el-button type="primary" @click="Submit">确 定</el-button>
				</span>
		</el-dialog>
	</div>
</template>

<script>
import moment from "moment"
import filterapp from '@/component/filterapp/filterapp'
import { System_addCpc, System_updateCpc } from '@/config/api/index'
export default {
	data() {
		return {
			edit: false,
			dialogVisible: false,
			editData: {
				id: '',
				cpc: ''
			},
			form: {
				appid: '',
				cpc: '',
				date: moment().subtract(1, "d").format("YYYY-MM-DD")
			},
			pickerOptions: {
				disabledDate(time) {
					return time.getTime() > Date.now();
				},
			},
		}
	},
	methods: {
		blur(e) {
			const value = e.target.value;
			this.form.cpc = Number(value.replace(/[^\d\.]/, '')).toFixed(4);
		},
		async Submit() {
			if (this.edit) {
				const params = {
					id: this.editData.id,
					cpc: this.form.cpc
				}
				const [err, res, status, msg] = await System_updateCpc(params);
				if (err) return;

				this.$message({
					type: 'success',
					message: msg,
				})

				this.dialogVisible = false;
				this.$emit('success');

				return;
			}

			const [err, res, status, msg] = await System_addCpc(this.form);

			if (err) return;

			this.$message({
				message: msg,
				type: 'success'
			});

			this.dialogVisible = false;
			this.$emit('success');
		}
	},
	watch: {
		dialogVisible(newValue) {
			if (!newValue) {
				this.edit = false;
				this.form.cpc = '';
			}
		}
	},
	components: {
		filterapp
	}
};
</script>

<style lang='scss' scoped>

</style>