Fork of Turtle package `mobilechelonian <https://github.com/takluyver/mobilechelonian>`_.

*"Nevertheless... the turtle moves!"* - Small Gods, by Terry Pratchett

This is a Turtle module for the Jupyter Notebook. It's based on code by
`aspidites <https://github.com/macewanCMPT395/aspidites>`_, one of two groups at
`Macewan University <http://macewan.ca/wcm/index.htm>`_ that built Turtle
as a class assignment (the other was `PACattack <http://macewancmpt395.github.io/PACattack/>`_;
I could have based this on either, but I had to pick one).

This extension was made as part of a 3-month internship at the iut of villetaneuse under the supervision of `M. Lacroix <https://github.com/mathieuLacroix>`_.

Install it in a terminal/command prompt with::

    pip install git+https://github.com/kandjiabdou/turtleiutv.git

Using it looks like this::

    from turtleIutv import *
    drawing(width = 500, limit = 1000, color = "#D2D1CF", turtle =True)
    speed(5)
    colours=["red","blue","yellow","brown","black","purple","green"]
    up()
    left(90)
    forward(200)
    right(90)
    down()
    i = 0
    while i < 28:
        setColor(colours[i%7])
        setSize(i%7)
        speed(i%10)
        right(13)
        forward(50)
        i += 1
    home()
    begin_fill("red","yellow")
    circle(100)
    end_fill()

.. image:: sample.png

.. image:: https://mybinder.org/badge_logo.svg
 :target: https://mybinder.org/v2/gh/kandjiabdou/turtleiutv/master?filepath=try.ipynb