<template>
  <!-- <apManager :configId="1">

  </apManager>-->
  <div class="apManager">
    <div class="apSetting">
      <div>
        <h1>{{ configId===1?'AP':'交换机' }}</h1>
        <div>
          <el-row>
            <el-button type="success" @click="dialogFormVisible=true">字段配置</el-button>
            <el-button type="warning" @click="dialogDataSync=true">数据同步</el-button>
          </el-row>
        </div>
      </div>
      <el-button type="primary" @click="submit">提交</el-button>
    </div>
    <div class="baseSet">
      <h3>基础配置</h3>
      <div class="demo-input-suffix">
        <span>名称：</span>
        <el-input v-model="formInline.configName" placeholder="配置名称" />
      </div>
      <div class="grid-imgs">
        <span>默认图标：</span>
        <template v-for="(item,index) in defaultIcon">
          <div :key="item+index">
            <div class="imgIcon" @click="imgIndex=index">
              <el-upload
                :action="upload"
                list-type="picture-card"
                :file-list="imageArray[index][0].url?imageArray[index]:[]"
                :limit="count"
                :on-success="handleSuccess"
                :before-upload="beforeAvatarUpload"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove"
                :on-exceed="handleExceed"
              >
                <i class="el-icon-plus" />
              </el-upload>
              <div class="format">
                <span>{{ item.icon }}</span>
                <span>{{ item.size }}</span>
                <span>{{ item.format }}</span>
              </div>
            </div>
          </div>
        </template>
      </div>
      <div class="grid-imgs">
        <span>动态图标：</span>
        <template v-for="(item,index) in dynamicIcon">
          <div :key="item+index">
            <div class="imgIcon" @click="imgIndex=(index+2)">
              <el-upload
                :action="upload"
                list-type="picture-card"
                :file-list="imageArray[index+2][0].url?imageArray[index+2]:[]"
                :limit="count"
                :on-success="handleSuccess"
                :before-upload="beforeAvatarUpload"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove"
                :on-exceed="handleExceed"
              >
                <i class="el-icon-plus" />
              </el-upload>
              <div class="format">
                <span>{{ item.icon }}</span>
                <span>{{ item.size }}</span>
                <span>{{ item.format }}</span>
              </div>
            </div>
          </div>
        </template>
      </div>
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt>
      </el-dialog>
    </div>
    <el-form
      v-if="configId===1"
      ref="formDocking"
      :inline="true"
      :rules="rules"
      :model="formDocking"
      class="demo-form-inline"
      @submit.native.prevent="()=>{return false}"
    >
      <div class="baseSet">
        <h3>对接配置</h3>
        <el-form-item label="AP对接：">
          <el-select v-model="formDocking.apInterfaceValue" placeholder="请选择AP对接">
            <template v-for="(item,index) in apInterface">
              <el-option :key="item" :label="item" :value="index+1" />
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="AP列表接口地址：" prop="aplistAddress">
          <el-input v-model="formDocking.aplistAddress" placeholder="请输入AP列表接口地址" />
        </el-form-item>
        <el-form-item label="账号：" prop="info">
          <el-input v-model="formDocking.info" placeholder="请输入账号" />
        </el-form-item>
        <el-form-item label="密码：" prop="password">
          <el-input v-model="formDocking.password" type="password" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item />
      </div>
    </el-form>
    <el-form
      v-if="configId===2"
      ref="formDocking"
      :inline="true"
      :rules="rules"
      :model="formDocking"
      class="demo-form-inline"
      @submit.native.prevent="()=>{return false}"
    >
      <div class="baseSet">
        <h3>对接配置</h3>
        <el-form-item label="AP对接：">
          <el-select v-model="formDocking.apInterfaceValue" placeholder="请选择AP对接">
            <template v-for="(item,index) in apInterface">
              <el-option :key="item" :label="item" :value="index+1" />
            </template>
          </el-select>
        </el-form-item>
        <el-form-item />
      </div>
    </el-form>

    <el-form
      ref="formInline"
      :inline="true"
      :rules="rules"
      :model="formInline"
      class="demo-form-inline"
      @submit.native.prevent="()=>{return false}"
    >
      <div class="baseSet">
        <h3>规则配置</h3>
        <el-form-item label="AP状态更新显示频率：" prop="displayRefresh">
          <el-input
            v-model="formInline.displayRefresh"
            type="tel"
            maxlength="10"
            placeholder="大于或等于0的整数数字"
          >
            <template slot="append">分钟</template>
          </el-input>
        </el-form-item>
        <el-form-item label="AP预警允许网络断开时长：" prop="warnDeadline">
          <el-input
            v-model="formInline.warnDeadline"
            type="tel"
            maxlength="10"
            placeholder="大于或等于0的整数数字"
          >
            <template slot="append">分钟</template>
          </el-input>
        </el-form-item>
        <el-form-item label="AP疑似故障预警允许无设备连接时长：" prop="suspectedDuration">
          <el-input
            v-model="formInline.suspectedDuration"
            maxlength="10"
            type="tel"
            placeholder="大于或等于0的整数数字"
          >
            <template slot="append">分钟</template>
          </el-input>
        </el-form-item>
      </div>
      <div class="baseSet">
        <h3>预警统计分析配置</h3>
        <el-form-item label="AP预警统计设备排行显示数量：" prop="deviceDisplay">
          <el-input
            v-model="formInline.deviceDisplay"
            style="width:300px"
            maxlength="10"
            type="tel"
            placeholder="请输入大于或等于0的整数数字"
          />
        </el-form-item>
        <el-form-item label="AP预警统计大楼排行显示数量：" prop="buildingDisplay">
          <el-input
            v-model="formInline.buildingDisplay"
            type="tel"
            style="width:300px"
            maxlength="10"
            placeholder="请输入大于或等于0的整数数字"
          />
        </el-form-item>
      </div>
    </el-form>
    <el-dialog
      v-if="dialogFormVisible"
      :close-on-click-modal="closeOnClickModal"
      title="字段配置"
      width="80%"
      style="min-width:600px;"
      :before-close="handleClose"
      :visible.sync="dialogFormVisible"
    >
      <filedConfig :visible.sync="dialogFormVisible" :config-id="configId" />
    </el-dialog>
    <el-dialog
      v-if="dialogDataSync"
      :close-on-click-modal="closeOnClickModal"
      title="数据同步"
      width="90%"
      style="min-width:600px;"
      :before-close="handleClose"
      :visible.sync="dialogDataSync"
    >
      <dataSync :config-id="configId" />
    </el-dialog>
  </div>
</template>
<script>
</script>
<script>
import filedConfig from "./filedConfig";
import dataSync from "./dataSync";
import {
  getFieldConfig,
  upload,
  saveProCongig,
  getDockingConfig,
  saveDockingConfig
} from "@/api/proManager";
export default {
  props: {
    configId: {
      type:Number,
      required: true
    }
  },
  components: {
    filedConfig,
    dataSync
  },
  data() {
    var checkapStatus = (rule, value, callback) => {
      if (!value || value < 0 || parseInt(value) != value) {
        callback(new Error("只能输入大于0的整数"));
      } else callback();
    };
    return {
      upload: `${window.g.BASE_IPS}/nom/config/upload`,
      closeOnClickModal: false,
      //closeFlag:false,//向子组件传递关闭弹框事件，
      dialogFormVisible: false,
      dialogDataSync: false,
      count: 1,

      imgIndex: "", //选择图片 对应的index
      defaultIcon: [
        {
          icon: "二维图标",
          size: "建议尺寸：40*40px，大小不超过200k",
          format: "支持：png、jpg、gif"
          // fileList: []
        },
        {
          icon: "三维图标",
          size: "建议尺寸：40*40px，大小不超过200k",
          format: "支持：png、jpg、gif"
          //fileList: []
        }
      ],
      dynamicIcon: [
        {
          icon: "三维图标",
          size: "建议尺寸：40*40px，大小不超过200k",
          format: "支持：png、jpg、gif"
          // fileList: []
        },
        {
          icon: "三维图标",
          size: "建议尺寸：40*40px，大小不超过200k",
          format: "支持：png、jpg、gif"
          //  fileList: []
        }
      ],
      dialogImageUrl: "", //图片地址
      dialogVisible: false,
      imageArray: [[{ url: "" }], [{ url: "" }], [{ url: "" }], [{ url: "" }]], //图片数组
      formDocking: {
        //对接配置表单
        apInterfaceValue: "",
        aplistAddress: "",
        info: "",
        password: ""
      },
      apInterface: ["华三API对接", "SNMP"],
      formInline: {}, //ap配置管理
      //apInterfaceValue: 1, //华三orsnmp  value
      //ap对接配置
      formDockvalue: [
        { parameterId: 1, publicValue: "" },
        { parameterId: 2, publicValue: "" },
        { parameterId: 3, publicValue: "" }
      ],
      rules: {
        aplistAddress: {
          required: true,
          message: "请输入接口地址",
          trigger: "blur"
        },
        info: { required: true, message: "请输入账号", trigger: "blur" },
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        displayRefresh: [{ validator: checkapStatus, trigger: "blur" }],
        warnDeadline: [{ validator: checkapStatus, trigger: "blur" }],
        deviceDisplay: [{ validator: checkapStatus, trigger: "blur" }],
        buildingDisplay: [{ validator: checkapStatus, trigger: "blur" }],
        suspectedDuration: [{ validator: checkapStatus, trigger: "blur" }]
      }
    };
  },
  methods: {
    handleSuccess(res, file) {
      // this.imageArray.push(file.url);
      // console.log(res)
      // console.log(file)
      console.log(file, "成功");
      //this.imageUrl = URL.createObjectURL(file.raw)
      let fd = new FormData();
      fd.append("file", file.raw);
      console.log(fd.get("file"), "文件类型");
      upload(fd).then(res => {
        console.log(res);
        if (res.data.status) {
          //this.defaultIcon[0].fileList
          //this.imageArray[this.imgIndex]= window.$cmvcs.base_url + res.data.data
          this.imageArray[this.imgIndex][0].url = window.g.BASE_IPS + res.data.data.data;
          console.log(this.imageArray);
        }
      });
      // this.$message({
      //     message: '上传成功',
      //     type: 'success'
      //   });
    },
    handleRemove(file, fileList) {
      // console.log(file, fileList);
      this.imageArray[this.imgIndex][0].url = "";
      //this.imageArray.indexOf(file.url) === -1? "": this.imageArray.splice(this.imageArray.indexOf(file.url), 1);
      console.log(this.imageArray, "删除");
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
      console.log(file);
    },
    handleExceed() {
      this.$message.error("只能上传1个");
    },
    beforeAvatarUpload(file) {
      const isJPG =
        file.type === "image/png" ||
        file.type === "image/jpg" ||
        file.type === "image/gif";
      //'image/jpeg';
      const isLt2M = (file.size / 1024 / 1024) * 1000 < 200;
      // console.log(isJPG,isLt2M)
      // console.log(file.type )
      // console.log(file.size / 1024 / 1024 /1000)
      if (!isJPG) {
        this.$message.error("图片只能是 JPG/PNG/GIF 格式!");
      }
      if (!isLt2M) {
        this.$message.error("图片大小不能超过最大限制!");
      }
      return isJPG && isLt2M;
    },
    // defaultIndex(index){

    // },
    //为表单添加图片url
    addformline() {
      this.formInline.defaultVectorIcon = this.imageArray[0][0].url;
      this.formInline.defaultRasterIcon = this.imageArray[1][0].url;
      this.formInline.dynamicVectorIcon = this.imageArray[2][0].url;
      this.formInline.dynamicRasterIcon = this.imageArray[3][0].url;
      this.formInline.dockingCode = this.formDocking.apInterfaceValue;
    },
    submit() {
      this.addformline();

      this.$refs.formInline.validate(val => {
        //提交submit
        if (val) {
          this.$refs.formDocking.validate(async data => {
            if (data) {
              this.formDockvalue[0].publicValue = this.formDocking.aplistAddress;
              this.formDockvalue[1].publicValue = this.formDocking.info;
              this.formDockvalue[2].publicValue = this.formDocking.password;
              //console.log(this.formDockvalue);
              const loading = this.$loading({
                lock: true,
                text: "提交中",
                spinner: "el-icon-loading",
                background: "rgba(0, 0, 0, 0.7)"
              });
              console.log(this.formInline, "formInline");
              try {
                let res = await saveDockingConfig(this.formDockvalue);
                console.log(res, "res");
                let data = await saveProCongig(this.formInline);
                console.log(data, "data");
                loading.close();
                this.$message({
                  type: "success",
                  message: "修改成功"
                });
              } catch (err) {
                loading.close();
                this.$message.error("提交失败");
              }
            }
          });
        }
      });
    },
    handleClose(done) {
      done();
      // var that = this
      // this.$confirm('确认关闭？')
      //   .then(_ => {
      //     that.closeFlag=!that.closeFlag
      //     done();
      //   })
      //   .catch(_ => {});
    },
    async getApFieldConfig() {
      var res = await getFieldConfig(this.configId);
      console.log(res);
      if (res.data.status) {
        this.formInline = res.data.data;
        console.log(this.imageArray, "ssssss");
        this.imageArray[0][0].url = this.formInline.defaultVectorIcon;
        this.imageArray[1][0].url = this.formInline.defaultRasterIcon;
        this.imageArray[2][0].url = this.formInline.dynamicVectorIcon;
        this.imageArray[3][0].url = this.formInline.dynamicRasterIcon;
      }
    }, //获取对接配置
    async getApDockingConfig() {
      try {
        var res = await getDockingConfig();
        //console.log(res.data.data,"1111")
        if (res.data.status) {
          res.data.data.forEach(value => {
            if (value.dockingCode == this.configId) {
              this.formDocking.apInterfaceValue = value.dockingCode;
              value.nomDockingParameters.forEach((item, index) => {
                this.formDockvalue.forEach((e, v) => {
                  if (item.parameterId == e.parameterId) {
                    this.formDockvalue[v].publicValue = item.publicValue;
                  }
                });
              });
            }
          });
        }
        this.formDocking.aplistAddress = this.formDockvalue[0].publicValue;
        this.formDocking.info = this.formDockvalue[1].publicValue;
        console.log(this.formDockvalue);
      } catch {
        this.$message.error("配置获取失败")
      }
    }
  },

  mounted() {
    this.getApFieldConfig();
    this.getApDockingConfig();
  }
};
</script>
<style>
.el-upload--picture-card {
  width: 100px;
  height: 100px;
  line-height: 100px;
}
.el-upload-list--picture-card .el-upload-list__item {
  width: 100px;
  height: 100px;
}
</style>
<style lang="scss" scoped src='./style.scss'>
</style>
