const budgetApp = {};
//organizes and allows global access to variables

const budget = [
    // {
    //     name: "food",
    //     subcategory: [
    //         { name: "groceries", amount: 200  },
    //         { name: "restaurants", amount: 100  }
    //     ] 
    // },
    // {
    //     name: "entertainment",
    //     subcategory: [
    //         { name: "movies",  amount: 200  },
    //         { name: "drinks",  amount: 100  }
    //     ]
    // }
];


// use forEach 


// object organizes global variables/functions as modular components - also prevent conflicts from other code 
// create an object that holds functions??? would it better to hold all the data in one object as well????
// TODO: finishing basic styling - try moving data from food array (test if dom manipulation is feasible before proceeding further)


// Features
//     - Add sub categories to categories
//     - Categories update dynamically based on total sub categories
//         o	Cannot create a sub category that already exists
//         o	Do not create another sub category if you want to update an existing one
//         o	Give user option to delete a subcategory and update the total
//      - message window for users giving feedback when expense added/edited/deleted??
//     - Show total budgeted amount
// Extras
//     - Actuals column / comparison column
//         o	With the result include a message
//     - Show either column in a pie chart 


// could empty() be used in one of these instances
// could replace() be used to clear content
// selector will create the element if it does not already exist

// *************************************************************************************************

// Neutral state - do not show any categories if there are no sub categories

budgetApp.init = () => {
    budgetApp.listenSubmit();
}

budgetApp.convertNum = (string) => {
    return parseFloat(string);
    // parseFloat returns a number with a decimal place
};

// 1) Add sub categories to categories
// if user chooses to add find the appropriate array and create an object 
// when the user clicks submit take user input and create an object in the array

budgetApp.listenSubmit = () => {
    // perform the below functions only after the form has been submitted
    $('.input form').on('submit', function(e){
        e.preventDefault();
        budgetApp.userCategory = $('#category').val();
        // take user's category selection and store it 
        budgetApp.userSubcategory = $('#subcategory').val();
        budgetApp.budget = $('#budget').val();
        budgetApp.budgetAmount = budgetApp.convertNum(budgetApp.budget);
        console.log(typeof budgetApp.budgetAmount);
        // it returns as a number!!!!!

        console.log('User clicked submit, category selected is:', budgetApp.userCategory);
        budgetApp.findCategory();
    });
}

//check for the selected expense category before creating an object 
budgetApp.findCategory = () => {
    const category = budget.filter((index) => {
        return index.name === budgetApp.userCategory;
    });

    if (category === undefined || category.length === 0){ 
        //create category and subcategory in the array
        console.log("Your array is empty");
        budget.push( { name: budgetApp.userCategory, subcategory: [ { name:budgetApp.userSubcategory, amount: budgetApp.budgetAmount } ] } );
        console.log("New item added to your array", budget);
    } else {
        console.log("Found your category!!");
        // create sub-category within category (same index)
    }
       
}
// if object does not exist, create the object



    // user selects category and names sub category - these inputs create the new object (subcategory and amount properties)
    // if there is no subcategory being added, simply create a total object
    // only update when user clicks submit

// 2) add sub categories
    // only update the category when a sub category is added/edited/deleted
    // when user wants to create a sub category, iterate through the array and look for the object to ensure it does not already exist
            // if the sub category already exists, let the user know - dont update the eamounts
            // sum up the totals of the objects (category) and print

// 3) deleting sub categories
    // if user chooses to delete - check if there is an existing sub category and change the object's subcategory to null (assuming we cannot delete objects from the array)
    // once this update is complete, check the array for objects
    // if index has object, print the objects and their totals only if the object does not have a null value for the sub-category (assuming we cannot delete objects from the array)
    // sum up the totals of the objects (category) and print

// 4) editing sub categories 
    // if the user chooses to edit - check if there is an existing sub category
    // editing will replace the number completely
    //if there is an existing category revise the sub category to the edited amount

// 5) showing comments
        // if add function is run print add
        // if delete function is run print delete

// 6) showing the data
    //when the user clicks submit after adding/editing/deleting sub category
    // display all the sub categories for that category and their amounts
    // display the category total  


//7) Edit button
    // once checked, anything entered in the amount side will find the input category and change the amount to the amount the user inputs
    // when the user is editing, make it abundantly clear in the input section's h2
    // once the user clicks submit uncheck the edit button (do the same thing with the delete button)

//8) Delete Button
    //once checked, ask the user to confirm
    //when the user confirms, remove the sub category from the data structure

//  *************************************************************************************************

// Actual / Comparison stretch goal
// for the comparison column - show the result whenever an actual or budget amount is added
    // always go to the comparison property and add 0 when budget/actual amount is added
    // when an actual/budget is deleted make its value = 0
    // always use 0 so that comparison can return a value

$(function () {
    budgetApp.init();
});
