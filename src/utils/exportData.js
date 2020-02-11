export function templateXls(data, name) {
  var blob = new Blob([data], {
    type:
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
  })
  // blob.type = "application/excel";
  var url = window.URL.createObjectURL(blob)
  var aLink = document.createElement('a')
  aLink.style.display = 'none'
  aLink.href = url
  aLink.setAttribute('download', name)
  document.body.appendChild(aLink)
  aLink.click()
  document.body.removeChild(aLink) // 下载完成移除元素
  window.URL.revokeObjectURL(url) // 释放掉blob对象
}
