type PlayerName = string;
type PlayerNumber = number;
interface PenaltyBox{
    reportStatus(roll:number, playerName: PlayerName):string;
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
    reportStatus(roll: number, playerName: PlayerName): string {
        if (this.isPlayerAdvancing(roll)) {
            return playerName + " is getting out of the penalty box"
        } else {
            return playerName + " is not getting out of the penalty box";
        }
    }
}

class PenaltyBoxOut implements PenaltyBox{
    isPlayerAdvancing(roll: number): boolean { return true}
    calculatePlace(currentPlace: number, roll: number): number {
        let playerPlace = currentPlace + roll;
            if (playerPlace > 11) {
                playerPlace -= 12;
            }
        return playerPlace
    }
    reportStatus(roll: number, playerName: PlayerName): string { return ''}
}


class Player {
    private static _players: Array<Player> = [];
    private static _currentPlayerIndex: number = 0;
    static _currentPlayer: Player = this._players[this._currentPlayerIndex]!;
    public static get currentPlayer(): Player {
        return Player._currentPlayer;
    }

    public static addPlayer(name: PlayerName):[PlayerName, PlayerNumber] {
        this._players.push(new Player(name));
        this._currentPlayer = this._players[this._currentPlayerIndex]!;
        return [name, this._players.length]
    }
    public static nextPlayerTurn() {
        this._currentPlayerIndex += 1;
        if (this._currentPlayerIndex === this._players.length)
            this._currentPlayerIndex = 0;
        this._currentPlayer = this._players[this._currentPlayerIndex]!;
    }

    private _purse: number = 0;
    private _penaltyBox: PenaltyBox = new PenaltyBoxOut();
    private _playerPlace = 0;
    private _isAdvancing = true;


    private constructor(public readonly name: PlayerName) {
        
    }
    public toString(): string {
        return this.name;
    }
    set currentPlace(roll: number) {
        this._isAdvancing = this._penaltyBox.isPlayerAdvancing(roll)
        this._playerPlace = this._penaltyBox.calculatePlace(this._playerPlace, roll);
    }
    get currentPlace(): number {
        return this._playerPlace;
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
        this._penaltyBox = new PenaltyBoxIn();
    }
    getOutOfPenaltyBox(){
        this._penaltyBox = new PenaltyBoxOut();
    }
    consoleLogPenaltyStatus(roll: number){
        const result = this._penaltyBox.reportStatus(roll, this.name);
        if(result !== ''){
            console.log(result);
        }
    }
}

export class Game {
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
        const [playerName, playerNumber] = Player.addPlayer(name);
        console.log(playerName + " was added");
        console.log("They are player number " + playerNumber);
        return true;
    }
    public roll(roll: number) {
        Player.currentPlayer.currentPlace = roll;
        console.log(Player.currentPlayer + " is the current player");
        console.log("They have rolled a " + roll);
        Player.currentPlayer.consoleLogPenaltyStatus(roll);
        if (Player.currentPlayer.isAdvancing) {
            console.log(Player.currentPlayer + "'s new location is " + Player.currentPlayer.currentPlace);
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
        if (Player.currentPlayer!.currentPlace == 0)
            return 'Pop';
        if (Player.currentPlayer!.currentPlace == 4)
            return 'Pop';
        if (Player.currentPlayer!.currentPlace == 8)
            return 'Pop';
        if (Player.currentPlayer!.currentPlace == 1)
            return 'Science';
        if (Player.currentPlayer!.currentPlace == 5)
            return 'Science';
        if (Player.currentPlayer!.currentPlace == 9)
            return 'Science';
        if (Player.currentPlayer!.currentPlace == 2)
            return 'Sports';
        if (Player.currentPlayer!.currentPlace == 6)
            return 'Sports';
        if (Player.currentPlayer!.currentPlace == 10)
            return 'Sports';
        return 'Rock';
    }
    private didPlayerWin(): boolean {
        return (Player.currentPlayer.purse !== 6)
    }
    public wrongAnswer(): boolean {
        console.log('Question was incorrectly answered');
        console.log(Player.currentPlayer + " was sent to the penalty box");
        Player.currentPlayer.goToPenaltyBox();
        Player.nextPlayerTurn();
        return true;
    }
    public wasCorrectlyAnswered(): boolean {
        if (!Player.currentPlayer.isAdvancing) {
            Player.nextPlayerTurn();
            return true;
        }
        Player.currentPlayer.incrementPurse();
        let winner = this.didPlayerWin();
        console.log("Answer was correct!!!!");
        console.log(Player.currentPlayer + " now has " + Player.currentPlayer.purse + " Gold Coins.");
        Player.nextPlayerTurn();
        return winner;
    }
}

