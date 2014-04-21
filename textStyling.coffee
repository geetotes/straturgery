class TextDecorator
  @pageWidth = 80
  startText: (text_decoration, background, foreground) ->

  constructor: (@options) ->
    @background = @options.color ?= 0
    @foreground = @options.color ?= 194
    @text_decoration = @options.text_decoration ?= 0
    @border = @options.border ?= 1
    @border_style= @options.border_style ?= "*"
    @padding = @options.padding ?= 0
    @margin = @options.margin ?= 0
    #@align = @options.align ?= "center"

    @styleString = "\x1B[" + @text_decoration + "m\x1B[48;5;" + @background + "m\x1B[38;5;" + @foreground + "m\x1B[0m"

   


#set some stuff
#check options
  draw: (@text) ->
    stringLength = @text.length
    
    borderLine = new Array(@text.length + 3).join(@border_style)
    @lines = []
    @lines.push(borderLine)
    @lines.push(@border_style + @text + @border_style)
    @lines.push(borderLine)

    @lines.join('\n')

module.exports = TextDecorator

