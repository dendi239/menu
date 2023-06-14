"use client";

import { getDishes, Dish } from '@/lib/api';
import { useState, useEffect } from 'react';

function DishMenuItem({ dish }: { dish: Dish; }) {
  return (
    <div className="dish">
      <img src={dish.imageURL} className='dish-image' />
      <div className="dish-shadow" />
      <a className='dish-title'>{dish.name}</a>
      <div className="dish-overlay">
        <a className="dish-description">{dish.description}</a>
      </div>
    </div>
  )
}

export default function Page() {
  const [dishes, setDishes] = useState<Dish[]>([]);
  
  useEffect(() => {
    async function fill() {
      setDishes(await getDishes());
    }
    fill()
  }, [])

  return (
    <div>
      <h1>Hello, Maryna</h1>
      <ul className="dish-list">{
        Array.from(dishes.entries()).map(([i, dish]) =>
          <DishMenuItem key={i} dish={dish} />
        )
      }</ul>
    </div>
  )
}
