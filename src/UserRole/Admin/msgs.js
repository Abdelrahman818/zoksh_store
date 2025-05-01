const ClientsMsgs = (props) => {
  return (
    <>
      <div className="msg-cont d-flex col">
        <div className="msg-header d-flex space-between">
          <span className="msg-date">Date: {props.date}</span>
          <span className="msg-subj">Subject: {props.subj}</span>
        </div>

        <div className="msg-user-info">
          <p className="user-name">Name: <strong>{props.name}</strong></p>
          <p className="user-phone">Phone: <strong>{props.phone}</strong></p>\
        </div>

        <div className="msg-body">
          <p>{props.msg}</p>
        </div>
      </div>
    </>
  );
};

export default ClientsMsgs;
