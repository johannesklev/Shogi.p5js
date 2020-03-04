
function takePiece(ownPiece, enemyPiece) {
  if (ownPiece.owner != enemyPiece.owner) {
    if (ownPiece.owner === "SENTE") {
      enemyPiece.suji = enemyPiece.order;
      enemyPiece.dan = 11;
    } else if (ownPiece.owner === "GOTE") {
      enemyPiece.suji = 11;
      enemyPiece.dan = enemyPiece.order;
    }
    enemyPiece.owner = ownPiece.owner;
    enemyPiece.nari = false;
    enemyPiece.mochiGoma = true;
  }
}

function hasPiece(suji, dan) {
  for (let p of pieces) {
    if (p.suji === suji && p.dan === dan) {
      return p;
    }
  }
}

function movePiece(piece, suji, dan, checkedNaru) {
  let lastCell = checkCell(piece.suji, piece.dan);
  let newCell = checkCell(suji, dan);
  let enemyPiece = hasPiece(suji, dan);
  let okGO = false;
  
  if (isLegalMove(piece, suji, dan)) {
    if (!checkedNaru) {
      if (!piece.nari && ((piece.owner === "SENTE" && lastCell.area === "GOTE") || (piece.owner === "GOTE" && lastCell.area === "SENTE") || (newCell && (piece.owner === "SENTE" && newCell.area === "GOTE") || (piece.owner === "GOTE" && newCell.area === "SENTE")))) {
        checkNaru(piece, suji, dan);
      } else {
        okGO = true;
      }
    } else {
      okGO = true;
    }
  }

  // console.log(okGO);

  if (okGO) {
    if (piece.owner === teban) {
      if (isLegalMove(piece, suji, dan)) {
        if (enemyPiece) {
          takePiece(piece, enemyPiece);
        }
        let name;
        if (piece.nari) {
          name = piece.nariName;
        } else if (!piece.nari) {
          name = piece.name;
        }
        if (piece.nari) {
          console.log(suji, dan, name, "成");
        } else {
          console.log(suji, dan, name); // figure out how to check for 右, 直 etc
        }
        piece.suji = suji;
        piece.dan = dan;
        // console.log(suji, dan, piece.name);
        changeTurn();
        selected = undefined;
      }
  
    } else if (piece.owner === "SENTE" && teban === "GOTE") {
      console.log("後手の番です。")
    } else if (piece.owner === "GOTE" && teban === "SENTE") {
      console.log("先手の番です。")
    }
  }
}

function isLegalMove(piece, suji, dan) {
  let target = createVector(suji, dan);
  let legal = false;
  if (target.x < 1 || target.x > 9 || target.y < 1 || target.y > 9) {
    console.log("盤外です。");
    return legal;
  }
  for (let lm of piece.legalMoves) {

    // console.log(target);
    // console.log(lm);
    if (target.x === lm.x && target.y === lm.y) {
      legal = true;
      break;
    } else if (target.x != lm.x || target.y != lm.y) {
      legal = false;
    }
  }
  if (!legal) {
    console.log("この駒はそこに移動できない。");
  }
  // console.log(legal);
  return legal;
}

function selectGyoku() {
  for (let p of pieces) {
    if (p.name === "玉") {
      if (p.owner === "SENTE") {
        senteGyoku = p;
      } else if (p.owner === "GOTE") {
        goteGyoku = p;
      }
    }
  }
}

function showPieces() {
  for (let p of pieces) {
    p.show();
  }
}

class Piece {
  constructor() {
    this.ID;
    this.nari = false;
    this.mochiGoma = false;
  }


  show() {
    push();
    let x;
    let y;

    if (!this.mochiGoma) {
      x = width - (this.suji * w + w / 2);
      y = this.dan * w + w / 2;
  
    } else if (this.mochiGoma && this.owner === "SENTE") {
      // Code for placing SENTE's mochiGoma
      x = width - (this.order * w + w / 2);
      y = 11 * w + w / 2;
      
    } else if (this.mochiGoma && this.owner === "GOTE") {
      // Code for placing GOTE's mochiGoma
      x = width - (11 * w + w / 2);
      y = this.order * w + w / 2;
    }

    translate(x + 1, y + 1); // because the grid lines made them look uncentered

    if (this.owner === "GOTE") {
      rotate(PI);
    }

    let v = w / 10;
    drawPiece(v); // function to draw a piece, (unit) = w / 10 is "default size"

    fill(0);
    textSize(v*4);
    textAlign(CENTER, CENTER);
    if (!this.nari || this.name === "玉" || this.name === "金") {
      text(this.name, 0, 2);
    } else if (this.nari) {
      if (this.nariName.length === 2) {
        textSize(v*2.5);
        text(this.nariName[0], 0, -7)
        textSize(v*3);
        text(this.nariName[1], 0, 5)
      } else {
        text(this.nariName, 0, 2);
      }
    }
    pop();
  }
}

function drawPiece(unit, xOffset, yOffset) { // function to draw a piece, (unit) = w / 10 is "default size"
  if (xOffset) {
    translate(xOffset, 0);
  }
  if (yOffset) {
    translate(0, yOffset);
  }
  let u = unit;
  stroke(0);
  fill(255, 165, 79)
  let pA = createVector(-3 * u, 3 * u); // bottom left
  let pB = createVector(3 * u, 3 * u); // bottom right
  let pC = createVector(-2.5 * u, -2.2 * u); // top left
  let pD = createVector(2.5 * u, -2.2 * u); // top right
  let pE = createVector(0, -4 * u); // top middle
  beginShape();
  vertex(pA.x, pA.y); // bottom left ...
  vertex(pB.x, pB.y); // ... to bottom right ...
  vertex(pD.x, pD.y); // ... to top right ...
  vertex(pE.x, pE.y); // ... to top middle ...
  vertex(pC.x, pC.y); // ... to top left ...
  endShape(CLOSE);    // ... and back to bottom left
}


class Gyoku extends Piece {
  constructor(posX, posY, owner) {
    super();
    this.suji = posX;
    this.dan = posY;
    this.name = "玉";
    this.owner = owner;
  }
}

class Kin extends Piece {
  constructor(posX, posY, owner) {
    super();
    this.suji = posX;
    this.dan = posY;
    this.name = "金";
    this.owner = owner;
    this.order = 6;
  }
}

class Gin extends Piece {
  constructor(posX, posY, owner) {
    super();
    this.suji = posX;
    this.dan = posY;
    this.name = "銀";
    this.nariName = "成銀";
    this.owner = owner;
    this.order = 5;
  }
}

class Kei extends Piece {
  constructor(posX, posY, owner) {
    super();
    this.suji = posX;
    this.dan = posY;
    this.name = "桂";
    this.nariName = "成桂";
    this.owner = owner;
    this.order = 4;
  }
}

class Kyo extends Piece {
  constructor(posX, posY, owner) {
    super();
    this.suji = posX;
    this.dan = posY;
    this.name = "香";
    this.nariName = "成香";
    this.owner = owner;
    this.order = 3;
  }
}

class Hisha extends Piece {
  constructor(posX, posY, owner) {
    super();
    this.suji = posX;
    this.dan = posY;
    this.name = "飛";
    this.nariName = "竜";
    this.owner = owner;
    this.legalMoves = [];
    this.order = 8;
  }
}

class Kaku extends Piece {
  constructor(posX, posY, owner) {
    super();
    this.suji = posX;
    this.dan = posY;
    this.name = "角";
    this.nariName = "馬";
    this.owner = owner;
    this.legalMoves = [];
    this.order = 7;
  }
}

class Fu extends Piece {
  constructor(posX, posY, owner) {
    super();
    this.suji = posX;
    this.dan = posY;
    this.name = "歩";
    this.nariName = "と";
    this.owner = owner;
    this.legalMoves = [];
    this.order = 2;
  }
}
