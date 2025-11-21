interface PenaltyBox{
    get isPenalty():boolean;
    reportStatus(roll:number):void;
    
}
class PenaltyBoxIn implements PenaltyBox{
    constructor(private player:Player){}
    get isPenalty(): boolean { return true }
    reportStatus(roll: number): void {
        
        if (roll % 2 !== 0) {
            console.log(this.player.name + " is not getting out of the penalty box");
        } else {
            console.log(this.player.name + " is getting out of the penalty box")
            this.player.getOutOfPenaltyBox();
        }
    }
}

class PenaltyBoxOut implements PenaltyBox{
    constructor(private player:Player){}
    get isPenalty(): boolean { return false }
    reportStatus(roll: number): void {}
}


class Player {
    public purse: number = 0;
    private penaltyBox: PenaltyBox = new PenaltyBoxOut(this);
    private playerPlace = 0;
    public isAdvancing = true;
    constructor(public readonly name: string, public readonly playerNumber: number) {
        console.log(name + " was added");
        console.log("They are player number " + this.playerNumber);
    }
    public toString(): string {
        return this.name;
    }
    set currentPlace(roll: number) {
        this.isAdvancing = !(this.isPenaltyBox && (roll % 2 === 0))
        if(this.isAdvancing){
            this.playerPlace += roll;
            if (this.playerPlace > 11) {
                this.playerPlace -= 12;
            }
        }
    }
    get currentPlace(): number {
        return this.playerPlace;
    }
    get isCurrentPlaceEven(){
        return this.playerPlace % 2 === 0;
    }
    goToPenaltyBox(){
        this.penaltyBox = new PenaltyBoxIn(this);
    }
    getOutOfPenaltyBox(){
        this.penaltyBox = new PenaltyBoxOut(this);
    }
    get isPenaltyBox():boolean{
        return this.penaltyBox.isPenalty;
    }
    reportPenaltyStatus(roll: number){
        this.penaltyBox.reportStatus(roll);
    }
}

export class Game {

    private players: Array<Player> = [];
    private currentPlayer: number = 0;
    private currPlayer: Player = this.players[0]!;

    private popQuestions: Array<string> = [];
    private scienceQuestions: Array<string> = [];
    private sportsQuestions: Array<string> = [];
    private rockQuestions: Array<string> = [];

    constructor() {

        for (let i = 0; i < 50; i++) {
            this.popQuestions.push("Pop Question " + i);
            this.scienceQuestions.push("Science Question " + i);
            this.sportsQuestions.push("Sports Question " + i);
            this.rockQuestions.push(this.createRockQuestion(i));
          }
    }

    private createRockQuestion(index: number): string {
        return "Rock Question " + index;
    }

    public add(name: string): boolean {
        this.players.push(new Player(name, this.players.length + 1));
        this.currPlayer = this.players[0]!;
        return true;
    }

    public roll(roll: number) {
        this.currPlayer.currentPlace = roll;
        console.log(this.currPlayer + " is the current player");
        console.log("They have rolled a " + roll);
    
        if (!this.currPlayer.isAdvancing
        ) {
            
            console.log(this.currPlayer + " is not getting out of the penalty box");
            return
        }
        
        if (this.currPlayer.isPenaltyBox){
            console.log(this.currPlayer + " is getting out of the penalty box");
        }
        console.log(this.currPlayer + "'s new location is " + this.currPlayer.currentPlace);
        console.log("The category is " + this.currentCategory());
        this.askQuestion();
    }

    private askQuestion(): void {
        if (this.currentCategory() == 'Pop')
            console.log(this.popQuestions.shift());
        if (this.currentCategory() == 'Science')
            console.log(this.scienceQuestions.shift());
        if (this.currentCategory() == 'Sports')
            console.log(this.sportsQuestions.shift());
        if (this.currentCategory() == 'Rock')
            console.log(this.rockQuestions.shift());
    }

    private currentCategory(): string {
        if (this.currPlayer!.currentPlace == 0)
            return 'Pop';
        if (this.currPlayer!.currentPlace == 4)
            return 'Pop';
        if (this.currPlayer!.currentPlace == 8)
            return 'Pop';
        if (this.currPlayer!.currentPlace == 1)
            return 'Science';
        if (this.currPlayer!.currentPlace == 5)
            return 'Science';
        if (this.currPlayer!.currentPlace == 9)
            return 'Science';
        if (this.currPlayer!.currentPlace == 2)
            return 'Sports';
        if (this.currPlayer!.currentPlace == 6)
            return 'Sports';
        if (this.currPlayer!.currentPlace == 10)
            return 'Sports';
        return 'Rock';
    }

    private didPlayerWin(): boolean {
        return (this.currPlayer!?.purse !== 6)
    }

    public wrongAnswer(): boolean {
        console.log('Question was incorrectly answered');
        console.log(this.currPlayer! + " was sent to the penalty box");
        this.currPlayer.goToPenaltyBox();
    
        this.nextPlayerTurn();
        return true;
    }

    public wasCorrectlyAnswered(): boolean {
        if (!this.currPlayer.isAdvancing) {
            this.nextPlayerTurn();
            return true;
        }
        console.log("Answer was correct!!!!");
        this.currPlayer!.purse += 1;
        console.log(this.currPlayer! + " now has " +
        this.currPlayer!?.purse + " Gold Coins.");
        var winner = this.didPlayerWin();
        this.nextPlayerTurn();
        return winner;
    }


    private nextPlayerTurn() {
        this.currentPlayer += 1;
        if (this.currentPlayer == this.players.length)
            this.currentPlayer = 0;
        this.currPlayer = this.players[this.currentPlayer]!;
    }
}

