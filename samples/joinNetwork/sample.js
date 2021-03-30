function runSample(lumino, sampleParams) {
    return new Promise((resolve) => {
        lumino.joinNetwork().then(response => resolve(response)).catch(error => resolve(error));
    });
}
