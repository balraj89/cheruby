function CPlayersChoose(iMode) {
    var _pStartPosAudio;
    var _pStartPosExit;
    var _pStartPosPlay;
    var _oBg;
    var _oMsgBox;
    var _oContTextSelectTeam;
    var _oFade;
    var _oAudioToggle;
    var _oButExit;
    var _oButPlay2;
    var _oButPlay3;
    var _oButPlay4;
    var _oButPlay5;
    var _oButPlay6;
    var _iMode;
    var _fRequestFullScreen = null;
    var _fCancelFullScreen = null;

    this._init = function() {
        _pStartPosPlay = {
            x: CANVAS_WIDTH_HALF,
            y: CANVAS_HEIGHT_HALF - 20
        };
        _iMode = iMode;

        _oBg = createBitmap(s_oSpriteLibrary.getSprite('bg_game' + s_iModeGame));
        _oBg.cache(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        s_oStage.addChild(_oBg);

        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        _oFade.alpha = 0.5;

        s_oStage.addChild(_oFade);

        var oSpriteMsgBox = s_oSpriteLibrary.getSprite('msg_box');
        _oMsgBox = createBitmap(oSpriteMsgBox);
        _oMsgBox.x = CANVAS_WIDTH * 0.5;
        _oMsgBox.y = CANVAS_HEIGHT * 0.5;
        _oMsgBox.regX = oSpriteMsgBox.width * 0.5;
        _oMsgBox.regY = oSpriteMsgBox.height * 0.5;
        s_oStage.addChild(_oMsgBox);

        _oContTextSelectTeam = new createjs.Container();

        var oSelectTeamText;
        oSelectTeamText = new createjs.Text(TEXT_SELECT_PLAYERS, "40px " + PRIMARY_FONT, PRIMARY_FONT_COLOR);
        oSelectTeamText.textAlign = "center";
        oSelectTeamText.x = 0;
        oSelectTeamText.y = 40;

        var oSelectTeamTextStroke;
        oSelectTeamTextStroke = new createjs.Text(TEXT_SELECT_PLAYERS, "40px " + PRIMARY_FONT, SECONDARY_FONT_COLOR);
        oSelectTeamTextStroke.textAlign = "center";

        oSelectTeamTextStroke.x = oSelectTeamText.x;
        oSelectTeamTextStroke.y = oSelectTeamText.y;
        oSelectTeamTextStroke.outline = 5;

        _oContTextSelectTeam.x = 682;
        _oContTextSelectTeam.y = 135;

        _oContTextSelectTeam.addChild(oSelectTeamTextStroke, oSelectTeamText);

        s_oStage.addChild(_oContTextSelectTeam);

        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            var oSprite = s_oSpriteLibrary.getSprite('audio_icon');
            _pStartPosAudio = {
                x: CANVAS_WIDTH - (oSprite.width / 2) - 50,
                y: (oSprite.height / 2) + 10
            };
            _oAudioToggle = new CToggle(_pStartPosAudio.x, _pStartPosAudio.y, oSprite, s_bAudioActive, s_oStage);
            _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);
        }

        var aWidth = [120, 120];
        var aHeight = [128, 128];

        var oData = {
            images: [s_oSpriteLibrary.getSprite('but_play' + s_iModeGame)],
            framerate: 0,
            // width, height & registration point of each sprite
            frames: {
                width: aWidth[s_iModeGame],
                height: aHeight[s_iModeGame],
                regX: aWidth[s_iModeGame] / 2,
                regY: aHeight[s_iModeGame] / 2
            },
            animations: {
                0: [0, 0],
                1: [1, 1],
                2: [2, 2],
                3: [3, 3],
                4: [4, 4]
            }
        };
        var oSpriteSheet = new createjs.SpriteSheet(oData);
        var iXOffset = aWidth[s_iModeGame] * 0.9;

        _oButPlay2 = new CSpritesheetButton(aWidth[s_iModeGame], aHeight[s_iModeGame], oSpriteSheet, 0, s_oStage);
        _oButPlay2.setShape(0.5);
        _oButPlay2.setPosition(_pStartPosPlay.x - iXOffset * 2, _pStartPosPlay.y + 3);
        _oButPlay2.addEventListener(ON_MOUSE_UP, function() {
            this._onButPlayRelease(2)
        }, this);

        _oButPlay3 = new CSpritesheetButton(aWidth[s_iModeGame], aHeight[s_iModeGame], oSpriteSheet, 1, s_oStage);
        _oButPlay3.setShape(0.5);
        _oButPlay3.setPosition(_pStartPosPlay.x - iXOffset, _pStartPosPlay.y + 90);
        _oButPlay3.addEventListener(ON_MOUSE_UP, function() {
            this._onButPlayRelease(3)
        }, this);

        _oButPlay4 = new CSpritesheetButton(aWidth[s_iModeGame], aHeight[s_iModeGame], oSpriteSheet, 2, s_oStage);
        _oButPlay4.setShape(0.5);
        _oButPlay4.setPosition(_pStartPosPlay.x, _pStartPosPlay.y);
        _oButPlay4.addEventListener(ON_MOUSE_UP, function() {
            this._onButPlayRelease(4)
        }, this);

        _oButPlay5 = new CSpritesheetButton(aWidth[s_iModeGame], aHeight[s_iModeGame], oSpriteSheet, 3, s_oStage);
        _oButPlay5.setShape(0.5);
        _oButPlay5.setPosition(_pStartPosPlay.x + iXOffset, _pStartPosPlay.y + 90);
        _oButPlay5.addEventListener(ON_MOUSE_UP, function() {
            this._onButPlayRelease(5)
        }, this);

        _oButPlay6 = new CSpritesheetButton(aWidth[s_iModeGame], aHeight[s_iModeGame], oSpriteSheet, 4, s_oStage);
        _oButPlay6.setShape(0.5);
        _oButPlay6.setPosition(_pStartPosPlay.x + iXOffset * 2, _pStartPosPlay.y);
        _oButPlay6.addEventListener(ON_MOUSE_UP, function() {
            this._onButPlayRelease(6)
        }, this);

        var oSpriteExit = s_oSpriteLibrary.getSprite('but_exit');
        _pStartPosExit = {
            x: CANVAS_WIDTH - (oSpriteExit.height / 2) - 10,
            y: (oSpriteExit.height / 2) + 10
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
        _oButPlay2.unload();
        _oButExit = null;
        _oButPlay2 = null;

        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            _oAudioToggle.unload();
            _oAudioToggle = null;
        }

        s_oStage.removeAllChildren();
        createjs.Tween.removeAllTweens();
        s_oPlayersChoose = null;
    };

    this._onExit = function() {
        this.unload();
        s_oMain.gotoMenu();
    };

    this._onAudioToggle = function() {
        Howler.mute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive;
    };

    this._onButPlayRelease = function(iPlayers) {
        this.unload();
        if (_iMode === HUMAN_VS_CPU) {
            s_oMain.gotoColourChoose(iPlayers, _iMode);
        } else {
            //s_oMain.gotoGame(iPlayers, 0, _iMode);
            s_oMain.gotoColourChoose(iPlayers, _iMode);
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

    this.resetFullscreenBut = function() {
        if (_fRequestFullScreen && screenfull.enabled) {
            _oButFullscreen.setActive(s_bFullscreen);
        };
    };

    s_oPlayersChoose = this;

    this._init();
}

var s_oPlayersChoose = null;