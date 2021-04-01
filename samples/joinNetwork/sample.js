function runSample(lumino, sampleParams) {
    return new Promise((resolve) => {
        lumino.joinNetwork({
            tokenAddress: sampleParams.tokenAddress,
            fundsOnWei: 100
        }).then(response => resolve(response)).catch(error => resolve(error));
    });
}
