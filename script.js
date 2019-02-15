const myApp = {};
//organizes and allows global access to variables/methods as modular components - also prevents confict with other code

const budget = [
    {
        name: "food",
        subcategory: [
            { name: "groceries", amount: 200  },
            { name: "restaurants", amount: 100  }
        ] 
    },
    {
        name: "entertainment",
        subcategory: [
            { name: "movies",  amount: 200  },
            { name: "drinks",  amount: 100  }
        ]
    }
];

// *************************************************************************************************

// could empty() be used in one of these instances
// could replace() be used to clear content
// selector will create the element if it does not already exist
// use reduce to sum up all amounts of sub category 

// *************************************************************************************************

// Neutral state - do not show any categories if there are no sub categories

myApp.init = () => {
    myApp.listenSubmit();
}

// 1) Add sub categories to categories
// if user chooses to add find the appropriate array and create an object 
// when the user clicks submit take user input and create an object in the array

// *** event listener for submit event
myApp.listenSubmit = () => {
    // perform the below functions once user submits form
    $('.input form').on('submit', function(e){
        e.preventDefault();
        myApp.getUserInput();
        console.log('User clicked submit, category selected is:', myApp.userCategory);
        myApp.createSubCategory(budget, myApp.userCategory);
    });
}

// *** creates subcategory object in budget/amount array
myApp.createSubCategory = (array, category) => {
    // the category parameter is a placeholder for the filterExpense() method which accepts two arguments (so you can use it to filter categories and sub-categories)

    const filterCategory = myApp.filterExpense(array, category); //this works
    //create an array where the category equals to the category inputted by the user

    if (filterCategory === undefined || filterCategory.length === 0){ 
        // if the new array does not contain the category the user inputted (category not found)
        console.log(myApp.userCategory, " does not exist");
        budget.push( { name: myApp.userCategory, subcategory: [{name:myApp.userSubcategory, amount: myApp.budgetAmount}] } );
        //creates category and subcategory in the array
        console.log("New item added to your array", array);
    } else if (filterCategory.length > 0) {
        // if your item exists in the filtered array
        console.log("Found your category!!", myApp.userCategory);
        // find the index of the category (check of category exists)
        myApp.findCategory(array);
        // within the index of the category check if the sub-category exists. if it does not exist add the sub-category. if it does alert the user
        myApp.findSubcategory(array);
        console.log("this is your the updated array", array);
    }
}

// *** checks if the sub-category exists. alert the user if sub-category already exists, add the sub-category if it does not
myApp.findSubcategory = (array) => {
    // array is the budget or spent array
    const filterSubcategory = myApp.filterExpense(array[myApp.indexCategory].subcategory, myApp.userSubcategory); 
    //myApp.indexCategory is created by the findCategory function, this function must be called after it

    //  if the array has nothing in it, no subcategories are found. create a new object (subcategory) and an array within it
    if (filterSubcategory === undefined || filterSubcategory.length === 0){
        array[myApp.indexCategory].subcategory.push({ name: myApp.userSubcategory, amount: myApp.budgetAmount });
        console.log("This sub-category does not exist! I've added it for you", array);
    } else if (filterSubcategory.length > 0) {
        // if that array has more than one item (sub-category exists) - do NOT create a new sub category
        alert("This sub-category already exists! Please add a new sub-category or edit an existing one");
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
    console.log("The selected category is located in this index: ", myApp.indexCategory);
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
    console.log(`User category: ${myApp.userCategory}, User sub-category: ${myApp.userSubcategory}, User budget: ${myApp.budgetAmount}`);
}

// *** converts user input to dollars
myApp.convertNum = (string) => {
    return parseFloat(string);
    // parseFloat returns a number with a decimal place
};



// get the total of each category
// give each category its own line
// all sub categories should come after category


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
