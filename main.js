class Player
{
    constructor()
    {
        this.nick = "";
        this.position = "";
        this.previousPosition = "";
        this.avoid = "";
        this.force = "";
    }
}

var players = [new Player(), new Player(), new Player(), new Player(), new Player(), new Player(),
               new Player(), new Player(), new Player(), new Player()];
var roles = ["Top", "Jungle", "Mid", "Bottom", "Support"];

loadNicks();
function randomizePlayers()
{
    var team1 = [...players];
    var team2 = [];
    var positions = ["Top", "Top", "Jungle", "Jungle", "Mid", "Mid", "Bottom", "Bottom", "Support", "Support"];
    var team = [];

    var nicksToSave = [];

    for(var x = 0; x < 10; x++)
    {
        var nick = document.getElementById("nick" + (x + 1)).value;
        players[x].nick = nick;
        nicksToSave.push(nick);
        
        var option = document.querySelector('input[name="option' + (x + 1) + '"]:checked').value;

        switch(option)
        {
            case "random":
                players[x].position = "";
                players[x].force = "";
                players[x].avoid = "";
                break;
            case "force":
                let pos = document.getElementById("position" + (x + 1)).value;
                if(positions.indexOf(pos) != -1)
                {
                    players[x].position = pos;
                    players[x].force = pos;
                    players[x].avoid = "";
                    positions.splice(positions.indexOf(pos), 1);
                }
                else
                {
                    uncheckAll();
                    players[x].position = "";
                    players[x].force = "";
                    players[x].avoid = "";
                    alert("You assigned too many players to the same position!");              
                    return;
                }
                break;
            case "avoid":
                players[x].avoid = document.getElementById("position" + (x + 1)).value;
                players[x].position = "";
                players[x].force = "";
                break;
        }
    }
    localStorage.setItem('nicks', JSON.stringify(nicksToSave));

    for (var i = team1.length - 1; i > 0; i--) 
    {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = team1[i];
        team1[i] = team1[j];
        team1[j] = temp;
    }

    for(var y = 0; y < 10; y++)
    {
        if(team1[y].position == "")
        {   
            var rand = Math.floor(Math.random() * positions.length);
            team1[y].position = positions[rand];
            team1[y].previousPosition = positions[rand];
            positions.splice(rand, 1);
        }
    }
    validatePositions(team1);  

    for(var g = 0; g < 5; g++)
    {
        var playerIndex = team1.map(item => {return item.position}).indexOf(roles[g])
        team2.push(team1[playerIndex]);
        team1.splice(playerIndex, 1);
    }
    setTeams(team1, team2);
}

function uncheckAll()
{
    for(var e = 1; e < 11; e++)
    {
        document.getElementById("rand" + e).checked = true;
    }
}

function setTeams(team1, team2)
{
    var table = document.getElementById("teamTable");
    for(var f = 1; f < 6; f++)
    {   
        table.rows[f].cells[0].innerHTML = team1[team1.map(item => {return item.position;}).indexOf(roles[f - 1])].nick;
        table.rows[f].cells[2].innerHTML = team2[team2.map(item => {return item.position;}).indexOf(roles[f - 1])].nick;
    }
    if(document.getElementById("results").style.display != "flex")
    {
        document.getElementById("results").style.display = "flex";
    }
    document.getElementById("submit").disabled = true;
    
}

function closeResults()
{
    document.getElementById("results").style.display = "none";
    document.getElementById("submit").disabled = false;
}

function loadNicks()
{
    var storedNicks = JSON.parse(localStorage.getItem("nicks"));
    if(storedNicks)
    {
        for(var x = 0; x < storedNicks.length; x++)
        {
            document.getElementById("nick" + (x + 1)).value = storedNicks[x];
        }
    }
}

function validatePositions(team1)
{
    for(var x = 9; x >= 0; x--)
    {
        if(team1[x].force == "" && team1[x].position == team1[x].avoid)
        {
            for(var y = 0; y < 10; y++)
            {
                if(team1[y].force == "" && team1[y].position != team1[x].position && team1[y].avoid != team1[x].position)
                {
                    var temp = team1[y].position;
                    team1[y].position = team1[x].position;
                    team1[x].position = temp;
                    break;
                }
            }
        }
    }
    for(var z = 0; z < 10; z++)
    {
        if(team1[z].position == team1[z].avoid)
        {
            alert("It is impossible to assign positions in that way");
            break;
        }
    }
}

function rollAgain()
{
    var team1 = [...players];
    var team2 = [];
    var positions = ["Top", "Top", "Jungle", "Jungle", "Mid", "Mid", "Bottom", "Bottom", "Support", "Support"];

    team1.forEach(x => 
    {
        if(x.force == "")
            x.position = "";
        else
        {
            positions.splice(positions.indexOf(x.force), 1);
        }
    });

    for (var i = team1.length - 1; i > 0; i--) 
    {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = team1[i];
        team1[i] = team1[j];
        team1[j] = temp;
    }

    for(var y = 0; y < 10; y++)
    {
        if(team1[y].position == "")
        {   
            var rand = Math.floor(Math.random() * positions.length);
            team1[y].position = positions[rand];
            positions.splice(rand, 1);
        }
    }
    validatePositions(team1);

    for(var x = 9; x >= 0; x--)
    {
        if(team1[x].force == "" && team1[x].position == team1[x].previousPosition)
        {
            for(var y = 0; y < 10; y++)
            {
                if(team1[y].force == "" && team1[y].position != team1[x].previousPosition && team1[y].previousPosition != team1[x].position && team1[y].avoid != team1[x].position && team1[y].position != team1[x].avoid)
                {
                    var temp = team1[y].position;
                    team1[y].position = team1[x].position;
                    team1[x].position = temp;
                    break;
                }
            }
        }
    }

    for(var z = 0; z < 10; z++)
    {
        if(team1[z].position == team1[z].previousPosition && team1[z].force == "")
        {
            alert("Assigning new position wasn't successfull in each case");
            break;
        }
    }

    team1.forEach(x => 
    {
        x.previousPosition = x.position;
    });

    for(var g = 0; g < 5; g++)
    {
        var playerIndex = team1.map(item => {return item.position}).indexOf(roles[g])
        team2.push(team1[playerIndex]);
        team1.splice(playerIndex, 1);
    }
    setTeams(team1, team2);
}