import { useState } from 'react';

const SendImgs = () => {

  const [imgs, setImgs] = useState(null);
  const [temp, setTemp] = useState(null);

  return (
    <div>
      <input type='file' multible />
      {temp && temp.map(e => <img src={e} alt='alt' />)}
      <button>upload</button>
    </div>
  );
}
