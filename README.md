# Northcoders News API

------------------Link to hosted app--------------------------

# Link: https://ahmed-nc-news.herokuapp.com/api/

This link will show you all the api end points you can access

-------------- About the App ---------------------------
built a small backend server that will allow front end architecture to
interact with it via Api endpoints to access information stored on the dataBase.
This app was built using express.js, node js and postgresql.

------Instructions to clone the app-----------------

1. Fork the git hub repository, Link: [https://github.com/akh701/NCBEproject]
2. Clone this repository to your local machine using this command in `git clone Forked-Repository-Url`
3. Install all the following App dependencies:

- [express] with minimum version 4.17.2, command: `npm i expres`
- [Postgres] with minimum version 8.7.3, command: `npm i pg`
- [dotenv] with minimum version 16.0.0, command: `npm i dotenv`

4. Install the following development dependencies to run tests

   - `jest`: version( 27.5.1), command: ` npm i jest -D`
   - `jest-extended`: version (2.0.0"), command: ` npm i jest-extended -D`
   - `jest-sorted`: version (1.0.14), command: ` npm i jest-sorted -D`
   - `pg-format`: version (1.0.4)", command: ` npm i pg-format -D`
   - `supertest`: version (6.2.2), command: ` npm i supertest -D`

   # NB: to run tests use `npm test`

------- **Important** to connect to databases locally ------

1. create .env.test and add <PGDATABASE=nc_news_test> into this file
2. create .env.development and ad <PGDATABASE=nc_news>

----------------- **Important** --------------

# To seed the data base please run the following command scripts once in the order provided:

1. `npm run setup-dbs` --- to create the databases
2. `npm run seed` --- to seed the databases with data.

---------------- Enjoy ---------------
