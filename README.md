## Northcoders News API

### Project Title


This is a repository for building a basic API for a news website. The database used is MongoDB with Mongoose models.

## Getting Started 

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

## Prerequisites

The packages and dependences required for running this API are available in the package.json file and can be installed
by running the following command:
npm i

This API uses Node.js 9.7.1 and MongoDB v3.4.10, as well as Mocha, Chai, and Supertest for testing.

To install MongoDB and for an overview of the methods that can be used, follow the steps in their documentation:
https://docs.mongodb.com/manual/tutorial/getting-started/


## Installing

For local use, a config folder is needed for switching between the development, test, and production environments.

All packages needed can be found in the package.json file.


### Step 1 - Seeding

For seeding the database, the package.json file has already been set up with a script depending on the environment it runs in:
- development: npm run seed:dev;
- test: npm run seed:test;
- production: npm run seed:production;

These command will ensure the database is dropped before re-seeding the file every time.


### Step 2 - Testing

Tests have been provided for the main seed function, for each endpoint with all methods used, as well as for each error which can occur at each endpoint. A script has been seet up for running the tests:
npm test

### Routes

Topics

- GET /api: Serves an HTML page with documentation for all the available endpoints

- GET /api/topics: Gets all the topics

- GET /api/topics/:topic_id/articles: Returns all the articles for a certain topic

- POST /api/topics/:topic_id/articles: Adds a new article to a topic. This route requires a JSON body with title and body key value pairs 
    e.g: { 
    "title": "this is my new article title" 
    "body": "This is my new article content" 
    }


Articles

- GET /api/articles: Returns all the articles

- GET /api/articles/:article_id: Gets an individual article

- GET /api/articles/:article_id/comments: Gets all the comments for a individual article

- POST /api/articles/:article_id/comments: Adds a new comment to an article. This route requires a JSON body with a comment key and value pair
    e.g: {"comment": "This is my new comment"} 

- PUT /api/articles/:article_id: Increments or Decrements the votes of an article by one. This route requires a vote query of 'up' or 'down' 
    e.g: /api/articles/:article_id?vote=up


Comments

- PUT /api/comments/:comment_id: Increments or Decrements the votes of a comment by one. This route requires a vote query of 'up' or 'down' 
    e.g: /api/comments/:comment_id?vote=down

- DELETE /api/comments/:comment_id: Deletes a comment

Users

- GET /api/users/:username: Returns a JSON object with the profile data for the specified user.


### Step 3 - Deployment

mLab provide either free or paid hosting for MongoDB data. The database that will be used can be uploaded to mLab via their website:
https://mlab.com/ 

The data used for the Northcoders News app can be found on mLab here:
https://mlab.com/databases/be2-nc-news

The API is hosted on Heroku here:
https://back-end-nc-news.herokuapp.com/api

For more information on how to deploy and manage your apps on Heroku, their docuemntation is available here:
https://devcenter.heroku.com/
