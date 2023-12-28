import { createContext } from "react";
import { useState, useReducer } from "react";
import githubReducer from "./GithubReducer";
const GithubContext = createContext();
export const GithubProvider = ({ children }) => {
  const initialState = {
    users: [],
    user: {},
    loading: false,
  };
  const [state, dispatch] = useReducer(githubReducer, initialState);

  // Get initial users testing purpose
  const searchUsers = async (text) => {
    setLoading();
    const params = new URLSearchParams({
      q: text,
    });
    const response = await fetch(
      `https://api.github.com/search/users?${params}`
    );
    const { items } = await response.json();
    dispatch({ type: "FETCH_USERS", payload: items });
  };

  const getUser = async (username) => {
    setLoading();

    const response = await fetch(`https://api.github.com/users/${username}`);

    if (response.status === 404) {
      window.location = "/notfound";
    } else {
      const data = await response.json();
      dispatch({ type: "GET_USER", payload: data });
    }
  };

  const clearUsers = () => {
    dispatch({
      type: "CLEAR_USERS",
    });
  };
  // Setting loading state to true
  const setLoading = () => {
    dispatch({ type: "SET_LOADING" });
  };
  return (
    <GithubContext.Provider
      value={{
        users: state.users,
        loading: state.loading,
        searchUsers,
        clearUsers,
        user: state.user,
        getUser,
      }}
    >
      {children}
    </GithubContext.Provider>
  );
};

export default GithubContext;
