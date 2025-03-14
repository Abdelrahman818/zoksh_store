const ClientsMsgs = (props) => {
  return (
    <div className="msg-cont d-flex col">
      <div className="date">
        <span>Date: {props.date}</span>
      </div>
      <div className="name d-flex row">
        <p className="user-name">Name: {props.uName}</p>
        {props.name !== props.uName&&<p className="name">({props.name})</p>}
      </div>
      <div className="phone d-flex row">
        <span>Phone: </span>
        <p className="user-phone">{props.uPhone}</p>
        {props.phone && props.phone !== props.uPhone && <p className="phone">/{props.phone}</p>}
      </div>
      <div className="email">
        <span>E-mail: {props.email}</span>
      </div>
      <div className="subj">
        <span>Subject: {props.subj}</span>
      </div>
      <div className="msg">
        <span>{props.msg}</span>
      </div>
    </div>
  );
}

export default ClientsMsgs;
