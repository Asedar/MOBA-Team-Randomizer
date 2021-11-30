import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Player } from '../models/player.model';
import {cloneDeep} from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class RandomizerService {

  public randomize(players: Player[]){
    players.forEach(player => delete player.assignedPosition);
    let team1 = [...players];
    let team2 = [];
    let positions = ["Top", "Top", "Jungle", "Jungle", "Mid", "Mid", "Bottom", "Bottom", "Support", "Support"];
    let roles = ["Top", "Jungle", "Mid", "Bottom", "Support"];

    players.forEach((player: Player) => {
      if(player.randomizeType == 3) {
        if(positions.indexOf(player.position) != -1) {
          player.assignedPosition = player.position;
          positions.splice(positions.indexOf(player.position), 1);
        }
      }
    })

    for (let i = team1.length - 1; i > 0; i--) 
    {
      let j = Math.floor(Math.random() * (i + 1));
      let temp = team1[i];
      team1[i] = team1[j];
      team1[j] = temp;
    }

    for(let y = 0; y < 10; y++)
    {
      if(!team1[y].assignedPosition)
      {   
        let rand = Math.floor(Math.random() * positions.length);
        team1[y].assignedPosition = positions[rand];
        team1[y].previousPosition = positions[rand];
        positions.splice(rand, 1);
      }
    }
    this.validatePositions(team1);  

    for(let g = 0; g < 5; g++)
    {
      let playerIndex = team1.map(item => {return item.assignedPosition}).indexOf(roles[g])
      team2.push(team1[playerIndex]);
      team1.splice(playerIndex, 1);
    }
    players.forEach((player: Player) =>{
      player.previousPosition = player.assignedPosition;
    })
    return {team1: team1, team2: team2}
  }

  public rollAgain(players: Player[]) {
    players.forEach(player => delete player.assignedPosition);
    let team1 = [...players];
    let team2 = [];
    let positions = ["Top", "Top", "Jungle", "Jungle", "Mid", "Mid", "Bottom", "Bottom", "Support", "Support"];
    let roles = ["Top", "Jungle", "Mid", "Bottom", "Support"];

    team1.forEach((player: Player) => {
      if(player.randomizeType == 3) {
        if(positions.indexOf(player.position) != -1) {
          player.assignedPosition = player.position;
          positions.splice(positions.indexOf(player.position), 1);
        }
      }
    })
  
    for (let i = team1.length - 1; i > 0; i--) 
    {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = team1[i];
        team1[i] = team1[j];
        team1[j] = temp;
    }

    for(let y = 0; y < 10; y++)
    {
        if(!team1[y].assignedPosition)
        {   
            let rand = Math.floor(Math.random() * positions.length);
            team1[y].assignedPosition = positions[rand];
            positions.splice(rand, 1);
        }
    }
    this.validatePositions(team1);

    for(let x = 9; x >= 0; x--)
    {
        if(team1[x].randomizeType != 3 && team1[x].assignedPosition == team1[x].previousPosition)
        {
            for(let y = 0; y < 10; y++)
            {
                if (team1[y].randomizeType != 3 
                  && team1[y].assignedPosition != team1[x].previousPosition 
                  && team1[y].previousPosition != team1[x].assignedPosition 
                  && (team1[y].randomizeType != 2 
                      || (team1[y].randomizeType == 2 
                      && team1[y].position != team1[x].assignedPosition)) 
                  && (team1[x].randomizeType != 2 
                      || (team1[x].randomizeType == 2 
                      && team1[x].position != team1[y].assignedPosition)))
                {
                    let temp = team1[y].assignedPosition;
                    team1[y].assignedPosition = team1[x].assignedPosition;
                    team1[x].assignedPosition = temp;
                    break;
                }
            }
        }
    }
  
    team1.forEach(x => 
    {
        x.previousPosition = x.assignedPosition;
    });

    for(let g = 0; g < 5; g++)
    {
        let playerIndex = team1.map(item => {return item.assignedPosition}).indexOf(roles[g])
        team2.push(team1[playerIndex]);
        team1.splice(playerIndex, 1);
    }
    return {team1: team1, team2: team2}
  }

  private validatePositions(team: Player[]) {
    for(let x = 9; x >= 0; x--)
    {
      if(team[x].randomizeType != 3 && team[x].randomizeType == 2 && team[x].assignedPosition == team[x].position)
      {
        for(let y = 0; y < 10; y++)
        {
          if(team[y].randomizeType != 3 && team[y].assignedPosition != team[x].assignedPosition && (team[y].randomizeType != 3 || (team[y].randomizeType == 3 && team[y].position != team[x].assignedPosition)))
          {
            let temp = team[y].assignedPosition;
            team[y].assignedPosition = team[x].assignedPosition;
            team[x].assignedPosition = temp;
            break;
          }
        }
      }
    }
  }

  randomizeOther(players: Player[]) {
    let team1 = [...players];
    let team2 = [];
    for (let i = team1.length - 1; i > 0; i--) 
    {
      let j = Math.floor(Math.random() * (i + 1));
      let temp = team1[i];
      team1[i] = team1[j];
      team1[j] = temp;
    }
    for(let g = 0; g < players.length / 2; g++)
    {

        team2.push(team1[g]);
        team1.splice(g, 1);
    }
    return {team1: team1, team2: team2};
  }

  saveNicks(players: Player[]): void {
    const data = players.map(player => player.nick);
    localStorage.setItem('players', JSON.stringify(data));
  }

  loadNicks(): Player[] {
    const data = localStorage.getItem('players');
    return JSON.parse(data);
  }

  constructor() { }
}
