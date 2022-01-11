import axios from "axios";
import { message } from "ant-design-vue";
const service = axios.create({
  // baseURL: "https://api5.cvoon.com/base/manage",
  baseURL: "https://api5.cvoon.com",
  timeout: 100000,
});

service.interceptors.request.use(
  ({ headers, params = {}, data = {}, ...rest }) => {
    const token =
      "7564d9d8bb7cb24567a2b48f614cf81ba3f7703a3652ebaeca0d790cb3bddb7a";
    return {
      ...rest,
      params: { ...params },
      data: { ...data },
      headers: { ...headers, token },
    };
  }
);

service.interceptors.response.use((response) => {
  console.log(response);
  if (response.data.code !== 200) {
    message.error(response.data.message);
    throw new Error(response.data);
  } else {
    return response.data;
  }
});

export { service };
