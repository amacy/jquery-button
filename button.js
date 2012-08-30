$(function() {
    // Assign variables to the divs
    var background = $("#container");
    var button = $(".button");
    var topLeft = $("#topLeft");
    var top = $("#top");
    var topRight = $("#topRight");
    var right = $("#right");
    var bottomRight = $("#bottomRight");
    var bottom = $("#bottom");
    var bottomLeft = $("#bottomLeft");
    var left = $("#left");

    // Set the dimensions of the #container to fit the initial size of the viewport
    var viewportWidth = $(window).width();
    var viewportHeight = $(window).height();
    background.css({
        "width": viewportWidth,
        "height": viewportHeight
    });

    // If the window is resized, resize background (and reset the viewport variables!)
    $(window).resize(function() {
        viewportWidth = $(window).width();
        viewportHeight = $(window).height();
        background.css({
            "width": viewportWidth,
            "height": viewportHeight
        });
    });

    // Calculate the center of the window
    var centerX = (viewportWidth / 2);
    var centerY = (viewportHeight / 2);

    // Function to position divs (based on the center point of the button)
    function move(divName, x, y) {
        divName.offset({
            top: (y - 27),
            left: (x - 77)
        });
    };
    
    // Give them starting positions (also call when mouse leaves the window to re-start)
    function startAll() {
        move(button, centerX, centerY);
         move(topLeft, (centerX - parseInt(viewportWidth)), (centerY - parseInt(viewportHeight)));
         move(top, centerX, (centerY - parseInt(viewportHeight)));
      move(topRight, (centerX + parseInt(viewportWidth)), (centerY - parseInt(viewportHeight)));
      move(right, (centerX + parseInt(viewportWidth)), centerY);
      move(bottomRight, (centerX + parseInt(viewportWidth)), (centerY + parseInt(viewportHeight)));
      move(bottom, centerX, (centerY + parseInt(viewportHeight)));
      move(bottomLeft, (centerX - parseInt(viewportWidth)), (centerY + parseInt(viewportHeight)));
      move(left, (centerX - parseInt(viewportWidth)), centerY);
        };
        startAll();

    // Declare variables to store last mouse movement
    var lastX = null;
    var lastY = null;

    background.mousemove(function(e) {

        // Track mouse location
        var mouseX = e.pageX;
        var mouseY = e.pageY;

        // Track the location of the button's center
        var buttonX = button.offset().left + 77;
        var buttonY = button.offset().top + 27;

        // Calculate the absolute value of the distance b/w the mouse & the center of the button
        var distanceX = Math.abs(buttonX - mouseX);
        var distanceY = Math.abs(buttonY - mouseY);

        // Calculate speed at which the button moves
        function speed(distX, distY) {
            if (distX >= 250 || distY >= 250) {
                return 2;
            }
            else if (distX >= 125 || distY >= 125) {
                return 10;
            }
            else {
                return 50;
            }
        };

        // Store the calculated speeds in variables
        var buttonRate = speed(distanceX, distanceY);

        // Calculate the next X coordinates
        function calcX(x, rate) {

            // Declare variables to store the result
            var nextX = null;

            // If mouse has moved left & towards the center of the button
            if (lastX > mouseX && mouseX > buttonX) {
                nextX = x - rate;
            }
            // If mouse has moved right & towards the center of the button
            else if (lastX < mouseX && mouseX < buttonX) {
                nextX = x + rate;
            }
            // If the mouse hasn't moved horizontally
            else {
                nextX = x;
            }
            return nextX;
        };

        // Calculate the next Y coordinates
        function calcY(y, rate) {

            // Declare variables to store the result
            var nextY = null;

            // If mouse has moved up & towards the center of the button
            if (lastY > mouseY && mouseY > buttonY) {
                nextY = y - rate;
            }
            // If mouse has moved down & towards the center of the button
            else if (lastY < mouseY && mouseY < buttonY) {
                nextY = y + rate;
            }
            // If the mouse hasn't moved vertically
            else {
                nextY = y;
            }
            return nextY;
        };

        // Store the locations in variables
        var buttonNextX = calcX(buttonX, buttonRate);
        var buttonNextY = calcY(buttonY, buttonRate);

        // Create a function to move the button and divs at the same time
        function moveAll() {
            move(button, buttonNextX, buttonNextY);
            move(topLeft, (buttonNextX - parseInt(viewportWidth)), (buttonNextY - parseInt(viewportHeight)));
            move(top, buttonNextX, (buttonNextY - parseInt(viewportHeight)));
            move(topRight, (buttonNextX + parseInt(viewportWidth)), (buttonNextY - parseInt(viewportHeight)));
            move(right, (buttonNextX + parseInt(viewportWidth)), buttonNextY);
            move(bottomRight, (buttonNextX + parseInt(viewportWidth)), (buttonNextY + parseInt(viewportHeight)));
            move(bottom, buttonNextX, (buttonNextY + parseInt(viewportHeight)));
            move(bottomLeft, (buttonNextX - parseInt(viewportWidth)), (buttonNextY + parseInt(viewportHeight)));
            move(left, (buttonNextX - parseInt(viewportWidth)), buttonNextY);
        };

        // Declare variables for the edges of the button
        var edgeTop = buttonNextY - 27;
        var edgeRight = buttonNextX + 77;
        var edgeBottom = buttonNextY + 27;
        var edgeLeft = buttonNextX - 77;

        // Is the button disappearing?
            
          // To the top
        if (edgeBottom < 0) {
            // Move the button & temps
          buttonNextY += parseInt(viewportHeight);
          moveAll();
        }
                        
                // To the right
        else if (edgeLeft > parseInt(viewportWidth)) {
          buttonNextX -= parseInt(viewportWidth);
          moveAll();
        }
            
                // To the bottom
        else if (edgeTop > parseInt(viewportHeight)) {
          buttonNextY -= parseInt(viewportHeight);
          moveAll();
          }

                // To the left
        else if (edgeRight < 0) {
          buttonNextX += parseInt(viewportWidth);
          moveAll();
        }
        
        // If the button is completely inside the window
        else {
          moveAll();
        }

        // Store mouse location for use in the next mousemove event
        lastX = mouseX;
        lastY = mouseY;
    });

    // Prevent cheating by returning to the defaults on mouseleave
    background.mouseleave(function() {
        startAll();
    });
});​