class Player
{
    constructor()
    {
        this.nick = "";
        this.position = "";
    }
}

var players = [new Player(), new Player(), new Player(), new Player(), new Player(), new Player(),
               new Player(), new Player(), new Player(), new Player()];
var roles = ["Top", "Jungle", "Mid", "Bottom", "Support"];
function randomizePlayers()
{
    var team1 = [...players];
    var team2 = [];
    var positions = ["Top", "Top", "Jungle", "Jungle", "Mid", "Mid", "Bottom", "Bottom", "Support", "Support"];
    var team = [];

    for(var x = 0; x < 10; x++)
    {
        players[x].nick = document.getElementById("nick" + (x + 1)).value;
        if(document.getElementById("check" + (x + 1)).checked == true)
        {
            let pos = document.getElementById("position" + (x + 1)).value;
            if(positions.indexOf(pos) != -1)
            {
                players[x].position = pos;
                players[x].previousPosition = pos;
                players[x].forcedPosition = true;
                positions.splice(positions.indexOf(pos), 1);
            }
            else
            {
                uncheckAll();
                alert("You assigned too many players to the same position!");              
                return;
            }
        }
        else
        {
            players[x].position = "";
            players[x].previousPosition = "";
        }
    }

    for (var i = team1.length - 1; i > 0; i--) 
    {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = team1[i];
        team1[i] = team1[j];
        team1[j] = temp;
    }

    for(var y = 0; y < 10; y++)
    {
        if(players[y].position == "")
        {   
            var rand = Math.floor(Math.random() * positions.length);
            players[y].position = positions[rand];
            positions.splice(rand, 1);
        }
    }

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
    var checkbox = document.getElementsByClassName("check");
    for(var e = 0; e < checkbox.length; e++)
    {
        checkbox[e].checked = false;
    }
}

function setTeams(team1, team2)
{
    var table = document.getElementById("teamTable");
    for(var f = 1; f < 6; f++)
    {
        table.rows[f].cells[0].innerHTML = team1[team1.map(item => {return item.position}).indexOf(roles[f - 1])].nick;
        table.rows[f].cells[2].innerHTML = team2[team2.map(item => {return item.position}).indexOf(roles[f - 1])].nick;
    }
    document.getElementById("results").style.display = "flex";
    document.getElementById("submit").disabled = true;
}

function closeResults()
{
    players.forEach(item => 
    {
        item.forcedPosition = false;
        item.previousPosition = "";
    });
    document.getElementById("results").style.display = "none";
    document.getElementById("submit").disabled = false;
}
