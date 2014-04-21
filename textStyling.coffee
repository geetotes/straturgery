class TextDecorator
  @pageWidth = 80
  constructor: (@options) ->
#set some stuff
#check options
  draw: (@text)->
    @text

module.exports = TextDecorator

