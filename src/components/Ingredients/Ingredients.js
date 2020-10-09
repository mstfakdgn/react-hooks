import React, { useCallback, useEffect, useState, useReducer, useMemo } from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';

const ingredientReducer = (currentIngredients, action) => {
  switch (action.type) {
    case 'SET':
      return action.ingredients;
    case 'ADD':
      return [...currentIngredients, action.ingredient];
    case 'DELETE':
      return currentIngredients.filter(ing => ing.id !== action.id);
    default:
      throw new Error('should not get hear');
  }
}

const httpReducer = (httpState, action) => {
  switch (action.type) {
    case 'SEND':
      return { loading: true, error: null };
    case 'RESPONSE':
      return { ...httpState, loading: false }
    case 'ERROR':
      return { loading: false, error: action.errorMessage }
    case 'CLEAR':
      return {...httpState, error:null}
    default:
      throw new Error('Should not get hear')
  }
}

const Ingredients = () => {
  // [] initial state
  const [ingredients, dispatch] = useReducer(ingredientReducer, []);
  const [httpState, dispatchHttp] = useReducer(httpReducer, { loading: false, error: false });
  // const [ingredients, setIngredients] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState();

  // useEffect(() => {
  //   fetch('https://react-hooks-b7741.firebaseio.com/ingredients.json')
  //     .then(res => res.json())
  //     .then(resData => {
  //       const loadedIngredients = [];
  //       for (const key in resData) {
  //         loadedIngredients.push({
  //           id:key,
  //           title:resData[key].title,
  //           amount: resData[key].amount
  //         });
  //       }

  //       setIngredients(loadedIngredients);
  //     });
  // }, []);

  useEffect(() => {
    console.log('RENDERNG INGREDIENTS', ingredients);
  }, [ingredients])

  const filteredIngredients = useCallback(filteredIngredients => {
    //setIngredients(filteredIngredients)
    dispatch({ type: 'SET', ingredients: filteredIngredients });
  }, []);

  const addIngredientHandler = useCallback(ingredient => {
    dispatchHttp({ type: 'SEND' });

    fetch('https://react-hooks-b7741.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => {
      return res.json();
    }).then(resData => {
      // setIngredients(prevIngredients => [...prevIngredients,
      // { id: resData.name, ...ingredient }
      // ]);
      dispatch({ type: 'ADD', ingredient: { id: resData.name, ...ingredient } })
      dispatchHttp({ type: 'RESPONSE' });
    }).catch(err => {
      dispatchHttp({ type: 'ERROR', errorMessage:err.message });

    });

  }, []);

  const removeIngredientHandler = useCallback(ingId => {
    dispatchHttp({ type: 'SEND' });

    fetch(`https://react-hooks-b7741.firebaseio.com/ingredients/${ingId}.json`, {
      method: 'DELETE',
    }).then(res => {
      // setIngredients((prevIngredients) => prevIngredients.filter(ing => ing.id !== ingId))
      dispatch({ type: 'DELETE', id: ingId })
      dispatchHttp({ type: 'RESPONSE' });
    }).catch(err => {
      dispatchHttp({ type: 'ERROR', errorMessage:err.message });


    })
  }, [])

  const clearError = useCallback(() => {
    dispatchHttp({type:'CLEAR'});
  }, [])

  const ingredientList = useMemo(() => {
    return  <IngredientList ingredients={ingredients} onRemoveItem={removeIngredientHandler} />;
  }, [ingredients, removeIngredientHandler])

  return (
    <div className="App">
      {httpState.error && <ErrorModal onClose={clearError}>{httpState.error}</ErrorModal>}
      <IngredientForm onAddIngredient={addIngredientHandler} loading={httpState.loading} />

      <section>
        <Search filteredIngredients={filteredIngredients} />
        {ingredientList}
      </section>
    </div>
  );
}

export default Ingredients;
