function CMsgBox(szText, oParentContainer) {
    var _oMsg;
    var _oButOk;
    var _oThis;
    var _oContainer;
    var _oParentContainer;

    this._init = function(szText) {
        _oContainer = new createjs.Container();
        _oParentContainer.addChild(_oContainer);

        var oFade;

        oFade = new createjs.Shape();
        oFade.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        oFade.alpha = 0.5;

        oFade.on("click", function() {});

        _oContainer.addChild(oFade);

        var oSpriteBg = s_oSpriteLibrary.getSprite('msg_box');
        var oBg = createBitmap(oSpriteBg);

        oBg.x = CANVAS_WIDTH_HALF;
        oBg.y = CANVAS_HEIGHT_HALF;
        oBg.regX = oSpriteBg.width * 0.5;
        oBg.regY = oSpriteBg.height * 0.5;
        _oContainer.addChild(oBg);

        _oMsg = new createjs.Text(TEXT_ERR_LS, "20px " + PRIMARY_FONT, "#fff");
        _oMsg.x = CANVAS_WIDTH_HALF;
        _oMsg.y = CANVAS_HEIGHT_HALF - 130;
        _oMsg.textAlign = "center";
        _oMsg.textBaseline = "middle";
        _oMsg.lineWidth = 450;
        _oContainer.addChild(_oMsg);

        _oButOk = new CGfxButton(CANVAS_WIDTH_HALF, CANVAS_HEIGHT_HALF + 100, s_oSpriteLibrary.getSprite('but_yes'), _oContainer);
        _oButOk.addEventListener(ON_MOUSE_UP, this._onButOk, this);
    };

    this._onButOk = function() {
        _oThis.unload();
    };

    this.unload = function() {
        _oButOk.unload();
        _oParentContainer.removeChild(_oContainer);
    };

    _oThis = this;
    _oParentContainer = oParentContainer;

    this._init(szText);
}