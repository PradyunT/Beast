const AuthenticationMessage = ({ to }: {to: string}) => {
  return (
    <div className="max-w-[100vw]">
      <h1 className="heading">
        Looks like you aren't logged in 😭<br/> You must be logged in to {to}
      </h1>
    </div>
  );
};
export default AuthenticationMessage;
