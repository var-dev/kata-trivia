interface PenaltyBox{
    get isPenalty():boolean;
    reportStatus(roll:number):void;
    isAdvancing(roll: number): boolean
    calculatePlace(currentPlace: number, roll:number):number;
    
}
class PenaltyBoxIn implements PenaltyBox{
    constructor(private player:Player){}
    get isPenalty(): boolean { return true }
    isAdvancing(roll:number): boolean {
        return (roll % 2 !== 0)
    }
    calculatePlace(currentPlace: number, roll:number):number{
        if(!this.isAdvancing(roll)){
            return currentPlace;
        }
        let playerNewPlace = currentPlace + roll;
        if (playerNewPlace > 11) {
            playerNewPlace -= 12;
        }
        return playerNewPlace
    }
    reportStatus(roll: number): void {
        if (this.isAdvancing(roll)) {
            console.log(this.player.name + " is getting out of the penalty box")
        } else {
            console.log(this.player.name + " is not getting out of the penalty box");
        }
    }
}

class PenaltyBoxOut implements PenaltyBox{
    constructor(private player:Player){}
    get isPenalty(): boolean { return false }
    isAdvancing(roll:number): boolean { return true}
    calculatePlace(currentPlace: number, roll: number): number {
        let playerPlace = currentPlace + roll;
            if (playerPlace > 11) {
                playerPlace -= 12;
            }
        return playerPlace
    }
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
        this.isAdvancing = this.penaltyBox.isAdvancing(roll)
        this.playerPlace = this.penaltyBox.calculatePlace(this.playerPlace, roll);
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
        this.currPlayer.reportPenaltyStatus(roll);
        if (this.currPlayer.isAdvancing) {
            console.log(this.currPlayer + "'s new location is " + this.currPlayer.currentPlace);
            console.log("The category is " + this.currentCategory());
            this.askQuestion();
        }
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
        this.currPlayer!.purse += 1;
        var winner = this.didPlayerWin();
        console.log("Answer was correct!!!!");
        console.log(this.currPlayer + " now has " + this.currPlayer!?.purse + " Gold Coins.");
        this.nextPlayerTurn();
        return winner;
    }


    private nextPlayerTurn() {
        this.currentPlayer += 1;
        if (this.currentPlayer === this.players.length)
            this.currentPlayer = 0;
        this.currPlayer = this.players[this.currentPlayer]!;
    }
}

