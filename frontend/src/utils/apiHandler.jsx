import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000",
});

export const getRequest = async ({ endpoint }) => {
  try {
    const res = await axiosInstance.get(endpoint);
    return { ...res.data, ok: true };
  } catch (error) {
    if (error.response) {
      return error.response.data;
    }

    throw new Error(error.message);
  }
};

export const postRequest = async ({ endpoint, data }) => {
  try {
    const res = await axiosInstance.post(endpoint, data);
    return { ...res.data, ok: true };
  } catch (error) {
    if (error.response) {
      return error.response.data;
    }

    throw new Error(error.message);
  }
};

export const patchRequest = async ({ endpoint, data }) => {
  try {
    const res = await axiosInstance.patch(endpoint, data);
    return { ...res.data, ok: true };
  } catch (error) {
    if (error.response) {
      return error.response.data;
    }

    throw new Error(error.message);
  }
};

export const deleteRequest = async ({ endpoint, data }) => {
  try {
    const res = await axiosInstance.delete(endpoint, data);
    return { ...res.data, ok: true };
  } catch (error) {
    if (error.response) {
      return error.response.data;
    }

    throw new Error(error.message);
  }
};
