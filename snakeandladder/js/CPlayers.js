function CPlayers(i, oPlayersContainer, oPlayersShadowsContainer, iColor) {
    var _iIndex = i;
    var _iColor;
    var _iGlobalCounter;

    var _oPlayersContainer = oPlayersContainer;
    var _oPlayersShadowsContainer = oPlayersShadowsContainer;
    var _oPlayerShadow;
    var _oPlayer;
    var _oArrow;

    var _iPosition;

    var _aCurveMapData;

    this._init = function() {
        _aCurveMapData = s_oGame.getCurveMapData();
        _iGlobalCounter = 0;
        _iColor = iColor;

        if (s_iModeGame === MODE_SNAKES) {
            var sSpriteName = "player_shadow";
            _oPlayerShadow = createBitmap(s_oSpriteLibrary.getSprite(sSpriteName));
            _oPlayerShadow.regX = 17;
            _oPlayerShadow.regY = 0;
            _oPlayerShadow.x = ZERO_SQUARE_POSITIONS[_iIndex][0];
            _oPlayerShadow.y = ZERO_SQUARE_POSITIONS[_iIndex][1];

            _oPlayersShadowsContainer.addChild(_oPlayerShadow);

            var _aWidth = [22, 22];
            var _aHeight = [62, 62];

            var oData = {
                images: [s_oSpriteLibrary.getSprite("players_" + s_iModeGame)],
                framerate: 0,
                // width, height & registration point of each sprite
                frames: {
                    width: _aWidth[s_iModeGame],
                    height: _aHeight[s_iModeGame],
                    regX: _aWidth[s_iModeGame] / 2,
                    regY: _aHeight[s_iModeGame] - 10
                },
                animations: {
                    0: [0, 0],
                    1: [1, 1],
                    2: [2, 2],
                    3: [3, 3],
                    4: [4, 4],
                    5: [5, 5]
                }
            };
            var oSpriteSheet = new createjs.SpriteSheet(oData);
            _oPlayer = createSprite(oSpriteSheet, _iColor, _aWidth[s_iModeGame], _aHeight[s_iModeGame] - 10, _aWidth[s_iModeGame], _aHeight[s_iModeGame]);
            _oPlayer.gotoAndStop(_iColor);
        } else {
            var oData = {
                images: [s_oSpriteLibrary.getSprite("player_" + s_iModeGame + "_" + _iColor)],
                framerate: 30,
                // width, height & registration point of each sprite
                frames: {
                    width: PLAYER_SPRITE_WIDTH[_iColor],
                    height: PLAYER_SPRITE_HEIGHT[_iColor],
                    regX: PLAYER_SPRITE_WIDTH[_iColor] / 2,
                    regY: PLAYER_SPRITE_HEIGHT[_iColor] / 2 + 20
                },
                animations: {
                    idle: [0, 26, true, 0.5],
                    walk: [27, 40],
                    slide: [41, 41, false, 0.3]
                }
            };
            var oSpriteSheet = new createjs.SpriteSheet(oData);
            _oPlayer = createSprite(oSpriteSheet, "idle", PLAYER_SPRITE_WIDTH[_iColor], PLAYER_SPRITE_HEIGHT[_iColor], PLAYER_SPRITE_WIDTH[_iColor], PLAYER_SPRITE_HEIGHT[_iColor]);
        };
        _oPlayer.x = ZERO_SQUARE_POSITIONS[_iIndex][0];
        _oPlayer.y = ZERO_SQUARE_POSITIONS[_iIndex][1];
        _iPosition = 0;
        _oPlayersContainer.addChild(_oPlayer);

        // AN ARROW WILL BE USED FOR THE HUMAN PLAYER'S POSITION
        _oArrow = createBitmap(s_oSpriteLibrary.getSprite('arrow'));
        _oArrow.regX = 15;
        _oArrow.regY = 80;
        _oArrow.visible = false;
        _oPlayersContainer.addChild(_oArrow);

        new createjs.Tween.get(_oArrow, {
                loop: true
            })
            .to({
                scaleY: 1.2
            }, 500, createjs.Ease.quadIn)
            .to({
                scaleY: 1
            }, 500, createjs.Ease.quadIn);
    };

    this.animationWalk = function() {
        _oPlayer.gotoAndPlay("walk");
    };

    this.animationSlide = function() {
        _oPlayer.gotoAndPlay("slide");
    };

    this.animationIdle = function() {
        _oPlayer.gotoAndPlay("idle");
    };

    this.getArrow = function() {
        return _oArrow;
    };

    this.setArrowVisible = function(value) {
        _oArrow.visible = value;
    };

    this.isArrowVisible = function() {
        return _oArrow.visible;
    };

    this.setArrowX = function(value) {
        _oArrow.x = value;
    };

    this.setArrowY = function(value) {
        _oArrow.y = value;
    };

    this.setVisible = function(value) {
        _oPlayer.visible = value;
        _oPlayerShadow.visible = value;
    };

    this.getSprite = function() {
        return _oPlayer;
    };

    this.getShadow = function() {
        return _oPlayerShadow;
    };

    this.getPosition = function() {
        return _iPosition;
    };

    this.setPosition = function(value) {
        _iPosition = value;
    };

    this.reset = function() {
        _iPosition = 0;

        _oPlayer.x = ZERO_SQUARE_POSITIONS[_iIndex][0];
        _oPlayer.y = ZERO_SQUARE_POSITIONS[_iIndex][1];

        if (s_iModeGame === MODE_SNAKES) {
            _oPlayerShadow.x = ZERO_SQUARE_POSITIONS[_iIndex][0];
            _oPlayerShadow.y = ZERO_SQUARE_POSITIONS[_iIndex][1];
        } else {
            _oPlayer.gotoAndStop("idle");
            _oPlayer.scaleX = 1;
        }
    };

    this.getX = function() {
        return _oPlayer.x;
    };

    this.getY = function() {
        return _oPlayer.y;
    };

    this.setX = function(value) {
        _oPlayer.x = _oPlayerShadow.x = value;
    };

    this.setY = function(value) {
        _oPlayer.y = _oPlayerShadow.y = value;
    };

    this.decreasePosition = function() {
        _iPosition -= 1;
    };

    this.increasePosition = function() {
        _iPosition += 1;
    };

    this.unload = function() {
        s_oPlayers = null;
    };

    this.update = function() {
        // MOVE THE PLAYER
        var iX = _aCurveMapData[_iGlobalCounter][0];
        var iY = _aCurveMapData[_iGlobalCounter][1];

        if (s_iModeGame === MODE_CHUTES) {
            // FLIP THE PLAYER IF NEEDED
            if (iX > _oPlayer.x) { // MOVING RIGHT
                _oPlayer.scaleX = 1;
            } else { // MOVING LEFT
                _oPlayer.scaleX = -1;
            };
        };

        _oPlayer.x = iX;
        _oPlayer.y = iY;
        _iGlobalCounter++;

        if (_iGlobalCounter >= _aCurveMapData.length) {
            _iGlobalCounter = 0;
            s_oGame.onEndChuteAnimation();
        };
    };

    s_oPlayers = this;

    this._init();
}

var s_oPlayers;