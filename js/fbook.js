$(document).ready(function () {

  nostalgia.facebookInit();

});

var nostalgia = {
  
  appId : '381309245309547',
  
  authentication : {
    setAll : function (u, a, e) {
      this.userID = u;
      this.accessToken = a;
      this.expiresIn = e;
    },
    clearAll : function () {
      this.userID = null;
      this.accessToken = null;
      this.expiresIn = null;
    },
    userID : null,
    accessToken : null,
    expiresIn : null
  },
  
  facebookInit : function () {
    FB.init({
      appId  : this.appId,
      status : false, // check login status
      cookie : true, // enable cookies to allow the server to access the session
      xfbml  : true, // parse XFBML
      oauth  : true // enable OAuth 2.0
    });
    
    FB.Event.subscribe('auth.logout', function(response) {
        nostalgia.onStatusChange.logout();
        nostalgia.authentication.clearAll();
    });
    
    FB.Event.subscribe('auth.login', function(response) {
        // {
        //   status: "",         /* Current status of the session */
        //   authResponse: {          /* Information about the current session */
        //      userID: ""          /* String representing the current user's ID */
        //      signedRequest: "",  /* String with the current signedRequest */
        //      expiresIn: "",      /* UNIX time when the session expires */
        //      accessToken: "",    /* Access token of the user */
        //   }
        // }
        nostalgia.onStatusChange.login();
        

    });
        
    $("#fb-login-button").click(function () { 
        FB.login(nostalgia.loginHandler, { scope : "user_photos,friends_photos" }); 
    });
    
    $("#fb-get-pictures").click(nostalgia.getTaggedPictures);
    
    $("#fb-logout-link").click(function () { FB.logout(function () { console.log("logged out") })} );
   
    FB.getLoginStatus(this.loginStatusChecker);
    
  },
  
  loginStatusChecker : function(response){
      
      if (response.status === "unknown") {
        // prompt login
        console.log("User not logged into FB");
        nostalgia.onStatusChange.logout();
        
      } else if (response.status === "not_authorized") {
        // display error msg about permissions and prompt login
        console.log("User didn't authorize app");
        nostalgia.onStatusChange.notAuthorized();
        
      } else if (response.status === "connected") {
        // continue
        console.log("user is currently logged in");
        nostalgia.authentication.setAll(response.authResponse.userID, response.authResponse.accessToken, response.authResponse.expiresIn);
        nostalgia.onStatusChange.login();
        
      } else {
        console.log("invalid response returned to login status check.");
      }
      
  },
  
  getTaggedPictures : function () {
    FB.api({
        method: 'fql.query',
        query: 'SELECT images FROM photo WHERE pid IN (SELECT pid FROM photo_tag WHERE subject=me())',
    }, function(response){
        console.log(response);
        
        slidesContainer = $(".rslides")
        for (i=0;i<10;i++) {
          rand = Math.floor(Math.random()*400)
          slidesContainer.append("<li><img src='"+response[rand].images[2].source+"'></li>");
        }
        slidesContainer.responsiveSlides({
            auto: true,             // Boolean: Animate automatically, true or false
            speed: 500,            // Integer: Speed of the transition, in milliseconds
            timeout: 4000,          // Integer: Time between slide transitions, in milliseconds
            pager: false,           // Boolean: Show pager, true or false
            nav: false,             // Boolean: Show navigation, true or false
            maxwidth: 760
  
          });
    });

  },
  
  onStatusChange : {
    logout : function () {
      //FB.login(this.loginResponse);
      $("#fb-logged-out").show();
      $("#fb-logged-in").hide();
    },
    
    notAuthorized : function () {
      $("#fb-logged-out").show();
      $("#fb-logged-in").hide();
    },
    
    login : function () {
      $("#fb-logged-out").hide();
      $("#fb-logged-in").show();
    }
  }
  
}
