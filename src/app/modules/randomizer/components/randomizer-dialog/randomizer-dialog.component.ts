import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Player } from '../../models/player.model';
import { RandomizerService } from '../../services/randomizer.service';

@Component({
  selector: 'app-randomizer-dialog',
  templateUrl: './randomizer-dialog.component.html',
  styleUrls: ['./randomizer-dialog.component.css']
})
export class RandomizerDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<RandomizerDialogComponent>, private randomizerService: RandomizerService) { }

  numberOfPlayers = 5;
  gameType = 'MOBA';
  players: Player[];
  loadNicks;

  ngOnInit(): void {
    const data = this.randomizerService.loadNicks();
    if (data) {
      this.players = data;
    }
  }

  log(t: any) {
    console.log(t);
  }

  exit(): void {
    this.dialogRef.close();
  }

  save() {
    console.log(this.loadNicks)
    this.dialogRef.close({numberOfPlayers: this.numberOfPlayers, gameType: this.gameType, loadedPlayers: this.loadNicks ? this.players : undefined});
  }
}
