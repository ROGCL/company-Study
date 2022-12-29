export const getName = (type, before, after) => `${ before ? before + '_' : '' }${ type }${ after ? '_' + after : '' }`.replace(/_(\w)/g, v => v.slice(1).toUpperCase())
