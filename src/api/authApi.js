import axiosInstance from "./axiosInstance";
import { toast } from "react-toastify";

const getToastMessages = () => ({
  loginSuccess: {
    ar: "تم تسجيل الدخول بنجاح",
    en: "Login successful",
  },
  logoutSuccess: {
    ar: "تم تسجيل الخروج بنجاح",
    en: "Logout successful",
  },
  changePasswordSuccess: {
    ar: "تم تغيير كلمة المرور بنجاح",
    en: "Password changed successfully",
  },
  resetPasswordSuccess: {
    ar: "تم إرسال طلب إعادة كلمة المرور",
    en: "Password reset request sent",
  },
  verifyCodeSuccess: {
    ar: "تم التحقق من الرمز بنجاح",
    en: "Code verified successfully",
  },
  confirmResetSuccess: {
    ar: "تم إعادة تعيين كلمة المرور بنجاح",
    en: "Password reset successfully",
  },
  updateProfileSuccess: {
    ar: "تم تحديث الملف الشخصي بنجاح",
    en: "Profile updated successfully",
  },
  registerSuccess: {
    ar: "تم تسجيل الحساب بنجاح",
    en: "Account registered successfully",
  },
  sendCodeSuccess: {
    ar: "تم إرسال رمز التحقق بنجاح",
    en: "Verification code sent successfully",
  },
  verifyOtpSuccess: {
    ar: "تم التحقق من رمز الأمان بنجاح",
    en: "OTP verified successfully",
  },
  updateEmailSuccess: {
    ar: "تم تحديث البريد الإلكتروني بنجاح",
    en: "Email updated successfully",
  },
  updatePhoneSuccess: {
    ar: "تم تحديث رقم الهاتف بنجاح",
    en: "Phone number updated successfully",
  },
  sendOtpSuccess: {
    ar: "تم إرسال رمز التحقق بنجاح",
    en: "OTP sent successfully",
  },
  fcmTokenSuccess: {
    ar: "تم تحديث رمز FCM بنجاح",
    en: "FCM token updated successfully",
  },
  genericError: {
    ar: "حدث خطأ ما. يرجى المحاولة مرة أخرى.",
    en: "An error occurred. Please try again.",
  },
  foundEmail: {
    ar: "هذا الحساب موجود بالفعل",
    en: "This account is already created"
  }
});

const getCurrentLanguage = () => localStorage.getItem("language") || "en";

const handleError = (error) => {
  const language = getCurrentLanguage();
  const toastMessages = getToastMessages();

  if (error.response?.data?.message) {
    toast.error(error.response.data.message);
  } else {
    toast.error(toastMessages.genericError[language]);
  }
};

const AuthAPI = {
  login: async (username, password) => {
    try {
      const response = await axiosInstance.post("/login", { username, password });
      if (response.data.access_token) {
        localStorage.setItem("token", response.data.access_token);
        toast.success(getToastMessages().loginSuccess[getCurrentLanguage()]);
      }
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/logout");
      localStorage.removeItem("token");
      toast.success(getToastMessages().logoutSuccess[getCurrentLanguage()]);
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  changePassword: async (currentPassword, newPassword) => {
    try {
      const response = await axiosInstance.post("/change-password", {
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: newPassword,
      });
      toast.success(getToastMessages().changePasswordSuccess[getCurrentLanguage()]);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  resetPassword: async (username) => {
    try {
      const response = await axiosInstance.post("/reset", { username });
      toast.success(getToastMessages().resetPasswordSuccess[getCurrentLanguage()]);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  checkCode: async (username, code) => {
    try {
      const response = await axiosInstance.post("/check-code", { username, code });
      if (response.data.success === true) {
        toast.success(getToastMessages().verifyCodeSuccess[getCurrentLanguage()])
      }
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  confirmReset: async (username, newPassword) => {
    try {
      const response = await axiosInstance.post("/confirm-reset", {
        username,
        password: newPassword,
        password_confirmation: newPassword,
      });
      toast.success(getToastMessages().confirmResetSuccess[getCurrentLanguage()]);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  updateProfile: async (firstName, lastName, image) => {
    try {
      const formData = new FormData();
      formData.append("first_name", firstName);
      formData.append("last_name", lastName);
      formData.append("image", image);

      const response = await axiosInstance.post("/update-profile", formData);
      toast.success(getToastMessages().updateProfileSuccess[getCurrentLanguage()]);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  register: async ({ email, name, phone, password }) => {
    try {
      const response = await axiosInstance.post("/register", {
        email,
        name,
        phone,
        password,
        password_confirmation: password,
      });
      toast.success(getToastMessages().registerSuccess[getCurrentLanguage()]);
      return response.data;
    } catch (error) {
      toast.error(error.response.data.errors?.phone[0])
      throw error;
    }
  },

  sendOtp: async (email) => {
    try {
      const response = await axiosInstance.post("/send-otp", { email });
      toast.success(getToastMessages().sendOtpSuccess[getCurrentLanguage()]);
      return response.data;
    } catch (error) {
      // handleError(error);
      toast.error(getToastMessages().foundEmail[getCurrentLanguage()]);
      throw error;
    }
  },

  verifyOtp: async (email, code) => {
    try {
      const response = await axiosInstance.post("/verify-otp", { email, code });
      if (response.data.success === true) {
        toast.success(getToastMessages().verifyCodeSuccess[getCurrentLanguage()])
      } return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  updateEmail: async (email, code) => {
    try {
      const response = await axiosInstance.post("/update-email", { email, code });
      toast.success(getToastMessages().updateEmailSuccess[getCurrentLanguage()]);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  updatePhone: async (phone, code) => {
    try {
      const response = await axiosInstance.post("/update-phone", { phone, code });
      toast.success(getToastMessages().updatePhoneSuccess[getCurrentLanguage()]);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  updateFcmToken: async (fcmToken) => {
    try {
      const response = await axiosInstance.post("/fcm-token", null, {
        params: { fcm_token: fcmToken },
      });
      toast.success(getToastMessages().fcmTokenSuccess[getCurrentLanguage()]);
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
};

export default AuthAPI;
