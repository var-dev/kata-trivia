class Player {
    public isGettingOutOfPenaltyBox: boolean = false;
    public purse: number = 0;
    private playerPlace = 0;
    constructor(public readonly name: string, public readonly playerNumber: number) {
        console.log(name + " was added");
        console.log("They are player number " + this.playerNumber);
    }
    public toString(): string {
        return this.name;
    }
    set currentPlace(roll: number) {
        // placeholder
        this.playerPlace += roll;
        if (this.playerPlace > 11) {
            this.playerPlace -= 12;
        }
    }
    get currentPlace(): number {
        return this.playerPlace;
    }
}

export class Game {

    private players: Array<Player> = [];
    private inPenaltyBox: Array<boolean> = [];
    private currentPlayer: number = 0;

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
        this.inPenaltyBox[this.lastIndexInPlayersArray()] = false;
        return true;
    }

    private lastIndexInPlayersArray() {
        return this.howManyPlayers() - 1;
    }

    private howManyPlayers(): number {
        return this.players.length;
    }

    public roll(roll: number) {
        console.log(this.players[this.currentPlayer] + " is the current player");
        console.log("They have rolled a " + roll);
    
        if (
            this.inPenaltyBox[this.currentPlayer]
          && roll % 2 === 0
        ) {
            console.log(this.players[this.currentPlayer] + " is not getting out of the penalty box");
            this.players[this.currentPlayer]!.isGettingOutOfPenaltyBox = false;
            return
        } 
        if (this.inPenaltyBox[this.currentPlayer]){
            console.log(this.players[this.currentPlayer] + " is getting out of the penalty box");
            this.players[this.currentPlayer]!.isGettingOutOfPenaltyBox = true;
        }
        this.reportNewPlayerLocation(roll);
        console.log("The category is " + this.currentCategory());
        this.askQuestion();
    }

    private reportNewPlayerLocation(roll:number) {
        this.players[this.currentPlayer]!.currentPlace = roll;
        console.log(this.players[this.currentPlayer] + "'s new location is " + this.players[this.currentPlayer]!.currentPlace);
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
        if (this.players[this.currentPlayer]!.currentPlace == 0)
            return 'Pop';
        if (this.players[this.currentPlayer]!.currentPlace == 4)
            return 'Pop';
        if (this.players[this.currentPlayer]!.currentPlace == 8)
            return 'Pop';
        if (this.players[this.currentPlayer]!.currentPlace == 1)
            return 'Science';
        if (this.players[this.currentPlayer]!.currentPlace == 5)
            return 'Science';
        if (this.players[this.currentPlayer]!.currentPlace == 9)
            return 'Science';
        if (this.players[this.currentPlayer]!.currentPlace == 2)
            return 'Sports';
        if (this.players[this.currentPlayer]!.currentPlace == 6)
            return 'Sports';
        if (this.players[this.currentPlayer]!.currentPlace == 10)
            return 'Sports';
        return 'Rock';
    }

    private didPlayerWin(): boolean {
        return (this.players[this.currentPlayer]?.purse !== 6)
    }

    public wrongAnswer(): boolean {
        console.log('Question was incorrectly answered');
        console.log(this.players[this.currentPlayer] + " was sent to the penalty box");
        this.inPenaltyBox[this.currentPlayer] = true;
    
        this.nextPlayerTurn();
        return true;
    }

    public wasCorrectlyAnswered(): boolean {
        if (this.inPenaltyBox[this.currentPlayer]
            && !this.players[this.currentPlayer]!.isGettingOutOfPenaltyBox
        ) {
            this.nextPlayerTurn();
            return true;
        }
        console.log("Answer was correct!!!!");
        this.players[this.currentPlayer]!.purse += 1;
        console.log(this.players[this.currentPlayer] + " now has " +
        this.players[this.currentPlayer]?.purse + " Gold Coins.");
        var winner = this.didPlayerWin();
        this.nextPlayerTurn();
        return winner;
    }


    private nextPlayerTurn() {
        this.currentPlayer += 1;
        if (this.currentPlayer == this.players.length)
            this.currentPlayer = 0;
    }
}
