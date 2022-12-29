function FormatJson (filterVal, jsonData) {
  return jsonData.map(v => filterVal.map(j => v[j]))
  
}

export default FormatJson
