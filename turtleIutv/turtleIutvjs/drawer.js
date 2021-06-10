function Drawer(start,actions) {
    this.actions = actions;
    this.path = new paper.Path();
    this.path.strokeColor = 'black';
    this.path.strokeWidth = 3;
    this.path.add(start);
    this.path.add(start);

    this.speed = 1;
    this.penMove = true;
    this.dx = 1;
    this.dy = 1;
    this.actionCount = 0;
    
    // Arrow or turtle which shows the path which is drawn
    var head = new paper.Path.RegularPolygon(new paper.Point(start.x,start.y), 3, 8);
    head.rotate(-30);
    head.fillColor = "green";
    var tail = new paper.Path.RegularPolygon(new paper.Point(start.x-4,start.y), 4, 5);
    tail.fillColor = "green";
    this.arrow = new paper.Group([tail, head]);

    this.arrivalPoint = undefined;
    this.lastPoint = new paper.Point(start.x, start.y); // last Point is the last point placed
    this.currentSegment = this.getCurrentSegment(); // currentSegment is the current segment to be plotted
}
Drawer.prototype.doDeplacement = function() {
    //Animates a movement of a segment
    var currentAction = this.getCurrentAction();
    // the arrival point is not known at the start of plotting of a segment, it must be initialized before using it
    if(this.arrivalPoint===undefined){
        this.arrivalPoint = new paper.Point(currentAction.point.x,currentAction.point.y);
        this.dx=this.getDx();
        this.dy=this.getDy();
    }
    if(this.isPointReached()){
        console.log("Point reached");
        this.path.add(new paper.Point(currentAction.point.x,currentAction.point.y));
        this.lastPoint = new paper.Point(currentAction.point.x,currentAction.point.y);
        this.currentSegment = this.getCurrentSegment();
        this.arrivalPoint = undefined;
        // next action
        this.actionCount++;

    }else {
        // Drawing current segment
        this.drawCurrentSegment();
    }
};
Drawer.prototype.doRotation = function(){
    var currentAction = this.getCurrentAction();
    if(currentAction.value < this.speed){
        // Finish rotation
        this.arrow.rotate(currentAction.value*currentAction.sense);
        this.actionCount++;
    }else{// do rotation
        this.arrow.rotate(this.speed*currentAction.sense);
        currentAction.value-=this.speed;
    }
};
Drawer.prototype.drawCurrentSegment = function() {
    // add a variation to the current segment to make the animation and a translation of the arrow
    this.currentSegment.y += this.dy;
    this.currentSegment.x += this.dx;
    this.arrow.translate(this.dx,this.dy);
};
Drawer.prototype.doPenMove = function(){
    var currentAction = this.getCurrentAction();
    if(currentAction.value!=this.penMove){
        this.penMove=!this.penMove;
        if(this.penMove){

        }else{
            
        }
        this.actionCount++;
    }
};
Drawer.prototype.isFinish = function() {
    return !(this.actionCount <= this.actions.length-1);
};
Drawer.prototype.isPointReached = function() {
    // If the variation to be added is greater than the remaining distance
    // We stop and add the end that remains, otherwise the end point will be overwritten
    if(Math.abs(this.arrivalPoint.x-this.currentSegment.x)< Math.abs(this.dx) || Math.abs(this.arrivalPoint.y-this.currentSegment.y)< Math.abs(this.dy) ){
        this.arrow.translate(this.arrivalPoint.x-this.currentSegment.x,this.arrivalPoint.y-this.currentSegment.y);
        this.currentSegment.x = this.arrivalPoint.x;
        this.currentSegment.y = this.arrivalPoint.y;
        return true;
    }
    return false;
};
Drawer.prototype.getCurrentSegment = function() {
    return this.path.segments[this.path.segments.length-1].point;
};
Drawer.prototype.getCurrentSegment  = function() {
    return this.path.segments[this.path.segments.length-1].point;
};
Drawer.prototype.getCurrentAction = function (){ // return the current action
    return this.actions[this.actionCount];
};
Drawer.prototype.getDx = function (){ // return the current action
    return (this.arrivalPoint.x - this.lastPoint.x)*this.speed/this.arrivalPoint.getDistance(this.lastPoint);
};
Drawer.prototype.getDy = function (){ // return the current action
    return (this.arrivalPoint.y - this.lastPoint.y)*this.speed/(this.arrivalPoint.getDistance(this.lastPoint));
};