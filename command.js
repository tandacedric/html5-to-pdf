#!/usr/bin/env node

require("coffee-script/register")
var Command = require("./src/command.coffee")
var command = new Command()
command.run()
