//fonction qui fait le fetch(), qui contacte l'API
async function callAPI(uri) {
    console.log("-- callAPI - start --");
    console.log("uri = ", uri);

    // fetch(), appel à l'API et réception de la réponse
    const response = await fetch(uri);
    console.log("response = ", response);

    // récupération des données JSON reçues de l'API
    const data = await response.json();
    console.log("data = ", data);

    console.log("-- CallAPI - end --");

    //renvoi des données
    return data;
}

// constante globale : l'URI du endpoint de demande de nouveau deck
const API_ENDPOINT_NEW_DECK = "https://deckofcardsapi.com/api/deck/new/";

// function de demande de nouveau deck
async function getNewDeck() {
    console.log(">> getNewDeck");

    return await callAPI(API_ENDPOINT_NEW_DECK);
}

// variable globale : l'id du deck utilisé, dans lequel on pioche
let idDeck = null;

// variable globale : l'id de la carte utilisé
let idCard = null;


// function (syntaxe de function fléchée) qui renvoient des URI dynamiques de demande de mélange du deck et de pioche
const getApiEndpointShuffleDeck = () => `https://deckofcardsapi.com/api/deck/${idDeck}/shuffle/`;


// function de demande de mélange du deck
async function shuffleDeck() {
    console.log(">> shuffleDeck");

    return await callAPI(getApiEndpointShuffleDeck());
}


// function (syntaxe de function fléchée) qui renvoient des URI dynamiques de demande de mélange du deck et de pioche
const getApiEndpointDrawCard = () => `https://deckofcardsapi.com/api/deck/${idDeck}/draw/?count=1`;


// function de demande de pioche dans le deck
async function drawCard() {
    console.log(">> drawCard");

    return await callAPI(getApiEndpointDrawCard());
}


// supprime les cartes de l'ancien deck du DOM => récupération des cartes (classe CSS "card") => et pour chacune de ces cartes => suppression du DOM
const cleanDomCardsFromPreviousDeck = () => document.querySelectorAll(".card").forEach((child) => child.remove());

async function actionReset() {
    // vider dans les DOM les cartes de l'ancien deck
    cleanDomCardsFromPreviousDeck();

    // récupération d'un nouveau deck
    const newDeckResponse = await getNewDeck();
    console.log("--------->",newDeckResponse);

    // récupération de l'id de ce nouveau deck dans les données reçues et mise à jour de la variable globale
    idDeck = newDeckResponse.deck_id;

    // mélange du deck
    await shuffleDeck();
}


// éléments HTML utiles pour les évènements et pour la manipulation du DOM
const cardsContainer = document.getElementById("cards-container");


// ajoute une carte dans le DOM (dans la zone des cartes piochées) d'après l'URI de son image
function addCardToDomByImgUri(imgUri) {
    // création de l'élément HTML "img", de classe CSS "card" et avec pour attribut HTML "src" l'URI reçue en argument
    const imgCardHtmlElement = document.createElement("img");
    imgCardHtmlElement.classList.add("card");
    imgCardHtmlElement.src = imgUri;

    // ajout de cette image dans la eone des cartes piochées (en dernière position, dernier enfant de cardsContainer)
    cardsContainer.append(imgCardHtmlElement);
}


// fonction qui demande à piocher une carte, puis qui fait l'appel pour l'intégrer dans le DOM
var arrayCodeCards = [];
async function actionDraw() {
    // appel à l'API pour demander au croupier de piocher une carte et de nous la renvoyer
    const drawCardResponse = await drawCard();
    console.log("drawCardResponse = ", drawCardResponse);
    
    // récupération de l'URI de l'image de cette carte dans les données reçues
    const imgCardUri = drawCardResponse.cards[0].image;
    
    // ajout de la carte piochée dans la zone des cartes piochées
    addCardToDomByImgUri(imgCardUri);
    
    arrayCards = arrayCodeCards.push(drawCardResponse.cards[0].code)
  
}


const getApiEndpointReturningCard = () => `https://deckofcardsapi.com/api/deck/${idDeck}/return/?cards=${idCard}`

// function de retour de carte
async function returningCard() {
    return await callAPI(getApiEndpointReturningCard());
}

async function removeCard () {
    const Cards = document.getElementById("cards-container");
    Cards.removeChild(Cards.lastChild);
}

async function addLastCardToDeck() {
    const last = arrayCodeCards[arrayCodeCards.length - 1];
    idCard = last;
    returningCard()
    arrayCards = arrayCodeCards.pop();
}

async function actionReturning() {
    addLastCardToDeck();
    removeCard();
    
    console.log("---------------->", arrayCodeCards);
}

// appel d'initialisation au lancement de l'application
actionReset();

// éléments HTML utiles pour les évènements et pour la manipulation du DOM
const actionResetButton = document.getElementById("action-reset");
const actionDrawButton = document.getElementById("action-draw");
const actionReturningButton = document.getElementById("action-returning");

// écoutes d'évènement sur les boutons d'action
actionResetButton.addEventListener("click", actionReset);
actionDrawButton.addEventListener("click", actionDraw);
actionReturningButton.addEventListener("click", actionReturning);