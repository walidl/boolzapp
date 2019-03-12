
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


function sendMessage(inp){

  var  ind = $(".conversations > .item.active").index();

  updateConversation(ind,  inp.val() , "sent")

  createMessage( inp.val() , "sent");

  inp.val("");
  $(".message-bar .mess-button img").toggleClass("hide");

  setTimeout(function(){

    updateConversation(ind,  "Risposta" , "received")
    createMessage( "Risposta" , "received");
  },1000)

}


function getMessage(){

  var inp = $("#messageInput");


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

  inp.keyup(function(e){

    if(e.keyCode == 13) {

      sendMessage(inp);

    }
  })
}

function sendButton(){

  var btn = $("#sendButton");

  btn.click(function(){

    sendMessage( $("#messageInput") );
  })
}

function updateConversation(ind, mess , tipo){

  wtpConvoMessages[ind].push({

    message: mess,
    type: tipo,
  })
}

function check(name, text, index){

  if( name.toLowerCase().includes(text.toLowerCase()) ){

    return index;
  }
}

function lookForMatch(text){

  var items = $(".conversations > .item");
  items.hide();

  for (var i = 0; i < items.length; i++) {

    var name = items.eq(i).find(".contact-name").text();

    var match = check(name , text, items.eq(i).index());

    items.eq(match).show();
  }
}

function searchConvo(){

  var search = $("#searchInput");

  search.on("input",function(){

    lookForMatch(search.val());
  })
}

function selectConversation(){

  var items = $(".conversations > .item")

  items.click(function(){

    items.removeClass("active");
    $(this).addClass("active");
    $("#messageInput").val("");

    uploadConversation($(this).index());
  })
}

function updateContactInfo(ind){

  var item = $(".conversations > .item").eq(ind);
  var info = $(".right-side .top-bar .left");

  var img = item.find(".image img").attr("src");
  var name = item.find(".contact-name").text();

  info.find(".image img").attr("src",img);
  info.find(".contact-name").text(name);

}

function uploadConversation(ind){

  var messBoard = $(".message-board");

  messBoard.empty();

  for (var i = 0; i < wtpConvoMessages[ind].length; i++) {
    createMessage(wtpConvoMessages[ind][i].message, wtpConvoMessages[ind][i].type )
  }

  updateContactInfo(ind);
}

function deleteMessage(){

  var convoInd = 0;

  //mi mostra il menu quando clicco sulla freccetta

  $(".message-board").on("click",".message .arrow",function(event){

    convoInd = $(".conversations > .item.active").index();

    $(".message-board .message .menu").hide();

    $(this).parents(".message").children(".menu").toggle(100);

    event.stopPropagation();
  })

  // se clicco al di fuori del menu me lo chiude

  $(window).click(function() {
    $(".message-board .message .menu").hide();
  });

  // se clicco su Delete message mi cancella il message ancestor del menu in cui si trova
  // e mi cancella dall'array delle conversazioni l'oggetto corrispondente al messaggio

  $(".message-board").on("click",".message .menu .deleteMess",function(){

    var thisMess =  $(this).parents(".mess-container")
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
