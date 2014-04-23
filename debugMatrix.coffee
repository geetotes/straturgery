class DebugMatrix
  constructor: (@options) ->
    @screenWidth = 80

  wrapString: (text, wrapper) ->
    wrapper + text + wrapper

  checkLinesForKey: (lines, key) ->
    for line in lines
      if line.indexOf(key) > -1
        console.log("line: " + line + " matches index: " + key)
        return true
    


  draw: () ->
      lines = []
      headers = ["Topic", "Indicators", "Value"]
      matrixObject = {
        "Occupation Capacity": {
          "Strength of Intelligence": [4,3,2,1,0,3,4,2,4],
          "Ability to Deliver Goods/Services": [3,2,1,3,2,1,1,3]
        }
      }
      #determine width of topic header
      longestTopicTitle = 0
      longestIndicatorTitle = 0
      for key, value of matrixObject
        if key.length > longestTopicTitle then longestTopicTitle = key.length
        for key2, value2 of value
          if key2.length > longestIndicatorTitle then longestIndicatorTitle = key2.length


      valueLength = 16
      while (longestTopicTitle + longestIndicatorTitle + valueLength) < @screenWidth
        longestTopicTitle += 1
        longestIndicatorTitle += 1

      topBorder1 = new Array(longestTopicTitle - 2).join("\u2500")
      topBorder1 = "\u250C" + topBorder1 + "\u252C"

      topBorder2 = new Array(longestIndicatorTitle - 1).join("\u2500")
      topBorder2 = topBorder2 + "\u252C"

      topBorder3 = new Array(valueLength - 1).join("\u2500")
      topBorder3 = topBorder3 + "\u2510"

      borderLineTop = topBorder1 + topBorder2 + topBorder3
      lines.push(borderLineTop)

      for key, value of matrixObject
        for key2, value2 of value
          currentLine = ""
          if @checkLinesForKey(lines, key)
            currentLine = @wrapString(new Array(longestTopicTitle).join(" "), "\u2502")
          else
            currentLine = "\u2502" + key + "\x1B[" + (longestTopicTitle - key.length) + "C\u2502"
          currentLine += key2 + "\x1B[" + (longestIndicatorTitle - key2.length) + "C\u2502"
          currentLine += value2.join("\u2502")
          lines.push(currentLine)

      #borderLine = new Array(@screenWidth).join("\u2500")
      #borderLineTop = "\u250C" + borderLine + "\u2510"
      #borderLineBottom = "\u2514" + borderLine + "\u2518"

      lines.join("\n")


module.exports = new DebugMatrix
