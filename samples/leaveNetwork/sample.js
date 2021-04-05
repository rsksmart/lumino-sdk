function runSample(lumino, sampleParams) {
    return new Promise((resolve) => {
        lumino.leaveNetwork(sampleParams.tokenAddress ? sampleParams.tokenAddress : '0x714E99c00D4Abf4a8a2Af90Fd40B595C68801C42')
          .then(response => resolve(response)).catch(error => resolve(error));
    });
}
