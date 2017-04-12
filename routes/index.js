var express = require('express');
var cors = require('cors')
var router = express.Router();

router.use(cors())

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

	if(round == 1) {
		x = 7;
		y = 7;
	} else if(round == 2) {
		x = 7;
		y = 4;
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

function IA_coup(board, profondeur) {

	var coords = { x: null, y: null };
	coords.x = Math.floor((Math.random() * 18) + 0);
	coords.y = Math.floor((Math.random() * 18) + 0);

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
