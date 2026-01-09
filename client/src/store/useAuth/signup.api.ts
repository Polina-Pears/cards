import URL_PATH from "../../сonstants/url";


async function signupApi(body: { login: string; password: string, email: string, name: string }) : Promise<number> {
    const res = await fetch(URL_PATH.SIGN_UP, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        credentials: "include"
    });

    const data = await res.json();
    if (!res.ok) {
        throw new Error(data?.error || 'Registration failed');
    }
    return data.user.id;
}

export default signupApi;
