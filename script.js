
var conversations = [

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



function updateScroll(item){

    item.scrollTop(item[0].scrollHeight);
}

function createMessage(text,type){

  var board = $(".message-board")
  var msgCont = $("<div></div>");
  var msg = $("<div></div>");
  var p = $("<p></p>");
  var info = $("<div></div>");

  msgCont.addClass("mess-container");
  msg.addClass("message").addClass(type);
  p.text(text);
  info.addClass("info").text("12:01");

  //append dall'interno verso l'esterno

  msg.append(p).append(info);
  msgCont.append(msg);
  board.append(msgCont);


  updateScroll(board)

}

function getMessage(){

  var inp = $("#messageInput")

  inp.keyup(function(e){

    if(e.keyCode == 13) {

      var  ind = $(".conversations > .item.active").index();

      updateConversation(ind,  inp.val() , "sent")

      createMessage( inp.val() , "sent");
      inp.val("");

      setTimeout(function(){

        updateConversation(ind,  "Risposta" , "received")
        createMessage( "Risposta" , "received");
      },1000)

    }
  })
}

function updateConversation(ind, mess , tipo){

  conversations[ind].push({

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

function getConversation(ind){


}

function selectConversation(){

  var items = $(".conversations > .item")

  items.click(function(){

    items.removeClass("active");
    $(this).addClass("active");

    uploadConversation($(this).index());

  })
}

function uploadConversation(ind){

  var messBoard = $(".message-board");

  messBoard.empty();

  for (var i = 0; i < conversations[ind].length; i++) {
    createMessage(conversations[ind][i].message, conversations[ind][i].type )
  }


}

function init(){

  uploadConversation(0);
  selectConversation();
  getMessage();
  searchConvo();
}

$(document).ready(init)