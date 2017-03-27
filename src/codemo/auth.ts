import * as vscode from 'vscode';
import * as firebase from 'firebase';

export  function login(): Promise < {} > {

	const promise = new Promise((resolve, reject) => {


		firebase.auth().signInWithEmailAndPassword('instructor1@test.com', 'password')
					   .then(() => resolve({ message: 'Hello instructor1. Welcome to Codemo.'}))
					   .catch((err) => reject({ message: err }));

	});

	return promise;
}

export function logout(): Promise < {} > {

	const promise = new Promise((resolve, reject) => {


		firebase.auth().signOut();
		resolve({ message: 'Logged out of Codemo.'});
	});

	return promise;
}