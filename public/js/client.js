var socket = io();

socket.on("server-send-failed-res", function(){
    alert("username has existed");
});
socket.on("server-send-success-res",function(data){
    $('#current-user').html(data);
    $("#login-form").hide(2000);
    $('#chat-form').show(1000);
});

socket.on("server-send-list-users", function(list){
    $('#user-box').html("");
    list.forEach(i => {
        console.log(i);
        $('#user-box').append(
        "<li id='"+i+"'  class='clearfix'>"
        +
        "<img src='https://s3-us-west-2.amazonaws.com/s.cdpn.io/195612/chat_avatar_01.jpg' alt='avatar' />"
        +"<div class='about'>"
        + " <div class='name'>" + i +
        "</div>"
        +"<div class='status'>"
         +" <i class='fa fa-circle online'>"+"</i> online"
        +"   </div>"+"</div>"+"</li>");
    });
})

socket.on("server-send-message",(data => {
    let classSelector = $(".chat-history ul li:last").attr('class');
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes();
    if( classSelector == 'clearfix'){
        $('.chat-history > ul > .content').append(
            "<li>" +
            "<div class='message-data'>"+
              "<span class='message-data-name'>"+
              "<i class='fa fa-circle online'>"+
              "</i>"+ data.user +
              "</span>"+
              "<span class='message-data-time'>"+ time +" AM" +"Today</span>"+
            "</div>"+
            "<div class='message my-message'>"+
              data.text +
            "</div>"+
          "</li>"
        );
    } else {
        $('.chat-history > ul > .content').append(
            "<li class='clearfix'>" +
            "<div class='message-data align-right'>"+
              "<span class='message-data-name'>"+
              "<i class='fa fa-circle online'>"+
              "</i>"+ data.user +
              "</span>"+
              "<span class='message-data-time'>"+ time +" AM" +"Today</span>"+
            "</div>"+
            "<div class='message other-message float-right'>"+
              data.text +
            "</div>"+
          "</li>"
        );
    }
}));

socket.on("user-typing", (data) => {
    $('.typing-indicator-wrapper').show(); 
    $('.typing-indicator-wrapper #user-typing').html(data);
} );
socket.on("user-end-typing", () => {
    $('.typing-indicator-wrapper').hide(); 
} )


$(document).ready(function(){
    $("#login-form").show();
    $('#chat-form').hide();
    $('.typing-indicator-wrapper').hide();
    function login(){
        let username = $('#txtUserName').val();
        if(username != ''){
            socket.emit("client-send-username",username);
        }
        else{
            alert("Nhập tên vào đêzzz") 
        }
    }
    function sendMessage(){
        let message = $('#message-to-send').val();
        socket.emit("user-send-message",message);
    }
    $('#btnLogin').click(function(){
        login();
    });
    $('#logout').click(function(){
        socket.emit("logout");
        $("#login-form").show(2000);
        $('#chat-form').hide(1000);
    });
    // trigger enter 
    $('#txtUserName').keypress(function(event){
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if(keycode == '13'){
            login();
        }
    });
    $('#message-to-send').keypress(function(event){
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if(keycode == '13'){
            sendMessage();
            $('#message-to-send').val(null);
        }
    });
    $('#btn-send-message').click(function(){
        sendMessage();
    })
    $('#message-to-send').focusin(function(){
        socket.emit("user-typing");
    })
    $('#message-to-send').focusout(function(){
        socket.emit("user-end-typing");
    });
    
// end document ready
})

