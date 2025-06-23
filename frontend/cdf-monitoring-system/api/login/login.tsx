
import axiosInstance from "./base";

interface LoginResponse {
  access: string;
  refresh: string;
  username: string;
  role: string;
}

export const loginUser = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  const response = await axiosInstance.post("api/v1/users/login/", {
    email,
    password,
  });

  const { access, refresh, username, role } = response.data;

  localStorage.setItem("access", access);
  localStorage.setItem("refresh", refresh);
  localStorage.setItem("username", username);
  localStorage.setItem("role", role);

  return response.data;
};
