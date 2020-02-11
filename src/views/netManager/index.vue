<template>
  <div>
    <div class="filter-container">
      <el-form
        ref="form"
        v-model="form"
        label-position="left"
        :inline="true"
        @submit.native.prevent="()=>{return false}"
      >
        <el-form-item label="校区">
          <el-select v-model="form.campusCode" clearable placeholder="请选择校区">
            <template v-for="item in campus">
              <el-option :key="item.id" :label="item.name" :value="item.id" />
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="大楼：">
          <el-select v-model="form.buildingCode" clearable placeholder="请选择大楼" no-data-text="请先选择校区">
            <template v-for="(item,index) in building">
              <el-option :key="index" :label="item.buildingName" :value="item.buildingCode" />
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="设备名称：">
          <el-input v-model="form.equipName" placeholder="请输入" />
        </el-form-item>
        <el-button v-waves type="primary" icon="el-icon-search" @click="handlerSearch">搜索</el-button>
        <el-button v-waves type="danger" icon="el-icon-delete" @click="BatcdDelete">批量删除</el-button>
        <el-button
          v-waves
          type="primary"
          style="background:#4274B9;border:1px solid #4274B9"
          icon="el-icon-coin"
          @click="handlerExport"
        >下载导入模板</el-button>
        <el-upload
          ref="upload"
          style="display:inline"
          action
          accept=".xls, .xlsx"
          :http-request="handleUpload"
          :limit="1"
          :file-list="fileList"
          :show-file-list="false"
        >
          <el-button
            v-waves
            style="background:#42B983;border:1px solid #42B983"
            type="primary"
            :icon="downloading?'':'el-icon-download'"
            :loading="downloading"
            :disabled="downloading?true:false"
          >{{ downloading?'导入中':'导入' }}</el-button>
        </el-upload>
        <el-button
          v-waves
          type="primary"
          style="background:#429CB9;border:1px solid #429CB9"
          icon="el-icon-upload2"
          @click="handleExport"
        >导出</el-button>
      </el-form>
    </div>
    <div class="tableSty">
      <el-table
        ref="multipleTable"
        v-loading="tableLoading"

        align="center"
        border
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="设备ID" prop="equipId" align="center" />
        <el-table-column
          prop="equipName"
          label="设备名称"
          width="150"
          show-overflow-tooltip
          align="center"
        />
        <el-table-column prop="campusName" label="校区" align="center" />
        <el-table-column prop="buildingName" label="大楼" show-overflow-tooltip align="center" />
        <el-table-column
          prop="roomName"
          label="楼陈"
          width="130"
          show-overflow-tooltip
          align="center"
        />
        <el-table-column label="操作" show-overflow-tooltip width="150" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="danger" @click="singleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination
        background
        :current-page="page+1"
        :page-sizes="[10,20,30,50]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalElements"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <el-dialog
      v-if="innerVisible"
      :close-on-click-modal="closeOnClickModal"
      width="70%"
      title="数据同步"
      :visible.sync="innerVisible"
      append-to-body
    >
      <errorTable :data="errorData" />
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="innerDialog">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import errorTable from '@/components/errorTable'
import { templateXls } from '@/utils/exportData'
import {
  getEquipList,
  getBuilding,
  singleDeleteData,
  BatchDeleteData,
  downloadTemplate,
  download,
  getCampusmsg,
  importData
} from '@/api/netManager'
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
      closeOnClickModal: false,
      innerVisible: false,
      fileList: [],
      multipleSelection: [],
      dialogVisible: false,
      downloading: false,
      campus: [],
      building: [],
      form: {
        campusCode: '',
        buildingCode: '',
        equipName: ''
      },
      tableData: [],
      pageSize: 10, // 每页显示条数
      page: 0, // 当前页
      totalElements: 0,
      tableLoading: true,
      errorData: {}// 导入失败的数据
    }
  },
  watch: {
    'form.campusCode'() {
      this.getApOrSwBuilding()
    }
  },
  mounted() {
    // console.log(this.form,'111111111111')
    this.getCampus()
    this.getApOrSwEquipList()
    // this.getApOrSwBuilding();
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val
      this.getApOrSwEquipList()
    },
    handleCurrentChange(val) {
      this.page = val - 1
      // console.log(val)
      //   console.log(val,'aaaaaa')
      this.getApOrSwEquipList()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
      //  console.log(this.multipleSelection )
    },
    handlerSearch() {
      this.getApOrSwEquipList()
    },
    // 批量删除
    BatcdDelete() {
      var idslist = { ids: [] }
      this.multipleSelection.forEach(item => {
        idslist.ids.push(item.equipId)
      })
      if (idslist.ids.length === 0) {
        this.$message({
          message: '请选择需要删除的数据',
          type: 'warning'
        })
        return
      }
      console.log(idslist)
      this.$confirm(`是否删除${idslist.ids.length}条记录？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(res => {
        BatchDeleteData(
          Object.assign(
            { ids: idslist.ids.join(',') },
            { typeCode: this.configId }
          )
        )
          .then(res => {
            // for (var len = this.tableData.length, i = len - 1; i >= 0; i--) {
            //   for (var j = 0; j < idslist.ids.length; j++) {
            //     if (this.tableData[i].equipId === idslist.ids[j]) {
            //       this.tableData.splice(i, 1);
            //       break;
            //     }
            //   }
            // }
            // console.log(this.tableData,'ssssssssssss')
            this.totalElements = this.totalElements - idslist.ids.length
            this.$message({ message: '删除成功', type: 'success' })
            this.getApOrSwEquipList()
            // }
          })
          .catch(res => {
            this.error.message('删除失败')
          })
      })
    },
    // 删除单条数
    singleDelete(item) {
      console.log(item)
      this.$confirm('是否删除此条记录？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(res => {
        singleDeleteData({ id: item.equipId, typeId: item.equipType })
          .then(res => {
            if (res.data.status) {
              const data = this.tableData
              data.forEach((e, v) => {
                if (e.equipId === item.equipId) {
                  this.tableData.splice(v, 1)
                }
              })
              this.$message({ message: '删除成功', type: 'success' })
            }
          })
          .catch(res => {
            this.$message.error('删除失败')
          })
      })
    },
    handleExport() {
      console.log(this.form)
      download(Object.assign({ typeCode: this.configId }, this.form))
        .then(res => {
          templateXls(res.data, '导出数据')
        })
        .catch(res => {
          this.$message.error('数据导出出错，请稍后再试')
        })
      this.dialogVisible = true
    },

    handlerExport() {
      downloadTemplate(this.configId)
        .then(res => {
          templateXls(res.data, '导入模板')
        })
        .catch(res => {
          this.$message.error('数据导出出错，请稍后再试')
        })
    },
    // handleexceed() {
    //   this.$message.error("aaaaaaa");
    // },
    // 导入
    handleUpload(file) {
      // console.log("sssssss")
      var form = new FormData()
      form.append('file', file.file)
      this.downloading = true
      importData(form, this.configId)
        .then(res => {
          // console.log(res)
          if (res.data.status) {
            if (res.data.data.errorDataList) {
              this.errorData = res.data.data
              this.innerVisible = true
            } else {
              this.$notify({
                title: '成功',
                message: this.configId === 1 ? 'AP' : '交换机' + '数据导入成功',
                type: 'success'
              })
            }
            this.fileList = []
            this.downloading = false
          } else {
            this.downloading = false
            this.$message.error('上传失败(可能是格式错误)')
            this.fileList = []
          }
        })
        .catch(res => {
          this.downloading = false
          this.$message.error('上传失败，请稍后再试')
          this.fileList = []
        })
    },
    // handleChange(file){
    //     console.log(file,"sssssss")
    // },
    // 获取设备列表
    async getApOrSwEquipList() {
      const value = {}
      Object.assign(value, this.form, {
        typeCode: this.configId,
        page: this.page,
        pageSize: this.pageSize
      })
      // console.log(this.form,'aaaaaaaaa')
      // console.log(value, "11111111111");
      this.tableLoading = true
      try {
        var res = await getEquipList(value)
        if (res.data.status) {
          const data = res.data.data
          this.tableData = data.content
          this.totalElements = data.totalElements
          this.tableLoading = false
        }
      } catch (error) {
        this.tableLoading = false
        this.$message.error('获取数据错误')
      }
    },
    // 获得大楼信息
    getApOrSwBuilding() {
      if (!this.form.campusCode) {
        this.building = []
        return
      }
      getBuilding({ campusCode: this.form.campusCode })
        .then(res => {
          if (res.data.status) {
            this.building = res.data.data
          }
        })
        .catch(res => {
          this.$message.error('大楼信息获取失败')
        })
    },
    // 获得校区信息
    getCampus() {
      getCampusmsg()
        .then(res => {
          // console.log(res, "aaaaaaaaaaaaaa");
          if (res.data.status) {
            this.campus = res.data.data
            // console.log(this.campus, "aaaaaa");
          }
        })
        .catch(res => {
          console.log(res)

          this.$message.error('校区信息获取失败')
        })
    },
    innerDialog() {
      this.innerVisible = false
    }
  }
}
</script>
<style scoped>
.filter-container {
  padding: 20px;
}
.pagination-container {
  margin: 0 20px 20px 0;
}
</style>
<style lang="scss" scoped>
  .tableSty{
    margin:0 20px;
    margin-bottom: 15px;
  //  height: 60vh;
  //  overflow: auto;
  }
</style>
