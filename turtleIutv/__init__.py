from .Turtle import *

__version__ = '1.0'

# This file initializes the turtle with a global variable
# It uses the Turtle class to do procedural programming
# and avoid object programming, because beginners are not familiar with the Object.
# So it's just rewritten functions of the Turtle class.

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

def begin_fill(color="black"):
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

def circle(radius,extent=360):
    """Draw a circle, or part of a circle.

        From its current position, the turtle will draw a series of short lines,
        turning slightly between each. If radius is positive, it will turn to
        its left; a negative radius will make it turn to its right.

        Example::

            circle(50)
    """
    turtleTmp.circle(radius,extent)