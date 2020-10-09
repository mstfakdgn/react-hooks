import React, { useState, useEffect, useRef } from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(props => {
  const { filteredIngredients } = props;
  const [filterText, setFilterText] = useState('');
  const filterTextRef = useRef();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (filterText === filterTextRef.current.value) {
        const queryParams = filterText.length === 0 ? '' : `?orderBy="title"&equalTo="${filterText}"`;
        fetch('https://react-hooks-b7741.firebaseio.com/ingredients.json' + queryParams)
          .then(res => res.json())
          .then(resData => {
            const loadedIngredients = [];
            for (const key in resData) {
              loadedIngredients.push({
                id: key,
                title: resData[key].title,
                amount: resData[key].amount
              });
            }
            filteredIngredients(loadedIngredients);
          });
      }
    }, 1000);
    //Cleanup works before next use effect
    return () => {
      clearTimeout(timer);
    };
  }, [filterText, filteredIngredients, filterTextRef])

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input
            ref={filterTextRef}
            type="text"
            value={filterText}
            onChange={event => setFilterText(event.target.value)} />
        </div>
      </Card>
    </section>
  );
});

export default Search;
