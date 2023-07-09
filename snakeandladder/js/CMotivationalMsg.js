function CMotivationalMsg(iMode) {
    var _oMsgText;
    var _oMsgTextStroke;
    var _oContainer;
    var _oText; // THE TEXT THAT WILL BE USED IN THIS MESSAGE

    var _iSpeed;
    var _iDestX;
    var _iDestY;

    this._init = function() {
        _iSpeed = 700;

        if (iMode !== MSG_DICE) {
            var iRandom = Math.floor((Math.random() * 5));
            switch (iRandom) {
                case 0:
                    if (iMode === MSG_GOOD) {
                        _oText = TEXT_MOTIVATIONAL0;
                    } else {
                        _oText = TEXT_DEMOTIVATIONAL0;
                    };
                    break;
                case 1:
                    if (iMode === MSG_GOOD) {
                        _oText = TEXT_MOTIVATIONAL1;
                    } else {
                        _oText = TEXT_DEMOTIVATIONAL1;
                    };
                    break;
                case 2:
                    if (iMode === MSG_GOOD) {
                        _oText = TEXT_MOTIVATIONAL2;
                    } else {
                        _oText = TEXT_DEMOTIVATIONAL2;
                    };
                    break;
                case 3:
                    if (iMode === MSG_GOOD) {
                        _oText = TEXT_MOTIVATIONAL3;
                    } else {
                        _oText = TEXT_DEMOTIVATIONAL3;
                    };
                    break;
                case 4:
                    if (iMode === MSG_GOOD) {
                        _oText = TEXT_MOTIVATIONAL4;
                    } else {
                        _oText = TEXT_DEMOTIVATIONAL4;
                    };
                    break;
            };
        } else {
            _oText = TEXT_EXTRA_DICE;
        };

        _oContainer = new createjs.Container();
        if (iMode !== MSG_DICE) {
            _oContainer.x = 0;
            _oContainer.y = CANVAS_HEIGHT_HALF;
            _iDestX = CANVAS_WIDTH + 300;
            _iDestY = CANVAS_HEIGHT_HALF;
        } else {
            _oContainer.x = CANVAS_WIDTH_HALF;
            _oContainer.y = -100;
            _iDestX = CANVAS_WIDTH_HALF;
            _iDestY = CANVAS_HEIGHT + 300;
        };
        s_oStage.addChild(_oContainer);

        _oMsgTextStroke = new createjs.Text(_oText, "60px " + PRIMARY_FONT, THIRD_FONT_COLOR);
        _oMsgTextStroke.textAlign = "center";
        _oMsgTextStroke.textBaseline = "alphabetic";
        _oMsgTextStroke.lineWidth = 700;
        _oMsgTextStroke.outline = 3;

        _oMsgText = new createjs.Text(_oText, "60px " + PRIMARY_FONT, PRIMARY_FONT_COLOR);
        _oMsgText.textAlign = "center";
        _oMsgText.textBaseline = "alphabetic";
        _oMsgText.lineWidth = _oMsgTextStroke.lineWidth;

        _oContainer.addChild(_oMsgText, _oMsgTextStroke);

        new createjs.Tween.get(_oContainer)
            .to({
                x: CANVAS_WIDTH_HALF,
                y: CANVAS_HEIGHT_HALF
            }, _iSpeed, createjs.Ease.cubicIn)
            .call(this.exit);
    };

    this.exit = function() {
        new createjs.Tween.get(_oContainer)
            .wait(_iSpeed)
            .to({
                x: _iDestX,
                y: _iDestY
            }, _iSpeed * 0.5, createjs.Ease.cubicOut)
            .call(function() {
                if (iMode === MSG_DICE) {
                    s_oGame.extraDiceLaunch();
                } else {
                    s_oMotivationalMsg.unload();
                };
            });
    };

    this.unload = function() {
        s_oStage.removeChild(_oContainer);
        s_oMotivationalMsg = null;
    };

    s_oMotivationalMsg = this;

    this._init();
}

var s_oMotivationalMsg;