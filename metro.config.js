const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Otimizações para melhor performance
config.resolver.platforms = ['ios', 'android', 'native', 'web'];
config.transformer.minifierConfig = {
  keep_fnames: true,
  mangle: {
    keep_fnames: true,
  },
};

module.exports = config; 