export default function SignInForm({ handleSubmit, setEmail, setPassword, errorMessage }) {
  return (
    <>
      <article className="user-data-content">
        <p className={errorMessage ? "error-message" : "no-error-message"}>{errorMessage}</p>

        <p className="sign-in-sound">LOGGA IN PÅ SOUND</p>
        <p className="sign-text">Om du är en registrerad användare ber vi dig ange e-postadress och lösenord.</p>

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
