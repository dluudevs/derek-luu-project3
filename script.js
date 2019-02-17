const myApp = {};
//organizes and allows global access to variables/methods as modular components - also prevents confict with other code

const budget = [
    // {
    //     name: "food",
    //     amount: 300,
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
        // reset is a DOM element method, DOM sits at index[0] of the jquery object
    });
}


// ****** PROBLEM: data structure is fine - printing is broken
    // conditions: category has more than 1 sub-category
    // when: trying to add a new category
    // what: takes old sub-category name and adds it to the old category (old category will have the correct amount shown in the array)
            // with the old name, old amount
    // why: else if in printBudgetExpenses() isnt working as intended - maybe something wrong with indexCategory (sub category doesnt have the position as to where to put itself)

// -------------------------- Add Expense --------------------------

// *** creates subcategory object in budget/amount array under the selected category
myApp.createSubCategory = (array, category) => {
    // the category parameter is a placeholder for the filterExpense() method which accepts two arguments (so you can use it to filter categories and sub-categories)
    
    myApp.indexCategory = -1;
    // TODO: WHY DOES THIS HAVE TO BE OUT HERE FOR IT TO WORK? WHY WONT THIS EXPRESSION WORK INSIDE OF myApp.findCategory() ???????
    //reset number to not found before looking again. otherwise the old value from the last time the function was called will still be stored in there. thats because if nothing meets the condition of findIndex() the indexCategory will NOT change.

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

        // print the category and sub-category to the DOM - will also check for new/existing categories

    // if the category already exists 
    } else if (filterCategory.length > 0) {
        // find the category in the array 
        myApp.findCategory(array);
        console.log(`Found your category of: ${myApp.userCategory}. It is located in index: ${myApp.indexCategory} in the following array`, array);
        //within category, check if the subcategory exists. If it doesn't; create a new subcategory, calculate the new total of category and add it to the array. If the subcategory exists, alert the user and dont change the data structure.
        myApp.findSubcategory(array);
        // print the category and sub-category to the DOM - will also check for new/existing categories
    }

    myApp.printBudgetExpenses(array);

};


// *** checks array for the selected expense category
myApp.filterExpense = (array, category) => {
    //need return to store the value that filter() returns
    return array.filter((index) => {
        return index.name === category;
    });
};

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
    // adds category's amount to the array
};

// *** finds the category inputted by the user in array - returns the index number where the category already exists 
// there is only one dependent for this function
myApp.findCategory = (array) => {

    // myApp.indexCategory is reset to -1 before this function is called every time
    
    myApp.indexCategory = array.findIndex((index) => {
        return index.name === myApp.userCategory;
    });
    console.log("This category exists in budget, it has an index position of ", myApp.indexCategory);
};

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
        // second argument is the index position of the existing category 
    } else if (filterSubcategory.length > 0) {
        // if that array has more than one item (sub-category exists) - do NOT create a new sub category
        alert('This sub-category already exists!');
    }
};

// *** for every item in the budget array - display: subcategory + amount and category + amount
// print only when something has changed - index position will vary depending if the category already exists or if it was just added
myApp.printBudgetExpenses = (array) => {
    
    // if category does not exist
    if (myApp.indexCategory === undefined || myApp.indexCategory < 0) {


        //print the newly added category
        $('.heading').after(`
            <tr class="${myApp.userCategory} category">
                <td class=name>${myApp.userCategory}</td>
                <td class=budget>$ ${myApp.sumSubCategory}</td>
            </tr>
        `);
        // class = "${variable} string" works because they are already inside template literals


        // go to index with the corresponding category, find the subcategory array and go to last index (newly added sub-category)
        myApp.indexSubcategory = array[array.length - 1].subcategory[array[array.length - 1].subcategory.length - 1];

        myApp.newSubcategoryName = myApp.indexSubcategory.name;
        myApp.newSubcategoryAmount = myApp.indexSubcategory.amount;

        // print the newly added sub-category
        myApp.printSubcategories(myApp.userCategory, myApp.newSubcategoryName, myApp.newSubcategoryAmount, "budget");


        // if category already exists - don't print the category again. Find it's classs and change the amount
    } else if (myApp.indexCategory > -1) {
        // take the value and amount of the existing category and print it
        $(`.${myApp.userCategory}.category .budget`).text(`$ ${myApp.sumSubCategory}`);

        // go to index with the corresponding category, find the subcategory array and go to last index (for newly added sub-category)
        myApp.indexSubcategory = array[myApp.indexCategory].subcategory[array[myApp.indexCategory].subcategory.length - 1];
        // [-------- sub-categtory array -------] [ -------- subcategory array. length - 1 -------- ]
        myApp.newSubcategoryName = myApp.indexSubcategory.name;
        myApp.newSubcategoryAmount = myApp.indexSubcategory.amount;
        console.log("This is the category where sub-category should follow:", array[myApp.indexCategory].name);
        // array[myApp.indexCategory] is not updating, thts why sub-categories are being added to the previously selected category also why the name is wrong because everything in sub-category DEPENDS On this index number
        // print the new sub-category 
        myApp.printSubcategories(array[myApp.indexCategory].name, myApp.newSubcategoryName, myApp.newSubcategoryAmount, "budget");
    }
};


// *** prints subcategories > use parameters because index position of category will change depending of its new or old
myApp.printSubcategories = (categoryName, SubcategoryName, SubcategoryAmount, arrayName) => {
    //arrayName is a string for the name of the array, array is the actual array that holds the data 
    $(`.${categoryName}`).after(`
        <tr class="${SubcategoryName} sub-category">
            <td class=name>${SubcategoryName}</td>
            <td class=${arrayName}>$ ${SubcategoryAmount}</td>
            <td><input type=radio name=action value=edit class=edit></td>
            <td><input type=radio name=action value=delete class=delete></td>
        </tr>
    `)
}

// -------------------------- End of Add Expense --------------------------


// -------------------------- User Input --------------------------
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
}
// -------------------------- End of User Input --------------------------




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
