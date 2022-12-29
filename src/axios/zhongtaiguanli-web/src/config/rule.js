/**
 * 所有表单的验证规则
 */

// 自定义验证器

function craeteValidator(regex, message) {
	return (rule, value, callback) => {
		if (!value) {
			callback()
		}

		if (regex.test(value)) {
			callback()

			return
		}
		callback(new Error(message))
	}
}

// 汉字
export const validator_hanzi = craeteValidator(/^[\u4e00-\u9fa5]{0,}$/g, '只能输入汉字')
// 中文姓名
export const validator_chinese_name = craeteValidator(/^[\u4E00-\u9FA5]+(·[\u4E00-\u9FA5]+)*$/, '输入的姓名格式错误')
// 手机号码
export const validator_mobile = craeteValidator(/^1\d{10}$/, '输入的手机号码格式错误')
// 身份证号码
export const validator_idcard = craeteValidator(/^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/, '输入的身份证号码格式错误')
// 邮箱
export const validator_email = craeteValidator(/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/, '输入的邮箱格式有误')
// 用户名
export const validator_username = craeteValidator(/^[a-zA-Z0-9_]{4,16}$/, '用户名格式错误,请输入4-16位字母或数字')
// 简易密码
export const validator_password = craeteValidator(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,16}$/, '密码格式为8-16位，至少包含大小写字母和数字')
// 密码
// 最少6位，包括至少1个大写字母，1个小写字母，1个数字，1个特殊字符
export const validator_password_strength = craeteValidator(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/, '密码格式为8-16位包含字母大小写和数字')
// url地址
export const validator_url = craeteValidator(/^((https?|ftp|file):\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/, 'URL格式错误')
// 数字
export const validator_number = craeteValidator(/^\d+$/, '只能输入数字')
// 正数
export const validator_positive_number = craeteValidator(/^-?\d+$/, '只能输入正数')
// 负数
export const validator_negtive_number = craeteValidator(/^-\d+$/, '只能输入负数')
// 整数
export const validator_integer = craeteValidator(/^\d+$/, '只能输入整数')
// 正整数
export const validator_positive_integer = craeteValidator(/^-?\d+$/, '只能输入正整数')
// 负整数
export const validator_negtive_integer = craeteValidator(/^-\d+$/, '只能输入负整数')