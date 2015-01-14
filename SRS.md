# The Datastructor

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
3. [System Features](#3-system-features)

...

***

## 1. Introduction

***

### 1.1 Purpose

This project will serve as a teaching tool for data structures and algorithms.  It will allow instructors to create instances of data structures, populate those data structures with data, perform operations on those data structures, and record the sequence of manipulations to those data structures for future modification and playback.

[back to top](#contents)

*** 

### 1.2 Project Scope

The project will consist of the following: a server application which will provide the core functionality, accessible through a programmable interface; a suite of end-to-end tests for the server; and a web client providing a UI. 

[back to top](#contents)

***

### 1.3 References

(none yet)

[back to top](#contents)

***

## 2. Overall Description

***

### 2.1 Product Perspective

The application has no relation to any existing applications.  It is an entirely new product.

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

## 3. Use Cases

***

### 3.1 Account Management

***

#### 3.1.1 Registration

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

#### 3.1.2 Log In

As a user, I should be able to log in to my account using my single sign on identity.

__Preconditions:__

- I am not logged into an account

__Postconditions:__

- I am logged into an account

[back to top](#contents)

***

#### 3.1.3 Log Out

As a user, I should be able to log out of my account 

__Preconditions:__

- I am logged into an account

__Postconditions:__

- I am not logged into an account

[back to top](#contents)

