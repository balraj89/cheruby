function CAreYouSurePanel() {
    var _oButYes;
    var _oButNo;
    var _oFade;
    var _oPanelContainer;
    var _oParent;
    var _oListener;

    var _pStartPanelPos;

    this._init = function() {
        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        _oFade.alpha = 0.5;
        _oListener = _oFade.on("mousedown", function() {});
        s_oStage.addChild(_oFade);

        new createjs.Tween.get(_oFade).to({
            alpha: 0.7
        }, 500);

        _oPanelContainer = new createjs.Container();
        s_oStage.addChild(_oPanelContainer);

        var oSprite = s_oSpriteLibrary.getSprite('msg_box');
        var oPanel = createBitmap(oSprite);
        oPanel.regX = oSprite.width / 2;
        oPanel.regY = oSprite.height / 2;
        oPanel.x = CANVAS_WIDTH_HALF;
        oPanel.y = CANVAS_HEIGHT_HALF;
        _oPanelContainer.addChild(oPanel);

        _oPanelContainer.y = CANVAS_HEIGHT + oSprite.height / 2;
        _pStartPanelPos = {
            x: _oPanelContainer.x,
            y: _oPanelContainer.y
        };
        new createjs.Tween.get(_oPanelContainer).to({
            y: 0
        }, 1000, createjs.Ease.backOut);

        var oTitleBack = new createjs.Text(TEXT_ARE_SURE, " 50px " + PRIMARY_FONT, SECONDARY_FONT_COLOR);
        oTitleBack.x = CANVAS_WIDTH_HALF;
        oTitleBack.y = CANVAS_HEIGHT_HALF - 80;
        oTitleBack.textAlign = "center";
        oTitleBack.textBaseline = "middle";
        oTitleBack.outline = 5;
        _oPanelContainer.addChild(oTitleBack);

        var oTitle = new createjs.Text(TEXT_ARE_SURE, " 50px " + PRIMARY_FONT, PRIMARY_FONT_COLOR);
        oTitle.x = CANVAS_WIDTH_HALF;
        oTitle.y = CANVAS_HEIGHT_HALF - 80;
        oTitle.textAlign = "center";
        oTitle.textBaseline = "middle";
        oTitle.lineWidth = oTitleBack.lineWidth;
        _oPanelContainer.addChild(oTitle);

        var iButtonsY = CANVAS_HEIGHT_HALF + 40;

        _oButYes = new CGfxButton(CANVAS_WIDTH_HALF + 100, iButtonsY, s_oSpriteLibrary.getSprite('but_yes'), _oPanelContainer);
        _oButYes.addEventListener(ON_MOUSE_UP, this._onButYes, this);

        _oButNo = new CGfxButton(CANVAS_WIDTH_HALF - 100, iButtonsY, s_oSpriteLibrary.getSprite('but_no'), _oPanelContainer);
        _oButNo.addEventListener(ON_MOUSE_UP, this._onButNo, this);

        s_oGame.pause(true);
    };

    this._onButYes = function() {
        new createjs.Tween.get(_oFade).to({
            alpha: 0
        }, 500);
        new createjs.Tween.get(_oPanelContainer).to({
            y: _pStartPanelPos.y
        }, 400, createjs.Ease.backIn).call(function() {
            _oParent.unload();
            s_oGame.onExit();
        });
    };

    this._onButNo = function() {
        s_oInterface.closePanel();

        new createjs.Tween.get(_oFade).to({
            alpha: 0
        }, 500);
        new createjs.Tween.get(_oPanelContainer).to({
            y: _pStartPanelPos.y
        }, 400, createjs.Ease.backIn).call(function() {
            _oParent.unload();
        });

        s_oGame.pause(false);
    };

    this.unload = function() {
        _oButNo.unload();
        _oButYes.unload();

        s_oStage.removeChild(_oFade);
        s_oStage.removeChild(_oPanelContainer);

        _oFade.off("mousedown", _oListener);
    };

    _oParent = this;
    this._init();
}