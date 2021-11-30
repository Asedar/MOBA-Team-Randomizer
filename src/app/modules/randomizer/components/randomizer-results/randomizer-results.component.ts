import { Component, Inject, OnChanges, OnInit } from '@angular/core';
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
export class RandomizerResultsComponent implements OnInit, OnChanges {

  results: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData, 
    public dialogRef: MatDialogRef<RandomizerResultsComponent>,
    private randomizerService: RandomizerService
  ) { }

  ngOnInit(): void {
    this.results = this.data
  }

  ngOnChanges(): void {
    this.results = this.data
  }

  getTeam1(position: string) {
    return this.results.team1.find(item => item.assignedPosition == position).nick;
  }

  getTeam2(position: string) {
    return this.results.team2.find(item => item.assignedPosition == position).nick;
  }

  exit(): void {
    this.dialogRef.close();
  }

  rollAgain() {
    let result;
    if(this.results.gameType == 'MOBA') {
      result = this.randomizerService.rollAgain(this.results.players);
    }
    else {
      result = this.randomizerService.randomizeOther(this.results.players);
    }
    this.results.team1 = result.team1;
    this.results.team2 = result.team2;
  }

}
