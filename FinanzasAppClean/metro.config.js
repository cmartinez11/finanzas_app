const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Evita que el transformer intente compilar componentes experimentales internos conflictivos
config.resolver.blockList = [
    /node_modules\/react-native\/src\/private\/components\/virtualview\/.*/,
];

module.exports = config;