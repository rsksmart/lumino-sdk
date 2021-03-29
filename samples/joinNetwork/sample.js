function runSample(lumino) {
    return new Promise((resolve) => {
        lumino.joinNetwork().then(response => {
            resolve(response);
        }).catch(error => {
            resolve(error);
        });
    });
}
