
function changeTurn() {
  setLegalMoves();
  checkWin();
  if (winner === "") {
    if (teban === "SENTE") {
      // console.log("次は後手の番です。");
      teban = "GOTE";
    } else {
      // console.log("次は先手の番です。");
      teban = "SENTE";
    }
  } else if (winner != "") {
    let player;
    if (winner === "SENTE") {
      player = "先手";
    } else if (winner === "GOTE") {
      player = "後手";
    }
    console.log(player + "の勝利です。");
    teban = "";
  }
}

function checkWin() { // yeah, no, this isn't doing what I want.
  checkOute();
  // console.log(oute);
  if (oute) { // if no pieces have any legal moves?
    console.log("王手です。")
    // if (senteGyoku.legalMoves.length === 0) {
    //   winner = "GOTE";
    // } else if (goteGyoku.legalMoves.length === 0) {
    //   winner = "SENTE";
    // }
  }
}

function checkOute() {
  oute = false;
  for (let p of pieces) {
    for (let lm of p.legalMoves) {
      if (p.owner === "GOTE") {
        if (lm.x === senteGyoku.suji && lm.y === senteGyoku.dan) {
          oute = true;
        }
      } else if (p.owner === "SENTE") {
        if (lm.x === goteGyoku.suji && lm.y === goteGyoku.dan) {
          oute = true;
        }
      }
    }
  }
}