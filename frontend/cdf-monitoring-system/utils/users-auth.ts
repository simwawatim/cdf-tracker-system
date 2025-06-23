export const getAuthHeaders = () => {
  const token = localStorage.getItem("access");

  if (!token) {
    window.location.href = "/login";
    return; 
  }

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};
