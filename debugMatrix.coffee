class DebugMatrix
  constructor: (@options) ->
    @screenWidth = 80

  draw: () ->
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
      console.log(matrixObject)
      console.log("longest topic: " + longestTopicTitle)
      console.log("longest indicator: " + longestIndicatorTitle)



      borderLine = new Array(@screenWidth).join("\u2500")
      borderLineTop = "\u250C" + borderLine + "\u2510"
      borderLineBottom = "\u2514" + borderLine + "\u2518"


module.exports = new DebugMatrix
