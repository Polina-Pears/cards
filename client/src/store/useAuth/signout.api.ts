import URL_PATH from "../../сonstants/url";

async function signoutApi() {
    const res = await fetch(URL_PATH.SIGN_OUT, {
        method: 'POST',
        credentials: "include"
    });

    const data = await res.json();
    if (!res.ok) {
        throw new Error(data?.error || 'Authorization failed');
    }

    return data;
}

export default signoutApi;