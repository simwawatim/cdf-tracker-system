import { progress } from "@material-tailwind/react";
import axiosInstance from "../login/base";
import { getAuthHeaders } from "../../utils/users-auth";

interface Category {
  id: number;
  name: string;
  description?: string;
}

interface CreatedBy {
  id: number;
  username: string;
  email: string;
  role?: string;
  dept?: string;
}

export interface Project {
  id: number;
  description: string;
  name: string;
  progress: number;
  status: 'pending' | 'active' | 'completed' | 'on_hold';
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  updated_at: string;
  category: Category | null;
  create_by: CreatedBy | null;
}

interface CreateProjectsPayload {
  id: number;
  description: string;
  name: string;
  progress: number;
  start_date: string | null;
  end_date: string | null;
  category: number | null;
}

interface CreateProjectsResponse {
  id: number;
  description: string;
  name: string;
  progress: number;
  status: 'pending' | 'active' | 'completed' | 'on_hold';
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  updated_at: string; 
  category: number | null;
}

export const getAllProjects = async (): Promise<Project[]> => {
  try {
    const response = await axiosInstance.get("/api/v1/get-all-project/", getAuthHeaders());
    console.log("Response from API:", response.data);
    const data: Project[] = response.data;
    return data;

  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      window.location.href = "/login";
    } else {
      console.log("Error fetching projects:", error);
    }
    throw error;
  }
};


export const createProject = async (payload: CreateProjectsPayload): Promise<CreateProjectsResponse> => {
  try {
    const response = await axiosInstance.post<CreateProjectsResponse>(
      "/api/v1/create-project/",
      payload,
      getAuthHeaders()
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
