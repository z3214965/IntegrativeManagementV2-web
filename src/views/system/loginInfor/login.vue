<template>
  <div id="login">
    <h1>一体化生产平台</h1>
    <div class="login-box">
      <h3 class="title">账号登录</h3>
      <div class="login-select flex-box">
        <div class="activeBtn" :class="{ active: data.activeKey == 1 }" @click="data.activeKey = 1">手机验证登录</div>
        <div class="activeBtn" :class="{ active: data.activeKey == 2 }" @click="data.activeKey = 2;getCode();" >
          账号密码登录
        </div>
      </div>
      <!-- 账号密码登录 -->
      <form action="" class="form userLogin" v-if="data.activeKey == 2" @keyup.enter="handleLogin">
        <div class="posr">
          <input class="margin24 input" type="text" placeholder="账号 / 手机号" autocomplete="off" v-model="data.loginForm.username" />
          <svg focusable="false" class="svg2" data-icon="user" width="1em" height="1em" fill="currentColor" aria-hidden="true" viewBox="64 64 896 896">
            <path
              d="M858.5 763.6a374 374 0 00-80.6-119.5 375.63 375.63 0 00-119.5-80.6c-.4-.2-.8-.3-1.2-.5C719.5 518 760 444.7 760 362c0-137-111-248-248-248S264 225 264 362c0 82.7 40.5 156 102.8 201.1-.4.2-.8.3-1.2.5-44.8 18.9-85 46-119.5 80.6a375.63 375.63 0 00-80.6 119.5A371.7 371.7 0 00136 901.8a8 8 0 008 8.2h60c4.4 0 7.9-3.5 8-7.8 2-77.2 33-149.5 87.8-204.3 56.7-56.7 132-87.9 212.2-87.9s155.5 31.2 212.2 87.9C779 752.7 810 825 812 902.2c.1 4.4 3.6 7.8 8 7.8h60a8 8 0 008-8.2c-1-47.8-10.9-94.3-29.5-138.2zM512 534c-45.9 0-89.1-17.9-121.6-50.4S340 407.9 340 362c0-45.9 17.9-89.1 50.4-121.6S466.1 190 512 190s89.1 17.9 121.6 50.4S684 316.1 684 362c0 45.9-17.9 89.1-50.4 121.6S557.9 534 512 534z"
            ></path>
          </svg>
        </div>
        <div class="posr">
          <input
            id="password"
            class="margin24 input password"
            :type="data.passwordType"
            placeholder="密码"
            v-model="data.loginForm.password"
            autocomplete="off"
          />
          <svg focusable="false" class="svg2" data-icon="lock" width="1em" height="1em" fill="currentColor" aria-hidden="true" viewBox="64 64 896 896">
            <path
              d="M832 464h-68V240c0-70.7-57.3-128-128-128H388c-70.7 0-128 57.3-128 128v224h-68c-17.7 0-32 14.3-32 32v384c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V496c0-17.7-14.3-32-32-32zM332 240c0-30.9 25.1-56 56-56h248c30.9 0 56 25.1 56 56v224H332V240zm460 600H232V536h560v304zM484 701v53c0 4.4 3.6 8 8 8h40c4.4 0 8-3.6 8-8v-53a48.01 48.01 0 10-56 0z"
            ></path>
          </svg>
          <!-- 隐藏密码 -->
          <svg
            focusable="false"
            class="svg3"
            data-icon="eye-invisible"
            width="1em"
            height="1em"
            fill="currentColor"
            aria-hidden="true"
            viewBox="64 64 896 896"
            v-if="!data.passwordInvisible"
            @click="
              data.passwordInvisible = true;
              data.passwordType = 'password';
            "
          >
            <path
              d="M942.2 486.2Q889.47 375.11 816.7 305l-50.88 50.88C807.31 395.53 843.45 447.4 874.7 512 791.5 684.2 673.4 766 512 766q-72.67 0-133.87-22.38L323 798.75Q408 838 512 838q288.3 0 430.2-300.3a60.29 60.29 0 000-51.5zm-63.57-320.64L836 122.88a8 8 0 00-11.32 0L715.31 232.2Q624.86 186 512 186q-288.3 0-430.2 300.3a60.3 60.3 0 000 51.5q56.69 119.4 136.5 191.41L112.48 835a8 8 0 000 11.31L155.17 889a8 8 0 0011.31 0l712.15-712.12a8 8 0 000-11.32zM149.3 512C232.6 339.8 350.7 258 512 258c54.54 0 104.13 9.36 149.12 28.39l-70.3 70.3a176 176 0 00-238.13 238.13l-83.42 83.42C223.1 637.49 183.3 582.28 149.3 512zm246.7 0a112.11 112.11 0 01146.2-106.69L401.31 546.2A112 112 0 01396 512z"
            ></path>
            <path
              d="M508 624c-3.46 0-6.87-.16-10.25-.47l-52.82 52.82a176.09 176.09 0 00227.42-227.42l-52.82 52.82c.31 3.38.47 6.79.47 10.25a111.94 111.94 0 01-112 112z"
            ></path>
          </svg>
          <!-- 展示密码 -->
          <svg
            focusable="false"
            class="svg3 password-show"
            data-icon="eye"
            width="1em"
            height="1em"
            fill="currentColor"
            aria-hidden="true"
            viewBox="64 64 896 896"
            v-if="data.passwordInvisible"
            @click="
              data.passwordInvisible = false;
              data.passwordType = 'text';
            "
          >
            <path
              d="M942.2 486.2C847.4 286.5 704.1 186 512 186c-192.2 0-335.4 100.5-430.2 300.3a60.3 60.3 0 000 51.5C176.6 737.5 319.9 838 512 838c192.2 0 335.4-100.5 430.2-300.3 7.7-16.2 7.7-35 0-51.5zM512 766c-161.3 0-279.4-81.8-362.7-254C232.6 339.8 350.7 258 512 258c161.3 0 279.4 81.8 362.7 254C791.5 684.2 673.4 766 512 766zm-4-430c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm0 288c-61.9 0-112-50.1-112-112s50.1-112 112-112 112 50.1 112 112-50.1 112-112 112z"
            ></path>
          </svg>
        </div>
        <div class="margin24 flex-box">
          <div class="posr" style="width: 65%">
            <input type="number" placeholder="验证码" class="input" style="height: 40px" v-model="data.loginForm.code" data.autocomplete="off" />
            <svg
              focusable="false"
              class="svg2"
              style="top: 12px"
              data-icon="safety"
              width="1em"
              height="1em"
              fill="currentColor"
              aria-hidden="true"
              viewBox="0 0 1024 1024"
            >
              <path
                d="M512 64L128 192v384c0 212.1 171.9 384 384 384s384-171.9 384-384V192L512 64zm312 512c0 172.3-139.7 312-312 312S200 748.3 200 576V246l312-110 312 110v330z"
              ></path>
              <path
                d="M378.4 475.1a35.91 35.91 0 00-50.9 0 35.91 35.91 0 000 50.9l129.4 129.4 2.1 2.1a33.98 33.98 0 0048.1 0L730.6 434a33.98 33.98 0 000-48.1l-2.8-2.8a33.98 33.98 0 00-48.1 0L483 579.7 378.4 475.1z"
              ></path>
            </svg>
          </div>
          <img :src="data.codeUrl" alt="" style="cursor: pointer" @click="getCode" />
        </div>
      </form>
      <!-- 手机号登录 -->
      <form action="" class="form cellLogin" v-if="data.activeKey == 1" @keyup.enter="handleLogin">
        <div class="posr">
          <input
            class="height40 margin36 input"
            type="text"
            placeholder="暂不支持大陆地区以外的手机号"
            autocomplete="off"
            v-model="data.phoneLoginForm.username"
          />
          <svg focusable="false" class="svg1" data-icon="user" width="1em" height="1em" fill="currentColor" aria-hidden="true" viewBox="64 64 896 896">
            <path
              d="M858.5 763.6a374 374 0 00-80.6-119.5 375.63 375.63 0 00-119.5-80.6c-.4-.2-.8-.3-1.2-.5C719.5 518 760 444.7 760 362c0-137-111-248-248-248S264 225 264 362c0 82.7 40.5 156 102.8 201.1-.4.2-.8.3-1.2.5-44.8 18.9-85 46-119.5 80.6a375.63 375.63 0 00-80.6 119.5A371.7 371.7 0 00136 901.8a8 8 0 008 8.2h60c4.4 0 7.9-3.5 8-7.8 2-77.2 33-149.5 87.8-204.3 56.7-56.7 132-87.9 212.2-87.9s155.5 31.2 212.2 87.9C779 752.7 810 825 812 902.2c.1 4.4 3.6 7.8 8 7.8h60a8 8 0 008-8.2c-1-47.8-10.9-94.3-29.5-138.2zM512 534c-45.9 0-89.1-17.9-121.6-50.4S340 407.9 340 362c0-45.9 17.9-89.1 50.4-121.6S466.1 190 512 190s89.1 17.9 121.6 50.4S684 316.1 684 362c0 45.9-17.9 89.1-50.4 121.6S557.9 534 512 534z"
            ></path>
          </svg>
        </div>
        <div class="flex-box height40 margin36">
          <input type="password" placeholder="6位数字" class="password" v-model="data.phoneLoginForm.code" autocomplete="off" />
          <button class="codeBtn" @click.prevent="btnValueFun">
            {{ data.btnValue }}
          </button>
        </div>
        <div class="margin24"></div>
      </form>
      <button type="submit" class="submit margin24 pointer" :disabled="data.btnLoading" @click="handleLogin">
        {{ data.btnLoading ? '登录中' : '登录' }}
      </button>
      <div class="margin24 flex-box fontColor">
        <div class="pointer" @click="retrievePassword">忘记密码？</div>
        <div class="pointer" @click="userRegistration">注册新账号</div>
      </div>
    </div>
  </div>
</template>

<script setup name="LoginPage">
import Cookies from 'js-cookie';
import { getALYCode } from '@/api/tool/gen';
import { getCodeImg } from '@/api/login';
import { RSADecrypt } from '@/utils/jsencrypt';
import useUserStore from '@/store/modules/user';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const { proxy } = getCurrentInstance();

const data = reactive({
  codeUrl: '',
  activeKey: 2, // tab页标识
  btnValue: '获取验证码', // 验证码按钮文字
  ALYCodes: 0, // 短信验证码
  // 验证码开关
  captchaOnOff: true,
  // 账号密码登录对象
  loginForm: {
    username: '',
    password: '',
    rememberMe: false,
    code: '', // 验证码
    uuid: '',
  },
  // 手机号登录对象
  phoneLoginForm: {
    username: null, //手机号
    code: null, // 验证码
  },
  btnLoading: false, //登录按钮标识符
  interval: null, // 短信验证码获取定时器
  passwordInvisible: true, //密码框右侧图标展示标识符
  passwordType: '', //密码框展示密码类型
});

const load = () => {
  //找回密码后跳转而来
  if (route.params.passWord) {
    data.activeKey = 2; //进入账号密码登录
  }
  if (route.query.type) {
    switch (route.query.type) {
      case 'web-vp':
        document.getElementsByTagName('title')[0].innerText = '可视化平台';
        break;
      case 'web-dm':
        document.getElementsByTagName('title')[0].innerText = '数据管理平台';
        break;
      default:
        break;
    }
  }
  getCode();
  getCookie();
};

//获取验证码图片
const getCode = () => {
  getCodeImg().then((res) => {
    data.captchaOnOff = res.captchaOnOff === undefined ? true : res.captchaOnOff;
    if (data.captchaOnOff) {
      data.codeUrl = 'data:image/gif;base64,' + res.img;
      data.loginForm.uuid = res.uuid;
    }
  });
};

/**
 * 获取阿里云验证码
 * 倒计时
 */
const btnValueFun = async () => {
  if (!data.phoneLoginForm.username) {
    proxy.$message.warning({
      message: '请输入手机号码获取验证码!',
    });
    return;
  }
  if (!data.interval && data.phoneLoginForm.username) {
    let ALYCode = await getALYCode(data.phoneLoginForm.username + '/2');
    if (ALYCode.code == '200') {
      data.ALYCodes = ALYCode.data;
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

//查看是否有登录信息
const getCookie = () => {
  const username = Cookies.get('username');
  const password = Cookies.get('password');
  const rememberMe = Cookies.get('rememberMe');
  data.loginForm = {
    username: username === undefined ? data.loginForm.username : username,
    password: password === undefined ? data.loginForm.password : RSADecrypt(password),
    rememberMe: rememberMe === undefined ? false : Boolean(rememberMe),
  };
};

//设置用户信息
const handleLogin = () => {
  if (data.activeKey == 1) {
    if (!data.phoneLoginForm.username || !data.phoneLoginForm.code) {
      proxy.$message.warning('请填写手机号码和验证码');
      return;
    }
    let regexp = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/; //验证手机号正则
    let isPhone = regexp.test(data.phoneLoginForm.username);
    if (!isPhone) {
      proxy.$message.warning('请正确输入手机号!!');
      return;
    }
    data.btnLoading = true;
    userStore
      .login(data.phoneLoginForm)
      .then(() => {
        if (localStorage.getItem('DLverificationCodeRegister')) {
          localStorage.removeItem('DLverificationCodeRegister');
        }
        jumpToLoginPlatform();
      })
      .catch(() => {
        data.btnLoading = false;
      });
  } else {
    let message = null; //错误提示信息
    if (!data.loginForm.username) {
      message = '请输入您的账号!';
    } else if (!data.loginForm.password) {
      message = '请输入您的密码!';
    } else if (!data.loginForm.code && data.loginForm.code != 0) {
      message = '请输入验证码!';
    }
    if (message) {
      proxy.$message.warning(message);
      return;
    }
    data.btnLoading = true;
    userStore
      .login(data.loginForm)
      .then((res) => {
        jumpToLoginPlatform();
        if (localStorage.getItem('DLverificationCodeRegister')) {
          localStorage.removeItem('DLverificationCodeRegister');
        }
      })
      .catch((error) => {
        console.log(error);
        data.btnLoading = false;
        getCode();
      });
  }
};

/**
 * 去往找回密码页面
 */
const retrievePassword = () => {
  router.push({
    path: '/passWordRetrieve',
    query: route.query,
  });
};

/**
 * 用户注册
 */
const userRegistration = () => {
  router.push({
    path: '/userReg',
    query: route.query,
  });
};

/**
 * 跳转回登录平台
 */
const jumpToLoginPlatform = async () => {
  const to = await userStore.getOtherPlatformsParameter(); //前往平台参数
  await userStore.deleteOtherPlatformsParameter(); //删除参数
  if (to.type && to.callback) {
    userStore.goToAnotherPlatform(to);
  } else {
    router.push({ path: data.redirect || '/' }).catch(() => {});
  }
};

load();
</script>

<style scoped>
#login {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  background-color: #f5f5f6;
  /* background-image: url("../../../assets/images/login-background.jpg"); */
  background-size: cover;
}
.login-box {
  width: 370px;
  box-sizing: border-box;
  background-size: cover;
  border-radius: 6px;
  background-color: #ffffff;
  padding: 25px 25px 5px 25px;
}

.title {
  margin: 0px auto 20px;
  text-align: center;
  color: #707070;
  font-weight: bold;
  letter-spacing: 5px;
  font-size: 20px;
}
.flex-box {
  display: flex;
  justify-content: space-between;
}
.activeBtn {
  width: 50%;
  text-align: center;
  margin-bottom: 20px;
  padding: 10px 20px;
  cursor: pointer;
  user-select: none;
}
.active {
  border-bottom: 2px solid #40a9ff;
  color: #40a9ff;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
  margin: 0;
}
input[type='number'] {
  -moz-appearance: textfield;
  appearance: textfield;
}
.form {
  display: flex;
  flex-direction: column;
}
input {
  min-height: 32px;
  padding: 0;
  border: 1px solid;
  text-indent: 15px;
  width: 100%;
}
.input {
  text-indent: 30px;
}
input:focus {
  outline: none;
}
h1 {
  margin-top: 0;
  margin-bottom: 0.5em;
  color: rgba(0, 0, 0, 0.85);
  font-weight: 500;
}
.submit {
  width: 100%;
  height: 40px;
  background: rgb(85, 85, 85);
  color: #fff;
}
.margin24 {
  margin-bottom: 24px;
}
.fontColor {
  color: rgb(64, 169, 255);
}
.pointer {
  cursor: pointer;
}
.height40 {
  height: 40px;
}
.margin36 {
  margin-bottom: 36px;
}
/* 短信验证 input前置icon */
.svg1 {
  position: absolute;
  left: 10px;
  top: 13px;
  color: rgba(0, 0, 0, 0.5);
}
/* 账号验证 input前置icon */
.svg2 {
  position: absolute;
  left: 10px;
  top: 9px;
  color: rgba(0, 0, 0, 0.5);
}
/* password input后置icon */
.svg3 {
  position: absolute;
  right: 10px;
  top: 9px;
  color: rgba(0, 0, 0, 0.5);
  cursor: pointer;
}
.posr {
  position: relative;
}
.password {
  flex: 1;
}
.codeBtn {
  min-width: 140px;
  margin-left: 5px;
  background: rgb(85, 85, 85);
  border: 1px;
  padding: 4px 15px;
  color: #fff;
  cursor: pointer;
}
.codeImg {
  height: 34px;
  cursor: pointer;
}
input[type='password']::-ms-reveal {
  display: none;
}
</style>
