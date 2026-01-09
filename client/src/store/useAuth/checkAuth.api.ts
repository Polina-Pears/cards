import URL_PATH from "../../сonstants/url";

async function checkAuthApi(): Promise<number> {
    const res = await fetch(URL_PATH.ME, {
        method: 'POST',
        credentials: "include"
    });

    const data = await res.json();
    if (!res.ok) {
        throw new Error(data?.error || 'Authorization failed');
    }

    return data.user;
}

export default checkAuthApi;