
function checkCell(suji, dan) {
  return b[suji][dan];
}

function Cell(i, j) {
	this.suji = i;
  this.dan = j;
  this.area = undefined;
  // this.goteArea = false;
  // this.senteArea = false;
  this.outside = false;
  
  if (this.dan > 0 && this.dan <= 3 && this.suji > 0 && this.suji <= 9) {
    this.area = "GOTE";
  } else if (this.dan >= 7 && this.dan < 10 && this.suji > 0 && this.suji <= 9) {
    this.area = "SENTE";
  } else if (this.dan < 1 || this.dan > 9 || this.suji < 1 || this.suji > 9) {
    this.outside = "OUTSIDE";
  }

  this.show = function() {
    let x = width - this.suji*w - w; // change to this.suji*pW
    let y = this.dan*w; // change to this.dan*pH

    stroke(0);
    fill(220, 132, 55);
    this.isSelected = false;
    this.selectedCanMoveHere = false;
    if (selected) {
      if (selected.suji === this.suji && selected.dan === this.dan) {
        this.isSelected = true;
      } else {
        for (let lm of selected.legalMoves) {
          if (lm.x === this.suji && lm.y === this.dan) {
            this.selectedCanMoveHere = true;
          }
        }
      }
    }

    if (this.isSelected) {
      fill(0);
    } else if (this.selectedCanMoveHere) {
      fill (100);
    }

    if (!this.outside) {
      rect(x, y, w, w);
    }
    if (this.outside) {
      fill(150);
      strokeWeight(1);
      textAlign(CENTER, CENTER);
      if (this.suji >= 11 || this.dan >= 11) {
        fill(255);
        noStroke();
        rect(x, y, w, w);
      } else if (this.suji != 0 && this.suji <= 9 && this.dan === 0) {
        push();
        translate(x + w / 2, y + w / 2);
        text(this.suji, 0, 0);
        pop();
      } else if (this.suji === 0 && this.dan != 0 && this.dan <= 9) {
        push();
        translate(x + w / 2, y + w / 2);
        text(this.dan, 0, 0);
        pop();
      } else if (this.suji === 0 && this.dan === 10) {
        push();
        translate(x + w / 2, y + w / 2);
        textSize(24);
        text("段", 0, 0);
        pop();
      } else if (this.suji === 10 && this.dan === 0) {
        push();
        translate(x + w / 2, y + w / 2);
        textSize(24);
        text("筋", 0, 0);
        pop();
      } else if (this.suji === 10 && this.dan === 5 && teban === "GOTE") {
        push();
        translate(x + w / 2, y + w / 2);
        textSize(18);
        text("後手", 0, 0);
        pop();
      } else if (this.suji === 5 && this.dan === 10 && teban === "SENTE") {
        push();
        translate(x + w / 2, y + w / 2);
        textSize(18);
        text("先手", 0, 0);
        pop();
      }
    }
  }
}
