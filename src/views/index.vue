<template>
  <div class="app-container home">

    <h1>欢迎使用自动化测试平台</h1>
    <el-divider/>
    <div class="book_con01">
      <h1 class="book_h01">如何开始</h1>
      <p class="book_p">step1：维护测试环境域名：点击环境管理——新增——填写环境信息提交</p>
      <p class="book_p">step2：维护接口api：点击接口管理——新增——填写接口信息提交</p>
      <p class="book_p">step3：维护用例信息：点击用例管理——新增——填写用例信息提交</p>
      <p class="book_p">step4：维护测试集信息：点击测试集管理——新增测试集信息——点击用例管理添加该测试集所需的用例及执行信息</p>
      <p class="book_p">step5：维护任务信息：点击任务管理——新增执行任务信息——点击测试集管理添加该任务所需的测试集等信息——点击开启，等待执行</p>

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
.book_p{
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

