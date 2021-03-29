function runSample(lumino) {
    return new Promise((resolve) => {
        lumino.getPayments({
            limit: 1
        }).then(response => {
            resolve(response);
        }).catch(error => {
            resolve(error);
        });
    });
}
