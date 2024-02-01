<template>
  <div class="app-container">

    <el-container>
      <el-container>
        <el-aside width="30%">
          <el-row>报告状态：
            <el-tag>正常</el-tag>
          </el-row>
          <el-row>成功用例数量：{{ reportInfo.successCaseNum }}</el-row>
          <el-row>失败用例数量：{{ reportInfo.failCaseNum }}</el-row>
          <el-row>
            成功率：{{
              ((reportInfo.successCaseNum / (reportInfo.successCaseNum + reportInfo.failCaseNum)) * 100).toFixed(2)
            }}%
          </el-row>

          <el-row>涉及环境数量：{{ reportInfo.envirSum }}</el-row>
          <el-row>涉及接口数量：{{ reportInfo.interSum }}</el-row>
          <el-row>涉及用例数量：{{ reportInfo.caseSum }}</el-row>
        </el-aside>
        <el-main>
          <div id="testResultChart" style="width: 40%;float:left;height:300px;"></div>
          <div id="caseSumChart" style=" float:left;width: 40%;height:300px;"></div>
        </el-main>

      </el-container>
      <!--      <div id="testTimeChart" style="width: 40%;height:300px;"></div>-->
    </el-container>

    <div id="testTimeChart" style="width: 40%;float:left;height:300px;"></div>
    <div id="testCaseChart" style="width: 60%;float:left;height:300px;"></div>

  </div>
</template>
<style scoped>
.el-aside {
  background-color: #ffffff;
  color: #333;
  /*text-align: center;*/
  line-height: 40px;
}

.el-main {
  /*background-color: #E9EEF3;*/
  color: #333;
  text-align: center;
  line-height: 160px;
}
</style>
<script>
import {listTestresult, getTestresult, delTestresult, addTestresult, updateTestresult} from "@/api/system/testresult";
import * as echarts from 'echarts';


export default {
  name: "Testresult",
  data() {
    return {
      receivedData: "",
      // 遮罩层
      loading: true,
      myChart: null, // 将 myChart 定义在 data 中
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      reportInfo: "",
      testTimesInfo: "",
      caseFreInfo: "",
      timeNameList: [],
      caseNameList: [],
      caseDataList: [],
      timeDataList: [],
    };
  },
  //
  mounted() {
    // 按照对象中的值从小到大排序
    this.testTimesInfo = this.testTimesInfo.sort((a, b) => Object.values(a)[0] - Object.values(b)[0]);
    // 将键和值分别放入两个数组
    let keysArray = [];
    let valuesArray = [];

    for (let obj of this.testTimesInfo) {
      let entries = Object.entries(obj);

      for (let [key, value] of entries) {
        keysArray.push(key);
        valuesArray.push(value);
      }
    }
    this.timeDataList = valuesArray;
    this.timeNameList = keysArray;
    keysArray = []
    valuesArray = []

    // 按照对象中的值从小到大排序
    this.caseFreInfo = this.caseFreInfo.sort((a, b) => Object.values(a)[0] - Object.values(b)[0]);


    for (let obj of this.caseFreInfo) {
      let entries = Object.entries(obj);

      for (let [key, value] of entries) {
        keysArray.push(key);
        valuesArray.push(value);
      }
    }
    this.caseDataList = valuesArray;
    this.caseNameList = keysArray;

    console.log(this.caseNameList)

    // 基于准备好的dom，初始化echarts实例
    let testResultChart = echarts.init(document.getElementById('testResultChart'));
    let caseSumChart = echarts.init(document.getElementById('caseSumChart'));
    let testTimeChart = echarts.init(document.getElementById('testTimeChart'));
    let testCaseChart = echarts.init(document.getElementById('testCaseChart'));

    let testTimeOption = {
      title: {
        text: '测试用例时间分布',
        left: 'center',  // 将标题置于图表中央
        top: 'bottom',   // 将标题位置设置在图表底部
      },
      xAxis: {
        data: this.timeNameList
      },
      yAxis: {},
      //trigger:可选item:数据项图形触发（散点图，饼图） || axis:坐标轴触发（柱状图，折线图）  || none:什么都不触发
      tooltip: {
        trigger: 'axis',
        // formatter: '{a} <br/>{b} : {c} ({d}%)'
        formatter: '{b}：{c}',  //折线图、柱状（条形）图、K线图 : {a}（系列名称），{b}（类目值），{c}（数值）, {d}（无）
        axisPointer: {
          type: 'cross', //line:直线指示器 || shadow:阴影指示器  || none 无指示器 || cross 十字准星指示器
        }
      },
      series: [
        {
          type: 'bar',
          data: this.timeDataList
        }
      ]
    };

    let testCaseOption = {
      title: {
        text: '各用例执行频率',
        left: 'center',  // 将标题置于图表中央
        top: 'bottom',   // 将标题位置设置在图表底部
      },
      itemStyle: {
        barBorderRadius: 5,
        borderWidth: 1,
        borderType: 'solid',
        borderColor: '#73c0de',
        shadowColor: '#5470c6',
        shadowBlur: 3
      },
      xAxis: {
        data: this.caseNameList
      },
      yAxis: {},
      //trigger:可选item:数据项图形触发（散点图，饼图） || axis:坐标轴触发（柱状图，折线图）  || none:什么都不触发
      tooltip: {
        trigger: 'axis',
        // formatter: '{a} <br/>{b} : {c} ({d}%)'
        formatter: '{b}：{c}',  //折线图、柱状（条形）图、K线图 : {a}（系列名称），{b}（类目值），{c}（数值）, {d}（无）
        axisPointer: {
          type: 'cross', //line:直线指示器 || shadow:阴影指示器  || none 无指示器 || cross 十字准星指示器
        }
      },
      series: [
        {
          type: 'bar',
          data: this.caseDataList
        }
      ]
    };

    // 指定图表的配置项和数据
    var testResultOption = {
      color: ['#ee817d', '#6ff17c'],
      title: {
        text: '执行进度',
        left: 'center',
        top: 'center'
      },
      series: [
        {
          type: 'pie',
          data: [
            {
              value: this.reportInfo.failCaseNum,
              name: '错误：' + this.reportInfo.failCaseNum
            },
            {
              value: this.reportInfo.successCaseNum,
              name: '成功：' + this.reportInfo.successCaseNum
            }
          ],
          radius: ['45%', '62%']
        }
      ]
    };

    //用例总数配置项和数据
    var caseSumOption = {
      color: ['#3398DB'],
      title: {
        text: '用例总数：' + (this.reportInfo.successCaseNum + this.reportInfo.failCaseNum),
        left: 'center',
        top: 'center'
      },
      series: [
        {
          type: 'pie',
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: 'center'
          },
          labelLine: {
            show: false
          },
          data: [

            {
              value: this.reportInfo.successCaseNum + this.reportInfo.failCaseNum,
              // name: '成功'
            }
          ],
          radius: ['45%', '62%']
        }
      ]
    };

    // 使用刚指定的配置项和数据显示图表。
    testResultChart.setOption(testResultOption);
    caseSumChart.setOption(caseSumOption)
    testTimeChart.setOption(testTimeOption)
    testCaseChart.setOption(testCaseOption)

  },
  created() {
    // this.$cache.session.setJSON('reportData', { localProp: 1 })

    console.log(this.$cache.session.getJSON('reportData')) // 输出'{sessionProp: 1}'

    //赋值给报告信息列表
    this.reportInfo = this.$cache.session.getJSON('reportData');
    this.caseFreInfo = this.reportInfo.caseFrequency;
    this.testTimesInfo = this.reportInfo.caseTimeDistributionList;


    // console.log(this.caseFreInfo)
    // console.log(this.testTimesInfo)

    if (this.$cache.session.getJSON('reportData') == null) {
      this.$modal.msgWarning("测试报告已过期");
      // 关闭当前页签，回到首页
      this.$tab.closePage();
    }

  },
  methods: {
    /**
     * 生成报告
     */
    handleCreateReport() {
    }
  }
};
</script>
