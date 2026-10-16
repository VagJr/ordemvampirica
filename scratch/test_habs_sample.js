const fs = require('fs');

// Test ability names in game
const testAbilities = [
    { id: 'hab1', nome: 'Dardo de Sangue', icone: '🩸', custoFuria: 2, custoGts: 40, cor_hex: '#ff1e2f' },
    { id: 'hab2', nome: 'Mortalha Sombria', icone: '🌑', custoFuria: 3, custoGts: 60, cor_hex: '#9333ea' },
    { id: 'hab3', nome: 'Transfusão Rápida', icone: '💉', custoFuria: 1, custoGts: 30, cor_hex: '#00ff88' },
    { id: 'hab4', nome: 'Chama Abissal', icone: '🔥', custoFuria: 4, custoGts: 80, cor_hex: '#f59e0b' }
];

console.log('Sample abilities loaded:', testAbilities.length);
