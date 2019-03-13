<template>
  <div id="app">
    <transition name="enterPage">
      <router-view v-wechat-title='$route.meta.title' ></router-view>
    </transition>
    <v-loading :loading="loading"></v-loading>
    <v-hintbox :hintbox="hintbox" @close="close"></v-hintbox>
    <v-console></v-console>
  </div>
</template>

<script>
  import loading from  '@/components/loading/loading.vue';
  import hintbox from  '@/components/hintbox/hintbox.vue';
  import consoles from '@/components/console/console.vue';
export default {
  name: 'app',
  data(){
    return{
      loading:false,
      hintbox:""
    }
  },
  components: {
    "v-loading" : loading,
    "v-hintbox" : hintbox,
    "v-console" : consoles
  },
  mounted(){
    window.location = window.location.origin + window.location.pathname + window.location.hash;
    window.onpopstate = () => {
      //    这个allowBack 是存在vuex里面的变量
      console.log("this.$store.getters.getAllowBack",this.$store.getters.getAllowBack);
      if (!this.$store.getters.getAllowBack) {
        history.go(1)
      }
    }
  },
  methods:{
    close(text){
      vm.hintbox = "";
    }
  },
  created(){
    window.vm = this;
  }
}
</script>

<style lang="scss" type="text/scss" scoped>
  /*vue的过度属性 */
  .enterPage-enter-active{
    transition: all .4s;
  }
  .enterPage-leave-active{

  }
  .enterPage-enter {
    opacity: 0;
  }
  .enterPage-leave-to{
  }
</style>
