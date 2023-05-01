# Introduction
This repository has been created to test a bug we faced while running an implementation of websocket server and client. It consists of a small implementation of a websocket server and client using NodeJS' "net" library.
# Explanation of bug
In the actual implementation, during the execution of the test, the websocket it closed right after the http request is made. This happens right before the client can send back the data retrieved from the http request into the socket. The interesting part is that this only happens while running the test. 

