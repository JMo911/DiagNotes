$(document).ready(function() {
    $('input').val('');
    // Username can't be blank and needs to be letters and numbers only
    $('#login-username').on('input', function() {
        var input = $(this);
        var re = /^[a-zA-Z0-9]*$/;
        var is_name = re.test(input.val());
        if(is_name) {
            input.removeClass("invalid").addClass("valid");
        } else {
            input.removeClass("valid").addClass("invalid");
        }
    });

    // Password can't be blank and needs to be letters and numbers only
    $('#login-password').on('input', function() {
        var input=$(this);
        var re = /^([a-zA-Z0-9])*$/;
        var is_password = re.test(input.val());
        if(is_password) {
            input.removeClass("invalid").addClass("valid");
        } else {
            input.removeClass("valid").addClass("invalid");
        }
    });
    
    // After Form Submitted Validation
    $("#login-button").click(function(event){
        var form_data = $("#login-form").serializeArray();
        var error_free = true;
        for (var input in form_data){
            var element = $("#login-"+form_data[input]['name']);
            var valid = element.hasClass("valid");
            var error_element = $("span", element.parent());
            if (!valid){
                error_element.removeClass("error").addClass("error_show");
                error_free = false;
            } else {
                error_element.removeClass("error_show").addClass("error");
            }
        }
        if (!error_free){
            event.preventDefault(); 
        } else {
            window.location.href = "caltemplate.html";
            return false;
        }     
    });

});