<template>
  <div>
    <div class="console" v-show="console2">
      <p>请输入调试密码</p>
      <p>(公众号管理员使用，用户直接取消)</p>
      <input  type="password"  :value="key"  ref="input" v-on:input="changedata" />
      <div class="button" >
        <p style="color: #999" @click.stop.prevent="cancel()">取消</p>
        <p @click.stop.prevent="confire()">确定</p>
      </div>
    </div>
    <div class="background" v-show="console2" @click.stop.prevent="cancel()" ></div>
  </div>
</template>

<script type="text/ecmascript-6">
   export default {
     data(){
        return{
           key : '',
           console2:false
        }
     },
     props:{

     },
     methods:{
       cancel(){
         this.$emit("console2emit");
         this.console2 = false;
       },
       confire(){
         this.$emit("console2emit");
         this.console2 = false;
         let date = new Date();
         if(this.key === 'celnet'+date.getDate()){
           var vConsole =  new  VConsole();
         }else{
           alert('密码错误')
         }
       },
       changedata() {
         this.key = this.$refs.input.value;
         console.log(this.key);
       }
     },
     created(){
       if(this.$route.query.vue){
         var vConsole =  new  VConsole();
       }
       let that = this;
        //摇一摇
       let shake=4000,
         last_update=0,
         count=0,
         x=0,
         y=0,
         z=0,
         last_x=0,
         last_y=0,
         last_z=0;
       if(window.DeviceMotionEvent){
         window.addEventListener("devicemotion",deviceMotionHandler,false);
       }else{
         //alert("本设备不支持devicemotion事件");
       }
       console.log(new Date().valueOf());
       function deviceMotionHandler(eventData){
         var acceleration = eventData.accelerationIncludingGravity,
           currTime=new Date().valueOf(),
           diffTime=currTime-last_update;

         if(diffTime>100){
           last_update=currTime;
           x=acceleration.x;
           y=acceleration.y;
           z=acceleration.z;
           var speed=Math.abs(x+y+z-last_x-last_y-last_z)/diffTime*10000
           var status=document.getElementById("status");
           if(speed>shake){
             count++;
             that.console2 = true;
           }
           last_x = x;
           last_y = y;
           last_z = z;
         }
       }
     }
   }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .console{
    position: fixed;
    z-index: 20000;
    width: 5rem;
    height: 2.5rem;
    top: 40%;
    left: 50%;
    margin-left: -2.5rem;
    text-align: center;
    background-color: #fff;
    border-radius: 0.2rem;
  }
  .console p{
    color: #0092da;
    font-size: 0.3rem;
    padding-top: 0.2rem;
  }
  .console input{
    border: 1px solid #ccc;
    margin: 0.2rem 0;
  }
  .console .button{
   display: flex;
  }
  .console .button p{
    flex: 1;
  }
  .background{
    z-index: 9999;
  }
</style>
