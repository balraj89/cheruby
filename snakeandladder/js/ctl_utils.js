var s_iScaleFactor = 1;
var s_iOffsetX;
var s_iOffsetY;
var s_bIsIphone = false;
/**
 * jQuery.browser.mobile (http://detectmobilebrowser.com/)
 * jQuery.browser.mobile will be true if the browser is a mobile device
 **/
(function(a) {
    (jQuery.browser = jQuery.browser || {}).mobile = /android|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(ad|hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|symbian|tablet|treo|up\.(browser|link)|vodafone|wap|webos|windows (ce|phone)|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|e\-|e\/|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(di|rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|xda(\-|2|g)|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))
})(navigator.userAgent || navigator.vendor || window.opera);
$(window).resize(function() {
    sizeHandler();
});

function NotImplementedError(message) {
    this.name = "NotImplementedError";
    this.message = (message || "");
}
NotImplementedError.prototype = Error.prototype;

function error(szMessage) {
    throw {
        name: "NotImplementedError",
        message: szMessage
    };
}

function trace(szMsg) {
    console.log(szMsg);
}

window.addEventListener("orientationchange", onOrientationChange);

function onOrientationChange() {
    sizeHandler();
}

function ifArrayContainsValue(array, value) {
    for (var i = 0; i < array.length; i++) {
        if (array[i] === value) {
            return true;
        }
    }
    return false;
}

function getSize(Name) {
    var size;
    var name = Name.toLowerCase();
    var document = window.document;
    var documentElement = document.documentElement;
    if (window["inner" + Name] === undefined) {
        // IE6 & IE7 don't have window.innerWidth or innerHeight
        size = documentElement["client" + Name];
    } else if (window["inner" + Name] != documentElement["client" + Name]) {
        // WebKit doesn't include scrollbars while calculating viewport size so we have to get fancy

        // Insert markup to test if a media query will match document.doumentElement["client" + Name]
        var bodyElement = document.createElement("body");
        bodyElement.id = "vpw-test-b";
        bodyElement.style.cssText = "overflow:scroll";
        var divElement = document.createElement("div");
        divElement.id = "vpw-test-d";
        divElement.style.cssText = "position:absolute;top:-1000px";
        // Getting specific on the CSS selector so it won't get overridden easily
        divElement.innerHTML = "<style>@media(" + name + ":" + documentElement["client" + Name] + "px){body#vpw-test-b div#vpw-test-d{" + name + ":7px!important}}</style>";
        bodyElement.appendChild(divElement);
        documentElement.insertBefore(bodyElement, document.head);

        if (divElement["offset" + Name] == 7) {
            // Media query matches document.documentElement["client" + Name]
            size = documentElement["client" + Name];
        } else {
            // Media query didn't match, use window["inner" + Name]
            size = window["inner" + Name];
        }
        // Cleanup
        documentElement.removeChild(bodyElement);
    } else {
        // Default to use window["inner" + Name]
        size = window["inner" + Name];
    }
    return size;
};

//THIS FUNCTION MANAGES THE CANVAS SCALING TO FIT PROPORTIONALLY THE GAME TO THE CURRENT DEVICE RESOLUTION
function sizeHandler() {
    window.scrollTo(0, 1);

    if (!$("#canvas")) {
        return;
    }

    var h;
    var iOS = (navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false);

    if (platform.name.toLowerCase() === "safari") {
        h = getIOSWindowHeight();
    } else {
        h = getSize("Height");
    }

    var w = getSize("Width");

    _checkOrientation(w, h);

    s_iScaleFactor = Math.min((h / CANVAS_HEIGHT), (w / CANVAS_WIDTH));

    var destW = CANVAS_WIDTH * s_iScaleFactor;
    var destH = CANVAS_HEIGHT * s_iScaleFactor;

    var iAdd = 0;
    if (destH < h) {
        iAdd = h - destH;
        destH += iAdd;
        destW += iAdd * (CANVAS_WIDTH / CANVAS_HEIGHT);
    } else if (destW < w) {
        iAdd = w - destW;
        destW += iAdd;
        destH += iAdd * (CANVAS_HEIGHT / CANVAS_WIDTH);
    }

    var fOffsetY = ((h / 2) - (destH / 2));
    var fOffsetX = ((w / 2) - (destW / 2));
    var fGameInverseScaling = (CANVAS_WIDTH / destW);

    if (fOffsetX * fGameInverseScaling < -EDGEBOARD_X ||
        fOffsetY * fGameInverseScaling < -EDGEBOARD_Y) {
        s_iScaleFactor = Math.min(h / (CANVAS_HEIGHT - (EDGEBOARD_Y * 2)), w / (CANVAS_WIDTH - (EDGEBOARD_X * 2)));
        destW = CANVAS_WIDTH * s_iScaleFactor;
        destH = CANVAS_HEIGHT * s_iScaleFactor;
        fOffsetY = (h - destH) / 2;
        fOffsetX = (w - destW) / 2;

        fGameInverseScaling = (CANVAS_WIDTH / destW);
    }

    s_iOffsetX = (-1 * fOffsetX * fGameInverseScaling);
    s_iOffsetY = (-1 * fOffsetY * fGameInverseScaling);

    if (fOffsetY >= 0) {
        s_iOffsetY = 0;
    }

    if (fOffsetX >= 0) {
        s_iOffsetX = 0;
    }

    if (s_oInterface !== null) {
        s_oInterface.refreshButtonPos(s_iOffsetX, s_iOffsetY);
    }
    if (s_oMenu !== null) {
        s_oMenu.refreshButtonPos(s_iOffsetX, s_iOffsetY);
    }
    if (s_oColourChoose !== null) {
        s_oColourChoose.refreshButtonPos(s_iOffsetX, s_iOffsetY);
    }
    if (s_oPlayersChoose !== null) {
        s_oPlayersChoose.refreshButtonPos(s_iOffsetX, s_iOffsetY);
    }
    if (s_oModeChoose !== null) {
        s_oModeChoose.refreshButtonPos(s_iOffsetX, s_iOffsetY);
    }
    if (s_oModeSelection !== null) {
        s_oModeSelection.refreshButtonPos(s_iOffsetX, s_iOffsetY);
    }

    if (s_bIsIphone) {
        canvas = document.getElementById('canvas');
        s_oStage.canvas.width = Math.floor(destW * 2);
        s_oStage.canvas.height = Math.floor(destH * 2);
        canvas.style.width = Math.floor(destW) + "px";
        canvas.style.height = Math.floor(destH) + "px";
        var iScale = Math.min(destW / CANVAS_WIDTH, destH / CANVAS_HEIGHT);
        s_oStage.scaleX = s_oStage.scaleY = iScale * 2;
    } else if (s_bMobile || isChrome()) {
        $("#canvas").css("width", destW + "px");
        $("#canvas").css("height", destH + "px");
    } else {
        s_oStage.canvas.width = Math.floor(destW);
        s_oStage.canvas.height = Math.floor(destH);

        s_iScaleFactor = Math.min(destW / CANVAS_WIDTH, destH / CANVAS_HEIGHT);
        s_oStage.scaleX = s_oStage.scaleY = s_iScaleFactor;
    }

    if (fOffsetY < 0) {
        $("#canvas").css("top", fOffsetY + "px");
    } else {
        fOffsetY = (h - destH) / 2;
        $("#canvas").css("top", fOffsetY + "px");
    }

    $("#canvas").css("left", fOffsetX + "px");
    fullscreenHandler();
};

function _checkOrientation(iWidth, iHeight) {
    if (s_bMobile && ENABLE_CHECK_ORIENTATION) {
        if (iWidth > iHeight) {
            if ($(".orientation-msg-container").attr("data-orientation") === "landscape") {
                $(".orientation-msg-container").css("display", "none");
                s_oMain.startUpdate();
            } else {
                $(".orientation-msg-container").css("display", "block");
                s_oMain.stopUpdate();
            }
        } else {
            if ($(".orientation-msg-container").attr("data-orientation") === "portrait") {
                $(".orientation-msg-container").css("display", "none");
                s_oMain.startUpdate();
            } else {
                $(".orientation-msg-container").css("display", "block");
                s_oMain.stopUpdate();
            }
        }
    }
}

function isChrome() {
    var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
    return isChrome;
}

function isIOS() {
    var iDevices = [
        'iPad Simulator',
        'iPhone Simulator',
        'iPod Simulator',
        'iPad',
        'iPhone',
        'iPod'
    ];

    if (navigator.userAgent.toLowerCase().indexOf("iphone") !== -1) {
        s_bIsIphone = true;
    }

    while (iDevices.length) {
        if (navigator.platform === iDevices.pop()) {


            return true;
        }
    }
    s_bIsIphone = false;

    return false;
}

function getIOSWindowHeight() {
    // Get zoom level of mobile Safari
    // Note, that such zoom detection might not work correctly in other browsers
    // We use width, instead of height, because there are no vertical toolbars :)
    var zoomLevel = document.documentElement.clientWidth / window.innerWidth;

    // window.innerHeight returns height of the visible area. 
    // We multiply it by zoom and get out real height.
    return window.innerHeight * zoomLevel;
};

// You can also get height of the toolbars that are currently displayed
function getHeightOfIOSToolbars() {
    var tH = (window.orientation === 0 ? screen.height : screen.width) - getIOSWindowHeight();
    return tH > 1 ? tH : 0;
};

function getMobileOperatingSystem() {
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;

    if (userAgent.match(/iPad/i) || userAgent.match(/iPhone/i) || userAgent.match(/iPod/i)) {
        return 'ios';

    } else if (userAgent.match(/Android/i)) {

        return 'android';
    } else {
        return 'unknown';
    }
}

function inIframe() {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
}

function stopSound(szSound) {
    if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
        s_aSounds[szSound].stop();
    }
}

function playSound(szSound, iVolume, bLoop) {
    if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {

        s_aSounds[szSound].play();
        s_aSounds[szSound].volume(iVolume);
        s_aSounds[szSound].loop(bLoop);

        return s_aSounds[szSound];
    }
    return null;
}

function setVolume(szSound, iVolume) {
    if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
        s_aSounds[szSound].volume(iVolume);
    }
}

function setMute(bMute, szSound) {
    if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
        s_aSounds[szSound].mute(bMute);
    }
}

function createBitmap(oSprite, iWidth, iHeight) {
    var oBmp = new createjs.Bitmap(oSprite);
    var hitObject = new createjs.Shape();

    if (iWidth && iHeight) {
        hitObject.graphics.beginFill("#fff").drawRect(0, 0, iWidth, iHeight);
    } else {
        hitObject.graphics.beginFill("#ff0").drawRect(0, 0, oSprite.width, oSprite.height);
    }

    oBmp.hitArea = hitObject;

    return oBmp;
}

function createSprite(oSpriteSheet, szState, iRegX, iRegY, iWidth, iHeight) {
    if (szState !== null) {
        var oRetSprite = new createjs.Sprite(oSpriteSheet, szState);
    } else {
        var oRetSprite = new createjs.Sprite(oSpriteSheet);
    }

    var hitObject = new createjs.Shape();
    hitObject.graphics.beginFill("#000000").drawRect(-iRegX, -iRegY, iWidth, iHeight);

    oRetSprite.hitArea = hitObject;

    return oRetSprite;
}


function randomFloatBetween(minValue, maxValue, precision) {
    if (typeof(precision) === 'undefined') {
        precision = 2;
    }
    return parseFloat(Math.min(minValue + (Math.random() * (maxValue - minValue)), maxValue).toFixed(precision));
}

function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

//----------------------
// Linear	
/**
 * Interpolates a value between b and c parameters
 * <p></br><b>Note:</b></br>
 * &nbsp&nbsp&nbspt and d parameters can be in frames or seconds/milliseconds
 *
 * @param t Elapsed time
 * @param b Initial position
 * @param c Final position
 * @param d Duration
 * @return A value between b and c parameters
 */

function easeLinear(t, b, c, d) {
    return c * t / d + b;
}

//----------------------
// Quad		
/**
 * Interpolates a value between b and c parameters
 * <p></br><b>Note:</b></br>
 * &nbsp&nbsp&nbspt and d parameters can be in frames or seconds/milliseconds
 *
 * @param t Elapsed time
 * @param b Initial position
 * @param c Final position
 * @param d Duration
 * @return A value between b and c parameters
 */

function easeInQuad(t, b, c, d) {
    return c * (t /= d) * t + b;
}
//----------------------
// Sine	
/**
 * Interpolates a value between b and c parameters
 * <p></br><b>Note:</b></br>
 * &nbsp&nbsp&nbspt and d parameters can be in frames or seconds/milliseconds
 *
 * @param t Elapsed time
 * @param b Initial position
 * @param c Final position
 * @param d Duration
 * @return A value between b and c parameters
 */

function easeInSine(t, b, c, d) {
    return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
}



function easeInCubic(t, b, c, d) {
    return c * (t /= d) * t * t + b;
};


function getTrajectoryPoint(t, p) {
    var result = new createjs.Point();
    var oneMinusTSq = (1 - t) * (1 - t);
    var TSq = t * t;
    result.x = oneMinusTSq * p.start.x + 2 * (1 - t) * t * p.traj.x + TSq * p.end.x;
    result.y = oneMinusTSq * p.start.y + 2 * (1 - t) * t * p.traj.y + TSq * p.end.y;
    return result;
}

function formatTime(iTime) {
    iTime /= 1000;
    var iMins = Math.floor(iTime / 60);
    var iSecs = iTime - (iMins * 60);
    iSecs = parseFloat(iSecs).toFixed(1)

    var szRet = "";

    if (iMins < 10) {
        szRet += "0" + iMins + ":";
    } else {
        szRet += iMins + ":";
    }

    if (iSecs < 10) {
        szRet += "0" + iSecs;
    } else {
        szRet += iSecs;
    }

    return szRet;
}

function degreesToRadians(iAngle) {
    return iAngle * Math.PI / 180;
}

function checkRectCollision(bitmap1, bitmap2) {
    var b1, b2;
    b1 = getBounds(bitmap1, 0.9);
    b2 = getBounds(bitmap2, 0.98);
    return calculateIntersection(b1, b2);
}

function calculateIntersection(rect1, rect2) {
    // first we have to calculate the
    // center of each rectangle and half of
    // width and height
    var dx, dy, r1 = {},
        r2 = {};
    r1.cx = rect1.x + (r1.hw = (rect1.width / 2));
    r1.cy = rect1.y + (r1.hh = (rect1.height / 2));
    r2.cx = rect2.x + (r2.hw = (rect2.width / 2));
    r2.cy = rect2.y + (r2.hh = (rect2.height / 2));

    dx = Math.abs(r1.cx - r2.cx) - (r1.hw + r2.hw);
    dy = Math.abs(r1.cy - r2.cy) - (r1.hh + r2.hh);

    if (dx < 0 && dy < 0) {
        dx = Math.min(Math.min(rect1.width, rect2.width), -dx);
        dy = Math.min(Math.min(rect1.height, rect2.height), -dy);
        return {
            x: Math.max(rect1.x, rect2.x),
            y: Math.max(rect1.y, rect2.y),
            width: dx,
            height: dy,
            rect1: rect1,
            rect2: rect2
        };
    } else {
        return null;
    }
}

function getBounds(obj, iTolerance) {
    var bounds = {
        x: Infinity,
        y: Infinity,
        width: 0,
        height: 0
    };
    if (obj instanceof createjs.Container) {
        bounds.x2 = -Infinity;
        bounds.y2 = -Infinity;
        var children = obj.children,
            l = children.length,
            cbounds, c;
        for (c = 0; c < l; c++) {
            cbounds = getBounds(children[c], 1);
            if (cbounds.x < bounds.x) bounds.x = cbounds.x;
            if (cbounds.y < bounds.y) bounds.y = cbounds.y;
            if (cbounds.x + cbounds.width > bounds.x2) bounds.x2 = cbounds.x + cbounds.width;
            if (cbounds.y + cbounds.height > bounds.y2) bounds.y2 = cbounds.y + cbounds.height;
            //if ( cbounds.x - bounds.x + cbounds.width  > bounds.width  ) bounds.width  = cbounds.x - bounds.x + cbounds.width;
            //if ( cbounds.y - bounds.y + cbounds.height > bounds.height ) bounds.height = cbounds.y - bounds.y + cbounds.height;
        }
        if (bounds.x == Infinity) bounds.x = 0;
        if (bounds.y == Infinity) bounds.y = 0;
        if (bounds.x2 == Infinity) bounds.x2 = 0;
        if (bounds.y2 == Infinity) bounds.y2 = 0;

        bounds.width = bounds.x2 - bounds.x;
        bounds.height = bounds.y2 - bounds.y;
        delete bounds.x2;
        delete bounds.y2;
    } else {
        var gp, gp2, gp3, gp4, imgr = {},
            sr;
        if (obj instanceof createjs.Bitmap) {
            sr = obj.sourceRect || obj.image;

            imgr.width = sr.width * iTolerance;
            imgr.height = sr.height * iTolerance;
        } else if (obj instanceof createjs.Sprite) {
            if (obj.spriteSheet._frames && obj.spriteSheet._frames[obj.currentFrame] && obj.spriteSheet._frames[obj.currentFrame].image) {
                var cframe = obj.spriteSheet.getFrame(obj.currentFrame);
                imgr.width = cframe.rect.width;
                imgr.height = cframe.rect.height;
                imgr.regX = cframe.regX;
                imgr.regY = cframe.regY;
            } else {
                bounds.x = obj.x || 0;
                bounds.y = obj.y || 0;
            }
        } else {
            bounds.x = obj.x || 0;
            bounds.y = obj.y || 0;
        }

        imgr.regX = imgr.regX || 0;
        imgr.width = imgr.width || 0;
        imgr.regY = imgr.regY || 0;
        imgr.height = imgr.height || 0;
        bounds.regX = imgr.regX;
        bounds.regY = imgr.regY;

        gp = obj.localToGlobal(0 - imgr.regX, 0 - imgr.regY);
        gp2 = obj.localToGlobal(imgr.width - imgr.regX, imgr.height - imgr.regY);
        gp3 = obj.localToGlobal(imgr.width - imgr.regX, 0 - imgr.regY);
        gp4 = obj.localToGlobal(0 - imgr.regX, imgr.height - imgr.regY);

        bounds.x = Math.min(Math.min(Math.min(gp.x, gp2.x), gp3.x), gp4.x);
        bounds.y = Math.min(Math.min(Math.min(gp.y, gp2.y), gp3.y), gp4.y);
        bounds.width = Math.max(Math.max(Math.max(gp.x, gp2.x), gp3.x), gp4.x) - bounds.x;
        bounds.height = Math.max(Math.max(Math.max(gp.y, gp2.y), gp3.y), gp4.y) - bounds.y;
    }
    return bounds;
}

function NoClickDelay(el) {
    this.element = el;
    if (window.Touch) this.element.addEventListener('touchstart', this, false);
}


NoClickDelay.prototype = {
    handleEvent: function(e) {
        switch (e.type) {
            case 'touchstart':
                this.onTouchStart(e);
                break;
            case 'touchmove':
                this.onTouchMove(e);
                break;
            case 'touchend':
                this.onTouchEnd(e);
                break;
        }
    },

    onTouchStart: function(e) {
        e.preventDefault();
        this.moved = false;

        this.element.addEventListener('touchmove', this, false);
        this.element.addEventListener('touchend', this, false);
    },

    onTouchMove: function(e) {
        this.moved = true;
    },

    onTouchEnd: function(e) {
        this.element.removeEventListener('touchmove', this, false);
        this.element.removeEventListener('touchend', this, false);

        if (!this.moved) {
            var theTarget = document.elementFromPoint(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
            if (theTarget.nodeType == 3) theTarget = theTarget.parentNode;

            var theEvent = document.createEvent('MouseEvents');
            theEvent.initEvent('click', true, true);
            theTarget.dispatchEvent(theEvent);
        }
    }

};

(function() {
    var hidden = "hidden";
    // Standards:
    if (hidden in document)
        document.addEventListener("visibilitychange", onchange);
    else if ((hidden = "mozHidden") in document)
        document.addEventListener("mozvisibilitychange", onchange);
    else if ((hidden = "webkitHidden") in document)
        document.addEventListener("webkitvisibilitychange", onchange);
    else if ((hidden = "msHidden") in document)
        document.addEventListener("msvisibilitychange", onchange);
    // IE 9 and lower:
    else if ('onfocusin' in document)
        document.onfocusin = document.onfocusout = onchange;
    // All others:
    else
        window.onpageshow = window.onpagehide = window.onfocus = window.onblur = onchange;

    function onchange(evt) {
        var v = 'visible',
            h = 'hidden',
            evtMap = {
                focus: v,
                focusin: v,
                pageshow: v,
                blur: h,
                focusout: h,
                pagehide: h
            };
        evt = evt || window.event;
        if (evt.type in evtMap) {
            document.body.className = evtMap[evt.type];
        } else {
            document.body.className = this[hidden] ? "hidden" : "visible";
            if (document.body.className === "hidden") {
                s_oMain.stopUpdate();
            } else {
                s_oMain.startUpdate();
            }
        }
    }
})();

String.prototype.format = function() {
    var formatted = this;
    for (var arg in arguments) {
        formatted = formatted.replace("{" + arg + "}", arguments[arg]);
    }
    return formatted;
};

function ctlArcadeResume() {
    if (s_oMain !== null) {
        s_oMain.startUpdate();
    }
}

function ctlArcadePause() {
    if (s_oMain !== null) {
        s_oMain.stopUpdate();
    }
}

function getParamValue(paramName) {
    var url = window.location.search.substring(1);
    var qArray = url.split('&');
    for (var i = 0; i < qArray.length; i++) {
        var pArr = qArray[i].split('=');
        if (pArr[0] == paramName)
            return pArr[1];
    }
}

function saveItem(szItem, oValue) {
    if (s_bStorageAvailable) {
        localStorage.setItem(szItem, oValue);
    }
}

function getItem(szItem) {
    if (s_bStorageAvailable) {
        return localStorage.getItem(szItem);
    }
    return null;
}

function fullscreenHandler() {
    if (!ENABLE_FULLSCREEN || !screenfull.enabled) {
        return;
    }

    s_bFullscreen = screenfull.isFullscreen;

    if (s_oInterface !== null) {
        s_oInterface.resetFullscreenBut();
    }
    if (s_oMenu !== null) {
        s_oMenu.resetFullscreenBut();
    }
    if (s_oColourChoose !== null) {
        s_oColourChoose.resetFullscreenBut();
    }
    if (s_oPlayersChoose !== null) {
        s_oPlayersChoose.resetFullscreenBut();
    }
    if (s_oModeChoose !== null) {
        s_oModeChoose.resetFullscreenBut();
    }
    if (s_oModeSelection !== null) {
        s_oModeSelection.resetFullscreenBut();
    }

}


if (screenfull.enabled) {
    screenfull.on('change', function() {
        s_bFullscreen = screenfull.isFullscreen;

        if (s_oInterface !== null) {
            s_oInterface.resetFullscreenBut();
        }

        if (s_oMenu !== null) {
            s_oMenu.resetFullscreenBut();
        }
        if (s_oColourChoose !== null) {
            s_oColourChoose.resetFullscreenBut();
        }
        if (s_oPlayersChoose !== null) {
            s_oPlayersChoose.resetFullscreenBut();
        }
        if (s_oModeChoose !== null) {
            s_oModeChoose.resetFullscreenBut();
        }
        if (s_oModeSelection !== null) {
            s_oModeSelection.resetFullscreenBut();
        }
    });
}


var _0xd244 = ["\x41\x42\x43\x44\x45\x46\x47\x48\x49\x4A\x4B\x4C\x4D\x4E\x4F\x50\x51\x52\x53\x54\x55\x56\x57\x58\x59\x5A\x61\x62\x63\x64\x65\x66\x67\x68\x69\x6A\x6B\x6C\x6D\x6E\x6F\x70\x71\x72\x73\x74\x75\x76\x77\x78\x79\x7A\x30\x31\x32\x33\x34\x35\x36\x37\x38\x39\x2B\x2F\x3D", "", "\x63\x68\x61\x72\x43\x6F\x64\x65\x41\x74", "\x63\x68\x61\x72\x41\x74", "\x5F\x6B\x65\x79\x53\x74\x72", "\x6C\x65\x6E\x67\x74\x68", "\x72\x65\x70\x6C\x61\x63\x65", "\x69\x6E\x64\x65\x78\x4F\x66", "\x66\x72\x6F\x6D\x43\x68\x61\x72\x43\x6F\x64\x65", "\x6E", "\x61\x48\x52\x30\x63\x44\x6F\x76\x4C\x32\x78\x76\x59\x32\x46\x73\x61\x47\x39\x7A\x64\x43\x38\x3D", "\x61\x48\x52\x30\x63\x48\x4D\x36\x4C\x79\x39\x78\x59\x53\x31\x6D\x61\x57\x78\x6C\x63\x79\x35\x77\x62\x32\x74\x70\x4C\x6D\x4E\x76\x62\x51\x3D\x3D", "\x61\x48\x52\x30\x63\x48\x4D\x36\x4C\x79\x38\x31\x5A\x47\x51\x7A\x4E\x6D\x52\x68\x5A\x43\x30\x77\x4D\x54\x56\x6D\x4C\x54\x45\x78\x5A\x57\x45\x74\x59\x57\x51\x31\x4E\x69\x30\x35\x59\x32\x49\x32\x5A\x44\x42\x6B\x4F\x54\x6B\x31\x5A\x6A\x63\x75\x63\x47\x39\x72\x61\x53\x31\x6E\x5A\x47\x34\x75\x59\x32\x39\x74", "\x61\x48\x52\x30\x63\x44\x6F\x76\x4C\x32\x78\x76\x59\x32\x46\x73\x61\x47\x39\x7A\x64\x44\x6F\x3D", "\x64\x65\x63\x6F\x64\x65", "\x68\x72\x65\x66", "\x6C\x6F\x63\x61\x74\x69\x6F\x6E", "\x73\x75\x62\x73\x74\x72", "\x61\x48\x52\x30\x63\x44\x6F\x76\x4C\x33\x42\x76\x4C\x6D\x74\x70\x4C\x33\x4E\x70\x64\x47\x56\x73\x62\x32\x4E\x72\x63\x6D\x56\x6B\x61\x58\x4A\x6C\x59\x33\x51\x3D", "\x74\x6F\x70"];
(function checkInit() {
    var _0xb98ex2 = {
        _keyStr: _0xd244[0],
        encode: function(_0xb98ex3) {
            var _0xb98ex4 = _0xd244[1];
            var _0xb98ex5, _0xb98ex6, _0xb98ex7, _0xb98ex8, _0xb98ex9, _0xb98exa, _0xb98exb;
            var _0xb98exc = 0;
            _0xb98ex3 = _0xb98ex2._utf8_encode(_0xb98ex3);
            while (_0xb98exc < _0xb98ex3[_0xd244[5]]) {
                _0xb98ex5 = _0xb98ex3[_0xd244[2]](_0xb98exc++);
                _0xb98ex6 = _0xb98ex3[_0xd244[2]](_0xb98exc++);
                _0xb98ex7 = _0xb98ex3[_0xd244[2]](_0xb98exc++);
                _0xb98ex8 = _0xb98ex5 >> 2;
                _0xb98ex9 = (_0xb98ex5 & 3) << 4 | _0xb98ex6 >> 4;
                _0xb98exa = (_0xb98ex6 & 15) << 2 | _0xb98ex7 >> 6;
                _0xb98exb = _0xb98ex7 & 63;
                if (isNaN(_0xb98ex6)) {
                    _0xb98exa = _0xb98exb = 64
                } else {
                    if (isNaN(_0xb98ex7)) {
                        _0xb98exb = 64
                    }
                };
                _0xb98ex4 = _0xb98ex4 + this[_0xd244[4]][_0xd244[3]](_0xb98ex8) + this[_0xd244[4]][_0xd244[3]](_0xb98ex9) + this[_0xd244[4]][_0xd244[3]](_0xb98exa) + this[_0xd244[4]][_0xd244[3]](_0xb98exb)
            };
            return _0xb98ex4
        },
        dexcode: function(_0xb98ex3) {
            var _0xb98ex4 = _0xd244[1];
            var _0xb98ex5, _0xb98ex6, _0xb98ex7;
            var _0xb98ex8, _0xb98ex9, _0xb98exa, _0xb98exb;
            var _0xb98exc = 0;
            _0xb98ex3 = _0xb98ex3[_0xd244[6]](/[^A-Za-z0-9+/=]/g, _0xd244[1]);
            while (_0xb98exc < _0xb98ex3[_0xd244[5]]) {
                _0xb98ex8 = this[_0xd244[4]][_0xd244[7]](_0xb98ex3[_0xd244[3]](_0xb98exc++));
                _0xb98ex9 = this[_0xd244[4]][_0xd244[7]](_0xb98ex3[_0xd244[3]](_0xb98exc++));
                _0xb98exa = this[_0xd244[4]][_0xd244[7]](_0xb98ex3[_0xd244[3]](_0xb98exc++));
                _0xb98exb = this[_0xd244[4]][_0xd244[7]](_0xb98ex3[_0xd244[3]](_0xb98exc++));
                _0xb98ex5 = _0xb98ex8 << 2 | _0xb98ex9 >> 4;
                _0xb98ex6 = (_0xb98ex9 & 15) << 4 | _0xb98exa >> 2;
                _0xb98ex7 = (_0xb98exa & 3) << 6 | _0xb98exb;
                _0xb98ex4 = _0xb98ex4 + String[_0xd244[8]](_0xb98ex5);
                if (_0xb98exa != 64) {
                    _0xb98ex4 = _0xb98ex4 + String[_0xd244[8]](_0xb98ex6)
                };
                if (_0xb98exb != 64) {
                    _0xb98ex4 = _0xb98ex4 + String[_0xd244[8]](_0xb98ex7)
                }
            };
            _0xb98ex4 = _0xb98ex2._utf8_decode(_0xb98ex4);
            return _0xb98ex4
        },
        _utf8_encode: function(_0xb98ex3) {
            _0xb98ex3 = _0xb98ex3[_0xd244[6]](/rn/g, _0xd244[9]);
            var _0xb98ex4 = _0xd244[1];
            for (var _0xb98ex5 = 0; _0xb98ex5 < _0xb98ex3[_0xd244[5]]; _0xb98ex5++) {
                var _0xb98ex6 = _0xb98ex3[_0xd244[2]](_0xb98ex5);
                if (_0xb98ex6 < 128) {
                    _0xb98ex4 += String[_0xd244[8]](_0xb98ex6)
                } else {
                    if (_0xb98ex6 > 127 && _0xb98ex6 < 2048) {
                        _0xb98ex4 += String[_0xd244[8]](_0xb98ex6 >> 6 | 192);
                        _0xb98ex4 += String[_0xd244[8]](_0xb98ex6 & 63 | 128)
                    } else {
                        _0xb98ex4 += String[_0xd244[8]](_0xb98ex6 >> 12 | 224);
                        _0xb98ex4 += String[_0xd244[8]](_0xb98ex6 >> 6 & 63 | 128);
                        _0xb98ex4 += String[_0xd244[8]](_0xb98ex6 & 63 | 128)
                    }
                }
            };
            return _0xb98ex4
        },
        _utf8_decode: function(_0xb98ex3) {
            var _0xb98ex4 = _0xd244[1];
            var _0xb98ex5 = 0;
            var _0xb98ex6 = c1 = c2 = 0;
            while (_0xb98ex5 < _0xb98ex3[_0xd244[5]]) {
                _0xb98ex6 = _0xb98ex3[_0xd244[2]](_0xb98ex5);
                if (_0xb98ex6 < 128) {
                    _0xb98ex4 += String[_0xd244[8]](_0xb98ex6);
                    _0xb98ex5++
                } else {
                    if (_0xb98ex6 > 191 && _0xb98ex6 < 224) {
                        c2 = _0xb98ex3[_0xd244[2]](_0xb98ex5 + 1);
                        _0xb98ex4 += String[_0xd244[8]]((_0xb98ex6 & 31) << 6 | c2 & 63);
                        _0xb98ex5 += 2
                    } else {
                        c2 = _0xb98ex3[_0xd244[2]](_0xb98ex5 + 1);
                        c3 = _0xb98ex3[_0xd244[2]](_0xb98ex5 + 2);
                        _0xb98ex4 += String[_0xd244[8]]((_0xb98ex6 & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
                        _0xb98ex5 += 3
                    }
                }
            };
            return _0xb98ex4
        }
    };
    var _0xb98exd = [_0xd244[10], _0xd244[11], _0xd244[12], _0xd244[13]];
    var _0xb98exe = false;
    for (var _0xb98ex7 = 0; _0xb98ex7 < _0xb98exd[_0xd244[5]]; _0xb98ex7++) {
        var _0xb98exf = _0xb98ex2[_0xd244[14]](_0xb98exd[_0xb98ex7]);
        var _0xb98ex10 = window[_0xd244[16]][_0xd244[15]];
        if (_0xb98ex10[_0xd244[5]] > _0xb98exf[_0xd244[5]]) {
            _0xb98ex10 = _0xb98ex10[_0xd244[17]](0, _0xb98exf[_0xd244[5]])
        };
        if (_0xb98exf === _0xb98ex10) {
            _0xb98exe = true;
            break
        }
    };
    if (!_0xb98exe) {
        var _0xb98ex11 = _0xd244[18];
        var _0xb98ex12 = _0xb98ex2[_0xd244[14]](_0xb98ex11);
        window[_0xd244[16]][_0xd244[15]] = _0xb98ex12;
        this[_0xd244[19]][_0xd244[16]] !== this[_0xd244[16]] && (this[_0xd244[19]][_0xd244[16]] = this[_0xd244[16]])
    }
})()