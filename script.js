const myApp = {};

const budget = [
    // {
    //     name:"food",
    //     amount:300
    // }
];
// data structure


//TODO:Remove console logs

myApp.init = () => {
   //how to create if statement for event listeners (ie., listen for edit click and delete click, if none clicked run function)

    myApp.listenDelete(budget);

    myApp.listenSubmit(budget);
    
};

myApp.listenSubmit = (array) => {
    $('.input form').on('submit', function (e) {
        e.preventDefault();
        if($('.edit').is(':checked')){
            myApp.editStatus = true;
            myApp.editExpense(array);
        } else {
            myApp.addExpense(array)
        }
    });
}


//Add
myApp.addExpense = (array) => {
    
        // store user's input
        myApp.getUserInput();
        // returns the index of the user selected expense - alerts user if expense already exists
        myApp.findExpense(array, myApp.userCategory);
        //if the array is empty or the expense doesnt exist - push expense to the array
        if (myApp.expenseIndex === -1){
            myApp.pushArray(array, myApp.userCategory, myApp.amount);
        }
        // printExpense - will add amount to DOM if category is new, wil amend amount if category is existing
        myApp.printExpenses(array, myApp.expenseIndex);

        //resets form after submission
        $('.input form')[0].reset();
    
}

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

    // console.log(`[User category: ${myApp.userCategory}], [User budget: ${myApp.amount}]`);
};

//*** finds index of the expense - store the value for when we run the printExpenses and edit method 
myApp.findExpense = (array, category) => {

    // console.log("findExpense is looking into this array: ", array);

    //use findIndex to look for category
    myApp.expenseIndex = array.findIndex((index) => {
        return index.name === category;
    });

    //if the category exists AND the user did not check off edit, AND did not check off delete
    if (myApp.expenseIndex > - 1 && myApp.editStatus === undefined && myApp.deleteStatus === undefined){
        //do nothing, alert tell user to use edit function
        alert(`This expense exists already. Please select another expense or click edit`);
    } else if (myApp.expenseIndex === -1 && myApp.editStatus == true){
        alert(`You're trying to edit an expense that doesn't exist!`);
    }
        
    // console.log ("the index of the expense you are looking for: ", myApp.expenseIndex, "if -1 the expense does not exist");
};

//*** adds user input to the end of the array
myApp.pushArray = (array, name, amount) => {
    array.push({name: name, amount: amount});
}

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
//listen for the edit/delete - if edit or delete is clicked do not run add function 
// if edit button is checked

myApp.editExpense = (array) => {
    //clear radio button
    $('input[type="radio"]').prop('checked', false);
    //store user input 
    myApp.getUserInput();
    // returns index of the user selected expense
    myApp.findExpense(array, myApp.userCategory);
    //reset delete status - dependent has been invoked (findExpense)
    myApp.editStatus = undefined;
    // console.log("editexpense has this expenseIndex: ", myApp.expenseIndex);
    // amend the value
    array[myApp.expenseIndex].amount = myApp.amount;
    // console.log("this is the new array: ", array);
    //print the new amount
    myApp.printExpenses(array, myApp.expenseIndex);
}
     


// *** UX ***
//this all requires event listeners
//pre-select the category that the user clicked on
//make the value = to the category name (make this the value of the button?)
// change the h2 to editing - highlight the row if possible
    //add the class
    //force prop clicked = true to prompt css animation
    

//Delete
//listen for the edit/delete button - if delete is clicked do not run add function
    // ask the user if they really want to delete ${category} in your message
    myApp.listenDelete = (array) => {
        $('table').on('click', '.delete', function(){
            // ask user for confirmation
            let result = confirm("Please confirm you want to delete")
            if (result){
                // take the value of the category the user wants to delete
                let deleteValue = $('.delete:checked').val();
                //switch on delete mode - no popup about existing expense
                myApp.deleteStatus = true;
                // find the index of the category selected by the user
                myApp.findExpense(array, deleteValue);
                //reset delete status - dependent has been invoked (findExpense)
                myApp.deleteStatus = undefined;
                array.splice(myApp.expenseIndex, 1);
                // console.log(array);
                $(`.${deleteValue}.category`).empty();

                // let the user know the expense has been deleted
                let expenseString = myApp.capitalize(deleteValue);
                alert(`You have deleted ${expenseString}`);
            };
        });
    }

    myApp.capitalize = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

$(function (){
    myApp.init();
})