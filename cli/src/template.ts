export const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">

  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script type="importmap">
    {{IMPORTMAP}}
    </script>
    <script type="module">
      import project from "./project.js"
      import { NzEngine } from "@nzen/engine"
      NzEngine.init(project)
    </script>
  </head>

  <body>
  </body>

</html>`;

