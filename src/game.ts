type PlayerName = string;
type PlayerNumber = number;
interface PenaltyBox{
    reportStatus(roll:number, playerName:string):string;
    isPlayerAdvancing(roll: number): boolean
    calculatePlace(currentPlace: number, roll:number):number;
    
}
class PenaltyBoxIn implements PenaltyBox{
    isPlayerAdvancing(roll:number): boolean {
        return (roll % 2 !== 0)
    }
    calculatePlace(currentPlace: number, roll:number):number{
        if(!this.isPlayerAdvancing(roll)){
            return currentPlace;
        }
        let playerNewPlace = currentPlace + roll;
        if (playerNewPlace > 11) {
            playerNewPlace -= 12;
        }
        return playerNewPlace
    }
    reportStatus(roll: number, playerName:string): string {
        if (this.isPlayerAdvancing(roll)) {
            return playerName + " is getting out of the penalty box"
        } else {
            return playerName + " is not getting out of the penalty box";
        }
    }
}

class PenaltyBoxOut implements PenaltyBox{
    isPlayerAdvancing(roll:number): boolean { return true}
    calculatePlace(currentPlace: number, roll: number): number {
        let playerPlace = currentPlace + roll;
            if (playerPlace > 11) {
                playerPlace -= 12;
            }
        return playerPlace
    }
    reportStatus(roll: number, playerName:string): string { return ''}
}


class Player {
    private static _players: Array<Player> = [];
    private static _currentPlayerIndex: number = 0;
    public static readonly currentPlayer: Player = Player._players[Player._currentPlayerIndex]!;
    public static addPlayer(name: PlayerName):[PlayerName, PlayerNumber] {
        let playerNumber = Player._players.length + 1
        Player._players.push(new Player(name, playerNumber));
        return [name, playerNumber]
    }
    public static nextPlayerTurn() {
        Player._currentPlayerIndex += 1;
        if (Player._currentPlayerIndex === Player._players.length)
            Player._currentPlayerIndex = 0;
        // @ts-ignore
        Player.currentPlayer = Player._players[Player._currentPlayerIndex]!;
    }

    private _purse: number = 0;
    private penaltyBox: PenaltyBox = new PenaltyBoxOut();
    private playerPlace = 0;
    private _isAdvancing = true;


    constructor(public readonly name: string, public readonly playerNumber: number) {
        console.log(name + " was added");
        console.log("They are player number " + this.playerNumber);
    }
    public toString(): string {
        return this.name;
    }
    set currentPlace(roll: number) {
        this._isAdvancing = this.penaltyBox.isPlayerAdvancing(roll)
        this.playerPlace = this.penaltyBox.calculatePlace(this.playerPlace, roll);
    }
    get currentPlace(): number {
        return this.playerPlace;
    }
     public get purse(): number {
        return this._purse;
    }
    public incrementPurse(): void {
        this._purse++;
    }
    public get isAdvancing() {
        return this._isAdvancing;
    }
    goToPenaltyBox(){
        this.penaltyBox = new PenaltyBoxIn();
    }
    getOutOfPenaltyBox(){
        this.penaltyBox = new PenaltyBoxOut();
    }
    reportPenaltyStatus(roll: number){
        const result = this.penaltyBox.reportStatus(roll, this.name);
        if(result !== ''){
            console.log(result);
        }
    }
}

export class Game {
    private players: Array<Player> = [];
    private currentPlayerIndex: number = 0;
    private currentPlayer: Player = this.players[0]!;

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
        this.currentPlayer = this.players[0]!;
        return true;
    }
    public roll(roll: number) {
        this.currentPlayer.currentPlace = roll;
        console.log(this.currentPlayer + " is the current player");
        console.log("They have rolled a " + roll);
        this.currentPlayer.reportPenaltyStatus(roll);
        if (this.currentPlayer.isAdvancing) {
            console.log(this.currentPlayer + "'s new location is " + this.currentPlayer.currentPlace);
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
        if (this.currentPlayer!.currentPlace == 0)
            return 'Pop';
        if (this.currentPlayer!.currentPlace == 4)
            return 'Pop';
        if (this.currentPlayer!.currentPlace == 8)
            return 'Pop';
        if (this.currentPlayer!.currentPlace == 1)
            return 'Science';
        if (this.currentPlayer!.currentPlace == 5)
            return 'Science';
        if (this.currentPlayer!.currentPlace == 9)
            return 'Science';
        if (this.currentPlayer!.currentPlace == 2)
            return 'Sports';
        if (this.currentPlayer!.currentPlace == 6)
            return 'Sports';
        if (this.currentPlayer!.currentPlace == 10)
            return 'Sports';
        return 'Rock';
    }
    private didPlayerWin(): boolean {
        return (this.currentPlayer.purse !== 6)
    }
    public wrongAnswer(): boolean {
        console.log('Question was incorrectly answered');
        console.log(this.currentPlayer + " was sent to the penalty box");
        this.currentPlayer.goToPenaltyBox();
        this.nextPlayerTurn();
        return true;
    }
    public wasCorrectlyAnswered(): boolean {
        if (!this.currentPlayer.isAdvancing) {
            this.nextPlayerTurn();
            return true;
        }
        this.currentPlayer.incrementPurse();
        var winner = this.didPlayerWin();
        console.log("Answer was correct!!!!");
        console.log(this.currentPlayer + " now has " + this.currentPlayer.purse + " Gold Coins.");
        this.nextPlayerTurn();
        return winner;
    }
    private nextPlayerTurn() {
        this.currentPlayerIndex += 1;
        if (this.currentPlayerIndex === this.players.length)
            this.currentPlayerIndex = 0;
        this.currentPlayer = this.players[this.currentPlayerIndex]!;
    }
}

