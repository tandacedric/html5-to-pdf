{describe,it,expect,beforeEach} = global
Options  = require '../../src/options'
path     = require 'path'

describe 'Options', ->
  describe 'when called with the requirments', ->
    beforeEach ->
      @sut = new Options {
        inputBody: 'input-body'
        outputPath: path.join(__dirname, 'output')
        options: {
          landscape: true
        }
      }

    it 'should set the default options', ->
      templatePath = (file) =>
        return path.resolve __dirname, '../../', 'templates', "#{file}"

      expect(@sut.options).to.deep.equal {
        options:
          host: 'localhost'
          landscape: true
          pageSize: 'A4'
          marginsType: 0
          port: undefined
          printBackground: false
        inputBody: 'input-body'
        outputPath: path.join(__dirname, 'output')
        renderDelay: 100
        template: 'html5bp'
        templatePath: templatePath 'html5bp'
        include: [
          {
            type: 'css',
            filePath: templatePath 'pdf.css'
          }
          {
            type: 'css',
            filePath: templatePath 'highlight.css'
          }
        ]
      }
