import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-randomizer-dialog',
  templateUrl: './randomizer-dialog.component.html',
  styleUrls: ['./randomizer-dialog.component.css']
})
export class RandomizerDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<RandomizerDialogComponent>) { }

  numberOfPlayers = 5;
  gameType = 'MOBA';

  ngOnInit(): void {
  }

  exit(): void {
    this.dialogRef.close();
  }

  save() {
    this.dialogRef.close({numberOfPlayers: this.numberOfPlayers, gameType: this.gameType});
  }
}
