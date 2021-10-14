# INVENTORY APP

A CRUD app built using Node.JS, Express, Mongoose, MongoDB and Bootstrap. Built to keep track of an inventory of vinyl records, with linked Mongoose documents to allow for categorising and filtering records by artist, label, genre, and format. Form validation done with express-validator

## Project Link

[View the project here](https://safe-temple-21179.herokuapp.com/)

![Demo](https://www.alexcodes.co.uk/inventory.gif 'Battleships demo')

## Skills Employed

In building this project I leveraged the following concepts and technologies:

- **Node.JS & Express**
  - Asynchronous coding using callbacks and `async/await` to handle http GET and POST requests
  - Built a fully fledged router module to direct incoming and outgoing traffic
  - Used and understood the benefits of the MVC (Model, View, Controller) project structure
  - Validated and sanitised user input to ensure safe and correct data storage
- **Mongoose & MongoDB**
  - Creation of Database and Collections to handle documents for data storage
  - Building and validating MongoDB schema using Mongoose, including the use of virtual properties
  - Executing asynchronous queries on the database in order to fetch and display site data
- **Bootstrap**
  - Rapidly developed form and layout templates (in combination with the view engine Pug) in order to display site data in a presentable format
