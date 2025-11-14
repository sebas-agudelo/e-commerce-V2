export default function SignInForm({ handleSubmit, setEmail, setPassword, errorMessage }) {
  return (
    <>
        <article className="user-data-content">
          <p className={errorMessage ? "error-message" : "no-error-message"}>{errorMessage}</p>
        
          <h1>Sign in</h1>
          
          <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="email@example.com"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
        <button type="submit">Sign in</button>
        </form>
       
        </article>
   
    </>
  );
}
