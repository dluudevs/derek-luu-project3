const myApp = {};

const budget = [
    // {
    //     name:"food",
    //     amount:300
    // }
];
// data structure

// NOTES TO SELF:
    //write functions as you need them. dont write a function as you need them (re-use) and dont create a function and try to use it everywhere
    //if something breaks - psuedo code what you expect to happen and compare with what is actually happening

myApp.init = () => {

    myApp.listenEdit(budget);
    //do all the UX changes
    //change the h2
    //select the category
    //go to the amount input
    //if another category is selected 
        //assume user wants to add (listen for submit)
        //uncheck the button
        //change the h2 back
        //remove the selected attribute
        //end the function (don't change the array and dont print)
    //else if edit button is checked - listen for the user to click submit (if the user clicks delete the event listener will fire and nothing will have changed) - give it its own button
        //append the array
            //get the category
            //find the index in the array
            //edit amount in the array
        //print the new amount
        //change the h2 back
        //reset form (covers the below)
        //remove the selected attribute
        //uncheck button
    
    //listen for delete 
    myApp.listenDelete(budget); 
    //shoot popup window and ask user for confirmation
    //get category of delete button (for alert message)
    //if user confirms (alert message) to delete expense
        //run delete
            // find index in the array
            // delete in the array
            // delete in DOM
            //uncheck button
    //else (if user cancels out) just uncheck the button
    
    
    myApp.listenAdd(budget);
    //listen for add 
        //if in edit state, do nothing
        // else add to array and print
};


//Add
myApp.listenAdd = (array) => {
    $('.input form').on('submit', function (e) {
        e.preventDefault();

        // only add the expense if edit button is not checked (to avoid conflicting event listeners)
       
        myApp.getUserInput();

        console.log(`from listenAdd [User category: ${myApp.userCategory}], [User budget: ${myApp.amount}]`);
        // returns the index of the user selected expense - alerts user if expense already exists
        
        let addIndex = array.findIndex((category) => {
            return category.name === myApp.userCategory;
        });

        console.log("addIndex is ", addIndex);

        //if the array is empty or the expense doesnt exist - push expense to the array
        if (addIndex === -1){
            array.push( {name: myApp.userCategory, amount: myApp.amount} );
        } else {
            alert(`This expense already exists!`);
        }
        
        // printexpense
        myApp.printExpenses(array, addIndex);
        
        //resets form after submission
        $('.input form')[0].reset();
    });
};


// *** store values of user's input
myApp.getUserInput = () => {
    
    // *** converts user input to dollars
    myApp.convertNum = (string) => {
        return parseFloat(string);
        // parseFloat returns a number with a decimal place
    };
    
    // take user's category selection and store it 
    myApp.userCategory = $('#category-budget').val().toLowerCase();
    myApp.amount = myApp.convertNum($('#budget').val());
    
    console.log(`[User category: ${myApp.userCategory}], [User budget: ${myApp.amount}]`);
};

//prints expense - add to DOM if new expense, amend if expense already exists (for edit function)
myApp.printExpenses = (array, index) => {

    // if the index is -1 (no existing expenses)
    if (index === - 1){

        // append a new line in the DOM
        $('.heading').after(`
            <tr class="${myApp.userCategory} category">
                <td class=name>${myApp.userCategory}</td>
                <td class=budget>$ ${myApp.amount}</td>
                <td><input type=radio name=action value=${myApp.userCategory} class=edit></td>
                <td><input type=radio name=action value=${myApp.userCategory} class=delete></td>
            </tr>
        `);

    // if the expense exists (assuming the amount is updated) amend its amount the DOM
    } else if (index > -1) {

        // find it in the budget array
        let printName = array[index].name;
        let printAmount = array[index].amount;

        //print the revised amount to the DOM    
        $(`.${printName}.category .budget`).text(`$ ${printAmount}`);
    };
};
        

//Edit
//listen for the edit 
myApp.listenEdit = (array) => {
    
    //event listeners are dynamic AF - they are ALWAYS listening. NO need to tell the function to call itself
    $('table').on('click', '.edit', function () {

        // get the category of the edit button 
        let editValue = $('.edit:checked').val();
        // select the category for the user
        $(`option[value="${editValue}"]`).prop("selected", true); 


        //update UI for edit mode
        $(`.input h2`).text(`Editing: Please enter a new amount`); 
        //highlight the amount box
        $('#budget').focus();
        //add class to hide the add button
        $('.submit-button').addClass('hidden');
        //remove class to show the button
        $('.edit-button').removeClass('hidden'); 

        //listen if another category is selected 
        $('#category-budget').on('change', function(){
            //restore UI to neutral state
            //clear edit button
            $('input.edit').prop('checked', false);
            //turn off edit mode
            myApp.editOff();
            //put cursor on amount input
            $('#budget').focus();
            
            //once the category changes selected attribute on the option is automatically changed to false
        });

        // edit expense - also checks if the edit button is clicked
        myApp.editExpense(array);
        
    }); 
};


//*** when submit button is clicked, edit expenses
myApp.editExpense = (array) => {

    $('button.edit-button').on('click', function (e) {
        //store user input 
        myApp.getUserInput();
        // returns index of the user selected expense - should always return an index > 1
        let editIndex = array.findIndex((category) => {
            //use let (instead of name space) for local access only. only this function can change the variable's  value.
            return category.name === myApp.userCategory
        })
        console.log("editExpense here. user selected category: ", myApp.userCategory);
        // amend the amount in the array
        array[editIndex].amount = myApp.amount;
        console.log("this is the new array: ", array);
        //print the new amount
        myApp.printExpenses(array, editIndex);

        //restore UI to neutral state
        //change text back after new amount submitted
        $('.edit').prop('checked', false);
        //turn off edit mode
        myApp.editOff();
        //resets form after submission
        $('.input form')[0].reset();
    });
}    

//restores buttons and h2 to neutral state
myApp.editOff = () => {
    //removing class forces add button to show up
    $('.submit-button').removeClass('hidden');
    //adding class hides the edit button
    $('.edit-button').addClass('hidden');
    ///restore h2 to neutral state
    $(`.input h2`).text(`Please enter your monthly budget`);
}

//Delete
//listen for the delete button
    // ask the user if they really want to delete ${category} in your message
myApp.listenDelete = (array) => {
    $('table').on('click', '.delete', function(){

        //get category of the delete button (lowercase)
        let deleteValue = $('.delete:checked').val();
        // get the category name's text (for the capitalized text)
        let expenseString = $(`.${deleteValue}`).find(`.name`).text()

        let result = confirm("Please confirm you want to delete", expenseString);
        //if user confirms to delete
        if (result){
            // take the value of the category the user wants to delete
            //switch on delete mode - no popup about existing expense

            // returns index of the user selected expense - should always return an index > 1
            let deleteIndex = array.findIndex((category) => {
                //use let (instead of name space) for local access only. only this function can change the variable's  value       
                return category.name === deleteValue;          
            }); 
            //delete category in the array
            array.splice(deleteIndex, 1);
            //delete category in the DOM
            $(`.${deleteValue}.category`).empty();

           //restore UI to neutral state
            //clear radio button
            $('input[type="radio"]').prop('checked', false);
            //turn off edit mode
            myApp.editOff();
            //resets form after submission
            $('.input form')[0].reset();
            // let the user know the expense has been deleted
            alert(`You have deleted ${expenseString}`);
            
        } else {
            //uncheck button so user is aware delete didnt go through
            alert(`Delete cancelled`)
            //restore UI to its neutral state
            //clear radio button
            $('.delete').prop('checked', false);
            //turn off edit mode
            myApp.editOff();
            //resets form after submission
            $('.input form')[0].reset();
            //change selected category to default
            // $(`option[value="default"]`).prop("selected", true);
        }
    });
    //resets form after submission
    $('.input form')[0].reset();

}





   
//Document ready son
$(function (){
    myApp.init();
});