export const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">

  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script type="importmap">
    {
      "imports": {
        "@nzen/lib": "./nzen.js"
      }
    }
    </script>
    <script type="module">
      import project from "./project.js"
      import { NzEngine } from "@nzen/lib"
      NzEngine.init(project)
    </script>
  </head>

  <body>
  </body>

</html>`;

