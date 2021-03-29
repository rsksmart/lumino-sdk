const Lumino = Lumino.default;

let configs = {};
configs['luminoNodeBaseUrl'] = 'http://localhost:5001/api/v1/';
configs['rskRpcNodeBaseUrl'] = 'http://localhost:4444';
configs['nodeLuminoAddress'] = '0x6be2285f7F097FE23aE27e392cDac8dcDaAbf36C';

let data = {};
data.rskPartnerAddress = "0x3E5B85E29504522DCD923aa503b4C502A64AdB7C";
data.tokenAddress = "0x714E99c00D4Abf4a8a2Af90Fd40B595C68801C42"; // PEPE TOKEN
data.amount = 0.01;

const lumino = new Lumino(configs);

lumino.openChannel(data)
    .then((response) => {
        document.getElementById("json").innerHTML = JSON.stringify(response, undefined, 2);
    })
    .catch((error) => {
        console.error(error);
    });
