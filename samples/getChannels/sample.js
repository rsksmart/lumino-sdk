function runSample(lumino, sampleParams) {
    return new Promise((resolve) => {
        Promise.allSettled([runWithParams(lumino, sampleParams), runWithoutParams(lumino)])
            .then(results => {
               resolve({
                   runWithParams: results[0].value ? results[0].value : results[0].reason,
                   runWithoutParams: results[1].value ? results[1].value : results[1].reason
               });
            });
    });
}

function runWithoutParams(lumino) {
    return new Promise((resolve) => {
        lumino.getChannels().then(response => resolve(response)).catch(error => resolve(error));
    });
}

function runWithParams(lumino, sampleParams) {
    return new Promise((resolve) => {
        lumino.getChannels(sampleParams.tokenAddress ? sampleParams.tokenAddress : '0x714E99c00D4Abf4a8a2Af90Fd40B595C68801C42')
          .then(response => resolve(response)).catch(error => resolve(error));
    });
}
