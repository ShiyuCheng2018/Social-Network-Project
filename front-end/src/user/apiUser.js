export const read = (userId, token) => {
    return fetch(process.env.REACT_APP_API_URL+`/user/${userId}`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`
        }
    })
        .then(res=>{
            return res.json()
        })
        .catch(err => console.log(err));
};

export const list = () => {
    return fetch(process.env.REACT_APP_API_URL+`/users`, {
        method: "GET",
    })
        .then(res=>{
            return res.json()
        })
        .catch(err => console.log(err));
};

export const remove = (userId, token) => {
    return fetch(process.env.REACT_APP_API_URL+`/user/${userId}`, {
        method: "DELETE",
        headers: {
            Accept: "application/json",
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`
        }
    })
        .then(res=>{
            return res.json()
        })
        .catch(err => console.log(err));
};

export const update = (userId, token, user) => {
    console.log("USER DATA UPDATE: ", user);
    return fetch(`${process.env.REACT_APP_API_URL}/user/${userId}`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(user)
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

export const updateUser = (token, user, next) => {
    if (typeof window !== "undefined") {
        if (localStorage.getItem("jwt")) {
            let auth = JSON.parse(localStorage.getItem("jwt"));
            auth = {token, user: user.user};
            localStorage.setItem("jwt", JSON.stringify(auth));
            next();
        }
    }
};