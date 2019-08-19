/**
 * Created by Luby on 2019/1/25.
 */
const base = {
   IsTest : true,
  /*
  本地账号是否启用 true 的话记得
  修改 SessionId(sf的session，可以问创发部的人) ，
     AppId(公众号的appid)，
     OpenId(微信用户唯一id)
     反向代理的域名请到 vue.config.js  66行处 修改对应的请求地址
   */
   domain:"https://test.veevlink.com", // 测试环境地址还是正式环境地址,正式环境地址可以问创发
   AppId :"wxd1f28ce8457c4d2e",
   SessionId: "00D0k00000015o3!AR8AQGsAnMBZPgpWoT1dJiyi.MMxeqRhhDvyR5pMMmC2dxdnOAmvJ6dasANRGBUfQ.dieoXg360OXZf4ssmLG8F1NCbezA9l",
   OpenId : "o6Lyc5qBNYaJFcIeaSMFPLfzttj4",
   InstanceUrl : "http://localhost:8080", // 本地请求的接口地址
   target : "https://nwcl--nwclfull.my.salesforce.com",
  // ap1.veevlink.com 正式   https://test.veevlink.com 测试
   error : function () {
     // 错误收集
     window.onerror = function (msg, url, line, col, error) {
       //没有URL不上报
       if (msg != "Script error." && !url) {
         return true;
       }
       setTimeout(function () {
         var data = {};
         //不一定所有浏览器都支持col参数
         col = col || (window.event && window.event.errorCharacter) || 0;

         data.url = url;
         data.line = line;
         data.col = col;
         if (!!error && !!error.stack) {
           //如果浏览器有堆栈信息
           //直接使用
           data.msg = error.stack.toString();
         } else if (!!arguments.callee) {
           //尝试通过callee拿堆栈信息
           var ext = [];
           var f = arguments.callee.caller, c = 3;
           //这里只拿三层堆栈信息
           while (f && (--c > 0)) {
             ext.push(f.toString());
             if (f === f.caller) {
               break;//如果有环
             }
             f = f.caller;
           }
           ext = ext.join(",");
           data.msg = error.stack.toString();
         }
         //把data上报到后台！
         console.log('错误信息',data);
       }, 0);
       return true;
     };

   }
};

export default
{
  IsTest : base.IsTest,
  AppId: base.AppId,
  SessionId: base.SessionId,
  OpenId : base.OpenId,
  InstanceUrl : base.InstanceUrl,
  error : base.error,
  domain : base.domain
}
