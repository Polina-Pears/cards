import URL_PATH from "../../сonstants/url";

async function signinApi(body: { login: string; password: string }): Promise<number> {
    const res = await fetch(URL_PATH.SIGN_IN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        credentials: "include"
    });

    const data = await res.json();
    if (!res.ok) {
        throw new Error(data?.error || 'Authorization failed');
    }

    return data.user.id;
}

export default signinApi;