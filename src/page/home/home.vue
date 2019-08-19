<template>
  <div class="home">
     <img :src="'./static/img/logo.png'" />
     <p class="text">启动成功</p>
  </div>
</template>

<script type="text/ecmascript-6">
//  import config from  '../../utils/config.js';
  export default {
    data(){
      return{
        data:{

        }
      }
    },
    components:{
    },
    filters: {
      cardId(str){
        if(str && str.length>4){
          return str.replace(/\s/g,'').replace(/(.{4})/g,"$1 ");
        }else if(str &&0<str.length<4){
          return str
        }else{
          return ""
        }
      }
    },
    methods:{
      /*
      获取接口方法
      this.config.server(url,type,data,isLogin)
      url : 接口地址 (从 /services 后面计算)
      type : GET/POST
      data : POST的参数，GET直接设为 ""
      success : 成功回调
      error ： 失败回调
      isLogin : 是否判断isLogin参数， 直接设置为null或者不填
      * */
      getInfo(){
        this.config.server(
          "/nw/mp/account/getInfo?OpenId="+context.OpenId,
          "GET",
          null,
          (success)=> {
            console.log('success',success);
          },
          (error)=> {
            console.log('error',error);
          },
        )
      }
    },
    created(){
     // this.getInfo()
    }
  }
</script>
<style>
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" type="text/scss" scoped>
  .home{
    display: flex;
    flex-direction: column;
    img{
      margin: 0.5rem auto;/*100px = 1rem*/
      width: 2rem;
      height: 2rem;
    }
    .text{
        text-align: center;
        font-size: 0.36rem;/*750px的设计图中的36px的意思*/
    }
  }
</style>
