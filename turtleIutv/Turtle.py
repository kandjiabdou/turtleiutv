import os.path
import math
from ipywidgets import widgets
from notebook import nbextensions
from traitlets import Unicode, List, Int, Bool
from IPython.display import display


class Turtle(widgets.DOMWidget):
    _view_module = Unicode(
        "nbextensions/turtleIutvjs/turtlewidget").tag(sync=True)
    _view_name = Unicode('TurtleView').tag(sync=True)
    # TODO: All actions are synchronized with the turtlewidget module,
    # which allows python to pass actions and data to the JavaScript.

    # For each action, this code is used to add it and
    # manage the snychronization
    # >> self.actions = self.actions + [action]
    # Synchronization is done when self.actions changes value
    # self.actions.append(action) does not sync
    # because the action array has not changed but just increased in size.

    # Here is the data to communicate
    actions = List(sync=True)
    canvasSize = Int(sync=True)
    canvasElementSize = Int(sync=True)
    turtleShow = Bool(sync=True)
    backgroundColor = Unicode().tag(sync=True)

    def __init__(self, width, limit, color, turtle):
        '''Create a Turtle.

        Example::

            t = Turtle(canvas, 500,1000)
        '''
        super(Turtle, self).__init__()
        self.canvasElementSize = width
        self.canvasSize = limit
        self.backgroundColor = color
        self.turtleShow = turtle
        install_js()
        display(self)
        # scale that allows you to place the points
        # according to the size of the canvas and the grid
        self.scale = width/limit
        self.angle = 90
        self.filling = False
        self.fillingColor = "black"
        self.fillingStrokeColor = "black"
        self.actions = []
        self.posX = self.canvasElementSize/2
        self.posY = self.canvasElementSize/2

    def pendown(self):
        '''Put down the pen. Turtles start with their pen down.

        Example::

            t.pendown()
        '''
        # action is a dictionary containing some informations
        action = dict(type="pen", value=True)
        self.actions = self.actions + [action]

    def penup(self):
        '''Lift up the pen.

        Example::

            t.penup()
        '''
        # When the user decides to raise or lower the pen
        # if the value is True,
        # shifting are drawn else only turtle moves
        action = dict(type="pen", value=False)
        self.actions = self.actions + [action]

    def speed(self, speed):
        '''Change the speed of the turtle (range 1-10).

        Example::

            t.speed(10) # Full speed
        '''
        # When the user decides change the turtle speed
        # with the new value "speed"
        action = dict(type="speed", value=speed)
        self.actions = self.actions + [action]

    def right(self, num):
        '''Turn the Turtle num degrees to the right.

        Example::

            t.right(90)
        '''
        # Rotate the turtle to the right with an angle num,
        # the direction is 1 (right)
        self.angle += num
        self.angle = self.angle % 360

        action = dict(type="rotation", value=num, sense=1)
        self.actions = self.actions + [action]

    def left(self, num):
        '''Turn the Turtle num degrees to the left.

        Example::

            t.left(90)
        '''
        # Rotate the turtle to the left with an angle num,
        # the direction is -1 (left)
        self.angle -= num
        self.angle = self.angle % 360

        action = dict(type="rotation", value=num, sense=-1)
        self.actions = self.actions + [action]

    def forward(self, num):
        '''Move the Turtle forward by num units.

        Example:

            t.forward(100)
        '''
        # Move the turtle by "n", first calculate
        # the coordinates (x, y) at the end of this movement.
        self.posX += num * self.scale * math.sin(math.radians(self.angle))
        self.posY -= num * self.scale * math.cos(math.radians(self.angle))

        action = dict(type="shifting", point=dict(x=self.posX, y=self.posY))
        self.actions = self.actions + [action]

    def backward(self, num):
        '''Move the Turtle backward by num units.

        Example::

            t.backward(100)
        '''
        # Same as forward
        self.posX -= num * self.scale * math.sin(math.radians(self.angle))
        self.posY += num * self.scale * math.cos(math.radians(self.angle))
        action = dict(
            type="shifting", point=dict(x=self.posX, y=self.posY))
        self.actions = self.actions + [action]

    def penColor(self, color):
        '''Change the color of the pen to color. Default is black.

        Example::

            t.penColor("red")
        '''
        # When the user decides change the turtle color
        # with the new value "color"
        action = dict(type="penColor", value=color)
        self.actions = self.actions + [action]

    def penSize(self, size):
        '''Change the size of the pen to size. Default is 3.

        Example::

            t.penSize(5)
        '''
        # When the user decides change the turtle size
        # with the new value "size"
        # Size must be between 1 and 10
        # otherwise it is readjust automatically
        action = dict(type="penSize", value=size)
        self.actions = self.actions + [action]

    def setposition(self, x, y):
        """Change the position of the turtle.

        Example::

            t.setposition(100, 100)
        """
        # toX and toY are coodinate of the arrival position
        toX = x * self.scale
        toY = y * self.scale
        # Do nothing if the position doesn't change
        if(self.posX == toX and self.posY == toY):
            return

        # First calculate the required rotation angle 'alpha'
        # before making the move
        # sensX and sensY are coodinate of the direction of the turtle
        sensX = self.posX + math.sin(math.radians(self.angle))
        sensY = self.posY - math.cos(math.radians(self.angle))
        # alpha is the angle needed to rotate,
        # it is calculated with two vectors :
        # (self.posX,self.posy)-->(toX, toY) and
        # (self.posX,self.posy)-->(sensX, sensY)
        alpha = math.degrees(
            math.atan2(toY - self.posY, toX - self.posX)
            - math.atan2(sensY - self.posY, sensX - self.posX))
        # If the angle is greater than a flat angle
        # it is brought back to an acute angle
        if(abs(alpha) > 180):
            alpha = (alpha - 360) % 360
        # Turn the turtle
        if(alpha > 0):
            self.right(alpha)
        else:
            self.left(-alpha)
        # Add the shifting to the action array
        self.posX = toX
        self.posY = toY
        action = dict(
            type="shifting", point=dict(x=self.posX, y=self.posY))
        self.actions = self.actions + [action]

    def begin_fill(self, color, strokeColor):
        """ Start the process of coloring a figure, if the path is closed.
        Color can be a string like :
        "red", "blue", "yellow", "brown", "black", "purple", "green"
        or hexadecimal

        Example::

            begin_fill("red")
        """
        self.filling = True
        self.fillingColor = color
        self.fillingStrokeColor = strokeColor
        action = dict(
            type="filling", value=True, color=color,
            strokeColor=strokeColor)
        self.actions = self.actions + [action]

    def end_fill(self):
        """ Stop the process of coloring a figure.

            Example::

                end_fill()
        """
        self.filling = False
        action = dict(type="filling", value=False)
        self.actions = self.actions + [action]

    def circle(self, radius, extent):
        """Draw a circle, or part of a circle.

        From its current position, the turtle will draw
        a series of short lines, turning slightly between each.
        If radius is positive, it will turn to its left;
        a negative radius will make it turn to its right.

        Example::

            t.circle(50)
        """
        if(radius == 0):
            return
        # step is number of segments to make the circle or an arc
        # and w et w2 angle of rotation
        frac = abs(extent)/360
        steps = 1+int(min(11+abs(radius)/6.0, 59.0)*frac)
        w = 1.0 * extent / steps
        w2 = 0.5 * w
        num = 2.0 * radius * math.sin(w2*math.pi/180.0)

        if radius < 0:
            w, w2 = -w, -w2
        # Raise the turtle and and go to a radius distance
        # befor drawing the circle or arc
        self.penup()
        self.right(90)
        self.forward(radius)
        self.left(90)
        self.pendown()
        # If the coloring process was started we continue to do it
        # Because the raising of the pen stop the process of coloring
        if(self.filling):
            self.end_fill()
            self.begin_fill(self.fillingColor, self.fillingStrokeColor)

        self.left(w2)
        for i in range(steps):
            self.forward(num)
            self.left(w)
        self.left(-w2)
        # Raise the turtle and and go to it started point
        # Because the raising of the pen stop the process of coloring
        self.penup()
        self.left(90)
        self.forward(radius)
        self.right(90)
        self.pendown()
        if(self.filling):
            self.end_fill()
            self.begin_fill(self.fillingColor, self.fillingStrokeColor)

    def home(self):
        '''Move the Turtle to its home position.

        Example::

            t.home()
        '''
        center = self.canvasSize/2
        self.setposition(center, center)


def install_js():
    pkgdir = os.path.dirname(__file__)
    nbextensions.install_nbextension(
        os.path.join(pkgdir, 'turtleIutvjs'), user=True)
