'use strict';
const gameSetup = document.getElementById('gameSetup');
const game = document.getElementById('game');
const gameTable = document.getElementById('game-table');
const suggestionButtons = document.getElementById('suggestionButtons');
const noneButton = document.getElementById('noneButton');
const suspectButton = document.getElementById('suspectButton');
const weaponButton = document.getElementById('weaponButton');
const roomButton = document.getElementById('roomButton');
const unknownButton = document.getElementById('unknownButton');
const suggestionArea = document.getElementById('suggestionArea');
const suggestionText = document.getElementById('suggestionText');
const helperArea = document.getElementById('helperArea');

//refrence
//suggestionText.children[0]//suggester
//suggestionText.children[2]//suggestee
//suggestionText.children[4]//suspect
//suggestionText.children[5]//weapon
//suggestionText.children[6]//room

//GAME SETUP
const playerName0 = document.getElementById('playerName0');
const playerName1 = document.getElementById('playerName1');
const playerName2 = document.getElementById('playerName2');
const playerName3 = document.getElementById('playerName3');
const playerName4 = document.getElementById('playerName4');
const playerName5 = document.getElementById('playerName5');

var playerNames = []

let numPlayers = 6;
let numCardsPerPlayer = 3;
let numGlobalCards = 0;
let numStartingCards = 3;
let knownMasterCards = 0;

function CreateGame() {
    AddNewPlayers();

    if (numPlayers < 3) {
        alert(`You need at least 3 players to play clue, only ${numPlayers} name(s) have been entered`)
        return;
    }

    numCardsPerPlayer = Math.floor(18 / playerNames.length);

    numGlobalCards = 18 - playerNames.length * numCardsPerPlayer;

    numStartingCards = numCardsPerPlayer + numGlobalCards;

    console.log(`New Game: ${playerNames.length} players: ${playerNames}. ${numCardsPerPlayer} cards per player. ${numGlobalCards} global cards`);

    CreatePlayers();
    RemovePlayerRows();
    game.classList.remove('hidden');
    gameSetup.classList.add('hidden');

    WriteAllPlayerNameCells();

    if (playerGlobal.knownCards === numGlobalCards) {
        document.getElementById('row_global').classList.remove('pointer');
        helperArea.textContent = 'ENTER YOUR STARTING CARDS';
    }
}

function AddNewPlayers() {
    playerNames = [];
    numPlayers = 0;

    if (playerName0.value === '') {
        return;
    }
    numPlayers++;
    playerNames[0] = playerName0.value;

    if (playerName1.value === '') {
        return;
    }
    numPlayers++;
    playerNames[1] = playerName1.value;

    if (playerName2.value === '') {
        return;
    }
    numPlayers++;
    playerNames[2] = playerName2.value;

    if (playerName3.value === '') {
        return;
    }
    numPlayers++;
    playerNames[3] = playerName3.value;

    if (playerName4.value === '') {
        return;
    }
    numPlayers++;
    playerNames[4] = playerName4.value;

    if (playerName5.value === '') {
        return;
    }
    numPlayers++;
    playerNames[5] = playerName5.value;

}

function WriteAllPlayerNameCells() {
    for (let i = 0; i < players.length; i++) {
        WritePlayerNameCell(i, 0);
    }
}

function truncateString(str, num) {
    // If the length of str is less than or equal to num
    // just return str--don't truncate it.
    if (str.length <= num) {
        return str;
    }
    // Return str truncated with '...' concatenated to the end of str.
    return str.slice(0, num);
}

function RemovePlayerRows() {
    for (let i = 6; i > numPlayers; i--) {
        gameTable.children[1].children[i].classList.add('hidden');
    }
}

function ClearPlayerNameInputs() {
    playerName0.value = '';
    playerName1.value = '';
    playerName2.value = '';
    playerName3.value = '';
    playerName4.value = '';
    playerName5.value = '';

}

function CreatePlayers() {
    //create players when new game button is pushed
    for (let i = 0; i < numPlayers; i++) {
        players[i] = new player(playerNames[i], i)
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////
//table data symbols
const unknown = '';
const knownHave = 'X';
const knownVoid = '/';
const possibleCard = 'p';
const masterCard = '!';

var playerGlobal = {
    mustard: unknown,
    plum: unknown,
    green: unknown,
    peacock: unknown,
    scarlet: unknown,
    white: unknown,
    knife: unknown,
    candlestick: unknown,
    revolver: unknown,
    rope: unknown,
    leadpipe: unknown,
    wrench: unknown,
    hall: unknown,
    lounge: unknown,
    diningroom: unknown,
    kitchen: unknown,
    ballroom: unknown,
    conservatory: unknown,
    billiardroom: unknown,
    library: unknown,
    study: unknown,
    knownCards: 0,

    SetPropertyValue(property, value) {
        this[property] = value;
        WriteTableData(0, property, value);
        this.knownCards++;
        if (value === masterCard) {
            return
        }
        for (let i = 0; i < players.length; i++) {
            if (players[i][property] != knownHave) {
                players[i].SetPropertyValue(property, knownVoid);
            }
        }
    }
}

class player {
    name;
    index;
    mustard = unknown;
    plum = unknown;
    green = unknown;
    peacock = unknown;
    scarlet = unknown;
    white = unknown;
    knife = unknown;
    candlestick = unknown;
    revolver = unknown;
    rope = unknown;
    leadpipe = unknown;
    wrench = unknown;
    hall = unknown;
    lounge = unknown;
    diningroom = unknown;
    kitchen = unknown;
    ballroom = unknown;
    conservatory = unknown;
    billiardroom = unknown;
    library = unknown;
    study = unknown;
    possibleCardArr = [];
    knownCards = 0;

    constructor(name, index) {
        this.name = name;
        this.index = index;
    }

    CheckPossibleCardArr() {
        for (let j = this.possibleCardArr.length - 1; j >= 0; j--) {
            for (let i = this.possibleCardArr[j].length - 1; i >= 0; i--) {
                if (this[this.possibleCardArr[j][i]] === knownVoid) {
                    this.possibleCardArr[j].splice(i, 1);
                }
            }
            if (this.possibleCardArr[j].length === 1) {
                //if the group only has one card left then add known have to that card and remove the group from the possible card array
                this.SetPropertyValue(this.possibleCardArr[j][0], knownHave);
                alert(`it has been inferred that ${this.name} has ${this.possibleCardArr[j][0]}`);
                console.log(`it has been inferred that ${this.name} has ${this.possibleCardArr[j][0]}`)
                //now we need to remove that group from the possible card array
                this.possibleCardArr.splice(j, 1);
            }
        };
    }
    SetPropertyValue(property, value) {
        if (this[property] === knownHave && value === knownHave) {
            //alert("you bungled it and got the same card twice!!!")
            return;
        }
        if (value === possibleCard) {
            if (this[property] === knownVoid || this[property] === knownHave) {
                //console.log('possible card should not overwrite known values');
                return;
            }
        }
        this[property] = value;
        WriteTableData(this.index + 1, property, value)
        if (value === knownHave) {
            OnKnownHave(this.index, property);
            this.knownCards++;
            WritePlayerNameCell(this.index, this.knownCards);
            if (this.knownCards === numCardsPerPlayer) {
                //if we know all the cards of this player we also know all the voids of this player
                this.AllPlayerCardsKnown();
            }
        }
        if (value === knownVoid) {
            CheckForMasterCard(property);
        }
    }
    AllPlayerCardsKnown() {
        if (this.mustard != knownHave) {
            this.SetPropertyValue('mustard', knownVoid);
        }
        if (this.plum != knownHave) {
            this.SetPropertyValue('plum', knownVoid);
        }
        if (this.green != knownHave) {
            this.SetPropertyValue('green', knownVoid);
        }
        if (this.peacock != knownHave) {
            this.SetPropertyValue('peacock', knownVoid);
        }
        if (this.scarlet != knownHave) {
            this.SetPropertyValue('scarlet', knownVoid);
        }
        if (this.white != knownHave) {
            this.SetPropertyValue('white', knownVoid);
        }
        if (this.knife != knownHave) {
            this.SetPropertyValue('knife', knownVoid);
        }
        if (this.candlestick != knownHave) {
            this.SetPropertyValue('candlestick', knownVoid);
        }
        if (this.revolver != knownHave) {
            this.SetPropertyValue('revolver', knownVoid);
        }
        if (this.rope != knownHave) {
            this.SetPropertyValue('rope', knownVoid);
        }
        if (this.leadpipe != knownHave) {
            this.SetPropertyValue('leadpipe', knownVoid);
        }
        if (this.wrench != knownHave) {
            this.SetPropertyValue('wrench', knownVoid);
        }
        if (this.hall != knownHave) {
            this.SetPropertyValue('hall', knownVoid);
        }
        if (this.lounge != knownHave) {
            this.SetPropertyValue('lounge', knownVoid);
        }
        if (this.diningroom != knownHave) {
            this.SetPropertyValue('diningroom', knownVoid);
        }
        if (this.kitchen != knownHave) {
            this.SetPropertyValue('kitchen', knownVoid);
        }
        if (this.ballroom != knownHave) {
            this.SetPropertyValue('ballroom', knownVoid);
        }
        if (this.conservatory != knownHave) {
            this.SetPropertyValue('conservatory', knownVoid);
        }
        if (this.billiardroom != knownHave) {
            this.SetPropertyValue('billiardroom', knownVoid);
        }
        if (this.library != knownHave) {
            this.SetPropertyValue('library', knownVoid);
        }
        if (this.study != knownHave) {
            this.SetPropertyValue('study', knownVoid);
        }
    }
}
//array of all players
var players = [];

function OnKnownHave(playerIndex, cardName) {
    //when a player is known to have a card all other players must not have that card so mark it down for each player
    for (let i = 0; i < players.length; i++) {
        if (i != playerIndex) {
            players[i].SetPropertyValue(cardName, knownVoid);
        }
    }
    //also mark the card in global cards
    playerGlobal.SetPropertyValue(cardName, knownHave)
}

function GlobalStartingCardEntry(card) {
    if (playerGlobal[card] != unknown) {
        return;
    }
    if (playerGlobal.knownCards < numGlobalCards) {
        playerGlobal.SetPropertyValue(card, knownHave);
    }
    if (playerGlobal.knownCards === numGlobalCards) {
        document.getElementById('row_global').classList.remove('pointer');
        helperArea.textContent = 'ENTER YOUR STARTING CARDS';
    }
}

function UserStartingCardEntry(card) {
    if (players[0][card] != unknown) {
        return;
    }
    if (players[0].knownCards === numCardsPerPlayer) {
        return;
    }

    if (playerGlobal.knownCards < numGlobalCards) {
        alert('Enter global cards first');
        return;
    }
    if (players[0][card] === knownVoid) {
        //user must have clicked the wrong spot because they already entered that card as a global card
        alert('That card has been set as a global card!')
        return;
    }
    if (players[0].knownCards < numCardsPerPlayer) {
        players[0].SetPropertyValue(card, knownHave);
    }
    if (players[0].knownCards === numCardsPerPlayer) {
        document.getElementById('row_0').classList.remove('pointer')
        helperArea.textContent = '';
    }
}

function GetNextPlayer(i) {
    //++ except returns to 0 when number of players is reached
    i++;
    //console.log(numPlayers,i);
    if (i >= numPlayers) {
        i = 0;
    }
    return i;
}

class suggestion {
    constructor(suspect, weapon, room, suggester, suggestee) {
        this.suspect = suspect;
        this.weapon = weapon;
        this.room = room;
        this.suggester = suggester;
        this.suggestee = suggestee;
    }
}
var currentSuggestion = new suggestion();

function FirstSuggestionQuery(suspect, weapon, room, suggester) {
    currentSuggestion.suggestee = GetNextPlayer(suggester);
    SuggestionQuery(suspect, weapon, room, suggester);

    suggestionArea.classList.remove('hidden');
}

function SuggestionQuery(suspect, weapon, room, suggester) {
    currentSuggestion.suspect = suspect;
    currentSuggestion.weapon = weapon;
    currentSuggestion.room = room;
    currentSuggestion.suggester = suggester;

    console.log(`${players[currentSuggestion.suggester].name} is asking if ${players[currentSuggestion.suggestee].name} is holding ${currentSuggestion.suspect} ${currentSuggestion.weapon} or ${currentSuggestion.room}`);

    suggestionText.children[0].textContent = players[currentSuggestion.suggester].name //suggester
    suggestionText.children[2].textContent = players[currentSuggestion.suggestee].name //suggestee
    suggestionText.children[4].textContent = currentSuggestion.suspect //suspect
    suggestionText.children[5].textContent = currentSuggestion.weapon //weapon
    suggestionText.children[6].textContent = currentSuggestion.room //room

    SuggestionButtons(true);
    Array.from(gameTable.children[1].children).forEach(r => r.classList.remove('suggestee')); // children are in an html collection not an array so you have to use array.from to turn it into an array//shouldn't even need to do this to all of them but lifes a bitchn then you die so ya
    gameTable.children[1].children[GetNextPlayer(currentSuggestion.suggestee - 1) + 1].classList.add('suggestee');
}

function SuggestionAction(cardShown) {

    if (cardShown === 'suspect') {
        cardShown = currentSuggestion.suspect;
    } else if (cardShown === 'weapon') {
        cardShown = currentSuggestion.weapon;
    } else if (cardShown === 'room') {
        cardShown = currentSuggestion.room;
    }

    //console.log(currentSuggestion)
    //This happens when a player responds to a suggestion either by showing a card or not
    //cardShown can either be 'none','unknown',or '(name of card)'
    if (cardShown === 'none') {
        //no card shown so we know suggestee doesnt have any of the suggested cards
        console.log(`${players[currentSuggestion.suggestee].name} doesn't have ${currentSuggestion.suspect} ${currentSuggestion.weapon} or ${currentSuggestion.room}`)

        players[currentSuggestion.suggestee].SetPropertyValue(currentSuggestion.suspect, knownVoid);
        players[currentSuggestion.suggestee].SetPropertyValue(currentSuggestion.weapon, knownVoid);
        players[currentSuggestion.suggestee].SetPropertyValue(currentSuggestion.room, knownVoid);

        //increment the next suggestee
        currentSuggestion.suggestee = GetNextPlayer(currentSuggestion.suggestee);
        if (currentSuggestion.suggestee === currentSuggestion.suggester) {
            //This means the suggestion has gone all the way around the circle!
            //console.warn("suggestion has gone all the way around the circle!");
            EndSuggestion();

        } else {
            //Ask the next person
            SuggestionQuery(currentSuggestion.suspect, currentSuggestion.weapon, currentSuggestion.room, currentSuggestion.suggester);
        }
    } else {
        //a card was shown, add to data table
        if (currentSuggestion.suggester === 0) {
            //if the suggester is the user then a card was shown to the user so mark that down
            //user now knows that the current suggestee holds the card shown
            console.log(`***${players[currentSuggestion.suggestee].name} is showing ${players[currentSuggestion.suggester].name} ${cardShown}`);

            players[currentSuggestion.suggestee].SetPropertyValue(cardShown, knownHave);

            //check if user knows all of the current suggestees cards held
        } else if (currentSuggestion.suggestee === 0) {
            //user showed someone else a card (not keeping track of this)
            console.log(`***${players[currentSuggestion.suggestee].name} is showing ${players[currentSuggestion.suggester].name} a card`);
        } else {
            //the suggester was not the user so mark down a list of the cards possible
            console.log(`***${players[currentSuggestion.suggestee].name} has one or more of ${currentSuggestion.suspect} ${currentSuggestion.weapon} ${currentSuggestion.room}`);

            players[currentSuggestion.suggestee].SetPropertyValue(currentSuggestion.suspect, possibleCard);
            players[currentSuggestion.suggestee].SetPropertyValue(currentSuggestion.weapon, possibleCard);
            players[currentSuggestion.suggestee].SetPropertyValue(currentSuggestion.room, possibleCard);

            players[currentSuggestion.suggestee].possibleCardArr.push([currentSuggestion.suspect, currentSuggestion.weapon, currentSuggestion.room]);
        }
        EndSuggestion();
    }
    //check to see if new data can create any new inferrences
    CheckAllPossibleCardArrays();
}

function CheckAllPossibleCardArrays() {
    for (let i = 0; i < players.length; i++) {
        players[i].CheckPossibleCardArr();
    }
}

function EndSuggestion() {
    SuggestionButtons(false);
    RemoveAllSelection();
    suggestionArea.classList.add('hidden');
}
////////////////////////////////////////////////////////////////////////////////////
//DOM

function GetColNumberFromString(col) {
    switch (col) {
        case '#':
            col = 0;
            break;
        case 'mustard':
            col = 1;
            break;
        case 'plum':
            col = 2;
            break;
        case 'green':
            col = 3;
            break;
        case 'peacock':
            col = 4;
            break;
        case 'scarlet':
            col = 5;
            break;
        case 'white':
            col = 6;
            break;
        case 'knife':
            col = 7;
            break;
        case 'candlestick':
            col = 8;
            break;
        case 'revolver':
            col = 9;
            break;
        case 'rope':
            col = 10;
            break;
        case 'leadpipe':
            col = 11;
            break;
        case 'wrench':
            col = 12;
            break;
        case 'hall':
            col = 13;
            break;
        case 'lounge':
            col = 14;
            break;
        case 'diningroom':
            col = 15;
            break;
        case 'kitchen':
            col = 16;
            break;
        case 'ballroom':
            col = 17;
            break;
        case 'conservatory':
            col = 18;
            break;
        case 'billiardroom':
            col = 19;
            break;
        case 'library':
            col = 20;
            break;
        case 'study':
            col = 21;
            break;
        default:
            console.error(`no case for ${col} in WriteTableData`)
    }
    return col;
}

function WriteTableData(row, col, content) {
    //table
    //head[0]/body[1]
    //row[total, 0, 1, 2, 3, 4, 5]
    //col[s,w,r]
    col = GetColNumberFromString(col);
    gameTable.children[1].children[row].children[col].textContent = content;
    if (content === knownHave) {
        gameTable.children[1].children[row].children[col].classList.add("knownHave");
    }
}

function WritePlayerNameCell(playerIndex, numCardsKnown) {
    gameTable.children[1].children[playerIndex + 1].children[0].textContent = `${truncateString(playerNames[playerIndex], 3)} ${numCardsKnown}/${numCardsPerPlayer}`
}

function SelectTableHeadElement(col) {
    //turn the string into a number
    col = GetColNumberFromString(col);
    //remove selected for other tds in the category
    if (col >= 0 && col < 7) {
        for (let i = 0; i < 7; i++) {
            gameTable.children[0].children[0].children[i].classList.remove('selected');
        }
    } else if (col >= 7 && col < 13) {
        for (let i = 7; i < 13; i++) {
            gameTable.children[0].children[0].children[i].classList.remove('selected');
        }
    } else if (col >= 13 && col < 22) {
        for (let i = 13; i < 22; i++) {
            gameTable.children[0].children[0].children[i].classList.remove('selected');
        }
    }
    //add selected to the new td
    gameTable.children[0].children[0].children[col].classList.add("selected");
}

function SelectTableRow(row) {
    /*
    //if already selected then unselect
    if (gameTable.children[1].children[row + 1].classList.contains('selected')) {
        gameTable.children[1].children[row + 1].classList.remove('selected');
        newSuggestion.suggester=undefined;
        return;
    }*/
    //remove selected for other rows
    for (let i = 0; i < gameTable.children[1].children.length; i++) {
        gameTable.children[1].children[i].classList.remove('selected');
    }
    //add selected to the new row
    gameTable.children[1].children[row + 1].classList.add("selected");
}

function RemoveAllSelection() {
    for (let i = 0; i < 22; i++) {
        gameTable.children[0].children[0].children[i].classList.remove('selected');
    }
    //remove selected for other rows
    for (let i = 0; i < gameTable.children[1].children.length; i++) {
        gameTable.children[1].children[i].classList.remove('selected');
        gameTable.children[1].children[i].classList.remove('suggestee');
    }
}

//create a new suggestion object to hold values before being passed to current suggestion
let newSuggestion = new suggestion();

function newSuggestionContent(category, value) {
    if (playerGlobal.knownCards < numGlobalCards) {
        GlobalStartingCardEntry(value);
        return;
    }
    if (players[0].knownCards < numCardsPerPlayer) {
        UserStartingCardEntry(value);
        return;
    }
    //selecting content of a new suggestion (called on click)
    //new suggestion values should have a visual indcation
    switch (category) {
        case 'suspect':
            newSuggestion.suspect = value;
            SelectTableHeadElement(value);
            break;
        case 'weapon':
            newSuggestion.weapon = value;
            SelectTableHeadElement(value);
            break;
        case 'room':
            newSuggestion.room = value;
            SelectTableHeadElement(value);
            break;
        case 'suggester':
            newSuggestion.suggester = value;
            SelectTableRow(value);
            break;
        default:
            console.error(`category ${category} does not exist in newSuggestionContent`)
    }
}

function submitNewSuggestion() {
    if (players[0].knownCards < numCardsPerPlayer || playerGlobal.knownCards < numGlobalCards) {
        alert('Enter starting cards!')
        return;
    }
    let validationTally = 0;
    if (newSuggestion.suggester != undefined) {
        validationTally++;
    }
    if (newSuggestion.suspect != undefined) {
        validationTally++;
    }
    if (newSuggestion.weapon != undefined) {
        validationTally++;
    }
    if (newSuggestion.room != undefined) {
        validationTally++;
    }
    if (validationTally === 4) {
        //only submit if all properties have been entered
        FirstSuggestionQuery(newSuggestion.suspect, newSuggestion.weapon, newSuggestion.room, newSuggestion.suggester);
        ClearNewSuggestion();
    } else {
        alert("bitch please : enter all required shits")
    }
}

function ClearNewSuggestion() {
    newSuggestion.suggester = undefined;
    newSuggestion.suspect = undefined;
    newSuggestion.weapon = undefined;
    newSuggestion.room = undefined;
}

function SuggestionButtons(show) {
    //Only the user knows what card has been shown (children[1] = card names)
    if (currentSuggestion.suggester === 0) {
        suggestionButtons.children[1].classList.remove('hidden');
        suggestionButtons.children[2].classList.add('hidden');
        suspectButton.textContent = currentSuggestion.suspect;
        weaponButton.textContent = currentSuggestion.weapon;
        roomButton.textContent = currentSuggestion.room;
    } else {
        suggestionButtons.children[1].classList.add('hidden');
        suggestionButtons.children[2].classList.remove('hidden');
    }
    //this hides the suggestion card
    if (show) {
        suggestionButtons.classList.remove('hidden');
    } else {
        suggestionButtons.classList.add('hidden');
    }
    //change the unknown button if user is the one being asked
    if (currentSuggestion.suggestee === 0) {
        unknownButton.textContent = 'show';
    } else {
        unknownButton.textContent = 'unknown';
    }
    //if we know the card is a known void for the suggestee, remove impossible buttons 
    //first make sure buttons are reset from previous suggestions
    noneButton.classList.remove('hidden');
    unknownButton.classList.remove('hidden');
    suspectButton.classList.remove('hidden');
    weaponButton.classList.remove('hidden');
    roomButton.classList.remove('hidden');
    let voidTally = 0;
    let onlyPossible = '';
    if (players[currentSuggestion.suggestee][currentSuggestion.suspect] === knownVoid) {
        suspectButton.classList.add('hidden');
        voidTally++;
    } else {
        onlyPossible = 'suspect';
    }
    if (players[currentSuggestion.suggestee][currentSuggestion.weapon] === knownVoid) {
        weaponButton.classList.add('hidden');
        voidTally++;
    } else {
        onlyPossible = 'weapon';
    }
    if (players[currentSuggestion.suggestee][currentSuggestion.room] === knownVoid) {
        roomButton.classList.add('hidden');
        voidTally++;
    } else {
        onlyPossible = 'room';
    }
    //if there is only one possible card they can show then write the name on the unknown button
    if (voidTally === 2) {
        if (onlyPossible === 'suspect') {
            unknownButton.textContent = currentSuggestion.suspect;
        } else if (onlyPossible === 'weapon') {
            unknownButton.textContent = currentSuggestion.weapon;
        } else if (onlyPossible === 'room') {
            unknownButton.textContent = currentSuggestion.room;
        }
        if (currentSuggestion.suggestee === 0) {
            unknownButton.textContent = 'show ' + unknownButton.textContent;
        }
    }
    //now for when the suggester is not the user check all three cards and see if they are knownVoid for the suggestee
    if (voidTally === 3) {
        unknownButton.classList.add('hidden');
    }
    //if we know the suggestee has on of the cards remove the none button
    if (players[currentSuggestion.suggestee][currentSuggestion.suspect] === knownHave || players[currentSuggestion.suggestee][currentSuggestion.weapon] === knownHave || players[currentSuggestion.suggestee][currentSuggestion.room] === knownHave) {
        noneButton.classList.add('hidden');
    }
}

function CheckForMasterCard(card) {
    if (playerGlobal[card] === knownHave || playerGlobal[card] === masterCard) {
        return;
    }
    let tally = 0;
    players.forEach(player => {
        if (player[card] === knownVoid) {
            tally++;
        }
    });
    if (tally === numPlayers) {
        playerGlobal.SetPropertyValue(card, masterCard)
        alert(`${card} is the master card`);
        knownMasterCards++;
        if (knownMasterCards === 3) {
            alert(`all master cards known!!!`)
        }
    }
    //console.log(`${tally}/${numPlayers} players don't have ${card}`);
}