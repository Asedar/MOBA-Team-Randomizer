import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Player } from '../../models/player.model';
import { RandomizerService } from '../../services/randomizer.service';

export interface DialogData {
  playerInputs: FormGroup;
  team1: Player[];
  team2: Player[];
  players: Player[];
  gameType: string
}

@Component({
  selector: 'app-randomizer-results',
  templateUrl: './randomizer-results.component.html',
  styleUrls: ['./randomizer-results.component.css']
})
export class RandomizerResultsComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData, 
    public dialogRef: MatDialogRef<RandomizerResultsComponent>,
    private randomizerService: RandomizerService
  ) { }

  ngOnInit(): void {
    console.log(this.data.team1);
    console.log(this.data.team2)
  }

  getTeam1(position: string) {
    return this.data.team1.find(item => item.assignedPosition == position).nick;
  }

  getTeam2(position: string) {
    return this.data.team2.find(item => item.assignedPosition == position).nick;
  }

  exit(): void {
    this.dialogRef.close();
  }

  rollAgain() {
    let result;
    if(this.data.gameType == 'MOBA') {
      result = this.randomizerService.rollAgain(this.data.players);
    }
    else {
      result = this.randomizerService.randomizeOther(this.data.players);
    }
    this.data.team1 = result.team1;
    this.data.team2 = result.team2;
  }

}
