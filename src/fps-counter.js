define([], function() {


//http://stackoverflow.com/questions/16432804/recording-fps-in-webgl



    function OverrideRingBuffer(size){
        this.size = size;
        this.head = 0;
        this.buffer = new Array();
    };

    OverrideRingBuffer.prototype.push = function(value){      
        if(this.head >= this.size) this.head -= this.size;    
        this.buffer[this.head] = value;
        this.head++;
    };

    OverrideRingBuffer.prototype.getAverage = function(){
        if(this.buffer.length === 0) return 0;

        var sum = 0;    

        for(var i = 0; i < this.buffer.length; i++){
            sum += this.buffer[i];
        }    

        return (sum / this.buffer.length).toFixed(1);
    };


    function FpsCounter(){
        this.count = 0;
        this.fps = 0;
        this.prevSecond;  
        this.minuteBuffer = new OverrideRingBuffer(30);
    }

    FpsCounter.prototype.update = function(){
        if (!this.prevSecond) {     
            this.prevSecond = new Date().getTime();
                this.count = 1;
        }
        else {
            var currentTime = new Date().getTime();
            var difference = currentTime - this.prevSecond;
            if (difference > 1000) {      
                this.prevSecond = currentTime;
                this.fps = this.count; 
                this.minuteBuffer.push(this.count);
                this.count = 0;
            }
            else{
                this.count++;
            }
        }    
    };

    FpsCounter.prototype.getCountPerMinute = function(){
        return this.minuteBuffer.getAverage();
    };

    FpsCounter.prototype.getCountPerSecond = function(){
        return this.fps;
    };


return FpsCounter;



});
