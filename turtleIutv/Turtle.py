import os.path
import math
import sys
from ipywidgets import widgets
from notebook import nbextensions
from traitlets import Unicode, List, Int, Bool
from IPython.display import display

__version__ = '0.8'

def install_js():
    pkgdir = os.path.dirname(__file__)
    nbextensions.install_nbextension(os.path.join(pkgdir, 'turtleIutvjs'),
                                     user=True)

class Turtle(widgets.DOMWidget):
    _view_module = Unicode("nbextensions/turtleIutvjs/turtlewidget").tag(sync=True)
    _view_name = Unicode('TurtleView').tag(sync=True)
    # TODO: Make this an eventful list, so we're not transferring the whole
    # thing on every sync
    actions = List(sync=True)
    canvasSize = Int(sync=True)
    canvasElementSize = Int(sync=True)
    turtleShow = Bool(sync=True)
    # 
    SIZE_C = 0
    SIZE_E = 0
    OFFSET = 20
    SCALE = 1
    def __init__(self, ce, cs, t):
        '''Create a Turtle.

        Example::

            t = Turtle()
        '''
        super(Turtle, self).__init__()
        self.canvasSize = cs
        self.canvasElementSize = ce
        self.turtleShow = t
        install_js()
        display(self)
        Turtle.SIZE_C=cs
        Turtle.SIZE_E=ce
        Turtle.SCALE = ce/cs
        
        self.angle = 90
        self.actions = []
        self.posX = self.canvasElementSize/2
        self.posY = self.canvasElementSize/2
    def pendown(self):
        '''Put down the pen. Turtles start with their pen down.

        Example::

            t.pendown()
        '''
        action = dict(type="pen",value=True)
        self.actions = self.actions + [action]

    def penup(self):
        '''Lift up the pen.

        Example::

            t.penup()
        '''
        action = dict(type="pen",value=False)
        self.actions = self.actions + [action]

    def speed(self, speed):
        '''Change the speed of the turtle (range 1-10).

        Example::

            t.speed(10) # Full speed
        '''
        action = dict(type="speed",value=speed)
        self.actions = self.actions + [action]

    def right(self, num):
        '''Turn the Turtle num degrees to the right.

        Example::

            t.right(90)
        '''
        
        self.angle += num
        self.angle = self.angle%360

        action = dict(type="rotation",value=num,sense=1)
        self.actions = self.actions + [action]

    def left(self, num):
        '''Turn the Turtle num degrees to the left.

        Example::

            t.left(90)
        '''
        self.angle -= num
        self.angle = self.angle%360

        action = dict(type="rotation",value=num,sense=-1)
        self.actions = self.actions + [action]

    def forward(self, num):
        '''Move the Turtle forward by num units.

        Example:

            t.forward(100)
        '''
        self.posX += num * Turtle.SCALE * math.sin(math.radians(self.angle))
        self.posY -= num * Turtle.SCALE * math.cos(math.radians(self.angle))
        
        action = dict(type="shifting",point= dict(x=self.posX, y=self.posY))
        self.actions = self.actions + [action]

    def backward(self, num):
        '''Move the Turtle backward by num units.

        Example::

            t.backward(100)
        '''
        self.posX -= num * Turtle.SCALE * math.sin(math.radians(self.angle))
        self.posY += num * Turtle.SCALE * math.cos(math.radians(self.angle))

        action = dict(type="shifting",point= dict(x=self.posX, y=self.posY))
        self.actions = self.actions + [action]

    def penColor(self, color):
        '''Change the color of the pen to color. Default is black.

        Example::

            t.penColor("red")
        '''
        action = dict(type="penColor",value= color)
        self.actions = self.actions + [action]

    def penSize(self, size):
        '''Change the size of the pen to size. Default is 3.

        Example::

            t.penSize(5)
        '''
        action = dict(type="penSize",value= size)
        self.actions = self.actions + [action]

    def setposition(self, x, y):
        """Change the position of the turtle.

        Example::

            t.setposition(100, 100)
        """
        toX = x * Turtle.SCALE
        toY = y * Turtle.SCALE
        if(self.posX == toX and self.posY == toY): return
        sensX = self.posX + math.sin(math.radians(self.angle))
        sensY = self.posY - math.cos(math.radians(self.angle))

        alpha = math.degrees(math.atan2(toY- self.posY, toX- self.posX) - math.atan2(sensY- self.posY, sensX- self.posX))
        if(abs(alpha)>180):
            alpha= (alpha- 360)%360

        if(alpha>0) :
            self.right(alpha)
        else :
            self.left(-alpha)

        self.posX = toX
        self.posY = toY
        action = dict(type="shifting",point = dict(x=self.posX, y=self.posY))
        self.actions = self.actions + [action]

    def begin_fill(self,color):
        """ Start the process of coloring a figure, if the path is closed.
            Known colors: "red", "blue", "yellow", "brown", "black", "purple", "green"

            Example::

                begin_fill("red")
        """
        action = dict(type = "filling",value = True, color = color)
        self.actions = self.actions + [action]

    def end_fill(self):
        """ Stop the process of coloring a figure.
            
            Example::

                end_fill()
        """
        action = dict(type = "filling",value = False)
        self.actions = self.actions + [action]


    def circle(self, radius, extent=360):
        """Draw a circle, or part of a circle.

        From its current position, the turtle will draw a series of short lines,
        turning slightly between each. If radius is positive, it will turn to
        its left; a negative radius will make it turn to its right.

        Example::

            t.circle(50)
        """
        
        temp = self.angle
        self.b_change = 0
        tempSpeed = 5

        for i in range(0, (extent//2)):
            n = math.fabs(math.radians(self.b_change) * radius)
            if(radius >= 0):
                self.forward(n)
                self.left(2)
            else:
                self.forward(n)
                self.right(2)
        if(radius >= 0):
            self.angle = (temp + extent)
        else:
            self.angle = (temp - extent)

    def home(self):
        '''Move the Turtle to its home position.

        Example::

            t.home()
        '''

        center = self.canvasSize/2
        self.setposition(center,center)


turtleTmp = None
def drawing(element_size=500, canvas_size = 1000, turtleShow=True):
    """Start a drawing

    Example::

    drawing()
    """
    #assert size>=400 and size<=1000, "La taille doit être compris entre 400 et 1000"
    global turtleTmp
    turtleTmp = Turtle(element_size,canvas_size,turtleShow)

def home():
    '''Move the Turtle to its home position.

        Example::

            home()
        '''
    turtleTmp.home()

def forward(n):
    '''Move the Turtle forward by n units.

        Example:

            forward(100)
        '''
    turtleTmp.forward(n)

def backward(n):
    '''Move the Turtle backward by n units.

        Example:

            backward(100)
        '''
    turtleTmp.backward(n)


def left(n):
    '''Turn the Turtle n degrees to the left.

        Example:

            left(90)
        '''
    turtleTmp.left(n)

def speed(n):
    """Change the speed of the Turtle.

        Example:

            speed(5)
    """
    turtleTmp.speed(max(1,min(n,10)))

def right(n):
    '''Turn the Turtle n degrees to the right.

    Example:

        right(90)
    '''
    turtleTmp.right(n)

def goto(x, y):
    """Change the position of the Turtle.

        Example::

            goto(100, 100)
    """
    turtleTmp.setposition(x,y)

def up():
    """Lift up the pen.
        Example::

            up()
    """
    turtleTmp.penup()

def down():
    """Put down the pen. Turtles start with their pen down.

        Example::

            down()
    """
    turtleTmp.pendown()

def setColor(color):
    """Change the color of the pen.
        Known colors: "red", "blue", "yellow", "brown", "black", "purple", "green"

        Example::

            setColor("red")
    """
    turtleTmp.penColor(color)

def setSize(size):
    """Change the size of the pen.
        Example::

            setSize(5)
    """
    turtleTmp.penSize(max(1,min(size,100)))

def begin_fill(color):
    """ Start the process of coloring a figure, if the path is closed.
        Known colors: "red", "blue", "yellow", "brown", "black", "purple", "green"

        Example::

            begin_fill("red")
    """
    turtleTmp.begin_fill(color)

def end_fill():
    """ Stop the process of coloring a figure.
        
        Example::

            end_fill()
    """
    turtleTmp.end_fill()