function runSample(lumino, sampleParams) {
    return new Promise((resolve) => {
        lumino.search({
            query: 2,
            onlyReceivers: false
        }).then(response => resolve(response)).catch(error => resolve(error));
    });
}
