from .Turtle import Turtle

__version__ = '1.1'

"""
# This file initializes the turtle with a global variable
# It uses the Turtle class to do procedural programming
# and avoid object programming,
# because beginners are not familiar with the Object.
# It's just rewritten functions of the Turtle class.
# So to understand these functions
# you have to look at the Turtle class.
"""

turtleTmp = None


def drawing(width=500, limit=1000, color="#99CCFF", turtle=True):
    """Start a drawing

    Example::

    drawing()
    """
    global turtleTmp
    turtleTmp = Turtle(width, limit, color, turtle)


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
    turtleTmp.speed(max(1, min(n, 10)))


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
    turtleTmp.setposition(x, y)


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
        Color can be a string like :
        "red", "blue", "yellow", "brown", "black", "purple", "green"
        or hexadecimal

        Example::

            setColor("#ABD011")
    """
    turtleTmp.penColor(color)


def setSize(size):
    """Change the size of the pen.
        Example::

            setSize(5)
    """
    turtleTmp.penSize(max(1, min(size, 100)))


def begin_fill(color="black", strokeColor="black"):
    """ Start the process of coloring a figure, if the path is closed.
        Color can be a string like :
        "red", "blue", "yellow", "brown", "black", "purple", "green"
        or hexadecimal

        Example::

            begin_fill("red")
    """
    turtleTmp.begin_fill(color, strokeColor)


def end_fill():
    """ Stop the process of coloring a figure.

        Example::

            end_fill()
    """
    turtleTmp.end_fill()


def circle(radius, extent=360):
    """Draw a circle, or part of a circle.

        From its current position, the turtle will draw
        a series of short lines, turning slightly between each.
        If radius is positive, it will turn to its left;
        a negative radius will make it turn to its right.

        Example::

            circle(50)
    """
    turtleTmp.circle(radius, extent)
