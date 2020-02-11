<template>
  <div class="config-top">
    <div class="dialog-top">
      <div>
        <span>字段名中文建议不超过6个字，最多12个字</span>
      </div>
      <el-button type="primary" @click="sumbit">提交</el-button>
    </div>
    <el-row :span="24" :gutter="20" class="content-title">
      <el-col :span="6">
        <span>字段中文名</span>
      </el-col>
      <el-col :span="6">
        <span>字段类型</span>
      </el-col>
      <el-col :span="3">
        <span>排序序号</span>
      </el-col>
      <el-col :span="4">
        <span>必填</span>
      </el-col>
      <el-col :span="5">
        <span>显示</span>
      </el-col>
    </el-row>
    <el-form ref="form" v-loading="formLoading" class="content-form" :model="form">
      <div v-for="(item,index) in form.formItem" :key="index">
        <el-row :span="24" :gutter="20">
          <el-col :span="6">
            <el-form-item
              :prop="'formItem.' + index + '.columnCnname'"
              :rules="{required: true, message: '字段中文名不能为空', trigger: 'blur'}"
            >
              <el-input
                v-model="form.formItem[index].columnCnname"
                maxlength="12"
                :disabled="item.preset?true:false"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item
              :prop="'formItem.' + index + '.columnType'"
              :rules="{required: true, message: '请选择活动区域', trigger: 'change'}"
            >
              <el-select v-model="form.formItem[index].columnType" placeholder="请选择活动区域">
                <template v-for="(label,key) in activeInput">
                  <el-option :key="key" :label="label" :value="key" />
                </template>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item
              :prop="'formItem.' + index + '.orderId'"
              :rules="{required: true, message: '排序序号不能为空', trigger: 'blur'}"
            >
              <el-input v-model="form.formItem[index].orderId" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item
              :prop="'formItem.' + index + '.required'"
              :rules="{required: true, message: '请选择必填选项', trigger: 'change'}"
            >
              <el-radio-group v-model="form.formItem[index].required" size="medium">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item
              :prop="'formItem.' + index + '.show'"
              :rules="{required: true, message: '请选择显示选项', trigger: 'change'}"
            >
              <el-radio-group v-model="form.formItem[index].show" size="medium">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
              <el-button
                v-if="index === form.formItem.length-1"
                class="add-reduce"
                type="primary"
                icon="el-icon-plus"
                size="mini"
                circle
                @click.prevent="addFormItem(item)"
              />
              <el-button
                v-if="!item.preset"
                class="add-reduce"
                type="danger"
                icon="el-icon-minus"
                size="mini"
                circle
                @click.prevent="removeFormItem(item,index)"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>
  </div>
</template>
<script>
import { fieldData, saveExtends } from '@/api/proManager'
export default {
  props: {
    configId: {
      type: Number,
      required: true
    },
    visible: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      activeInput: ['文本', '日期', '富文本', '整数'],
      form: {
        formItem: []
      },
      formLoading: true
      // dialogFormVisible:false
    }
  },
  watch: {
    // closeFlag(){
    //  console.log("aaa")
    //  this.$refs.form.resetFields();
    // }
  },
  mounted() {
    // console.log(this.visible,'aaa')
    this.getfieldData()
    // this.addFormItem()
    // this.addFormItem()
    // this.addFormItem()
  },

  methods: {
    addFormItem() {
      this.form.formItem.push({
        columnId: null,
        typeId: null,
        columnName: null,
        columnCnname: null,
        columnType: null,
        required: null,
        show: true,
        preset: false,
        mappingColumnId: null,
        mappingColumnName: null,
        mappingColumnCnname: null,
        orderId: null,
        memo: null
      })
    },
    removeFormItem(item, index) {
      this.form.formItem.splice(index, 1)
    },
    sumbit() {
      // console.log(this.form.formItem)
      this.$refs.form.validate(value => {
        if (value) {
          const loading = this.$loading({
            lock: true,
            text: '提交中',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          })
          saveExtends(this.form.formItem)
            .then(res => {
              loading.close()
              this.$message({ message: '提交成功', type: 'success' })
              this.$emit('update:visible', false)
            })
            .catch(res => {
              loading.close()
              this.$message.error('提交失败')
            })
        }
      })
    },
    // 排序
    arraySort(arr) {
      return (obj1, obj2) => {
        return obj2[arr] - obj1[arr]
      }
    },
    // 获得字段配置信息
    getfieldData() {
      console.log(this.configId)
      fieldData(this.configId).then(res => {
        this.form.formItem = res.data.data
        this.form.formItem.sort(this.arraySort('preset'))
        this.formLoading = false
        // console.log(this.form.formItem, "this.form.formItem");
      }).catch(res => {
        this.formLoading = false
        this.$message.error('数据加载失败')
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.dialog-top {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 50px;
  background: #f9f9f9;
  border-radius: 5px;
  justify-content: space-between;
  padding: 20px;
  div {
    font-size: 12px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    height: 23px;
    width: 260px;
    background: #ede2c7;
    color: #f98d00;
  }
}
.content-title {
  margin-top: 20px;
  span {
    font-weight: 600;
  }
}
.content-form {
  margin-top: 20px;
}
.add-reduce {
  margin-left: 10px;
}
</style>
