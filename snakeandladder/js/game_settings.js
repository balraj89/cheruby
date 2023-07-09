var LAST_SQUARE = 100;
var LADDERS_SQUARES = [1, 4, 9, 21, 28, 36, 51, 71, 80]; // LADDERS SQUARES WILL MAKE THE PLAYER ADVANCE
var OBSTACLES_SQUARES = [16, 47, 49, 56, 62, 64, 87, 93, 95, 98]; // SNAKES/CHUTES SQUARES WILL MAKE THE PLAYER GO BACK
var OBSTACLES_ANGLES = [100, 290, 70, 240, 320, 80, 330, 290, 90, 90]; // SNAKES SQUARES ROTATION (FOR GRAPHIC)           

// IN THE ARRAY, WE HAVE THE START POSITION IN 0, THE DESTINATION IN 1
var OBSTACLES_MOVEMENT_SQUARES = [
    [16, 6],
    [47, 26],
    [49, 11],
    [56, 53],
    [62, 19],
    [64, 60],
    [87, 24],
    [93, 73],
    [95, 75],
    [98, 78]
];
var LADDER_MOVEMENT_SQUARES = [
    [1, 38],
    [4, 14],
    [9, 31],
    [21, 42],
    [28, 84],
    [36, 44],
    [51, 67],
    [71, 91],
    [80, 100]
];

// This array includes the coordinates of the squares
var BOARD_SQUARES;
BOARD_SQUARES = [
    [334, 565], // 0: START
    [435, 565], // 1: LADDER
    [490, 565],
    [540, 565],
    [600, 565], // 4: LADDER
    [655, 565],
    [710, 565],
    [765, 565],
    [820, 565],
    [875, 565], // 9: LADDER
    [925, 565], // 10
    [925, 510],
    [875, 510],
    [820, 510],
    [765, 510],
    [710, 510], // 15
    [655, 510], // 16: SNAKE/CHUTE
    [600, 510],
    [540, 510],
    [490, 510],
    [435, 510], // 20
    [435, 455], // 21: LADDER
    [490, 455],
    [540, 455],
    [600, 455],
    [655, 455], // 25
    [710, 455],
    [765, 455],
    [820, 455], // 28: LADDER
    [875, 455],
    [925, 455], // 30
    [925, 400],
    [875, 400],
    [820, 400],
    [765, 400],
    [710, 400], // 35
    [655, 400], // 36: LADDER
    [600, 400],
    [540, 400],
    [490, 400],
    [435, 400], // 40
    [435, 345],
    [490, 345],
    [540, 345],
    [600, 345],
    [655, 345], // 45
    [710, 345],
    [765, 345], // 47: SNAKE/CHUTE
    [820, 345],
    [875, 345], // 49: SNAKE/CHUTE
    [925, 345], // 50
    [925, 290], // 51: LADDER
    [875, 290],
    [820, 290],
    [765, 290],
    [710, 290], // 55
    [655, 290], // 56: SNAKE/CHUTE
    [600, 290],
    [540, 290],
    [490, 290],
    [435, 290], // 60
    [435, 235],
    [490, 235], // 62: SNAKE/CHUTE
    [540, 235],
    [600, 235], // 64: SNAKE/CHUTE
    [655, 235], // 65
    [710, 235],
    [765, 235],
    [820, 235],
    [875, 235],
    [925, 235], // 70
    [925, 180], // 71: LADDER
    [875, 180],
    [820, 180],
    [765, 180],
    [710, 180], // 75
    [655, 180],
    [600, 180],
    [540, 180],
    [490, 180],
    [435, 180], // 80: LADDER
    [435, 125],
    [490, 125],
    [540, 125],
    [600, 125],
    [655, 125], // 85
    [710, 125],
    [765, 125], // 87: SNAKE/CHUTE
    [820, 125],
    [875, 125],
    [925, 125], // 90
    [925, 70],
    [875, 70],
    [820, 70], // 93: SNAKE/CHUTE
    [765, 70],
    [710, 70], // 95: SNAKE/CHUTE
    [655, 70],
    [600, 70],
    [540, 70], // 98: SNAKE/CHUTE
    [490, 70],
    [435, 70]
]; // 100: ARRIVAL

// Zero Square positions: to set the players position in better view on square 0
var aColumn = [370, 340, 310];
var aRow = [530, 580];
var ZERO_SQUARE_POSITIONS = [
    [aColumn[0], aRow[0]],
    [aColumn[0], aRow[1]],
    [aColumn[1], aRow[0]],
    [aColumn[1], aRow[1]],
    [aColumn[2], aRow[0]],
    [aColumn[2], aRow[1]]
];

// COORDINATES OF TURNING POINTS IN CHUTES
var CHUTES_COORDS_16 = [
    [635.8, 507.8],
    [589.7, 528.3],
    [577.3, 545.8],
    [595.15, 564.3],
    [647.7, 568.8],
    [696.15, 576.25]
];
var CHUTES_COORDS_47 = [
    [785.25, 348.3],
    [812.15, 367.8],
    [820.25, 388.3],
    [804.1, 409.3],
    [759.65, 423.8],
    [723.65, 441.75]
];
var CHUTES_COORDS_49 = [
    [878.75, 364.3],
    [892.15, 383.3],
    [898.75, 411.8],
    [904.1, 443.3],
    [913.65, 469.8],
    [930.15, 497.75]
];
var CHUTES_COORDS_56 = [
    [666.3, 276.8],
    [702.25, 276.8],
    [729.75, 286.8],
    [759.1, 295.3],
    [798.15, 295.3]
];
var CHUTES_COORDS_62 = [
    [508.3, 239.8],
    [541.8, 282.5],
    [550.3, 298.8],
    [545.65, 319.3],
    [510.7, 365.9],
    [501.6, 387.4],
    [506.2, 410.4],
    [541.8, 451.75],
    [548.7, 480.75],
    [501.6, 519.25]
];
var CHUTES_COORDS_64 = [
    [582.3, 228.3],
    [561.7, 229.8],
    [541.8, 241.7],
    [519.65, 258.8],
    [503.2, 273.4],
    [477.6, 285.4],
    [447.2, 295.9]
];
var CHUTES_COORDS_87 = [
    [767.75, 147.3],
    [750.15, 195.5],
    [736.75, 208.9],
    [647.65, 251.3],
    [629.2, 270.9],
    [623.6, 297.4],
    [640.7, 326.4],
    [677.15, 350.25],
    [693.15, 368.25],
    [694.65, 390.25],
    [683.65, 411.25],
    [663.75, 430.25],
    [621.65, 449.75]
];
var CHUTES_COORDS_93 = [
    [838.75, 70.85],
    [880.65, 82.5],
    [885.15, 96.9],
    [880.65, 112.3],
    [858.7, 133.9],
    [835.6, 153.4],
    [822.2, 170.9]
];
var CHUTES_COORDS_95 = [
    [683.75, 63.35],
    [649.2, 80.4],
    [643.7, 95.9],
    [653.6, 108.3],
    [702.2, 133.9],
    [714.1, 151.9],
    [711.7, 172.4]
];
var CHUTES_COORDS_98 = [
    [516.75, 62.35],
    [482.2, 79.4],
    [476.7, 94.9],
    [486.6, 107.3],
    [535.2, 132.9],
    [547.1, 150.9],
    [544.7, 171.4]
];

var PLAYER_SPRITE_WIDTH = [58, 50, 60, 60, 60, 52];
var PLAYER_SPRITE_HEIGHT = [70, 72, 70, 86, 70, 70];
var STEP_LENGTH = 10; // CHUTE MOVEMENT SPEED (INCREASE THE NUMBER TO INCREASE SPEED)
var LADDERS_SPEED = 1000; // LADDERS MOVEMENT SPEED (IN MS)
var SNAKE_SPEED = 800; // SNAKE MOVEMENT SPEED (IN MS)