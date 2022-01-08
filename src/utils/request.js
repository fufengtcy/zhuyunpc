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
      "c28e2a1195d46825ac522fe12b5137c745642d5e98e65007b8d24daf64fd4633";
    return {
      ...rest,
      params: { ...params },
      data: { ...data },
      headers: { ...headers, token },
    };
  }
);

service.interceptors.response.use((response) => {
  if (response.data.code !== 200) {
    message.error(response.data.message);
    return false;
  } else {
    return response.data;
  }
});

export { service };
