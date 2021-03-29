function runSample(lumino) {
    return new Promise((resolve) => {
        lumino.leaveNetwork('0x23d078ec6eFD5F692e6ff54fc35E6818C192D3b3').then(response => {
            resolve(response);
        }).catch(error => {
            resolve(error);
        });
    });
}
