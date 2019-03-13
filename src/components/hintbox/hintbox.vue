<template>
  <div class="hintbox" v-show="show">
    <div class="hintboxBG">
      <div class="hintboxCT">
        <div class="text">{{hintbox}}</div>
        <div class="btn" @click.stop.prevent="clickfunction($event)">确定</div>
      </div>
    </div>
    <div class="background"></div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    data(){
      return{
        show : false
      }
    },
    props: {
      hintbox: {
        default() {
          return '';
        }
      }
    },
    watch:{
      "hintbox": function () {
        console.log("this.hintbox",this.hintbox);
        if(this.hintbox !== ''){
          this.show = true;
        }else{
          this.show = false;
        }
      }
    },
    methods: {
      clickfunction() {
        this.$emit('close', this.hintbox);
        this.show = false;
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" type="text/scss" scoped>
  .hintboxBG {
    position: fixed;
    z-index: 1001;
    top: 4rem;
    left: 50%;
    width: 5.6rem;
    margin-left: -2.8rem;
  }

  .hintboxCT {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
  }

  .hintbox .text, .hintbox .btn {
    position: relative;
    background-color: #fff;
    z-index: 1001;
  }

  .hintbox .text {
    display: flex;
    align-items: center;
    justify-content: center;
    top: 0rem;
    word-break: break-all;
    width: 100%;
    min-height: 1.64rem;
    max-height: 6.5rem;
    overflow-y: scroll;
    padding: 0.2rem;
    color: #353535;
    font-size: 0.32rem;
    line-height: .40rem;
    letter-spacing: 0.01rem;
    box-sizing: border-box;
    border-radius: 0.1rem 0.1rem 0 0;
  }

  .hintbox .btn {
    border-top: 1px solid #e5e5e5;
    width: 100%;
    height: 1rem;
    text-align: center;
    line-height: 1rem;
    font-size: 0.36rem;
    color: #0092da;
    border-radius: 0 0 0.1rem 0.1rem;
  }

  .background {
    z-index: 1000;
  }

  /*vue的过度属性 */
  .hintbox-enter-active, .hintbox-leave-active {
    transition: all .4s;
  }

  .hintbox-enter, .hintbox-leave-to /* .fade-leave-active in below version 2.1.8 */
  {
    opacity: 0;
    /*transform: translate3d(0, 1rem, 0px)*/
  }

  .hintbox-enter, .hintbox-leave-to {
    opacity: 0;
  }


</style>
