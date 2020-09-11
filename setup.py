from distutils.core import setup

with open("README.rst", "r") as f:
    readme = f.read()

setup(name='turtleIutv',
      version='0.5',
      description='Turtles in the Jupyter Notebook',
      long_description = readme,
      author='Mathieu Lacroix',
      author_email='lacroix@univ-paris13.fr',
      url='https://github.com/mathieuLacroix/turtleIutv.git',
      packages=['turtleIutv'],
      package_data={'turtleIutv': ['turtleIutv/*.js']},
      classifiers=[
          'Framework :: IPython',
          'Intended Audience :: Education',
          'License :: OSI Approved :: BSD License',
          'Programming Language :: Python :: 2',
          'Programming Language :: Python :: 3',
          'Topic :: Artistic Software',
          'Topic :: Education',
      ],
      install_requires=['IPython', 'ipywidgets>=7.0.0'],
)
