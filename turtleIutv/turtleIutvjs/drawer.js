/**
 * Class Drawer
 * This class is used to manage the actions
 * to be performed to draw and make animations.
 * 
 * The attributes of the class
 * @param {Array<Object>} actions - Action table to perform,
 *        the possible types of actions are:
 *        shifting, rotation, speed, pen, penColor, penSize, filling
 * @param {Path} path - Path containing the points to be drawn
 * @param {Boolean} penMove - If this value is TRUE a displacement is drawn,
 *        otherwise the stylus is raised and no segment is drawn.
 * @param {Boolean} filling - If this value is TRUE figure are drawn
 *        if only there is an intersection, otherwise do a normal animation
 * @param {Double} dx - Variation of a displacement on the x-axis
 * @param {Double} dy - Variation of a displacement on the y-axis
 * @param {Double} x - Current pen or turtle position on the x-axis
 * @param {Double} y - Current pen or turtle position on the y-axis
 * @param {Int} actionCount - Number indicating the position
 *        of the current action in the @actions array
 * @param {Color} turtleColour - Color of the @turtle 
 * @param {Color} fillingColor - Color of the filling figure 
 * @param {Color} fillingStrokeColor -
 *        Color of the stroke of the filling figure 
 * @param {Groupe} turtle - Turtle in green color indicating the route
 * @param {Point} arrivalPoint - The point to be reached
 *        by drawing the @currentSegment
 * @param {Point} lastPoint - The start point of the @currentSegment ,
 *        so it is the last point attains
 * @param {Segment} currentSegment - Current segment
 *        to be traced during the animation
 * @param {Double} currentAngle - Current angle to be rotate
 *        during the animation
 * @param {Int} countIntersection - Number of intersection
 *        if the process of filling is started
 */

/** Construtor
 * Create an instance of the class
 * @param {Point} start - Start point of the @path
 * @return {Drawer(Object)} - new Drawer(start,actions)
 */
 function Drawer(start, showTurtle) {
    this.actions = [];
    this.path = new paper.Path();
    this.path.strokeColor = 'black';
    this.path.strokeWidth = 3;
    this.path.add(start);
    this.path.add(start);
    this.showTurtle = showTurtle;
    this.speed = 1;
    this.penMove = true;
    this.filling = false;
    this.fillingColor = "black";
    this.fillingStrokeColor = "black"
    this.dx = 1;
    this.dy = 1;
    this.x = start.x;
    this.y = start.y;
    this.actionCount = 0;
    this.turtleColour = "green";
    this.turtle = this.draw_turtle();
    this.arrivalPoint = undefined;
    this.lastPoint = new paper.Point(this.x, this.y);
    this.currentSegment = this.getCurrentSegment();
    this.currentAngle = undefined;
    this.countIntersection = 0;
};

/**
 * Initialize the @turtle and return it as a paper.Groupe
 * @return {paper.Group}
 */
Drawer.prototype.draw_turtle = function(){
    if(this.showTurtle){ 
        // If the turtle will be showned,
        // it will be a groupe of peper.Path.Circle
        var circlePoint = new paper.Point(this.x-11,this.y);
        var tail = new paper.Path.RegularPolygon(circlePoint, 3, 3);
        tail.rotate(30);
        tail.fillColor = this.turtleColour;

        circlePoint = new paper.Point(this.x, this.y);
    
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
        return  new paper.Group(
            [circle1, circle2, circle3, circle4, circle5, circle6, tail]);
    }else{
        // If the turtle will be showned,
        // it will be a groupe of peper.Path.Circle
        var circlePoint = new paper.Point(this.x, this.y);
        var circle = new paper.Path.Circle(circlePoint, 4);
        circle.fillColor = this.turtleColour;
        return circle;
    }
};

/**
 * Animates a movement of a segment
 * The @arrivalPoint is not known at the start of plotting of a segment,
 * it must be initialized before using it,
 * and variations also (@dx and @dy )
 * When @drawCurrentSegment_ if the @currentSegment is done and @penMove ,
 * add a new Point to prepare next @currentSegment
 * @return {nothing}
 */
Drawer.prototype.doDeplacement = function() {
    var currentAction = this.getCurrentAction();
    if(this.arrivalPoint === undefined){
        // Initialise the arrival point at first
        // when meeting first time the current action
        this.arrivalPoint = new paper.Point(
            currentAction.point.x, currentAction.point.y);
        this.dx = this.getDx();
        this.dy = this.getDy();
    }
    // If a point is reached, add the point and go to the next action
    if(this.isPointReached()){
        if(this.penMove){
            this.path.add(new paper.Point(
                currentAction.point.x, currentAction.point.y));
            this.currentSegment = this.getCurrentSegment();
        }
        this.lastPoint = new paper.Point(
            currentAction.point.x, currentAction.point.y);
        this.arrivalPoint = undefined;
        this.actionCount++;
    }else {
        // do animation of the currunt segment
        this.drawCurrentSegment();
    }
};

/**
 * Rotate turtle at an angle @currentAction_value in an @sense direction
 * @return {nothing}
 */
Drawer.prototype.doRotation = function(){
    // If the turtle is not displayed, it is not the pain to make a rotation
    // since there is no direction
    if(this.showTurtle){
        var currentAction = this.getCurrentAction();
        // Angle of rotation is stored in currentAngle
        // in order to access to its value easily
        if(this.currentAngle == undefined){
            this.currentAngle = currentAction.value;
        }
        if(this.currentAngle <= this.speed){
            // Add the remaining rotation angle and finish the rotation
            this.turtle.rotate(this.currentAngle * currentAction.sense);
            this.currentAngle = undefined;
            this.actionCount++;
        }else{// do rotation
            this.currentAngle -= this.speed;
            this.turtle.rotate(this.speed * currentAction.sense);
        }
    }else{
        this.actionCount++;
    }
};

/**
 * Add a variation (@dx and @dy ) to the @currentSegment
 * to make the animation
 * and a translation of the @turtle , until it reaches the @arrivalPoint
 * @return {nothing}
 */
Drawer.prototype.drawCurrentSegment = function(){
    if(this.penMove){
        // if the pen is down, do animation of the currunt segment
        this.currentSegment.x += this.dx;
        this.currentSegment.y += this.dy;
        if(this.filling){
            this.fillColorIfIntersection();
        }
    }
    // translate the tortle
    this.turtle.translate(this.dx, this.dy);
    this.x = this.turtle.position.x;
    this.y = this.turtle.position.y;
};

/**
 * Change pen if the tracing should be done or not
 * @return {nothing}
 */
Drawer.prototype.doPenMove = function(){
    var currentAction = this.getCurrentAction();
    if(currentAction.value != this.penMove){
        // if the value is changed
        this.penMove =! this.penMove;
        if(this.penMove){
            // if it is true, create a new path to start drawing
            var color = this.path.strokeColor ;
            var size = this.path.strokeWidth;
            this.updatePath(color, size);
            this.turtle.scale(0.625);
        }else{this.turtle.scale(1.6)}
    }
    this.actionCount++;
};

/**
 * Change pen color if the new color of the @currentAction
 *  is different to @path color
 * @return {nothing}
 */
Drawer.prototype.changePenColor = function(){
    var currentAction = this.getCurrentAction();
    // if the value is changed
    if(this.path.strokeColor != currentAction.value){
        var size = this.path.strokeWidth;
        // create a new path
        this.updatePath(currentAction.value, size);
    }
    this.actionCount++;
};

/**
 * Change the spped of the @turtl
 * @return {nothing}
 */
 Drawer.prototype.changeSpeed = function(){
    this.speed = this.getCurrentAction().value;
    this.actionCount++;
};

/**
 * Change pen size if the new size of the @currentAction
 * is different to @path size
 * @return {nothing}
 */
Drawer.prototype.changePenSize = function(){
    var currentAction = this.getCurrentAction();
    // if the value is changed
    if(this.path.strokeWidth != currentAction.value){
        var color = this.path.strokeColor;
        // create a new path
        this.updatePath(color, currentAction.value);
    }
    this.actionCount++;
};

/**
 * Start or stop the process of coloring a figure, if the path is closed.
 */
Drawer.prototype.doFilling = function (){
    var currentAction = this.getCurrentAction();
    if(currentAction.value != this.filling){
        // if the value is changed
        this.filling = !this.filling;
        if(this.filling){
            // if it is true, create a new path to start drawing
            this.fillingColor = currentAction.fillColor;
            this.fillingStrokeColor = currentAction.strokeColor;
            var color = this.path.strokeColor ;
            var size = this.path.strokeWidth;
            this.updatePath(color, size);
        }else{
            this.countIntersection = 0;
        }
    }
    this.actionCount++;
};

/**
 * Fill color if intersection
 * @return {nothing}
 */
Drawer.prototype.fillColorIfIntersection = function (){
    // Check the intersections of the path with himself
    var intersections = this.path.getIntersections(this.path);
    if(intersections.length != this.countIntersection ){
        // If there is a new one, we color
        // ptInter is the new point of intersection
        this.countIntersection = intersections.length;
        var ptInter = intersections[intersections.length - 1];
        // last is the most recent point (last added on the path)
        // of the two points that make up the segment
        // that intersects the path
        // ptInter._segment1 is the first point
        var last = ptInter._segment2;
        // Create the path to fill
        var pathToColor = new paper.Path();
        pathToColor.strokeWidth = this.path.strokeWidth;

        // add to the path at first the intersection point
        pathToColor.add(ptInter.point.x, ptInter.point.y);

        // Go through the plotted Paht and add the segments
        // that belong to the closed figure.
        for(i=this.path.segments.length - 2; i > last.index - 1; i--){
            var point = this.path.segments[i].point;
            pathToColor.add(point);
        }
        // close the path
        pathToColor.closed = true;
        // create a path that will have the border color
        var pathStrok = pathToColor.clone();
        // Fill the color to the pathToColor
        pathToColor.fillColor = this.fillingColor;
        // Color the border
        pathStrok.strokeColor = this.fillingStrokeColor;
        // bring the turtle above the path
        // that make the turtle et the stroke visible
        // when passing through the colored figure
        pathToColor.insertBelow(this.path);
        pathStrok.insertBelow(this.turtle);
    }
};

/**
 * Reinitialize the @path
 * Then update variables @arrivalPoint , @lastPoint  and @currentSegment
 * @param {Color} color - The new color of the @path
 * @param {Int} size - The new size of the @path
 * @return {nothing}
 */
Drawer.prototype.updatePath = function(color,size){
    // create a new path
    var start = new paper.Point(this.x, this.y);
    this.path = new paper.Path();
    this.path.strokeColor = color==="random" ? new paper.Color.random() : color;
    this.path.strokeWidth = size;
    this.path.add(start);
    this.path.add(start);
    this.path.insertBelow(this.turtle);
    this.arrivalPoint = undefined;
    // last Point is the last point placed
    this.lastPoint = new paper.Point(this.x, this.y);
    this.currentSegment = this.getCurrentSegment();
};

/**
 * Returns TRUE if the actions to be processed are completed, else False
 * @return {Boolean}
 */
Drawer.prototype.isDrawingFinished = function(){
    return !(this.actionCount <= this.actions.length - 1);
};

/**
 * Returns TRUE if the @currentSegment to be traced
 * has reached the @arrivalPoint
 * If the variation to be added is greater than the remaining distance
 * We stop and add the end that remains and retrun true,
 * otherwise the end point will be overwritten
 * @return {Boolean}
 */
Drawer.prototype.isPointReached = function(){
    if(Math.abs(
        this.arrivalPoint.x - this.x) < Math.abs(this.dx) ||
        Math.abs(this.arrivalPoint.y - this.y) < Math.abs(this.dy)){
        // If the variation to be added is greater than
        // the remaining distance,
        // stop and add the end that remains and retrun true,
        // otherwise the end point will be overwritten
        this.turtle.translate(
            this.arrivalPoint.x - this.x, this.arrivalPoint.y - this.y);
        if(this.penMove){
            this.currentSegment.x = this.arrivalPoint.x;
            this.currentSegment.y = this.arrivalPoint.y;
            if(this.filling){
                this.fillColorIfIntersection();
            }
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
    return this.path.segments[this.path.segments.length - 1].point;
};

/**
 * Returns current action to be performed
 * @return {Object}
 */
Drawer.prototype.getCurrentAction = function(){ 
    // return the current action
    return this.actions[this.actionCount];
};

/**
 * Returns the variation of a displacement on the x-axis
 * @return {Double}
 */
Drawer.prototype.getDx = function(){
    var varX = this.arrivalPoint.x - this.lastPoint.x;
    var distance = this.arrivalPoint.getDistance(this.lastPoint);
    return varX * this.speed / distance;
};

/**
 * Returns the variation of a displacement on the y-axis
 * @return {Double}
 */
Drawer.prototype.getDy = function(){
    var varY = this.arrivalPoint.y - this.lastPoint.y;
    var distance = this.arrivalPoint.getDistance(this.lastPoint);
    return varY * this.speed / distance;
};