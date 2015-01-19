# The Datastructor

***

## TODOs

- Domain model
- Data requirements 
- External interface requirements

***

## Contents

1. [Introduction](#1-introduction)
  1. [Purpose](#11-purpose)
  2. [Project Scope](#12-project-scope)
  3. [References](#13-references)
2. [Overall Description](#2-overall-description)
  1. [Product Perspective](#21-product-perspective)
  2. [User Classes and Characteristics](#22-user-classes-and-characteristics)
  3. [Operating Environment](#23-operating-environment)
3. [Domain Model](#3-domain-model)
4. [Use Cases](#4-use-cases)
  1. [Account Management](#41-account-management)
    1. [Registration](#411-registration)
    2. [Log In](#412-log-in)
    3. [Log Out](#413-log-out)
  2. [Generating Data](#42-generating-data)
    1. [Generating Gaussian Distributions](#421-generating-gaussian-distributions)
    2. [Generating Uniform Distributions](#422-generating-uniform-distributions)
  3. [Sequences](#43-sequences)
    1. [Create](#431-create)
    2. [Retrieve](#432-retrieve)
    3. [Update](#433-update)
    4. [Delete](#434-delete)
5. [Data Requirements](#5-data-requirements)
  1. [Logical Data Model](#51-logical-data-model)
  2. [Data Dictionary](#52-data-dictionary)
6. [External Interface Requirements](#6-external-interface-requirements)
  1. [API](#61-api)
  2. [UI](#62-ui)


...

***

## 1. Introduction

***

### 1.1 Purpose

This project will serve as a teaching tool for data structures and algorithms.  It will allow instructors to create instances of data structures, populate those data structures with data, perform operations on those data structures, and record the sequence of manipulations to those data structures for future modification and playback.

[back to top](#contents)

*** 

### 1.2 Project Scope

The overall project will consist of the following: a server application which will provide the core functionality, accessible through a programmable interface; a suite of end-to-end tests for the server; and a web client providing a UI.  __The scope of this SRS is limited to the server application.__  The client application (which is within the scope of this project) will be described in an alternate SRS.

[back to top](#contents)

***

### 1.3 References

- Client Application
  - [SRS](../client/SRS.md)

[back to top](#contents)

***

## 2. Overall Description

***

### 2.1 Product Perspective

The application has no relation to any existing applications.  It is an entirely new product.

The product will be consumed by a client application, which is part of the same project. 

[back to top](#contents)

*** 

### 2.2 User Classes and Characteristics

Currently, the application only has a single class of users.

[back to top](#contents)

***

### 2.3 Operating Environment

The server application will run in a portable [Docker](https://www.docker.com/) container to avoid environment constraints.  The only constraint will be that Docker is installed.

The client web application will support the following browsers: Internet Explorer 10+, Safari, Chrome, Firefox and Opera 10+.

[back to top](#contents)

***

## 3. Domain Model

*** 

## 4. Use Cases

***

### 4.1 Account Management

***

#### 4.1.1 Registration

As a user, I should be able to register for the application using a single sign on identity like a Facebook or Google account.

__Preconditions:__

- I am not logged into an account

__Postconditions:__

- An account is created for me
- My identity is associated with that account

__Failure Scenarios:__

- The email address associated with the identity I have chosen is already part of an account.

__Alternate Scenarios:__

- The identity I have chosen is already registered; see [Log In](#312-log-in) scenario.

[back to top](#contents)

***

#### 4.1.2 Log In

As a user, I should be able to log in to my account using my single sign on identity.

__Preconditions:__

- I am not logged into an account

__Postconditions:__

- I am logged into an account

__Failure Scenarios:__

- There is no account matching the email address retrieved from the SSO.
- The SSO used is not associated with the matching account

[back to top](#contents)

***

#### 4.1.3 Log Out

As a user, I should be able to log out of my account 

__Preconditions:__

- I am logged into an account

__Postconditions:__

- I am not logged into an account

[back to top](#contents)

***

### 4.2 Generating Data

***

#### 4.2.1 Generating Gaussian Distributions

As a user, I should be able to generate a random data with a Gaussian distribution.

__Preconditions:__

- I am logged into an account

[back to top](#contents)

***

#### 4.2.2 Generating Uniform Distributions

As a user, I should be able to generate a random data set with a uniform distribution.

__Preconditions:__

- I am logged into an account

[back to top](#contents)

***

### 4.3 Sequences

***

#### 4.3.1 Create

As a user, I should be able to create a sequence

__Preconditions:__

- I am logged into an account

__Postconditions:__

- I own the newly created sequence

__Failure Scenarios:__

- The sequence data provided is malformed (e.g. an invalid operation for the data structure)

[back to top](#contents)

***

#### 4.3.2 Retrieve

As a user, I should be able to retrieve a sequence

__Preconditions:__

- I am logged into an account
- I own the sequence

[back to top](#contents)

***

#### 4.3.3 Update

As a user, I should be able to update a sequence

__Preconditions:__

- I am logged into an account
- I own the sequence

__Failure Scenarios:__

- The sequence data provided for the update is (e.g. an invalid operation for the data structure)

[back to top](#contents)

***

#### 4.3.4 Delete

As a user, I should be able to delete a sequence

__Preconditions:__

- I am logged into an account
- I own the sequence

__Postconditions:__

- I no longer own the sequence :'(

[back to top](#contents)

***

## 5. Data Requirements

***

### 5.1 Logical Data Model

***

### 5.2 Data Dictionary
