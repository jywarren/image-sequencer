module.exports = {
    getPreviousStep : function () {
        return this.getStep(-1);
    },
    
    getNextStep : function() {
        return this.getStep(1);
    },
    
    getInput : function(offset){
        if(offset + this.getIndex() === 0) offset++;
        return this.getStep(offset - 1).output;
    },
    
    getOuput : function(offset){
        return this.getStep(offset).output;
    }
}