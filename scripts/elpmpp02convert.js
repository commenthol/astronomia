/**
 * converts ELPMPP02 data to js
 */

'use strict'
const fs = require('fs');
const path = require('path');
const serialize = require('serialize-to-module');

const REG_PERT = /^PERTURBATIONS\.\s+[A-Z]+\.\s+\d+\s+(\d+)/

// truncate treshold
const LIMIT = {
    L: 0.005,
    B: 0.005,
    R: 0.05,
    T: 30.0
}

// Fit to DE405
const MAIN_FACTOR = [
    1 - 7.8873681213335793e-11, // FA for distance
    -4.1702915801577361e-11, // B1
    -3.8692979889352060e-07, // B2
    8.6442279341830251e-08,  // B3
    -6.1353171344411778e-07, // B4
    -9.5590936888903476e-13, // B5
];

const config = {
    attic: path.resolve(__dirname, '../attic'),
    dirname: path.resolve(__dirname, '../data')
}

run();

function parseMain(line) {
    //4i3,2x,f13.5,6f12.2.
    let Is = line.slice(0, 12), Fs = line.slice(12);
    var result = [];
    for (let i = 0; i < 4; i++) {
        result.push(parseInt(Is.slice(i * 3, i * 3 + 3).trim()));
    }
    Fs.trim().split(/\s+/).forEach(v => result.push(parseFloat(v.trim())));
    return result;
}

function parsePert(line) {
    //5x,2d20.13,13i3
    let S = line.slice(5, 25), C = line.slice(25, 45), Is = line.slice(45);
    var result = [];
    result.push(parseFloat(S.trim().replace('D', 'e')));
    result.push(parseFloat(C.trim().replace('D', 'e')));
    for (let i = 0; i < 13; i++) {
        result.push(parseInt(Is.slice(i * 3, i * 3 + 3).trim()));
    }
    return result;
}

function run() {
    const fullData = { main: {}, pert: {} }, truncateData = { main: {}, pert: {} };
    const parts = ['L', 'B', 'R'];
    let filename, lines;
    const [FA, FB1, FB2, FB3, FB4, FB5] = MAIN_FACTOR;
    parts.forEach((part, I) => {
        // read main
        filename = path.resolve(config.attic, `ELP_MAIN.S${I + 1}`);
        lines = fs.readFileSync(filename, 'utf8').split('\n');
        let limit = LIMIT[part] || 0.0;

        fullData.main[part] = [];
        truncateData.main[part] = [];
        for (var i = 1; i < lines.length; i++) {
            let line = lines[i];
            if (line && line.trim()) {
                let [c1, c2, c3, c4, A, b1, b2, b3, b4, b5,] = parseMain(line);
                if (part == 'R') {
                    A *= FA;
                }
                A += FB1 * b1 + FB2 * b2 + FB3 * b3 + FB4 * b4 + FB5 * b5;
                fullData.main[part].push([c1, c2, c3, c4, A]);
                if (Math.abs(A) >= limit) {
                    truncateData.main[part].push([c1, c2, c3, c4, A]);
                }
            }
        }

        // read PERTURBATIONS
        filename = path.resolve(config.attic, `ELP_PERT.S${I + 1}`);
        lines = fs.readFileSync(filename, 'utf8').split('\n');

        fullData.pert[part] = [];
        truncateData.pert[part] = [];
        let power = 0, pertLimit = 0;
        for (var i = 0; i < lines.length; i++) {
            let line = lines[i];
            if (REG_PERT.test(line)) {
                const [, pos] = line.match(REG_PERT);
                power = pos;
                fullData.pert[part][power] = [];
                truncateData.pert[part][power] = [];
                pertLimit = limit / Math.pow((LIMIT.T || 1.0), power);
                continue;
            } else if (line.trim()) {
                // S, C, .....
                let coeff = parsePert(line);
                if (coeff) {
                    let [S, C] = coeff;
                    coeff[0] = Math.hypot(S, C); // Amplitudo
                    coeff[1] = Math.atan2(C, S); // phase
                    fullData.pert[part][power].push(coeff);
                    if (coeff[0] >= pertLimit) {
                        truncateData.pert[part][power].push(coeff);
                    }
                }
            }
        }
    });
    
    // full data
    filename = path.resolve(config.dirname, 'elpMpp02DataFull.js');
    fs.writeFileSync(filename, serialize(fullData, {}), 'utf8');
    
    // truncated data
    filename = path.resolve(config.dirname, 'elpMpp02Data.js');
    fs.writeFileSync(filename, serialize(truncateData, {}), 'utf8')
}
