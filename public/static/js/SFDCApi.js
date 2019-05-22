//实例化forcetk
export function SFDCApi() {

  window.client = new forcetk.Client();
//console.log("SFDCAPI",context);
//设置SessionToken
  var InstanceUrl;
// if (context.EnableReverseProxy) {
//     InstanceUrl = context.ReverseProxyUrl;
// }
// else {
//     InstanceUrl = context.InstanceUrl;
// }
  InstanceUrl = context.InstanceUrl;
  client.setSessionToken(context.SessionId, context.ApiVersion, InstanceUrl);
//client.setSessionToken(context.SessionId, context.ApiVersion, "https://p.veevlink.com");

//设置RefreshTokenProxy，AccessToken失效后会调用RefreshTokenProxy刷新AccessToken
  console.log(context);
//client.setRefreshTokenProxy(context.OpenId, context.AppId, context.RefreshTokenProxyUrl,context.SFDCUserId);
  client.setRefreshTokenProxy(context.OpenId, context.WEQYUserId, context.AppId, context.RefreshTokenProxyUrl, context.SFDCUserId);

}
