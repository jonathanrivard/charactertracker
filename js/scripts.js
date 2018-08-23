//Create class to store player data
class Player{
    constructor(characterName, playerName, ac, hp, pp){
        this._index = 0;
        this._characterName = characterName;
        this._playerName = playerName;
        this._ac = ac; //Armor Class
        this._hp = hp; //Health Points
        this._pp = pp; //Passive Perception
        this._superDiv; //Div Element
    }

    //Getters
    get index(){
        return this._index;
    }

    get characterName(){
        return this._characterName;
    }

    get playerName(){
        return this._playerName;
    }

    get ac(){
        return this._ac;
    }

    get hp(){
        return this._hp;
    }

    get pp(){
        return this._pp;
    }

    get superDiv(){
        return this._superDiv;
    }

    //Setters
    set index(n){
        this._index = n;
    }

    set characterName(n){
        this._characterName = n;
    }

    set playerName(n){
        this._playerName = n;
    }

    set ac(n){
        this._ac = n;
    }

    set hp(n){
        this._hp = n;
    }

    set pp(n){
        this._pp = n;
    }

    set superDiv(n){
        this._superDiv = n;
    }

    CreateElements(){
        //Create DIV
        let div = document.createElement("div");
        div.setAttribute('class', 'player');
        document.getElementById('player-box').appendChild(div);
        this.superDiv = div;

        //Create Character Name Header
        let cName = document.createElement("H1");
        cName.innerHTML = this.characterName;
        div.appendChild(cName);

        //Create Player Name Header
        let pName = document.createElement("H3");
        pName.innerHTML = this.playerName;
        div.appendChild(pName);

        //Create div for icons and information
        let iconDiv = document.createElement("DIV");
        iconDiv.setAttribute('class', 'player-icons');
        div.appendChild(iconDiv);

        //Create icon divs
        let acDiv = document.createElement("DIV");
        let hpDiv = document.createElement("DIV");
        let ppDiv = document.createElement("DIV");
        acDiv.setAttribute('class', 'player-ac');
        hpDiv.setAttribute('class', 'player-hp');
        ppDiv.setAttribute('class', 'player-pp');
        acDiv.innerHTML = this.ac;
        hpDiv.innerHTML = this.hp;
        ppDiv.innerHTML = this.pp;
        iconDiv.appendChild(acDiv);
        iconDiv.appendChild(hpDiv);
        iconDiv.appendChild(ppDiv);

        //Get index as value for later
        let tempNum = this.index;

        //Create edit button
        let divEditButton = document.createElement("A");
        divEditButton.innerHTML = "Edit";
        divEditButton.onclick = function(){EditPlayer(tempNum); toggleEditBox(); togglePlayerBox();}
        divEditButton.style.display = "inline-block";
        div.appendChild(divEditButton);

        //Create delete button
        let divDeleteButton = document.createElement("A");
        divDeleteButton.innerHTML = "Delete";
        divDeleteButton.onclick = function(){playerList[tempNum].DeleteElements(); playerList.splice(tempNum, 1); UpdateIndexes(); UpdatePlayerBox();}
        divDeleteButton.style.display = "inline-block";
        divDeleteButton.style.cssFloat = "right";
        div.appendChild(divDeleteButton);
    }

    DeleteElements(){
        this.superDiv.parentElement.removeChild(this.superDiv);
    }
}

//Global Variables
let playerList = [];
//Element Objects
//-Divs
let playerBox = document.getElementById('player-box');
let editBox = document.getElementById('edit-box');
//-Buttons
let editSaveButton = document.getElementById('edit-save-button');
let newCharacterButton = document.getElementById('new-character-button');
newCharacterButton.onclick = function(){CreatePlayer(); toggleEditBox(); togglePlayerBox();}
//-Inputs
let inputCharacterName = document.getElementById('input-character-name');
let inputPlayerName = document.getElementById('input-player-name');
let inputAC = document.getElementById('input-ac');
let inputHP = document.getElementById('input-hp');
let inputPP = document.getElementById('input-pp');
//-Texts
let editText = document.getElementById('edit-text');

function start(){
    toggleEditBox();
}

function CreatePlayer(){ //We reuse the edit character screen to create characters
    //Set Header
    editText.innerHTML = "New Character"
    //Clear inputs
    inputCharacterName.value = "";
    inputPlayerName.value = "";
    inputAC.value = "";
    inputHP.value = "";
    inputPP.value = "";

    editSaveButton.innerHTML = "Create";
    editSaveButton.onclick = function(){SaveCreate(); toggleEditBox(); togglePlayerBox();}
}

function SaveCreate(){
    let characterName = inputCharacterName.value;
    let playerName = inputPlayerName.value;
    let ac = inputAC.value;
    let hp = inputHP.value;
    let pp = inputPP.value;

    let temp = new Player(characterName, playerName, ac, hp, pp);
    playerList.push(temp);
    temp.index = playerList.length - 1;
    temp.CreateElements();
}

function EditPlayer(i){
    //Set Header
    editText.innerHTML = "Edit Character";
    //Set values in edit inputs
    inputCharacterName.value = playerList[i].characterName;
    inputPlayerName.value = playerList[i].playerName;
    inputAC.value = playerList[i].ac;
    inputHP.value = playerList[i].hp;
    inputPP.value = playerList[i].pp;

    editSaveButton.innerHTML = "Save";
    editSaveButton.onclick = function(){SaveEdits(i); UpdatePlayerBox(); toggleEditBox(); togglePlayerBox();}
}

function SaveEdits(i){
    playerList[i].characterName = inputCharacterName.value;
    playerList[i].playerName = inputPlayerName.value;
    playerList[i].ac = inputAC.value;
    playerList[i].hp = inputHP.value;
    playerList[i].pp = inputPP.value;
}

function UpdatePlayerBox(){
    playerList.forEach(function(i){
        i.DeleteElements();
        i.CreateElements();
    });
}

/* Local Storage Functions */
function SavePlayers(){
    let str = "";
    
    playerList.forEach(function(i){
        str += i.characterName + ',';
        str += i.playerName + ',';
        str += i.ac + ',';
        str += i.hp + ',';
        str += i.pp + ',';
        str += i.index + ',';
    });

    localStorage.setItem('playerArrayString', str);
}

function LoadPlayers(){
    let str = localStorage.getItem('playerArrayString');
    let strArray = str.split(',');

    strArray.pop(); //Because last index is blank

    let num = strArray.length / 6; //Get number of players stored
    let currentIndex = 0; //Index counting from

    playerList.forEach(function(i){ //Delete Each Player before clearing list of players
        i.DeleteElements();
    });
    playerList = []; //Reset Player List
    for(let i = 0; i < num; i++){ //Create new players
        let temp = new Player(strArray[i], strArray[i+1], strArray[i+2], strArray[i+3], strArray[i+4]);
        playerList.push(temp);
        temp.index = strArray[i+5];
        temp.CreateElements();

        currentIndex += 6;
    }

    UpdateIndexes(); //Make sure indexes are right
    UpdatePlayerBox();
}

function UpdateIndexes(){
    playerList.forEach(function(i){
        i.index = playerList.indexOf(i);
    });
}


//TOGGLE FUNCTIONS
function togglePlayerBox(){
    if (playerBox.style.display === "none"){
        playerBox.style.display = "block";
    }else {
        playerBox.style.display = "none";
    }
}

function toggleEditBox(){
    if (editBox.style.display === "none"){
        editBox.style.display = "block";
    }else {
        editBox.style.display = "none";
    }
}

start();