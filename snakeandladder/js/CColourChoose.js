function CColourChoose(iPlayers, iMode) {
    var _iPlayers = iPlayers;
    var _iMode;
    var _pStartPosAudio;
    var _pStartPosExit;
    var _oBg;
    var _oMsgBox;
    var _oContTextSelectColour;
    var _oFade;
    var _oAudioToggle;
    var _oButExit;
    var _aButColour;
    var _oContainer;
    var _oContainerButColours;
    var _oSelectColourTextStroke;
    var _oSelectColourText;
    var _fRequestFullScreen = null;
    var _fCancelFullScreen = null;

    var _iCurPlayerToChoose = 1;
    var _aPlayerColors;

    this._init = function() {
        _oContainer = new createjs.Container;
        s_oStage.addChild(_oContainer);
        _iMode = iMode;

        _oBg = createBitmap(s_oSpriteLibrary.getSprite('bg_game' + s_iModeGame));
        _oBg.cache(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        _oContainer.addChild(_oBg);

        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        _oFade.alpha = 0.5;
        _oContainer.addChild(_oFade);

        var oSpriteMsgBox = s_oSpriteLibrary.getSprite('msg_box');
        _oMsgBox = createBitmap(oSpriteMsgBox);
        _oMsgBox.x = CANVAS_WIDTH * 0.5;
        _oMsgBox.y = CANVAS_HEIGHT * 0.5;
        _oMsgBox.regX = oSpriteMsgBox.width * 0.5;
        _oMsgBox.regY = oSpriteMsgBox.height * 0.5;
        _oContainer.addChild(_oMsgBox);

        _oContTextSelectColour = new createjs.Container();


        _oSelectColourText = new createjs.Text(TEXT_SELECT_COLOUR, "40px " + PRIMARY_FONT, PRIMARY_FONT_COLOR);
        _oSelectColourText.textAlign = "center";
        _oSelectColourText.x = 0;
        _oSelectColourText.y = 40;

        _oSelectColourTextStroke = new createjs.Text(TEXT_SELECT_COLOUR, "40px " + PRIMARY_FONT, SECONDARY_FONT_COLOR);
        _oSelectColourTextStroke.textAlign = "center";
        _oSelectColourTextStroke.x = _oSelectColourText.x;
        _oSelectColourTextStroke.y = _oSelectColourText.y;
        _oSelectColourTextStroke.outline = 5;

        if (_iMode === HUMAN_VS_HUMAN) {
            _aPlayerColors = new Array();

            _oSelectColourText.text = TEXT_PLAYER_COLOUR.format(_iCurPlayerToChoose);
            _oSelectColourTextStroke.text = TEXT_PLAYER_COLOUR.format(_iCurPlayerToChoose);
        }

        _oContTextSelectColour.x = 682;
        _oContTextSelectColour.y = 135;

        _oContTextSelectColour.addChild(_oSelectColourTextStroke, _oSelectColourText);

        _oContainer.addChild(_oContTextSelectColour);

        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            var oSprite = s_oSpriteLibrary.getSprite('audio_icon');
            _pStartPosAudio = {
                x: CANVAS_WIDTH - (oSprite.width / 2) - 60,
                y: (oSprite.height / 2) + 20
            };
            _oAudioToggle = new CToggle(_pStartPosAudio.x, _pStartPosAudio.y, oSprite, s_bAudioActive, s_oStage);
            _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);
        }

        _oContainerButColours = new createjs.Container;
        _oContainer.addChild(_oContainerButColours);

        // CREATE BUTTONS FOR EACH COLOUR TO CHOOSE (ACCORDING TO HOW MANY PLAYERS WILL BE IN THE GAME)
        var _aOffsetX = [50, 30];
        var _aWidth = [52, 101];
        var _aHeight = [155, 112];
        var _aStartX = [0, 15];

        var oData = {
            images: [s_oSpriteLibrary.getSprite("playerbig_" + s_iModeGame)],
            framerate: 0,
            // width, height & registration point of each sprite
            frames: {
                width: _aWidth[s_iModeGame],
                height: _aHeight[s_iModeGame],
                regX: _aWidth[s_iModeGame] / 2,
                regY: _aHeight[s_iModeGame] / 2
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

        _aButColour = new Array();

        _aButColour[0] = new CSpritesheetButton(_aWidth[s_iModeGame] / 2, _aHeight[s_iModeGame] / 2, oSpriteSheet, 0, _oContainerButColours);
        _aButColour[0].setShape(1);
        _aButColour[0].addEventListener(ON_MOUSE_UP, function() {
            this._onButColourRelease(0)
        }, this);

        _aButColour[1] = new CSpritesheetButton(_aWidth[s_iModeGame] / 2, _aHeight[s_iModeGame] / 2, oSpriteSheet, 1, _oContainerButColours);
        _aButColour[1].setShape(1);
        _aButColour[1].addEventListener(ON_MOUSE_UP, function() {
            this._onButColourRelease(1)
        }, this);

        _aButColour[2] = new CSpritesheetButton(_aWidth[s_iModeGame] / 2, _aHeight[s_iModeGame] / 2, oSpriteSheet, 2, _oContainerButColours);
        _aButColour[2].setShape(1);
        _aButColour[2].addEventListener(ON_MOUSE_UP, function() {
            this._onButColourRelease(2)
        }, this);

        _aButColour[3] = new CSpritesheetButton(_aWidth[s_iModeGame] / 2, _aHeight[s_iModeGame] / 2, oSpriteSheet, 3, _oContainerButColours);
        _aButColour[3].setShape(1);
        _aButColour[3].addEventListener(ON_MOUSE_UP, function() {
            this._onButColourRelease(3)
        }, this);

        _aButColour[4] = new CSpritesheetButton(_aWidth[s_iModeGame] / 2, _aHeight[s_iModeGame] / 2, oSpriteSheet, 4, _oContainerButColours);
        _aButColour[4].setShape(1);
        _aButColour[4].addEventListener(ON_MOUSE_UP, function() {
            this._onButColourRelease(4)
        }, this);

        _aButColour[5] = new CSpritesheetButton(_aWidth[s_iModeGame] / 2, _aHeight[s_iModeGame] / 2, oSpriteSheet, 5, _oContainerButColours);
        _aButColour[5].setShape(1);
        _aButColour[5].addEventListener(ON_MOUSE_UP, function() {
            this._onButColourRelease(5)
        }, this);

        if (s_iModeGame === MODE_SNAKES) {
            _aButColour[0].setPosition(_aStartX[s_iModeGame] + _aOffsetX[s_iModeGame] / 2, _aHeight[s_iModeGame] / 1.5);
            _aButColour[1].setPosition(_aStartX[s_iModeGame] + (_aWidth[s_iModeGame] / 2 * 2 + _aOffsetX[s_iModeGame]), _aHeight[s_iModeGame] / 1.5);
            _aButColour[2].setPosition(_aStartX[s_iModeGame] + (_aWidth[s_iModeGame] / 2 * 3 + _aOffsetX[s_iModeGame] * 2), _aHeight[s_iModeGame] / 1.5);
            _aButColour[3].setPosition(_aStartX[s_iModeGame] + (_aWidth[s_iModeGame] / 2 * 4 + _aOffsetX[s_iModeGame] * 3), _aHeight[s_iModeGame] / 1.5);
            _aButColour[4].setPosition(_aStartX[s_iModeGame] + (_aWidth[s_iModeGame] / 2 * 5 + _aOffsetX[s_iModeGame] * 4), _aHeight[s_iModeGame] / 1.5);
            _aButColour[5].setPosition(_aStartX[s_iModeGame] + (_aWidth[s_iModeGame] / 2 * 6 + _aOffsetX[s_iModeGame] * 5), _aHeight[s_iModeGame] / 1.5);
        } else {
            _aButColour[0].setPosition(_aStartX[s_iModeGame] + _aOffsetX[s_iModeGame] / 2 + _aOffsetX[s_iModeGame], _aHeight[s_iModeGame] / 1.5);
            _aButColour[1].setPosition(_aStartX[s_iModeGame] + (_aWidth[s_iModeGame] / 2 * 2 + _aOffsetX[s_iModeGame]), _aHeight[s_iModeGame] / 1.5);
            _aButColour[2].setPosition(_aStartX[s_iModeGame] + (_aWidth[s_iModeGame] / 2 * 3 + _aOffsetX[s_iModeGame] * 2), _aHeight[s_iModeGame] / 1.5);
            _aButColour[3].setPosition(_aStartX[s_iModeGame] + (_aWidth[s_iModeGame] / 2 * 4 + _aOffsetX[s_iModeGame] * 3), _aHeight[s_iModeGame] / 1.5);
            _aButColour[4].setPosition(_aStartX[s_iModeGame] + (_aWidth[s_iModeGame] / 2 * 5 + _aOffsetX[s_iModeGame] * 4), _aHeight[s_iModeGame] / 1.5);
            _aButColour[5].setPosition(_aStartX[s_iModeGame] + (_aWidth[s_iModeGame] / 2 * 6 + _aOffsetX[s_iModeGame] * 5), _aHeight[s_iModeGame] / 1.5);
        };

        var bounds = _oContainerButColours.getBounds();
        _oContainerButColours.x = CANVAS_WIDTH_HALF;
        _oContainerButColours.y = CANVAS_HEIGHT_HALF;
        _oContainerButColours.regX = bounds.width / 2;
        _oContainerButColours.regY = bounds.height / 2;

        var oSpriteExit = s_oSpriteLibrary.getSprite('but_exit');
        _pStartPosExit = {
            x: CANVAS_WIDTH - (oSpriteExit.height / 2) - 20,
            y: (oSpriteExit.height / 2) + 20
        };
        _oButExit = new CGfxButton(_pStartPosExit.x, _pStartPosExit.y, oSpriteExit, s_oStage);
        _oButExit.addEventListener(ON_MOUSE_UP, this._onExit, this);

        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        s_oStage.addChild(_oFade);

        createjs.Tween.get(_oFade).to({
            alpha: 0
        }, 1000).call(function() {
            _oFade.visible = false;
        });

        this.refreshButtonPos(s_iOffsetX, s_iOffsetY);
    };

    this.refreshButtonPos = function(iNewX, iNewY) {
        _oButExit.setPosition(_pStartPosExit.x - iNewX, _pStartPosExit.y);
        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            _oAudioToggle.setPosition(_pStartPosAudio.x - iNewX, _pStartPosAudio.y);
        }
    };

    this.unload = function() {
        _oButExit.unload();
        _oButExit = null;

        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            _oAudioToggle.unload();
            _oAudioToggle = null;
        }

        s_oStage.removeAllChildren();
        createjs.Tween.removeAllTweens();
        s_oColourChoose = null;
    };

    this._onExit = function() {
        this.unload();

        s_oMain.gotoMenu();
    };

    this._onAudioToggle = function() {
        Howler.mute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive;
    };

    this._onButColourRelease = function(iColour) {
        if (_iMode === HUMAN_VS_CPU) {
            this.unload();
            s_oMain.gotoGame(_iPlayers, iColour, _iMode);
        } else {
            _aPlayerColors[_iCurPlayerToChoose - 1] = iColour;

            _iCurPlayerToChoose++;
            _aButColour[iColour].setVisible(false);
            _oSelectColourText.text = TEXT_PLAYER_COLOUR.format(_iCurPlayerToChoose);
            _oSelectColourTextStroke.text = TEXT_PLAYER_COLOUR.format(_iCurPlayerToChoose);

            if (_iCurPlayerToChoose > _iPlayers) {
                this.unload();
                s_oMain.gotoGame(_iPlayers, iColour, _iMode, _aPlayerColors);
            }
        }
    };

    this._onFullscreenRelease = function() {
        if (s_bFullscreen) {
            _fCancelFullScreen.call(window.document);
        } else {
            _fRequestFullScreen.call(window.document.documentElement);
        }

        sizeHandler();
    };

    this.resetFullscreenBut = function() {
        if (_fRequestFullScreen && screenfull.enabled) {
            _oButFullscreen.setActive(s_bFullscreen);
        };
    };

    s_oColourChoose = this;

    this._init();
}

var s_oColourChoose = null;