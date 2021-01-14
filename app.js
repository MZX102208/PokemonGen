var http = require('http');
let Pokedex = require('pokedex-promise-v2');

let pokedex = new Pokedex();

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

var server = http.createServer((req, res) => {   // 2 - creating server
    if (req.url.includes('/')) {
        let typeString = req.url.substr(1);
        pokedex.getTypeByName(typeString).then((typeResponse) => {
            let randomPokemonIndex = getRandomInt(typeResponse.pokemon.length);
            console.log(typeResponse.pokemon[randomPokemonIndex].pokemon.name);
            pokedex.getPokemonByName(typeResponse.pokemon[randomPokemonIndex].pokemon.name).then((pokemonResponse) => {
                const name = pokemonResponse.name;
                const moves = pokemonResponse.moves;
                const abilities = pokemonResponse.abilities;
                const imageUrl = pokemonResponse.sprites.front_default;
                // GENERATE RANDOM MOVES HERE
                let validMoveList = [];
                moves.forEach(moveInfo => {
                    let versionGroupDetails = moveInfo.version_group_details.pop();
                    if (versionGroupDetails && versionGroupDetails.move_learn_method.name === 'level-up') {
                        validMoveList.push(moveInfo.move);
                    }
                });
                let selectedMoveIndices = [];
                let moveListString = '';
                for (let i = 0; i < Math.min(4, validMoveList.length); i++) {
                    let randomIndex = getRandomInt(validMoveList.length);
                    while (selectedMoveIndices.includes(randomIndex)) {
                        randomIndex = (randomIndex == validMoveList.length - 1) ? 0 : (randomIndex + 1);
                    }
                    selectedMoveIndices.push(randomIndex);

                    moveListString += validMoveList[randomIndex].name + '<br />';
                }

                // GENERATE RANDOM ABILITY HERE
                const selectedAbility = abilities[getRandomInt(abilities.length)].ability.name;

                // SEND RESPONSE HERE
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.write(`<html><body>${name}<br />${imageUrl}<br />${selectedAbility}<br />${moveListString}</body></html>`);
                res.end();
            });
        }).catch(error => {
            console.log(error);
            res.writeHead(400, { 'Content-Type': 'text/html' });
            res.write('<html><body>Invalid Request</body></html>');
            res.end();
        });
    }
});

server.listen(5000); //3 - listen for any incoming requests

console.log('Node.js web server at port 5000 is running..');
