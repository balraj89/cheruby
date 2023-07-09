function CPause() {

    var _oContainer;
    var _oFade;

    this._init = function() {
        var oContainer = new createjs.Container();
        oContainer.alpha = 0;

        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        _oFade.alpha = 0.5;

        var oHitArea = new createjs.Shape();
        oHitArea.graphics.beginFill("#0f0f0f").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        _oFade.hitArea = oHitArea;
        oContainer.addChild(_oFade);

        var oPauseTextStroke = new createjs.Text(TEXT_PAUSE, "50px " + PRIMARY_FONT, THIRD_FONT_COLOR);
        oPauseTextStroke.x = CANVAS_WIDTH * 0.5;
        oPauseTextStroke.y = CANVAS_HEIGHT * 0.5 - 130;
        oPauseTextStroke.textAlign = "center";
        oPauseTextStroke.outline = 5;
        oContainer.addChild(oPauseTextStroke);

        var oPauseText = new createjs.Text(TEXT_PAUSE, "50px " + PRIMARY_FONT, PRIMARY_FONT_COLOR);
        oPauseText.x = oPauseTextStroke.x;
        oPauseText.y = oPauseTextStroke.y;
        oPauseText.textAlign = "center";
        oContainer.addChild(oPauseText);

        var oSpriteContinue = s_oSpriteLibrary.getSprite("but_continue");
        var oButContinue;
        oButContinue = new CGfxButton(CANVAS_WIDTH * 0.5, CANVAS_HEIGHT * 0.5 + 70, oSpriteContinue, oContainer);
        oButContinue.addEventListenerWithParams(ON_MOUSE_UP, this._onLeavePause, this, oContainer);

        s_oStage.addChild(oContainer);

        createjs.Tween.get(oContainer).to({
            alpha: 1
        }, 300, createjs.quartOut);
    };

    this.unload = function() {
        s_oStage.removeChild(_oContainer);
    };

    this._onLeavePause = function(oContainer) {
        console.log("leave pause");

        createjs.Tween.get(oContainer).to({
            alpha: 0
        }, 300, createjs.quartIn).call(function() {
            s_oInterface.unloadPause();
            s_oGame.pause(false);
        });
    };

    this._init();

    return this;
}