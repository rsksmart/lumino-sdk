const Lumino = Lumino.default;

let configs = {};
configs['luminoNodeBaseUrl'] = 'http://localhost:5001/api/v1/';
configs['rskRpcNodeBaseUrl'] = 'http://localhost:4444';
configs['nodeLuminoAddress'] = '0x6be2285f7F097FE23aE27e392cDac8dcDaAbf36C';

let params = {};
params.partnerAddress = "0x3E5B85E29504522DCD923aa503b4C502A64AdB7C";
params.tokenAddress = "0x23d078ec6eFD5F692e6ff54fc35E6818C192D3b3"; // PEPE3 TOKEN

let data = {};
data.amount = 1;

const lumino = new Lumino(configs);

lumino.makePayment(data, params)
    .then((response) => {
        document.getElementById("json").innerHTML = JSON.stringify(response, undefined, 2);
    })
    .catch((error) => {
        console.error(error);
    });
