/**
 * Class Drawer
 * This class is used to manage the actions
 * to be performed to draw and make animations.
 * 
 * The attributes of the class
 * @param {Array<Object>} actions - Action table to perform, the possible types of actions are: shifting, rotation, speed, pen, penColor, penSize
 * @param {Path} path - Path containing the points to be drawn
 * @param {Boolean} penMove - If this value is TRUE a displacement is drawn, otherwise the stylus is raised and no segment is drawn.
 * @param {Double} dx - Variation of a displacement on the x-axis
 * @param {Double} dy - Variation of a displacement on the y-axis
 * @param {Double} x - Current pen or turtle position on the x-axis
 * @param {Double} y - Current pen or turtle position on the y-axis
 * @param {Int} actionCount - Number indicating the position of the current action in the @actions array
 * @param {Color} turtleColour - Color of the @turtle 
 * @param {Groupe} turtle - Turtle in green color indicating the route
 * @param {Point} arrivalPoint - The point to be reached by drawing the @currentSegment
 * @param {Point} lastPoint - The start point of the @currentSegment , so it is the last point attains
 * @param {Segment} currentSegment - Current segment to be traced during the animation
 */

/** Construtor
 * Create an instance of the class
 * @param {Point} start - Start point of the @path
 * @param {Array<Object>} actions - Action table to perform
 * @return {Drawer(Object)} - new Drawer(start,actions)
 */
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
    this.x = start.x;
    this.y = start.y;
    this.actionCount = 0;

    this.turtleColour = "green";
    this.turtle = this.draw_turtle();

    this.arrivalPoint = undefined;
    this.lastPoint = new paper.Point(this.x, this.y); // last Point is the last point placed
    this.currentSegment = this.getCurrentSegment(); // currentSegment is the current segment to be plotted
    
};

/**
 * Initialize the @turtle and return it as a paper.Groupe
 * @return {paper.Group}
 */
Drawer.prototype.draw_turtle = function() {

    var tail = new paper.Path.RegularPolygon(new paper.Point(this.x-11,this.y), 3, 3);
    tail.rotate(30);
    tail.fillColor = this.turtleColour;
    var circlePoint = new paper.Point(this.x, this.y);

    var circle1 = new paper.Path.Circle(circlePoint, 10);
    circle1.fillColor = this.turtleColour;

    circlePoint = new paper.Point(this.x+7, this.y-10);

    var circle2 = new paper.Path.Circle(circlePoint, 3);
    circle2.fillColor = this.turtleColour;

    circlePoint = new paper.Point(this.x-7, this.y+10);

    var circle3 = new paper.Path.Circle(circlePoint, 3);
    circle3.fillColor = this.turtleColour;

    circlePoint = new paper.Point(this.x+7, this.y+10);

    var circle4 = new paper.Path.Circle(circlePoint, 3);
    circle4.fillColor = this.turtleColour;

    circlePoint = new paper.Point(this.x-7, this.y-10);

    var circle5 = new paper.Path.Circle(circlePoint, 3);
    circle5.fillColor = this.turtleColour;

    circlePoint = new paper.Point(this.x+10, this.y);

    var circle6 = new paper.Path.Circle(circlePoint, 5);
    circle6.fillColor = this.turtleColour;

    return  new paper.Group([circle1,circle2,circle3,circle4,circle5,circle6,tail]);
};

/**
 * Animates a movement of a segment
 * The @arrivalPoint is not known at the start of plotting of a segment,
 * it must be initialized before using it, and variations also (@dx and @dy )
 * When @drawCurrentSegment_ if the @currentSegment is done and @penMove , add a new Point to prepare next @currentSegment
 * @return {nothing}
 */
Drawer.prototype.doDeplacement = function() {
    var currentAction = this.getCurrentAction();
    if(this.arrivalPoint===undefined){
        this.arrivalPoint = new paper.Point(currentAction.point.x,currentAction.point.y);
        this.dx=this.getDx();
        this.dy=this.getDy();
    }
    if(this.isPointReached()){
        if(this.penMove){
            this.path.add(new paper.Point(currentAction.point.x,currentAction.point.y));
            this.lastPoint = new paper.Point(currentAction.point.x,currentAction.point.y);
            this.currentSegment = this.getCurrentSegment();
            this.arrivalPoint = undefined;
        }
        this.actionCount++;
    }else {
        this.drawCurrentSegment();
    }
};

/**
 * Rotate turtle at an angle @currentAction_value in an @sense direction
 * @return {nothing}
 */
Drawer.prototype.doRotation = function(){
    var currentAction = this.getCurrentAction();
    if(currentAction.value <= this.speed){
        // Finish rotation
        this.turtle.rotate(currentAction.value*currentAction.sense);
        this.actionCount++;
    }else{// do rotation
        console.log(currentAction.value);
        this.turtle.rotate(this.speed*currentAction.sense);
        currentAction.value-=this.speed;
    }
};

/**
 * Add a variation (@dx and @dy ) to the @currentSegment to make the animation and a translation of the @turtle , until it reaches the @arrivalPoint
 * @return {nothing}
 */
Drawer.prototype.drawCurrentSegment = function() {
    if(this.penMove){
        this.currentSegment.x += this.dx;
        this.currentSegment.y += this.dy;
    }
    this.turtle.translate(this.dx,this.dy);
    this.x = this.turtle.position.x;
    this.y = this.turtle.position.y;
};
/**
 * Change pen if the tracing should be done or not
 * @return {nothing}
 */
Drawer.prototype.doPenMove = function(){
    var currentAction = this.getCurrentAction();
    if(currentAction.value!=this.penMove){
        // if the value is changed
        this.penMove=!this.penMove;
        if(this.penMove){
            // if it is true, create a new path to start drawing
            var color = this.path.strokeColor ;
            var size = this.path.strokeWidth;
            this.updatePath(color, size);
        }
    }
    this.actionCount++;
};

/**
 * Change pen color if the new color of the @currentAction is different to @path color
 * @return {nothing}
 */
Drawer.prototype.changePenColor = function(){
    var currentAction = this.getCurrentAction();
    if(this.path.strokeColor != currentAction.value){
        var size = this.path.strokeWidth;
        this.updatePath(currentAction.value, size);
    }
    this.actionCount++;
};

/**
 * Change pen size if the new size of the @currentAction is different to @path size
 * @return {nothing}
 */
Drawer.prototype.changePenSize = function(){
    var currentAction = this.getCurrentAction();
    if(this.path.strokeWidth != currentAction.value){
        var color = this.path.strokeColor;
        this.updatePath(color, currentAction.value);
    }
    this.actionCount++;
};

/**
 * Reinitialize the @path
 * Then update variables @arrivalPoint , @lastPoint  and @currentSegment
 * @param {Color} color - The new color of the @path
 * @param {Int} size - The new size of the @path
 * @return {nothing}
 */
Drawer.prototype.updatePath = function(color,size){
    this.turtle.clear();
    paper.view.draw();
    var start = new paper.Point(this.x,this.y);
    this.path = new paper.Path();
    this.path.strokeColor = color;
    this.path.strokeWidth = size;
    this.path.add(start);
    this.path.add(start);
    this.turtle = this.draw_turtle();
    this.arrivalPoint = undefined;
    this.lastPoint = new paper.Point(this.x, this.y); // last Point is the last point placed
    this.currentSegment = this.getCurrentSegment();
};

/**
 * Returns TRUE if the actions to be processed are completed, else False
 * @return {Boolean}
 */
Drawer.prototype.isDrawingFinished = function() {
    return !(this.actionCount <= this.actions.length-1);
};

/**
 * Returns TRUE if the @currentSegment to be traced has reached the @arrivalPoint
 * If the variation to be added is greater than the remaining distance
 * We stop and add the end that remains and retrun true, otherwise the end point will be overwritten
 * @return {Boolean}
 */
Drawer.prototype.isPointReached = function() {
    if(Math.abs(this.arrivalPoint.x-this.x)< Math.abs(this.dx) || Math.abs(this.arrivalPoint.y-this.y)< Math.abs(this.dy) ){
        this.turtle.translate(this.arrivalPoint.x-this.x,this.arrivalPoint.y-this.y);
        if(this.penMove){
            this.currentSegment.x = this.arrivalPoint.x;
            this.currentSegment.y = this.arrivalPoint.y;
        }
        this.x = this.arrivalPoint.x;
        this.y = this.arrivalPoint.y;
        return true;
    }
    return false;
};

/**
 * Returns @currentSegment to be traced
 * @return {Point}
 */
Drawer.prototype.getCurrentSegment = function() {
    return this.path.segments[this.path.segments.length-1].point;
};

/**
 * Returns current action to be performed
 * @return {Object}
 */
Drawer.prototype.getCurrentAction = function (){ // return the current action
    return this.actions[this.actionCount];
};

/**
 * Returns the variation of a displacement on the x-axis
 * @return {Double}
 */
Drawer.prototype.getDx = function (){ // return the current action
    return (this.arrivalPoint.x - this.lastPoint.x)*this.speed/this.arrivalPoint.getDistance(this.lastPoint);
};

/**
 * Returns the variation of a displacement on the y-axis
 * @return {Double}
 */
Drawer.prototype.getDy = function (){ // return the current action
    return (this.arrivalPoint.y - this.lastPoint.y)*this.speed/(this.arrivalPoint.getDistance(this.lastPoint));
};