//Ensures that all HTML has been loaded before executing JS code.
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#registrar');
    const main = document.querySelector('.main');
    const input = document.querySelector('input');
    const invitedListUl = document.querySelector('#invitedList');
    const listItems = invitedListUl.children;
    const inviteeNames = document.getElementsByClassName('inviteeName');
    
    console.log(`the invitee names: ${inviteeNames}`);
    const div = document.createElement('div');
    const filterLabel = document.createElement('label');
    const filterCheckbox = document.createElement('input');
  
    function checkUserInput(inputText){
      const text = inputText.value.trim();
      const regex=/^[a-z A-Z]+$/;
      //checks if input is string
      if (!text.match(regex)){
        throw new Error(alert('Invitee names should be letters!'));
      }
      //checks for duplicate names
      for(let i = 0; i < inviteeNames.length; i++){
        if(text.toLowerCase() === inviteeNames[i].textContent.toLowerCase()){
         throw new Error(alert('The invitee ' + text + ' has already been invited!'));
        }
      }
    }
    
    //create the "Hide those who haven't responded" checkbox
    filterLabel.textContent = 'Hide those who haven\'t responded';
    filterCheckbox.type = 'checkbox';
    div.appendChild(filterLabel);
    div.appendChild(filterCheckbox);
    main.insertBefore(div, invitedListUl);
    filterCheckbox.addEventListener('change', (e) => {
      const checkbox = e.target;
      const checked = checkbox.checked;
      if(checked){
        for(let i = 0; i < listItems.length; i++){
          let li = listItems[i];  
          //Displays the invitees who have responded
          if(li.className === 'responded'){
            li.style.display = '';   
           //Hides invitees who have not responded.
          }else{
            li.style.display = 'none';
          }
        }
      //Displays all invitees
      }else{
        for(let i = 0; i < listItems.length; i++){
          let li = listItems[i];
          li.style.display = '';
        }
      }
    });
    
    function createLi(text){
      //Creates a function that creates Elements
      function createElement(elementName, property, propertyValue){
        const element = document.createElement(elementName);
        element[property] = propertyValue;
        return element;
      }
      //Creates a function that appends elements to the list element
      function appendToLi (elementName, property, propertyValue){
        const element = createElement(elementName, property, propertyValue);
        li.appendChild(element);
        return element;
      }   
      //Creates the list element
      const li = document.createElement('li');  
      const textSpan = appendToLi('span', 'textContent', text);
      textSpan.className = 'inviteeName';
      //creates the "confirmed" checkbox element
      appendToLi('label', 'textContent', 'Confirmed')
        .appendChild(createElement('input', 'type', 'checkbox'));
      //creates the Edit button 
      appendToLi('button', 'textContent', 'Edit');
      //Creates the remove button
      appendToLi('button', 'textContent', 'Remove'); 
      return li;
    }
  
    form.addEventListener('submit', (e) => {
      const text = input.value;
      if(text){
        //prevents automatic refreshing of the webpage
        e.preventDefault();
        //Captures user input, validates the data and passes it to the "CreateLi" function
        try{
          checkUserInput(input);
        } catch(e) {
            return false;
        }
        input.value = '';
        input.style.border = '';
        const li = createLi(text);
        invitedListUl.appendChild(li); 
      } else{
          //handles null input
          e.preventDefault();
          input.style.border = '2px solid red';
          alert('Please enter a name before submitting!');
      }   
    });
    
    //uses bubbling to handle checkbox events.
    invitedListUl.addEventListener('change', (e) => {
       const checkbox = e.target;
       const checked = checkbox.checked;
       const listItem = checkbox.parentNode.parentNode;
       if(checked){
         // handle confirmed and add confirmed list items to class "responded"
         listItem.className = 'responded';
       }else{
         listItem.className = '';
       }
    });
    
    invitedListUl.addEventListener('click', (e) => {
      if(e.target.tagName === 'BUTTON'){
        const clickedButton = e.target;
        const li = clickedButton.parentNode;
        const ul = li.parentNode;
        const action = clickedButton.textContent.toLowerCase();
        // Adds the name actions to an object 
        const nameActions ={
          //Handles removing an invitee.
          remove: function removeName() {
            ul.removeChild(li);
          },
          //Handles Editing name details
          edit: () => {
            const span = li.firstElementChild;
            const input = document.createElement('input');
            input.type = 'text';
            input.value = span.textContent;
            li.insertBefore(input, span);
            li.removeChild(span);
            clickedButton.textContent = 'Save';
          },
          //Handles saving changes after editing.
          save: () => {
            const editInput = li.firstElementChild;
            checkUserInput(editInput);
            const span = document.createElement('span');
            span.className = 'inviteeName';
            span.textContent = editInput.value;
            li.insertBefore(span, editInput);
            li.removeChild(editInput);
            clickedButton.textContent = 'Edit';
          }   
        };
      //Selects and runs action based on the button's name.
      nameActions[action]();   
      }
    });
  
  });
  