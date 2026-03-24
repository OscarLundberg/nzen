# NzEntity

## general
One of the core features of nzen is the data entry system built on top of [toml](https://toml.io/)

The [NzEntity](nzentity.md) is the container that is used to couple the game data with corresponding code modules ([NzModule](nzmodule.md))


## example project

Here is an example NzEntity based on PacMan

```toml
# pacman.nzentity.toml

[main] # <- toml tables in square brackets represent code modules which hold your code

[playermanager]  
color = "yellow" # <- optionally, pass keys underneath a table to inject it into the module
speed = 1.25

[ghostmanager]
count = 4               
speed = 1.25          
scared = false

# ...
```

We can consider this NzEntity the entrypoint of our game. 
In this example, we have 3 NzModules, `main`, `playermanager` and `ghostmanager`

We can imagine that `main` would hold the code to setup and draw the world, spawn dots and cherries, etc.

`playermanager` would draw and keep track of pac mans state, handle input and collision with ghosts and dots, etc.

finally `ghostmanager` might implement the ghost behaviour.

of course, the entire game could be implemented in a single module


## separating 