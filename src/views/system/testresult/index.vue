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
      <el-form-item label="请求地址" prop="fullUrl">
        <el-input
          v-model="queryParams.fullUrl"
          placeholder="请输入请求地址"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="请求方式" prop="method">
        <el-input
          v-model="queryParams.method"
          placeholder="请输入请求方式"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="环境名称" prop="envirName">
        <el-input
          v-model="queryParams.envirName"
          placeholder="请输入环境名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="备注" prop="testComment">
        <el-input
          v-model="queryParams.testComment"
          placeholder="请输入备注"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="响应码" prop="resCode">
        <el-input
          v-model="queryParams.resCode"
          placeholder="请输入响应码"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="测试时间" prop="testTime">
        <el-date-picker clearable
          v-model="queryParams.testTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择测试时间">
        </el-date-picker>
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
          v-hasPermi="['system:testresult:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:testresult:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:testresult:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:testresult:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="testresultList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="结果ID" align="center" prop="resultId" />
      <el-table-column label="接口名称" align="center" prop="interName" />
      <el-table-column label="请求地址" align="center" prop="fullUrl" />
      <el-table-column label="请求方式" align="center" prop="method" />
      <el-table-column label="参数类型" align="center" prop="paramType" />
      <el-table-column label="环境名称" align="center" prop="envirName" />
      <el-table-column label="备注" align="center" prop="testComment" />
      <el-table-column label="请求头信息" align="center" prop="header" />
      <el-table-column label="请求参数信息" align="center" prop="param" />
      <el-table-column label="响应码" align="center" prop="resCode" />
      <el-table-column label="响应内容" align="center" prop="resBody" />
      <el-table-column label="测试时间" align="center" prop="testTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.testTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:testresult:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:testresult:remove']"
          >删除</el-button>
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

    <!-- 添加或修改测试结果对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="接口名称" prop="interName">
          <el-input v-model="form.interName" placeholder="请输入接口名称" />
        </el-form-item>
        <el-form-item label="请求地址" prop="fullUrl">
          <el-input v-model="form.fullUrl" placeholder="请输入请求地址" />
        </el-form-item>
        <el-form-item label="请求方式" prop="method">
          <el-input v-model="form.method" placeholder="请输入请求方式" />
        </el-form-item>
        <el-form-item label="环境名称" prop="envirName">
          <el-input v-model="form.envirName" placeholder="请输入环境名称" />
        </el-form-item>
        <el-form-item label="备注" prop="testComment">
          <el-input v-model="form.testComment" placeholder="请输入备注" />
        </el-form-item>
        <el-form-item label="请求头信息" prop="header">
          <el-input v-model="form.header" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="请求参数信息" prop="param">
          <el-input v-model="form.param" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="响应码" prop="resCode">
          <el-input v-model="form.resCode" placeholder="请输入响应码" />
        </el-form-item>
        <el-form-item label="响应内容" prop="resBody">
          <el-input v-model="form.resBody" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="测试时间" prop="testTime">
          <el-date-picker clearable
            v-model="form.testTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择测试时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="用户id" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入用户id" />
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
import { listTestresult, getTestresult, delTestresult, addTestresult, updateTestresult } from "@/api/system/testresult";

export default {
  name: "Testresult",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 测试结果表格数据
      testresultList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        interName: null,
        fullUrl: null,
        method: null,
        paramType: null,
        envirName: null,
        testComment: null,
        resCode: null,
        resBody: null,
        testTime: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询测试结果列表 */
    getList() {
      this.loading = true;
      listTestresult(this.queryParams).then(response => {
        this.testresultList = response.rows;
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
        resultId: null,
        interName: null,
        fullUrl: null,
        method: null,
        paramType: null,
        envirName: null,
        testComment: null,
        header: null,
        param: null,
        resCode: null,
        resBody: null,
        testTime: null,
        userId: null
      };
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
      this.ids = selection.map(item => item.resultId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加测试结果";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const resultId = row.resultId || this.ids
      getTestresult(resultId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改测试结果";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.resultId != null) {
            updateTestresult(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addTestresult(this.form).then(response => {
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
      const resultIds = row.resultId || this.ids;
      this.$modal.confirm('是否确认删除测试结果编号为"' + resultIds + '"的数据项？').then(function() {
        return delTestresult(resultIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/testresult/export', {
        ...this.queryParams
      }, `testresult_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
