const tkStr = "token";
const nameStr = "name";

const Auth = Object.freeze({
    getToken: () => { return localStorage.getItem(tkStr) },
    setToken: (token) => { localStorage.setItem(tkStr, token) },
    removeToken: () => { localStorage.removeItem(tkStr) },
    getName: () => { return localStorage.getItem(nameStr) },
    setName: (name) => { localStorage.setItem(nameStr, name) },
    removeName: () => { localStorage.removeItem(nameStr) },
})

export default Auth;