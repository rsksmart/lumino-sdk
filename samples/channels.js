const Lumino = require('../dist/index');

const config = { luminoNodeBaseUrl: 'http://localhost:5001/api/v1'};
const lumino = new Lumino(configs);

window.onload = () => {
    lumino.getChannels().then((data) => {
        console.log(data);
    })
    .catch((error) => {
        console.error(error);
    });
}