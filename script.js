
var wtpConvoMessages = [

  [
    {message: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
     type:"received"},
    {message: "Ciao",
     type:"sent"},
  ],

  [
    {message: "Ciao, Come stai?", type:"received"},
    {message: "Tutto Bene Grazie :)", type:"sent"}
  ],

  [
    {message: "Ciao, Come stai?", type:"sent"},
    {message: "Tutto Bene Grazie :)", type:"received"}
  ],

  [
    {message: "Hello World", type:"sent"},
    {message: "Whatsupp", type:"received"}
  ],
  [
    {message: "ciao Martina", type:"sent"},
    {message: "ciao ! :)", type:"received"}
  ],

]


function createMessage(text,type){

  var board = $(".message-board")
  var msgCont = $("<div></div>");
  var msg = $("<div></div>");
  var p = $("<p></p>");
  var info = $("<div></div>");
  var arrow = $("<a href='#'></a>");

  arrow.html("<i class='fas fa-angle-down'></i>").addClass("arrow");
  msgCont.addClass("mess-container");
  msg.addClass("message").addClass(type);
  p.text(text);
  info.addClass("info").text("12:01");

  //append dall'interno verso l'esterno

  msg.append(p).append(info).append(arrow);
  msgCont.append(msg);
  board.append(msgCont);


  //create dropdown menu

  var menu = $("<div></div>");
  menu.addClass("menu");

  var item1 = $("<div>Message info</div>");
  item1.addClass("item");

  var item2 = $("<div>Delete Message</div>");
  item2.addClass("item").addClass('deleteMess');

  menu.append(item1).append(item2);

  msg.append(menu);

  board.scrollTop(board[0].scrollHeight);
}


//SEND  AND RECEIVE MESSAGE FUNCTIONS


function sendMessage(inp){

  // salvo l'indice della conversazione attualmente attiva

  var  ind = $(".conversations > .item.active").index();

  // faccio un update della variabile globale : inserisco il val dell'imput nell'array di indice 'ind'
  // creo il messaggio che avrà come testo il val dellinput

  updateConversation(ind , inp.val() , "sent")
  createMessage( inp.val() , "sent");

  //dopo che ho mandato il mess svuoto l'input e nascondo il tasto di invio

  inp.val("");
  $(".message-bar .mess-button img").toggleClass("hide");

  // Mando un messaggio di rispota automatico dopoun certo t : update e creo come sopra

  setTimeout(function(){

    updateConversation(ind , "Risposta" , "received")
    createMessage( "Risposta" , "received");
  },2000)

}

function getMessage(){

  var inp = $("#messageInput");

  // quando premo invio (key 13) chiamo la funzione per mandare il messaggio

  inp.keyup(function(e){

    if(e.keyCode == 13) {

      sendMessage(inp);
    }
  })

  //mostra il bottone freccia quando scrivo all'interno del input

  inp.on("input",function(){

    if(inp.val() != "") {

      $("#audioButton").addClass("hide");
      $("#sendButton").removeClass("hide");
    }
    else{

      $("#sendButton").addClass("hide");
      $("#audioButton").removeClass("hide");
    }
  })
}

// al click di sendButton invio il messaggio

function sendButton(){

  var btn = $("#sendButton");

  btn.click(function(){

    sendMessage( $("#messageInput") );
  })
}

// SEARCH  & SELECT CONVERSATIONS ON SIDE-BAR

// prendo il valore i searchInput

function searchConvo(){

  var search = $("#searchInput");

  search.on("input",function(){

    lookForMatch(search.val());
  })
}

// funzione chiamata solo durante l'input e prende in ingresso il val() (text)

function lookForMatch(text){

  //prendo la lista di items di conversations
  //li nascondo tutti

  var items = $(".conversations > .item");

  items.hide();

  // per ogni item della lista vado a ricavare il nome del contatto
  // e lo confronto con l'input (text)
  //se il text è contenuto all'interno del nome allora mostro l'item che contiene il nome

  for (var i = 0; i < items.length; i++) {

    var name = items.eq(i).find(".contact-name").text();

    if( name.toLowerCase().includes(text.toLowerCase()) ){

      items.eq(i).show();
    }
  }
}

//al click su un item delle conversations la rendo attiva
// prendo l'index dell'item e vado a fare upload dei messaggi nell'array nella stessa posizione index

function selectConversation(){

  var items = $(".conversations > .item")

  items.click(function(){

    items.removeClass("active");
    $(this).addClass("active");
    $("#messageInput").val("");

    uploadConversation($(this).index());
  })
}

// UPLOAD AND UPDATE CONVERSATIONS AND INFO

// in ingresso ho l'indice dell'array in wtpConvoMessages desiderato

function uploadConversation(ind){

  //svuoto la message board

  var messBoard = $(".message-board");

  messBoard.empty();

  // vado a prendere l'array in posizione  wtpConvoMessages[ind] e per ciascuno oggetto figlio creo un messaggio

  for (var i = 0; i < wtpConvoMessages[ind].length; i++) {
    createMessage(wtpConvoMessages[ind][i].message, wtpConvoMessages[ind][i].type )
  }

  updateContactInfo(ind);
}

// prendo le informazioni dall'item di conversations con classe active : immagine e nome
//e li vado a inserire nella top-bar a destra

function updateContactInfo(ind){

  var item = $(".conversations > .item").eq(ind);
  var info = $(".right-side .top-bar .left");

  var img = item.find(".image img").attr("src");
  var name = item.find(".contact-name").text();

  info.find(".image img").attr("src",img);
  info.find(".contact-name").text(name);
}

// creo un nuvo oggetto con messaggio e tipo e lo pusho nell'array di wtpConvoMessages all'indice [ind]

function updateConversation(ind, mess , tipo){

  wtpConvoMessages[ind].push({

    message: mess,
    type: tipo,
  })
}

// DELETE MESSAGES

function deleteMessage(){

  //mi mostra il menu quando clicco sulla freccetta

  $(".message-board").on("click",".message .arrow",function(event){

    $(".message-board .message .menu").hide();

    $(this).closest(".message").children(".menu").toggle(100);

    event.stopPropagation();
  })

  // se clicco al di fuori del menu me lo chiude

  $(window).click(function() {
    $(".message-board .message .menu").hide();
  });

  // se clicco su Delete message mi cancella il message ancestor del menu in cui si trova
  // e mi cancella dall'array delle conversazioni l'oggetto corrispondente al messaggio

  $(".message-board").on("click",".message .menu .deleteMess",function(){

    var thisMess =  $(this).closest(".mess-container")
    var convoInd = $(".conversations > .item.active").index();
    var messInd = thisMess.index();

    thisMess.remove();
    wtpConvoMessages[convoInd].splice(messInd,1);
  })
}


function init(){

  uploadConversation(0);
  selectConversation();
  getMessage();
  sendButton();
  searchConvo();
  deleteMessage();
}

$(document).ready(init)
