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
    // demo of the data structure    
];

// *************************************************************************************************

// could empty() be used in one of these instances
// could replace() be used to clear content
// template literals do not play well with objects, cannot convert them to a string

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
        // Adding sub category function ends here **********
    });
}



// ------------------------- Edit Expense -------------------------

// When edit button is checked 
// TODO: Jazz it up - make the h2 change to "editing ${category}"
// also highlight the row of the subcategory that is being checked


// *** finds category/sub-category and updates their values - no need to check because the edit button only applies to categories/sub-categories that exist 
myApp.editExpense = (array) => {
    debugger
    //get the index of the selected category
    const editCategoryIndex =  myApp.findExpense(array, myApp.userCategory); 
    console.log(editCategoryIndex); 

    // get the index of the selected sub-category
    const editSubCategoryIndex = myApp.findExpense(array[editCategoryIndex].subcategory, myApp.userSubcategory);
    console.log(editSubCategoryIndex);


    //edit sub-category amount in the array
     array[editCategoryIndex].subcategory[editSubCategoryIndex].amount = myApp.budgetAmount;
    console.log("Your new subcategory total ", array[editCategoryIndex].subcategory[editSubCategoryIndex].amount);

    //calculate the new category total and amend the array
    myApp.categoryTotal(array, editCategoryIndex);
    array[editCategoryIndex].amount = myApp.sumSubCategory;
    console.log("Your new category total ", array[editCategoryIndex].amount);
    
    //print the edited categories
    $(`.${myApp.userCategory}.category .budget`).text(`$ ${array[editCategoryIndex].amount}`);

    //print the edited sub-categories
    $(`.${myApp.userSubcategory}.sub-category .budget`).text(`$ ${array[editCategoryIndex].subcategory[editSubCategoryIndex].amount}`);

    //clear the radio buttons
    $('input[type="radio"]').prop('checked', false);
    // prop gets value of property and changes it
};


// *** finds the index of any expense
myApp.findExpense = (array, category) => {

    return array.findIndex((index) => {
        return index.name = category;
    });
};

// ------------------------- End of Edit Expense -------------------------

// -------------------------- Add Expense --------------------------

// *** creates subcategory object in budget/amount array under the selected category
myApp.createSubCategory = (array, category) => {
    // the category parameter is a placeholder for the filterExpense() method which accepts two arguments (so you can use it to filter categories and sub-categories)
    
    //reset number to -1 (no match) before findIndex. otherwise the old value from the last time the function was called will still be stored in there. thats because if nothing meets the condition of findIndex() the indexCategory value will NOT change.
    myApp.indexCategory = -1;
    // TODO: WHY DOES THIS HAVE TO BE OUT HERE FOR IT TO WORK? WHY WONT THIS EXPRESSION WORK INSIDE OF myApp.findCategory() ???????

    //filter for the category selected by the user - checks if category exists
    myApp.filterCategory = myApp.filterExpense(array, category); 

    //if the category does not exist
    if (myApp.filterCategory === undefined || myApp.filterCategory.length === 0){
        console.log(`${myApp.userCategory} does not exist`);
        //create a new category and new subcategory in the array
        budget.push( { name: myApp.userCategory, subcategory: [{name:myApp.userSubcategory, amount: myApp.budgetAmount}] } );
        console.log(`New category and sub-category added to your array `, array);
        //calculate category's total and adds it to the array
        myApp.categoryTotal(array, array.length - 1);
        //second parameter is using the array length as an index - the new category is pushed to the end of the array this lets the function kno which category the total is for. Don't forget -1 on length!!!!!!!!

        // print the category and sub-category to the DOM - will also check for new/existing categories
        myApp.printBudgetExpenses(array);

    // if the category already exists 
    } else if (myApp.filterCategory.length > 0) {
        // find the category in the array 
        myApp.findCategory(array);
        console.log(`Found your category of: ${myApp.userCategory}. It is located in index: ${myApp.indexCategory} in the following array`, array);
        //within category, check if the subcategory exists. If it doesn't create a new subcategory, calculate the new total of category and add it to the array. If the subcategory exists, check if the user is editing. If the user isnt editing alert user.
        myApp.findSubcategory(array);
        // print the category and sub-category to the DOM - will also check for new/existing categories
    }

    // myApp.printBudgetExpenses(array); TODO: ORIGINAL

    $('.input form')[0].reset();
    //https://stackoverflow.com/questions/3786694/how-to-reset-clear-form-through-javascript
    // reset is a DOM element method, DOM sits at index[0] of the jquery object
};


// *** checks array for the selected expense category
myApp.filterExpense = (array, category) => {
    //need return to store the value that filter() returns (currently returns undefined if there is no category)
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
myApp.findCategory = (array) => {

    // myApp.indexCategory is reset to -1 before this function is called every time (in the myApp.createSubcategory() method)
    
    myApp.indexCategory = array.findIndex((index) => {
        return index.name === myApp.userCategory;
    });

    console.log("This category exists in budget, it has an index position of ", myApp.indexCategory);
};

// *** checks if the sub-category exists. if sub-category exists and edit button checked off - enable edit. If edit button is not checked off - alert user that the sub category exists and do not add.
myApp.findSubcategory = (array) => {
    // array is the budget or spent array
    myApp.filterSubcategory = myApp.filterExpense(array[myApp.indexCategory].subcategory, myApp.userSubcategory); 
    //myApp.indexCategory is created by the findCategory function, this function must be called after it

    //  if the array has nothing in it, no subcategories are found. create a new object (subcategory) and an array within it
    if (myApp.filterSubcategory === undefined || myApp.filterSubcategory.length === 0){
        //create a new sub category
        array[myApp.indexCategory].subcategory.push({ name: myApp.userSubcategory, amount: myApp.budgetAmount });
        console.log(`This sub-category does not exist! I've added it for you`, array);
        // calculate the new total of the category 
        myApp.categoryTotal(array, myApp.indexCategory);
        // second argument is the index position of the existing category
        //check array for data and print to DOM
        myApp.printBudgetExpenses(array);
       
    // if the subcategory exists and the edit button is checked off, let printBudgetExpenses know that the user is attempting to edit
    } else if (myApp.filterSubcategory.length > 0 && $('table .edit').is(':checked')) {
        //this lets the printBudgetExpenses() method know that the subcategory exists and edit button has been checked off
        myApp.userEdit = true;
        // if the subcategory exists and the edit button is NOT checked off, alert the user.
        
        // check array for data and print to DOM
        myApp.printBudgetExpenses(array);
    } else if (myApp.filterSubcategory.length > 0)
        alert('This sub-category already exists!');
}


// *** print expenses only when something has changed (category or sub-category) - index position will vary depending if the category already exists or if it was just added
myApp.printBudgetExpenses = (array) => {

    console.log("is the user trying to edit?", myApp.userEdit);//this is working TODO:
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

    // category exists AND user is attempting to edit (value assigned from findSubCategory() method)
    } else if (myApp.indexCategory > - 1 && myApp.userEdit === true){
        
        // call editExpense() method to change the DOM
        myApp.editExpense(array);

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
    //once checked, ask the user to confirm
    //when the user confirms, remove the sub category from the data structure

// 4) editing sub categories 
    // if the user chooses to edit - check if there is an existing sub category
    // editing will replace the number completely
    //if there is an existing category revise the sub category to the edited amount
    //Edit button
        // once checked, anything entered in the amount side will find the input category and change the amount to the amount the user inputs
        // when the user is editing, make it abundantly clear in the input section's h2
        // once the user clicks submit uncheck the edit button (do the same thing with the delete button)

 

//  *************************************************************************************************

// Actual / Comparison stretch goal
// for the comparison column - show the result whenever an actual or budget amount is added
    // always go to the comparison property and add 0 when budget/actual amount is added
    // when an actual/budget is deleted make its value = 0
    // always use 0 so that comparison can return a value

$(function () {
    myApp.init();
});


