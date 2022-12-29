import CryptoJS from '@/util/aes.js'

const key = CryptoJS.enc.Utf8.parse("bbd38031c6039f87");
const iv = CryptoJS.enc.Utf8.parse("abd3ct23c663df8g");

// 加密
function encrypt(str) {
  const srcs = CryptoJS.enc.Utf8.parse(str);
  let encrypted = CryptoJS.AES.encrypt(srcs, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  var hexStr = encrypted.ciphertext.toString();
  var oldHexStr = CryptoJS.enc.Hex.parse(hexStr);
  // 将密文转为Base64的字符串
  var base64Str = CryptoJS.enc.Base64.stringify(oldHexStr);
  return base64Str;
}

// 解密
function decrypt(str) {
  var encryptedHexStr = CryptoJS.enc.Base64.parse(str);
  var srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
  var decrypt = CryptoJS.AES.decrypt(srcs, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  var decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
  return decryptedStr.toString();
}

// unicode转中文字符
function reconvert(str){ 
  str = str.replace(/(\\u)(\w{1,4})/gi,function($0){ 
    return (String.fromCharCode(parseInt((escape($0).replace(/(%5Cu)(\w{1,4})/g,"$2")),16))); 
  }); 
  str = str.replace(/(&#x)(\w{1,4});/gi,function($0){ 
    return String.fromCharCode(parseInt(escape($0).replace(/(%26%23x)(\w{1,4})(%3B)/g,"$2"),16)); 
  }); 
  str = str.replace(/(&#)(\d{1,6});/gi,function($0){ 
    return String.fromCharCode(parseInt(escape($0).replace(/(%26%23)(\d{1,6})(%3B)/g,"$2"))); 
  }); 
  
  return str; 
}

export default{
  decrypt,
  encrypt,
  reconvert
}