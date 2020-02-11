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
        <el-form-item label="是否预警：">
          <el-select v-model="form.warn" clearable placeholder="全部">
            <template v-for="(item,index) in isWarn">
              <el-option :key="index" :label="item.label" :value="item.value" />
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="设备名称：">
          <el-input v-model="form.equipName" placeholder="请输入" />
        </el-form-item>
        <el-button v-waves type="primary" icon="el-icon-search" @click="handlerSearch">搜索</el-button>
        <el-button v-waves type="success" icon="el-icon-close-notification" @click="bulkToggleUpdate(true)">开启预警</el-button>
        <el-button v-waves type="danger" icon="el-icon-close-notification" @click="bulkToggleUpdate(false)">关闭预警</el-button>
      </el-form>
    </div>
    <div class="style-table">
      <el-table
        ref="multipleTable"
        v-loading="tableLoading"
        align="center"
        border
        element-loading-text="加载中..."
        :data="tableData"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="设备ID" prop="equipId" align="center" />
        <el-table-column
          prop="equipName"
          label="设备名称"
          show-overflow-tooltip
          align="center"
        />
        <el-table-column prop="campusName" label="校区" align="center" />
        <el-table-column prop="buildingName" label="大楼" show-overflow-tooltip align="center" />
        <el-table-column prop="gisLeaf" label="楼层" width="130" show-overflow-tooltip align="center" />
        <el-table-column label="是否预警" show-overflow-tooltip width="150" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.warn" type="success">已开启</el-tag>
            <el-tag v-else type="danger">已关闭</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" show-overflow-tooltip width="150" align="center">
          <template slot-scope="scope">
            <el-button v-if="scope.row.warn" size="mini" type="danger" @click="toggleWarn(scope.row)">关闭预警</el-button>
            <el-button v-else size="mini" type="success" @click="toggleWarn(scope.row)">开启预警</el-button>
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
  </div>
</template>
<script>
import * as http from '@/api/warnSetting'
import { getEquipList, getBuilding } from '@/api/netManager'
import { getCampusmsg as getCampus } from '@/api/netManager'
export default {
  props: {
    configId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      tableLoading: false,
      isWarn: [
        { label: '是', value: true },
        { label: '否', value: false }
      ],
      campus: [],
      building: [],
      form: {
        campusCode: '',
        buildingCode: '',
        equipName: ''
      },
      tableData: [],
      totalElements: 0,
      pageSize: 10, // 每页显示条数
      page: 0 // 当前页
    }
  },
  watch: {
    'form.campusCode'() {
      this.getApOrSwBuilding()
    }
  },
  mounted() {
    this.getCampus()
    this.getApOrSwEquipList()
  },
  methods: {
    getCampus() {
      getCampus().then(res => {
        if (res.data.status) {
          this.campus = res.data.data
        }
      }).catch(res => {
        this.$message.error('校区信息获取失败')
      })
    },
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
    // 批量
    bulkToggleUpdate(warn) {
      if (this.multipleSelection.length === 0) {
        this.$message.warning('请选择要操作的设备')
        return
      }
      const ids = this.multipleSelection.map(item => item.equipId).join(',')
      http.infoBulkUpdate({ ids, typeCode: this.configId, warn }).then(res => {
        if (res.data.status) {
          this.$message.success('操作成功')
          this.getApOrSwEquipList()
        } else {
          this.$message.success('操作失败')
        }
      })
    },
    // 单个预警
    toggleWarn(row) {
      http.infoUpdate({ typeCode: this.configId, warn: !row.warn, id: row.equipId }).then(res => {
        if (res.data.status) {
          this.$message.success('操作成功')
          this.getApOrSwEquipList()
        } else {
          this.$message.success('操作失败')
        }
      })
    },
    // 搜索
    handlerSearch() {
      this.getApOrSwEquipList()
    },
    // 获取设备列表
    async getApOrSwEquipList() {
      const value = {}
      Object.assign(value, this.form, {
        typeCode: this.configId,
        page: this.page,
        pageSize: this.pageSize
      })
      this.tableLoading = true
      try {
        this.multipleSelection = []
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
    }
  }
}
</script>
<style scoped>
.style-table {
  padding: 20px;
}
.filter-container {
  padding: 20px;
}
</style>
