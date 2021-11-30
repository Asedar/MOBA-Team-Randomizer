import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { RandomizerDialogComponent } from './components/randomizer-dialog/randomizer-dialog.component';
import { RandomizerResultsComponent } from './components/randomizer-results/randomizer-results.component';
import { Player } from './models/player.model';
import { RandomizerService } from './services/randomizer.service';

@Component({
  selector: 'app-randomizer',
  templateUrl: './randomizer.component.html',
  styleUrls: ['./randomizer.component.css']
})
export class RandomizerComponent implements OnInit {

  constructor(public dialog: MatDialog, private randomizeService: RandomizerService) { }

  players: Player[] = [];
  shouldBeRendered: boolean;
  gameType = 'MOBA';
  playerInputs: FormGroup;
  optionsHidden = true;
  formLoaded = false;

  openDialog(): void {
    this.optionsHidden = false;
    const dialogRef = this.dialog.open(RandomizerDialogComponent, { disableClose: true });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.gameType = result.gameType;
        this.players = [];
        const numberOfPlayers = this.gameType == 'OTHER' ? result.numberOfPlayers : 5
        this.createFormGroup(numberOfPlayers, result.loadedPlayers);
        if(!this.formLoaded && this.gameType === 'MOBA') {
          this.playerInputs.valueChanges.subscribe(change => {
            this.checkPositionSettings();
          })
          this.formLoaded = true;
        }
      }
      this.optionsHidden = true;
    });
  }

  createFormGroup(numberOfPlayers: number, nicks?: string[]) {
    let playerFormTemplate = {};
    for(let i = 0; i < numberOfPlayers * 2; i++) {
      this.players.push(new Player());
      let playerControlTemplate = {input: new FormControl(nicks && nicks[i] ? nicks[i] : '', Validators.required)};
      if(this.gameType === 'MOBA') {
        playerControlTemplate['position'] = new FormControl('Top', Validators.required);
        playerControlTemplate['randomizeType'] = new FormControl('1', Validators.required);
      }
      playerFormTemplate['player' + i] = new FormGroup(playerControlTemplate);
    }
    this.playerInputs = new FormGroup(playerFormTemplate);
  }

  randomize() {
    this.playerInputs.markAllAsTouched();
    if(this.playerInputs.valid) {
      Object.keys(this.playerInputs.controls).forEach((key, index) => {
        this.players[index].nick = (this.playerInputs.controls[key] as FormGroup).get('input').value;
        if(this.gameType === 'MOBA') {
          this.players[index].randomizeType = (this.playerInputs.controls[key] as FormGroup).get('randomizeType').value;
          this.players[index].position = (this.playerInputs.controls[key] as FormGroup).get('position').value;
        }
      });
      this.randomizeService.saveNicks(this.players)
      let result;
      if(this.gameType === 'MOBA') {
        console.log(this.players)
        result = this.randomizeService.randomize(this.players);
        console.log(result)
      } 
      else {
        result = this.randomizeService.randomizeOther(this.players);
      }
      this.showResults(result.team1, result.team2);
    }
  }

  checkPositionSettings() {
    let forced: Map<string, number> = new Map<string, number>();
    let avoided: Map<string, number> = new Map<string, number>();

    for(const key in this.playerInputs.controls) {
      let position = (this.playerInputs.controls[key] as FormGroup).get('position').value;
      let type = (this.playerInputs.controls[key] as FormGroup).get('randomizeType').value;
      if(type == 2) {
        if(avoided.has(position)) {
          let count = avoided.get(position);
          avoided.set(position, count + 1);
          if (avoided.get(position) > 8) {
            return 'avoided';
          }
        } 
        else {
          avoided.set(position, 1);
        }
      }
      else if (type == 3) {
        if(forced.has(position)) {
          let count = forced.get(position);
          forced.set(position, count + 1);
          if (forced.get(position) > 2) {
            return 'forced';
          }
        } 
        else {
          forced.set(position, 1);
        }
      }
    }
    return ''
  }

  showResults(team1: Player[], team2: Player[]){
    const data = {
      playerInputs: this.playerInputs,
      team1: team1,
      team2: team2,
      players: this.players,
      gameType: this.gameType
    }
    const dialogRef = this.dialog.open(RandomizerResultsComponent, { disableClose: true, data: data });
  }

  ngOnInit(): void {
    this.createFormGroup(5);
    this.openDialog();
  }

}
