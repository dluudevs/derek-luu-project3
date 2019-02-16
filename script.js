const myApp = {};
//organizes and allows global access to variables/methods as modular components - also prevents confict with other code

const budget = [
    // {
    //     name: "food",
    //     subcategory: [
    //         { name: "groceries", amount: 200  },
    //         { name: "restaurants", amount: 100  }
    //     ] 
    // },
    // {
    // demo of the array structure    
];

// *************************************************************************************************

// could empty() be used in one of these instances
// could replace() be used to clear content
// template liteals do not play well with objects, cannot convert them to a string

// *************************************************************************************************

// Neutral state - do not show any categories if there are no sub categories

myApp.init = () => {
    myApp.listenSubmit();
    
}

// get the total of each category
    //eg., how do i get the total of food
    
    // use IndexCategory to get to food
    // go inside the category sum up all amounts reduce??
    // take this total and create a new property after name (eg., {name: food, total: 300})
    
    // dom manipulation 
    // give each category its own line
    // all sub categories should come after category
    
    
    // *** event listener for submit event
myApp.listenSubmit = () => {
    // perform the below functions once user submits form
    $('.input form').on('submit', function(e){
        e.preventDefault();
        myApp.getUserInput();
        // ********** Adding sub category function starts here 
        myApp.createSubCategory(budget, myApp.userCategory);
        // Adding sub category fucntion ends here **********
        $('.input form')[0].reset();
        //https://stackoverflow.com/questions/3786694/how-to-reset-clear-form-through-javascript
    });
}

// *** creates subcategory object in budget/amount array under the selected category
myApp.createSubCategory = (array, category) => {
    // the category parameter is a placeholder for the filterExpense() method which accepts two arguments (so you can use it to filter categories and sub-categories)

    //filter for the category selected by the user - checks if category exists
    const filterCategory = myApp.filterExpense(array, category); 

    //if the category does not exist
    if (filterCategory === undefined || filterCategory.length === 0){
        console.log(`${myApp.userCategory} does not exist`);
        //create a new category and new subcategory in the array
        budget.push( { name: myApp.userCategory, subcategory: [{name:myApp.userSubcategory, amount: myApp.budgetAmount}] } );
        console.log(`New category and sub-category added to your array `, array);
        //calculate category's total and adds it to the array
        myApp.categoryTotal(array, array.length - 1);
        //second parameter is using the array length as an index - the new category is pushed to the end of the array this lets the function kno which category the total is for. Don't forget -1 on length!!!!!!!!

    // if the category already exists 
    } else if (filterCategory.length > 0) {
        // find the category in the array
        myApp.findCategory(array);
        console.log(`Found your category of: ${myApp.userCategory}. It is located in index: ${myApp.indexCategory} in the following array`, array);
        //within category, check if the subcategory exists. If it doesn't; create a new subcategory, calculate the new total of category and add it to the array. If the subcategory exists, alert the user and dont change the data structure.
        myApp.findSubcategory(array);
    }
}

// *** calculates sum of sub-categories in a given category and creates a property of amount in the category
    //call this function only when a sub-category has been added / edited / delete - this way the function only calculates the sum for the affected category (instead of calculating the total every time user click submit)
myApp.categoryTotal = (array, index) => {
    //calculate the sum of its sub categories
    myApp.sumSubCategory = array[index].subcategory.reduce((accumulator, currentValue) => {
        // for object arrays to work with reduce() an initial value must be passed after the callback function (subcategory is an array of objects)
        return accumulator + currentValue.amount;
    }, 0)
    console.log(`Category`, array[index], `total amount is `, myApp.sumSubCategory);
    array[index].amount = myApp.sumSubCategory;
    console.log(array[index]);
    // adds category's amount to the array
}

// *** checks if the sub-category exists. alert the user if sub-category already exists, add the sub-category if it does not
myApp.findSubcategory = (array) => {
    // array is the budget or spent array
    const filterSubcategory = myApp.filterExpense(array[myApp.indexCategory].subcategory, myApp.userSubcategory); 
    //myApp.indexCategory is created by the findCategory function, this function must be called after it

    //  if the array has nothing in it, no subcategories are found. create a new object (subcategory) and an array within it
    if (filterSubcategory === undefined || filterSubcategory.length === 0){
        //create a new sub category
        array[myApp.indexCategory].subcategory.push({ name: myApp.userSubcategory, amount: myApp.budgetAmount });
        console.log(`This sub-category does not exist! I've added it for you`, array);
        // calculate the new total of the category 
        myApp.categoryTotal(array, myApp.indexCategory);
        // second argument is the index posiion of the existing category 
    } else if (filterSubcategory.length > 0) {
        // if that array has more than one item (sub-category exists) - do NOT create a new sub category
        alert("This sub-category already exists!");
    }
}

// *** finds the category inputted by the user in array - returns the index number where the category already exists 
myApp.findCategory = (array) => {
    // matchesCategory is the condition that must be met for the findIndex array method
    myApp.matchesCategory = (category) => {
        // placeholder value represents indices in the array (because it will be passed to findIndex() method)
        return category.name === myApp.userCategory;
        //condition where [index].name === myApp.userCategory
    }
    //conditional function is passed to the findIndex method which will look through all indices that meet the condition
    myApp.indexCategory = array.findIndex(myApp.matchesCategory);
    // stores the index of the category found in the array, add that object to the index 
    // console.log("The selected category is located in this index: ", myApp.indexCategory);
}

// *** checks array for the selected expense category
myApp.filterExpense = (array, category) => {

    //need return to store the value that filter() returns
    return array.filter((index) => {
        return index.name === category;
    });
}

// *** store values of user's input
myApp.getUserInput = () => {
    myApp.userCategory = $('#category-budget').val().toLowerCase();
    // take user's category selection and store it 
    myApp.userSubcategory = $('#subcategory-budget').val().toLowerCase();
    myApp.budgetAmount = myApp.convertNum($('#budget').val());
    // converts user's amount to dollars (inputs always hold string values)
    console.log(`[User category: ${myApp.userCategory}], [User sub-category: ${myApp.userSubcategory}], [User budget: ${myApp.budgetAmount}]`);
    // clear the input - lets user know action has been submitted
}

// *** converts user input to dollars
myApp.convertNum = (string) => {
    return parseFloat(string);
    // parseFloat returns a number with a decimal place
};





// 3) deleting sub categories
    // if user chooses to delete - check if there is an existing sub category and change the object's subcategory to null (assuming we cannot delete objects from the array)
    // once this update is complete, check the array for objects
    // if index has object, print the objects and their totals only if the object does not have a null value for the sub-category (assuming we cannot delete objects from the array)
    // sum up the totals of the objects (category) and print

// 4) editing sub categories 
    // if the user chooses to edit - check if there is an existing sub category
    // editing will replace the number completely
    //if there is an existing category revise the sub category to the edited amount
    //Edit button
        // once checked, anything entered in the amount side will find the input category and change the amount to the amount the user inputs
        // when the user is editing, make it abundantly clear in the input section's h2
        // once the user clicks submit uncheck the edit button (do the same thing with the delete button)

// 5) Delete Button
    //once checked, ask the user to confirm
    //when the user confirms, remove the sub category from the data structure

//  *************************************************************************************************

// Actual / Comparison stretch goal
// for the comparison column - show the result whenever an actual or budget amount is added
    // always go to the comparison property and add 0 when budget/actual amount is added
    // when an actual/budget is deleted make its value = 0
    // always use 0 so that comparison can return a value

$(function () {
    myApp.init();
});
