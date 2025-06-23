// src/api/users/users.ts
"use client";
import { getAuthHeaders } from "../../utils/users-auth";
import axiosInstance from "../login/base"; 

interface APIUser {
  id: number;
  user: {
    id: number;
    username: string;
    email: string;
  };
  role: string;
  created_at: string;
  updated_at: string;
}

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  created_at: string;
}

export const fetchUsers = async (): Promise<User[]> => {
  try {
    const response = await axiosInstance.get("/api/v1/users/all-users/", getAuthHeaders());
    const data: APIUser[] = response.data;

    const flatUsers: User[] = data.map((item) => ({
      id: item.id,
      username: item.user.username,
      email: item.user.email,
      role: item.role,
      created_at: item.created_at,
    }));

    return flatUsers;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};


interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  role: string;
}

interface CreateUserResponse {
  id: number;
  username: string;
  email: string;
  role: string;
  created_at: string;
}

export const createUser = async (userData: CreateUserRequest): Promise<CreateUserResponse> => {
  try {
    const response = await axiosInstance.post<CreateUserResponse>(
      "/api/v1/users/create/",
      userData,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error("Response error:", error.response.data);
    } else if (error.request) {
      console.error("Request error:", error.request);
    } else {
      console.error("General error:", error.message);
    }
    throw error;
  }
};

