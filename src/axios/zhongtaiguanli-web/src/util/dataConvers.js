function formatNum (num, fixed = 1) {
  if (!num) {
    return 0
  }
  
  const _num = Math.abs(num)
  let formatTxt;
  
  if (_num < 1000) {
    formatTxt = _num
  } else if (_num >= 1000 && _num < 10000) {
    formatTxt = (_num / 1000).toFixed(fixed) + 'k';
  } else {
    formatTxt = (_num / 10000).toFixed(fixed) + 'w';
  }
  
  if (num >= 0) {
    return formatTxt;
  } else {
    return '-' + formatTxt
  }
}

function formatMoney (num, fixed = 2) {
  if (!num) {
    return 0.00
  }
  
  return (num / 100).toFixed(2)
}

function formatPercent (number) {
  if (!number) {
    return 0
  }
  
  return parseInt(number).toFixed(2) + '%';
}

// 星座格式化
function constellation (num) {
  switch (parseInt(num)) {
    case 1:
      return '白羊';
    case 2:
      return '金牛';
    case 3:
      return '双子';
    case 4:
      return '巨蟹';
    case 5:
      return '狮子';
    case 6:
      return '处女';
    case 7:
      return '天秤';
    case 8:
      return '天蝎';
    case 9:
      return '射手';
    case 10:
      return '摩羯';
    case 11:
      return '水瓶';
    case 12:
      return '双鱼';
    default:
      return '未知'
  }
}

function compare (prop) {
  return function (obj1, obj2) {
    let val1 = obj1[prop];
    let val2 = obj2[prop];
    
    if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
      val1 = Number(val1);
      val2 = Number(val2);
    }
    
    if (val1 < val2) {
      return 1;
    } else if (val1 > val2) {
      return -1;
    } else {
      return 0;
    }
  }
}

export default  {
  formatMoney,
  formatNum,
  formatPercent,
  constellation,
  compare
}
