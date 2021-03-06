var express = require('express');
var cors = require('cors');
var router = express.Router();
var _ = require('lodash')
var tenaille;

router.use(cors());

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Express' });
});

router.put('/board', function(req, res, next) {

	var x,y;
	var board = req.body.board;
	var subboard = getSubBoard(board);
	var score = req.body.score;
	var scoreVs = req.body.score_vs;
	var playerId = req.body.player;
	var round = req.body.round;
	tenaille = [playerId, getOpponentId(playerId), getOpponentId(playerId), playerId];

	if(round == 1) {
		x = 10;
		y = 10;
	} else if(round == 2) {
		x = 7;
		y = 7;
	} else {
		console.log(subboard.subboard);
		coords = IA_coup(board, 1, playerId);
		x = coords.x;
		y = coords.y;
	}

	var json = {
		"x": x,
		"y": y
	};

	res.json(json);
});

var directions = [[-1,-1], [-1,0], [-1,1], [0,1], [1,1], [1,0], [1,-1], [0, -1]];


function getOpponentId(playerId) {
	if(playerId == 1)
		return 2;
	if (playerId == 2)
		return 1;
}

function getStoneAt(board, line, column) {
	return _.get(board,"["+line+"]["+column+"]");
}

function checkStoneBelongTo(board, line, column, playerId) {
	var caseVal = getStoneAt(board,line,column);
	if(caseVal == playerId)
		return true;
	else
		return false;
}

function anyFiveInRow(board,playerId) {
	for(i=0;i<board.length;i++)
     {
		for(j=0;j<board[0].length;j++)
		{
			if(checkStoneBelongTo(board,i,j, playerId)) {
				directions.forEach(function(d) {
					if(isFullRow(board,i,j,d,1,playerId))
						return true;
				});
			}
		}
  	}
  	return false;
}

function isFullRow(board, i, j, d, count, playerId) {

	if((i + (d[0]*count)) <= 0 || i + (d[0]*count) > board.length || (j + (d[1]*count)) <= 0 || j + (d[1]*count) > board[0].length) {
		// Out of bounds
		return false;
	}

	if(checkStoneBelongTo(board, i + (d[0]*count), j + (d[1]*count), playerId)) {
		count++;
		if(count == 5)
			return true;
		else
			isFullRow(board, i, j, d, count, playerId);
	} else {
		return false;
	}
}
/* #### END HELPERS #### */

function checkProximity(board, playerId){
	var score = 0;
	for(x=0;x<board.length;x++)
	{
		for(y=0;y<board[0].length;y++)
		{
			if(_.isUndefined(board[x]) || _.isUndefined(board[x][y]) || !board[x][y]){
				continue;
			}
			for(j=-2;j<2;j++){
				for(k=-2;k<2;k++){
					if(j != 0 && k != 0){
						stone = getStoneAt(board, x+j, y-k)
						if(stone==playerId){
							score+=20/((Math.abs(j)+Math.abs(k))/2)
						}else if(stone==getOpponentId(playerId)){
							score+=10/((Math.abs(j)+Math.abs(k))/2)
						}
					}
				}
			}
		}
	}
	return score;
}



function checkTenaille(board, playerId) {
	for(x=0;x<board.length;x++)
     {
		for(y=0;y<board[0].length;y++)
		{
			if(checkStoneBelongTo(board,x,y, playerId)) {
				directions.forEach(function(direction, index){
					var newX = x;
					var newY = y;
					var good = true;
					tenaille.forEach(function(stone){
						if(newX < 0 || newY < 0)
							return false;
						if(getStoneAt(board, newX, newY) == stone){
							newX = x + direction[0]
							newY = y + direction[1]
						}else{
							good = false;
							return;
						}
					})
					if(good){
						return true
					}
				})
			}

		}
  	}
  	return false;
}

function IA_coup(board, profondeur, playerId) {

	var coords = { x: null, y: null };

	var max = -10000;
	var tmp,maxi,maxj;

	console.log("board.length "  + board.length);
	console.log("board[0].length "  + board[0].length);

	for(var i=0;i<board.length;i++)
     {
          for(var j=0;j<board[0].length;j++)
          {
                if(board[i][j] == 0)
                {
                      board[i][j] = 1;
                      tmp = Min(board,profondeur-1,playerId);

                      if(tmp > max)
                      {
                        max = tmp;
                        maxi = i;
                        maxj = j;
                        console.log("i " + i);
                      	console.log("j " + j);
                      }
                      
                      board[i][j] = 0;
                }
          }
     }

    coords.x = maxi;
    coords.y = maxj;

    // MOCK
    //coords.x = Math.floor((Math.random() * 18) + 0);
	//coords.y = Math.floor((Math.random() * 18) + 0);
	// END MOCK

	return coords;
}


function Max(board,profondeur,playerId)
{
     if(profondeur == 0 || gagnant(board)!=0)
     {
          return evaluation(board,playerId);
     }

     var max = -10000;
     var i,j,tmp;

     for(i=0;i<board.length;i++)
     {
          for(j=0;j<board[0].length;j++)
          {
                if(board[i][j] == 0)
                {
                      board[i][j] = 2;
                      tmp = Min(board,profondeur-1);
                      
                      if(tmp > max)
                      {
                            max = tmp;
                      }
                      board[i][j] = 0;
                }
          }
     }
     return max;
 }

 function Min(board,profondeur,playerId)
{
     if(profondeur == 0 || gagnant(board)!=0)
     {
          return evaluation(board, playerId);
     }

     var min = 10000;
     var i,j,tmp;

     for(i=0;i<board.length;i++)
     {
          for(j=0;j<board[0].length;j++)
          {
                if(board[i][j] == 0)
                {
                      board[i][j] = 1;
                      tmp = Max(board,profondeur-1);
                      
                      if(tmp < min)
                      {
                            min = tmp;
                      }
                      board[i][j] = 0;
                }
          }
     }
     return min;
}

function evaluation(board,playerId) {

	var nbPions = countPions(board); // équivalent profondeur
	var score = 0;

	// check 5 row alliée
	if(anyFiveInRow(board,playerId))
		score += 1000 - nbPions;
	// check 5 row ennemie
	if(anyFiveInRow(board,getOpponentId(playerId)))
		score += -1000 + nbPions;

	// check tenailles
	if(checkTenaille(board,playerId)) {
		score += 200 - nbPions;
	}
	if(checkTenaille(board,getOpponentId(playerId))) {
		score += -200 + nbPions;
	}

	// check proximitée alliée
	score += checkProximity(board,playerId);

	// check proximitée énnemie
	score -= checkProximity(board,getOpponentId(playerId));
     
     return score;
}

function checkGagnant(board,playerId) {

}

function countPions(board) {
	var nb_de_pions = 0;
	for(i=0;i<board.length;i++)
     {
          for(j=0;j<board.length[0];j++)
          {
               if(board[i][j] != 0)
               {
                    nb_de_pions++;
               }
          }
     }
     return nb_de_pions;
}

// Découpe le board en subboard
function getSubBoard(board) {
  var minRow = -1;
  var maxRow = 0;
  var minColumn = -1;
  var maxColumn = 0;

  // Récupération des boundaries en fonction des cases occupées par des stones
  for(i=0;i<18;i++) {

    for(j=0;j<18;j++) {

         if(board[i][j] != 0) {
            if(minRow < 0){
              minRow = i;
            }
            if(minColumn < 0) {
              minColumn = j;
            }
            maxRow = i;
            maxColumn = j;
         }
      }
  }

  // Si aucune pièce n'a été jouée, on retourne null
  if(minRow < 0 || minColumn < 0)
    return null;
  
  // Initialisation du subBoard
  var subBoard = [];
  var subX = 0;
  var subY = 0;
  var kanker = 0;

  // Définition des côtés à traiter
  var sides = [
    minRow,     // haut
    maxRow,     // bas
    minColumn,  // gauche
    maxColumn   // droite
  ];

  // Ajout d'une marge fixe autour d'un côté aléatoire du subboard
  var margin = 4;
  var randomSide = Math.floor((Math.random() * 3) + 0);
  sides[randomSide] = addMargin(margin, randomSide, sides);

  // Incrémentation globale de tous les côtés de +1 (sauf le random)
  for(i=0;i<4;i++) {
    if(randomSide != i)
      sides[i] = addMargin(1, i, sides);
  }

  var rowlog ="";

  // Découpage du board
  try{
    for(i=sides[0];i<sides[1]+1;i++) {
      subBoard[subX] = [];
      for(j=sides[2];j<sides[3]+1;j++) {
        subBoard[subX][subY] = board[i][j];
        rowlog = rowlog + subBoard[subX][subY] + " ";
        subY++;
      }
      rowlog = "";
      subY = 0;
      subX++;
    }
  } catch (e){
    console.log(e);
  }

  var subBoard = {
    "subboard": subBoard,
    "haut":     sides[0],
    "bas":      sides[1],
    "gauche":   sides[2],
    "droite":   sides[3]
  }

  return subBoard;
}

// Ajoute une marge à un côté du subboard
function addMargin(margin, side, sides){

  switch(side) {
    case 0: // haut
        if(sides[side] > margin)
          return sides[side] - margin;
        else
          return 0;
        break;
    case 1: // bas
        if(18 - sides[side] > margin)
          return sides[side] + margin;
        else
          return 0;
        break;
    case 2: // gauche
        if(sides[side] > margin)
          return sides[side] - margin;
        else
          return 0;
        break;
    case 3: // droite
        if(18 - sides[side] > margin)
          return sides[side] + margin;
        else
          return 0;
        break;
    default:
        console.log("No margin.");
        return 0;
  }
}

module.exports = router;
