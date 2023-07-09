function CGame(iPlayers, iPlayerColour, iMode, aPlayersColor) {
    var _aPlayers; // ARRAY CONTAINING THE PLAYERS
    var _aCurveMapData;

    var _iPlayers; // HOW MANY PLAYERS WILL BE IN THIS MATCH (INCLUDING THE HUMAN PLAYER)
    var _iPlayerColour; // WHAT COLOR THE PLAYER HAS CHOSEN    
    var _iPlayerTurn;
    var _iDiceResult; // HOW MANY POINTS THE PLAYER HAS COLLECTED WITH THE LAUNCH
    var _iPlayerDiceLaunch; // THE REAL DICE RESULT FROM THE LAUNCH
    var _iSpecialSquareTimer;
    var _iTurn;
    var _iMode;

    var _bStartGame;
    var _bTurnReady;
    var _bSpecialSquareActive;
    var _bPlayerChuteMovement;
    var _bFirstTime;

    var _oBoardContainer;
    var _oObstaclesContainer;
    var _oLaddersContainer;
    var _oPlayersContainer;
    var _oPlayersShadowsContainer;
    var _oMotivationalMsg;
    var _oExtraDiceMsg;
    var _oHelpPanel;
    var _oInterface;
    var _oEndPanel;
    var _oBg;
    var _oCallbackSpecialSquare;
    var _oBoard;
    var _oPlayersInterface;
    var _oDiceLaunch;
    var _fRequestFullScreen = null;
    var _fCancelFullScreen = null;

    this._init = function(iPlayers, iPlayerColour, iMode, aPlayersColor) {
        _iMode = iMode;
        _iPlayers = iPlayers;
        _iPlayerColour = iPlayerColour;
        _aPlayers = [];
        _aCurveMapData = [];
        $(s_oMain).trigger("start_session");
        this.resetVariables();
        s_oBezier = new CBezier();

        var oSprite = s_oSpriteLibrary.getSprite("bg_game" + s_iModeGame);
        _oBg = createBitmap(oSprite);
        _oBg.cache(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        _oBoardContainer = new createjs.Container;
        _oObstaclesContainer = new createjs.Container;
        _oLaddersContainer = new createjs.Container;
        s_oStage.addChild(_oBg, _oBoardContainer, _oObstaclesContainer, _oLaddersContainer);

        _oBoard = new CBoard(_oBoardContainer, _oObstaclesContainer, _oLaddersContainer);
        _oPlayersShadowsContainer = new createjs.Container;
        _oPlayersContainer = new createjs.Container;
        s_oStage.addChild(_oPlayersShadowsContainer, _oPlayersContainer);

        if (_iMode === HUMAN_VS_CPU) {
            var aRandomColors = [0, 1, 2, 3, 4, 5];
            shuffle(aRandomColors);

            /////DELETE PLAYER COLOR FROM ARRAY
            var iIndexToDelete = aRandomColors.indexOf(_iPlayerColour);
            aRandomColors.splice(iIndexToDelete, 1);

            _iPlayerTurn = Math.floor(Math.random() * _iPlayers);

            aRandomColors.splice(_iPlayerTurn, 0, _iPlayerColour);

            // CREATE THE PLAYERS
            var aPlayersColor = new Array();
            for (var i = 0; i < _iPlayers; i++) {
                _aPlayers.push(new CPlayers(i, _oPlayersContainer, _oPlayersShadowsContainer, aRandomColors[i]));
                aPlayersColor.push(aRandomColors[i]);
            };
        } else {
            for (var i = 0; i < _iPlayers; i++) {
                _aPlayers.push(new CPlayers(i, _oPlayersContainer, _oPlayersShadowsContainer, aPlayersColor[i]));
            };
        }



        this.arrangePlayerZ();

        _oDiceLaunch = new CDice();
        _oPlayersInterface = new CPlayersInterface(aPlayersColor);
        _oInterface = new CInterface(_oPlayersInterface);
        _oEndPanel = new CEndPanel(s_oSpriteLibrary.getSprite('msg_box'));
        _oEndPanel.addEventListener(ON_BACK_MENU, this.onExit, this);
        _oEndPanel.addEventListener(ON_RESTART, this.restartGame, this);
        _oEndPanel.addEventListener(ON_CHECK, this.checkBoard, this);

        _oHelpPanel = new CHelpPanel();

        setVolume("soundtrack", 0.3);

        _bFirstTime = true;
    };

    this.resetVariables = function() {
        _bStartGame = false;
        _bTurnReady = false;
        _bSpecialSquareActive = false;
        _bPlayerChuteMovement = false;

        _iTurn = 0;
    };

    this._unload = function() {
        _bStartGame = false;


        _oEndPanel.unload();

        _oBoard.unload();
        _oDiceLaunch.unload();
        _oInterface.unload();
        s_oStage.removeAllChildren();
        createjs.Tween.removeAllTweens();

        if (s_bMobile === false) {
            document.onkeydown = null;
            document.onkeyup = null;
        }
    };

    this.onExit = function() {
        this._unload();
        $(s_oMain).trigger("show_interlevel_ad");
        $(s_oMain).trigger("end_session");
        setVolume("soundtrack", 1);
        s_oMain.gotoMenu();
    };

    this._onExitHelp = function() {
        _bStartGame = true;
        _bTurnReady = true;

        if (_bFirstTime) {
            PokiSDK.gameplayStart();

            _bFirstTime = false;
        }

    };

    this.pause = function(value) {
        if (!value) {
            if (_bStartGame) {
                return;
            }
            PokiSDK.gameplayStart();
        } else {
            if (!_bStartGame) {
                return;
            }
            PokiSDK.gameplayStop();
        }

        _bStartGame = !value;
        s_oDices.setPaused(value);


    };

    this.getDiceResult = function(value) {
        _iPlayerDiceLaunch = value;
    };

    this.movePlayer = function(iResult) {
        _iDiceResult = iResult;
        _aPlayers[_iTurn].setArrowVisible(false);
        this.setPlayerPos(_iTurn);
    };

    this.setPlayerPos = function(iPlayerN) {
        this.playerAdvance(iPlayerN, _iDiceResult);
    };

    this.arrangeSquarePlayers = function(iPlayer, iSquare, iPlayersInSquare) {
        var iOffsetFixed = 5;
        var iOffset = 0;

        if (iPlayersInSquare % 2 === 0) {
            iOffset = iOffsetFixed * (Math.floor(iPlayersInSquare / 2));
        } else {
            iOffset = -1 * iOffsetFixed * (Math.floor(iPlayersInSquare / 2));
        }

        new createjs.Tween.get(_aPlayers[iPlayer].getSprite()).to({
            x: this.getBoardSquareX(iSquare) + iOffset,
            y: this.getBoardSquareY(iSquare) + iOffset
        }, 150);
        if (s_iModeGame === MODE_SNAKES) {
            new createjs.Tween.get(_aPlayers[iPlayer].getShadow()).to({
                x: this.getBoardSquareX(iSquare) + iOffset,
                y: this.getBoardSquareY(iSquare) + iOffset
            }, 150);
        };
    };

    this.checkForAnotherPlayer = function(iSquare, iPlayerN) {
        var iPlayersInTheSameSquare = 0;

        for (var i = 0; i < _aPlayers.length; i++) {
            var iPosition = _aPlayers[i].getPosition();
            if (iPosition === iSquare) {
                iPlayersInTheSameSquare += 1;
            };
        }

        // IF THERE'S MORE THAN ONE PLAYER IN THIS SQUARE, ARRANGE THEIR POSITIONS FOR A BETTER VIEW
        if (iPlayersInTheSameSquare > 1) {
            s_oGame.arrangeSquarePlayers(iPlayerN, iSquare, iPlayersInTheSameSquare);
            s_oGame.arrangePlayerZ();
        } else {
            s_oBoard.setSquareOccupied(iSquare, false);
        };
    };

    this.checkForSpecialSquares = function(iPlayerN) {
        var iSquare = _aPlayers[iPlayerN].getPosition();
        this.checkForAnotherPlayer(iSquare, iPlayerN);
        _bSpecialSquareActive = true;
        _iSpecialSquareTimer = 0;

        if (iSquare === LAST_SQUARE) {
            s_oGame.onWin(iPlayerN);
        };

        // IF THE PLAYER ARRIVES ON A SNAKE/CHUTE SQUARE, WILL GO BACK TO THE END OF THE SNAKE
        if (ifArrayContainsValue(OBSTACLES_SQUARES, iSquare) === true) {
            playSound("malus", 1, false);
            _oMotivationalMsg = new CMotivationalMsg(MSG_BAD);
            _oCallbackSpecialSquare = {
                function: this.obstacleSquare,
                param: iPlayerN
            };

            // IF THE PLAYER ARRIVES ON A LADDER SQUARE, WILL GO UP TO THE TOP OF THE LADDER
        } else if (ifArrayContainsValue(LADDERS_SQUARES, iSquare) === true) {
            PokiSDK.happyTime(0.5);
            playSound("bonus", 1, false);
            _oMotivationalMsg = new CMotivationalMsg(MSG_GOOD);
            _oCallbackSpecialSquare = {
                function: this.ladderSquare,
                param: iPlayerN
            };
            // IF THE PLAYER ARRIVES ON A NORMAL SQUARE, WILL CHANGE TURN
        } else {
            _oCallbackSpecialSquare = {
                function: this.changeTurn,
                param: true
            };
        };
    };

    this.obstacleSquare = function(iPlayerN) {
        var iStartSquare = _aPlayers[iPlayerN].getPosition();
        s_oGame.startObstacleAnimation(iStartSquare, iPlayerN);
    };

    this.startObstacleAnimation = function(iSquare, iPlayerN) {
        var iIndex = OBSTACLES_SQUARES.indexOf(iSquare);
        var oPlayer = _aPlayers[iPlayerN].getSprite();

        if (s_iModeGame === MODE_SNAKES) {
            var oShadow = _aPlayers[iPlayerN].getShadow();

            oShadow.visible = false;

            var aSnakeAnimations = _oBoard.getObstaclesArray();
            var iX = this.getBoardSquareX(iSquare);
            var iY = this.getBoardSquareY(iSquare);

            aSnakeAnimations[iIndex].gotoAndPlay('idle');
            playSound("eat", 1, false);

            new createjs.Tween.get(oPlayer)
                .to({
                    scaleX: 0,
                    scaleY: 0
                }, 300, createjs.Ease.quadOut)
                .to({
                    x: iX,
                    y: iY
                }, SNAKE_SPEED, createjs.Ease.quadOut)
                .call(function() {
                    s_oGame.obstacleAnimationOver(iPlayerN, iIndex);
                });
        } else {
            _aPlayers[iPlayerN].animationSlide();

            var aChuteCoords;
            _aCurveMapData.length = 0; // EMPTY THE ARRAY TO RESTART FROM FRESH

            switch (iSquare) {
                case 16:
                    aChuteCoords = CHUTES_COORDS_16;
                    break;
                case 47:
                    aChuteCoords = CHUTES_COORDS_47;
                    break;
                case 49:
                    aChuteCoords = CHUTES_COORDS_49;
                    break;
                case 56:
                    aChuteCoords = CHUTES_COORDS_56;
                    break;
                case 62:
                    aChuteCoords = CHUTES_COORDS_62;
                    break;
                case 64:
                    aChuteCoords = CHUTES_COORDS_64;
                    break;
                case 87:
                    aChuteCoords = CHUTES_COORDS_87;
                    break;
                case 93:
                    aChuteCoords = CHUTES_COORDS_93;
                    break;
                case 95:
                    aChuteCoords = CHUTES_COORDS_95;
                    break;
                case 98:
                    aChuteCoords = CHUTES_COORDS_98;
                    break;
            }

            s_oGame.initCurve(aChuteCoords);
        };
    };

    // THIS WILL CREATE THE BEZIER CURVE FOR CHUTES ANIMATION
    this.initCurve = function(aChuteCoords) {
        playSound("chute", 1, false);

        var _aChuteCoords = aChuteCoords;

        for (var i = 0; i < _aChuteCoords.length - 2; i++) {
            var oPoint0 = new createjs.Point(_aChuteCoords[i][0], _aChuteCoords[i][1]);
            var oPoint1 = new createjs.Point(_aChuteCoords[i + 1][0], _aChuteCoords[i + 1][1]);
            var oPoint2 = new createjs.Point(_aChuteCoords[i + 2][0], _aChuteCoords[i + 2][1]);
            i += 1;

            var steps = s_oBezier.init(oPoint0, oPoint1, oPoint2, STEP_LENGTH);
            for (var m = 1; m <= steps; ++m) {
                var data = s_oBezier.getAnchorPoint(m);
                _aCurveMapData.push(data);
            };
        };

        _bPlayerChuteMovement = true;
    };

    this.obstacleAnimationOver = function(iPlayerN, iIndex) {
        var iDestSquare = OBSTACLES_MOVEMENT_SQUARES[iIndex][1];
        var oPlayer = _aPlayers[iPlayerN].getSprite();
        var iX = BOARD_SQUARES[iDestSquare][0];
        var iY = BOARD_SQUARES[iDestSquare][1];

        if (s_iModeGame === MODE_SNAKES) {
            var oShadow = _aPlayers[iPlayerN].getShadow();

            playSound("snake", 1, false);
            oPlayer.x = oShadow.x = iX;
            oPlayer.y = oShadow.y = iY;
            _aPlayers[iPlayerN].setVisible(true);

            var iSpeed = 250;

            new createjs.Tween.get(oPlayer)
                .to({
                    scaleX: 1,
                    scaleY: 1
                }, iSpeed, createjs.Ease.cubicOut);
        } else {
            var iSpeedTween = 100;

            new createjs.Tween.get(_aPlayers[iPlayerN].getSprite())
                .to({
                    x: iX,
                    y: iY
                }, iSpeedTween, createjs.Ease.quadIn)
                .call(function() {
                    _aPlayers[iPlayerN].animationIdle();
                });
        };

        _aPlayers[iPlayerN].setPosition(iDestSquare + 1);
        s_oGame.playerArrived(iPlayerN);
    };

    this.ladderSquare = function(iPlayerN) {
        var oPlayer = _aPlayers[iPlayerN].getSprite();

        if (s_iModeGame === MODE_SNAKES) {
            var oShadow = _aPlayers[iPlayerN].getShadow();
        };

        for (var i = 0; i < LADDER_MOVEMENT_SQUARES.length; i++) {
            if (_aPlayers[iPlayerN].getPosition() === LADDER_MOVEMENT_SQUARES[i][0]) {
                var iDestSquare = LADDER_MOVEMENT_SQUARES[i][1];
                var iX = BOARD_SQUARES[iDestSquare][0];
                var iY = BOARD_SQUARES[iDestSquare][1];

                playSound("ladder", 1, false);

                new createjs.Tween.get(oPlayer)
                    .to({
                        x: iX,
                        y: iY
                    }, LADDERS_SPEED, createjs.Ease.cubicOut)
                    .call(function() {
                        _aPlayers[iPlayerN].setPosition(iDestSquare + 1);
                        s_oGame.playerArrived(iPlayerN);
                    });
                if (s_iModeGame === MODE_SNAKES) {
                    new createjs.Tween.get(oShadow)
                        .to({
                            x: iX,
                            y: iY
                        }, LADDERS_SPEED, createjs.Ease.cubicOut);
                };
            };
        };
    };

    this.endTimeoutSpecialSquare = function() {
        var oFunctionToCall = _oCallbackSpecialSquare.function;
        oFunctionToCall(_oCallbackSpecialSquare.param);
        _bSpecialSquareActive = false;
    };

    this.changeTurn = function() {
        s_oDices.fadeOutTween();

        if (_iPlayerDiceLaunch !== 6) {
            // CHANGE TURN
            _iTurn++;
            if (_iTurn > _iPlayers - 1) {
                _iTurn = 0;
            };

            s_oGame.changePlayerTurn();
        } else {
            // THE PLAYER GETS AN EXTRA DICE FOR A PERFECT 6
            playSound("bonus", 1, false);
            _oExtraDiceMsg = new CMotivationalMsg(MSG_DICE);
        };
    };

    this.extraDiceLaunch = function() {
        s_oDices.show();
    };

    // WHEN THE PLAYER ARRIVES IN THE CORRECT SQUARE
    this.playerArrived = function(iPlayerN) {
        if (s_iModeGame === MODE_CHUTES) {
            _aPlayers[iPlayerN].animationIdle();
        };

        _iDiceResult++; // TO MATCH THE DICE RESULT (FOR NEXT SQUARES)
        _aPlayers[iPlayerN].decreasePosition(); // TO MATCH GRAPHIC AND LOGICAL POSITION OF THE PLAYER
        s_oGame.checkToFlip(iPlayerN);
        this.checkForSpecialSquares(iPlayerN);
    };

    this.playerBounceTween = function(iPlayerN) {
        var iBounceSpeed = 150;
        var iY = s_oGame.getBoardSquareY(_aPlayers[iPlayerN].getPosition());

        new createjs.Tween.get(_aPlayers[iPlayerN].getSprite())
            .to({
                y: iY - 20
            }, iBounceSpeed, createjs.Ease.quadIn)
            .to({
                y: iY
            }, iBounceSpeed, createjs.Ease.quadIn);
    };

    this.playerAdvance = function(iPlayerN, iStepsCounter) {
        s_oGame.arrangePlayerZ();

        _aPlayers[iPlayerN].increasePosition();

        if (iStepsCounter === 0) {
            s_oGame.playerArrived(iPlayerN);
            return;
        };

        if (iStepsCounter > 0) {
            var iBounceSpeed = 150;
            var iMovementSpeed = 300;
            var iX = s_oGame.getBoardSquareX(_aPlayers[iPlayerN].getPosition());
            var iY = s_oGame.getBoardSquareY(_aPlayers[iPlayerN].getPosition());
            var oEase;

            s_oGame.checkToFlip(iPlayerN);

            if (s_iModeGame === MODE_SNAKES) {
                oEase = createjs.Ease.quadIn;
                // "Bounce" effect for player and shadow
                this.playerBounceTween(iPlayerN);

                new createjs.Tween.get(_aPlayers[iPlayerN].getShadow())
                    .to({
                        alpha: 0.5
                    }, iBounceSpeed, createjs.Ease.quadIn)
                    .to({
                        alpha: 1
                    }, iBounceSpeed, createjs.Ease.quadIn);
            } else {
                oEase = createjs.Ease.linear;
                _aPlayers[iPlayerN].animationWalk();
            };

            new createjs.Tween.get(_aPlayers[iPlayerN].getSprite())
                .to({
                    x: iX,
                    y: iY
                }, iMovementSpeed, oEase)
                .call(function() {
                    playSound("step_land", 1, false);
                    // ALWAYS RESPECT PLAYERS' Z POSITIONS
                    s_oGame.arrangePlayerZ();
                    iStepsCounter--;
                    s_oGame.checkFinalSquare(iPlayerN, iStepsCounter);
                });

            if (s_iModeGame === MODE_SNAKES) {
                new createjs.Tween.get(_aPlayers[iPlayerN].getShadow())
                    .to({
                        x: iX,
                        y: iY
                    }, iMovementSpeed, createjs.Ease.quadIn);
            };
        };
    };

    this.checkFinalSquare = function(iPlayerN, iStepsCounter) {
        s_oGame.arrangePlayerZ();

        var iPosition = _aPlayers[iPlayerN].getPosition();

        if (PERFECT_SCORE === true) {
            // IF THE PLAYER ARRIVES PRECISELY AT THE END OF THE BOARD IS GAME OVER
            if (iPosition === LAST_SQUARE && iStepsCounter === 0) {
                s_oGame.onWin(iPlayerN);
            };

            if (iPosition >= LAST_SQUARE) {
                // IF THE PLAYER ARRIVES AT THE END OF THE MAZE WITH POINTS TO SPEND, GO BACK
                s_oGame.playerBack(iPlayerN, iStepsCounter);
            } else {
                s_oGame.playerAdvance(iPlayerN, iStepsCounter);
            };
        } else {
            // IF THE PLAYER ARRIVES AT THE END OF THE BOARD IS GAME OVER
            if (iPosition === LAST_SQUARE) {
                s_oGame.onWin(iPlayerN);
            } else {
                s_oGame.playerAdvance(iPlayerN, iStepsCounter);
            };
        }
    };

    this.playerBack = function(iPlayerN, iStepsCounter) {
        s_oGame.arrangePlayerZ();

        _aPlayers[iPlayerN].decreasePosition();

        if (iStepsCounter === 0) {
            if (s_iModeGame === MODE_CHUTES) {
                _aPlayers[iPlayerN].animationIdle();
            };
            _iDiceResult--; // TO MATCH THE DICE RESULT (FOR NEXT SQUARES)
            _aPlayers[iPlayerN].increasePosition(); // TO MATCH GRAPHIC AND LOGICAL POSITION OF THE PLAYER
            s_oGame.checkForSpecialSquares(iPlayerN);
            return;
        };

        if (iStepsCounter > 0) {
            s_oGame.checkToFlip(iPlayerN);

            var iSpeed = 100;
            var iX = s_oGame.getBoardSquareX(_aPlayers[iPlayerN].getPosition());
            var iY = s_oGame.getBoardSquareY(_aPlayers[iPlayerN].getPosition());

            new createjs.Tween.get(_aPlayers[iPlayerN].getSprite())
                .to({
                    x: iX,
                    y: iY
                }, iSpeed, createjs.Ease.quadIn)
                .call(function() {
                    // ALWAYS RESPECT PLAYERS' Z POSITIONS
                    s_oGame.arrangePlayerZ();
                    iStepsCounter--;
                    s_oGame.playerBack(iPlayerN, iStepsCounter);
                });

            if (s_iModeGame === MODE_SNAKES) {
                new createjs.Tween.get(_aPlayers[iPlayerN].getShadow())
                    .to({
                        x: iX,
                        y: iY
                    }, iSpeed, createjs.Ease.quadIn);
            };
        };
    };

    this.changePlayerTurn = function() {
        s_oGame.arrangePlayerZ();
        s_oGame.setTurnReady(true);
        return false;
    };

    this.setPlayerVisible = function(iPlayer) {
        _aPlayers[iPlayer].setVisible(true);
    };

    this.onWin = function(playerN) {
        s_oGame.pause(true);

        _bStartGame = false;
        _iTurn = null;
        s_aGamesPlayed++;
        saveItem("snakesandladders_gamesplayed", s_aGamesPlayed);

        if (s_iModeGame === MODE_CHUTES) {
            for (var i = 0; i < _aPlayers.length; i++) {
                _aPlayers[i].animationIdle();
            }
        }

        if (_iMode === HUMAN_VS_CPU) {
            if (playerN === _iPlayerTurn) {
                // PLAYER WINS!
                s_aGamesWon++;
                saveItem("snakesandladders_gameswon", s_aGamesWon);
                s_oGame.gameWin();
            } else {
                // CPU WINS!
                s_oGame.gameOver(playerN);
            };
        } else {
            s_aGamesWon++;
            saveItem("snakesandladders_gameswon", s_aGamesWon);
            s_oGame.gameWin();
        };
    };

    this.gameWin = function(playerN) {
        PokiSDK.happyTime(1);

        _bStartGame = false;
        playSound("game_win", 1, false);

        _oEndPanel.show(true);
    };

    this.setTurnReady = function(value) {
        _bTurnReady = value;
    };

    this.isTurnReady = function() {
        return _bTurnReady;
    };

    this.gameOver = function(playerN) {
        _bStartGame = false;
        playSound("game_over", 1, false);

        _oEndPanel.show(false);
    };

    this.restartGame = function() {
        s_oGame.pause(false);

        s_oDices.hide();
        _oEndPanel.hide();

        s_oGame.resetVariables();
        _bStartGame = true;
        _bTurnReady = true;


        for (var i = 0; i < _aPlayers.length; i++) {
            _aPlayers[i].reset();
        }

        this.arrangePlayerZ();

    };

    this.checkBoard = function() {

        var oClickPanel = new createjs.Shape();
        oClickPanel.graphics.beginFill("rgba(0,0,0,0.4)").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        oClickPanel.on("click", s_oGame.returnToEndPanel, s_oGame, true, oClickPanel);
        s_oStage.addChild(oClickPanel);

        _oEndPanel.hide();
    };

    this.returnToEndPanel = function(evt, oClickPanel) {
        s_oStage.removeChild(oClickPanel);
        _oEndPanel.reShow();
    };

    this.launchDices = function() {
        if (_iMode === HUMAN_VS_CPU) {
            if (_iTurn !== _iPlayerTurn) {
                return;
            };
        };
        if (s_oInterface.DicesEnabled() !== true) {
            return;
        } else if (s_oGame.isTurnReady() === true) {
            s_oDices.show(); // LAUNCH DICES
        };
    };

    this.getBoardSquareX = function(iPosPlayer) {
        return BOARD_SQUARES[iPosPlayer][0];
    };

    this.getBoardSquareY = function(iPosPlayer) {
        return BOARD_SQUARES[iPosPlayer][1];
    };

    this.arrangePlayerZ = function() {
        var aPlayersList = [];
        for (var i = 0; i < _oPlayersContainer.children.length; i++) {
            var oPlayer = _oPlayersContainer.children[i];
            aPlayersList.push({
                height: oPlayer.y,
                player: oPlayer
            });
        };
        aPlayersList.sort(this.compareHeight);

        var iCurDepth = 0;
        for (var i = 0; i < _oPlayersContainer.children.length; i++) {
            _oPlayersContainer.setChildIndex(aPlayersList[i].player, iCurDepth++);
        }
    };

    this.compareHeight = function(a, b) {
        if (a.height < b.height)
            return -1;
        if (a.height > b.height)
            return 1;
        return 0;
    };

    this.getPlayerX = function(iPlayer) {
        var oPlayer = _aPlayers[iPlayer].getSprite();
        return oPlayer.x;
    };

    this.getPlayerY = function(iPlayer) {
        var oPlayer = _aPlayers[iPlayer].getSprite();
        return oPlayer.y;
    };

    this.checkToFlip = function(iPlayerN) {
        if (s_iModeGame === MODE_SNAKES) {
            return;
        };

        // CHECK IF IT'S NEEDED TO FLIP THE PLAYER IMAGE (HORIZONTALLY)
        var oPlayer = _aPlayers[iPlayerN].getSprite();
        var iPlayerPosition = _aPlayers[iPlayerN].getPosition();

        if (iPlayerPosition <= 10) {
            oPlayer.scaleX = 1;
        } else if (iPlayerPosition > 10 && iPlayerPosition <= 20) {
            oPlayer.scaleX = -1;
        } else if (iPlayerPosition > 20 && iPlayerPosition <= 30) {
            oPlayer.scaleX = 1;
        } else if (iPlayerPosition > 30 && iPlayerPosition <= 40) {
            oPlayer.scaleX = -1;
        } else if (iPlayerPosition > 40 && iPlayerPosition <= 50) {
            oPlayer.scaleX = 1;
        } else if (iPlayerPosition > 50 && iPlayerPosition <= 60) {
            oPlayer.scaleX = -1;
        } else if (iPlayerPosition > 60 && iPlayerPosition <= 70) {
            oPlayer.scaleX = 1;
        } else if (iPlayerPosition > 70 && iPlayerPosition <= 80) {
            oPlayer.scaleX = -1;
        } else if (iPlayerPosition > 80 && iPlayerPosition <= 90) {
            oPlayer.scaleX = 1;
        } else if (iPlayerPosition > 90) {
            oPlayer.scaleX = -1;
        };
    };

    this.setArrow = function(iTurn) {
        _aPlayers[iTurn].setArrowX(this.getPlayerX(iTurn));
        _aPlayers[iTurn].setArrowY(this.getPlayerY(iTurn));
    };

    this.checkForNextTurn = function() {
        // CHECK IF IT IS A CPU OR PLAYER TURN, ENABLE/DISABLE THE BUTTON
        if (_iMode === HUMAN_VS_CPU) {
            if (_iTurn !== _iPlayerTurn) {
                // CPU TURN
                _aPlayers[_iTurn].setArrowVisible(false);
                s_oDices.show();
                _oInterface.enableDices(false);
                _oInterface.animationDiceButtonStop();
            } else {
                // PLAYER TURN
                if (_aPlayers[_iTurn].isArrowVisible() === false) {
                    _aPlayers[_iTurn].setArrowVisible(true);
                    this.setArrow(_iTurn);
                };
                _oInterface.enableDices(true);
                if (_oInterface.DicesEnabled() === true) {
                    _oInterface.animationDiceButton();
                };
            };
        } else {
            if (_aPlayers[_iTurn].isArrowVisible() === false) {
                _aPlayers[_iTurn].setArrowVisible(true);
                this.setArrow(_iTurn);
            };
            _oInterface.enableDices(true);
            if (_oInterface.DicesEnabled() === true) {
                _oInterface.animationDiceButton();
            };
        };

        _oPlayersInterface.setTurn(_iTurn);
    };

    this.getCurveMapData = function() {
        return _aCurveMapData;
    };

    this.checkForFirstTurn = function() {
        if (s_oDices.isFirstLaunch) {
            for (var i = 0; i < _aPlayers.length; i++) {
                var iPlayerPos = _aPlayers[i].getPosition();

                if (iPlayerPos > 0) {
                    s_oDices.setFirstLaunch(false);
                } else {
                    s_oDices.setFirstLaunch(true);
                };
            };
        };
    };

    this.onEndChuteAnimation = function() {
        _bPlayerChuteMovement = false;

        var iIndexVar = _aPlayers[_iTurn].getPosition();

        for (var i = 0; i < OBSTACLES_MOVEMENT_SQUARES.length; i++) {
            if (iIndexVar === OBSTACLES_MOVEMENT_SQUARES[i][0]) {
                s_oGame.obstacleAnimationOver(_iTurn, i);
            };
        };
    };

    this.resetFullscreenBut = function() {
        if (_fRequestFullScreen && screenfull.enabled) {
            _oButFullscreen.setActive(s_bFullscreen);
        };
    };

    this._onFullscreenRelease = function() {
        if (s_bFullscreen) {
            _fCancelFullScreen.call(window.document);
        } else {
            _fRequestFullScreen.call(window.document.documentElement);
        }

        sizeHandler();
    };

    this.update = function() {
        if (_bStartGame !== true) {
            return;
        };

        // SET THE NEXT TURN PLAYER
        if (_bTurnReady === true) {
            this.checkForNextTurn();
        };

        // TIMER FOR SPECIAL SQUARES CONTROL
        if (_bSpecialSquareActive === true) {
            _iSpecialSquareTimer += s_iTimeElaps;

            if (_iSpecialSquareTimer > 500) {
                this.endTimeoutSpecialSquare();
            };
        };

        // MOVE THE PLAYER IN THE CHUTE
        if (_bPlayerChuteMovement) {
            _aPlayers[_iTurn].update();
        };
    };

    s_oGame = this;

    this._init(iPlayers, iPlayerColour, iMode, aPlayersColor);
}

var s_oGame;
var s_oBezier;