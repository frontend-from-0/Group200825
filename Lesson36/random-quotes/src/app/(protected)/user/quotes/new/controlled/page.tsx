'use client';

import { useState } from 'react';

// Not used very offten in NextJS but may be needed for complex logic, e.g. like prefilling dropdowns with information you pull form API while user is filling the form - User selects country, then you update city dropdown to only show cities in that country
export default function ControlledFormExample () {
  const [quote, setQuote] = useState('');
  const [author, setAuthor] = useState('');


  return (
    <form>
      <label htmlFor='quote'>Quote</label>
      <input type="text" id="quote" value={quote} onChange={(e) => setQuote(e.target.value.toUpperCase())}/>

      <label htmlFor='author'>Author</label>
      <input type="text" id="author" value={author} onChange={(e) => setAuthor(e.target.value)}/>
    </form>
  )
}