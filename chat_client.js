$(document).ready(function() {
    var socket = io.connect('http://localhost');
    var client = "client";

    socket.on('recv', function(data) {
        $('.messages ul').append('<li class="from"><span>' + data.client + '</span> ' + data.msg + '</li>');
        $(".messages").prop({ scrollTop: $(".messages").prop("scrollHeight") });
    });

    $("#send").click(function() {
        var msg = $("#msg");
        data = {'msg': msg.val(), 'client': client };

        msg.val('');
        msg.focus();
        $('.messages ul').append('<li class="to"><span>' + data.client + '</span> ' + data.msg + '</li>');
        $(".messages").prop({ scrollTop: $(".messages").prop("scrollHeight") });
        socket.emit('send', data);
    });

    $("#msg").keydown(function(e) {
        if (e.which == 13) {
            $("#send").trigger('click');
        }
    });
});
