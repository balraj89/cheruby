function CPauseButton(oParentContainer) {
    var _oShape;
    var _oTextBack;
    var _oText;
    var _oContainer;
    var _oParentContainer;
    var _oThis;

    this.init = function(oParentContainer) {
        s_oGame.pause(true);
        _oContainer = new createjs.Container();
        _oParentContainer = oParentContainer;
        _oParentContainer.addChild(_oContainer);

        _oShape = new createjs.Shape();
        _oShape.graphics.beginFill("#black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        _oShape.alpha = 0.7;
        /*
        _oShape.on("mousedown",function(){
            _oThis.onExit();
        });*/

        if (!s_bMobile) {
            _oShape.cursor = "pointer";
        };

        _oTextBack = new createjs.Text(TEXT_PAUSE, " 40px " + PRIMARY_FONT, THIRD_FONT_COLOR);
        _oTextBack.textBaseline = "alphabetic";
        _oTextBack.textAlign = "center";
        _oTextBack.x = CANVAS_WIDTH_HALF;
        _oTextBack.y = CANVAS_HEIGHT_HALF;
        _oTextBack.outline = 5;

        _oText = new createjs.Text(TEXT_PAUSE, " 40px " + PRIMARY_FONT, PRIMARY_FONT_COLOR);
        _oText.textBaseline = _oTextBack.textBaseline;
        _oText.textAlign = _oTextBack.textAlign;
        _oText.x = _oTextBack.x;
        _oText.y = _oTextBack.y;

        _oTextBack.alpha = _oText.alpha = 1;

        _oContainer.addChild(_oShape, _oTextBack, _oText);
    };

    this.onExit = function() {
        _oShape.alpha = 0;
        _oTextBack.alpha = 0;
        _oText.alpha = 0;
        s_oStage.removeChild(_oContainer);
        s_oGame.pause(false);
    };

    _oThis = this;

    this.init(oParentContainer);
}