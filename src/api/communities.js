import { service } from "@/utils/request.js";

// 获取所有项目信息
export const communities = () => {
  return service.get("/base/manage/communities/list?pagesize=50&page=1");
};

// 提交新增信息
export const addCommunities = (data) => {
  return service.post("/base/manage/communities", data);
};

// 调用编辑接口
export const editCommunities = (communityId) => {
  return service.get(`/base/manage/communities/${communityId}`);
};
// 调用编辑保存接口
export const editCommunitiespPreservation = (data) => {
  return service.put(`/base/manage/communities`, data);
};

// 调用删除接口
export const deleteCommunities = (communityId) => {
  return service.delete(`/base/manage/communities/${communityId}`);
};
