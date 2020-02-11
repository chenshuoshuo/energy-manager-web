<template>
  <div>
    <div class="top">
      <div>
        <span
          class="el-icon-circle-check"
        > &nbsp;&nbsp;网络设备数据同步完成，已成功同步{{ data.sccessCount }}数据，失败{{ data.errorCount }}数据</span>
        <span>失败数据显示如下：</span>
      </div>
      <div>
        <el-button type="success" @click="exportData">导出</el-button>
      </div>
    </div>
    <el-table :data="data.errorDataList" border style="width: 100%">
      <el-table-column align="center" prop="equipId" label="设备id" />
      <el-table-column align="center" prop="equipName" label="设备名称" />
      <el-table-column prop="campusName" align="center" label="校区" />
      <el-table-column prop="buildingName" align="center" label="大楼" />
      <el-table-column prop="gisLeaf" align="center" label="楼层" />
      <el-table-column prop="errMsg" align="center" label="失败原因" />
    </el-table>
  </div>
</template>
<script>
import { exportErrorData } from '@/api/netManager'
import { templateXls } from '@/utils/exportData'
export default {
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },
  mounted() {
    console.log(this.data, '1111111111111')
  },
  methods: {
    // 里面弹框确认事件
    innerDialog() {
      this.innerVisible = false
      this.active = 0
    },
    exportData() {
      // console.log(this.data.errorLogCode)
      exportErrorData({ synId: this.data.synId }).then(res => {
        templateXls(res.data, '错误数据导出')
      })
        .catch(res => {
          this.$message.error('数据导出出错，请稍后再试')
        })
      // this.dialogVisible = true;
    }
  }
}
</script>
<style >
.el-icon-circle-check:before {
  content: "\E639";
  color: #13ce66;
}
</style>
<style lang="scss" scoped>
.top {
  display: flex;
  flex-direction: row;
  font-size: 13px;
  justify-content: space-between;
  align-items: center;
  >div:nth-child(1){
    display: flex;
    flex-direction: column;
    height: 70px;
    justify-content: center;
    > span:nth-child(2) {
        margin-left: 25px;
        margin-top:15px;
  }
  }

}
</style>
