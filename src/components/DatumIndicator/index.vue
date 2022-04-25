<template>
  <div>
    <div class="date">
      <el-button type="info" @click="setDateValueFun(0, '今天')">
        今天
      </el-button>
      <el-button type="info" @click="setDateValueFun(-1, '昨天')">
        昨天
      </el-button>
      <el-button type="info" @click="setDateValueFun(6, '最近七天')">
        最近七天
      </el-button>
      <el-button type="info" @click="setDateValueFun(29, '最近三十天')">
        最近三十天
      </el-button>
      <el-date-picker
        v-model="data.dateValue"
        type="daterange"
        align="right"
        unlink-panels
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        @change="dateChangeFun"
      >
      </el-date-picker>
    </div>
    <el-table :data="data.tableData" style="width: 100%">
      <el-table-column prop="date" label="时间" width="180"> </el-table-column>
      <el-table-column prop="register" label="注册用户数" width="180">
      </el-table-column>
      <el-table-column prop="uploading" label="(上传数据)用户数">
      </el-table-column>
      <el-table-column prop="establish" label="(创建场景)用户数">
      </el-table-column>
      <el-table-column prop="visit" label="场景访问总量"> </el-table-column>
    </el-table>
  </div>
</template>

<script setup name="DatumIndicator">
import { getUserRecord } from "@/api/system/user.js";

const data = reactive({
  tableData: [], //用户访问数据集
  dateValue: null, //时间选择器值
});
/**
 * btn时间选择
 */
const setDateValueFun = (value, dateTitle) => {
  let endDate = null;
  let startDate = null;
  switch (value) {
    case -1:
      let NowEndDate = new Date();
      endDate = new Date(
        NowEndDate.getFullYear(),
        NowEndDate.getMonth(),
        NowEndDate.getDate()
      );
      let NowStartDate = new Date();
      startDate = new Date(
        NowStartDate.getFullYear(),
        NowStartDate.getMonth(),
        NowStartDate.getDate() - 1
      );

      break;
    case 0:
    case 6:
    case 29:
      if (!endDate) {
        let newEndDate = new Date();
        endDate = new Date(
          newEndDate.getFullYear(),
          newEndDate.getMonth(),
          newEndDate.getDate() + 1
        );
      }
      if (!startDate) {
        let newStartDate = new Date();
        newStartDate.setTime(newStartDate.getTime() - 3600 * 1000 * 24 * value);
        startDate = new Date(
          newStartDate.getFullYear(),
          newStartDate.getMonth(),
          newStartDate.getDate()
        );
      }
      break;
  }
  load(startDate, endDate, dateTitle);
};
/**
 * 时间期时间选择
 */
const dateChangeFun = () => {
  if (data.dateValue) {
    let dateValue = data.dateValue[1] - data.dateValue[0];
    let endDateTitle =
      data.dateValue[1].getFullYear() +
      "-" +
      (data.dateValue[1].getMonth() + 1) +
      "-" +
      data.dateValue[1].getDate();
    let startDateTitle =
      data.dateValue[0].getFullYear() +
      "-" +
      (data.dateValue[0].getMonth() + 1) +
      "-" +
      data.dateValue[0].getDate();
    load(
      data.dateValue[0],
      data.dateValue[1],
      startDateTitle + "至" + endDateTitle
    );
  }
};
/**
 * 初始化table值
 */
const load = (startDate, endDate, dateTitle) => {
  getUserRecord().then((res) => {
    let dateArr = [dateTitle];
    let userArr = JSON.parse(res.data.users || "[]"); //用户
    let datasetArr = JSON.parse(res.data.datasets || "[]"); //数据管理数据
    let sceneArr = JSON.parse(res.data.scenes || "[]"); //场景数据

    data.tableData = dateArr.map((v) => {
      let date = v; //时间
      let register = 0; //注册用户数
      let uploading = 0; //上传用户数
      let establish = 0; //创建场景用户数
      let visit = 0; //场景访问数
      userArr.forEach((item) => {
        let userDate = new Date(item.createTime);
        if (startDate <= userDate && userDate <= endDate) {
          register++;
        }
      });
      datasetArr.forEach((item) => {
        let datasetDate = new Date(item.createTime);
        if (startDate <= datasetDate && datasetDate <= endDate) {
          uploading++;
        }
      });
      sceneArr.forEach((item) => {
        let sceneDate = new Date(item.createTime);
        if (startDate <= sceneDate && sceneDate <= endDate) {
          establish++;
          visit += item.viewCount || 1; //1为假值 需更改
        }
      });
      return { date, register, uploading, establish, visit };
    });
  });
};

//默认加载今天数据
setDateValueFun(0, "今天");
</script>

<style scoped>
.date {
  display: flex;
  justify-content: end;
  align-items: center;
  margin-bottom: 5px;
}
::v-deep(.el-range-editor.el-input__inner) {
  margin-left: 10px;
}
</style>
