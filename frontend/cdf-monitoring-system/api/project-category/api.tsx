import { getAuthHeaders } from "../../utils/users-auth";
import axiosInstance from "../login/base";

interface ProjectCategory {
    id: number;
    name: string;
    description: string;
}


interface ProjectCategoryByName {
    id: number;
    name: string;

}



interface createProjectCategory{
    id: number;
    name: string;
    description: string;

}

interface createProjectCategoryResponse{
    id: number;
    name: string;
    description: string;

}



export const fetchProjectCategory = async (): Promise<ProjectCategory[]> => {
    try {
        const response = await axiosInstance.get("/api/v1/get-project-category/", getAuthHeaders());
        const data: ProjectCategory[] = response.data;

        const formattedData: ProjectCategory[] = data.map((item) => ({
            id: item.id,
            name: item.name,
            description: item.description,
        }));

        return formattedData;
    } catch (error) {
        console.log("Error fetching project categories:", error);
        throw error;
    }
};


export const createProjectCategory  = async(createProjectCategoryData: createProjectCategory): Promise<createProjectCategoryResponse> => {
    try
    {
        const response = await axiosInstance.post<createProjectCategoryResponse>(
            "/api/v1/project-category/",
            createProjectCategoryData,
            getAuthHeaders()

        );
        return response.data;
    }

    catch(error: any)
    {   
        if (error.response && error.response.status === 401) {
        window.location.href = "/login";
        }

        else 
        {
            console.error("General error:", error.message);
        }
            throw error;
        }
};

export const fetchProjectCategoryByName = async (): Promise<ProjectCategoryByName[]> => {
    try {
        const response = await axiosInstance.get("/api/v1/get_category_by_name/", getAuthHeaders());
        console.log("Project categories fetched successfully:", response.data);

        return response.data;
     
    } catch (error) {
        console.log("Error fetching project categories:", error);
        throw error;
    }
};
