
module.exports = (req, res, next) => {
    /**  all kind of responses */ 
     res.globalResponse = function(responseObj) {
         this.send({ success : responseObj.success, message: responseObj.message, data: responseObj.data});
     }
     next();
 }