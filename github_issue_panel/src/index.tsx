import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  NormalizedCacheObject,
} from "@apollo/client";


if (!process.env.REACT_APP_ACCESSTOKEN) {
  throw new Error("Please add your github accesstoken to the .env file and restart the application.");
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);



const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  uri: "https://api.github.com/graphql",
  cache: new InMemoryCache(),
  headers: {
    Authorization: `Bearer ${process.env.REACT_APP_ACCESSTOKEN}`,
  },
});


root.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
