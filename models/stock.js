var mongoose=require('mongoose');
var Schema = mongoose.Schema;
var stockSchema= new Schema({
    name: String,
    like: Number,
    ips:[String]
})
module.exports=mongoose.model('stock',stockSchema);