import moment from 'moment'

const isNullOrEmpty = (val) => {
	if (val == null || val == "" || typeof (val) == undefined) {
		return true;
	} else {
		return false;
	}
}

const formatNumber = n => {
	n = n.toString()
	return n[ 1 ] ? n : '0' + n
}

const formatDate = timeStr => {
	if (!timeStr) return ''

	const date = new Date(Number(timeStr))

	const year = date.getFullYear()
	const month = date.getMonth() + 1
	const day = date.getDate()

	return [ year, month, day ].map(formatNumber).join('-')
}

// 判断有无值并加参数
const formatUnit = (val, unit = '') => {
	if (unit === '元') {
		return (val ? val : '0') + unit
	}

	return (val ? val : '--') + unit
}

const formatPercentage = (val) => {
	if (val === 0) return ''

	if (!val) return '0%'

	return (Number(val) * 100).toFixed(2) + '%'
}

const formatBetweenTime = (val, star, end, num) => {
	const count = moment(end).diff(moment(star), 'days')

	if ((count + 2) < num) {
		return ''
	}

	return val
}

const formatSystemIcon = (code) => {
	switch (String(code)) {
		case '1':
			return 'icon-anzhuo'
		case '2':
			return 'icon-ios'
		case '3':
			return 'icon-weixin'
		case '4':
			return 'icon-baidu'
		case '5':
          return 'icon-chrome'
		default:
			return ''
	}
}

const formatSystem = (code, name) => {
	let system = ''

	switch (String(code)) {
		case '1':
			system = 'Android'
			break
		case '2':
			system = 'iOS'
			break
		case '3':
			system = '微信小程序'
			break
		case '4':
			system = '百度小程序'
			break
		default:
			system = '未知'
			break
	}

	return name ? name + '-' + system : system
}

const formatIs = (val, yes, no) => {
	if (Number(val) === 1) {
		return yes
	} else {
		return no
	}
}

export {
	isNullOrEmpty,
	formatDate,
	formatUnit,
	formatPercentage,
	formatBetweenTime,
	formatSystem,
	formatSystemIcon,
	formatIs
}
