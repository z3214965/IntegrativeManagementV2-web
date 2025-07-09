import router from './router';
import { ElMessage } from 'element-plus';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { getToken } from '@/utils/auth';
import { isHttp, isPathMatch } from '@/utils/validate';
import { isRelogin } from '@/utils/request';
import useUserStore from '@/store/modules/user';
import useSettingsStore from '@/store/modules/settings';
import usePermissionStore from '@/store/modules/permission';

NProgress.configure({ showSpinner: false });

const whiteList = ['/login', '/register', '/userReg', '/passWordRetrieve'];

const isWhiteList = (path) => {
  return whiteList.some((pattern) => isPathMatch(pattern, path));
};

router.beforeEach(async (to, from, next) => {
  NProgress.start();

  useUserStore().deleteOtherPlatformsParameter();
  let token = getToken();
  if (to.path == '/login') {
    //status代表退出登录跳转来的
    if (to.query.status) {
      delete to.query['status'];
      await useUserStore().logOut();
      next({ path: '/login', query: to.query });
      return;
    }
    if (to.query.type && to.query.callback) {
      useUserStore().setOtherPlatformsParameter(to.query);
      if (token) {
        useUserStore().goToAnotherPlatform(to.query);
        return;
      }
    }
  }
  if (token) {
    to.meta.title && useSettingsStore().setTitle(to.meta.title);
    /* has token*/
    if (to.path === '/login') {
      next({ path: '/' });
      NProgress.done();
    } else if (isWhiteList(to.path)) {
      next();
    } else {
      if (useUserStore().roles.length === 0) {
        isRelogin.show = true;
        // 判断当前用户是否已拉取完user_info信息
        await useUserStore()
          .getInfo()
          .then(async (res) => {
            isRelogin.show = false;
            //判断是否是具有进入综合管理界面权限 无权限跳转至官网
            let adminInfo = res.roles.some((v) => v === 'admin' || v === 'dilu_internal' || v.indexOf('admin') != -1);
            if (!adminInfo) {
              location.href = 'https://dilutech.com/';
              return;
            }
            await usePermissionStore()
              .generateRoutes()
              .then((accessRoutes) => {
                // 根据roles权限生成可访问的路由表
                accessRoutes.forEach((route) => {
                  if (!isHttp(route.path)) {
                    router.addRoute(route); // 动态添加可访问路由表
                  }
                });
                next({ ...to, replace: true }); // hack方法 确保addRoutes已完成
              });
          })
          .catch((err) => {
            useUserStore()
              .logOut()
              .then(() => {
                ElMessage.error(err);
                next({ path: '/' });
              });
          });
      } else {
        next();
      }
    }
  } else {
    // 没有token
    if (isWhiteList(to.path)) {
      // 在免登录白名单，直接进入
      next();
    } else {
      next(`/login?redirect=${to.fullPath}`); // 否则全部重定向到登录页
      NProgress.done();
    }
  }
});

router.afterEach(() => {
  NProgress.done();
});
