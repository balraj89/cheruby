function CDice() {
    var _oDiceContainer;
    var _iDiceResult;
    var _oDice;
    var _oDiceLaunch;
    var _bAnimationOn = false;
    var _bFirstLaunch;

    this._init = function() {
        _bFirstLaunch = true;

        s_oGame.setTurnReady(false);

        _oDiceContainer = new createjs.Container;
        s_oStage.addChild(_oDiceContainer);

        var iStartDicePosition = {
            x: CANVAS_WIDTH_HALF + 400,
            y: CANVAS_HEIGHT
        };

        var iWidthLaunch = 462 / 3;
        var iHeightLaunch = 702 / 3;

        // Dice launch animation
        var oData = {
            images: [s_oSpriteLibrary.getSprite("launch_dice")],
            framerate: 24,
            frames: {
                width: iWidthLaunch,
                height: iHeightLaunch,
                regX: iWidthLaunch,
                regY: iHeightLaunch
            },
            animations: {
                stop: [8, 8],
                idle: [0, 8, "stop"]
            }
        };
        var oSpriteSheet = new createjs.SpriteSheet(oData);
        _oDiceLaunch = createSprite(oSpriteSheet, 0, iWidthLaunch, iHeightLaunch, iWidthLaunch, iHeightLaunch);
        _oDiceLaunch.x = iStartDicePosition.x;
        _oDiceLaunch.y = iStartDicePosition.y;
        _oDiceLaunch.visible = false;
        _oDiceContainer.addChild(_oDiceLaunch);

        var iWidth = 900 / 6;
        var iHeight = 410;

        // Dice animation
        var oData = {
            images: [s_oSpriteLibrary.getSprite("dice_1"),
                s_oSpriteLibrary.getSprite("dice_2"),
                s_oSpriteLibrary.getSprite("dice_3"),
                s_oSpriteLibrary.getSprite("dice_4"),
                s_oSpriteLibrary.getSprite("dice_5"),
                s_oSpriteLibrary.getSprite("dice_6")
            ],
            framerate: 24,
            frames: {
                width: iWidth,
                height: iHeight,
                regX: iWidth,
                regY: iHeight
            },
            animations: {
                stop1: [11, 11],
                idle1: [0, 11, "stop1"],
                stop2: [23, 23],
                idle2: [12, 23, "stop2"],
                stop3: [35, 35],
                idle3: [24, 35, "stop3"],
                stop4: [47, 47],
                idle4: [36, 47, "stop4"],
                stop5: [59, 59],
                idle5: [48, 59, "stop5"],
                stop6: [71, 71],
                idle6: [60, 71, "stop6"]
            }
        };
        var oSpriteSheet = new createjs.SpriteSheet(oData);
        _oDice = createSprite(oSpriteSheet, 0, iWidth / 2, iHeight / 2, iWidth, iHeight);
        // DICE START POSITION (WITH OFFSET)
        _oDice.x = iStartDicePosition.x;
        _oDice.y = iStartDicePosition.y - 100;
        _oDice.visible = false;
        _oDiceContainer.addChild(_oDice);
    };

    this.isAnimationOn = function() {
        return _bAnimationOn;
    };

    this.show = function() {
        _oDice.visible = false;
        _oDice.on("animationend", this.movePlayer);

        s_oGame.setTurnReady(false);

        // GENERATE RANDOM RESULT (1 TO 6)
        _iDiceResult = Math.floor((Math.random() * 6) + 1);

        _bAnimationOn = true;

        playSound("dices", 1, false);

        // START THE ANIMATION FOR DICE LAUNCH
        _oDiceLaunch.visible = true;
        _oDiceLaunch.gotoAndPlay('idle');
        _oDiceLaunch.on("animationend", function() {
            if (_oDiceLaunch.visible) {
                s_oDices.secondAnimation();
            };
        });
    };

    this.secondAnimation = function() {
        _oDiceLaunch.visible = false;
        _oDice.alpha = 1;
        _oDice.visible = true;

        // START THE ANIMATION FOR THE DICE, ACCORDING TO THE RESULT WE NEED
        _oDice.gotoAndPlay('idle' + _iDiceResult);

        s_oGame.getDiceResult(_iDiceResult);
        _bAnimationOn = false;
    };

    this.movePlayer = function() {
        if (_bAnimationOn === false) {
            _bAnimationOn = true;
            // AFTER THE ANIMATION IS OVER, MOVE THE PLAYER OF THE NEEDED SQUARES
            s_oGame.movePlayer(_iDiceResult);
        };
    };

    this.fadeOutTween = function() {
        createjs.Tween.get(_oDice, {
                loop: false
            })
            .to({
                alpha: 0
            }, 200)
            .call(this.hide);
    };

    this.returnDiceResult = function() {
        return _iDiceResult;
    };

    this.hide = function() {
        _oDice.visible = false;
    };

    this.unload = function() {
        s_oDices = null;
    };

    this.isFirstLaunch = function() {
        return _bFirstLaunch;
    };

    this.setFirstLaunch = function(value) {
        _bFirstLaunch = value;
    };

    this.setPaused = function(value) {
        _oDiceLaunch.tickEnabled = _oDice.tickEnabled = !value;
    };

    s_oDices = this;

    this._init();
}

var s_oDices = this;