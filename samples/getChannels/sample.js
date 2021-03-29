function runSample(lumino) {
    return new Promise((resolve) => {
        Promise.allSettled([runWithParams(lumino), runWithoutParams(lumino)])
            .then(results => {
               resolve({
                   runWithParams: results[0].value ? results[0].value : results[0].reason,
                   runWithoutParams: results[1].value ? results[1].value : results[1].reason
               })
            });
    });
}

function runWithoutParams(lumino) {
    return new Promise((resolve) => {
        lumino.getChannels()
            .then(response => {
                resolve(response);
            }).catch(error => {
                resolve(error);
        });
    });
}

function runWithParams(lumino) {
    return new Promise((resolve) => {
        lumino.getChannels('0x4Bc2450bD377c47e4E7e79F830BeE28B37DDe75d')
            .then(response => {
                resolve(response);
            }).catch(error => {
            resolve(error);
        });
    });
}
