import { service } from "@/utils/request.js";

// 获取所属项目信息
export const userListAll = () => {
  return service.get("/base/manage/communities/select");
};
export const balconyList = (community_ids) => {
  return service.get(
    `/base/manage/buildings/list/select?community_ids=${community_ids}`
  );
};
