function CMenu() {
    var _pStartPosAudio;
    var _pStartPosPlay;
    var _pStartPosCredits;
    var _pStartPosFullscreen;
    var _oBg;
    var _oMenuLogo;
    var _oButPlay;
    var _oButPlay;
    var _oButInfo;
    var _oFade;
    var _oAudioToggle;
    var _oButFullscreen;
    var _fRequestFullScreen = null;
    var _fCancelFullScreen = null;

    this._init = function() {
        //localStorage.clear();            // TO DELETE EVERYTHING SAVED IN LOCALSTORAGE

        _oBg = createBitmap(s_oSpriteLibrary.getSprite('bg_menu'));
        _oBg.cache(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        s_oStage.addChild(_oBg);

        _oMenuLogo = createBitmap(s_oSpriteLibrary.getSprite('logo_menu'));
        _oMenuLogo.regX = 304;
        _oMenuLogo.regY = 160;
        _oMenuLogo.x = CANVAS_WIDTH_HALF;
        _oMenuLogo.y = -500;
        s_oStage.addChild(_oMenuLogo);

        new createjs.Tween.get(_oMenuLogo)
            .to({
                y: CANVAS_HEIGHT_HALF - 100
            }, 500, createjs.Ease.linear);
        new createjs.Tween.get(_oMenuLogo, {
                loop: true
            })
            .to({
                scaleX: 1.1,
                scaleY: 1.1
            }, 850, createjs.Ease.quadOut)
            .to({
                scaleX: 1,
                scaleY: 1
            }, 650, createjs.Ease.quadIn);

        var oSprite = s_oSpriteLibrary.getSprite('but_play');
        _pStartPosPlay = {
            x: CANVAS_WIDTH_HALF,
            y: CANVAS_HEIGHT - 120
        };
        _oButPlay = new CGfxButton(_pStartPosPlay.x, _pStartPosPlay.y, oSprite, s_oStage);
        _oButPlay.addEventListener(ON_MOUSE_UP, this._onButPlayRelease, this);
        _oButPlay.pulseAnimation();

        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            var oSprite = s_oSpriteLibrary.getSprite('audio_icon');
            _pStartPosAudio = {
                x: CANVAS_WIDTH - (oSprite.height / 2) - 10,
                y: (oSprite.height / 2) + 10
            };
            _oAudioToggle = new CToggle(_pStartPosAudio.x, _pStartPosAudio.y, oSprite, s_bAudioActive, s_oStage);
            _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);
        }

        var oSpriteInfo = s_oSpriteLibrary.getSprite("but_info");
        _pStartPosCredits = {
            x: (oSprite.height / 2) + 10,
            y: (oSprite.height / 2) + 10
        };
        _oButInfo = new CGfxButton(_pStartPosCredits.x, _pStartPosCredits.y, oSpriteInfo, s_oStage);
        _oButInfo.addEventListener(ON_MOUSE_UP, this._onButInfoRelease, this);

        var doc = window.document;
        var docEl = doc.documentElement;
        _fRequestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
        _fCancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

        if (ENABLE_FULLSCREEN === false) {
            _fRequestFullScreen = false;
        }

        if (_fRequestFullScreen && screenfull.enabled) {
            oSprite = s_oSpriteLibrary.getSprite('but_fullscreen');
            _pStartPosFullscreen = {
                x: _pStartPosCredits.x + oSprite.width / 2 + 10,
                y: _pStartPosCredits.y
            };

            _oButFullscreen = new CToggle(_pStartPosFullscreen.x, _pStartPosFullscreen.y, oSprite, s_bFullscreen, s_oStage);
            _oButFullscreen.addEventListener(ON_MOUSE_UP, this._onFullscreenRelease, this);
        }

        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        s_oStage.addChild(_oFade);

        createjs.Tween.get(_oFade).to({
            alpha: 0
        }, 1000).call(function() {
            _oFade.visible = false;
        });

        if (!s_bStorageAvailable) {
            new CMsgBox(TEXT_ERR_LS, s_oStage);
        } else {
            var aGamesWon = getItem("snakesandladders_gameswon");
            if (aGamesWon !== null) {
                s_aGamesWon = aGamesWon;
            }
            var aGamesPlayed = getItem("snakesandladders_gamesplayed");
            if (aGamesPlayed !== null) {
                s_aGamesPlayed = aGamesPlayed;
            }
        }

        this.refreshButtonPos(s_iOffsetX, s_iOffsetY);
    };

    this.refreshButtonPos = function(iNewX, iNewY) {
        _oButPlay.setPosition(_pStartPosPlay.x, _pStartPosPlay.y - iNewY);
        _oButInfo.setPosition(_pStartPosCredits.x + iNewX, _pStartPosCredits.y);
        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            _oAudioToggle.setPosition(_pStartPosAudio.x - iNewX, _pStartPosAudio.y);
        }
        if (_fRequestFullScreen && screenfull.enabled) {
            _oButFullscreen.setPosition(_pStartPosFullscreen.x + iNewX, _pStartPosFullscreen.y);
        }
    };

    this.unload = function() {
        _oButPlay.unload();
        _oButPlay = null;

        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            _oAudioToggle.unload();
            _oAudioToggle = null;
        }
        if (_fRequestFullScreen && screenfull.enabled) {
            _oButFullscreen.unload();
        }
        s_oStage.removeAllChildren();
        createjs.Tween.removeAllTweens();
        s_oMenu = null;
    };

    this._onAudioToggle = function() {
        Howler.mute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive;
    };

    this._onButInfoRelease = function() {
        var oCreditsPanel = new CCreditsPanel();
    };

    this._onButPlayRelease = function() {
        s_oMain.pokiShowCommercial(s_oMenu._startGame);
        /*
        if(s_bPokiFirstTimePlay){
            s_oMain.pokiShowCommercial(s_oMenu._startGame);
        } else {
            s_oMenu._startGame();
        }
        */
    };

    this._startGame = function() {
        s_oMenu.unload();
        s_oMain.gotoModeChoose();

        s_bPokiFirstTimePlay = false;
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

    s_oMenu = this;

    this._init();
}

var s_oMenu = null;