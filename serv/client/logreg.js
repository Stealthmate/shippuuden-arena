function onSubmitLogin() {

}

const LOGIN_SUBMIT_URL = "login"

function onSubmitLogin(evt) {
    evt.preventDefault();

    var username = $("#loginform .login#username").val();
    var password = $("#loginform .login#password").val();

    var request_body = {
        username: username,
        password: password
    };

    $.post(LOGIN_SUBMIT_URL, request_body, (result) => {
        console.log(result);
        setTimeout(() => {
            $(".sharingan").removeClass("shown");
            $(".tsukuyomi").addClass("shown");
            $("#eyes").removeClass("shown");
        }, 2000);
    });

    $(".sharingan").addClass("shown");
    $(".formpanel").removeClass("shown");
    $(".toggleregform").removeClass("shown");
}


function onToggleRegForm() {
    $(".toggleregform").toggleClass("shown");
    $(".formpanel").toggleClass("shown");
}

function init() {
    $(".toggleregform").on("click", onToggleRegForm);
    $("form").on("submit", onSubmitLogin);
}
