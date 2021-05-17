# Introduction
Most of our team members had little to none experience with backend development. We did a lot of research online and consulted our TA, Sanat, to come up with our game plan.

# Technologies that we considered
* [MySQL](https://www.mysql.com/) - Fast relational database that is relatively easy to learn and apply to our project. However, it is difficult to implement the level of customization that we want our Bulllet Journal to have using MySQL.
- [MongoDB](https://www.mongodb.com/1) - NoSQL database that uses JSON-like documents. Very high-performance, relatively simple, flexible, and has great documentation.
- [Express.js](https://expressjs.com/) - Node.js web application framework designed for building web applications, mobile applications, and APIs. Express is minimal and flexible, and provides a robust set of features.

# Final decision
We decided to use MongoDB as our database, and Express.js as our server framework. We spent quite a lot of time trying to decide between MongoDB and MySQL. Both are relatively easy to learn and to use, and are high-performance and flexible.
The main reaason we chose MongoDB over MySQL was because custom logs/tasks, one of our bulllet journal's core features, is much easier to implement using MongoDB than using MySQL. From our research and from Sanat's advice, MySQL does not easily allow for the level of customization that we needed,
as it is a relational database management system (RDBMS). <br />

Using Express.js was an easy decision to make. Our team wanted to stick to using Node.js as much as possible, and Express.js allows us to do so. Express is a standard, widely-used server framework for Node.js. From our research, we found that it is rather simple to use, and meets all the constraints of our web application.

All information presented here is true as of May 17th, 2021.
