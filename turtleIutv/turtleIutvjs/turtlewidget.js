define(['nbextensions/turtleIutvjs/paper-full', "@jupyter-widgets/base",'nbextensions/turtleIutvjs/drawer'], function(paperlib, widget,drawer){

    function TurtleDrawing(canvas_element, canvasElementSize, canvasSize, turtleShow, grid_button, help_button) {
        this.actions = [];
        this.canvasSize = canvasSize;
        this.canvasElementSize = canvasElementSize;
        this.canvas = canvas_element;
        this.canvas.style.background = '#99CCFF';
        paper.setup(this.canvas);

        $( window ).resize(function() {
            $( "#log" ).append( "<div>Handler for .resize() called.</div>" );
        });

        this.x = this.canvasElementSize/2;
        this.y = this.canvasElementSize/2;

        //######################################################################################################
        var that = this;
        console.log("Starting ....");
        // some
        var start = new paper.Point(this.x,this.y);
        var drawer = new Drawer(start,this.actions);

        // Loop, doit parcourrir chaque nouveau point, l'ajouter sur le path et le tracer
        paper.view.on('frame', function(event) {
            // draw a segment
            drawer.actions = that.actions;
            if(!drawer.isFinish()){
                var currentAction = drawer.getCurrentAction();
                switch(currentAction.type){
                    case "shifting":
                        drawer.doDeplacement();
                        break;
                    case "rotation":
                        drawer.doRotation();
                        break;
                    case "speed":
                        drawer.speed = currentAction.value;
                        drawer.actionCount++;
                        console.log(drawer.actions);
                        break;
                    case "penColor":
                        drawer.changePenColor();
                        break;
                    case "penSize":
                        drawer.changePenSize();
                        break;
                    case "pen":
                        drawer.doPenMove();
                        break;
                    default:
                        drawer.actionCount++;
                }
            }
        });

        //######################################################################################################
        
    }
    
    // Define the DatePickerView
    var TurtleView = widget.DOMWidgetView.extend({
        render: function(){
            var turtleArea = $('<div/>');
            turtleArea.attr('id','turtle-canvas-area');
            turtleArea.css('text-align','center');

            var buttonDiv = $('<div/>');
            buttonDiv.attr('target','button-area');

            // create help button 
            var helpButton = $('<button/>');
            helpButton.append("Help!");
            buttonDiv.append(helpButton);
            
            // create grid button  
            var gridButton = $('<button/>');
            gridButton.attr('id','grid-element');
            gridButton.attr('value', 0);
            gridButton.append("Grid On/Off");
            buttonDiv.append(gridButton);
            turtleArea.append(buttonDiv);

            var canvasSize = this.model.get('canvasSize');
            var canvasElementSize = this.model.get('canvasElementSize');
            var turtleShow = this.model.get('turtleShow') ? 1 : 0;
            var canvasDiv = $('<div/>');
            turtleArea.append(canvasDiv);
            
            var canvas = document.createElement('canvas');
            canvas.id     = "canvas1";
            canvas.width  = canvasElementSize
            canvas.height = canvasElementSize
            canvas.resize;

            canvasDiv.append(canvas);
            
            this.turtledrawing = new TurtleDrawing(canvas,canvasElementSize, canvasSize, turtleShow, gridButton, helpButton);
            this.turtledrawing.actions = this.model.get('actions');
            
            this.$el.append(turtleArea);
            window.debugturtle = this;
        },
        update: function(options) {
            //console.log("doing update");
            this.turtledrawing.actions = this.model.get('actions');
        }
    });

    return {TurtleView: TurtleView};
});