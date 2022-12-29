const xhr = new XMLHttpRequest();

export function get({ url }) {
    xhr.open('GET', url);
    xhr.send(null);
    return new Promise((resolve, reject) => {
        xhr.onload = function (e) {
            let { status, response } = e.target;
            if (status == '200') {
                resolve(response);
            } else {

            }
        }

    })
}

function post({ url, params }) {
    let param = new FormData();

    for (const key in params) {
        param.append(key, params[key]);
    }

    xhr.open('POST', url);

    xhr.send(param)

    return new Promise((resolve, reject) => {
        xhr.onload = function (e) {
            let { status, response } = e.target;
            if (status == '200') {
                resolve(response);
            } else {

            }
        }
    })
}

