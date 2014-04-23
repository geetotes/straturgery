class TextDecorator
  constructor: (@options) ->
    @screenWidth = 80
    @background = @options.background ?= 232
    @foreground = @options.foreground ?= 70
    @text_decoration = @options.text_decoration ?= 0
    @border = @options.border ?= 1
    @border_style= @options.border_style ?= "*"
    @padding = @options.padding ?= 0
    @margin = @options.margin ?= 0
    @align = @options.align ?= "center"

    @styleString = "\x1B[" + @text_decoration + "m\x1B[48;5;" + @background + "m\x1B[38;5;" + @foreground + "m"
    console.log(@options)
  wrapString: (text, wrapper) ->
    wrapper + text + wrapper
  prependString: (text, wrapper) ->
    wrapper + text
  appendString: (text, wrapper) ->
    text + wrapper
  offsetString: (text, offset) ->
    "\x1B[" + offset + "C" + text
  drawBreak: (cols, symbol) ->
    new Array(cols).join(symbol) + "\n"
  draw: (@text) ->
    stringLength = @text.length
    @lines = []
    #need to refactor this
    if(@border_style == "ascii")
      borderLine = new Array(@text.length + 1).join("\u2500")
      borderLineTop = "\u250C" + borderLine + "\u2510"
      borderLineBottom = "\u2514" + borderLine + "\u2518"
      textMiddle = @wrapString(@text, "\u2502")
      @lines.push(borderLineTop)
      if(@padding > 0)
        spacer = new Array(@text.length + @padding).join(" ")
        for i in [1..@padding]
          @lines.push(@wrapString(spacer, "\u2502"))

        @lines.push(@wrapString(@text, "\u2502"))

        for i in [1..@padding]
          @lines.push(@wrapString(spacer, "\u2502"))

        @lines.push(borderLineBottom)

      else
        @lines.push(textMiddle, borderLineBottom)
    else
      borderLine = new Array(@text.length + 3).join(@border_style)
      if(@border != 0)
        @lines.push(@styleString + borderLine + "\x1B[0m") for i in [1..@border]

      #need to find a way to put this in a cool function
      @lines.push(@styleString + @border_style + @text + @border_style + "\x1B[0m")

      if(@border != 0)
        @lines.push(@styleString + borderLine + "\x1B[0m") for i in [1..@border]

    if(@align == "center")
      @newLines = []
      offset = Math.round((@screenWidth - @text.length)/2)
      console.log("offset: " + offset)
      @newLines.push(@offsetString(line, offset)) for line in @lines
      @lines = @newLines

    @lines.join('\n')

module.exports = TextDecorator


