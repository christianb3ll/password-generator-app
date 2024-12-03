const passwordField = document.getElementById('password');
const uppercase = document.getElementById('uppercase');
const lowercase = document.getElementById('lowercase');
const numbers = document.getElementById('numbers');
const symbols = document.getElementById('symbols');

const strengthLevel = document.getElementById('strength-level');
const strengthIndicator = document.getElementById('strength-indicator');

const copyText = document.getElementById('copy-text');

const uppercaseString = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const lowercaseString = 'abcdefghijklmnopqrstuvwxyz';
const symbolsString = ':<=>?@_!#%&()*+,-.~';
const numbersString = '0123456789';

const rangeSlider = document.getElementById("range")
const min = rangeSlider.min
const max = rangeSlider.max
const value = rangeSlider.value
rangeSlider.style.background = `linear-gradient(to right, #A4FFAF 0%, #A4FFAF ${(value-min)/(max-min)*100}%, #18171F ${(value-min)/(max-min)*100}%, #18171F 100%)`

const lengthCount = document.getElementById('length-count');

// Sets the style and value count for the range slider
rangeSlider.oninput = function() {
    lengthCount.innerHTML = rangeSlider.value;
    this.style.background = `linear-gradient(to right, #A4FFAF 0%, #A4FFAF ${(this.value-this.min)/(this.max-this.min)*100}%, #18171F ${(this.value-this.min)/(this.max-this.min)*100}%, #18171F 100%)`
};

// Generates a new password and updates the password input field
const GeneratePassword = function() {
    const stringLength = rangeSlider.value;
    let passwordString = '';
    let valid = false;
    
     // if no checkboxes ticked return
     if(!(uppercase.checked || lowercase.checked || numbers.checked || symbols.checked)) return;

    // check through each checkbox and add to the character string
    let characters = GetCharacterString(
        uppercase.checked,
        lowercase.checked,
        numbers.checked,
        symbols.checked
    );

    // generate a password string by randomly selecting characters in the character string
    // if an invalid password is generated then the password is regenerated
    while(!valid){
        passwordString = '';

        for(var i = 0; i < stringLength; i++){
            passwordString += GetRandomCharacter(characters);
        }

        valid = CheckValidPassword(passwordString);
    }

    // set password field to the generated string 
    passwordField.value = passwordString;

    EvaluatePassword(passwordString);
}

// Checks the password matches the parameters set by the user
const CheckValidPassword = function(passwordString){
    if(uppercase.checked){
        if(!CompareStrings(uppercaseString, passwordString)) return false;
    }
    if(lowercase.checked){
        if(!CompareStrings(lowercaseString, passwordString)) return false;
    }
    if(numbers.checked){
        if(!CompareStrings(numbersString, passwordString)) return false;
    }
    if(symbols.checked){
        if(!CompareStrings(symbolsString, passwordString)) return false;
    }
    return true
}

// returns a string of characters based on selected values
const GetCharacterString = function(upperChars, lowerChars, numChars, symChars) {
    let characterString = '';

    if(upperChars) characterString += uppercaseString;
    if(lowerChars) characterString += lowercaseString;
    if(numChars) characterString += numbersString;
    if(symChars) characterString += symbolsString;

    return characterString;
}

// returns a random character from a given string
const GetRandomCharacter = function(charString){
    return charString[Math.floor(Math.random() * charString.length)];
}

// assigns a password score and updates the password strength indicator
const EvaluatePassword = function(passwordString){
    let passwordScore = 0;

    // number of characters
    if(passwordString.length > 8) passwordScore += 1;
    if(passwordString.length > 10) passwordScore += 1;
    if(passwordString.length > 12) passwordScore += 1;
    if(passwordString.length > 14) passwordScore += 1;

    // contains lower case letters
    if(CompareStrings(lowercaseString, passwordString)) passwordScore += 1;

    // contains upper case letter
    if(CompareStrings(uppercaseString, passwordString)) passwordScore += 1;

    // contains numbers
    if(CompareStrings(numbersString, passwordString)) passwordScore += 1;

    // contains symbols
    if(CompareStrings(symbolsString, passwordString)) passwordScore += 1;

    if(passwordScore <= 3){
        SetStrengthLevel("too-weak");
    }
    else if (passwordScore <= 4){
        SetStrengthLevel("weak");
    }
    else if (passwordScore <= 5){
        SetStrengthLevel("medium");
    }
    else if (passwordScore >= 6){
        SetStrengthLevel("strong");
    } else {

    }
}

// Applys the password strength level to DOM elements
const SetStrengthLevel = function(level){
    switch(level){
        case("too-weak"):
            strengthLevel.innerHTML = "Too Weak";
            strengthIndicator.classList.add("too-weak");
            strengthIndicator.classList.remove("weak");
            strengthIndicator.classList.remove("medium");
            strengthIndicator.classList.remove("strong");
            break;
        case("weak"):
            strengthLevel.innerHTML = "Weak";
            strengthIndicator.classList.add("weak");
            strengthIndicator.classList.remove("too-weak");
            strengthIndicator.classList.remove("medium");
            strengthIndicator.classList.remove("strong");
            break;
        case("medium"):
            strengthLevel.innerHTML = "Medium";
            strengthIndicator.classList.add("medium");
            strengthIndicator.classList.remove("too-weak");
            strengthIndicator.classList.remove("weak");
            strengthIndicator.classList.remove("strong");
            break;
        case("strong"):
            strengthLevel.innerHTML = "Strong";
            strengthIndicator.classList.add("strong");
            strengthIndicator.classList.remove("too-weak");
            strengthIndicator.classList.remove("weak");
            strengthIndicator.classList.remove("medium");
            break;
        default:
            strengthLevel.innerHTML = "";
    }
}

// compares two stringgs for matching characters
const CompareStrings = function(charString, passwordString){

    let characters = charString.split('');
    let password = passwordString.split('');

    for(let i = 0; i < characters.length; i++){
        if(password.includes(characters[i])) return true;
    }

    return false;
}

// copies the password text field to the clipboard
const CopyToClipboard = function() {
    passwordField.select();
    passwordField.setSelectionRange(0, 99999);
  
    navigator.clipboard.writeText(passwordField.value);
    
    copyText.classList.remove('hidden');

    setTimeout(function(){
        copyText.classList.add('hidden');
    }, 1000);
}

passwordField.addEventListener("input",  () => {
    EvaluatePassword(passwordField.value);
});