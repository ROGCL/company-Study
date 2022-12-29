// https://blog.csdn.net/gs981600308/article/details/88997292

import XLSX from "xlsx"
import FileSaver from "file-saver"

export default function (dom, fileName) {
  var wb = XLSX.utils.table_to_book(document.querySelector(dom), { raw: true });

  var wbout = XLSX.write(wb, {
    bookType: "csv",
    bookSST: true,
    type: "array"
  })

  FileSaver.saveAs(
    new Blob([wbout], { type: "application/octet-stream" }),
    //设置导出文件名称
    fileName + '.csv'
  );
}