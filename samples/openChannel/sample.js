function runSample(lumino, sampleParams) {
    return new Promise((resolve) => {
        lumino.openChannel({
            amountOnWei: sampleParams.amountOnWei ? sampleParams.amountOnWei : 1,
            tokenAddress: sampleParams.tokenAddress ? sampleParams.tokenAddress : '0x714E99c00D4Abf4a8a2Af90Fd40B595C68801C42',
            rskPartnerAddress: sampleParams.partnerAddress ? sampleParams.partnerAddress : '0x3E5B85E29504522DCD923aa503b4C502A64AdB7C',
            rnsPartnerAddress: sampleParams.rnsPartnerAddress ? sampleParams.rnsPartnerAddress : null,
        }).then(response => resolve(response)).catch(error => resolve(error));
    });
}
