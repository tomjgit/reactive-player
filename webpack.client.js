var path =require("path"),
    webpack = require("webpack"),
    extractTextPlugin = require("extract-text-webpack-plugin");
    

const dirname = path.resolve("./");

const vendorModules = ["jquery"];


function createConfig(isDebug){
    const devTool =isDebug?"eval-source-map":"source-map";
    const plugins =[new webpack.optimize.CommonsChunkPlugin("vendor","vendor.js")];

    
    const cssLoader = {test: /\.css$/, loader:"style!css" };
    const sassLoader = {test: /\.scss/, loader:"style!css!sass" };
    const appEntry = ["./src/client/application.js"];
        
    if(!isDebug){
        plugins.push(new webpack.optimize.UglifyJsPlugin());
        plugins.push(new extractTextPlugin("[name].css"));
        
        cssLoader.loader = extractTextPlugin.extract("style", "css");
        sassLoader.loader = extractTextPlugin.extract("style","css!sass");
    }else{
        plugins.push(new webpack.HotModuleReplacementPlugin());
        appEntry.splice(0,0,"webpack-hot-middleware/client");
    }
    
    return {
        devtool:devTool,
        entry:{
            application: appEntry,
            vendor: vendorModules
        },
        output: {
            path: path.join(dirname, "public", "build"),
            filename: "[name].js",
            publicPath: "/build/"
        },
        resolve:{
            alias:{
                shared: path.join(dirname, "src","shared")
            }
        },
        module:{
            loaders:[
                {test: /\.js$/, loader:"babel", exlude: /node_modules/},
                {test: /\.js$/, loader:"eslint", exlude: /node_modules/},
                {test: /\.(png|jpg|jpeg|gif|woff|ttf|eot|svg|woff2)/, loader:"url-loader?limit=1024"},
                cssLoader,
                sassLoader
            ]
        },
        plugins:plugins
    };
}

module.exports = createConfig(true);
module.exports.create = createConfig;