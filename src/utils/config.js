/**
 * Created by Luby on 2018/11/20.
 */

 import veevlinkBase from  "../../veevlinkBase"
// let veevlinkBase = {
//   domain : "https://test.veevlink.com"
// }
let server =  function judge(url,type,result,success,err,isLogin) {
    vm.loading = true;
    client.apexrest(url, (data)=> {
      vm.loading = false;
      if(data.isLogin || isLogin){
        if(data.success){
          success(data);
        }else{
          vm.hintbox = data.message;
          // 报错 上传服务器
          if(veevlinkBase.domain !== "https://test.veevlink.com"){
            if(data.message.indexOf('line') !== -1 || data.message.indexOf('Invalid') !== -1){
              vm.hintbox = "系统开小差了，请重试一下";
              let result2 = {
                OpenId : context.OpenId,
                AccountName : context.WEQYUserId, // 会员名
                URL : url, // 接口url
                RequestType : type, // 请求类型
                Params : JSON.stringify(result), // 请求参数（POST）
                ErrorMessage : data.message, // 后台报错信息
              };
              // 发送错误日志
              reportError(result2)
            }
          }
        }
      }else{
        console.log(data.isLogin);
        if(data.isLogin === undefined){
          vm.hintbox = "isLogin不存在,请联系管理员";
        }else{
          // vm.hintbox ="isLogin为false"
          vm.$router.push("./login");
        }
      }
    }, (error) =>{
      vm.loading = false;
      vm.hintbox = "网络有点问题,请稍后重试!";
      err(error);
      if(veevlinkBase.domain !== "https://test.veevlink.com"){
        // 报错 上传服务器
        let result2 = {
          OpenId : context.OpenId,
          AccountName : context.WEQYUserId, // 会员名
          URL : url, // 接口url
          RequestType : type, // 请求类型
          Params : JSON.stringify(result), // 请求参数（POST）
          ErrorMessage : JSON.stringify(data), // 后台报错信息
        };
        // 发送错误日志
        reportError(result2)
      }
    },  type ,result?result:null,null , true);
};

/*html标签截取 图片地址*/
let getHtmlSrc =  function getHtmlSrc(str) {
   // src="
  // console.log("str",str);
   if(str){
     let pic1 = str.split('src="');
     if(pic1.length > 1){
       let pic2 = pic1[1].split('"');
       return pic2[0].replace(/&amp;/g, "&");
     }
   }else{
     return null;
   }
};
/*手机验证方法*/
let isPhone = function validatemobile(mobile) {
    if(mobile.length===0){
      vm.hintbox = "请输入电话号码";
      return true;
    }else{
      let myreg = /^(((?=[0][0-9]*-?[0-9]*[0-9]$)[0-9-]{10,20})|(1[3-9]\d{9}))$/;
      if(myreg.test(mobile)){
        return false;
      }else{
        vm.hintbox = "请输入有效电话号码";
        return true;
      }
    }
  };
/*ss*/
let isSFZ = function isIdCardNo(num) {
       num = num.toUpperCase();
       //身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X。
       if (!(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(num))) {
             vm.hintbox = "您输入的身份证号有误,请核查后重新输入";
             return false;
         }
       //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
       //下面分别分析出生日期和校验位
       var len, re;
       len = num.length;
       if (len == 15) {
             re = new RegExp(/^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/);
             var arrSplit = num.match(re);
             //检查生日日期是否正确
             var dtmBirth = new Date('19' + arrSplit[2] + '/' + arrSplit[3] + '/' + arrSplit[4]);
             var bGoodDay;
             bGoodDay = (dtmBirth.getYear() == Number(arrSplit[2]))
                         && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3]))
                         && (dtmBirth.getDate() == Number(arrSplit[4]));
             if (!bGoodDay) {
               vm.hintbox= '您的身份证中出生日期有误,请核查后重新输入！';
                  return false;
               } else {
                   //将15位身份证转成18位
                   //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
                   var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
                   var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
                   var nTemp = 0, i;
                   num = num.substr(0, 6) + '19' + num.substr(6, num.length - 6);
                   for (i = 0; i < 17; i++) {
                         nTemp += num.substr(i, 1) * arrInt[i];
                     }
                   num += arrCh[nTemp % 11];
                   return num;
               }
         }
       if (len == 18) {
             re = new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/);
             var arrSplit = num.match(re);
             //检查生日日期是否正确
             var dtmBirth = new Date(arrSplit[2] + "/" + arrSplit[3] + "/" + arrSplit[4]);
             var bGoodDay;
             bGoodDay = (dtmBirth.getFullYear() == Number(arrSplit[2]))
                         && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3]))
                         && (dtmBirth.getDate() == Number(arrSplit[4]));
             if (!bGoodDay) {

                   vm.hintbox = '您的身份证中出生日期有误,请核查后重新输入！';
                   return false;
               } else {
                   //检验18位身份证的校验码是否正确。
                   //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
                   var valnum;
                   var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
                   var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
                   var nTemp = 0, i;
                  for (i = 0; i < 17; i++) {
                         nTemp += num.substr(i, 1) * arrInt[i];
                     }
                   valnum = arrCh[nTemp % 11];
                   if (valnum != num.substr(17, 1)) {
                     vm.hintbox = "您输入的身份证号有误,请核查后重新输入";
                         return false;
                     }
                   return num;
               }
         }
       return false;
 };

let formatDate = function formatDate(date, fmt) {
  function padLeftZero(str) {
    return ('00' + str).substr(str.length);
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  };
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + '';
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
    }
  }
  return fmt;
};


export default
{
  server,//判断接口状态
  getHtmlSrc, // 获取图片src
  isPhone,// 判断手机号
  isSFZ,
  formatDate, // 时间改变
}
