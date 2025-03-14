import { useState, useEffect } from 'react';

const SocialMediaLinks = () => {
  const [data, setData] = useState({});
  useEffect(() => {
    fetch('http://localhost/zoksh-store/src/PHP.back.php', {
      method: 'POST',
      body: JSON.stringify({
        type: 'getLinks'
      })
    }).then(res => res.json())
      .then(json => {
        console.log(json);
        setData(json);
        console.log(data);
      });
  }, []);
  
  return (
    <div className='parent bg-dark'>
      <div className='edit-box'>
        <div className='edit'>
          {data.keys().map((e, i) => <div key={i}><span>{ e }</span></div>)}
        </div>
      </div>
    </div>
  );
}

export default SocialMediaLinks;
