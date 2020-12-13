$(document).ready(function() {
	//getWeather();
	getPosts();
});

function getWeather(searchQuery) {
  //const cityId = "4166298"; // N.Sarasota
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${searchQuery}&appid=${apiKey}&units=imperial`

	$.ajax(url, {success: function(data) {

		$("#city").text(data.name);
		$("#temp").text(data.main.temp);
		$("#sunset").text(Date(data.sys.sunset * 1000).toLocaleString());
	  $("#error").text("");
	}, error: function(error) {
		$("#error").text("Error occurred.");
	}});
};

function search() {
	let searchQuery = $("#search").val();
	getWeather(searchQuery);
};

function handleSignIn() {
	let provider = new firebase.auth.GoogleAuthProvider();

	firebase.auth().signInWithPopup(provider).then(function(result) {
	  // This gives you a Google Access Token. You can use it to access the Google API.
	  let token = result.credential.accessToken;
	  // The signed-in user info.
	  let user = result.user;
	  console.log(user.email);
  }).catch(function(error) {
	  // Handle Errors here.
	  let errorCode = error.code;
	  let errorMessage = error.message;
	  // The email of the user's account used.
	  let email = error.email;
	  // The firebase.auth.AuthCredential type that was used.
	  let credential = error.credential;
	  // ...
  });
};

function addMessage(postTitle, postBody) {
	let postData = {
		title: postTitle,
		body: postBody
	};

	let database = firebase.database().ref("posts");
  let newPostRef = database.push();
  newPostRef.set(postData, (error) => {
	  if (error) {
	    // The write failed...
	  } else {
	    // Data saved successfully!
	    window.location.reload();
	  }
	});
};

function handleMessageFormSubmit() {
	let postTitle = $("#post-title").val();
	let postBody = $("#post-body").val();
	addMessage(postTitle, postBody);
};

function getPosts() {
  return firebase.database().ref("posts").once('value').then((snapshot) => {
    let posts = snapshot.val();
    
    for (let postKey in posts) {
    	console.log("postIndex: " + postKey)
    	let post = posts[postKey];
    	console.log("post: " + post)

    	$("#post-listing").append("<div>" + post.title + " - " + post.body + "</div>");
    };
});

};