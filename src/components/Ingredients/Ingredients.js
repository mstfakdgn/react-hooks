import React, { useCallback, useEffect, useState } from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from './IngredientList';


const Ingredients = () => {
  const [ingredients, setIngredients] = useState([]);

  useEffect(() => {
    fetch('https://react-hooks-b7741.firebaseio.com/ingredients.json')
      .then(res => res.json())
      .then(resData => {
        const loadedIngredients = [];
        for (const key in resData) {
          loadedIngredients.push({
            id:key,
            title:resData[key].title,
            amount: resData[key].amount
          });
        }

        setIngredients(loadedIngredients);
      });
  }, []);

  useEffect(() => {
    console.log('RENDERNG INGREDIENTS', ingredients);
  }, [ingredients])

  const filteredIngredients = useCallback(filteredIngredients => {
    setIngredients(filteredIngredients)
  }, []);

  const addIngredientHandler = ingredient => {
    fetch('https://react-hooks-b7741.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => {
      return  res.json();
    }).then(resData => {
      setIngredients(prevIngredients => [...prevIngredients,
        { id: resData.name, ...ingredient }
        ]);
    }).catch(err => {
      console.log(err);
    });

  };

  const removeIngredientHandler = ingId => {
    setIngredients((prevIngredients) => prevIngredients.filter(ing => ing.id !== ingId)
    )
  }

  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler} />

      <section>
        <Search filteredIngredients={filteredIngredients}/>
        <IngredientList ingredients={ingredients} onRemoveItem={removeIngredientHandler} />
      </section>
    </div>
  );
}

export default Ingredients;
