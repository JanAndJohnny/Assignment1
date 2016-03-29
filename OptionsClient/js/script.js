// Code goes here

(function () {

    var app = angular.module("studentWebsite", []);

    var MainController = function ($scope, StudentService) {

        $scope.register = function () {
            console.log("REGISTER");

            var url = "http://a2b.johnnymarin.com/api/Account/Register";
            var username = $("#registerUsername").val();
            var email = $("#registerEmail").val();
            var password = $("#registerPassword").val();
            var confirmPass = $("#registerPasswordConfirm").val();

            if (email == "" || username == "" || password == "" || confirmPass == "") {
                $("#registerMessage").text("Fields are required");
                $("#registerMessage").css("color", "red");
                return;
            }

            if (confirmPass != password) {
                $("#registerMessage").text("Passwords do not match");
                $("#registerMessage").css("color", "red");
                return;
            }

            if ((username.substring(0, 3) != "A00" || username.substring(0, 3) != "a00") && username.length != 9) {
                $("#registerMessage").text("Username length must b 9 length and start with a00");
                $("#registerMessage").css("color", "red");
                return;
            }

            var data = {
                UserName: username,
                Email: email,
                Password: password,
                ConfirmPassword : confirmPass
            };
            console.log(data);
            $.ajax({
                type: 'POST',
                url: url,
                data: data
            }).done(function (data) {
                $("#registerMessage").text("Register Complete");
                $("#optionMessage").css("color", "red");
            }).fail(function (err) {
                $("#registerMessage").text(err.responseText);
                $("#optionMessage").css("color", "red");
            });
        }

        $scope.logInUser = function () {
            console.log("LOG IN");
            var username = $("#loginUsername").val();
            var password = $("#loginPassword").val();
            var url = "http://a2b.johnnymarin.com/Token";

            if ( username == "" || password == "") {
                $("#loginMessage").text("Fields are required");
                $("#loginMessage").css("color", "red");
                return;
            }

            var loginData = {
                grant_type: 'password',
                UserName: username,
                Password: password
            };

            $.ajax({
                type: 'POST',
                url: url,
                data: loginData
            }).done(function (data) {
                console.log("LOGGED IN");
                document.cookie = "token=" + data["access_token"];
                document.cookie = "username=" + data["userName"];
                //checkCookie();
                console.log(data["access_token"]);
                $("#optionStudentId").val(data["userName"]);
                $("#loginMessage").text("Login Success");
                $("#loginMessage").css("color", "green");

            }).fail(function (err) {
                $("#loginMessage").text("Password and Username combination is wrong");
                $("#loginMessage").css("color", "red");
            });
        }

        $scope.pickChoice = function () {
            console.log("CHOICE");

            var url = "http://a2b.johnnymarin.com/api/Choices";
            var yearTermId = ($("#idForYearTerm").val());
            var studentId = $("#optionStudentId").val();
            var firstName = $("#optionFirstName").val();
            var lastName = $("#optionLastName").val();
            var firstChoice = parseInt($("#firstOption").val());
            var secondChoice = parseInt($("#secondOption").val());
            var thirdChoice = parseInt($("#thirdOption").val());
            var fourthChoice = parseInt($("#fourthOption").val());

            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth() + 1; 
            var yyyy = today.getFullYear();

            var hour = today.getHours();
            var min = today.getMinutes();
            var second = today.getSeconds();

            var timeStamp = "AM";

            if(hour >= 12){
                timeStamp = "PM";
            }

            var todayString = yyyy + "-" + mm + "-" + dd + " " + hour + ":" + min + ":" + second + " " + timeStamp;

            if (firstName == "" || lastName == "") {
                $("#optionMessage").text("Fields are required");
                $("#optionMessage").css("color", "red");
                return;
            }

            var data = {
                YearTermId: yearTermId,
                StudentId: studentId,
                StudentFirstName: firstName,
                StudentLastName: lastName,
                FirstChoiceOptionId: firstChoice,
                SecondChoiceOptionId: secondChoice,
                ThirdChoiceOptionId: thirdChoice,
                FourthChoiceOptionId: fourthChoice,
                SelectionDate: todayString
            };

            if(firstChoice == secondChoice || firstChoice == thirdChoice || firstChoice == fourthChoice ||
                secondChoice == thirdChoice || secondChoice == fourthChoice ||
                thirdChoice == fourthChoice) {
                $("#optionMessage").text("One of your option choices are the same as the others option choices");
                $("#optionMessage").css("color", "red");
                return;
            }

            $.ajax({
                type: 'POST',
                url: url,
                data: data
            }).done(function (data) {
                console.log("CHOICE COMPLETE");
                // Cache the access token in session storage.
                //sessionStorage.setItem(tokenKey, data.access_token);
                $("#optionMessage").text("Has Been Added");
                $("#optionMessage").css("color", "green");
            }).fail(function (err) {
                console.warn(err);
                $("#optionMessage").text(err.responseText);
                $("#optionMessage").css("color","red");
                console.log(err.responseText);
            });
        }

        $scope.populateOption = function () {
            $.ajax({
                url: "http://a2b.johnnymarin.com/api/Choices/registerJsonObject"
            }).done(function (data) {
                console.log("Seeding Data In Options");
                yearTerm = jQuery.parseJSON(data["curYearTerm"]);
                putYearTermId(yearTerm);
            });
        };

        function putYearTermId(yearTerm) {
            var YearTermString = yearTerm.Year + " ";
            if (yearTerm.Term == 10) {
                YearTermString += "Winter";
            } else if (yearTerm.Term == 20) {
                YearTermString += "Spring/Summer";
            } else {
                YearTermString += "Fall";
            }
            $("#optionYearTerm").val(YearTermString);
            $("#idForYearTerm").val(yearTerm.YearTermId);
        }

        function putUsersUserName(listUsersUserName) {
            var arrayUsersUserName = new Array();
            $.each(listUsersUserName, function (index, element) {
                var user = {
                    title: element.UserName,
                    value: element.UserName
                };
                arrayUsersUserName.push(user);
            });

            console.log(arrayUsersUserName);
            $scope.DropDownStudentID = arrayUsersUserName;
        }

        function putOptionsList(validOptionsList) {
            console.log("putOptions");
            var arrayValidOptions = new Array();
            $.each(validOptionsList, function (index, element) {
                var option =  {
                    title: element.Title,
                    value: element.OptionId
                };
                arrayValidOptions.push(option);
            });
            $scope.firstOptionChoices = arrayValidOptions;
            $scope.secondOptionChoices = arrayValidOptions;
            $scope.thirdOptionChoices = arrayValidOptions;
            $scope.fourthOptionChoices = arrayValidOptions;
        }

        $.ajax({
            url: "http://a2b.johnnymarin.com/api/Choices/registerJsonObject"
        }).done(function (data) {
            validOptionsList = jQuery.parseJSON(data["validOptionsList"]);
            //listUsersUserName = jQuery.parseJSON(data["listUsersUserName"]);
            putOptionsList(validOptionsList);
            //putUsersUserName(listUsersUserName);
        });

        function getCookie(cname) {
            var name = cname + "=";
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') c = c.substring(1);
                if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
            }
            return "";
        }

        function checkCookie() {
            var username = getCookie("token");
            if (username != "") {
                console.log("FOUND COOKIE");
            } else {
                console.log("COOKIE NOT THERE");
            }
        }

        /*
        $scope.regions = [
                {
                    name: "Alabama",
                    code: "AL"
                },
                {
                    name: "Alaska",
                    code: "AK"
                },
                {
                    name: "American Samoa",
                    code: "AS"
                }
        ];
        */


        /*
        var onGetAllComplete = function (data) {
            $scope.characters = data;
        };

        var onGetAllError = function (reason) {
            $scope.error = "Could not get all cartoon characters.";
        };

        $scope.search = function () {
            CartoonService.getAllCartoonCharacters()
              .then(onGetAllComplete, onGetAllError);
        };

        var onFindComplete = function (data) {
            $scope.person = data;
        };

        var onFindError = function (reason) {
            $scope.error = "Could not find a cartoon character.";
        };

        $scope.findCartoonCharacter = function (personId) {
            CartoonService.getCartoonCharacter(personId)
            .then(onFindComplete, onFindError);
        };

        var onAddComplete = function (data) {
            $scope.newPerson = data;

            _cartoonCharacter.FirstName = "";
            _cartoonCharacter.LastName = "";
            _cartoonCharacter.Gender = "";
            _cartoonCharacter.Occupation = "";

            _cartoonCharacter.Picture = "http://flintstones.zift.ca/images/Disney/";
        };

        var onAddError = function (reason) {
            $scope.error = "Could not add a cartoon character.";
        };

        $scope.addCartoonCharacter = function () {
            var data = {
                FirstName: $scope.cartoonCharacter.FirstName,
                LastName: $scope.cartoonCharacter.LastName,
                Gender: $scope.cartoonCharacter.Gender,
                Occupation: $scope.cartoonCharacter.Occupation,
                Picture: $scope.cartoonCharacter.Picture
            }
            CartoonService.addCartoonCharacter(data)
            .then(onAddComplete, onAddError);
        };

        var onDeleteComplete = function (data) {
            $scope.characters = data;
            $("#dialog_delete").dialog();
            $scope.PersonId = 0;
        };

        var onDeleteError = function (reason) {
            $scope.error = "Could not delete cartoon characters.";
        };

        $scope.deleteCartoonCharacter = function (personId) {
            CartoonService.deleteCartoonCharacter(personId)
            .then(onDeleteComplete, onDeleteError);
        };

        var onUpdateComplete = function (data) {
            $scope.person = undefined;
            $("#dialog_update").dialog();
        };

        var onUpdateError = function (reason) {
            $scope.error = "Could not delete cartoon characters.";
        };

        $scope.updateCartoonCharacter = function () {

            var data = {
                PersonId: $scope.person.PersonId,
                FirstName: $scope.person.FirstName,
                LastName: $scope.person.LastName,
                Gender: $scope.person.Gender,
                Occupation: $scope.person.Occupation,
                Picture: $scope.person.Picture
            }

            CartoonService.updateCartoonCharacter(data)
            .then(onUpdateComplete, onUpdateError);
        };

        $scope.PersonId = 0;
        $scope.message = "All Cartoon Characters";
        $scope.cartoonCharacter = _cartoonCharacter;
        */
    };

    app.controller("studentController", MainController);
}());