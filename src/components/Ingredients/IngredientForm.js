import React, { useState } from 'react';

import Card from '../UI/Card';
import './IngredientForm.css';
import LoadingIndicator from '../UI/LoadingIndicator';

const IngredientForm = React.memo(props => {
  const [ inputTitle, setTitleState] = useState('');
  const [ inputAmount, setAmountState] = useState('');

  const submitHandler = event => {
    event.preventDefault();
    props.onAddIngredient({
      title:inputTitle, amount:inputAmount
    });
  };

  return (
    <section className="ingredient-form">
      <Card>
        <form onSubmit={submitHandler}>
          <div className="form-control">
            <label htmlFor="title">Name</label>
            <input
              type="text"
              id="title"
              value={inputTitle}
              onChange= {event => {
                setTitleState(event.target.value);
              }}
              // onChange={event => {
              //   const newTitle = event.target.value;
              //   setInputState((prevInputState) => ({
              //     title: newTitle,
              //     amount: prevInputState.amount
              //   }))
              // }
              // }
            />
          </div>
          <div className="form-control">
            <label htmlFor="amount">Amount</label>
            <input
              type="number"
              id="amount"
              value={inputAmount}
              onChange={event => {
                setAmountState(event.target.value);
              }}
              // onChange={event => {
              //   const newAmount = event.target.value
              //   setInputState(prevInputState => ({
              //     amount: newAmount,
              //     title: prevInputState.title
              //   }))
              // }
              // }
            />
          </div>
          <div className="ingredient-form__actions">
            <button type="submit">Add Ingredient</button>
            {props.loading && <LoadingIndicator/>}
          </div>
        </form>
      </Card>
    </section>
  );
});

export default IngredientForm;
