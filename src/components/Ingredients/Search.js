import React, { useState, useEffect } from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(props => {
  const { filteredIngredients } = props;
  const [filterText, setFilterText] = useState('');

  useEffect(() => {
    const queryParams = filterText.length === 0 ? '' : `?orderBy="title"&equalTo="${filterText}"`;
    fetch('https://react-hooks-b7741.firebaseio.com/ingredients.json'+ queryParams)
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
        filteredIngredients(loadedIngredients);
      });
  }, [filterText, filteredIngredients])

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input type="text" value={filterText} onChange={event => setFilterText(event.target.value)}/>
        </div>
      </Card>
    </section>
  );
});

export default Search;
