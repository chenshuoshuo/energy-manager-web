<template>
  <div>
    <div class="filter-container">
      <el-form
        :form="listQuery"
        label-position="left"
        :inline="true"
        @submit.native.prevent="()=>{return false}"
      >
        <el-form-item label="校区">
          <el-select v-model="listQuery.campusCode" clearable placeholder="请选择校区">
            <template v-for="item in campus">
              <el-option :key="item.id" :label="item.name" :value="item.id" />
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="大楼：">
          <el-select v-model="listQuery.buildingCode" clearable placeholder="请选择大楼" no-data-text="请先选择校区">
            <template v-for="(item,index) in building">
              <el-option :key="index" :label="item.buildingName" :value="item.buildingCode" />
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="设备名称：">
          <el-input v-model.trim="listQuery.equipName" maxlength="20" placeholder="请输入设备名称" />
        </el-form-item>
        <el-form-item label="选择时段:">
          <el-date-picker
            v-model="time"
            :clearable="false"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-button v-waves type="primary" icon="el-icon-search" @click="handlerSearch">搜索</el-button>
        <el-button v-waves type="danger" icon="el-icon-delete" @click="handlerBulkDelete">批量删除</el-button>
        <el-button
          v-waves
          :loading="downloading"
          style="background:#429CB9;border:1px solid #429CB9"
          type="success"
          icon="el-icon-upload2"
          @click="handlerExport"
        >
          导出
        </el-button>
      </el-form>
    </div>
    <div class="style-table">
      <el-table
        ref="multipleTable"
        v-loading="listLoading"
        align="center"
        border
        :data="list"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="设备ID" prop="equipId" width="100" align="center" />
        <el-table-column
          prop="equipName"
          label="设备名称"
          width="150"
          show-overflow-tooltip
          align="center"
        />
        <el-table-column prop="campusName" label="校区" align="center" />
        <el-table-column prop="buildingName" label="大楼" show-overflow-tooltip align="center" />
        <el-table-column prop="gisLeaf" label="楼层" width="130" show-overflow-tooltip align="center">
          <template slot-scope="{ row }">
            {{ typeof row.gisLeaf === 'number' ? `${row.gisLeaf}F` : '——' }}
          </template>
        </el-table-column>
        <el-table-column prop="warnData" label="预警时间" show-overflow-tooltip align="center">
          <template slot-scope="{ row }">
            {{ row.startTime | parseTime }}
          </template>
        </el-table-column>
        <el-table-column label="操作" show-overflow-tooltip width="150" align="center">
          <template slot-scope="{ row }">
            <el-button size="mini" type="danger" @click="handlerDelete(row.warningId)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination
        background
        :current-page="listQuery.page"
        :page-sizes="[10,20,30, 50]"
        :page-size="listQuery.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>
<script>
import * as http from '@/api/warnRecord'
import { getCampusmsg as getCampus, getBuilding } from '@/api/netManager'
import { parseTime } from '@/utils'
import { templateXls } from '@/utils/exportData'
export default {
  props: {
    typeCode: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      total: 0,
      downloading: false,
      listLoading: false,
      list: [],
      selection: [],
      listQuery: {
        page: 1,
        pageSize: 10,
        equipName: '',
        campusCode: '',
        building: '',
        startTime: '',
        endTime: ''
      },
      time: [],
      campus: [],
      building: []
    }
  },
  watch: {
    'listQuery.campusCode'() {
      this.getApOrSwBuilding()
    }
  },
  beforeMount() {
    this.getCampus()
    this.queryPage()
  },
  methods: {
    handleSelectionChange(val) {
      this.selection = val
    },
    handleSizeChange(size) {
      this.listQuery.pageSize = size
      this.queryPage()
    },
    handleCurrentChange(page) {
      this.listQuery.page = page
      this.queryPage()
    },
    handlerSearch() {
      this.queryPage()
    },
    handlerBulkDelete() {
      if (this.selection.length === 0) {
        this.$message.warning('请选择要删除的数据')
        return
      }
      this.$confirm(`是否删除这${this.selection.length}条记录？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(res => {
        const ids = this.selection.map(item => item.warningId).join(',')
        http.bulkDeleteWarnRecord({ ids }).then(res => {
          if (res.data.status) {
            this.$message.success('删除成功')
            this.queryPage()
          } else {
            this.$message.error('删除失败')
          }
        })
      })
    },
    handlerExport() {
      this.downloading = true
      const query = { typeCode: this.typeCode }
      if (this.time.length) {
        this.listQuery.startTime = parseTime(this.time[0])
        this.listQuery.endTime = parseTime(this.time[1])
      }
      Object.keys(this.listQuery).forEach(key => {
        if (this.listQuery[key]) {
          query[key] = this.listQuery[key]
        }
      })
      query.page = undefined
      query.pageSize = undefined
      http.downloadWarnRecord(query).then(res => {
        const name = this.typeCode === 1 ? 'AP预警记录' : '交换机预警记录'
        templateXls(res.data, `${name}${parseTime(new Date(), `{y}{m}{d}{h}{i}{s}`)}`)
        this.downloading = false
      })
    },
    handlerDelete(id) {
      this.$confirm('是否删除此条记录？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(res => {
        http.deleteWarnRecord({ id }).then(res => {
          if (res.data.status) {
            this.$message.success('删除成功')
            this.queryPage()
          } else {
            this.$message.error('删除失败')
          }
        })
      })
    },
    queryPage() {
      this.listLoading = true
      const query = { typeCode: this.typeCode }
      if (this.time.length) {
        this.listQuery.startTime = parseTime(this.time[0])
        this.listQuery.endTime = parseTime(this.time[1])
      }
      Object.keys(this.listQuery).forEach(key => {
        if (this.listQuery[key]) {
          query[key] = this.listQuery[key]
        }
      })
      query.page--
      http.getWarnPage(query).then(res => {
        this.listLoading = false
        if (res.data.status) {
          this.list = res.data.data.content
          this.total = res.data.data.totalElements
        } else {
          this.$message.error('接口错误')
        }
      })
    },
    getCampus() {
      getCampus().then(res => {
        if (res.data.status) {
          this.campus = res.data.data
        }
      }).catch(res => {
        this.$message.error('校区信息获取失败')
      })
    },
    // 获得大楼信息
    getApOrSwBuilding() {
      if (!this.listQuery.campusCode) {
        this.building = []
        return
      }
      getBuilding({ campusCode: this.listQuery.campusCode })
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
.style-table{
  padding:20px;
}
.filter-container {
  padding: 20px;
}
</style>
