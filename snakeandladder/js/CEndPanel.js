function CEndPanel(oSpriteBg) {
    var _iEventToLaunch;
    var _aCbCompleted;
    var _aCbOwner;
    var _oBg;
    var _oTitleTextStroke;
    var _oTitleText;
    var _oRecordText1Stroke;
    var _oRecordText1;
    var _oRecordText2Stroke;
    var _oRecordText2;
    var _oGroup;
    var _oButHome;
    var _oButCheck;
    var _oButRestart;
    var _oFade;

    this._init = function(oSpriteBg) {
        $(s_oMain).trigger("share_event", s_aGamesWon);
        $(s_oMain).trigger("save_score", s_aGamesWon);

        _aCbCompleted = new Array();
        _aCbOwner = new Array();

        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        _oFade.alpha = 0.0;
        _oFade.on("click", function() {});
        s_oStage.addChild(_oFade);

        _oGroup = new createjs.Container();
        _oGroup.alpha = 1;
        _oGroup.visible = false;
        _oGroup.y = CANVAS_HEIGHT;

        _oBg = createBitmap(oSpriteBg);
        _oBg.x = CANVAS_WIDTH_HALF;
        _oBg.y = CANVAS_HEIGHT_HALF;
        _oBg.regX = oSpriteBg.width * 0.5;
        _oBg.regY = oSpriteBg.height * 0.5;
        _oGroup.addChild(_oBg);

        _oTitleTextStroke = new createjs.Text(TEXT_WIN, "40px " + PRIMARY_FONT, SECONDARY_FONT_COLOR);
        _oTitleTextStroke.x = CANVAS_WIDTH_HALF;
        _oTitleTextStroke.y = 220;
        _oTitleTextStroke.textAlign = "center";
        _oTitleTextStroke.outline = 5;
        _oTitleTextStroke.textBaseline = "middle";
        _oGroup.addChild(_oTitleTextStroke);

        _oTitleText = new createjs.Text(TEXT_WIN, "40px " + PRIMARY_FONT, PRIMARY_FONT_COLOR);
        _oTitleText.x = _oTitleTextStroke.x;
        _oTitleText.y = _oTitleTextStroke.y;
        _oTitleText.textAlign = _oTitleTextStroke.textAlign;
        _oTitleText.textBaseline = _oTitleTextStroke.textBaseline;
        _oGroup.addChild(_oTitleText);

        _oRecordText1Stroke = new createjs.Text(TEXT_GAMES_PLAYED + ": " + s_aGamesPlayed, "20px " + PRIMARY_FONT, SECONDARY_FONT_COLOR);
        _oRecordText1Stroke.x = CANVAS_WIDTH_HALF;
        _oRecordText1Stroke.y = 270;
        _oRecordText1Stroke.textAlign = "center";
        _oRecordText1Stroke.outline = 5;
        _oRecordText1Stroke.textBaseline = "middle";
        _oGroup.addChild(_oRecordText1Stroke);

        _oRecordText1 = new createjs.Text(TEXT_GAMES_PLAYED + ": " + s_aGamesPlayed, "20px " + PRIMARY_FONT, PRIMARY_FONT_COLOR);
        _oRecordText1.x = _oRecordText1Stroke.x;
        _oRecordText1.y = _oRecordText1Stroke.y;
        _oRecordText1.textAlign = _oRecordText1Stroke.textAlign;
        _oRecordText1.textBaseline = _oRecordText1Stroke.textBaseline;
        _oGroup.addChild(_oRecordText1);

        _oRecordText2Stroke = new createjs.Text(TEXT_GAMES_WON + ": " + s_aGamesWon, "20px " + PRIMARY_FONT, SECONDARY_FONT_COLOR);
        _oRecordText2Stroke.x = CANVAS_WIDTH_HALF;
        _oRecordText2Stroke.y = 300;
        _oRecordText2Stroke.textAlign = "center";
        _oRecordText2Stroke.outline = 5;
        _oRecordText2Stroke.textBaseline = "middle";
        _oGroup.addChild(_oRecordText2Stroke);

        _oRecordText2 = new createjs.Text(TEXT_GAMES_WON + ": " + s_aGamesWon, "20px " + PRIMARY_FONT, PRIMARY_FONT_COLOR);
        _oRecordText2.x = _oRecordText2Stroke.x;
        _oRecordText2.y = _oRecordText2Stroke.y;
        _oRecordText2.textAlign = _oRecordText2Stroke.textAlign;
        _oRecordText2.textBaseline = _oRecordText2Stroke.textBaseline;
        _oGroup.addChild(_oRecordText2);

        s_oStage.addChild(_oGroup);

        var oSpriteButHome = s_oSpriteLibrary.getSprite("but_home");
        _oButHome = new CGfxButton(CANVAS_WIDTH_HALF - 180, CANVAS_HEIGHT_HALF + 80, oSpriteButHome, _oGroup);
        _oButHome.addEventListener(ON_MOUSE_DOWN, this._onExit, this);

        var oSpriteButHome = s_oSpriteLibrary.getSprite("but_check");
        _oButCheck = new CGfxButton(CANVAS_WIDTH_HALF, CANVAS_HEIGHT_HALF + 80, oSpriteButHome, _oGroup);
        _oButCheck.addEventListener(ON_MOUSE_DOWN, this._onCheck, this);

        var oSpriteButRestart = s_oSpriteLibrary.getSprite("but_restart");
        _oButRestart = new CGfxButton(CANVAS_WIDTH_HALF + 180, CANVAS_HEIGHT_HALF + 80, oSpriteButRestart, _oGroup);
        _oButRestart.addEventListener(ON_MOUSE_DOWN, this._onRestart, this);
        _oButRestart.pulseAnimation();
    };

    this.unload = function() {
        createjs.Tween.get(_oGroup).to({
            alpha: 0
        }, 500, createjs.Ease.cubicOut).call(function() {
            s_oStage.removeChild(_oGroup);
            _oButHome.unload();
            _oButHome = null;

            _oFade.removeAllEventListeners();

            _oButRestart.unload();
            _oButRestart = null;

            _oButCheck.unload();
            _oButCheck = null;
        });
    };

    this.hide = function() {
        _oFade.visible = false;
        _oGroup.visible = false;
    };

    this.reShow = function() {
        _oFade.visible = true;
        _oGroup.visible = true;
    };

    this.show = function(bWin) {
        _oGroup.visible = true;
        _oFade.visible = true;

        if (bWin) {
            _oTitleTextStroke.text = TEXT_WIN;
            _oTitleText.text = TEXT_WIN;
        } else {
            _oTitleTextStroke.text = TEXT_LOSE;
            _oTitleText.text = TEXT_LOSE;
        }

        _oRecordText1Stroke.text = TEXT_GAMES_PLAYED + ": " + s_aGamesPlayed;
        _oRecordText1.text = TEXT_GAMES_PLAYED + ": " + s_aGamesPlayed;

        _oRecordText2Stroke.text = TEXT_GAMES_WON + ": " + s_aGamesWon;
        _oRecordText2.text = TEXT_GAMES_WON + ": " + s_aGamesWon;

        _oFade.alpha = 0;
        createjs.Tween.get(_oFade).to({
            alpha: 0.5
        }, 500, createjs.Ease.cubicOut);

        createjs.Tween.get(_oGroup).wait(250).to({
            y: 0
        }, 1250, createjs.Ease.elasticOut).call(function() {
            $(s_oMain).trigger("show_interlevel_ad");
        });
    };

    this.addEventListener = function(iEvent, cbCompleted, cbOwner) {
        _aCbCompleted[iEvent] = cbCompleted;
        _aCbOwner[iEvent] = cbOwner;
    };

    this._onCheck = function() {
        _iEventToLaunch = ON_CHECK;
        if (_aCbCompleted[_iEventToLaunch]) {
            _aCbCompleted[_iEventToLaunch].call(_aCbOwner[_iEventToLaunch]);
        }
    };

    this._onRestart = function() {
        _iEventToLaunch = ON_RESTART;
        if (_aCbCompleted[_iEventToLaunch]) {
            _aCbCompleted[_iEventToLaunch].call(_aCbOwner[_iEventToLaunch]);
        }
    };

    this._onExit = function() {
        _iEventToLaunch = ON_BACK_MENU;
        if (_aCbCompleted[_iEventToLaunch]) {
            _aCbCompleted[_iEventToLaunch].call(_aCbOwner[_iEventToLaunch]);
        }
    };

    this.hideRestartButton = function() {
        _oButRestart.setVisible(false);
    };

    this.hideButtons = function() {
        _oButHome.setVisible(false);
        _oButRestart.setVisible(false);
        _oButCheck.setVisible(false);
    };

    this.showButtons = function() {
        _oButHome.setVisible(true);
        _oButRestart.setVisible(true);
        _oButCheck.setVisible(true);
    };

    this.changeMessage = function(szMsg) {
        _oTitleTextStroke.text = szMsg;
        _oTitleText.text = szMsg;
    };

    this.centerRemainingButtons = function() {
        _oButHome.setX(CANVAS_WIDTH_HALF - 150);
        _oButHome.setVisible(true);

        _oButCheck.setX(CANVAS_WIDTH_HALF + 150);
        _oButCheck.setVisible(true);
    };

    this._init(oSpriteBg);

    return this;
}