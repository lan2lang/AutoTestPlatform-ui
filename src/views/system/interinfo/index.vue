<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="接口名称" prop="interName">
        <el-input
          v-model="queryParams.interName"
          placeholder="请输入接口名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="接口地址" prop="interUrl">
        <el-input
          v-model="queryParams.interUrl"
          placeholder="请输入接口地址"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="请求方法" prop="method">
        <el-select v-model="queryParams.method" placeholder="请选择请求方法">
          <el-option v-for="(item, index) in methodOptions" :key="index" :label="item.label"
                     :value="item.value" :disabled="item.disabled"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:interinfo:add']"
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:interinfo:edit']"
        >修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:interinfo:remove']"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:interinfo:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="interinfoList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column type="index" label="序号" align="center"/>
      <el-table-column label="接口名称" align="center" prop="interName"/>
      <el-table-column label="接口地址" align="center" prop="interUrl"/>
      <el-table-column label="请求方法" align="center" prop="method"/>
      <el-table-column label="参数类型" align="center" prop="paramType"/>
      <el-table-column label="所属环境" align="center" prop="environmentName"/>
      <el-table-column label="备注" align="center" prop="interComment"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:interinfo:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:interinfo:remove']"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改接口管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="接口名称" prop="interName">
          <el-input v-model="form.interName" placeholder="请输入接口名称"/>
        </el-form-item>
        <el-form-item label="接口地址" prop="interUrl">
          <el-input v-model="form.interUrl" placeholder="请输入接口地址"/>
        </el-form-item>

        <el-form-item label="请求方法" prop="method">
          <el-select v-model="form.method" placeholder="请选择请求方法">
            <el-option v-for="(item, index) in methodOptions" :key="index" :label="item.label"
                       :value="item.value" :disabled="item.disabled"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="参数类型" prop="paramType">
          <el-select v-model="form.paramType" placeholder="请选择参数类型">
            <el-option v-for="(item, index) in paramTypeOptions" :key="index" :label="item.label"
                       :value="item.value" :disabled="item.disabled"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="所属环境">
          <el-select v-model="form.environmentName" placeholder="请选择所属环境" filterable
                     remote :loading="loading" :remote-method="handleEnvirInput"

                     @focus="getEnvirList(1)">
            <el-option v-for="(item, index) in envirList" :key="item.envirId" :label="item.envirName"
                       :value="item.envirId" :disabled="item.disabled"></el-option>
          </el-select>
        </el-form-item>


        <el-form-item label="备注" prop="interComment">
          <el-input v-model="form.interComment" type="textarea" placeholder="请输入内容"/>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {listInterinfo, getInterinfo, delInterinfo, addInterinfo, updateInterinfo} from "@/api/system/interinfo";
import {listEnvironment} from "@/api/system/environment";

export default {
  name: "Interinfo",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 子表选中数据
      checkedCaseinfo: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 接口管理表格数据
      interinfoList: [],
      // 用例管理表格数据
      caseinfoList: [],
      //环境列表
      envirList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        interName: null,
        envirName: null,
        interUrl: null,
        method: null,
        paramType: null,
        interComment: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        method: [{
          required: true,
          message: '请选择请求方式',
          trigger: 'blur'
        }],
        paramType: [{
          required: true,
          message: '请选择参数类型',
          trigger: 'blur'
        }],
        envirId: [{
          required: true,
          message: '请选择所属环境',
          trigger: 'blur'
        }],
        interName: [{
          required: true,
          message: '请输入接口名称',
          trigger: 'blur'
        }],
        interUrl: [{
          required: true,
          message: '请输入接口地址',
          trigger: 'blur'
        }],

      },
      methodOptions: [{
        "label": "GET",
        "value": "GET"
      }, {
        "label": "POST",
        "value": "POST"
      }, {
        "label": "PUT",
        "value": "PUT"
      }, {
        "label": "DELETE",
        "value": "DELETE"
      }],
      paramTypeOptions: [{
        "label": "JSON",
        "value": "JSON"
      }, {
        "label": "URL",
        "value": "URL"
      }, {
        "label": "FORM",
        "value": "FORM"
      }],
    };
  },
  created() {
    this.getList();
  },
  computed: {
    // envir: {
    //   get() {
    //     return this.form.envirId;
    //   },
    //   set(val) {
    //     this.form.envirId = val;
    //   },
    // },
  },
  methods: {

    /**
     * 处理环境名称选择（模糊匹配）
     */
    handleEnvirInput(query) {
      if (query !== '') {
        this.loading = true;
        console.log(query)
        this.queryParams.envirName = query;
        this.getEnvirList();
      } else {
        // this.options = [];
        this.loading = true;
        this.queryParams.envirName = null;
        this.getEnvirList();
      }
    },
    /**
     * 查询环境列表
     */
    getEnvirList(clear) {

      if (clear === 1) {
        this.queryParams.envirName = null;
      }
      listEnvironment(this.queryParams).then(response => {
        this.loading = false;
        this.envirList = response.rows;
        // console.log(this.envirList)
        // console.log(response.rows)
      })
    },

    /** 查询接口管理列表 */
    getList() {
      this.loading = true;
      listInterinfo(this.queryParams).then(response => {
        this.interinfoList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        interId: null,
        interName: null,
        interUrl: null,
        method: null,
        paramType: null,
        envirId: null,
        interComment: null,
        userId: null
      };
      this.caseinfoList = [];
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.interId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加接口管理";
      //  查询环境列表
      // this.getEnvirList();

    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const interId = row.interId || this.ids
      getInterinfo(interId).then(response => {
        this.form = response.data;
        this.caseinfoList = response.data.caseinfoList;
        this.open = true;
        this.title = "修改接口管理";
        //  查询环境列表
        // this.getEnvirList();
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.form.caseinfoList = this.caseinfoList;
          //设置环境id
          this.form.envirId = this.form.environmentName;

          if (this.form.interId != null) {
            updateInterinfo(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addInterinfo(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const interIds = row.interId || this.ids;
      this.$modal.confirm('是否确认删除？').then(function () {
        return delInterinfo(interIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {
      });
    },
    /** 用例管理序号 */
    rowCaseinfoIndex({row, rowIndex}) {
      row.index = rowIndex + 1;
    },
    /** 用例管理添加按钮操作 */
    handleAddCaseinfo() {
      let obj = {};
      obj.caseName = "";
      obj.header = "";
      obj.param = "";
      obj.caseDesc = "";
      this.caseinfoList.push(obj);
    },
    /** 用例管理删除按钮操作 */
    handleDeleteCaseinfo() {
      if (this.checkedCaseinfo.length == 0) {
        this.$modal.msgError("请先选择要删除的用例管理数据");
      } else {
        const caseinfoList = this.caseinfoList;
        const checkedCaseinfo = this.checkedCaseinfo;
        this.caseinfoList = caseinfoList.filter(function (item) {
          return checkedCaseinfo.indexOf(item.index) == -1
        });
      }
    },
    /** 复选框选中数据 */
    handleCaseinfoSelectionChange(selection) {
      this.checkedCaseinfo = selection.map(item => item.index)
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/interinfo/export', {
        ...this.queryParams
      }, `interinfo_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
