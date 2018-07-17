module.exports = (plop) => {
  plop.setGenerator("component", {
    description: "Create a new component",

    prompts: [{
        type: "input",
        name: "name",
        message: "What is your component name?",
      },
      {
        type: "confirm",
        name: "needJs",
        message: "Shoud i create JavaScript file?",
        default: false
      }
    ],

    actions: function (data) {
      var actions = [{
          type: "add",
          path: "src/components/{{dashCase name}}/{{dashCase name}}.pug",
          templateFile: "config/plop-templates/component.pug"
        },
        {
          type: "add",
          path: "src/components/{{dashCase name}}/_{{dashCase name}}.scss",
          templateFile: "config/plop-templates/component.scss"
        },
        {
          type: "modify",
          path: "src/styles/main.scss",
          pattern: /(\/\/ Components)/g,
          template: "$1\n@import \"../components/{{dashCase name}}/{{dashCase name}}\";"
        }
      ];

      if (data.needJs) {
        actions.push({
          type: "add",
          path: "src/components/{{dashCase name}}/{{dashCase name}}.js",
          templateFile: "config/plop-templates/component.js"
        });
      }

      return actions;
    }
  });

  plop.setGenerator("module", {
    description: "Create a new modules",

    prompts: [{
        type: "input",
        name: "name",
        message: "What is your module name?",
      }
    ],

    actions: function (data) {
      var actions = [{
          type: "add",
          path: "src/styles/modules/_{{dashCase name}}.scss",
          templateFile: "config/plop-templates/component.scss"
        },
        {
          path: "src/styles/main.scss",
          type: "modify",
          pattern: /(\/\/ Modules)/g,
          template: "$1\n@import \"./modules/{{dashCase name}}\";"
        }
      ];

      return actions;
    }
  });

  plop.setGenerator("page", {
    description: "Create a new page",

    prompts: [{
        type: "input",
        name: "name",
        message: "What is page name?",
      },
      {
        type: "confirm",
        name: "needScripts",
        message: "Connect scripts from index?",
        default: true
      }
    ],

    actions: function (data) {

      var actions = [{
          type: "add",
          path: "src/pages/{{dashCase name}}.pug",
          templateFile: "config/plop-templates/pages.pug"
        }
      ];

      return actions;
    }
  })
};