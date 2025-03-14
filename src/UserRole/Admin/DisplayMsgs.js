import { useState, useEffect } from "react";
import ClientsMsgs from "./msgs";

const DisplayMsgs = () => {
  const [msgs, setMsgs] = useState([]);
  
  useEffect(() => {
    fetch('http://localhost/zoksh-store/src/PHP/back.php', {
      method: 'POST',
      body: JSON.stringify({ type: 'getMsgs' })
    }).then(res => res.json())
      .then(json => setMsgs(json))
      .catch(e => console.error(e));
  }, [])

  return (
    <section className="clients-msgs">
      { msgs.length > 0? (
        msgs.map((e, i) => {
          return <ClientsMsgs 
            key={i}
            name={e.name}
            uName={e.user_name}
            phone={e.phone}
            uPhone={e.user_phone}
            email={e.email}
            msg={e.msg}
            subj={e.subj}
            date={e.date}
            />
        })
      ):(
      <div className="no-msgs">
        <h2>No messges for now</h2>
      </div>)
      }
    </section>
  );
}

export default DisplayMsgs;
