/*
* Base.js
* 版本号：2.0.1
* 修改时间：2018-05-11 10：45
* 修改人：luby
*/
import veevlinkBase from  "../../../veevlinkBase"

export function base() {
//本地Session存储
  /*重要提示： 1. 每次用户点击菜单访问页面时，都需要识别用户身份，
   在成功获取用户身份后，需要在客户端临时存储用户身份数据，
   以便给后续子级页面提供使用。每个后续页面不需要走识别用户身份过程，
   直接从SessionStroage获取用户身份。
   2. 身份存储使用SessionStroage:key=Veevlink_ActiveUser，Value={“OpenID”: “XXX”, “SFDCAccessToken”: “xxxx”}
   3. 每个页面通用逻辑：首先查看地址是否传入Code，如果有Code则识别用身份并存储，
   否则从SessionStroage获取用户身份，如果SessionStroage也没有用户身份则显示“未识别的用户”
   */
  window.domain = veevlinkBase.domain;
  window.veevlinkStorage = window.sessionStorage;//Veevlink本地存储
  window.veevlinkSession = window.sessionStorage;//VeevlinkSession存储
  window.sessionKey = "Veevlink_Actived_AppId";//Session存储的Key
  window.activedAgentIdSessionKey = "Veevlink_Actived_AgentId"; //Session存储的活动的Actived AgentId
  window.keyPrefix = "Veevlink_";//SessionKey前缀
  window.errorKey = "Veevlink_Error";//错误消息Key
  window.localKey = "";//local存储的key
  window.urlKeyValueObj = getKeyValue(window.location.href);//当前页面url上的参数对象
// function getQueryString(str) {
//   var reg = new RegExp('(^|&)' + str + '=([^&]*)(&|$)', 'i');
//   var result = window.location.search.substr(1).match(reg);
//   if (result !== null) {
//     return result[2];
//   }
//   return null;
// }

  window.getQueryString = function getQueryString(paramName) {
    var url = window.location.href;
    var hashSpArr = url.split(paramName+'=');
    if(hashSpArr.length >= 2){
      var result = hashSpArr[1].split('&');
      var result2 = result[0].split('#');
      return result2[0];
    }else{
      return null;
    }
    // console.log(hashSpArr);
  };
  //获取url所有参数
  function getKeyValue(url) {
    var result = {};
    var reg = new RegExp('([\?|&])(.+?)=([^&?#]*)', 'ig');
    var arr = reg.exec(url);

    while (arr) {
      result[arr[2]] = arr[3];

      arr = reg.exec(url);
    }

    return result;
  }
  if(getQueryString("vue")){
    var vConsole =  new  VConsole();
  }
  // 如果url含 noWeChat 则调用非微信的方法
  if(getQueryString('noWeChat')){
    /*
     封装获取Context的方法，供外部调用，
     判断是否有Code，如果有Code需要调用Base.js获取，
     如果没有判断Cookie是否存在，如果存在返回Cookie中的值，
     如果没有就代表Code也没有，没有做微信OAuth2.0认证，Cookie也丢失，所以无法识别当前用户身份提示错误页面
     */
    function GetContext() {
      //从URL获取code和appid
      var code = getQueryString("code");
      var AppId = getQueryString("appid");
      var AgentId = getQueryString("agentid");
      var OpenId = getQueryString("openid");
      context.AppId = AppId;
      context.OpenId = OpenId;

      localKey = keyPrefix + AppId;
      //根据localKey判断localstorage中是否存在对应的Value
      //存在的话，将value取出来，并且转成context对象
      if (veevlinkStorage.hasOwnProperty(localKey)) {
        veevlinkSession.setItem(sessionKey, AppId);
        GetContextFromStorage();
        if (context.OpenId == "" && context.WEQYUserId == "") {
          alert('Openid为空');
        }
      }
      //如果不存在，说明从菜单点击过来，直接进中间件拿数据
      else {
        var BaseContextUrl = domain + "/BaseContextV2.aspx";
        //发送ajax请求到获取Context地址，带上appid，userid参数
        ajax({
          url: BaseContextUrl,
          data: {
            "AppId": context.AppId,
            "AgentId": context.AgentId,
            "WEQYUserId": context.WEQYUserId,
            "OpenId": context.OpenId
          },
          type: "GET",
          dataType: "json",
          success: function (res, xml) {
            //请求成功后，将返回的json字符串，转换成context对象
            if (res !== null && res !== "") {
              context = JSON.parse(res);
              // alert("basecontext" + context)
              // resJson.OpenId = context.OpenId;
              // resJson.WEQYUserId = context.WEQYUserId;
              // context = resJson;
              //设置当前激活的公众号appid为当前appid
              veevlinkSession.setItem(sessionKey, context.AppId);
              SetContext(context);
            }
          },
          fail: function (status) {
            alert("获取Context失败");
          }
        });
      }
    }
    //从缓存获取Context
    function GetContextFromStorage() {
      context = JSON.parse(veevlinkStorage.getItem(localKey));
      //如过Context已过期，重新从服务器获取
      if (new Date().getTime() > context.ExpireTime || context.ExpireTime == undefined || context.ExpireTime == null || context.ExpireTime == "") {
        //动态获取当前url中的protocol和host，
        //var url = window.location.protocol + "//" + window.location.host;
        //拼接获取Context的url
        var BaseContextUrl = domain + "/BaseContextV2.aspx";
        //发送ajax请求到获取Context地址，带上appid，userid参数
        ajax({
          url: BaseContextUrl,
          data: {
            "AppId": context.AppId,
            "AgentId": context.AgentId,
            "WEQYUserId": context.WEQYUserId,
            "OpenId": context.OpenId
          },
          type: "GET",
          dataType: "json",
          success: function (res, xml) {
            //请求成功后，将返回的json字符串，转换成context对象
            if (res !== null && res !== "") {
              context = JSON.parse(res);
              // alert("basecontext" + context)
              // resJson.OpenId = context.OpenId;
              // resJson.WEQYUserId = context.WEQYUserId;
              // context = resJson;
              //设置当前激活的公众号appid为当前appid
              veevlinkSession.setItem(sessionKey, context.AppId);
              SetContext(context);
            }
          },
          fail: function (status) {
            alert("获取Context失败");
          }
        });
      }
    }
    //封装设置Context的方法
    function SetContext(context) {
      var contextStr = JSON.stringify(context);
      var AppId = veevlinkSession.getItem(sessionKey);
      var AgentId = veevlinkSession.getItem(activedAgentIdSessionKey);
      if (AgentId == null) {
        localKey = keyPrefix + AppId;
      }
      else {
        localKey = keyPrefix + AppId + "_" + AgentId;
      }
      //localKey = keyPrefix + veevlinkSession.getItem(sessionKey);
      veevlinkStorage.setItem(localKey, contextStr);
    }
    //显示页面主内容,保证每个页面都有一个id为content的顶级div，显示Content，隐藏Loading和Error
    function ShowContent() {
      document.getElementById("content").style.display = 'block';
      document.getElementById("loading-box").style.display = 'none';
    }
    //显示错误页面，隐藏Loading和Content,动态添加错误的Div及显示信息
    function ShowError(error) {
      //如果配置项为显示系统错误，则把错误信息显示到页面上，方便调试，否则直接显示系统错误友好界面
      $('#loading-box').hide();
      if (context.ShowDevError) {
        if (error.responseText) {
          $('body').append(errorPageTemplate(error.responseText + " " + error.status + " " + error.statusText));
        } else if (error.message && error.errorCode) {
          $('body').append(errorPageTemplate(error.message + " " + error.errorCode));
        } else if (Object.prototype.toString.call(error) === "[object String]") {
          //显示默认的错误消息
          $('body').append(errorPageTemplate(error));
        } else {
          //显示默认的错误消息
          $('body').append(errorPageTemplate('很抱歉，系统出错了!!'));
        }
      }
      else {
        //显示默认的错误消息
        $('body').append(errorPageTemplate('很抱歉，系统出错了'));
      }

      if (window.addEventListener) {
        var closeBtn = document.getElementById("error_close");
        closeBtn.addEventListener('click', function () {
          WeixinJSBridge.call('closeWindow');
        }, false);
      }
    }
    //利用原生Js发送Ajax请求
    function ajax(options) {
      options = options || {};
      options.type = (options.type || "GET").toUpperCase();
      options.dataType = options.dataType || "json";
      var params = formatParams(options.data);
      if (window.XMLHttpRequest) {
        var xhr = new XMLHttpRequest();
      } else {
        var xhr = new ActiveXObject('Microsoft.XMLHTTP');
      }
      xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
          var status = xhr.status;
          if (status >= 200 && status < 300) {
            options.success && options.success(xhr.responseText, xhr.responseXML);
          } else {
            options.fail && options.fail(status);
          }
        }
      };
      if (options.type == "GET") {
        xhr.open("GET", options.url + "?" + params, false);
        xhr.send(null);
      } else if (options.type == "POST") {
        xhr.open("POST", options.url, false);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send(params);
      }
    }
    //格式化URL参数
    function formatParams(data) {
      var arr = [];
      for (var name in data) {
        arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(data[name]));
      }
      arr.push(("v=" + Math.random()).replace(".", ""));
      return arr.join("&");
    }
    //显示调用接口失败的错误信息
    function SetCallBackError(error) {
      veevlinkSession.setItem(errorKey, error.responseText + " " + error.status + " " + error.statusText)
    }
   //Base.js加载完成主动调用GetContext()方法
    GetContext();
  }else{
    /*封装获取Context的方法，供外部调用，
 判断是否有Code，如果有Code需要调用Base.js获取，
 如果没有判断Cookie是否存在，如果存在返回Cookie中的值，
 如果没有就代表Code也没有，没有做微信OAuth2.0认证，Cookie也丢失，所以无法识别当前用户身份提示错误页面
 */
    function GetContext() {
      //从URL获取code和appid
      var code = getQueryString("code");
      var AppId = getQueryString("appid");
      var AgentId = getQueryString("agentid");
      var OpenId = getQueryString("OpenId");
      var isWeb = getQueryString("isWeb");
      if (isWeb == "" || isWeb == null) {
        isWeb = "false";
      }
      //全局控制是否是测试环境
      var IsTest = getQueryString("test") || veevlinkBase.IsTest;
      /**********************以下代码部署到微信环境可以删除******************************/
      if (IsTest) {
        context.AppId = veevlinkBase.AppId;
        context.SessionId = veevlinkBase.SessionId;
        context.OpenId = veevlinkBase.OpenId;
        context.ApiVersion = "v37.0";
        context.InstanceUrl = veevlinkBase.InstanceUrl;
        context.RefreshTokenProxyUrl = "https://dev.veevlink.com/Proxy/SFDCAccessTokenProxy.aspx";
        context.ShowDevError = true;
        context.Domain = veevlinkBase.domain;
        context.WEQYUserId = "Da";
        context.SFDCUserId = "";
        context.JSAPITicket = '88888';
        return;
      }
      /**********************以上代码部署到微信环境可以删除******************************/
      //如果code为空，说明不是从微信oauth跳转回来

      if (code == null) {
        //如果appid也为空，说明页面不是从菜单直接点击过来
        if (AppId == null) {
          //如果sessionstorage中也不包含激活的公众号appid，页面不是从正常途径打开，提示错误友好页面
          if (!veevlinkSession.hasOwnProperty(sessionKey)) {
            alert("未授权");
          }
          //如果sessionstorage中包含激活的公众号appid，根据sessionkey取出公众号的appid
          else {
            AppId = veevlinkSession.getItem(sessionKey);
            if (AgentId == null) {
              if (!veevlinkSession.hasOwnProperty(activedAgentIdSessionKey)) {
                localKey = keyPrefix + AppId;
              }
              else {
                AgentId = veevlinkSession.getItem(activedAgentIdSessionKey);
                localKey = keyPrefix + AppId + "_" + AgentId;
              }
            }
            else {
              localKey = keyPrefix + AppId + "_" + AgentId;
              veevlinkSession.setItem(activedAgentIdSessionKey, AgentId);
            }
            if (veevlinkStorage.hasOwnProperty(localKey)) {
              GetContextFromStorage();
            }
            else {
              WechatOAuth(AppId, AgentId);
              //alert("获取Context失败");
            }
          }
        }
        //如果appid不为空，拼接获取localstorage的key
        else {

          if (AgentId == null) {
            if (!veevlinkSession.hasOwnProperty(activedAgentIdSessionKey)) {
              localKey = keyPrefix + AppId;
            }
            else {
              AgentId = veevlinkSession.getItem(activedAgentIdSessionKey);
              localKey = keyPrefix + AppId + "_" + AgentId;
            }
          }
          else {
            localKey = keyPrefix + AppId + "_" + AgentId;
            veevlinkSession.setItem(activedAgentIdSessionKey, AgentId);
          }
          //根据localKey判断localstorage中是否存在对应的Value
          //存在的话，将value取出来，并且转成context对象
          if (veevlinkStorage.hasOwnProperty(localKey)) {
            veevlinkSession.setItem(sessionKey, AppId);
            GetContextFromStorage();
            if ((context.OpenId == "" || context.OpenId == null) && (context.WEQYUserId == "" || context.WEQYUserId == null) && (isWeb == "false")) {
              WechatOAuth(AppId, AgentId);
            }
          }
          //如果不存在，说明从菜单点击过来，并且没有做过授权，跳转到微信oauth，进行身份认证
          else {
            /*  GetContextFromVeevlik(AppId);
                if ((context.OpenId == "" || context.OpenId==null) && (context.WEQYUserId == "" || context.WEQYUserId==null) && (isWeb=="false")) {
              WechatOAuth(AppId, AgentId);
            } */
            WechatOAuth(AppId, AgentId);
          }
        }
      }
      //如果code不为空，说明是第一次进行身份认证，微信会带着code返回本页面
      else {
        //拼接localKey
        localKey = keyPrefix + AppId;
        if (AgentId != null) {
          localKey = keyPrefix + AppId + "_" + AgentId;
        }
        if (!veevlinkStorage.hasOwnProperty(localKey)) {
          //获取state参数，暂时没用到
          var state = getQueryString("state");
          //动态获取当前url中的protocol和host，
          //var url = window.location.protocol + "//" + window.location.host;
          //拼接进行身份认证服务的url
          var BaseUrl = domain + "/BaseV2.aspx";
          //发送ajax请求到身份认证地址，带上code，appid，state参数
          ajax({
            url: BaseUrl,
            data: {"code": code, "AppId": AppId, "AgentId": AgentId, "state": state},
            type: "GET",
            dataType: "json",
            success: function (res, xml) {
              //请求成功后，将返回的json字符串，转换成context对象
              if (res !== null && res !== "") {
                context = JSON.parse(res);
                // alert("base" + context)
                //设置当前激活的公众号appid为当前appid
                veevlinkSession.setItem(sessionKey, AppId);
                if (AgentId != null) {
                  veevlinkSession.setItem(activedAgentIdSessionKey, AgentId);
                }
                //将认证后的信息保存到localstorage
                SetContext(context);
              }
            },
            fail: function (status) {
              alert("获取用户ID失败");
            }
          });
        }
        else {
          GetContextFromStorage();
          if ((context.OpenId == null || context.OpenId == "") && (context.WEQYUserId == null || context.WEQYUserId == "") && AppId != null && AppId != "") {
            WechatOAuth(AppId, AgentId);
          }
        }
      }
      //如果微信账号为企业号或微信企业，并且context里的SessionId为空，跳转到Salesforce OAuth授权页面
      if ((context.WechatAccountType == "Enterprise" || context.WechatAccountType == "WeWork") && context.WechatIdentityMode == "SSOIntegrated" && (context.SessionId == null || context.SessionId == undefined || context.SessionId == "")) {
        self.location = domain + "/Wechat2SFDC/OAuth/PreOAuth.aspx?sourceid=" + AppId + "&agentid=" + AgentId;
      }
    }
//显示页面主内容,保证每个页面都有一个id为content的顶级div，显示Content，隐藏Loading和Error
    function ShowContent() {
      document.getElementById("content").style.display = 'block';
      document.getElementById("loading-box").style.display = 'none';
    }
//如果只有openId,根据openId获取到context
    function GetContextFromVeevlik(AppId) {
      //动态获取当前url中的protocol和host，
      //var url = window.location.protocol + "//" + window.location.host;
      //拼接获取Context的url
      var BaseContextUrl = domain + "/BaseContextV2.aspx";
      //发送ajax请求到获取Context地址，带上appid，userid参数
      ajax({
        url: BaseContextUrl,
        data: {
          "AppId": AppId
        },
        type: "GET",
        dataType: "json",
        success: function (res, xml) {
          //请求成功后，将返回的json字符串，转换成context对象
          if (res !== null && res !== "") {
            context = JSON.parse(res);
            // alert("basecontext" + context)
            // resJson.OpenId = context.OpenId;
            // resJson.WEQYUserId = context.WEQYUserId;
            // context = resJson;
            //设置当前激活的公众号appid为当前appid
            veevlinkSession.setItem(sessionKey, context.AppId);
            SetContext(context);
          }
        },
        fail: function (status) {
          alert("获取Context失败");
        }
      });
    }
//从缓存获取Context
    function GetContextFromStorage() {
      context = JSON.parse(veevlinkStorage.getItem(localKey));
      //如过Context已过期，重新从服务器获取
      if (((context.WechatAccountType == "Enterprise" || context.WechatAccountType == "WeWork") && context.WechatIdentityMode == "SSOIntegrated" && (context.SessionId == null || context.SessionId == undefined || context.SessionId == "")) || new Date().getTime() > context.ExpireTime || context.ExpireTime == undefined || context.ExpireTime == null || context.ExpireTime == "") {
        //动态获取当前url中的protocol和host，
        //var url = window.location.protocol + "//" + window.location.host;
        //拼接获取Context的url
        var BaseContextUrl = domain + "/BaseContextV2.aspx";
        //发送ajax请求到获取Context地址，带上appid，userid参数
        ajax({
          url: BaseContextUrl,
          data: {
            "AppId": context.AppId,
            "AgentId": context.AgentId,
            "WEQYUserId": context.WEQYUserId,
            "OpenId": context.OpenId
          },
          type: "GET",
          dataType: "json",
          success: function (res, xml) {
            //请求成功后，将返回的json字符串，转换成context对象
            if (res !== null && res !== "") {
              context = JSON.parse(res);
              // alert("basecontext" + context)
              // resJson.OpenId = context.OpenId;
              // resJson.WEQYUserId = context.WEQYUserId;
              // context = resJson;
              //设置当前激活的公众号appid为当前appid
              veevlinkSession.setItem(sessionKey, context.AppId);
              SetContext(context);
            }
          },
          fail: function (status) {
            alert("获取Context失败");
          }
        });
      }
    }
//跳转微信OAuth方法
    function WechatOAuth(AppId, AgentId) {
      //var url = window.location.protocol + "//" + window.location.host;
      var redirectUrl = window.location.href;
      redirectUrl = encodeURIComponent(redirectUrl);
      urlKeyValueObj["redirectUrl"] = redirectUrl;
      urlKeyValueObj["agentid"] = AgentId;
      var BaseOAuthRouterUrl = domain + "/BaseOAuthRouter.aspx";
      //发送ajax请求到BaseOAuthRouterUrl，判断WechatAccount类型及授权方式
      ajax({
        url: BaseOAuthRouterUrl,
        data: urlKeyValueObj,
        type: "GET",
        dataType: "json",
        success: function (res, xml) {
          //请求成功后，将返回的json字符串，转换成context对象
          if (res !== null && res !== "") {
            var resJson = JSON.parse(res);
            //根据微信账号类型及授权方式，跳转OAuth页面
            var oauthurl = resJson.Oauthurl;
            if (oauthurl != null) {
              //微信认证跳转卡住时进行页面刷新操作
              setTimeout(function () {
                if (getQueryString('code') !== null) {
                  window.location.reload();
                }
              }, 500);
              self.location = oauthurl;
            }
          }
        },
        fail: function (status) {
          alert("获取微信信息失败");
        }
      });
    }
//封装设置Context的方法
   window.SetContext = function SetContext(context) {
      var contextStr = JSON.stringify(context);
      var AppId = veevlinkSession.getItem(sessionKey);
      var AgentId = veevlinkSession.getItem(activedAgentIdSessionKey);
      if (AgentId == null) {
        localKey = keyPrefix + AppId;
      }
      else {
        localKey = keyPrefix + AppId + "_" + AgentId;
      }
      //localKey = keyPrefix + veevlinkSession.getItem(sessionKey);
      veevlinkStorage.setItem(localKey, contextStr);
    }
//显示页面主内容,保证每个页面都有一个id为content的顶级div，显示Content，隐藏Loading和Error
    function ShowContent() {
      document.getElementById("content").style.display = 'block';
      document.getElementById("loading-box").style.display = 'none';
    }
//利用原生Js发送Ajax请求
    function ajax(options) {
      options = options || {};
      options.type = (options.type || "GET").toUpperCase();
      options.dataType = options.dataType || "json";
      var params = formatParams(options.data);
      if (window.XMLHttpRequest) {
        var xhr = new XMLHttpRequest();
      } else {
        var xhr = new ActiveXObject('Microsoft.XMLHTTP');
      }
      xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
          var status = xhr.status;
          if (status >= 200 && status < 300) {
            options.success && options.success(xhr.responseText, xhr.responseXML);
          } else {
            options.fail && options.fail(status);
          }
        }
      };
      if (options.type == "GET") {
        xhr.open("GET", options.url + "?" + params, false);
        xhr.send(null);
      } else if (options.type == "POST") {
        xhr.open("POST", options.url, false);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send(options.data);
      }
    }
//格式化URL参数
    function formatParams(data) {
      var arr = [];
      for (var name in data) {
        arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(data[name]));
      }
      arr.push(("v=" + Math.random()).replace(".", ""));
      return arr.join("&");
    }
// 错误收集api
    window.reportError =function reportError(error, success) {
      var errData = {
        Url: window.location.href,
        CreateAt: new Date().toLocaleString(),
        body: JSON.stringify(error)
      };
      ajax({
        type: 'POST',
        url: 'https://api.veevlink.com/Log/ErrorLog',
        data: JSON.stringify(errData),
        success: function (data) {
          console.log("收集错误成功: ", data);
          success && success(data);
        },
        error: function (error) {
          console.log("收集错误失败：", error);
        }
      });
    }
//Base.js加载完成主动调用GetContext()方法
    GetContext();
  }
}(window);

