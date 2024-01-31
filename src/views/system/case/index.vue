<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="用例名称" prop="caseName">
        <el-input
          v-model="queryParams.caseName"
          placeholder="请输入用例名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
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
          placeholder=""
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
          v-hasPermi="['system:case:add']"
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
          v-hasPermi="['system:case:edit']"
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
          v-hasPermi="['system:case:remove']"
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
          v-hasPermi="['system:case:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="caseList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" prop="id"/>
      <el-table-column type="index" label="序号" align="center"/>
      <el-table-column label="用例名称" align="center" prop="caseName"/>
      <el-table-column label="接口名称" align="center" prop="interName"/>
      <el-table-column label="请求地址" align="center" prop="fullUrl"/>
      <el-table-column label="请求方法" align="center" prop="method" width="100"/>
      <el-table-column label="参数类型" align="center" prop="paramType" width="100"/>
      <el-table-column label="请求头" align="center" width="300" prop="header"/>
      <el-table-column label="请求参数" align="center" width="300" prop="param"/>
      <el-table-column label="描述" align="center" prop="caseDesc"/>
      <el-table-column label="操作" fixed="right" width="100" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-s-platform"
            @click="handleRunCase(scope.$index)"
          >执行
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:case:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:case:remove']"
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

    <!-- 添加或修改用例管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="700px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用例名称" prop="caseName">
          <el-input v-model="form.caseName" placeholder="请输入用例名称"/>
        </el-form-item>

        <el-form-item label="所属接口">
          <el-select v-model="form.interId" placeholder="请选择所属接口" filterable
                     remote :loading="loading" :remote-method="handleInterInput"

                     @focus="getInterList(1)">
            <el-option v-for="(item, index) in interList" :key="item.interId" :label="item.interName"
                       :value="item.interId" :disabled="item.disabled"></el-option>
          </el-select>
        </el-form-item>

        <el-divider content-position="center">请求头</el-divider>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAddHeader">添加</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleDeleteHeader">删除</el-button>
          </el-col>
        </el-row>
        <el-table :data="headerList" :row-class-name="rowHeaderIndex"
                  @selection-change="handleHeaderSelectionChange" ref="headerInfo">
          <el-table-column type="selection" width="50" align="center"/>
          <el-table-column label="序号" align="center" prop="index" width="50"/>
          <el-table-column label="参数名称" prop="paramName" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.paramName" placeholder=""/>
            </template>
          </el-table-column>
          <el-table-column label="参数值" prop="value" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.value" placeholder=""/>
            </template>
          </el-table-column>
        </el-table>


        <el-divider content-position="center">请求参数</el-divider>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAddParam">添加</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleDeleteParam">删除</el-button>
          </el-col>
        </el-row>
        <el-table :data="paramList" :row-class-name="rowParamIndex"
                  @selection-change="handleParamSelectionChange" ref="paramInfo">
          <el-table-column type="selection" width="50" align="center"/>
          <el-table-column label="序号" align="center" prop="index" width="50"/>
          <el-table-column label="参数名称" prop="paramName" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.paramName" placeholder=""/>
            </template>
          </el-table-column>
          <el-table-column label="参数值" prop="value" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.value" placeholder=""/>
            </template>
          </el-table-column>
        </el-table>

        <el-form-item label="描述" prop="caseDesc">
          <el-input v-model="form.caseDesc" type="textarea" placeholder="请输入内容"/>
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
import {listCase, getCase, delCase, addCase, updateCase, runCase} from "@/api/system/case";

import {listInterinfo} from "@/api/system/interinfo";

export default {
  name: "Case",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 请求头选中数据
      checkedHeader: [],
      // 请求头选中数据
      checkedParam: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 用例管理表格数据
      caseList: [],
      //接口列表
      interList: [],
      // 请求头表格数据
      headerList: [],
      // 请求参数表格数据
      paramList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        caseName: null,
        interName: null,
        interUrl: null

      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        caseName: [
          {required: true, message: "用例名称不能为空", trigger: "blur"}
        ],
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
  methods: {
    /** 请求头管理序号 */
    rowHeaderIndex({row, rowIndex}) {
      row.index = rowIndex + 1;
    },
    /** 请求参数管理序号 */
    rowParamIndex({row, rowIndex}) {
      row.index = rowIndex + 1;
    },
    /** 请求头添加按钮操作 */
    handleAddHeader() {
      let obj = {};
      obj.paramName = "";
      obj.value = "";
      this.headerList.push(obj);
    },
    /** 请求参数添加按钮操作 */
    handleAddParam() {
      let obj = {};
      obj.paramName = "";
      obj.value = "";
      this.paramList.push(obj);
    },
    /** 请求头删除按钮操作 */
    handleDeleteHeader() {
      if (this.checkedHeader.length == 0) {
        this.$modal.msgError("请先选择要删除的数据");
      } else {
        const headerList = this.headerList;
        const checkedHeader = this.checkedHeader;
        this.headerList = headerList.filter(function (item) {
          return checkedHeader.indexOf(item.index) == -1
        });
      }
    },
    /** 请求参数删除按钮操作 */
    handleDeleteParam() {
      if (this.checkedParam.length == 0) {
        this.$modal.msgError("请先选择要删除的数据");
      } else {
        const paramList = this.paramList;
        const checkedParam = this.checkedParam;
        this.paramList = paramList.filter(function (item) {
          return checkedParam.indexOf(item.index) == -1
        });
      }
    },
    /** 复选框选中数据 */
    handleHeaderSelectionChange(selection) {
      this.checkedHeader = selection.map(item => item.index)
    },
    /** 复选框选中数据 */
    handleParamSelectionChange(selection) {
      this.checkedParam = selection.map(item => item.index)
    },
    /**
     * 处理接口名称选择（模糊匹配）
     */
    handleInterInput(query) {
      if (query !== '') {
        this.loading = true;
        // console.log(query)
        this.queryParams.interName = query;
        this.getInterList();
      } else {
        // this.options = [];
        this.loading = true;
        this.queryParams.interName = null;
        this.getInterList();
      }
    },
    /**
     * 查询环境列表
     */
    getInterList(clear) {

      if (clear === 1) {
        this.queryParams.interName = null;
      }
      listInterinfo(this.queryParams).then(response => {
        this.loading = false;
        this.interList = response.rows;
      })
    },

    /** 查询用例管理列表 */
    getList() {
      this.loading = true;
      listCase(this.queryParams).then(response => {
        this.caseList = response.rows;
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
        caseId: null,
        caseName: null,
        header: null,
        param: null,
        interId: null,
        caseDesc: null,
        userId: null,
      };
      this.headerList = [];
      this.paramList = [];
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
      this.ids = selection.map(item => item.caseId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加用例管理";
    },
    /**
     * 执行按钮操作
     */
    handleRunCase(index) {
      console.log(this.caseList[index])
      // // console.log(this.caseList)
      this.caseList[index].paramList = JSON.parse(this.caseList[index].param);
      // console.log(JSON.parse(this.caseList[index].param));
      this.caseList[index].headerList = JSON.parse(this.caseList[index].header);
      this.$modal.loading("正在执行，请稍候...");
      //发送请求
      runCase(this.caseList[index]).then(response => {

        this.$modal.closeLoading();
        this.$modal.msgSuccess("执行成功，请前往测试结果查看");

      });

      // setTimeout(this.$modal.closeLoading(), 1000)


    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      // console.log(row)
      const caseId = row.caseId || this.ids

      this.getInterList(1)
      getCase(caseId).then(response => {
        this.form = response.data;

        this.headerList = response.data.headerList;
        this.paramList = response.data.paramList;

        if (this.headerList == null) {
          this.headerList = [];
        }
        if (this.paramList == null) {
          this.paramList = [];
        }
        this.open = true;
        this.title = "修改用例管理";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.form.headerList = this.headerList;
          this.form.paramList = this.paramList;

          if (this.form.caseId != null) {
            // console.log(this.form)
            updateCase(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addCase(this.form).then(response => {
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
      const caseIds = row.caseId || this.ids;
      this.$modal.confirm('是否确认删除？').then(function () {
        return delCase(caseIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/case/export', {
        ...this.queryParams
      }, `case_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
