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
      "6ccb6f5f746003575c6e27c7675b9632435127eedf8d2d1fe862de5c1c82c1c8";
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
