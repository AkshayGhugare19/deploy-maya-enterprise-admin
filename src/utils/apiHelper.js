import axios from 'axios';
const token = '';
const baseUrl = "https://deploy-maya-enterprise-api.onrender.com";
const getAccessToken = () => { return localStorage.getItem("accesstoken") };

const axiosApi = axios.create({
    baseURL: baseUrl,
});

axiosApi.defaults.headers.common['Authorization'] = token;

axiosApi.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(error),
);

export async function uploadPost(data) {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    // const accessToken = localStorage.getItem("accessToken")
    // myHeaders.append("Authorization", "Bearer " + accessToken);
    const raw = JSON.stringify(data);
    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
    };
    try {
        const uploadUrl = `${baseUrl}/v1/upload-file`;
        const result = await fetch(uploadUrl, requestOptions);
        const response = await result.json();
        return response.data;
    } catch (err) {
        console.log("err errerr ", err.message);
    }
}

export async function apiGET(url, config = {}) {
    let accessToken = getAccessToken();
    axiosApi.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    let getRes = await axiosApi
        .get(url, { ...config })
        .then((response) => response)
        .catch((error) => error.response);
    if (getRes?.data?.code === 401 && getRes?.data?.data === "Please authenticate") {
        await renewToken()
        let accessToken = getAccessToken();
        axiosApi.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        getRes = await axiosApi
            .get(url, { ...config })
            .then((response) => response)
            .catch((error) => error.response);
    }
    return getRes
}
export async function apiPOST(url, data, config = {}) {
    let accessToken = getAccessToken();
    axiosApi.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    let postRes = await axiosApi
        .post(url, { ...data }, { ...config })
        .then((response) => response)
        .catch((error) => error.response);
    if (postRes?.data?.code === 401 && postRes?.data?.data === "Please authenticate") {
        await renewToken()
        let accessToken = getAccessToken();
        axiosApi.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        postRes = await axiosApi
            .post(url, { ...data }, { ...config })
            .then((response) => response)
            .catch((error) => error.response);
    }
    return postRes
}

export async function apiPUT(url, data, config = {}) {
    let accessToken = getAccessToken();
    axiosApi.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    let putRes = await axiosApi
        .put(url, { ...data }, { ...config })
        .then((response) => response)
        .catch((error) => error.response);
    if (putRes?.data?.code === 401 && putRes?.data?.data === "Please authenticate") {
        await renewToken()
        let accessToken = getAccessToken();
        axiosApi.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        putRes = await axiosApi
            .put(url, { ...data }, { ...config })
            .then((response) => response)
            .catch((error) => error.response);
    }
    return putRes
}

export async function apiDELETE(url, config = {}) {
    let accessToken = getAccessToken();
    axiosApi.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    let deleteRes = await axiosApi
        .delete(url, { ...config })
        .then((response) => response)
        .catch((error) => error.response);
    if (deleteRes?.data?.code === 401 && deleteRes?.data?.data === "Please authenticate") {
        await renewToken()
        let accessToken = getAccessToken();
        axiosApi.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        deleteRes = await axiosApi
            .delete(url, { ...config })
            .then((response) => response)
            .catch((error) => error.response);
    }
    return deleteRes
}
export const objectToQueryParam = (obj) => {
    if (typeof obj !== 'object') return ""

    let objKeys = Object.keys(obj)
    if (Object.keys(obj).length) {

        const queryParams = new URLSearchParams()
        objKeys.map(key => {
            if (obj[key]) {
                queryParams.append(key, JSON.stringify(obj[key]))
            }

        })
        return decodeURIComponent(queryParams.toString())
    }

    return ""

}


const renewToken = async () => {
    try {
        let refToken = localStorage.getItem("refreshToken") || "";
        if (refToken == "") {
            localStorage.clear();
            window.location.href = "/"
        }
        let payload = {
            refreshToken: refToken,
        };
        const response = await apiPOST(`/v1/auth/renew-token`, payload);
        if (response?.status === 200) {
            localStorage.setItem("refreshToken", response?.data?.refresh?.token);
            localStorage.setItem("accesstoken", response?.data?.access?.token);
        } else {
            localStorage.clear();
            window.location.href = "/"
        }
    } catch (error) {
        console.error("Error renew token:", error);
    }
}

