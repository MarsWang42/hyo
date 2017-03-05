const path = require('path');

module.exports = {
  module: {
    loaders: [
      {
        test: /.s?css$/,
        loaders: ["style", "css", "sass"],
        include: path.resolve(__dirname, '../')
      }
    ]
  }
}
