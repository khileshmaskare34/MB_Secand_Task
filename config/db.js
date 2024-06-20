
const mongoose = require('mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/MBTaskSeacand")
.then(function(){
    console.log("connected")
}).catch((err)=>{
    console.log(err)
})
        
