module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    'macros',
    [
      'module-resolver',
      {
        alias: {
          lib: 'src',
        },
      },
    ],
  ],
};
