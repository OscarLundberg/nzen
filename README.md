# nzen

> ⚠️ This project should be considered experimental - expect all apis and features to change.
> js/ts/rust gamedev framework 

nzen is a lightweight framework that aims to simplify web gamedev using JavaScript, TypeScript, Rust and more!

## getting started

0. Make sure nodejs is installed on your system - [https://nodejs.org/en/download](https://nodejs.org/en/download)

1. install the nzen command line tools from npm
>```sh
> npm i -g @oscarlundberg/nzen
>```

2. initialize your project. 

>```sh
> nzen init "./my-project" && cd my-project
>```

this command will create a new folder and project file `my-project.nzproject.toml`

3. create a new module and give it a name. 
we named our module `hamilton`

> ```sh
> nzen create hamilton
> ```

4. to integrate your module into your project by referencing it in your project file. 

```diff
name = "my-project"
+ [hamilton]
```

5. build your project
> ```sh
> nzen build
> ```

6. all done! serve the files and play

> The build outputs browser-ready html and javascript into the directory 'dist' by default. Serve the entire folder using your favourite web server. In order to run locally you can pick from this [list of one-liner web servers](https://gist.github.com/willurd/5720255)


## mission
nzen aims to:
- be unobtrusive and easy to use
- lower the barrier for code-centered web game development, with a nod to [raylib](https://www.raylib.com/) but web first
- allow for game data entry according to the [DRY principle](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)
- integrate neatly with [visual studio code](https://code.visualstudio.com/)
- support multiple languages in tandem (via [WebAssembly](https://webassembly.org/))

[and hope to in the future]
- lower the barrier for sharing and reusing code for game systems 
- support multiple platforms 
- include gamedev library code such as 3D rendering, physics etc.


## 

[docs.nzen.fyi](docs.nzen.fyi)