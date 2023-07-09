function CHelpPanel() {
    var _oTextBack1;
    var _oTextBack2;
    var _oTextBack3;
    var _oText1;
    var _oText2;
    var _oText3;
    var _oImageLadder;
    var _oAnimationLadder;
    var _oAnimationSnake;
    var _oAnimationChute;
    var _oImageObstacle;
    var _oFade;
    var _oBg;
    var _oGroup;
    var _oSkipBut;
    var _pStartPosSkip;
    var _oListener;

    this._init = function() {
        var iTextY1 = CANVAS_HEIGHT_HALF - 140;
        var iTextY2 = CANVAS_HEIGHT_HALF - 10;
        var iTextY3 = CANVAS_HEIGHT_HALF + 80;

        var oSpriteBg = s_oSpriteLibrary.getSprite('bg_help');
        _oBg = createBitmap(oSpriteBg);
        _oBg.x = CANVAS_WIDTH_HALF;
        _oBg.y = CANVAS_HEIGHT_HALF;
        _oBg.regX = oSpriteBg.width * 0.5;
        _oBg.regY = oSpriteBg.height * 0.5;

        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        _oFade.alpha = 0.7;
        _oListener = _oFade.on("mousedown", function() {});

        _oGroup = new createjs.Container();
        _oGroup.addChild(_oFade, _oBg);
        s_oStage.addChild(_oGroup);

        _oTextBack1 = new createjs.Text(TEXT_HELP_1, " 22px " + PRIMARY_FONT, SECONDARY_FONT_COLOR);
        _oTextBack1.x = CANVAS_WIDTH_HALF;
        _oTextBack1.y = iTextY1;
        _oTextBack1.textAlign = "center";
        _oTextBack1.textBaseline = "alphabetic";
        _oTextBack1.lineWidth = 500;
        _oTextBack1.lineHeight = 25;
        _oTextBack1.outline = 4;

        _oText1 = new createjs.Text(TEXT_HELP_1, " 22px " + PRIMARY_FONT, PRIMARY_FONT_COLOR);
        _oText1.x = _oTextBack1.x;
        _oText1.y = _oTextBack1.y;
        _oText1.textAlign = "center";
        _oText1.textBaseline = "alphabetic";
        _oText1.lineHeight = 25;
        _oText1.lineWidth = 500;

        var iOffsetX = 120;

        _oTextBack2 = new createjs.Text(TEXT_HELP2_PT1, " 22px " + PRIMARY_FONT, SECONDARY_FONT_COLOR);
        _oTextBack2.x = CANVAS_WIDTH_HALF - iOffsetX;
        _oTextBack2.y = iTextY2;
        _oTextBack2.textAlign = "left";
        _oTextBack2.textBaseline = "alphabetic";
        _oTextBack2.lineWidth = 320;
        _oTextBack2.lineHeight = 25;
        _oTextBack2.outline = 4;

        _oText2 = new createjs.Text(TEXT_HELP2_PT1, " 22px " + PRIMARY_FONT, PRIMARY_FONT_COLOR);
        _oText2.x = _oTextBack2.x;
        _oText2.y = _oTextBack2.y;
        _oText2.textAlign = _oTextBack2.textAlign;
        _oText2.textBaseline = _oTextBack2.textBaseline;
        _oText2.lineHeight = _oTextBack2.lineHeight;
        _oText2.lineWidth = _oTextBack2.lineWidth;

        _oTextBack3 = new createjs.Text(" ", " 22px " + PRIMARY_FONT, SECONDARY_FONT_COLOR);
        _oTextBack3.x = CANVAS_WIDTH_HALF + iOffsetX;
        _oTextBack3.y = iTextY3;
        _oTextBack3.textAlign = "right";
        _oTextBack3.textBaseline = "alphabetic";
        _oTextBack3.lineWidth = 320;
        _oTextBack3.lineHeight = 25;
        _oTextBack3.outline = 4;

        _oText3 = new createjs.Text(" ", " 22px " + PRIMARY_FONT, PRIMARY_FONT_COLOR);
        _oText3.x = _oTextBack3.x;
        _oText3.y = _oTextBack3.y;
        _oText3.textAlign = _oTextBack3.textAlign;
        _oText3.textBaseline = _oTextBack3.textBaseline;
        _oText3.lineHeight = _oTextBack3.lineHeight;
        _oText3.lineWidth = _oTextBack3.lineWidth;

        if (s_iModeGame === MODE_SNAKES) {
            _oTextBack3.text = _oText3.text = TEXT_MODE0 + TEXT_HELP2_PT2;
        } else {
            _oTextBack3.text = _oText3.text = TEXT_MODE1 + TEXT_HELP2_PT2;
        };

        if (s_iModeGame === MODE_SNAKES) {
            var oSpriteLadder = s_oSpriteLibrary.getSprite('help_ladder_sn');
            var oSpriteAnimationLadder = s_oSpriteLibrary.getSprite('help_ladder_anim_sn');
            var oSpriteAnimationFall = s_oSpriteLibrary.getSprite('help_ladder_anim_sn');
        } else {
            var oSpriteLadder = s_oSpriteLibrary.getSprite('help_ladder_ch');
            var oSpriteAnimationLadder = s_oSpriteLibrary.getSprite('help_ladder_anim_ch');
            var oSpriteAnimationFall = s_oSpriteLibrary.getSprite('help_chute_anim');
        };

        _oImageLadder = createBitmap(oSpriteLadder);
        _oImageLadder.regX = oSpriteLadder.width * 0.5;
        _oImageLadder.regY = oSpriteLadder.height * 0.5;
        _oImageLadder.x = CANVAS_WIDTH_HALF - 200;
        _oImageLadder.y = iTextY2;

        var aLadderOffset = [35, 30];

        _oAnimationLadder = createBitmap(oSpriteAnimationLadder);
        _oAnimationLadder.regX = oSpriteAnimationLadder.width * 0.5;
        _oAnimationLadder.regY = oSpriteAnimationLadder.height * 0.5;
        _oAnimationLadder.x = _oImageLadder.x + aLadderOffset[s_iModeGame];
        _oAnimationLadder.y = _oImageLadder.y + 10;

        new createjs.Tween.get(_oAnimationLadder, {
                loop: true
            })
            .to({
                x: _oImageLadder.x - 25,
                y: _oImageLadder.y - 60
            }, 1000, createjs.Ease.cubicIn)
            .wait(500);

        if (s_iModeGame === MODE_SNAKES) {
            var oSpriteObstacle = s_oSpriteLibrary.getSprite('help_snake');
        } else {
            var oSpriteObstacle = s_oSpriteLibrary.getSprite('help_chute');
        };

        _oImageObstacle = createBitmap(oSpriteObstacle);
        _oImageObstacle.regX = oSpriteObstacle.width * 0.5;
        _oImageObstacle.regY = oSpriteObstacle.height * 0.5;
        _oImageObstacle.x = CANVAS_WIDTH_HALF + 200;
        _oImageObstacle.y = iTextY3;

        _oGroup.addChild(_oTextBack1, _oText1, _oTextBack2, _oText2, _oTextBack3, _oText3, _oImageLadder, _oAnimationLadder, _oImageObstacle);

        if (s_iModeGame === MODE_SNAKES) {
            _oAnimationSnake = createBitmap(oSpriteAnimationFall);
            _oAnimationSnake.regX = oSpriteAnimationFall.width * 0.5;
            _oAnimationSnake.regY = oSpriteAnimationFall.height * 0.5;
            _oAnimationSnake.x = _oImageObstacle.x - 20;
            _oAnimationSnake.y = _oImageObstacle.y - 45;
            _oAnimationSnake.scaleX = _oAnimationSnake.scaleY = 0.6;
            _oGroup.addChild(_oAnimationSnake);

            new createjs.Tween.get(_oAnimationSnake, {
                    loop: true
                })
                .to({
                    x: _oImageObstacle.x,
                    y: _oImageObstacle.y - 15
                }, 300, createjs.Ease.linear)
                .to({
                    x: _oImageObstacle.x + 25,
                    y: _oImageObstacle.y
                }, 300, createjs.Ease.linear)
                .to({
                    x: _oImageObstacle.x + 30,
                    y: _oImageObstacle.y + 10
                }, 300, createjs.Ease.linear)
                .wait(500);
        } else {
            _oAnimationChute = createBitmap(oSpriteAnimationFall);
            _oAnimationChute.regX = oSpriteAnimationFall.width * 0.5;
            _oAnimationChute.regY = oSpriteAnimationFall.height * 0.5;
            _oAnimationChute.x = _oImageObstacle.x - 25;
            _oAnimationChute.y = _oImageObstacle.y - 35;
            _oAnimationChute.scaleX = _oAnimationChute.scaleY = 0.6;
            _oGroup.addChild(_oAnimationChute);

            new createjs.Tween.get(_oAnimationChute, {
                    loop: true
                })
                .to({
                    x: _oImageObstacle.x,
                    y: _oImageObstacle.y - 15
                }, 300, createjs.Ease.linear)
                .to({
                    x: _oImageObstacle.x + 10,
                    y: _oImageObstacle.y
                }, 300, createjs.Ease.linear)
                .to({
                    x: _oImageObstacle.x + 35,
                    y: _oImageObstacle.y + 15
                }, 300, createjs.Ease.linear)
                .wait(500);
        };

        var oSpriteSkip = s_oSpriteLibrary.getSprite('but_skip_small');
        _pStartPosSkip = {
            x: CANVAS_WIDTH_HALF,
            y: CANVAS_HEIGHT_HALF + 180
        };
        _oSkipBut = new CGfxButton(_pStartPosSkip.x, _pStartPosSkip.y, oSpriteSkip, s_oStage);
        _oSkipBut.addEventListener(ON_MOUSE_UP, this._onExitHelp, this);

        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        s_oStage.addChild(_oFade);

        createjs.Tween.get(_oFade).to({
            alpha: 0
        }, 1000).call(function() {
            _oFade.visible = false;
        });
    };

    this.unload = function() {
        s_oStage.removeChild(_oGroup);
        _oSkipBut.unload();

        _oFade.off("mousedown", _oListener);
    };

    this._onExitHelp = function() {
        this.unload();
        setTimeout(s_oGame._onExitHelp, 200);
    };

    this._init();
}