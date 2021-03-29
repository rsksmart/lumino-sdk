function runSample(lumino) {
    return new Promise((resolve) => {
        lumino.openChannel({
            tokenAddress: '0x23d078ec6eFD5F692e6ff54fc35E6818C192D3b3',
            amountOnWei: 1,
            rskPartnerAddress: '0x3E5B85E29504522DCD923aa503b4C502A64AdB7C',
            // rnsPartnerAddress: 'someone.rsk'
        }).then(response => {
            resolve(response);
        }).catch(error => {
            resolve(error);
        });
    });
}
