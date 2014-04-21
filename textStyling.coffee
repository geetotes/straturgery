class TextDecorator
  @pageWidth = 80
  startText: (text_decoration, background, foreground) ->

  constructor: (@options) ->
    @background = @options.background ?= 232
    @foreground = @options.foreground ?= 70
    @text_decoration = @options.text_decoration ?= 0
    @border = @options.border ?= 1
    @border_style= @options.border_style ?= "*"
    @padding = @options.padding ?= 0
    @margin = @options.margin ?= 0
    #@align = @options.align ?= "center"

    @styleString = "\x1B[" + @text_decoration + "m\x1B[48;5;" + @background + "m\x1B[38;5;" + @foreground + "m"
    console.log(@options)

   


#set some stuff
#check options
  draw: (@text) ->
    stringLength = @text.length
    
    borderLine = new Array(@text.length + 3).join(@border_style)
    @lines = []
    if(@border != 0)
      @lines.push(@styleString + borderLine + "\x1B[0m") for i in [1..@border]

    #need to find a way to put this in a cool function
    @lines.push(@styleString + @border_style + @text + @border_style + "\x1B[0m")

    if(@border != 0)
      @lines.push(@styleString + borderLine + "\x1B[0m") for i in [1..@border]

    @lines.join('\n')

module.exports = TextDecorator

