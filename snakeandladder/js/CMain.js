function CMain(oData) {
    var _bUpdate;
    var _iCurResource = 0;
    var RESOURCE_TO_LOAD = 0;
    var _iState = STATE_LOADING;
    var _oData;
    var _oPreloader;
    var _oMenu;
    var _oHelp;
    var _oGame;
    var _oModeChoose;
    var _oPlayersChoose;
    var _oColourChoose;
    var _oModeSelection;

    this.initContainer = function() {
        var canvas = document.getElementById("canvas");
        s_oStage = new createjs.Stage(canvas);
        createjs.Touch.enable(s_oStage);
        s_oStage.preventSelection = false;

        canvas.opacity = 0.5;

        s_bMobile = jQuery.browser.mobile;
        if (s_bMobile === false) {
            s_oStage.enableMouseOver(20);
            $('body').on('contextmenu', '#canvas', function(e) {
                return false;
            });
        }

        s_iPrevTime = new Date().getTime();

        createjs.Ticker.addEventListener("tick", this._update);
        createjs.Ticker.framerate = FPS;

        if (navigator.userAgent.match(/Windows Phone/i)) {
            DISABLE_SOUND_MOBILE = true;
        }

        s_oSpriteLibrary = new CSpriteLibrary();

        PokiSDK.init().then(
            () => {
                // successfully initialized
                // console.log("PokiSDK initialized");
                // continue to game

                //ADD PRELOADER
                _oPreloader = new CPreloader();
            }
        ).catch(
            () => {
                // initialized but the user has an adblock
                // console.log("Adblock enabled");
                // feel free to kindly ask the user to disable AdBlock, like forcing weird usernames or showing a sad face; be creative!
                // continue to the game

                //ADD PRELOADER
                _oPreloader = new CPreloader();
            }
        );
        // PokiSDK.setDebug(false);

        _bUpdate = true;
    };

    this.soundLoaded = function() {
        _iCurResource++;
        var iPerc = Math.floor(_iCurResource / RESOURCE_TO_LOAD * 100);

        PokiSDK.gameLoadingProgress({
            percentageDone: _iCurResource / RESOURCE_TO_LOAD
        });

        _oPreloader.refreshLoader(iPerc);
    };

    this._initSounds = function() {
        Howler.mute(!s_bAudioActive);

        s_aSoundsInfo = new Array();
        s_aSoundsInfo.push({
            path: './sounds/',
            filename: 'soundtrack',
            loop: true,
            volume: 1,
            ingamename: 'soundtrack'
        });
        s_aSoundsInfo.push({
            path: './sounds/',
            filename: 'but_press',
            loop: false,
            volume: 1,
            ingamename: 'click'
        });
        s_aSoundsInfo.push({
            path: './sounds/',
            filename: 'game_win',
            loop: false,
            volume: 1,
            ingamename: 'game_win'
        });
        s_aSoundsInfo.push({
            path: './sounds/',
            filename: 'game_over',
            loop: false,
            volume: 1,
            ingamename: 'game_over'
        });
        s_aSoundsInfo.push({
            path: './sounds/',
            filename: 'bonus',
            loop: false,
            volume: 1,
            ingamename: 'bonus'
        });
        s_aSoundsInfo.push({
            path: './sounds/',
            filename: 'malus',
            loop: false,
            volume: 1,
            ingamename: 'malus'
        });
        s_aSoundsInfo.push({
            path: './sounds/',
            filename: 'step_land',
            loop: false,
            volume: 1,
            ingamename: 'step_land'
        });
        s_aSoundsInfo.push({
            path: './sounds/',
            filename: 'ladder',
            loop: false,
            volume: 1,
            ingamename: 'ladder'
        });
        s_aSoundsInfo.push({
            path: './sounds/',
            filename: 'dices',
            loop: false,
            volume: 1,
            ingamename: 'dices'
        });
        s_aSoundsInfo.push({
            path: './sounds/',
            filename: 'snake',
            loop: false,
            volume: 1,
            ingamename: 'snake'
        });
        s_aSoundsInfo.push({
            path: './sounds/',
            filename: 'eat',
            loop: false,
            volume: 1,
            ingamename: 'eat'
        });
        s_aSoundsInfo.push({
            path: './sounds/',
            filename: 'chute',
            loop: false,
            volume: 1,
            ingamename: 'chute'
        });

        RESOURCE_TO_LOAD += s_aSoundsInfo.length;

        s_aSounds = new Array();
        for (var i = 0; i < s_aSoundsInfo.length; i++) {
            this.tryToLoadSound(s_aSoundsInfo[i], false);
        }
    };

    this.tryToLoadSound = function(oSoundInfo, bDelay) {

        setTimeout(function() {
            s_aSounds[oSoundInfo.ingamename] = new Howl({
                src: [oSoundInfo.path + oSoundInfo.filename + '.mp3'],
                autoplay: false,
                preload: true,
                loop: oSoundInfo.loop,
                volume: oSoundInfo.volume,
                onload: s_oMain.soundLoaded,
                onloaderror: function(szId, szMsg) {
                    for (var i = 0; i < s_aSoundsInfo.length; i++) {
                        if (szId === s_aSounds[s_aSoundsInfo[i].ingamename]._sounds[0]._id) {
                            s_oMain.tryToLoadSound(s_aSoundsInfo[i], true);
                            break;
                        }
                    }
                },
                onplayerror: function(szId) {
                    for (var i = 0; i < s_aSoundsInfo.length; i++) {
                        if (szId === s_aSounds[s_aSoundsInfo[i].ingamename]._sounds[0]._id) {
                            s_aSounds[s_aSoundsInfo[i].ingamename].once('unlock', function() {
                                s_aSounds[s_aSoundsInfo[i].ingamename].play();
                            });
                            break;
                        }
                    }

                }
            });


        }, (bDelay ? 200 : 0));


    };

    this._loadImages = function() {
        s_oSpriteLibrary.init(this._onImagesLoaded, this._onAllImagesLoaded, this);

        for (var i = 0; i < 6; i++) {
            s_oSpriteLibrary.addSprite("player_1_" + i, "./sprites/players1/player_" + i + ".png");
        };
        for (var i = 1; i < 7; i++) {
            s_oSpriteLibrary.addSprite("dice_" + i, "./sprites/dice_" + i + ".png");
        };
        for (var i = 0; i < LADDERS_SQUARES.length; i++) {
            s_oSpriteLibrary.addSprite("ladder_" + LADDERS_SQUARES[i], "./sprites/ladders/ladder_" + +LADDERS_SQUARES[i] + ".png");
        };
        for (var i = 0; i < OBSTACLES_SQUARES.length; i++) {
            s_oSpriteLibrary.addSprite("snake_" + OBSTACLES_SQUARES[i], "./sprites/snakes/snake_" + +OBSTACLES_SQUARES[i] + ".png");
            s_oSpriteLibrary.addSprite("chute_" + OBSTACLES_SQUARES[i], "./sprites/chutes/chute_" + +OBSTACLES_SQUARES[i] + ".png");
        };
        for (var i = 0; i < 2; i++) {
            s_oSpriteLibrary.addSprite("but_mode" + i, "./sprites/but_mode" + i + ".png");
            s_oSpriteLibrary.addSprite("bg_game" + i, "./sprites/bg_game" + i + ".jpg");
            s_oSpriteLibrary.addSprite("turns" + i, "./sprites/turns" + i + ".png");
            s_oSpriteLibrary.addSprite("playerbig_" + i, "./sprites/playerbig_" + i + ".png");
            s_oSpriteLibrary.addSprite("but_play" + i, "./sprites/but_play" + i + ".png");
        };

        s_oSpriteLibrary.addSprite("logo_menu", "./sprites/logo_menu.png");
        s_oSpriteLibrary.addSprite("but_play", "./sprites/but_play.png");
        s_oSpriteLibrary.addSprite("but_dice", "./sprites/but_dice.png");
        s_oSpriteLibrary.addSprite("but_exit", "./sprites/but_exit.png");
        s_oSpriteLibrary.addSprite("but_settings", "./sprites/but_settings.png");
        s_oSpriteLibrary.addSprite("but_help", "./sprites/but_help.png");
        s_oSpriteLibrary.addSprite("but_info", "./sprites/but_info.png");
        s_oSpriteLibrary.addSprite("but_continue", "./sprites/but_skip_small.png");
        s_oSpriteLibrary.addSprite("but_fullscreen", "./sprites/but_fullscreen.png");
        s_oSpriteLibrary.addSprite("but_yes", "./sprites/but_yes.png");
        s_oSpriteLibrary.addSprite("but_no", "./sprites/but_no.png");
        s_oSpriteLibrary.addSprite("but_skip_small", "./sprites/but_skip_small.png");
        s_oSpriteLibrary.addSprite("bg_menu", "./sprites/bg_menu.jpg");
        s_oSpriteLibrary.addSprite("msg_box", "./sprites/msg_box.png");
        s_oSpriteLibrary.addSprite("bg_help", "./sprites/bg_help.png");
        s_oSpriteLibrary.addSprite("audio_icon", "./sprites/audio_icon.png");
        s_oSpriteLibrary.addSprite("but_home", "./sprites/but_home.png");
        s_oSpriteLibrary.addSprite("but_check", "./sprites/but_check.png");
        s_oSpriteLibrary.addSprite("but_restart", "./sprites/but_restart.png");
        s_oSpriteLibrary.addSprite("logo_ctl", "./sprites/logo_ctl.png");
        s_oSpriteLibrary.addSprite("launch_dice", "./sprites/launch_dices.png");
        s_oSpriteLibrary.addSprite("player_shadow", "./sprites/player_shadow.png");
        s_oSpriteLibrary.addSprite("turn_panel", "./sprites/turn_panel.png");
        s_oSpriteLibrary.addSprite("arrow", "./sprites/arrow.png");
        s_oSpriteLibrary.addSprite("help_ladder_ch", "./sprites/help_ladder_ch.png");
        s_oSpriteLibrary.addSprite("help_ladder_sn", "./sprites/help_ladder_sn.png");
        s_oSpriteLibrary.addSprite("help_snake", "./sprites/help_snake.png");
        s_oSpriteLibrary.addSprite("help_chute", "./sprites/help_chute.png");
        s_oSpriteLibrary.addSprite("help_ladder_anim_sn", "./sprites/help_ladder_anim_sn.png");
        s_oSpriteLibrary.addSprite("help_ladder_anim_ch", "./sprites/help_ladder_anim_ch.png");
        s_oSpriteLibrary.addSprite("help_chute_anim", "./sprites/help_chute_anim.png");
        s_oSpriteLibrary.addSprite("players_0", "./sprites/players_0.png");
        s_oSpriteLibrary.addSprite("vs_man_panel", "./sprites/vs_man_panel.png");
        s_oSpriteLibrary.addSprite("vs_pc_panel", "./sprites/vs_pc_panel.png");

        RESOURCE_TO_LOAD += s_oSpriteLibrary.getNumSprites();
        s_oSpriteLibrary.loadSprites();
    };

    this._onImagesLoaded = function() {
        _iCurResource++;
        var iPerc = Math.floor(_iCurResource / RESOURCE_TO_LOAD * 100);

        PokiSDK.gameLoadingProgress({
            percentageDone: _iCurResource / RESOURCE_TO_LOAD
        });

        _oPreloader.refreshLoader(iPerc);
    };

    this._onAllImagesLoaded = function() {

    };

    this.onAllPreloaderImagesLoaded = function() {
        this._loadImages();
    };

    this.preloaderReady = function() {
        PokiSDK.gameLoadingStart();

        this._loadImages();

        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            this._initSounds();
        }

        _bUpdate = true;
    };

    this._onRemovePreloader = function() {
        PokiSDK.gameLoadingFinished();

        try {
            saveItem("ls_available", "ok");
        } catch (evt) {
            // localStorage not defined
            s_bStorageAvailable = false;
        }

        _oPreloader.unload();

        s_oSoundtrack = playSound('soundtrack', 1, true);

        this.gotoMenu();
    };

    this.pokiShowCommercial = function(oCb) {
        s_oMain.stopUpdate();
        PokiSDK.commercialBreak().then(
            () => {
                //console.log("Commercial Break finished");
                s_oMain.startUpdate();
                if (oCb) {
                    oCb();
                }
            }
        );
    };

    this.gotoMenu = function() {
        _oMenu = new CMenu();
        _iState = STATE_MENU;
    };

    this.gotoModeChoose = function() {
        _oModeChoose = new CModeChoose();
        _iState = STATE_MENU;
    };

    this.gotoModeSelection = function(iMode) {
        _oModeSelection = new CModeSelection(iMode);
        _iState = STATE_MENU;
    };

    this.gotoPlayersChoose = function(iMode, iModality) {
        s_iModeGame = iMode;
        _oPlayersChoose = new CPlayersChoose(iModality);
        _iState = STATE_MENU;
    };

    this.gotoColourChoose = function(iPlayers, iModality) {
        _oColourChoose = new CColourChoose(iPlayers, iModality);
        _iState = STATE_MENU;
    };

    this.gotoGame = function(iPlayers, iColour, iModality, aPlayerColors) {
        _oGame = new CGame(iPlayers, iColour, iModality, aPlayerColors);
        _iState = STATE_GAME;
    };

    this.gotoHelp = function() {
        _oHelp = new CHelp();
        _iState = STATE_HELP;
    };

    this.stopUpdate = function() {
        _bUpdate = false;
        createjs.Ticker.paused = true;
        $("#block_game").css("display", "block");
        if (s_bAudioActive) {
            Howler.mute(true);
        }
    };

    this.startUpdate = function() {
        s_iPrevTime = new Date().getTime();
        _bUpdate = true;
        createjs.Ticker.paused = false;
        $("#block_game").css("display", "none");

        if (s_bAudioActive) {
            Howler.mute(false);
        }
    };

    this._update = function(event) {
        if (_bUpdate === false) {
            return;
        }
        var iCurTime = new Date().getTime();
        s_iTimeElaps = iCurTime - s_iPrevTime;
        s_iCntTime += s_iTimeElaps;
        s_iCntFps++;
        s_iPrevTime = iCurTime;

        if (s_iCntTime >= 1000) {
            s_iCurFps = s_iCntFps;
            s_iCntTime -= 1000;
            s_iCntFps = 0;
        }

        if (_iState === STATE_GAME) {
            _oGame.update();
        }

        s_oStage.update(event);

    };

    s_oMain = this;

    _oData = oData;
    ENABLE_FULLSCREEN = false;
    ENABLE_CHECK_ORIENTATION = false;
    PERFECT_SCORE = oData.perfect_score;

    this.initContainer();
}

var s_bMobile;
var s_bAudioActive = false;
var s_iCntTime = 0;
var s_bFullscreen = false;
var s_iTimeElaps = 0;
var s_iPrevTime = 0;
var s_iCntFps = 0;
var s_iCurFps = 0;
var s_oPhysicsController;
var s_oAdsLevel = 1;

var s_oDrawLayer;
var s_oStage;
var s_oScrollStage;
var s_oMain;
var s_oSpriteLibrary;
var s_oSoundTrack;
var s_aSoundsInfo;
var s_aSounds;
var s_bStorageAvailable = true;
var s_aGamesWon = 0;
var s_aGamesPlayed = 0;
var s_iModeGame;
var s_bPokiFirstTimePlay = true;