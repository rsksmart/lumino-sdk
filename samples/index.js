function getSampleList() {
    return [
        { name: 'Close Channel', ref: 'closeChannel' },
        { name: 'Deposit Tokens', ref: 'depositTokens' },
        { name: 'Get Channels', ref: 'getChannels' },
        { name: 'Get Payments', ref: 'getPayments' },
        { name: 'Join Network', ref: 'joinNetwork' },
        { name: 'Leave Network', ref: 'leaveNetwork' },
        { name: 'Make Payment', ref: 'makePayment' },
        { name: 'Open Channel', ref: 'openChannel' },
        { name: 'Search', ref: 'search' },
        { name: 'Get Tokens', ref: 'getTokens'},
        { name: 'Get Address', ref: 'getAddress'}
    ].sort((a, b) => {
        if (a.name > b.name) {
            return 1;
        } else if (a.name < b.name) {
            return -1;
        } else {
            return 0;
        }
    });
}

function switchLoaderButton(loading) {
    if (loading) {
        document.getElementById('loading-button').hidden = false;
        document.getElementById('sample-button').hidden = true;
    } else {
        document.getElementById('loading-button').hidden = true;
        document.getElementById('sample-button').hidden = false;
    }
}
