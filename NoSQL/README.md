# NoSQL Project

## 📚 Learning Objectives

At the end of this project, I am able to explain the following concepts without external help.

---

## 🧠 What NoSQL means

NoSQL stands for **“Not Only SQL”**.  
It refers to a category of databases that do not rely solely on the traditional relational model based on tables, rows, and columns.

NoSQL databases are designed to handle:
- large volumes of data  
- distributed systems  
- flexible data structures  

They are commonly used in modern applications where scalability and performance are critical.

---

## 🆚 Difference between SQL and NoSQL

### SQL Databases
- Use structured data organized in tables
- Require a predefined schema
- Support complex queries using SQL (JOIN, GROUP BY, etc.)
- Follow strict ACID properties
- Example: MySQL, PostgreSQL

### NoSQL Databases
- Use flexible data models (JSON, key-value, graph, etc.)
- Schema is dynamic or schema-less
- Optimized for scalability and speed
- May relax ACID constraints for performance
- Example: MongoDB, Redis, Cassandra

---

## 🔒 What is ACID

ACID is a set of properties that ensure reliable transactions in a database:

- **Atomicity**: A transaction is completed entirely or not at all  
- **Consistency**: The database remains in a valid state after a transaction  
- **Isolation**: Transactions do not interfere with each other  
- **Durability**: Once a transaction is committed, it is permanently stored  

Relational databases strictly follow ACID, while many NoSQL systems prioritize scalability over strict consistency.

---

## 📄 What is a document storage

Document storage is a type of NoSQL database where data is stored as documents, typically in JSON or BSON format.

Example:
```json
{
  "name": "Alice",
  "age": 25,
  "skills": ["Python", "MongoDB"]
}

Each document can have a different structure, which allows great flexibility compared to relational databases.

🧩 What are NoSQL types

There are four main types of NoSQL databases:

1. Document Stores
Store data as JSON-like documents
Flexible and easy to use
Example: MongoDB
2. Key-Value Stores
Store data as key-value pairs
Very fast and simple
Example: Redis
3. Column-Oriented Databases
Store data by columns instead of rows
Optimized for large-scale analytics
Example: Cassandra
4. Graph Databases
Store relationships between data
Useful for networks and recommendations
Example: Neo4j
⚡ Benefits of a NoSQL database
Flexible schema (no strict structure required)
High scalability (horizontal scaling across servers)
High performance with large datasets
Suitable for unstructured and semi-structured data
Easy integration with modern applications and APIs
🔍 How to query information from a NoSQL database

In MongoDB, queries are written using a JSON-like syntax.

Example:

db.users.find({ name: "Alice" })

This query retrieves all documents where the name field is "Alice".

You can also filter with conditions:

db.users.find({ age: { $gt: 20 } })
✏️ How to insert, update, and delete information
Insert
db.users.insertOne({ name: "Alice", age: 25 })
Update
db.users.updateOne(
  { name: "Alice" },
  { $set: { age: 26 } }
)
Delete
db.users.deleteOne({ name: "Alice" })
🍃 How to use MongoDB

MongoDB is a popular NoSQL document database.

Basic usage:
Start MongoDB server
Open Mongo shell
Create or switch database:
use mydatabase
Insert data:
db.users.insertOne({ name: "Alice", age: 25 })
Retrieve data:
db.users.find()
MongoDB concepts:
Database: container for collections
Collection: group of documents (similar to a table)
Document: a JSON-like object

MongoDB uses BSON (Binary JSON) internally for efficient storage.

🧠 Conclusion

NoSQL databases provide a powerful alternative to relational databases by offering flexibility, scalability, and performance. They are particularly well-suited for modern applications that handle large, dynamic, or unstructured data.

Understanding NoSQL concepts, including data models, querying, and MongoDB usage, is essential for building scalable backend systems.