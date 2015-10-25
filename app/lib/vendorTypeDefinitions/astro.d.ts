declare class Astro {
    constructor(serverName:string, appName:string);
    authenticate(loginData:LoginData);
    portfolios();
    treeFor(treeID: string);
}

interface LoginData {
    username: string;
    password: string;
}