import { service } from "@/utils/request.js";

// 获取所有负责人信息
export const userListAll = () => {
  return service.get("/api/user/listAll");
};
