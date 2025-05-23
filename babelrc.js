const { plugin } = require("mongoose");

module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                targets: {
                    node: 'current ',
                },
            },
            
        ],
    ],
    "transform": {
        "\\[jt]sx?$": "babel-jest",
        "\\.css$": "some-css-transformer",
    },
    plugin:["istanbul"]
};
