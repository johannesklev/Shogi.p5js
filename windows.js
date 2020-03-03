function showWindows() {
  if (windows[0] === "Game board") {
    push();
    // translate(200, 200); // move board inside canvas
    for (let i = 0; i < b.length; i++) {
      for (let j = 0; j < b[i].length; j++) {
        b[i][j].show(); // does order of i and j matter? probably not if same
      }
    }
    
    showPieces();
    pop();
  }
  if (windows[windows.length - 1] === "Naru option") {
    // console.log("this far");
    naru.show();
  }
}

function checkNaru(piece, suji, dan) {
  naru = new NaruOrNotNaru(piece, suji, dan);
}

function NaruOrNotNaru(piece, suji, dan) {
  this.suji = piece.suji;
  this.dan = piece.dan;
  this.owner = piece.owner;
  this.name = piece.name;
  this.nariName = piece.nariName;
  this.goSuji = suji;
  this.goDan = dan;
  
  windows.push("Naru option");

  this.show = function() {
    // console.log(this.x);
    // console.log(this.y);

    push();

    if (this.owner === "SENTE") {
      this.x = width - this.goSuji*w - w / 2;
      this.y = this.goDan*w;
      translate(this.x, this.y);
      this.unit = w * 0.8;

      rectMode(CENTER);
      fill(220, 132, 55);
      rect(w / 2, -w / 2, this.unit, this.unit);
      rect(-w / 2, -w / 2, this.unit, this.unit);

      let v = this.unit / 10;
      translate(1, 1); // because it doesn't look very centered without this
      push();
      drawPiece(v, -w/2, -w/2);
      drawPiece(v, w);
      pop();
      // if (this.nariName.length === 2) {
      //   textSize(v*2.5);
      //   text(this.nariName[0], 0, -7)
      //   textSize(v*3);
      //   text(this.nariName[1], 0, 5)
      // } else {
      //   text(this.nariName, 0, 2);
      // }
      push();
      translate(0, 1);
      textAlign(CENTER, CENTER);
      textSize(this.unit * 0.4)
      fill(0);
      stroke(0);
      strokeWeight(0.8);
      text("成", -w / 2, -w / 2);
      text("不", w / 2, -w / 2);
      pop();
      fill(0);
      // ellipse(0, 0, 5);
    
    } else if (this.owner === "GOTE") {
      this.x = width - this.suji*w - w / 2;
      this.y = this.dan*w + w;
      translate(this.x, this.y);
      this.unit = w * 0.8;

      rotate(PI);

      rectMode(CENTER);
      fill(220, 132, 55);
      rect(w / 2, -w / 2, this.unit, this.unit);
      rect(-w / 2, -w / 2, this.unit, this.unit);

      let v = this.unit / 10;
      translate(0, 1); // because it doesn't look very centered without this
      push();
      drawPiece(v, -w/2, -w/2);
      drawPiece(v, w);
      pop();


      // if (this.nariName.length === 2) {
      //   textSize(v*2.5);
      //   text(this.nariName[0], 0, -7)
      //   textSize(v*3);
      //   text(this.nariName[1], 0, 5)
      // } else {
      //   text(this.nariName, 0, 2);
      // }
      push();
      translate(0, 1);
      textAlign(CENTER, CENTER);
      textSize(this.unit * 0.4)
      fill(0);
      stroke(0);
      strokeWeight(0.8);
      text("成", -w / 2, -w / 2);
      text("不", w / 2, -w / 2);
      pop();
      fill(0);
      // ellipse(0, 0, 5);
    }
    
    pop();
  }
}

function yesNaru() {
  selected.nari = true;
  let checkedNaru = true;
  movePiece(selected, naru.goSuji, naru.goDan, checkedNaru);
  windows.pop();
}

function noNaru() {
  let checkedNaru = true;
  movePiece(selected, naru.goSuji, naru.goDan, checkedNaru);
  windows.pop();
}