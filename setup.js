
let selected;
let naru;

let b = []; // cell array
let board = [];
let pieces = [];
let windows = [];

let senteGyoku;
let goteGyoku;

let w = 40;
let size = 12; // must be as high or higher than the highest specified cell (12 atm)
// let margin; // 縦横の余白
// let size = 1; // for if I need to make things a relative size

let teban = "SENTE";
let oute = false; // rewrite to senteGyoku.oute & goteGyoku.oute?
let winner = "";

// let boardWidth = 333 * size;
// let boardHeight = 364 * size;

function makeBoard() {
  for (let i = 0; i < size; i++) {
    b[i] = [];
    for (let j = 0; j < size; j++) {
      let cell = new Cell(i,j);
      b[i].push(cell);
    }
  }
  for (let i = 1; i <= 9; i++) {
    for (let j = 1; j <= 9; j++) {
      board.push(b[i][j]);
    }
  }
  windows.push("Game board");
}

function setLegalMoves(piece) {
  if (!piece) {
    for (let p of pieces) {
      setLegalMoves(p);
    }
    removeIllegalGyokuMoves();
  } else {
    piece.legalMoves = [];
    if (piece.name === "玉") {
      addMove(piece, piece.suji    , piece.dan - 1); // up
      addMove(piece, piece.suji - 1, piece.dan - 1); // right up
      addMove(piece, piece.suji - 1, piece.dan    ); // right
      addMove(piece, piece.suji - 1, piece.dan + 1); // right down
      addMove(piece, piece.suji    , piece.dan + 1); // down
      addMove(piece, piece.suji + 1, piece.dan + 1); // left down
      addMove(piece, piece.suji + 1, piece.dan    ); // left
      addMove(piece, piece.suji + 1, piece.dan - 1); // left up
  
    } else if (piece.name === "金") {
      if (piece.mochiGoma) {
        anywhereIsLegal(piece);
      } else {
        if (piece.owner === "SENTE") {
          addMove(piece, piece.suji    , piece.dan - 1); // up
          addMove(piece, piece.suji - 1, piece.dan - 1); // right up
          addMove(piece, piece.suji - 1, piece.dan    ); // right
          addMove(piece, piece.suji    , piece.dan + 1); // down
          addMove(piece, piece.suji + 1, piece.dan    ); // left
          addMove(piece, piece.suji + 1, piece.dan - 1); // left up
        } else if (piece.owner === "GOTE") {
          addMove(piece, piece.suji    , piece.dan - 1); // up
          addMove(piece, piece.suji - 1, piece.dan    ); // right
          addMove(piece, piece.suji - 1, piece.dan + 1); // right down
          addMove(piece, piece.suji    , piece.dan + 1); // down
          addMove(piece, piece.suji + 1, piece.dan + 1); // left down
          addMove(piece, piece.suji + 1, piece.dan    ); // left
        }
      }
  
    } else if (piece.name === "銀") {
      if (piece.mochiGoma) {
        anywhereIsLegal(piece);
      } else {
        if (piece.owner === "SENTE") {
          if (!piece.nari) {
            addMove(piece, piece.suji    , piece.dan - 1); // up
            addMove(piece, piece.suji - 1, piece.dan - 1); // right up
            addMove(piece, piece.suji - 1, piece.dan + 1); // right down
            addMove(piece, piece.suji + 1, piece.dan + 1); // left down
            addMove(piece, piece.suji + 1, piece.dan - 1); // left up
          } else if (piece.nari) {
            addMove(piece, piece.suji    , piece.dan - 1); // up
            addMove(piece, piece.suji - 1, piece.dan - 1); // right up
            addMove(piece, piece.suji - 1, piece.dan    ); // right
            addMove(piece, piece.suji    , piece.dan + 1); // down
            addMove(piece, piece.suji + 1, piece.dan    ); // left
            addMove(piece, piece.suji + 1, piece.dan - 1); // left up
          }
        } else if (piece.owner === "GOTE") {
          if (!piece.nari) {
            addMove(piece, piece.suji - 1, piece.dan - 1); // right up
            addMove(piece, piece.suji - 1, piece.dan + 1); // right down
            addMove(piece, piece.suji    , piece.dan + 1); // down
            addMove(piece, piece.suji + 1, piece.dan + 1); // left down
            addMove(piece, piece.suji + 1, piece.dan - 1); // left up
          } else if (piece.nari) {
            addMove(piece, piece.suji    , piece.dan - 1); // up
            addMove(piece, piece.suji - 1, piece.dan    ); // right
            addMove(piece, piece.suji - 1, piece.dan + 1); // right down
            addMove(piece, piece.suji    , piece.dan + 1); // down
            addMove(piece, piece.suji + 1, piece.dan + 1); // left down
            addMove(piece, piece.suji + 1, piece.dan    ); // left
          }
        }
      }
  
    } else if (piece.name === "桂") {
      if (piece.owner === "SENTE") {
        if (piece.mochiGoma) {
          anywhereIsLegal(piece, 2);
        } else if (!piece.nari) {
          addMove(piece, piece.suji - 1, piece.dan - 2); // right up up
          addMove(piece, piece.suji + 1, piece.dan - 2); // left up up
        } else if (piece.nari) {
          addMove(piece, piece.suji    , piece.dan - 1); // up
          addMove(piece, piece.suji - 1, piece.dan - 1); // right up
          addMove(piece, piece.suji - 1, piece.dan    ); // right
          addMove(piece, piece.suji    , piece.dan + 1); // down
          addMove(piece, piece.suji + 1, piece.dan    ); // left
          addMove(piece, piece.suji + 1, piece.dan - 1); // left up
        }
    } else if (piece.owner === "GOTE") {
      if (piece.mochiGoma) {
        anywhereIsLegal(piece, 8);
      } else if (!piece.nari) {
        addMove(piece, piece.suji - 1, piece.dan + 2); // right down down
        addMove(piece, piece.suji + 1, piece.dan + 2); // left down down
      } else if (piece.nari) {
        addMove(piece, piece.suji    , piece.dan - 1); // up
        addMove(piece, piece.suji - 1, piece.dan    ); // right
        addMove(piece, piece.suji - 1, piece.dan + 1); // right down
        addMove(piece, piece.suji    , piece.dan + 1); // down
        addMove(piece, piece.suji + 1, piece.dan + 1); // left down
        addMove(piece, piece.suji + 1, piece.dan    ); // left
      }
    }
    
    } else if (piece.name === "香") {
      if (piece.owner === "SENTE") {
        if (piece.mochiGoma) {
          anywhereIsLegal(piece, 1);
        } else if (!piece.nari) {
          let upStop = false;
          let upDan = piece.dan;
          while (!upStop) {
            upDan--;
            let checkPiece = hasPiece(piece.suji, upDan);
            if (!checkPiece) {
              addMove(piece, piece.suji, upDan);
            } else if (checkPiece && piece.owner != checkPiece.owner) {
              addMove(piece, piece.suji, upDan);
              upStop = true;
            } else if (checkPiece && piece.owner === checkPiece.owner) {
              upStop = true;
            }
            if (upDan <= 1) {
              upStop = true;
            }
          }
        } else if (piece.nari) {
          addMove(piece, piece.suji    , piece.dan - 1); // up
          addMove(piece, piece.suji - 1, piece.dan - 1); // right up
          addMove(piece, piece.suji - 1, piece.dan    ); // right
          addMove(piece, piece.suji    , piece.dan + 1); // down
          addMove(piece, piece.suji + 1, piece.dan    ); // left
          addMove(piece, piece.suji + 1, piece.dan - 1); // left up
        }
  
      } else if (piece.owner === "GOTE") {
        if (piece.mochiGoma) {
          anywhereIsLegal(piece, 9);
        } else if (!piece.nari) {
          let downStop = false;
          let downDan = piece.dan;
          while (!downStop) {
            downDan++;
            let checkPiece = hasPiece(piece.suji, downDan);
            if (!checkPiece) {
              addMove(piece, piece.suji, downDan);
            } else if (checkPiece && piece.owner != checkPiece.owner) {
              addMove(piece, piece.suji, downDan);
              downStop = true;
            } else if (checkPiece && piece.owner === checkPiece.owner) {
              downStop = true;
            }
            if (downDan >= 9) {
              downStop = true;
            }
          }
        } else if (piece.nari) {
          addMove(piece, piece.suji    , piece.dan - 1); // up
          addMove(piece, piece.suji - 1, piece.dan    ); // right
          addMove(piece, piece.suji - 1, piece.dan + 1); // right down
          addMove(piece, piece.suji    , piece.dan + 1); // down
          addMove(piece, piece.suji + 1, piece.dan + 1); // left down
          addMove(piece, piece.suji + 1, piece.dan    ); // left
        }
      }
    
    } else if (piece.name === "飛") {
      if (piece.mochiGoma) {
        anywhereIsLegal(piece);
      } else {
        if (piece.nari) {
          addMove(piece, piece.suji - 1, piece.dan - 1); // right up
          addMove(piece, piece.suji - 1, piece.dan + 1); // right down
          addMove(piece, piece.suji + 1, piece.dan + 1); // left down
          addMove(piece, piece.suji + 1, piece.dan - 1); // left up
        }
  
        let leftStop = false;
        let leftSuji = piece.suji;
        while (!leftStop) {
          leftSuji++;
          let checkPiece = hasPiece(leftSuji, piece.dan);
          if (!checkPiece) {
            addMove(piece, leftSuji, piece.dan);
          } else if (checkPiece && piece.owner != checkPiece.owner) {
            addMove(piece, leftSuji, piece.dan);
            leftStop = true;
          } else if (checkPiece && piece.owner === checkPiece.owner) {
            leftStop = true;
          }
          if (leftSuji >= 9) {
            leftStop = true;
          }
        }
  
        let rightStop = false;
        let rightSuji = piece.suji;
        while (!rightStop) {
          rightSuji--;
          let checkPiece = hasPiece(rightSuji, piece.dan);
          if (!checkPiece) {
            addMove(piece, rightSuji, piece.dan);
          } else if (checkPiece && piece.owner != checkPiece.owner) {
            addMove(piece, rightSuji, piece.dan);
            rightStop = true;
          } else if (checkPiece && piece.owner === checkPiece.owner) {
            rightStop = true;
          }
          if (rightSuji <= 1) {
            rightStop = true;
          }
        }
  
        let downStop = false;
        let downDan = piece.dan;
        while (!downStop) {
          downDan++;
          let checkPiece = hasPiece(piece.suji, downDan);
          if (!checkPiece) {
            addMove(piece, piece.suji, downDan);
          } else if (checkPiece && piece.owner != checkPiece.owner) {
            addMove(piece, piece.suji, downDan);
            downStop = true;
          } else if (checkPiece && piece.owner === checkPiece.owner) {
            downStop = true;
          }
          if (downDan >= 9) {
            downStop = true;
          }
        }
  
        let upStop = false;
        let upDan = piece.dan;
        while (!upStop) {
          upDan--;
          let checkPiece = hasPiece(piece.suji, upDan);
          if (!checkPiece) {
            addMove(piece, piece.suji, upDan);
          } else if (checkPiece && piece.owner != checkPiece.owner) {
            addMove(piece, piece.suji, upDan);
            upStop = true;
          } else if (checkPiece && piece.owner === checkPiece.owner) {
            upStop = true;
          }
          if (upDan <= 1) {
            upStop = true;
          }
        }
      }
  
    } else if (piece.name === "角") {
      if (piece.mochiGoma) {
        anywhereIsLegal(piece);
      } else {
        if (piece.nari) {
          addMove(piece, piece.suji    , piece.dan - 1); // up
          addMove(piece, piece.suji - 1, piece.dan    ); // right
          addMove(piece, piece.suji    , piece.dan + 1); // down
          addMove(piece, piece.suji + 1, piece.dan    ); // left
        }
  
        let upLeftStop = false;
        let upLeftSuji = piece.suji;
        let upLeftDan = piece.dan;
  
        while (!upLeftStop) {
          upLeftSuji++;
          upLeftDan--;
          let checkPiece = hasPiece(upLeftSuji, upLeftDan);
          if (!checkPiece) {
            addMove(piece, upLeftSuji, upLeftDan);
          } else if (checkPiece && piece.owner != checkPiece.owner) {
            addMove(piece, upLeftSuji, upLeftDan);
            upLeftStop = true;
          } else if (checkPiece && piece.owner === checkPiece.owner) {
            upLeftStop = true;
          }
          if (upLeftSuji >= 9 || upLeftDan <= 1) {
            upLeftStop = true;
          }
        }
  
        let upRightStop = false;
        let upRightSuji = piece.suji;
        let upRightDan = piece.dan;
  
        while (!upRightStop) {
          upRightSuji--;
          upRightDan--;
          let checkPiece = hasPiece(upRightSuji, upRightDan);
          if (!checkPiece) {
            addMove(piece, upRightSuji, upRightDan);
          } else if (checkPiece && piece.owner != checkPiece.owner) {
            addMove(piece, upRightSuji, upRightDan);
            upRightStop = true;
          } else if (checkPiece && piece.owner === checkPiece.owner) {
            upRightStop = true;
          }
          if (upRightSuji <= 1 || upRightDan <= 1) {
            upRightStop = true;
          }
        }
  
        let downLeftStop = false;
        let downLeftSuji = piece.suji;
        let downLeftDan = piece.dan;
  
        while (!downLeftStop) {
          downLeftSuji++;
          downLeftDan++;
          let checkPiece = hasPiece(downLeftSuji, downLeftDan);
          if (!checkPiece) {
            addMove(piece, downLeftSuji, downLeftDan);
          } else if (checkPiece && piece.owner != checkPiece.owner) {
            addMove(piece, downLeftSuji, downLeftDan);
            downLeftStop = true;
          } else if (checkPiece && piece.owner === checkPiece.owner) {
            downLeftStop = true;
          }
          if (downLeftSuji >= 9 || downLeftDan >= 9) {
            downLeftStop = true;
          }
        }
  
        let downRightStop = false;
        let downRightSuji = piece.suji;
        let downRightDan = piece.dan;
  
        while (!downRightStop) {
          downRightSuji--;
          downRightDan++;
          let checkPiece = hasPiece(downRightSuji, downRightDan);
          if (!checkPiece) {
            addMove(piece, downRightSuji, downRightDan);
          } else if (checkPiece && piece.owner != checkPiece.owner) {
            addMove(piece, downRightSuji, downRightDan);
            downRightStop = true;
          } else if (checkPiece && piece.owner === checkPiece.owner) {
            downRightStop = true;
          }
          if (downRightSuji <= 1 || downRightDan >= 9) {
            downRightStop = true;
          }
        }
      }
  
    } else if (piece.name === "歩") {
      if (piece.owner === "SENTE") {
        if (piece.mochiGoma) {
          anywhereIsLegal(piece, 1);
        } else if (!piece.nari) {
          let tempDan = piece.dan - 1;
          addMove(piece, piece.suji, tempDan);
        } else if (piece.nari) {
          addMove(piece, piece.suji    , piece.dan - 1); // up
          addMove(piece, piece.suji - 1, piece.dan - 1); // right up
          addMove(piece, piece.suji - 1, piece.dan    ); // right
          addMove(piece, piece.suji    , piece.dan + 1); // down
          addMove(piece, piece.suji + 1, piece.dan    ); // left
          addMove(piece, piece.suji + 1, piece.dan - 1); // left up
        }
      } else if (piece.owner === "GOTE") {
        if (piece.mochiGoma) {
          anywhereIsLegal(piece, 9);
        } else if (!piece.nari) {
          let tempDan = piece.dan + 1;
          addMove(piece, piece.suji, tempDan);
        } else if (piece.nari) {
          addMove(piece, piece.suji    , piece.dan - 1); // up
          addMove(piece, piece.suji - 1, piece.dan    ); // right
          addMove(piece, piece.suji - 1, piece.dan + 1); // right down
          addMove(piece, piece.suji    , piece.dan + 1); // down
          addMove(piece, piece.suji + 1, piece.dan + 1); // left down
          addMove(piece, piece.suji + 1, piece.dan    ); // left
        }
      }
    }
  }
}

function anywhereIsLegal(piece, dan) { // anywhere is legal except for over/under dan
  for (let cell of board) {
    if (!dan) { // if no dan specified, anywhere is legal
      let checkPiece = hasPiece(cell.suji, cell.dan);
      if (!checkPiece) {
        addMove(piece, cell.suji, cell.dan);
      }
    } else if (dan && dan > 5 && cell.dan < dan) { // if dan is 8 or 9, only add smaller
      let checkPiece = hasPiece(cell.suji, cell.dan);
      if (!checkPiece) {
        addMove(piece, cell.suji, cell.dan);
      }
    } else if (dan && dan <= 5 && cell.dan > dan) { // if dan is 1 or 2, only add bigger
      let checkPiece = hasPiece(cell.suji, cell.dan);
      if (!checkPiece) {
        addMove(piece, cell.suji, cell.dan);
      }
    }
  }
}

function addMove(piece, suji, dan) {
    let move = createVector(suji, dan);
    let cell = checkCell(move.x, move.y);
    let checkPiece = hasPiece(move.x, move.y);
    if (!cell.outside && !checkPiece) {
      piece.legalMoves.push(move);
    } else if (!cell.outside && checkPiece && piece.owner != checkPiece.owner) {
      piece.legalMoves.push(move);
    }
}

function removeIllegalGyokuMoves() { // this function remembers which indexes of the Gyoku.legalMoves array would lead to instant loss
  let illegalSenteGyokuMoves = [];
  let illegalGoteGyokuMoves = [];
  markIllegalMoves(senteGyoku, illegalSenteGyokuMoves);
  markIllegalMoves(goteGyoku, illegalGoteGyokuMoves);
  if (illegalSenteGyokuMoves.length > 0) {
    removeTheMoves(senteGyoku, illegalSenteGyokuMoves);
  }
  if (illegalGoteGyokuMoves.length > 0) {
    removeTheMoves(goteGyoku, illegalGoteGyokuMoves);
  }
  // console.log(illegalSenteGyokuMoves);
  // console.log(illegalGoteGyokuMoves);
}

function markIllegalMoves(gyoku, array) {
  for (let glm of gyoku.legalMoves) {
    for (let p of pieces) {
      if (!p.mochiGoma) {
        if (p.owner != gyoku.owner) {
          if (p.legalMoves && p.legalMoves.length > 0) {
            for (let plm of p.legalMoves) {
              if (glm.x === plm.x && glm.y === plm.y) {
                let newIndex = true;
                if (array.length > 0) {
                  for (let igm of array) {
                    if (igm.x === glm.x && igm.y === glm.y) {
                      newIndex = false;
                    }
                  }
                }
                if (newIndex) {
                  array.push(glm);
                }
              }
            }
          }
        }
      }
    }
  }
}

function removeTheMoves(gyoku, array) {
  if (gyoku.legalMoves && gyoku.legalMoves.length > 0) {
    // console.log(gyoku.legalMoves.length)
    for (let index = gyoku.legalMoves.length - 1; index >= 0; index--) {
      // console.log(index);
      let glm = gyoku.legalMoves[index];
      for (let illegalMove of array) {
        // console.log(glm.x, glm.y);
        // console.log(illegalMove.x, illegalMove.y);
        if (glm.x === illegalMove.x && glm.y === illegalMove.y) {
          // console.log(index);
          gyoku.legalMoves.splice(index, 1);
        }
      }
    }
  }
}

function placePieces() {
  // SENTE
  // Place Gyoku
  pieces.push(new Gyoku(5, 9, "SENTE"));

  // Place Kin
  pieces.push(new Kin(6, 9, "SENTE"));
  pieces.push(new Kin(4, 9, "SENTE"));

  // Place Gin
  pieces.push(new Gin(7, 9, "SENTE"));
  pieces.push(new Gin(3, 9, "SENTE"));

  // Place Kei
  pieces.push(new Kei(8, 9, "SENTE"));
  pieces.push(new Kei(2, 9, "SENTE"));

  // Place Fu
  for (let i = 9; i >= 1; i--) {
    pieces.push(new Fu(i, 7, "SENTE"));
  }

  // Place Kyo
  pieces.push(new Kyo(9, 9, "SENTE"));
  pieces.push(new Kyo(1, 9, "SENTE"));

  // Place Kaku
  pieces.push(new Kaku(8, 8, "SENTE"));

  // Place Hisha
  pieces.push(new Hisha(2, 8, "SENTE"));

  // GOTE
  // Place Gyoku
  pieces.push(new Gyoku(5, 1, "GOTE"));

  // Place Kin
  pieces.push(new Kin(4, 1, "GOTE"));
  pieces.push(new Kin(6, 1, "GOTE"));

  // Place Gin
  pieces.push(new Gin(3, 1, "GOTE"));
  pieces.push(new Gin(7, 1, "GOTE"));

  // Place Kei
  pieces.push(new Kei(2, 1, "GOTE"));
  pieces.push(new Kei(8, 1, "GOTE"));

  // Place Fu
  for (let i = 1; i <= 9; i++) {
    pieces.push(new Fu(i, 3, "GOTE"));
  }

  // Place Kyo
  pieces.push(new Kyo(1, 1, "GOTE"));
  pieces.push(new Kyo(9, 1, "GOTE"));

  // Place Kaku
  pieces.push(new Kaku(2, 2, "GOTE"));

  // Place Hisha
  pieces.push(new Hisha(8, 2, "GOTE"));

  // Give IDs
  for (let pieceID = 0; pieceID < pieces.length; pieceID ++) {
    pieces[pieceID].ID = pieceID + 1;
  }
}