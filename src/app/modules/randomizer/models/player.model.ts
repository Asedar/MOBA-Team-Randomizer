export class Player{

    nick: string;
    position?: string;
    randomizeType: number;
    assignedPosition: string;
    previousPosition?: string;

    constructor(nick?: string) {
        if (nick) {
            this.nick = nick;
        }
    }
}