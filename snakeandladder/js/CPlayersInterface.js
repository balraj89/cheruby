function CPlayersInterface(aPlayersColor) {
    var _aPlayersColor = aPlayersColor; // HOW MANY PLAYERS ARE IN THIS MATCH (HUMAN+CPU)
    var _oPlayersContainer;
    var _oTurnPanel;
    var _oPlayer0;
    var _oPlayer1;
    var _oPlayer2;
    var _oPlayer3;
    var _oPlayer4;
    var _oPlayer5;
    var _pStartPosPlayers;
    var _aPlayers; // Array containing the players

    this._init = function() {
        _aPlayers = [_oPlayer0, _oPlayer1, _oPlayer2, _oPlayer3, _oPlayer4, _oPlayer5];

        _oPlayersContainer = new createjs.Container();
        s_oStage.addChild(_oPlayersContainer);

        _pStartPosPlayers = {
            x: 20,
            y: 10
        };

        _oPlayersContainer.x = _pStartPosPlayers.x;
        _oPlayersContainer.y = _pStartPosPlayers.y;

        _oTurnPanel = createBitmap(s_oSpriteLibrary.getSprite("turn_panel"));
        _oPlayersContainer.addChild(_oTurnPanel);

        var iPlayersXOffset = 10;
        var iPlayersYOffset = 50;
        var iStartPosition = {
            x: 35,
            y: 67
        };
        var aWidth = [34, 44];
        var aHeight = [34, 44];

        // CREATE THE PLAYERS' INDICATORS
        var oSpriteName = "turns" + s_iModeGame;
        for (var i = 0; i < _aPlayersColor.length; i++) {
            var oData = {
                images: [s_oSpriteLibrary.getSprite(oSpriteName)],
                framerate: 0,
                frames: {
                    width: aWidth[s_iModeGame],
                    height: aHeight[s_iModeGame],
                    regX: aWidth[s_iModeGame] / 2,
                    regY: aHeight[s_iModeGame]
                },
            };
            var oSpriteSheet = new createjs.SpriteSheet(oData);
            _aPlayers[i] = createSprite(oSpriteSheet, 0, aWidth[s_iModeGame] / 2,
                aHeight[s_iModeGame] / 2, aWidth[s_iModeGame], aHeight[s_iModeGame]);
            _aPlayers[i].x = iStartPosition.x + iPlayersXOffset;
            _aPlayers[i].y = iStartPosition.y + iPlayersYOffset / 4 + iPlayersYOffset * i;
            _aPlayers[i].gotoAndStop(_aPlayersColor[i]);
            _aPlayers[i].visible = true;
            _oPlayersContainer.addChild(_aPlayers[i]);
        };

        // SET THE UNUSED INDICATORS INVISIBLE
        for (var j = _aPlayersColor.length; j < 6; j++) {
            //_aPlayers[j].visible = false;
        };
    };

    this.setTurn = function(iTurn) {
        _aPlayers[iTurn].gotoAndStop(_aPlayersColor[iTurn] + 6);

        for (var i = 0; i < _aPlayersColor.length; i++) {
            if (i !== iTurn) {
                _aPlayers[i].gotoAndStop(_aPlayersColor[i]);
            };
        };
    };

    this.refreshPosition = function(iNewX) {
        _oPlayersContainer.x = _pStartPosPlayers.x + iNewX;
        _oPlayersContainer.y = _pStartPosPlayers.y;
    };

    s_oPlayersInterface = this;

    this._init();

    return this;
};

var s_oPlayersInterface = null;