export function loadFile(url: string) {
    return fetch(url);
}

export async function loadJson(url: string) {
    const req = await fetch(url);
    return await req.json();
}
