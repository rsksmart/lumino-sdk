function runSample(lumino) {
    return new Promise((resolve) => {
        lumino.depositTokens({
            amountOnWei: 1,
            tokenAddress: '0x23d078ec6eFD5F692e6ff54fc35E6818C192D3b3',
            partnerAddress: '0x3E5B85E29504522DCD923aa503b4C502A64AdB7C'
        }).then(response => {
            resolve(response);
        }).catch(error => {
            resolve(error);
        });
    });
}
