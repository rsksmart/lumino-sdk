function runSample(lumino, sampleParams) {
    return new Promise((resolve) => {
        lumino.getPayments({
            limit: 2
        }).then(response => resolve(response)).catch(error => resolve(error));
    });
}
