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
    ];
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
