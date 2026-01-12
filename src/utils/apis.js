const BASE_URL = "http://localhost:3002/api/v1/";

export const userEndpoints = {
  SIGNUP_API: BASE_URL + "user/signup",
  VERIFY_API: BASE_URL + "user/verify-email",
  LOGIN_API: BASE_URL + "user/login",
  LOGOUT_API: BASE_URL + "user/logout",
};

export const taskEndpoints = {
  CREATE_TASK_API: BASE_URL + "task/createtask",
  GET_ALL_TASK_API: BASE_URL + "task/getalltask",
  UPDATE_TASK_API: BASE_URL + "task/updatetask",
  DELETE_TASK_API: BASE_URL + "task/deletetask",
  DELETE_ALL_TASK_API: BASE_URL + "task/deletealltask",
};
