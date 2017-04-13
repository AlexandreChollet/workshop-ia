var express = require('express');
var cors = require('cors');
var router = express.Router();
var tenaille;

router.use(cors());

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Express' });
});

router.put('/board', function(req, res, next) {

	var x,y;
	var board = req.body.board;
	var score = req.body.score;
	var scoreVs = req.body.score_vs;
	var playerId = req.body.player;
	var round = req.body.round;
	tenaille = [playerId, getOpponentId(playerId), getOpponentId(playerId), playerId]

	if(round == 1) {
		x = 7;
		y = 7;
	} else if(round == 2) {
		x = 7;
		y = 3;
	} else {
		coords = IA_coup(board, 3);
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
	return board[line][column];
}

function checkStoneBelongTo(board, line, column, playerId) {
	var caseVal = getStoneAt(board,line,column);
	if(caseVal == playerId)
		return true;
	else
		return false;
}

function checkFiveInRow(board,playerId) {
	for(i=0;i<18;i++)
     {
		for(j=0;j<18;j++)
		{
			if(checkStoneBelongTo(board,line,column, playerId)) {
				
			}

		}
  	}
}

function checkTenaille(board, playerId) {
	for(x=0;x<18;x++)
     {
		for(y=0;y<18;y++)
		{
			if(checkStoneBelongTo(board,x,y, playerId)) {
				directions.forEach(function(direction, index){
					var newX = x;
					var newY = y;
					var good = true;
					tenaille.forEach(function(stone){
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

function IA_coup(board, profondeur) {

	var coords = { x: null, y: null };

	var max = -10000;
	var tmp,maxi,maxj;

	for(i=0;i<18;i++)
     {
          for(j=0;j<18;j++)
          {
                if(board[i][j] == 0)
                {
                      board[i][j] = 1;
                      tmp = Min(board,profondeur-1);

                      if(tmp > max)
                      {
                            max = tmp;
                            maxi = i;
                            maxj = j;
                      }

                      board[i][j] = 0;
                }
          }
     }

    coords.x = maxi;
    coords.y = maxj;

    coords.x = Math.floor((Math.random() * 18) + 0);
	coords.y = Math.floor((Math.random() * 18) + 0);

	return coords;
}


function Max(board,profondeur)
{
     if(profondeur == 0 || gagnant(board)!=0)
     {
          return evaluation(board);
     }

     var max = -10000;
     var i,j,tmp;

     for(i=0;i<18;i++)
     {
          for(j=0;j<18;j++)
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

 function Min(board,profondeur)
{
     if(profondeur == 0 || gagnant(board)!=0)
     {
          return evaluation(board);
     }

     var min = 10000;
     var i,j,tmp;

     for(i=0;i<18;i++)
     {
          for(j=0;j<18;j++)
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

function evaluation(board) {

	var nb_de_pions = 0;

	//On compte le nombre de pions présents sur le plateau
     for(i=0;i<18;i++)
     {
          for(j=0;j<18;j++)
          {
               if(board[i][j] != 0)
               {
                    nb_de_pions++;
               }
          }
     }
}

function gagnant() {

}



module.exports = router;
