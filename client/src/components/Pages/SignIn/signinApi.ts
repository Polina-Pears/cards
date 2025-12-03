import URL_PATH from "../../../сonstants/url";

async function signinApi(body: { login: string; password: string }) {
    const res = await fetch(URL_PATH.SIGN_IN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });

    const data = await res.json();
    if (!res.ok) {
        throw new Error(data?.error || 'Authorization failed');
    }
    return data;
}

export default signinApi;