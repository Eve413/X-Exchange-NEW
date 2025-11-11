import { authApi } from "@/api";
import { AuthUtils } from "@/utils/auth";
import { storage, STORAGE_KEYS } from "@/utils/storage";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
type PasKey = PasKey;

export interface UserInfo {
  id: string;
  username: string;
  email: string;
  phone: string;
  avatar: string;
  realName?: string;
  idCard?: string;
  kycStatus: "none" | "pending" | "approved" | "rejected";
  level: number;
  vipLevel: number;
  balance: {
    available: number;
    frozen: number;
    total: number;
  };
  permissions: string[];
  roles: string[];
  createTime: string;
  lastLoginTime: string;
}

export interface AuthParams {
  username: string;
  password: string;
  passkey: PasKey;
  device: string;
  appversion: string;
}

export interface LoginParams {
  phone_code: string;
  username: string;
  password: string;
  lang: string;
  passkey: PasKey;
  device: string;
  appversion: string;
}

export interface VerifyPhoneParams {
  phone_code: string;
  username: string;
  lang: string;
  otp: string;
  passkey: PasKey;
  device: string;
  appversion: string;
}

export interface RegisterParams {
  passkey: string;
  device: string;
  appversion: string;
  phone_code: string;
  username: string;
  password: string;
  referral_code: string;
  verification_code: string;
  lang: string;
}

export interface ResetPasswordParams {
  passkey: string;
  device: string;
  appversion: string;
  phone_code: string;
  username: string;
  session_id: string;
  password: string;
  new_password: string;
  lang: string;
}

export interface SettingsParams {
  passkey: string;
  device: string;
  appversion: string;
  lang: string;
}

export interface KycParams {
  passkey: string;
  device: string;
  appversion: string;
  lang: string;
  token: string;
  nationality_id: number;
  tax_residence_id: number;
  has_overseas_bank_account: number;
  id_type: string;
  id_front: string;
  id_back: string;
  full_name: string;
  gender_id: string;
  date_of_birth: string;
  id_number: string;
  address: string;
}

export interface TickersParams {
  passkey: string;
  type: string;
  limit: number;
}

export interface MarketParams {
  passkey: string;
  lang: string;
  symbol: string;
}

export interface OrderBookParams {
  passkey: string;
  limit: string;
  symbol: string;
}

export interface CandleParams {
  passkey: string;
  limit: string;
  symbol: string;
  interval: string;
}

export interface FundFlowParams {
  passkey: string;
  limit: string;
  symbol: string;
  interval: string;
}

export interface ArticleParams {
  passkey: string;
  device: string;
  appversion: string;
  token: string;
  lang: string;
  type: string;
  symbol?: string;
  keyword?: string;
  limit?: number;
}

export interface AlertParams {
  passkey: string;
  device: string;
  appversion: string;
  token: string;
  lang: string;
  symbol?: string;
  amount?: string;
  alert_type?: string;
  frequency?: string;
}

export interface FavoriteParams {
  passkey: string;
  device: string;
  appversion: string;
  token: string;
  lang: string;
  symbol: string;
  favorite: boolean;
}

export interface ProfileParams {
  passkey: string;
  device: string;
  appversion: string;
  token: string;
  lang: string;
}

export interface BannerParams {
  passkey: string;
  device: string;
  appversion: string;
  lang: string;
}

export interface NotificationParams {
  passkey: string;
  device: string;
  appversion: string;
  token: string;
  lang: string;
}

export interface WalletsParams {
  passkey: string;
  device: string;
  appversion: string;
  token: string;
  lang: string;
}

export interface ReferalParams {
  passkey: string;
  device: string;
  appversion: string;
  token: string;
  lang: string;
}

export interface TransferParams {
  passkey: string;
  device: string;
  appversion: string;
  token: string;
  lang: string;
  from_account: string;
  to_account: string;
  baseAsset: string;
  amount: string;
}

export interface WithdrawParams {
  passkey: string;
  device: string;
  appversion: string;
  token: string;
  lang: string;
  baseAsset: string;
  network_id: string;
  wd_address: string;
  amount: string;
}

export const useUserStore = defineStore(
  "user",
  () => {
    const pasKeyAuth = "68de05da-f258-46a4-805d-f0e365ca98e3-android-api";
    const usernameAuth = "coinauth";
    const passwordAuth = "StableCoinAuth$";
    const deviceAuth = "android";
    const appversionAuth = "1.0";

    // 状态定义
    const token = ref<string>("");
    const userInfo = ref<UserInfo | null>(null);
    const isLoggedIn = ref(false);
    const loginLoading = ref(false);
    const registerLoading = ref(false);

    // 计算属性
    const isKycApproved = computed(() => {
      return userInfo.value?.kycStatus === "approved";
    });

    const isVip = computed(() => {
      return (userInfo.value?.vipLevel || 0) > 0;
    });

    const totalBalance = computed(() => {
      return userInfo.value?.balance?.total || 0;
    });

    const availableBalance = computed(() => {
      return userInfo.value?.balance?.available || 0;
    });

    const userLevel = computed(() => {
      return userInfo.value?.level || 0;
    });

    const displayName = computed(() => {
      if (!userInfo.value) return "";
      return userInfo.value.realName || userInfo.value.username;
    });

    // 操作方法
    const setToken = (newToken: string) => {
      token.value = newToken;
      isLoggedIn.value = AuthUtils.isTokenValid(newToken);
      AuthUtils.saveToken(newToken);
    };

    const setUserInfo = (info: UserInfo | null) => {
      userInfo.value = info;
      if (info) {
        storage.setSync(STORAGE_KEYS.USER_INFO, info);
      } else {
        storage.removeSync(STORAGE_KEYS.USER_INFO);
      }
    };

    const clearUserData = () => {
      token.value = "";
      userInfo.value = null;
      isLoggedIn.value = false;
      AuthUtils.clearToken();
      storage.removeSync(STORAGE_KEYS.USER_INFO);
    };

    const authenticateds = async (paramsLogin: LoginParams) => {
      try {
        loginLoading.value = true;

        const params: AuthParams = {
          username: usernameAuth,
          password: passwordAuth,
          passkey: pasKeyAuth,
          device: deviceAuth,
          appversion: appversionAuth,
        };
        // 使用统一API调用（类型安全）

        const response = await authApi.authenticated(params);

        // 假设API返回格式
        if (response.data.status !== "error") {
          // const { token: response.data.data.token} = response.data.data
          setToken(response.data.token);

          const responseLogin = await authApi.login(paramsLogin);

          return responseLogin;
        } else {
          return response;
        }
      } catch (error: unknown) {
        console.error("登录失败:", error);
        const message =
          error instanceof Error ? error.message : "登录失败，请重试";
        return {
          success: false,
          message,
        };
      } finally {
        loginLoading.value = false;
      }
    };
    // 登录
    const login = async (params: LoginParams) => {
      try {
        loginLoading.value = true;

        const response = await authApi.login(params);

        if (response.data.token && response.data.userInfo) {
          setToken(response.data.token);
          setUserInfo(response.data.userInfo);

          return { success: true };
        } else {
          throw new Error("登录数据格式错误");
        }
      } catch (error: any) {
        console.error("登录失败:", error);
        return {
          success: false,
          message: error.message || "登录失败，请重试",
        };
      } finally {
        loginLoading.value = false;
      }
    };

    const verifyPhone = async (paramsVerif: VerifyPhoneParams) => {
      try {
        loginLoading.value = true;

        const params: AuthParams = {
          username: usernameAuth,
          password: passwordAuth,
          passkey: pasKeyAuth,
          device: deviceAuth,
          appversion: appversionAuth,
        };
        // 使用统一API调用（类型安全）

        const response = await authApi.authenticated(params);

        if (response.data.status !== "error") {
          // const { token: response.data.data.token} = response.data.data
          setToken(response.data.token);

          const responseVerif = await authApi.verifyPhone(paramsVerif);

          return responseVerif;
        } else {
          return response;
        }
      } catch (error: any) {
        console.error("登录失败:", error);
        return {
          success: false,
          message: error.message || "登录失败，请重试",
        };
      } finally {
        loginLoading.value = false;
      }
    };

    const sendOTPForgot = async (paramsVerif: VerifyPhoneParams) => {
      try {
        loginLoading.value = true;

        const params: AuthParams = {
          username: usernameAuth,
          password: passwordAuth,
          passkey: pasKeyAuth,
          device: deviceAuth,
          appversion: appversionAuth,
        };
        // 使用统一API调用（类型安全）

        const response = await authApi.authenticated(params);

        if (response.data.status !== "error") {
          // const { token: response.data.data.token} = response.data.data
          setToken(response.data.token);

          const responseVerif = await authApi.sendOTPForgot(paramsVerif);

          return responseVerif;
        } else {
          return response;
        }
      } catch (error: any) {
        console.error("登录失败:", error);
        return {
          success: false,
          message: error.message || "登录失败，请重试",
        };
      } finally {
        loginLoading.value = false;
      }
    };

    // 注册
    const register = async (paramsReg: RegisterParams) => {
      try {
        registerLoading.value = true;

        // 参数验证
        // if (params.loginPassword !== params.confirmPassword) {
        //   throw new Error('两次输入的密码不一致')
        // }

        const params: AuthParams = {
          username: usernameAuth,
          password: passwordAuth,
          passkey: pasKeyAuth,
          device: deviceAuth,
          appversion: appversionAuth,
        };
        // 使用统一API调用（类型安全）

        const response = await authApi.authenticated(params);

        if (response.data.status !== "error") {
          // const { token: response.data.data.token} = response.data.data
          setToken(response.data.token);

          const responseReg = await authApi.register(paramsReg);

          return responseReg;
        } else {
          return response;
        }

        return response;
      } catch (error: any) {
        console.error("注册失败:", error);
        return {
          success: false,
          message: error.message || "注册失败，请重试",
        };
      } finally {
        registerLoading.value = false;
      }
    };

    const resetPassword = async (paramsReset: ResetPasswordParams) => {
      try {
        registerLoading.value = true;

        // 参数验证
        // if (params.loginPassword !== params.confirmPassword) {
        //   throw new Error('两次输入的密码不一致')
        // }

        const params: AuthParams = {
          username: usernameAuth,
          password: passwordAuth,
          passkey: pasKeyAuth,
          device: deviceAuth,
          appversion: appversionAuth,
        };
        // 使用统一API调用（类型安全）

        const response = await authApi.authenticated(params);

        if (response.data.status !== "error") {
          // const { token: response.data.data.token} = response.data.data
          setToken(response.data.token);

          const responseReg = await authApi.resetPassword(paramsReset);

          return responseReg;
        } else {
          return response;
        }

        return response;
      } catch (error: any) {
        console.error("注册失败:", error);
        return {
          success: false,
          message: error.message || "注册失败，请重试",
        };
      } finally {
        registerLoading.value = false;
      }
    };

    const getSettings = async (paramsSettings: SettingsParams) => {
      try {
        loginLoading.value = true;

        const params: AuthParams = {
          username: usernameAuth,
          password: passwordAuth,
          passkey: pasKeyAuth,
          device: deviceAuth,
          appversion: appversionAuth,
        };
        // 使用统一API调用（类型安全）

        const response = await authApi.authenticated(params);

        if (response.data.status !== "error") {
          // const { token: response.data.data.token} = response.data.data
          setToken(response.data.token);

          const responseSettings = await authApi.getSettings(paramsSettings);

          return responseSettings;
        } else {
          return response;
        }
      } catch (error: any) {
        console.error("登录失败:", error);
        return {
          success: false,
          message: error.message || "登录失败，请重试",
        };
      } finally {
        loginLoading.value = false;
      }
    };

    const createdKYC = async (paramsKYC: KycParams) => {
      try {
        registerLoading.value = true;

        // 参数验证
        // if (params.loginPassword !== params.confirmPassword) {
        //   throw new Error('两次输入的密码不一致')
        // }

        const params: AuthParams = {
          username: usernameAuth,
          password: passwordAuth,
          passkey: pasKeyAuth,
          device: deviceAuth,
          appversion: appversionAuth,
        };
        // 使用统一API调用（类型安全）

        const response = await authApi.authenticated(params);

        if (response.data.status !== "error") {
          // const { token: response.data.data.token} = response.data.data

          uni.getStorage({
            key: "userData",
            success: (res) => {
              let token = res.data.data.token;
              paramsKYC.token = token;
              console.log("📦 Data from storage:", token);
            },
            fail: () => {
              console.log("⚠️ No data found");
            },
          });
          // paramsKYC.token = AuthUtils.getUserInfo
          const responseReg = await authApi.createdKYC(paramsKYC);

          return responseReg;
        } else {
          return response;
        }

        return response;
      } catch (error: any) {
        console.error("注册失败:", error);
        return {
          success: false,
          message: error.message || "注册失败，请重试",
        };
      } finally {
        registerLoading.value = false;
      }
    };

    const getTickers = async (params: TickersParams) => {
      try {
        registerLoading.value = true;

        const response = await authApi.gettickers(params);
        return response;
      } catch (error: any) {
        console.error("注册失败:", error);
        return {
          success: false,
          message: error.message || "注册失败，请重试",
        };
      } finally {
        registerLoading.value = false;
      }
    };

    const getMarkets = async (params: MarketParams) => {
      try {
        registerLoading.value = true;

        const paramsAuth: AuthParams = {
          username: usernameAuth,
          password: passwordAuth,
          passkey: pasKeyAuth,
          device: deviceAuth,
          appversion: appversionAuth,
        };

        const responseAuth = await authApi.authenticated(paramsAuth);

        if (responseAuth.data.status !== "error") {
          setToken(responseAuth.data.token);
          const response = await authApi.getMarket(params);

          return response;
        }
        return responseAuth;
      } catch (error: any) {
        console.error("注册失败:", error);
        return {
          success: false,
          message: error.message || "注册失败，请重试",
        };
      } finally {
        registerLoading.value = false;
      }
    };

    const getOrderBook = async (params: OrderBookParams) => {
      try {
        registerLoading.value = true;

        const paramsAuth: AuthParams = {
          username: usernameAuth,
          password: passwordAuth,
          passkey: pasKeyAuth,
          device: deviceAuth,
          appversion: appversionAuth,
        };

        const responseAuth = await authApi.authenticated(paramsAuth);

        if (responseAuth.data.status !== "error") {
          setToken(responseAuth.data.token);
          const response = await authApi.getOrderBook(params);

          return response;
        }
        return responseAuth;
      } catch (error: any) {
        console.error("注册失败:", error);
        return {
          success: false,
          message: error.message || "注册失败，请重试",
        };
      } finally {
        registerLoading.value = false;
      }
    };

    const getCandle = async (params: CandleParams) => {
      try {
        registerLoading.value = true;

        const paramsAuth: AuthParams = {
          username: usernameAuth,
          password: passwordAuth,
          passkey: pasKeyAuth,
          device: deviceAuth,
          appversion: appversionAuth,
        };

        const responseAuth = await authApi.authenticated(paramsAuth);

        if (responseAuth.data.status !== "error") {
          setToken(responseAuth.data.token);
          const response = await authApi.getCandle(params);

          return response;
        }
        return responseAuth;
      } catch (error: any) {
        console.error("注册失败:", error);
        return {
          success: false,
          message: error.message || "注册失败，请重试",
        };
      } finally {
        registerLoading.value = false;
      }
    };

    const getFundFlow = async (params: FundFlowParams) => {
      try {
        registerLoading.value = true;

        const paramsAuth: AuthParams = {
          username: usernameAuth,
          password: passwordAuth,
          passkey: pasKeyAuth,
          device: deviceAuth,
          appversion: appversionAuth,
        };

        const responseAuth = await authApi.authenticated(paramsAuth);

        if (responseAuth.data.status !== "error") {
          setToken(responseAuth.data.token);
          const response = await authApi.getFundFlow(params);

          return response;
        }
        return responseAuth;
      } catch (error: any) {
        console.error("注册失败:", error);
        return {
          success: false,
          message: error.message || "注册失败，请重试",
        };
      } finally {
        registerLoading.value = false;
      }
    };

    const article = async (paramsReset: ArticleParams) => {
      try {
        registerLoading.value = true;
        const params: AuthParams = {
          username: usernameAuth,
          password: passwordAuth,
          passkey: pasKeyAuth,
          device: deviceAuth,
          appversion: appversionAuth,
        };
        // 使用统一API调用（类型安全）

        const response = await authApi.authenticated(params);

        if (response.data.status !== "error") {
          // const { token: response.data.data.token} = response.data.data
          setToken(response.data.token);

          const responseReg = await authApi.article(paramsReset);

          return responseReg;
        } else {
          return response;
        }

        return response;
      } catch (error: any) {
        console.error("注册失败:", error);
        return {
          success: false,
          message: error.message || "注册失败，请重试",
        };
      } finally {
        registerLoading.value = false;
      }
    };

    const createdAlert = async (paramsReset: AlertParams) => {
      try {
        registerLoading.value = true;
        const params: AuthParams = {
          username: usernameAuth,
          password: passwordAuth,
          passkey: pasKeyAuth,
          device: deviceAuth,
          appversion: appversionAuth,
        };
        // 使用统一API调用（类型安全）

        const response = await authApi.authenticated(params);

        if (response.data.status !== "error") {
          // const { token: response.data.data.token} = response.data.data
          setToken(response.data.token);

          const responseReg = await authApi.createdAlert(paramsReset);

          return responseReg;
        } else {
          return response;
        }

        return response;
      } catch (error: any) {
        console.error("注册失败:", error);
        return {
          success: false,
          message: error.message || "注册失败，请重试",
        };
      } finally {
        registerLoading.value = false;
      }
    };

    const favorite = async (favoriteParams: FavoriteParams) => {
      try {
        registerLoading.value = true;
        const params: AuthParams = {
          username: usernameAuth,
          password: passwordAuth,
          passkey: pasKeyAuth,
          device: deviceAuth,
          appversion: appversionAuth,
        };
        // 使用统一API调用（类型安全）

        const response = await authApi.authenticated(params);

        if (response.data.status !== "error") {
          // const { token: response.data.data.token} = response.data.data
          setToken(response.data.token);

          const responseReg = await authApi.favorite(favoriteParams);

          return responseReg;
        } else {
          return response;
        }

        return response;
      } catch (error: any) {
        console.error("注册失败:", error);
        return {
          success: false,
          message: error.message || "注册失败，请重试",
        };
      } finally {
        registerLoading.value = false;
      }
    };

    const getProfile = async (profileParams: ProfileParams) => {
      try {
        registerLoading.value = true;
        const params: AuthParams = {
          username: usernameAuth,
          password: passwordAuth,
          passkey: pasKeyAuth,
          device: deviceAuth,
          appversion: appversionAuth,
        };
        // 使用统一API调用（类型安全）

        const response = await authApi.authenticated(params);

        if (response.data.status !== "error") {
          // const { token: response.data.data.token} = response.data.data
          setToken(response.data.token);

          const responseProfileParams = await authApi.getProfile(profileParams);

          return responseProfileParams;
        } else {
          return response;
        }

        return response;
      } catch (error: any) {
        console.error("注册失败:", error);
        return {
          success: false,
          message: error.message || "注册失败，请重试",
        };
      } finally {
        registerLoading.value = false;
      }
    };

    const getBanner = async (bannerParams: BannerParams) => {
      try {
        registerLoading.value = true;
        const params: AuthParams = {
          username: usernameAuth,
          password: passwordAuth,
          passkey: pasKeyAuth,
          device: deviceAuth,
          appversion: appversionAuth,
        };
        // 使用统一API调用（类型安全）

        const response = await authApi.authenticated(params);

        if (response.data.status !== "error") {
          // const { token: response.data.data.token} = response.data.data
          setToken(response.data.token);

          const responseBannerarams = await authApi.getBanner(bannerParams);

          return responseBannerarams;
        } else {
          return response;
        }

        return response;
      } catch (error: any) {
        console.error("注册失败:", error);
        return {
          success: false,
          message: error.message || "注册失败，请重试",
        };
      } finally {
        registerLoading.value = false;
      }
    };

    const getNotification = async (notificationParams: NotificationParams) => {
      try {
        registerLoading.value = true;
        const params: AuthParams = {
          username: usernameAuth,
          password: passwordAuth,
          passkey: pasKeyAuth,
          device: deviceAuth,
          appversion: appversionAuth,
        };
        // 使用统一API调用（类型安全）

        const response = await authApi.authenticated(params);

        if (response.data.status !== "error") {
          // const { token: response.data.data.token} = response.data.data
          setToken(response.data.token);

          const responseNotifPrarams = await authApi.getNotification(
            notificationParams
          );

          return responseNotifPrarams;
        } else {
          return response;
        }

        return response;
      } catch (error: any) {
        console.error("注册失败:", error);
        return {
          success: false,
          message: error.message || "注册失败，请重试",
        };
      } finally {
        registerLoading.value = false;
      }
    };

    const getWallets = async (walletsParams: WalletsParams) => {
      try {
        registerLoading.value = true;
        const params: AuthParams = {
          username: usernameAuth,
          password: passwordAuth,
          passkey: pasKeyAuth,
          device: deviceAuth,
          appversion: appversionAuth,
        };
        // 使用统一API调用（类型安全）

        const response = await authApi.authenticated(params);

        if (response.data.status !== "error") {
          // const { token: response.data.data.token} = response.data.data
          setToken(response.data.token);

          const responseNotifPrarams = await authApi.getWallets(walletsParams);

          return responseNotifPrarams;
        } else {
          return response;
        }

        return response;
      } catch (error: any) {
        console.error("注册失败:", error);
        return {
          success: false,
          message: error.message || "注册失败，请重试",
        };
      } finally {
        registerLoading.value = false;
      }
    };

    const getReferal = async (referalParams: ReferalParams) => {
      try {
        registerLoading.value = true;
        const params: AuthParams = {
          username: usernameAuth,
          password: passwordAuth,
          passkey: pasKeyAuth,
          device: deviceAuth,
          appversion: appversionAuth,
        };
        // 使用统一API调用（类型安全）

        const response = await authApi.authenticated(params);

        if (response.data.status !== "error") {
          // const { token: response.data.data.token} = response.data.data
          setToken(response.data.token);

          const responseBannerarams = await authApi.getReferal(referalParams);

          return responseBannerarams;
        } else {
          return response;
        }

        return response;
      } catch (error: any) {
        console.error("注册失败:", error);
        return {
          success: false,
          message: error.message || "注册失败，请重试",
        };
      } finally {
        registerLoading.value = false;
      }
    };

    const getCommision = async (referalParams: ReferalParams) => {
      try {
        registerLoading.value = true;
        const params: AuthParams = {
          username: usernameAuth,
          password: passwordAuth,
          passkey: pasKeyAuth,
          device: deviceAuth,
          appversion: appversionAuth,
        };
        // 使用统一API调用（类型安全）

        const response = await authApi.authenticated(params);

        if (response.data.status !== "error") {
          // const { token: response.data.data.token} = response.data.data
          setToken(response.data.token);

          const responseBannerarams = await authApi.getCommissions(
            referalParams
          );

          return responseBannerarams;
        } else {
          return response;
        }

        return response;
      } catch (error: any) {
        console.error("注册失败:", error);
        return {
          success: false,
          message: error.message || "注册失败，请重试",
        };
      } finally {
        registerLoading.value = false;
      }
    };

    const getInvitation = async (referalParams: ReferalParams) => {
      try {
        registerLoading.value = true;
        const params: AuthParams = {
          username: usernameAuth,
          password: passwordAuth,
          passkey: pasKeyAuth,
          device: deviceAuth,
          appversion: appversionAuth,
        };
        // 使用统一API调用（类型安全）

        const response = await authApi.authenticated(params);

        if (response.data.status !== "error") {
          // const { token: response.data.data.token} = response.data.data
          setToken(response.data.token);

          const responseBannerarams = await authApi.getInvitaions(
            referalParams
          );

          return responseBannerarams;
        } else {
          return response;
        }

        return response;
      } catch (error: any) {
        console.error("注册失败:", error);
        return {
          success: false,
          message: error.message || "注册失败，请重试",
        };
      } finally {
        registerLoading.value = false;
      }
    };

    const getTransfer = async (transferParams: TransferParams) => {
      try {
        registerLoading.value = true;
        const params: AuthParams = {
          username: usernameAuth,
          password: passwordAuth,
          passkey: pasKeyAuth,
          device: deviceAuth,
          appversion: appversionAuth,
        };
        // 使用统一API调用（类型安全）

        const response = await authApi.authenticated(params);

        if (response.data.status !== "error") {
          // const { token: response.data.data.token} = response.data.data
          setToken(response.data.token);

          const responseBannerarams = await authApi.getTransfer(transferParams);

          return responseBannerarams;
        } else {
          return response;
        }

        return response;
      } catch (error: any) {
        console.error("注册失败:", error);
        return {
          success: false,
          message: error.message || "注册失败，请重试",
        };
      } finally {
        registerLoading.value = false;
      }
    };

    const postWithdraw = async (withdrawParams: WithdrawParams) => {
      try {
        registerLoading.value = true;
        const params: AuthParams = {
          username: usernameAuth,
          password: passwordAuth,
          passkey: pasKeyAuth,
          device: deviceAuth,
          appversion: appversionAuth,
        };
        // 使用统一API调用（类型安全）

        const response = await authApi.authenticated(params);

        if (response.data.status !== "error") {
          // const { token: response.data.data.token} = response.data.data
          setToken(response.data.token);

          const responseBannerarams = await authApi.postWithdraw(
            withdrawParams
          );

          return responseBannerarams;
        } else {
          return response;
        }

        return response;
      } catch (error: any) {
        console.error("注册失败:", error);
        return {
          success: false,
          message: error.message || "注册失败，请重试",
        };
      } finally {
        registerLoading.value = false;
      }
    };

    // 登出
    const logout = async () => {
      try {
        // 调用登出API
        await authApi.logout();
      } catch (error) {
        console.error("登出API调用失败:", error);
      } finally {
        // 无论API调用是否成功，都清除本地数据
        clearUserData();

        // 跳转到登录页
        const { goLogin } = await import("@/utils/navigation");
        goLogin();
      }
    };

    // 刷新用户信息
    const refreshUserInfo = async () => {
      if (!isLoggedIn.value) return;

      try {
        const response = await userApi.getProfile();
        setUserInfo(response.data);
      } catch (error) {
        console.error("刷新用户信息失败:", error);
      }
    };

    // 更新用户资料
    const updateProfile = async (data: Partial<UserInfo>) => {
      try {
        const response = await userApi.updateProfile(data);
        setUserInfo({ ...userInfo.value!, ...response.data });
        return { success: true };
      } catch (error: any) {
        console.error("更新用户资料失败:", error);
        return {
          success: false,
          message: error.message || "更新失败，请重试",
        };
      }
    };

    // 修改密码
    const changePassword = async (oldPassword: string, newPassword: string) => {
      try {
        await userApi.changePassword({ oldPassword, newPassword });
        return { success: true, message: "密码修改成功" };
      } catch (error: any) {
        console.error("修改密码失败:", error);
        return {
          success: false,
          message: error.message || "密码修改失败，请重试",
        };
      }
    };

    // 初始化（从本地存储恢复状态）
    const init = () => {
      const savedToken = AuthUtils.getToken();
      const savedUserInfo = storage.getSync<UserInfo>(STORAGE_KEYS.USER_INFO);

      if (savedToken && AuthUtils.isTokenValid(savedToken)) {
        setToken(savedToken);
        if (savedUserInfo) {
          setUserInfo(savedUserInfo);
        }
        // 刷新用户信息
        refreshUserInfo();
      } else {
        // token无效，清除数据
        clearUserData();
      }
    };

    return {
      // 状态
      token,
      userInfo,
      isLoggedIn,
      loginLoading,
      registerLoading,

      // 计算属性
      isKycApproved,
      isVip,
      totalBalance,
      availableBalance,
      userLevel,
      displayName,

      // 方法
      setToken,
      setUserInfo,
      clearUserData,
      authenticateds,
      login,
      verifyPhone,
      register,
      logout,
      refreshUserInfo,
      updateProfile,
      changePassword,
      resetPassword,
      sendOTPForgot,
      getSettings,
      createdKYC,
      getTickers,
      getMarkets,
      getOrderBook,
      getCandle,
      getFundFlow,
      article,
      createdAlert,
      favorite,
      getProfile,
      getBanner,
      getNotification,
      getWallets,
      getReferal,
      getCommision,
      getInvitation,
      getTransfer,
      postWithdraw,
      init,

      pasKeyAuth,
      deviceAuth,
      appversionAuth,
    };
  },
  {
    persist: {
      key: "user-store",
      paths: ["token", "userInfo"],
    },
  }
);

export default useUserStore;
