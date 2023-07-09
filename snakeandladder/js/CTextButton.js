function CTextButton(iXPos, iYPos, oSprite, szText, szFont, szColor, iFontSize, oContainer) {

    var _aCbCompleted;
    var _aCbOwner;
    var _aParams;
    var _oButton;
    var _oText;
    var _oTextBack;
    var _oListenerMouseDown;
    var _oListenerMouseUp;

    this._init = function(iXPos, iYPos, oSprite, szText, szFont, szColor, iFontSize, oContainer) {

        _aCbCompleted = new Array();
        _aCbOwner = new Array();
        _aParams = new Array();

        var oButtonBg = createBitmap(oSprite);

        var iStepShadow = Math.ceil(iFontSize / 20);

        _oTextBack = new createjs.Text(szText, " " + iFontSize + "px " + PRIMARY_FONT, SECONDARY_FONT_COLOR);
        _oTextBack.textAlign = "center";
        _oTextBack.textBaseline = "alphabetic";
        var oBounds = _oTextBack.getBounds();
        _oTextBack.x = oSprite.width / 2 /*+ iStepShadow*/ ;
        _oTextBack.y = Math.floor((oSprite.height) / 2) + (oBounds.height / 3) /*+ iStepShadow*/ ;

        _oText = new createjs.Text(szText, " " + iFontSize + "px " + PRIMARY_FONT, szColor);
        _oText.textAlign = "center";
        _oText.textBaseline = "alphabetic";
        var oBounds = _oText.getBounds();
        _oText.x = oSprite.width / 2;
        _oText.y = Math.floor((oSprite.height) / 2) + (oBounds.height / 3);

        _oButton = new createjs.Container();
        _oButton.x = iXPos;
        _oButton.y = iYPos;
        _oButton.regX = oSprite.width / 2;
        _oButton.regY = oSprite.height / 2;
        _oButton.addChild(oButtonBg, _oTextBack, _oText);

        oContainer.addChild(_oButton);

        if (!s_bMobile)
            _oButton.cursor = "pointer";

        this._initListener();
    };

    this.unload = function() {
        _oButton.off("mousedown", _oListenerMouseDown);
        _oButton.off("pressup", _oListenerMouseUp);

        oContainer.removeChild(_oButton);
    };

    this.setVisible = function(bVisible) {
        _oButton.visible = bVisible;
    };

    this._initListener = function() {
        _oListenerMouseDown = _oButton.on("mousedown", this.buttonDown);
        _oListenerMouseUp = _oButton.on("pressup", this.buttonRelease);
    };

    this.addEventListener = function(iEvent, cbCompleted, cbOwner) {
        _aCbCompleted[iEvent] = cbCompleted;
        _aCbOwner[iEvent] = cbOwner;
    };

    this.addEventListenerWithParams = function(iEvent, cbCompleted, cbOwner, aParams) {
        _aCbCompleted[iEvent] = cbCompleted;
        _aCbOwner[iEvent] = cbOwner;
        _aParams[iEvent] = aParams;
    };

    this.buttonRelease = function() {
        _oButton.scaleX = 1;
        _oButton.scaleY = 1;

        playSound("click", 1, false);

        if (_aCbCompleted[ON_MOUSE_UP]) {
            _aCbCompleted[ON_MOUSE_UP].call(_aCbOwner[ON_MOUSE_UP], _aParams[ON_MOUSE_UP]);
        }
    };

    this.buttonDown = function() {
        _oButton.scaleX = 0.9;
        _oButton.scaleY = 0.9;

        if (_aCbCompleted[ON_MOUSE_DOWN]) {
            _aCbCompleted[ON_MOUSE_DOWN].call(_aCbOwner[ON_MOUSE_DOWN]);
        }
    };

    this.setTextPosition = function(iY) {
        _oText.y = iY;
        _oTextBack.y = iY + 2;
    };

    this.setPosition = function(iXPos, iYPos) {
        _oButton.x = iXPos;
        _oButton.y = iYPos;
    };

    this.setX = function(iXPos) {
        _oButton.x = iXPos;
    };

    this.setY = function(iYPos) {
        _oButton.y = iYPos;
    };

    this.getButtonImage = function() {
        return _oButton;
    };

    this.getX = function() {
        return _oButton.x;
    };

    this.getY = function() {
        return _oButton.y;
    };

    this._init(iXPos, iYPos, oSprite, szText, szFont, szColor, iFontSize, oContainer);

    return this;

}