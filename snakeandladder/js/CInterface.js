function CInterface(_oPlayersInterface) {
    var _oContainer;
    var _oPauseContainer;
    var _oHelpPanel = null;
    var _oPause;
    var _oAudioToggle;
    var _oButSettings;
    var _oButDices;
    var _oButExit;
    var _oButFullscreen;
    var _oButHelp;

    var _bMobileInitialized;
    var _bOnSettings;
    var _bDiceEnabled;

    var _fRequestFullScreen = null;
    var _fCancelFullScreen = null;

    var _pStartPosExit;
    var _pStartPosAudio;
    var _pStartPosFullscreen;
    var _pStartPosButHelp;
    var _pStartButSettings;
    var _pStartPosDices;

    var s_oPlayersInterface = _oPlayersInterface;

    this._init = function() {
        _pStartPosDices = {
            x: CANVAS_WIDTH - 50,
            y: CANVAS_HEIGHT - 50
        };
        _oButDices = new CDiceButton(_pStartPosDices.x, _pStartPosDices.y, s_oStage);
        _oButDices.addEventListener(ON_MOUSE_UP, this._onDicesLaunch, this);
        _bDiceEnabled = false;

        _oContainer = new createjs.Container();
        _bMobileInitialized = false;
        _oPauseContainer = new createjs.Container();
        s_oStage.addChild(_oContainer);
        _oContainer.addChild(_oPauseContainer);

        var oSprite = s_oSpriteLibrary.getSprite("but_settings");
        _pStartButSettings = {
            x: CANVAS_WIDTH - (oSprite.width / 2) - 10,
            y: (oSprite.height / 2) + 10
        };

        var oSprite = s_oSpriteLibrary.getSprite('but_exit');
        _pStartPosExit = {
            x: _pStartButSettings.x,
            y: _pStartButSettings.y + oSprite.height + 10
        };
        _oButExit = new CGfxButton(_pStartPosExit.x, _pStartPosExit.y, oSprite, _oContainer);
        _oButExit.addEventListener(ON_MOUSE_UP, this._onExit, this);
        _oButExit.setVisible(false);

        oSprite = s_oSpriteLibrary.getSprite("but_help");
        _pStartPosButHelp = {
            x: _pStartButSettings.x,
            y: _pStartPosExit.y + oSprite.height + 10
        };
        _oButHelp = new CGfxButton(_pStartPosButHelp.x, _pStartPosButHelp.y, oSprite, _oContainer);
        _oButHelp.addEventListener(ON_MOUSE_UP, function() {
            new CHelpPanel();
        }, this);
        _oButHelp.setVisible(false);

        _pStartPosAudio = {
            x: _pStartPosButHelp.x,
            y: _pStartPosButHelp.y + oSprite.height + 10
        };
        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            var oSprite = s_oSpriteLibrary.getSprite('audio_icon');
            _oAudioToggle = new CToggle(_pStartPosAudio.x, _pStartPosAudio.y, oSprite, s_bAudioActive, _oContainer);
            _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);
            _oAudioToggle.setVisible(false);
        }

        var doc = window.document;
        var docEl = doc.documentElement;
        _fRequestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
        _fCancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

        if (ENABLE_FULLSCREEN === false) {
            _fRequestFullScreen = false;
        }

        if (_fRequestFullScreen && screenfull.enabled) {
            oSprite = s_oSpriteLibrary.getSprite("but_fullscreen");
            if (_oAudioToggle) {
                _pStartPosFullscreen = {
                    x: _pStartPosAudio.x,
                    y: _pStartPosAudio.y + oSprite.height + 10
                };
            } else {
                _pStartPosFullscreen = {
                    x: _pStartPosAudio.x,
                    y: _pStartPosAudio.y
                };
            }
            _oButFullscreen = new CToggle(_pStartPosFullscreen.x, _pStartPosFullscreen.y, oSprite, s_bFullscreen, _oContainer);
            _oButFullscreen.addEventListener(ON_MOUSE_UP, this._onFullscreenRelease, this);
            _oButFullscreen.setVisible(false);
        };

        oSprite = s_oSpriteLibrary.getSprite("but_settings");



        _oButSettings = new CGfxButton(_pStartButSettings.x, _pStartButSettings.y, oSprite, _oContainer);
        _oButSettings.addEventListener(ON_MOUSE_UP, this.onSettings);
        _bOnSettings = false;

        this.refreshButtonPos(s_iOffsetX, s_iOffsetY);
    };

    this.onSettings = function() {
        if (!_bOnSettings) {
            _oPause = new CPauseButton(_oPauseContainer);
            _bOnSettings = true;
            _oButExit.setX(_oButSettings.getX());
            _oButExit.setY(_oButSettings.getY());
            _oButExit.setVisible(true);
            _oButHelp.setX(_oButSettings.getX());
            _oButHelp.setY(_oButSettings.getY());
            _oButHelp.setVisible(true);

            if (_oAudioToggle) {
                _oAudioToggle.setPosition(_oButSettings.getX(), _oButSettings.getY());
                _oAudioToggle.setVisible(true);

                new createjs.Tween.get(_oAudioToggle.getButtonImage())
                    .to({
                        x: _pStartPosAudio.x - s_iOffsetX,
                        y: _pStartPosAudio.y
                    }, 300, createjs.Ease.cubicOut);
            }

            if (_oButFullscreen) {
                _oButFullscreen.setPosition(_oButSettings.getX(), _oButSettings.getY());
                _oButFullscreen.setVisible(true);

                new createjs.Tween.get(_oButFullscreen.getButtonImage())
                    .to({
                        x: _pStartPosFullscreen.x - s_iOffsetX,
                        y: _pStartPosFullscreen.y
                    }, 300, createjs.Ease.cubicOut);
            }

            new createjs.Tween.get(_oButExit.getButtonImage())
                .to({
                    x: _pStartPosExit.x - s_iOffsetX,
                    y: _pStartPosExit.y
                }, 300, createjs.Ease.cubicOut);
            new createjs.Tween.get(_oButHelp.getButtonImage())
                .to({
                    x: _pStartPosButHelp.x - s_iOffsetX,
                    y: _pStartPosButHelp.y
                }, 300, createjs.Ease.cubicOut);

        } else {
            s_oInterface.closePanel();
        }
    };

    this.closePanel = function() {
        _oPause.onExit();
        _bOnSettings = false;

        new createjs.Tween.get(_oButExit.getButtonImage())
            .to({
                x: _oButSettings.getX(),
                y: _oButSettings.getY()
            }, 300, createjs.Ease.cubicIn)
            .call(function() {
                _oButExit.setVisible(false);
                _oButHelp.setVisible(false);
                if (_oAudioToggle) {
                    _oAudioToggle.setVisible(false);
                }
                if (_oButFullscreen) {
                    _oButFullscreen.setVisible(false);
                }
            });

        new createjs.Tween.get(_oButHelp.getButtonImage())
            .to({
                x: _oButSettings.getX(),
                y: _oButSettings.getY()
            }, 300, createjs.Ease.cubicIn);

        if (_oAudioToggle) {
            new createjs.Tween.get(_oAudioToggle.getButtonImage())
                .to({
                    x: _oButSettings.getX(),
                    y: _oButSettings.getY()
                }, 300, createjs.Ease.cubicIn);
        }

        if (_oButFullscreen) {
            new createjs.Tween.get(_oButFullscreen.getButtonImage())
                .to({
                    x: _oButSettings.getX(),
                    y: _oButSettings.getY()
                }, 300, createjs.Ease.cubicIn);
        }
    };

    this.unloadPause = function() {

    };

    this.unload = function() {
        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            _oAudioToggle.unload();
            _oAudioToggle = null;
        }
        _oButDices.unload();
        _oButExit.unload();

        s_oStage.removeChild(_oContainer);
        if (_fRequestFullScreen && screenfull.enabled) {
            _oButFullscreen.unload();
        }

        s_oInterface = null;
    };

    this.animationDiceButton = function() {
        _oButDices.pulseAnimation();
    };

    this.animationDiceButtonStop = function() {
        _oButDices.removeAllTweens();
    };

    this.getButDicesX = function() {
        return _oButDices.getX();
    };

    this.refreshButtonPos = function(iNewX, iNewY) {
        _oButSettings.setPosition(_pStartButSettings.x - iNewX, _pStartButSettings.y);
        _oButExit.setPosition(_pStartPosExit.x - iNewX, _pStartPosExit.y);
        _oButHelp.setPosition(_pStartPosButHelp.x - iNewX, _pStartPosButHelp.y);
        _oButDices.setPosition(_pStartPosDices.x - iNewX, _pStartPosDices.y - iNewY);

        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            _oAudioToggle.setPosition(_pStartPosAudio.x - iNewX, _pStartPosAudio.y);
        }

        if (_fRequestFullScreen && screenfull.enabled) {
            _oButFullscreen.setPosition(_pStartPosFullscreen.x - iNewX, _pStartPosFullscreen.y);
        }

        s_oPlayersInterface.refreshPosition(iNewX);
    };

    this._onButHelpRelease = function() {
        _oHelpPanel = new CHelpPanel();
    };

    this._onButRestartRelease = function() {
        s_oGame.restartGame();
        $(s_oMain).trigger("restart_level", 1);
    };

    this.onExitFromHelp = function() {
        _oHelpPanel.unload();
    };

    this._onExit = function() {
        new CAreYouSurePanel(s_oGame.onExit);
    };

    this.gameOver = function(iScore) {
        new CEndPanel(iScore);
    };

    this.showWin = function() {
        new CWinPanel();
    };

    this.getButtonDices = function() {
        return _oButDices;
    };

    this.enableDices = function(evt) {
        _bDiceEnabled = evt;
        _oButDices.toggle(evt);
    };

    this.DicesEnabled = function() {
        return _bDiceEnabled;
    };

    this._onDicesLaunch = function() {
        s_oGame.launchDices();
        this.enableDices(false);
        this.animationDiceButtonStop();
    };

    this.isAreYouSurePanel = function() {
        if (_oAreYouSurePanel === null) {
            return false;
        } else {
            return true;
        }
    };

    this._onAudioToggle = function() {
        Howler.mute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive;
    };

    this._onFullscreenRelease = function() {
        if (s_bFullscreen) {
            _fCancelFullScreen.call(window.document);
        } else {
            _fRequestFullScreen.call(window.document.documentElement);
        }

        sizeHandler();
    };

    this._onRestart = function() {
        s_oGame.onRestart();
    };

    this.resetFullscreenBut = function() {
        if (_fRequestFullScreen && screenfull.enabled) {
            _oButFullscreen.setActive(s_bFullscreen);
        };
    };

    s_oInterface = this;

    this._init();

    return this;
}

var s_oInterface = null;