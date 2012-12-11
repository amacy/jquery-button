jQuery ->
  # Assign variables to the divs
  background = $("#container")
  button = $(".button")
  topLeft = $("#topLeft")
  top = $("#top")
  topRight = $("#topRight")
  right = $("#right")
  bottomRight = $("#bottomRight")
  bottom = $("#bottom")
  bottomLeft = $("#bottomLeft")
  left = $("#left")

  # Set the dimensions to the initial size of the viewport
  viewportWidth = $(window).width()
  viewportHeight = $(window).height()
  background.css("width": viewportWidth, "height": viewportHeight)

  # If the window is resized, resize background & reset the viewport vars
  $(window).resize ->
    viewportWidth = $(window).width()
    viewportHeight = $(window).height()
    background.css("width": viewportWidth, "height": viewportHeight)
    return

  # Prevent cheating by returning to the defaults on mouseleave
  background.mouseleave ->
    startAll()

  # Calculate the center of the window
  centerX = viewportWidth / 2
  centerY = viewportHeight / 2

  # Position divs based on the center point of the button
  move = (divName, x, y) ->
    divName.offset(top: (y - 27), left: (x - 77))
    return

  # Give them starting positions (also call when mouse leaves the window to re-start)
  startAll = ->
    move(button, centerX, centerY)
    move(topLeft, (centerX - parseInt(viewportWidth)), (centerY - parseInt(viewportHeight)))
    move(top, centerX, (centerY - parseInt(viewportHeight)))
    move(topRight, (centerX + parseInt(viewportWidth)), (centerY - parseInt(viewportHeight)))
    move(right, (centerX + parseInt(viewportWidth)), centerY)
    move(bottomRight, (centerX + parseInt(viewportWidth)), (centerY + parseInt(viewportHeight)))
    move(bottom, centerX, (centerY + parseInt(viewportHeight)))
    move(bottomLeft, (centerX - parseInt(viewportWidth)), (centerY + parseInt(viewportHeight)))
    move(left, (centerX - parseInt(viewportWidth)), centerY)
    return
      
  startAll()

  # Declare variables to store last mouse movement
  lastX = null
  lastY = null

  background.mousemove (e) ->
    # Track mouse location
    mouseX = e.pageX
    mouseY = e.pageY
    # Track the location of the button's center
    buttonX = button.offset().left + 77
    buttonY = button.offset().top + 27
    # Calculate the absolute value of the distance b/w the mouse & the center of the button
    distanceX = Math.abs(buttonX - mouseX)
    distanceY = Math.abs(buttonY - mouseY)
    # Calculate speed at which the button moves
    speed = (distX, distY) ->
      if distX >= 250 || distY >= 250
        5
      else if distX >= 125 || distY >= 125
        10
      else
        50

    # Store the calculated speeds in variables
    buttonRate = speed(distanceX, distanceY)

    # Calculate the next X coordinates
    calcX = (x, rate) ->
      # Declare variables to store the result
      nextX = null
      # If mouse has moved left & towards the center of the button
      if lastX > mouseX && mouseX > buttonX
        nextX = x - rate
      # If mouse has moved right & towards the center of the button
      else if lastX < mouseX && mouseX < buttonX
        nextX = x + rate
      # If the mouse hasn't moved horizontally
      else
        nextX = x
      nextX
      
    # Calculate the next Y coordinates
    calcY = (y, rate) ->
      # Declare variables to store the result
      nextY = null
      # If mouse has moved up & towards the center of the button
      if lastY > mouseY && mouseY > buttonY
        nextY = y - rate
      # If mouse has moved down & towards the center of the button
      else if lastY < mouseY && mouseY < buttonY
        nextY = y + rate
      # If the mouse hasn't moved vertically
      else
        nextY = y
      nextY
      
    # Store the locations in variables
    buttonNextX = calcX(buttonX, buttonRate)
    buttonNextY = calcY(buttonY, buttonRate)

    # Create a function to move the button and divs at the same time
    moveAll = ->
      move(button, buttonNextX, buttonNextY)
      move(topLeft, (buttonNextX - parseInt(viewportWidth)), (buttonNextY - parseInt(viewportHeight)))
      move(top, buttonNextX, (buttonNextY - parseInt(viewportHeight)))
      move(topRight, (buttonNextX + parseInt(viewportWidth)), (buttonNextY - parseInt(viewportHeight)))
      move(right, (buttonNextX + parseInt(viewportWidth)), buttonNextY)
      move(bottomRight, (buttonNextX + parseInt(viewportWidth)), (buttonNextY + parseInt(viewportHeight)))
      move(bottom, buttonNextX, (buttonNextY + parseInt(viewportHeight)))
      move(bottomLeft, (buttonNextX - parseInt(viewportWidth)), (buttonNextY + parseInt(viewportHeight)))
      move(left, (buttonNextX - parseInt(viewportWidth)), buttonNextY)
      return

    # Declare variables for the edges of the button
    edgeTop = buttonNextY - 27
    edgeRight = buttonNextX + 77
    edgeBottom = buttonNextY + 27
    edgeLeft = buttonNextX - 77

    # Is the button disappearing?
    # To the top
    if edgeBottom < 0
      # Move the button & temps
      buttonNextY += parseInt(viewportHeight)
      moveAll()
    # To the right
    else if edgeLeft > parseInt(viewportWidth)
      buttonNextX -= parseInt(viewportWidth)
      moveAll()
    # To the bottom
    else if edgeTop > parseInt(viewportHeight)
      buttonNextY -= parseInt(viewportHeight)
      moveAll()
    # To the left
    else if edgeRight < 0
      buttonNextX += parseInt(viewportWidth)
      moveAll()
    # If the button is completely inside the window
    else
      moveAll()
    # Store mouse location for use in the next mousemove event
    lastX = mouseX
    lastY = mouseY
    return
