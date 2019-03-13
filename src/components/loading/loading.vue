<template>
    <div class="loading" v-show="loading">
      <div class="gifBG">
        <img src="./loading.gif">
      </div>
      <div class="background"></div>
    </div>
</template>

<script type="text/ecmascript-6">
export default {
  props:{
     loading : {
       default(){
         return false;
       }
     }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .loading{
    transition: all 0.4s;
  }
  .loading .gifBG{
    position: fixed;
    z-index: 901;
    top: 50%;
    left: 50%;
    width: 2rem;
    height: 2rem;
    margin-top: -1rem;
    margin-left: -1rem;
    background-color: rgba(0,0,0,0.5);
    border-radius: 0.1rem;
  }
  .loading img{
    margin: 0.34rem;
    width: 1.3rem;
  }
  .loading .background{
     z-index: 900;
  }
  /*vue的过度属性 */
  .background-enter-active,.background-leave-active{
    transition: all .4s;
  }
  .background-enter, .background-leave-to /* .fade-leave-active in below version 2.1.8 */ {
    opacity: 0;
    /*transform: translate3d(0, 1rem, 0px)*/
  }
  .background-enter, .background-leave-to{
    opacity: 0;
  }
  @media screen and (min-width:600px){
    .loading .gifBG{
      width: 200px;
      height: 200px;
      margin-top: -100px;
      margin-left: -100px;
      border-radius: 10px;
    }
    .loading img{
      margin: 34px;
      width: 130px;
    }
  }
</style>
