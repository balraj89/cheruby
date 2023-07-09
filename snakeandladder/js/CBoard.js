function CBoard(oBoardContainer, oObstaclesContainer, oLaddersContainer) {
    var _oBoardContainer = oBoardContainer;
    var _oObstaclesContainer = oObstaclesContainer;
    var _oLaddersContainer = oLaddersContainer;

    var _aSqOccupiedCenter = []; // BOOLEANS FOR SQUARE OCCUPIED/FREE
    var _aSqOccupiedPoints = []; // BOOLEANS FOR SQUARE SINGLE COORDINATES OCCUPIED/FREE
    var _aRect = []; // LOGICAL RECTANGLES FOR SQUARES
    var _aLadders = [];
    var _aObstacles = [];

    this._init = function() {
        // Create the squares
        for (var i = 0; i <= LAST_SQUARE; i++) {
            var iX = BOARD_SQUARES[i][0];
            var iY = BOARD_SQUARES[i][1];

            // Generate a logic rectangle around each square
            var oRect = new createjs.Shape();
            oRect.graphics.beginFill("red");
            oRect.graphics.drawRect(0, 0, 44, 44);
            oRect.x = iX;
            oRect.y = iY;
            oRect.regX = 22;
            oRect.regY = 22;
            oRect.alpha = 0.5;
            oRect.visible = false; // Comment this to see the squares
            oRect.setBounds();
            _aRect.push(oRect);
            _oBoardContainer.addChild(oRect);

            // Set the square occupied to false
            _aSqOccupiedCenter.push(false);

            var aOccupiedSquares = [false, false, false, false];
            _aSqOccupiedPoints.push(aOccupiedSquares);
        };

        this.initLaddersOnBoard();
        this.initObstaclesOnBoard();
    };

    this.initObstaclesOnBoard = function() {
        // CREATE SNAKES OR CHUTES
        if (s_iModeGame === MODE_SNAKES) {
            var aSnakeWidth = [150, 150, 120, 190, 96, 170, 230, 100, 100, 100];
            var aSnakeHeight = [100, 150, 200, 72, 310, 90, 380, 130, 130, 130];
            var aSnakeX = [650, 780, 930, 730, 525, 525, 680, 855, 665, 495];
            var aSnakeY = [545, 400, 425, 280, 385, 275, 305, 120, 120, 120];

            for (var i = 0; i < OBSTACLES_SQUARES.length; i++) {
                var oData = {
                    images: [s_oSpriteLibrary.getSprite("snake_" + OBSTACLES_SQUARES[i])],
                    framerate: 30,
                    frames: {
                        width: aSnakeWidth[i],
                        height: aSnakeHeight[i],
                        regX: aSnakeWidth[i] / 2,
                        regY: aSnakeHeight[i] / 2
                    },
                    animations: {
                        stop: [0, 0],
                        idle: [0, 31, "stop"]
                    }
                };
                var oSpriteSheet = new createjs.SpriteSheet(oData);
                var oSnake = createSprite(oSpriteSheet, "stop", aSnakeHeight[i] / 2, aSnakeWidth[i] / 2, aSnakeHeight[i], aSnakeWidth[i]);
                oSnake.x = aSnakeX[i];
                oSnake.y = aSnakeY[i];
                _oObstaclesContainer.addChild(oSnake);
                _aObstacles.push(oSnake);
            };
        } else {
            var aChuteWidth = [152, 131, 90, 152, 86, 162, 177, 94, 102, 101];
            var aChuteHeight = [99, 116, 149, 54, 299, 97, 333, 118, 125, 127];
            var aChuteX = [555, 700, 850, 650, 480, 440, 600, 805, 625, 465];
            var aChuteY = [495, 335, 355, 265, 230, 215, 140, 60, 60, 60];

            for (var i = 0; i < OBSTACLES_SQUARES.length; i++) {
                var oSprite = s_oSpriteLibrary.getSprite("chute_" + OBSTACLES_SQUARES[i]);

                var oChute = createBitmap(oSprite, aChuteHeight[i], aChuteWidth[i]);
                oChute.x = aChuteX[i];
                oChute.y = aChuteY[i];
                _oObstaclesContainer.addChild(oChute);
                _aObstacles.push(oChute);
            };
        };
    };

    this.getObstaclesArray = function() {
        return _aObstacles;
    };

    this.initLaddersOnBoard = function() {
        var aLadderWidth = [149, 172, 99, 78, 250, 74, 166, 50, 46];
        var aLadderHeight = [189, 94, 172, 101, 348, 85, 93, 96, 95];
        var aLadderX = [415, 600, 850, 420, 585, 590, 765, 900, 410];
        var aLadderY = [385, 490, 400, 350, 115, 330, 215, 80, 80];

        for (var i = 0; i < LADDERS_SQUARES.length; i++) {
            var oSprite = s_oSpriteLibrary.getSprite("ladder_" + LADDERS_SQUARES[i]);
            var oLadder = createBitmap(oSprite, aLadderWidth[i], aLadderHeight[i]);
            oLadder.x = aLadderX[i];
            oLadder.y = aLadderY[i];
            _oLaddersContainer.addChild(oLadder);
            _aLadders.push(oLadder);
        };
    };

    this.setSquareOccupied = function(iSquare, value) {
        _aSqOccupiedCenter[iSquare] = value;
    };

    this.checkFreeSquarePoints = function(iSquare) {
        return _aSqOccupiedPoints[iSquare].indexOf(false);
    };

    this.unload = function() {
        s_oBoard = null;
    };

    s_oBoard = this;

    this._init();
}

var s_oBoard;