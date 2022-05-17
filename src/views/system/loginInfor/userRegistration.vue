<template>
  <div id="parentDiv">
    <h1>迪路科技</h1>
    <div id="contentDiv">
      <div id="registerDiv">
        <span style="font-size: 25px; color: #373d41; padding: 20px 0"> 账号注册 </span>
        <form ref="registerInfor">
          <div class="label">输入手机号</div>
          <label>
            <div class="input-group__append">+86</div>
            <input v-model.trim="data.userInfo.phonenumber" />
          </label>
          <div class="label">输入验证码</div>
          <label>
            <div class="verificationCode">
              <input v-model.trim="data.userInfo.verificationCode" />
              <button style="width: 140px; margin-left: 5px; background: rgba(85, 85, 85, 1)" type="primary" @click.prevent="btnValueFun">
                {{ data.btnValue }}
              </button>
            </div>
          </label>
          <div style="font-size: 14px; margin-bottom: 15px" tabindex="-1" @blur="eventListener">
            <div class="label">行业类型</div>
            <div class="distpicker" @click.stop>
              <!-- 选择框 -->
              <div class="input-text" :class="{ selectActive: data.multistageUUID }" @click="toSelectArea">
                <div>
                  <span>{{ data.industryCategories }}</span>
                  <span>{{ data.industryOfSmall }}</span>
                </div>
                <div class="arrow-box"></div>
              </div>
              <div class="multistage" v-if="data.multistageUUID">
                <!-- 行业大类 -->
                <div class="options country-options" v-show="data.industryCategoriesUUID">
                  <ul>
                    <li
                      class="select-options"
                      v-for="(cony, index) in data.industryData"
                      :key="index"
                      :class="{ active: data.industryCategories === cony.name }"
                      @click="selectCountry(cony.name, true)"
                    >
                      <span>{{ cony.name }}</span>
                      <span v-if="cony.children.length > 0" class="icon"> > </span>
                    </li>
                  </ul>
                </div>
                <!-- 行业小类 -->
                <div class="options province-options" v-show="data.industryOfSmallUUID">
                  <ul>
                    <li
                      class="select-options"
                      v-for="(pro, index) in data.industryCategoriesList"
                      :key="index"
                      :class="{ active: data.industryOfSmall === pro.name }"
                      @click="selectProvince(pro, true)"
                    >
                      <span>{{ pro.name }}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <label>
            <div class="flexBox">
              <button :disabled="data.disabled" @click.prevent="submitForm('registerInfor')" style="background: rgba(85, 85, 85, 1)">立即注册</button>
              <span style="font-size: 14px">
                (已有账号)
                <span @click.prevent="loginFun()" style="color: #40a9ff; cursor: pointer"> 去登录 </span>
              </span>
            </div>
          </label>
          <label class="flexBox">
            <input
              id="cbox2"
              type="checkbox"
              style="flex: 1; transform: scale(1.5)"
              v-model="data.userInfo.clause"
              value="《网站服务条款》|《法律声明和隐私权政策》"
            />
            <label :style="{ color: data.userInfo.clause ? '#1890ff' : '#000' }" style="font-size: 14px; margin: 0; user-select: none" for="cbox2">
              《网站服务条款》|《法律声明和隐私权政策》
            </label>
          </label>
        </form>
      </div>
    </div>
    <div class="countDown" v-if="data.message">{{ data.message }}</div>
  </div>
</template>

<script setup name="UserRegistration">
import { registeredUser } from '@/api/system/user.js';
import { getALYCode } from '@/api/tool/gen.js';
import { getIndustry } from '@/api/login.js';
import { setToken, getToken } from '@/utils/auth';

const route = useRoute();
const router = useRouter();
const store = useStore();
const { proxy } = getCurrentInstance();

const data = reactive({
  userInfo: {
    userName: '', // 用户名
    password: '', // 密码
    phonenumber: '', // 手机号
    clause: '', // 协议
    verificationCode: '', //验证码
    professionId: null, //行业id
  },
  btnValue: '获取验证码',
  ALYCode: null, //阿里云获取到的验证码
  disabled: false, //注册按钮禁用标识符
  message: null, //注册完后提示消息
  multistageUUID: false, //多级联动显隐
  industryData: [], //行业数据
  industryCategories: '', //选中的行业大类
  industryOfSmall: '', //选中的行业小类
  industryCategoriesUUID: false, //行业大类list显隐
  industryCategoriesList: [], //行业小类list
  industryOfSmallUUID: false, //行业小类显隐
});
const load = () => {
  let ALYCode = localStorage.getItem('DLverificationCodeRegister');
  if (ALYCode) {
    data.ALYCode = parseInt(ALYCode);
  }
  //获取行业数据
  getIndustry().then((res) => {
    res.data.forEach((v) => {
      if (!v.parentId) {
        data.industryData.push({
          name: v.name,
          id: v.professionId,
          children: [],
        });
      } else {
        let indexValue = data.industryData.findIndex((item) => item.id == v.parentId);
        if (indexValue != -1) {
          data.industryData[indexValue].children.push({
            name: v.name,
            id: v.professionId,
          });
        }
      }
    });
  });
};
const submitForm = () => {
  try {
    if (!data.userInfo.professionId) {
      proxy.$message.warning('请选择完整的行业类型');
      return;
    }
    if (!data.userInfo.phonenumber) {
      proxy.$message.warning('请输入手机号');
      return;
    }
    if (!/^1[3|4|5|6|7|8|9][0-9]\d{8}$/.test(data.userInfo.phonenumber)) {
      proxy.$message.warning('请输入正确的手机号!');
      return;
    }
    if (!data.userInfo.verificationCode) {
      proxy.$message.warning('请输入验证码');
      return;
    }
    if (!data.ALYCode || data.userInfo.verificationCode != data.ALYCode + 1234 || data.userInfo.verificationCode == 1234) {
      proxy.$message.warning('验证码错误!请重新输入');
      return;
    }
    if (!data.userInfo.clause) {
      proxy.$message.warning('请勾选协议!!!');
      return;
    }
    data.disabled = true;
    // 设置用户角色（创建用户时，需要添加角色信息，3为游客角色的角色id）
    data.userInfo.roleIds = [3];
    // 由于复用现有接口，接口中nickName为必填字段
    data.userInfo.nickName = data.userInfo.phonenumber;
    registeredUser({
      ...data.userInfo,
      userName: data.userInfo.phonenumber,
      password: data.userInfo.phonenumber,
    })
      .then((response) => {
        setToken(response.data);
        localStorage.removeItem('DLverificationCodeRegister');
        proxy.$message({
          showClose: true,
          message: '注册成功！',
          type: 'success',
          onClose: () => {
            let date = 2;
            data.message = `账号注册成功,${date}秒后自动关闭此页面，跳转至平台界面`;
            let interval = setInterval((_) => {
              date--;
              data.message = `账号注册成功,${date}秒后自动关闭此页面，跳转至平台界面`;
              if (date == 0) {
                clearInterval(interval);
                loginFun(response.data);
              }
            }, 1000);
          },
        });
      })
      .catch((err) => {
        data.disabled = false;
        localStorage.removeItem('DLverificationCodeRegister');
      });
  } catch (error) {
    data.disabled = false;
    console.log(error);
  }
};
/**
 * 获取阿里云验证码
 * 倒计时
 */
const btnValueFun = async () => {
  if (!data.userInfo.phonenumber) {
    proxy.$message.warning('请输入手机号码获取验证码!');
    return;
  }
  if (!/^1[3|4|5|6|7|8|9][0-9]\d{8}$/.test(data.userInfo.phonenumber)) {
    proxy.$message.warning('请输入正确的手机号!');
    return;
  }
  let token = await getToken();
  if (token) {
    await store.dispatch('LogOut');
  }
  if (!data.interval && data.userInfo.phonenumber) {
    let ALYCode = await getALYCode(data.userInfo.phonenumber + '/1');
    if (ALYCode.code == '200') {
      data.ALYCode = ALYCode.data;
      localStorage.setItem('DLverificationCodeRegister', ALYCode.data);
    }
    if (ALYCode.code == '500') {
      proxy.$message.warning('获取验证码次数过多！请稍侯获取');
    }
    let date = 60;
    data.btnValue = date + 's';
    data.interval = setInterval((_) => {
      date--;
      data.btnValue = date + 's';
      if (date === 0) {
        clearInterval(data.interval);
        data.btnValue = '重新获取';
        data.interval = null;
      }
    }, 1000);
  }
};
/**
 * 跳转至数据管理平台
 */
const loginFun = (token) => {
  if (!token) {
    router.push({
      path: '/login',
      query: {
        type: route.query.type,
        callback: route.query.callback,
      },
    });
    return;
  } else {
    let type = route.query.type;
    if (type) {
      switch (type) {
        case 'h5-vp':
          window.open(decodeURIComponent(route.query.callback) + '?token=' + token, '_top');
          break;
        case 'web-vp':
        case 'web-dm':
          window.open(decodeURIComponent(route.query.callback) + '?token=' + token, '_top');
          break;
      }
    } else {
      setToken(token); //cookie
      store.state.user.token = token; //$store
      router.push({ path: '/index' });
    }
  }
};
/**
 * 显隐行业内容
 */
const toSelectArea = () => {
  data.currentArea = {
    industryCategories: data.industryCategories,
    industryOfSmall: data.industryOfSmall,
  };
  data.multistageUUID = !data.multistageUUID;
  data.industryCategoriesUUID = true;
  selectCountry(data.currentArea.industryCategories);
  selectProvince(data.currentArea.industryOfSmall);
};
/**
 * 选择第一大类
 */
const selectCountry = (industryCategories) => {
  if (industryCategories === '') {
    data.industryCategories = '';
  } else {
    data.industryCategories = industryCategories;
  }
  data.industryCategoriesList = [];
  for (let i = 0; i < data.industryData.length; i++) {
    if (data.industryData[i].name === industryCategories) {
      data.industryCategoriesList = data.industryData[i].children;
    }
  }
  if (data.industryCategoriesList.length === 0) {
    data.industryOfSmallUUID = false;
  } else {
    data.industryOfSmallUUID = true;
  }
  data.industryOfSmall = '';
};
//选择第二小类
const selectProvince = (pro, isClose) => {
  if (pro) {
    data.userInfo.professionId = pro.id;
    data.industryOfSmall = pro.name;
    if (isClose) {
      eventListener();
    }
  }
};
//下拉菜单的收起
const eventListener = () => {
  data.multistageUUID = false;
  data.searchCity = '';
};
load();
</script>

<style scoped lang="scss">
#parentDiv {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f5f5f6;
  justify-content: center;
  overflow: hidden;
  overflow-y: auto;
}

#headerDiv {
  flex-basis: 50px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #d7d8d9;
  #leftName {
    margin-left: 20px;
    font-size: 22px;
  }
}

#contentDiv {
  // flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f6;
  #registerDiv {
    border-radius: 6px;
    background: white;
    width: 400px;
    padding: 0 50px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .verificationCode {
    display: flex;
  }
  .label {
    vertical-align: middle;
    font-size: 14px;
    color: #606266;
    line-height: 40px;
    padding: 0 12px 0 0;
    box-sizing: border-box;
    font-weight: 700;
  }
  .flexBox {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  label {
    line-height: 36px;
    margin-bottom: 15px;
    display: flex;
  }
  input {
    width: 100%;
    line-height: 36px;
    background-color: #ffffff;
    background-image: none;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    color: #606266;
    outline: none;
    padding: 0 15px;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
  .input-group__append {
    font-size: 14px;
    background-color: #f5f7fa;
    color: #909399;
    vertical-align: middle;
    display: table-cell;
    position: relative;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    padding: 0 20px;
    white-space: nowrap;
    border-right: 0;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
  button {
    color: white;
    padding: 10px 20px;
    font-size: 14px;
    border-radius: 4px;
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    background: #ffffff;
    border: 1px solid #1890ff;
    text-align: center;
    box-sizing: border-box;
    outline: none;
    margin: 0;
    font-weight: 400;
    padding: 12px 20px;
  }
}
.countDown {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background-color: #f5f5f6;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
}
ul {
  list-style-type: none;
  padding: 0;
}
.drop-list {
  padding: 5px;
}
.distpicker {
  width: 100%;
  position: relative;
  .input-text {
    display: flex;
    justify-content: space-between;
    background-color: #fff;
    padding: 0 5px;
    border-radius: 3px;
    border: 1px solid #ccc;
    line-height: 38px;
    color: #606266;
    height: 38px;
    position: relative;

    &.selectActive {
      border-color: green;
    }
    & span {
      margin: 0 5px;
    }
    & .arrow-box {
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 7px 7px 7px 7px;
      border-color: #606266 transparent transparent;
      position: relative;
      top: 17px;

      &:after {
        content: '';
        border-style: solid;
        border-width: 7px 7px 7px 7px;
        border-color: #fff transparent transparent;
        position: absolute;
        top: -9px;
        left: -7px;
      }
    }
    .select-icon {
      &.iconActive {
        color: green;
      }
    }
  }
  .multistage {
    display: flex;
    position: absolute;
    top: 38px;
    left: 0;
    z-index: 10;
    .options {
      border: 1px solid #ccc;
      background-color: #fff;
      min-width: 130px;
      flex-shrink: 1;
      overflow: hidden;
      overflow-y: auto;
      height: 250px;
      .select-options {
        display: flex;
        justify-content: space-between;
        cursor: pointer;
        padding: 3px 5px;
        align-items: center;
        &.active {
          background-color: #ccc;
        }
      }
    }
  }
  .btn-wrapper {
    display: flex;
    margin: 5px 0;
    justify-content: flex-end;
  }
}
</style>
