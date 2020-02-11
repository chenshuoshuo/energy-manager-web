<template>
  <div>
    <el-container>
      <el-header
        height="100px"
        style="border-top:1px solid #E5E5E5;border-bottom:1px solid #E5E5E5;"
      >
        <div class="header-div" style="margin-top:20px;">
          <el-steps :active="active" finish-status="success">
            <el-step title="选择要同步的专题图分类" />
            <el-step title="关联字段" />
            <el-step title="选择其他需要同步的字段" />
            <el-step title="同步数据" />
          </el-steps>
        </div>
      </el-header>
      <el-container>
        <div style="border-right:2px solid #E5E5E5">
          <el-aside width="200px">
            <div class="content-tree">
              <el-tree
                highlight-current
                default-expand-all
                :props="treeProps"
                :data="treeList"
                @node-click="handleNodeClick"
              />
            </div>
          </el-aside>
        </div>
        <el-main
          v-loading="mainLoading"
          class="main-top"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
        >
          <div v-if="active===0" class="content-main">
            <span>请在左侧选择需要关联同步的专题图分类</span>
          </div>
          <div v-if="active===1" class="content-main-relation">
            <div>
              <span>网络运维-{{ configId===1?'AP':'交换机' }}已有字段：</span>
              <span>选择关联的专题字段</span>
            </div>
            <div v-for="(item,index) in netAttributes" :key="index" class="content-main-select">
              <span>{{ item.columnCnname }}</span>
              <img src="@/assets/proManager/ratetion.png">
              <el-select v-model="netAttributes[index].mappingColumnCnname" clearable placeholder="请选择" @clear="(()=>{clearStatus(index)})">
                <el-option
                  v-for="(e,v) in thematicMap"
                  :key="v"
                  :label="e.description"
                  :value="e.description"
                  @click.native="relationFiled(index,v)"
                />
              </el-select>
            </div>
            <div class="content-main-bottom">
              <el-button class="step-button" type="primary" @click="nextStep">下一步</el-button>
            </div>
          </div>
          <div v-if="active===2" style="margin-left:30px;">
            <el-checkbox
              v-model="checkAll"
              :indeterminate="isIndeterminate"
              @change="handleCheckAllChange"
            >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 全选</el-checkbox>
            <div style="margin: 15px 0;" />
            <el-checkbox-group v-model="syncCheckAll" @change="handleCheckedChange">
              <el-checkbox
                v-for="(item,index) in syncFiled"
                :key="index"
                style="display:block;margin-top:20px;"
                :label="item"
              >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {{ item.description }}</el-checkbox>
            </el-checkbox-group>
            <div class="content-main-bottom">
              <el-button class="step-button" type="primary" @click="otherNextStep">下一步</el-button>
            </div>
          </div>
          <div v-if="active===3" class="content-main-startsync">
            <div>
              <span>共{{ total }}条专题图数据</span>
              <el-button class="step-button" type="primary" @click="startSync">开始同步</el-button>
            </div>
          </div>
        </el-main>
      </el-container>
    </el-container>
    <el-dialog
      v-if="innerVisible"
      width="70%"
      title="数据同步"
      :before-close="innerDialog"
      :visible.sync="innerVisible"
      append-to-body
    >
      <errorTable :data="failSyncData" />
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="innerDialog">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import errorTable from '@/components/errorTable'
import { syncTreeList, getAttributes, getThematicMap, getOtherMsg, saveExtends, getCountAllByTypeCode, synData } from '@/api/proManager'
export default {
  components: {
    errorTable
  },
  props: {
    configId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      treeProps: {
        children: 'childrenTypeList',
        label: function(data, node) {
          return data.typeName
        }
      },
      total: 0,
      innerVisible: false, // 同步内层对话框
      mainLoading: false,
      active: 0,
      selectArray: [], // 字段选择
      syncCheckAll: [], // 同步字段选择
      checkAll: false,
      isIndeterminate: false,
      failSyncData: {
        sccessCount: 0,
        errorCount: 0
      },
      otherFiledData: [],
      syncFiled: [
      ],
      netAttributes: [], // 网络运维
      thematicMap: [], // 专题图
      treeList: [],
      typeCode: ''// 二级列表 当前typecode
    }
  },
  mounted() {
    this.getSyncTreeList()
    // var that = this;
    // setTimeout(() => {
    //   that.loading = false;
    // }, 2000);
  },
  methods: {
    async handleNodeClick(data) {
      console.log(data)
      if (!(data.childrenTypeList instanceof Array)) {
        this.mainLoading = true
        this.typeCode = data.typeCode
        try {
          // 获取同步数据网络运维字段
          this.netAttributes = (await getAttributes(this.configId)).data.data
          console.log(this.netAttributes, 'this.netAttributes')
          // 获取同步数据专题图字段
          // this.netAttributes.length=3
          this.thematicMap = (await getThematicMap(data.typeCode)).data.data
          // console.log(this.thematicMap,'this.thematicMap')
          this.mainLoading = false
          this.active = 1
        } catch (error) {
          this.mainLoading = false
          this.$message.error(error)
        }
      }
      // var that = this;
      // if (!data.children) {
      //   that.loading = true;
      //   setTimeout(() => {
      //     that.loading = false;
      //     that.active = 1;
      //   }, 2000);
      // }
    },
    async nextStep() {
    // this.active = this.active + 1
      this.mainLoading = true
      try {
        await saveExtends(this.netAttributes)
        const res = await getOtherMsg({ nomTypeCode: this.configId, thematicTypeCode: this.typeCode })
        this.syncFiled = res.data.data
        this.active = this.active + 1
        this.mainLoading = false
        this.$message({
          message: '保存成功',
          type: 'success'
        })
      } catch (error) {
        this.mainLoading = false
        this.$message.error('请求错误')
      }
    },
    otherNextStep() {
      this.mainLoading = true
      this.syncCheckAll.forEach((item, index) => {
        this.otherFiledData.push({
          columnId: item.columnid ? item.columnid : null,
          typeId: this.configId,
          columnName: item.attname ? item.attname : null,
          columnCnname: item.description ? item.description : null,
          // columnType:item.type?item.type:null,
          columnType: null,
          required: false,
          show: true,
          preset: false,
          mappingColumnId: item.columnid ? item.columnid : null,
          mappingColumnName: item.attname ? item.attname : null,
          mappingColumnCnname: item.description ? item.description : null,
          orderid: null,
          memo: null
        })
      })
      saveExtends(this.otherFiledData).then(res => {
        this.mainLoading = false
        this.$message({
          message: '保存成功',
          type: 'success'
        })
        getCountAllByTypeCode({ typeCode: this.typeCode }).then(res => {
          if (res.data.status) {
            this.total = res.data.data
            this.active++
          }
        })
      }).catch(error => {
        console.log(error)
        this.mainLoading = false
        this.$message.error('请求错误')
      })
    },
    // 同步字段多选框
    handleCheckAllChange(val) {
      this.syncCheckAll = val ? this.syncFiled : []
      this.isIndeterminate = false
      console.log(this.syncCheckAll)
    },
    handleCheckedChange(value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.syncFiled.length
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.syncCheckAll.length
      console.log(this.syncCheckAll)
    },
    startSync() {
      const loading = this.$loading({
        lock: true,
        text: '同步中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      synData({ nomTypeCode: this.configId, thematicTypeCode: this.typeCode }).then(res => {
        if (res.data.status) {
          loading.close()
          this.innerVisible = true
          this.active = 3
          this.failSyncData.sccessCount = res.data.data.success_count
          this.failSyncData.errorCount = res.data.data.error_count
          this.$set(this.failSyncData, 'synId', res.data.data.syn_id)
        }
      })
    },
    // 里面弹框确认事件
    innerDialog() {
      this.innerVisible = false
      this.active = 0
    },
    // 获取数据同步二级列表
    getSyncTreeList() {
      syncTreeList()
        .then(res => {
          this.treeList = res.data.data
          // console.log(this.treeList,'11111111111')
        })
        .catch(res => {
          this.$message.error('获取列表失败')
        })
    },
    relationFiled(netIndex, thMapIndex) {
      // console.log(netIndex,'AAA')
      // console.log(thMapIndex,'BBBB')
      this.thematicMap[thMapIndex].columnid ? this.netAttributes[netIndex].mappingColumnId = this.thematicMap[thMapIndex].columnid : ''
      this.netAttributes[netIndex].mappingColumnName = this.thematicMap[thMapIndex].attname
      this.netAttributes[netIndex].mappingColumnCnname = this.thematicMap[thMapIndex].description
      console.log(this.netAttributes)
    },
    // 清空下拉列表
    clearStatus(index) {
      console.log(index)
      this.netAttributes[index].mappingColumnId = null
      this.netAttributes[index].mappingColumnName = null
      this.netAttributes[index].mappingColumnCnname = null
    }
    // 获取同步数据网络运维字段
    // getOpAttributes() {
    //   this.mainLoading = true;
    //   getAttributes(this.configId).then(res => {
    //     this.netAttributes = res.data.data;
    //     console.log(this.netAttributes, "this.netAttributes");
    //   });
    // },
    // 获取同步数据专题图数据
    // getOpAttributes(typeCode) {
    //   getThematicMap(typeCode).then(res => {
    //     this.thematicMap = res.data.data;
    //     console.log(this.thematicMap, "this.thematicMap");
    //   });
    // }
  }
}
</script>
<style>
.el-step__title {
  font-size: 15px;
  /* border-bottom:1px solid  */
}
.el-tree-node:focus > .el-tree-node__content span:nth-child(2) {
  color: #40b6ff;
}
.el-icon-circle-check:before {
  content: "\E639";
  color: #13ce66;
}
</style>
<style lang="scss" scoped >
.main-top{
  max-height: 400px;
  overflow:auto;
}
.content-main {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  min-height: 100px;
  > span {
    color: #409fff;
    font-size: 16px;
  }
}
.content-main-relation {
  width: 450px;
  > div:nth-child(1) {
    min-width: 450px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    > span {
      font-weight: 600;
    }
  }
  .content-main-select {
    margin-top: 15px;
    min-width: 450px;
    margin-left: 30px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    > span {
      font-size: 14px;
      display: inline-block;
      width: 150px;
      text-align: left;
    }
    img {
      width: 22px;
      height: 22px;
      transform: rotateZ(45deg);
    }
  }
}
.content-main-bottom {
  position: absolute;
  right: 40px;
  bottom: 25px;
}
.content-main-startsync {
  height: 100%;
  > div {
    min-height: 100px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    span {
      margin-bottom: 20px;
      font-size: 13px;
    }
  }
}
</style>
