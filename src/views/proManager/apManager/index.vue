<template>
  <div>
    <apManager :config-id="1" />
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
      // apInterface: ["华三API对接", "SNMP"],
      // formDocking: {
      //   //对接配置表单
      //   apInterfaceValue: "",
      //   aplistAddress: "",
      //   info: "",
      //   password: ""
      // },
      // rules:{
      //    aplistAddress: {
      //     required: true,
      //     message: "请输入接口地址",
      //     trigger: "blur"
      //   },
      //   info: { required: true, message: "请输入账号", trigger: "blur" },
      //   password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      // }
    }
  },
  methods: {
    // async getApDockingConfig() {
    //   var res = await getDockingConfig();
    //   //console.log(res.data.data,"1111")
    //   res.data.data.forEach(value => {
    //     if (value.dockingCode == 1) {
    //       this.formDocking.apInterfaceValue = value.dockingCode;
    //       value.nomDockingParameters.forEach((item, index) => {
    //         this.formDockvalue.forEach((e, v) => {
    //           if (item.parameterId == e.parameterId) {
    //             this.formDockvalue[v].publicValue = item.publicValue;
    //           }
    //         });
    //       });
    //     }
    //   });
    //   this.formDocking.aplistAddress = this.formDockvalue[0].publicValue;
    //   this.formDocking.info = this.formDockvalue[1].publicValue;
    //   console.log(this.formDockvalue);
    // }
  },
  mounted(){
   // this.getApDockingConfig()
  }
};

</script>
