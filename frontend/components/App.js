import React, { useState } from 'react'
import axios from 'axios';
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'

import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'
import Spinner from './Spinner'

import { axiosWithAuth} from '../axios/index';

const articlesUrl = 'http://localhost:9000/api/articles'
const loginUrl = 'http://localhost:9000/api/login'

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticleId, setCurrentArticleId] = useState()
  const [spinnerOn, setSpinnerOn] = useState(false)

  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate()
  const redirectToLogin = () => { /* ✨ implement */ }
  const redirectToArticles = () => { /* ✨ implement */ }

  const logout = () => {
    // ✨ implement
    // If a token is in local storage it should be removed,
    // and a message saying "Goodbye!" should be set in its proper state.
    // In any case, we should redirect the browser back to the login screen,
    // using the helper above.
    localStorage.removeItem('token');
    setMessage('Goodbye!');
    navigate('/');
  }

  const resetMessageSpinner = () => {
    setMessage('');
    setSpinnerOn(true);
  }

  const login = ({ username, password }) => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch a request to the proper endpoint.
    // On success, we should set the token to local storage in a 'token' key,
    // put the server success message in its proper state, and redirect
    // to the Articles screen. Don't forget to turn off the spinner!
    axios.post(loginUrl, {username, password})
      .then(res => {
        localStorage.setItem('token', res.data.token);
        setMessage(res.data.message);
        navigate('articles');
        setSpinnerOn(false);
      })
      .catch(err => {
        console.log({err});
        setSpinnerOn(false);
      })
      .finally(resetMessageSpinner());
  }

  const getArticles = () => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch an authenticated request to the proper endpoint.
    // On success, we should set the articles in their proper state and
    // put the server success message in its proper state.
    // If something goes wrong, check the status of the response:
    // if it's a 401 the token might have gone bad, and we should redirect to login.
    // Don't forget to turn off the spinner!
    
    axiosWithAuth().get(articlesUrl)
      .then(res => {
        setArticles(res.data.articles);
        setMessage(res.data.message);
        setSpinnerOn(false);
      })
      .catch(err => {
        navigate('/');
        setMessage(err.response.data.message);
        setSpinnerOn(false);
      })
      .finally(resetMessageSpinner())
  }

  const postArticle = article => {
    // ✨ implement
    // The flow is very similar to the `getArticles` function.
    // You'll know what to do! Use log statements or breakpoints
    // to inspect the response from the server.
    console.log(article);
    axiosWithAuth().post(articlesUrl, article)
      .then(res => {
        setArticles([...articles, 
          res.data.article]);
        setMessage(res.data.message);
        setSpinnerOn(false);
      })
      .catch(err => {
        setMessage(err.response.data.message)
        setSpinnerOn(false);
      })
      .finally(resetMessageSpinner())
  }

  const updateArticle = ({ article_id, article }) => {
    // ✨ implement
    // You got this!
    axiosWithAuth().put(`${articlesUrl}/${article_id}`, article)
     .then(res => {
      setArticles(
        articles.map((article) => {
          if (article.article_id === res.data.article.article_id) {
            return res.data.article;
          }
          else {
            return article;
          }
        })
      )
      setMessage(res.data.message);
      setSpinnerOn(false);
     })
     .catch(err => {
      console.log({ err })
      setSpinnerOn(false);
     })
     .finally(resetMessageSpinner())
  }

  const deleteArticle = article_id => {
    // ✨ implement
    
    // console.log("delete click");
    // resetMessageSpinner();
    // axiosWithAuth().delete(`${articlesUrl}/${article_id}`)
    //   .then(res => {
    //     console.log(".then:",res);
    //     getArticles();
    //     // setArticles(articles.filter(article => article.id !== article_id))
    //     console.log("message: ", res.data.message)
    //     setMessage(res.data.message);
    //     setSpinnerOn(false);
    //   })
    //   .catch(err => {
    //     console.log({err})
    //     setSpinnerOn(false);
    //   })
    //   .finally(resetMessageSpinner()) 
  }

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
      <Spinner on={spinnerOn} />
      <Message message={message} />
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}> {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login} />} />
          <Route path="articles" element={
            <>
              <ArticleForm 
                postArticle={postArticle} 
                updateArticle={updateArticle} 
                setCurrentArticleId={setCurrentArticleId} 
                currentArticleId={currentArticleId} 
                articles={articles} 
              />

              <Articles 
                getArticles={getArticles} 
                articles={articles}  
                setCurrentArticleId={setCurrentArticleId} 
                currentArticleId={currentArticleId} 
                deleteArticle={deleteArticle}
              />
            </>
          } />
        </Routes>
        <footer>Bloom Institute of Technology 2022</footer>
      </div>
    </>
  )
}
