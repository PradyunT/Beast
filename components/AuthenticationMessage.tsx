const AuthenticationMessage = ({ to }: { to: string }) => {
  return (
    <div>
      <h1 className="heading">
        Looks like you aren't logged in 😭. You must be logged in to {to}
      </h1>
    </div>
  );
};
export default AuthenticationMessage;
