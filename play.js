
// TODO: Remove moves that are made illegal during oute, because they do not remove oute
//       ^ Somehow make sure legal moves remove ALL instances of oute

//       Add touryou functionality

//       Add board flip functionality

//    >  Somehow add the CHOICE to Naru
//       ^ This might require changing functionality for when game is Paused or not...
//       ^ Update isLegalMove (movePiece?) to make sure Fu, Kei and Kyo do not walk too far without Naru

//       Add komaDai functionality (do not .show() pieces that are mochiGoma in regular .show(), or call different stuff inside .show()), and move board with translate(x,y)

//       Test if I can save, copy and recreate the state of the board with the pieces array
//       ^ Can not just copy, needs to be a new array with the needed info (suji, dan, owner, nari, mochiGoma)
//       ^ Then make a function that sets the attributes of everything in the pieces array to be whatever the attributed for that index in the saved array is
//       ^ Save an array of the board state per move
//       ^ Add functionality to go back and forth through the kifu, and rewrite it

//       Make sure redraw() is called when needed

function setup() {
  createCanvas(w*size, w*size); // change to boardHeight, boardWidth, use floor()?
  // find a way to add "margin" from setup.js on all sides?
  makeBoard(); // generates board and adds "Game board" window to windows[]
  placePieces(); // creates all 40 pieces in starting positions and adds them to pieces[]
  selectGyoku(); // mark senteGyoku and goteGyoku
  setLegalMoves(); // finds initial legal moves for each piece
  console.log("対局開始！");
  noLoop();

  // for Naru-testing
  // selected = hasPiece(4,7);
  // selected = hasPiece(4,3);
  // naru = new NaruOrNotNaru(selected);

}

function draw() {
  background(51);

  // translate(width, height); // use this as a base for flipping the board?
  // rotate(PI);

  showWindows(); // draws every window in windows[] in order
}

function mousePressed() {

  // console.log(windows[windows.length - 1]); // check which window is active
  if (windows[windows.length - 1] === "Game board") { // when game board is active
    // console.log(mouseX, mouseY);
    if (mouseX > 0 && mouseX <= width && mouseY > 0 && mouseY <= height) {
      let suji = floor((width - mouseX) / w);
      let dan = floor(mouseY / w);
    
      let checkPiece = hasPiece(suji, dan);
      // console.log(checkPiece.ID);
    
      // console.log(teban, cell.area);
    
      if (!selected && checkPiece) { // if no piece is yet selected, but you clicked one
        if (checkPiece.owner === teban) { // later add functionality to see stuff about enemy pieces
          if (!oute) {
            selected = checkPiece;
          } else if (oute && checkPiece.name === "玉") {
            selected = checkPiece;
          } else {
            selected = checkPiece; // gotta figure out how to make sure it can stop oute
            // console.log("王手です。");
          }
        }
      } else if (selected && !checkPiece && selected.owner === teban) {
        movePiece(selected, suji, dan); // if moving to empty cell
      } else if (selected && checkPiece && selected.owner != checkPiece.owner) {
        movePiece(selected, suji, dan); // if moving to cell inhabited by enemy
      } else if (selected && checkPiece && selected === checkPiece) {
        selected = undefined; // if clicking same piece
      } else if (selected && checkPiece && selected.owner === checkPiece.owner) {
        selected = checkPiece; // if clicking new, own piece
      } else {
        selected = undefined; // if clicking anywhere else
      }
      
      // console.log(selected);
      // console.log(suji);
      // console.log(dan);
    }
  
  } else if (windows[windows.length - 1] === "Naru option") { // when game board is active
    let topY;
    let bottomY;
    let naruLeftX;
    let naruRightX;
    let narazuLeftX;
    let narazuRightX;
    
    if (teban === "SENTE") {
      // console.log("SENTE");
      naruLeftX = naru.x - w/2 - naru.unit / 2;
      naruRightX = naruLeftX + naru.unit; // === naru.x - w/2 + naru.unit / 2
      narazuLeftX = naru.x + w/2 - naru.unit / 2;
      narazuRightX = narazuLeftX + naru.unit; // === naru.x - w/2 + naru.unit / 2
      topY = naru.y - w / 2 - naru.unit / 2;
      bottomY = naru.y - w / 2 + naru.unit / 2;

    } else if (teban === "GOTE") {
      // console.log("GOTE");
      narazuLeftX = naru.x - w/2 - naru.unit / 2;
      narazuRightX = narazuLeftX + naru.unit; // === naru.x - w/2 + naru.unit / 2
      naruLeftX = naru.x + w/2 - naru.unit / 2;
      naruRightX = naruLeftX + naru.unit; // === naru.x + w/2 + naru.unit / 2
      topY = naru.y + w / 2 - naru.unit / 2;
      bottomY = naru.y + w / 2 + naru.unit / 2;
    }
    
    if(mouseY >= topY && mouseY < bottomY) {
      // console.log("top down within");
      if (mouseX > naruLeftX && mouseX < naruRightX) {
        // console.log("naru!");
        console.log(selected.suji, selected.dan, naru.goSuji, naru.goDan);
        yesNaru();
      } else if (mouseX > narazuLeftX && mouseX < narazuRightX) {
        console.log("narazu!");
        noNaru();
      }
    }


  } // add other window options here!

  redraw();
}