import _ from 'lodash'

export default (url, method = 'get', data = {}) => {
  const accept = ['get', 'post']
  
  if (accept.indexOf(method) < 0 || !_.isPlainObject(data)) {
    return '调用的参数不对'
  }
  
  const $el = document.createElement('form')
  
  $el.method = method
  $el.setAttribute('action', url)
  
  // 提交方式为pos时处理
  if (method === 'post') {
    Object.keys(data).forEach((val, i) => {
      const $input = document.createElement('input')
      $input.setAttribute('type', 'hidden')
      $input.setAttribute('name', val)
      $input.setAttribute('value', data[val])
      $el.appendChild($input)
    })
  }
  
  // 表单提交并移除dom
  document.body.appendChild($el)
  $el.submit()
  document.body.removeChild($el)
}
