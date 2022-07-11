<template>
  <div class="PhoneRetrieve">
    <h1>迪路科技</h1>
    <div id="contentDiv">
      <div id="registerDiv">
        <span style="font-size: 25px; color: #373d41; padding: 20px 0"> 重置密码 </span>
        <form style="width: 300px" ref="form">
          <div class="label">输入手机号</div>
          <label>
            <div class="input-group__append">+86</div>
            <input v-model="data.form.cellPhoneNumber" placeholder="暂不支持大陆地区以外的手机号" />
          </label>
          <div class="label">输入验证码</div>
          <label>
            <div class="verificationCode">
              <input v-model="data.form.verificationCode" placeholder="6位数字" />
              <button style="width: 140px; margin-left: 5px; background: rgba(85, 85, 85, 1)" type="primary" @click.prevent="btnValueFun">
                {{ data.btnValue }}
              </button>
            </div>
          </label>
          <div class="label">设置新密码</div>
          <label>
            <input v-model="data.form.newPassWord" show-password placeholder="至少8位，可包含任意字符" />
          </label>
          <button type="primary" @click.prevent="submitForm('form')" style="width: 100%; background: rgba(85, 85, 85, 1)">提交</button>
          <label>
            <span style="color: #40a9ff; cursor: pointer; font-size: 14px" @click.prevent="loginFun()"> 去登录 </span>
          </label>
        </form>
      </div>
    </div>
    <div class="countDown" v-if="data.message">
      {{ data.message }}
    </div>
  </div>
</template>

<script setup name="PhoneRetrieve">
import { getALYCode, resetPassWordByPhone } from '@/api/tool/gen';
import { getToken, setToken } from '@/utils/auth';

const route = useRoute();
const router = useRouter();
const store = useStore();
const { proxy } = getCurrentInstance();

const data = reactive({
  form: {
    cellPhoneNumber: null, //手机号
    verificationCode: null, //验证码
    newPassWord: null, //新密码
  },
  btnValue: '获取验证码',
  ALYCode: null, //阿里云获取到的验证码
  message: null, //修改完后提示消息
});
const load = () => {
  let ALYCode = localStorage.getItem('DLverificationCode');
  if (ALYCode) {
    data.ALYCode = parseInt(ALYCode);
  }
};
/**
 * 立即验证
 */
const submitForm = () => {
  //手机号验证
  if (!data.form.cellPhoneNumber) {
    proxy.$message.warning('请输入手机号！');
    return;
  }
  if (!isCellPhone(data.form.cellPhoneNumber)) {
    proxy.$message.warning('请输入正确的手机号！');
    return;
  }
  //密码验证
  if (!data.form.newPassWord) {
    proxy.$message.warning('密码不能为空！');
    return;
  }
  if (!/^(\w){8,20}$/.test(data.form.newPassWord)) {
    proxy.$message.warning('请输入8-20位字符的密码！');
    return;
  }
  //最后验证验证码
  if (data.form.verificationCode && data.ALYCode + 1234 == data.form.verificationCode && data.form.verificationCode != 1234) {
    localStorage.removeItem('DLverificationCode');
    editPassWord();
  } else {
    proxy.$message.warning('验证码输入错误！请重新输入');
  }
};
/**
 * 验证手机号是否正确
 */
const isCellPhone = (val) => {
  if (!/^1(3|4|5|6|7|8)\d{9}$/.test(val)) {
    return false;
  } else {
    return true;
  }
};
/**
 * 验证码获取
 * 倒计时
 */
const btnValueFun = async () => {
  if (!data.form.cellPhoneNumber) {
    proxy.$message.info('请输入手机号码获取验证码!');
    return;
  }
  if (!/^1[3|4|5|6|7|8|9][0-9]\d{8}$/.test(data.form.cellPhoneNumber)) {
    proxy.$message.warning('请输入正确的手机号!');
    return;
  }
  let token = await getToken();
  if (token) {
    await store.dispatch('LogOut');
  }
  if (!data.interval && data.form.cellPhoneNumber) {
    let ALYCode = await getALYCode(data.form.cellPhoneNumber + '/2');
    if (ALYCode.code === 200) {
      data.ALYCode = ALYCode.data;
      localStorage.setItem('DLverificationCode', ALYCode.data);
    }
    if (ALYCode.code === 500) {
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
 * 确认修改密码
 */
const editPassWord = async () => {
  var editCode = await resetPassWordByPhone({
    phonenumber: data.form.cellPhoneNumber,
    password: data.form.newPassWord,
  });
  if (editCode.code == 200) {
    let date = 2;
    data.message = `密码修改成功,${date}秒后自动关闭此页面，跳转至平台界面`;
    let interval = setInterval((_) => {
      date--;
      data.message = `密码修改成功,${date}秒后自动关闭此页面，跳转至平台界面`;
      if (date == 0) {
        clearInterval(interval);
        loginFun(editCode.data); //token
      }
    }, 1000);
  }
};
/**
 * 跳转至数据管理平台
 * @param token token信息
 */
const loginFun = async (token) => {
  if (!token) {
    router.push({
      path: '/login',
      query: {
        type: route.query.type,
        callback: route.query.callback,
      },
    });
  } else {
    let type = null;
    const to = await store.dispatch('getOtherPlatformsParameter'); //前往平台参数
    await store.dispatch('deleteOtherPlatformsParameter'); //删除参数
    if (to.type && to.callback) {
      type = to.type;
      switch (type) {
        case 'h5-vp':
          window.open(decodeURIComponent(to.callback) + '?token=' + token, '_top');
          break;
        case 'web-vp':
        case 'web-dm':
          window.open(decodeURIComponent(to.callback) + '?token=' + token, '_top');
          break;
      }
    } else {
      setToken(token); //cookie
      store.state.user.token = token;
      router.push({ path: '/index' });
    }
  }
};
load();
</script>

<style scoped lang="scss">
.PhoneRetrieve {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f6;

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
      padding: 0 50px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .verificationCode {
      display: flex;
    }
  }
  .editPassWord {
    background: #b6b4db;
    padding: 0 30px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .config {
    display: table-cell;
    vertical-align: middle;
  }
  ::v-deep .is-icon {
    background: transparent;
  }
  .label {
    font-size: 14px;
    line-height: 40px;
    color: #606266;
    padding: 0 12px 0 0;
    box-sizing: border-box;
    font-weight: 700;
  }
  label {
    line-height: 36px;
    margin-bottom: 22px;
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
</style>
