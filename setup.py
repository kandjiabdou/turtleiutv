from distutils.core import setup

with open("README.rst", "r") as f:
    readme = f.read()

setup(name='turtleIutv',
      version='1.1',
      description='Turtles in the Jupyter Notebook',
      long_description=readme,
      author='Abdou KANDJI',
      author_email='abdou.k.kandji@gmail.com',
      url='https://github.com/kandjiabdou/turtleIutv',
      packages=['turtleIutv'],
      package_data={'turtleIutv': ['turtleIutvjs/*.js']},
      include_package_data=True,
      classifiers=[
          'Framework :: IPython',
          'Intended Audience :: Education',
          'License :: OSI Approved :: BSD License',
          'Programming Language :: Python :: 2',
          'Programming Language :: Python :: 3',
          'Topic :: Artistic Software',
          'Topic :: Education',
      ],
      install_requires=['IPython', 'ipywidgets>=7.0.0'])
