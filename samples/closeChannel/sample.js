function runSample(lumino, sampleParams) {
    return new Promise((resolve) => {
        lumino.closeChannel({
            tokenAddress: sampleParams.tokenAddress ? sampleParams.tokenAddress : '0x714E99c00D4Abf4a8a2Af90Fd40B595C68801C42',
            partnerAddress: sampleParams.partnerAddress ? sampleParams.partnerAddress : '0x3E5B85E29504522DCD923aa503b4C502A64AdB7C',
        }).then(response => resolve(response)).catch(error => resolve(error));
    });
}
