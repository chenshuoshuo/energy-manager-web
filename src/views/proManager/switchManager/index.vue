<template>
  <div>
    <apManager :config-id="2" />
  </div>
</template>
<script>
</script>
<script>
import apManager from "../index";
export default {
  props:{
    //configName:''
  },
  components: {
    apManager
  },
  data() {
    return {
    }
  },
  methods: {

  },
  mounted(){
   // this.getApDockingConfig()
  }
};

</script>
