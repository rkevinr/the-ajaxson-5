
$(document).ready(function() {
    // register our function as the "callback" to be triggered by the form's submission event
    $("#form-gif-request").submit(fetchAndDisplayGif); // in other words, when the form is submitted, fetchAndDisplayGif() will be executed
});


function setCaptchaStatus(isValidCaptcha) {
    $("#captcha_err").attr("hidden", isValidCaptcha);
    $("#captcha_err_msg").attr("hidden", isValidCaptcha);
    $("#sub_captcha").attr("hidden", isValidCaptcha);
}

/**
 * sends an asynchronous request to Giphy.com asking for a random GIF using the 
 * user's search term (along with "jackson 5")
 * 
 * upon receiving a response from Giphy, updates the DOM to display the new GIF
 */
function fetchAndDisplayGif(event) {
    
    // This prevents the form submission from doing what it normally does: send a request (which would cause our page to refresh).
    // Because we will be making our own AJAX request, we dont need to send a normal request and we definitely don't want the page to refresh.
    event.preventDefault();

    // check "captcha"
    var user_captcha = $("#five_or_5").val();
    if (user_captcha != "5" && user_captcha != "Five" && user_captcha != "five") {
        setCaptchaStatus(false);
        return;
    } else {
        setCaptchaStatus(true);
    }
    
    // get the user's input text from the DOM
    var searchQuery = $("#userSearchTerm").val();

    searchQuery = "Jackson 5 " + searchQuery; // FIXME: concatenate terms correctly, and encode?
    console.log("searchQuery (all):" + searchQuery);

    // configure a few parameters to attach to our request
    var params = { 
        api_key: "dc6zaTOxFJmzC", 
        tag : searchQuery
    };
    
    // make an ajax request for a random GIF
    $.ajax({
        url: "https://api.giphy.com/v1/gifs/random",
        data: params, // attach those extra parameters onto the request
        beforeSend: function() {
            $("#feedback_msg").text("Loading...");
            setGifLoadedStatus(false);
        },
        success: function(response) {
            // if the response comes back successfully, the code in here will execute.
            
            // jQuery passes us the `response` variable, a regular javascript object created from the JSON the server gave us
            console.log("we received a 'success' response!");
            
            console.log("image URL:  " + response.data.image_url);
            returned_url = response.data.image_url;

            // Ajax call can "succeed", but not return an image URL
            if (returned_url) {
                $("#gif").attr("src", returned_url);
                setGifLoadedStatus(true);
            } else {
                $("#feedback_msg").text("No link to image received.  Please try again.");
                setGifLoadedStatus(false);
            }
        },
        error: function() {
            // if something went wrong, the code in here will execute instead of the success function
            // give the user an error message
            $("#feedback_msg").text("Sorry, could not load GIF. Try again!");
            setGifLoadedStatus(false);
        }
    });
    
}


/**
 * toggles the visibility of UI elements based on whether a GIF is currently loaded.
 * if the GIF is loaded: displays the image and hides the feedback label
 * otherwise: hides the image and displays the feedback label
 */
function setGifLoadedStatus(isCurrentlyLoaded) {
    $("#gif").attr("hidden", !isCurrentlyLoaded);
    // $("#feedback").attr("hidden", isCurrentlyLoaded);
    $("#feedback_div").attr("hidden", isCurrentlyLoaded);
}
