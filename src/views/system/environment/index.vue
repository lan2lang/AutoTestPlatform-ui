<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="环境名称" prop="envirName">
        <el-input
          v-model="queryParams.envirName"
          placeholder="请输入环境名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="前置地址" prop="envirUrl">
        <el-input
          v-model="queryParams.envirUrl"
          placeholder="请输入前置地址"
          clearable
          @keyup.enter.native="handleQuery"
        />
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
          v-hasPermi="['system:environment:add']"
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
          v-hasPermi="['system:environment:edit']"
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
          v-hasPermi="['system:environment:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:environment:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="environmentList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column type="index" label="序号" align="center"  />
      <el-table-column label="环境名称" align="center" prop="envirName" />
      <el-table-column label="前置地址" align="center" prop="envirUrl" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:environment:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:environment:remove']"
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

    <!-- 添加或修改环境对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="环境名称" prop="envirName">
          <el-input v-model="form.envirName" placeholder="请输入环境名称" />
        </el-form-item>
        <el-form-item label="前置地址" prop="envirUrl">
          <el-input v-model="form.envirUrl" placeholder="请输入前置地址" />
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
import { listEnvironment, getEnvironment, delEnvironment, addEnvironment, updateEnvironment } from "@/api/system/environment";

export default {
  name: "Environment",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 子表选中数据
      checkedInterinfo: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 环境表格数据
      environmentList: [],
      // 接口管理表格数据
      interinfoList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        envirName: null,
        envirUrl: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        envirName: [
          { required: true, message: "环境名称不能为空", trigger: "blur" }
        ],
        envirUrl: [
          { required: true, message: "地址不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询环境列表 */
    getList() {
      this.loading = true;
      listEnvironment(this.queryParams).then(response => {
        this.environmentList = response.rows;
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
        envirId: null,
        envirName: null,
        envirUrl: null,
        userId: null
      };
      this.interinfoList = [];
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
      this.ids = selection.map(item => item.envirId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加环境";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const envirId = row.envirId || this.ids
      getEnvironment(envirId).then(response => {
        this.form = response.data;
        this.interinfoList = response.data.interinfoList;
        this.open = true;
        this.title = "修改环境";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.form.interinfoList = this.interinfoList;
          if (this.form.envirId != null) {
            updateEnvironment(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addEnvironment(this.form).then(response => {
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
      const envirIds = row.envirId || this.ids;
      this.$modal.confirm('是否确认删除环境编号为"' + envirIds + '"的数据项？').then(function() {
        return delEnvironment(envirIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
	/** 接口管理序号 */
    rowInterinfoIndex({ row, rowIndex }) {
      row.index = rowIndex + 1;
    },
    /** 接口管理添加按钮操作 */
    handleAddInterinfo() {
      let obj = {};
      obj.interName = "";
      obj.interUrl = "";
      obj.method = "";
      obj.paramType = "";
      obj.interComment = "";
      this.interinfoList.push(obj);
    },
    /** 接口管理删除按钮操作 */
    handleDeleteInterinfo() {
      if (this.checkedInterinfo.length == 0) {
        this.$modal.msgError("请先选择要删除的接口管理数据");
      } else {
        const interinfoList = this.interinfoList;
        const checkedInterinfo = this.checkedInterinfo;
        this.interinfoList = interinfoList.filter(function(item) {
          return checkedInterinfo.indexOf(item.index) == -1
        });
      }
    },
    /** 复选框选中数据 */
    handleInterinfoSelectionChange(selection) {
      this.checkedInterinfo = selection.map(item => item.index)
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/environment/export', {
        ...this.queryParams
      }, `environment_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
