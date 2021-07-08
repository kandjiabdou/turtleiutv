define(['nbextensions/turtleIutvjs/paper-full', "@jupyter-widgets/base",'nbextensions/turtleIutvjs/drawer'], function(paperlib, widget){

    function TurtleDrawing(canvas_element, canvasElementSize, canvasSize,turtleShow, grid_button, help_button) {
        this.canvasSize = canvasSize;
        this.canvasElementSize = canvasElementSize;
        this.canvas = canvas_element;
        this.canvas.style.background = '#99CCFF';
        this.x = this.canvasElementSize/2;
        this.y = this.canvasElementSize/2;

        paper.setup(this.canvas);

        var start = new paper.Point(this.x,this.y);
        this.drawer = new Drawer(start,turtleShow);

        $( window ).resize(function() {
            $( "#log" ).append( "<div>Handler for .resize() called.</div>" );
        });
        /* adds grid for user to turn off / on, helps see what the turtle is doing */
        this.grid = new paper.Path();
        this.grid_on = false;
        this.grid_button = grid_button;
        var scale = 20*canvasElementSize/canvasSize;
        var that = this;
        this.grid_button.click(function (){
            var grid = that.grid;
            if (!that.grid_on) {
                that.grid_on = true;
                grid.strokeColor = 'grey';
                var start = new paper.Point(1,1);
                grid.moveTo(start);
                var canvasSize = that.canvas.width;
                grid.lineTo(start.add([0,canvasSize]));
                
                var i;
                for(i = scale; i <= canvasSize; i += scale){
                    grid.lineTo(start.add([i,canvasSize]));
                    grid.lineTo(start.add([i,0]));
                    grid.lineTo(start.add([i+scale,0]));
                }
                for(i = scale; i <= canvasSize; i += scale){
                    grid.lineTo(start.add([canvasSize,i]));
                    grid.lineTo(start.add([0,i]));
                    grid.lineTo(start.add([0,i+scale]));
                }
                paper.view.draw();
            } else {
                that.grid_on = false;
                grid.clear();
                paper.view.draw();
            }
        });
        
        this.help_button = help_button;
        this.help_button.click(function (event){
            alert("example:\nfrom turtleIutv import *\ndrawing()\nforward(50)\n https://gitlab.sorbonne-paris-nord.fr/11928898/turtleiutv");
        });

        // Loop, must go through each new action and make an animation if necessary
        paper.view.on('frame', function(event) {
            //that.drawer.actions = that.actions;
            if(!that.drawer.isDrawingFinished()){
                var currentAction = that.drawer.getCurrentAction();
                switch(currentAction.type){
                    case "shifting":
                        that.drawer.doDeplacement();
                        break;
                    case "rotation":
                        that.drawer.doRotation();
                        break;
                    case "speed":
                        that.drawer.changeSpeed();
                        break;
                    case "penColor":
                        that.drawer.changePenColor();
                        break;
                    case "penSize":
                        that.drawer.changePenSize();
                        break;
                    case "pen":
                        that.drawer.doPenMove();
                        break;
                    case "filling":
                        that.drawer.doFilling();
                        break;
                    default:
                        that.drawer.actionCount++;
                }
            }
        });        
    }
    
    // Define the DatePickerView
    var TurtleView = widget.DOMWidgetView.extend({
        render: function(){
            var turtleArea = $('<div/>');
            turtleArea.attr('id','turtle-canvas-area');
            turtleArea.css('text-align','center');

            var buttonDiv = $('<div/>');
            buttonDiv.attr('target','button-area');
            
            // create grid button  
            var gridButton = $('<button/>');
            gridButton.attr('id','grid-element');
            gridButton.attr('value', 0);
            gridButton.append("Grid On/Off");
            buttonDiv.append(gridButton);
            turtleArea.append(buttonDiv);
            // create help button 
            var helpButton = $('<button/>');
            helpButton.append("Help!");
            buttonDiv.append(helpButton);

            var canvasSize = this.model.get('canvasSize');
            var canvasElementSize = this.model.get('canvasElementSize');
            var turtleShow = this.model.get('turtleShow');
            var canvasDiv = $('<div/>');
            turtleArea.append(canvasDiv);
            
            var canvas = document.createElement('canvas');
            canvas.id     = "canvas1";
            canvas.width  = canvasElementSize
            canvas.height = canvasElementSize
            canvas.resize;

            canvasDiv.append(canvas);
            
            this.turtledrawing = new TurtleDrawing(canvas,canvasElementSize, canvasSize, turtleShow, gridButton, helpButton);
            this.turtledrawing.drawer.actions = this.model.get('actions');
            this.turtledrawing.canvas.style.background = this.model.get('backgroundColor');
            
            this.$el.append(turtleArea);
            window.debugturtle = this;
        },
        update: function(options) {
            this.turtledrawing.drawer.actions = this.model.get('actions');
        }
    });

    return {TurtleView: TurtleView};
});