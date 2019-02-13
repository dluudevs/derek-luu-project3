let food = [
    { groceries: {budget: 200, actual: 180} },
    { restaurants: {budget: 100, actual: 90} }
];
// TODO: finishing basic styling - try moving data from food array (test if dom manipulation is feasible before proceeding further)


// let food = [{sub}, "dine-out"];
// category is an array with sub categories as objects (budget, amount is grouped together)


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

// Array and object will be holding the data - all inputs will update the array/object 

// Neutral state - do not show any categories if there are no sub categories
$( function(){
    console.log("Document Ready!!");
});

// 1) Add sub categories to categories
// user has choice to add/delete/edit
// if user chooses to add find the appropriate array and create an object 
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

// Actual / Comparison stretch goal
// for the comparison column - show the result whenever an actual or budget amount is added
    // always go to the comparison property and add 0 when budget/actual amount is added
    // when an actual/budget is deleted make its value = 0
    // always use 0 so that comparison can return a value


