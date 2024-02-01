<template>
  <div class="app-container home">

    <h1>欢迎使用自动化测试平台</h1>
    <el-divider/>
    <div class="book_con01">
      <h1 class="book_h01">如何开始</h1>
      <p class="book_p">step1：维护测试环境域名：点击环境管理——新增——填写环境信息提交</p>
      <p class="book_p">step2：维护接口api：点击接口管理——新增——填写接口信息提交</p>
      <p class="book_p">step3：维护用例信息：点击用例管理——新增——填写用例信息提交</p>
      <p class="book_p">
        step4：执行用例：点击用例管理——执行</p>
      <p class="book_p">
        step5：查看测试结果：点击测试结果——查看</p>

<!--      <img src="http://localhost:8089/test/1">-->
<!--      <img src="https://raw.githubusercontent.com/lan2lang/lsp_pic/master/lsp-db2/P-FXHMRW%40FXHMRW%20(3)">-->
    </div>

  </div>
</template>

<script>
export default {
  name: "Index",
  data() {
    return {
      // 版本号
      version: "3.8.7"
    };
  },
  methods: {
    goTarget(href) {
      window.open(href, "_blank");
    }
  }
};
</script>

<style scoped lang="scss">
.book_p {
  font-size: medium;
}

.home {
  blockquote {
    padding: 10px 20px;
    margin: 0 0 20px;
    font-size: 17.5px;
    border-left: 5px solid #eee;
  }

  hr {
    margin-top: 20px;
    margin-bottom: 20px;
    border: 0;
    border-top: 1px solid #eee;
  }

  .col-item {
    margin-bottom: 20px;
  }

  ul {
    padding: 0;
    margin: 0;
  }

  font-family: "open sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 13px;
  color: #676a6c;
  overflow-x: hidden;

  ul {
    list-style-type: none;
  }

  h4 {
    margin-top: 0px;
  }

  h2 {
    margin-top: 10px;
    font-size: 26px;
    font-weight: 100;
  }

  p {
    margin-top: 10px;

    b {
      font-weight: 700;
    }
  }

  .update-log {
    ol {
      display: block;
      list-style-type: decimal;
      margin-block-start: 1em;
      margin-block-end: 1em;
      margin-inline-start: 0;
      margin-inline-end: 0;
      padding-inline-start: 40px;
    }
  }
}
</style>

