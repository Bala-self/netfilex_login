import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!form.email.trim()) {
      newErrors.email = "Please enter a valid email.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!form.password) {
      newErrors.password = "Your password must contain between 4 and 60 characters.";
    } else if (form.password.length < 4) {
      newErrors.password = "Your password must contain between 4 and 60 characters.";
    }
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (apiError) setApiError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:3000/login", {
        email: form.email,
        password: form.password,
      });
      sessionStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard");
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Something went wrong. Please try again.";
      setApiError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-root">
      <div className="login-bg" />
      <div className="login-bg-overlay" />

      <header className="login-header">
        <div className="netflix-logo">NETFLIX</div>
      </header>

      <main className="login-main">
        <div className="login-card">
          <h1 className="login-title">Sign In</h1>

          {apiError && (
            <div className="api-error-box">
              <span className="api-error-icon">⚠</span>
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="login-form">
            <div className={`field-group ${errors.email ? "has-error" : ""}`}>
              <div className="float-label-wrap">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className={`float-input ${form.email ? "has-value" : ""}`}
                  autoComplete="email"
                  spellCheck="false"
                />
                <label htmlFor="email" className="float-label">
                  Email or phone number
                </label>
              </div>
              {errors.email && (
                <span className="field-error">
                  <i>⚠</i> {errors.email}
                </span>
              )}
            </div>

            <div className={`field-group ${errors.password ? "has-error" : ""}`}>
              <div className="float-label-wrap">
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className={`float-input ${form.password ? "has-value" : ""}`}
                  autoComplete="current-password"
                />
                <label htmlFor="password" className="float-label">
                  Password
                </label>
              </div>
              {errors.password && (
                <span className="field-error">
                  <i>⚠</i> {errors.password}
                </span>
              )}
            </div>

            <button
              type="submit"
              className="signin-btn"
              disabled={loading}
            >
              {loading ? <span className="btn-spinner" /> : "Sign In"}
            </button>

            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <a href="#" className="need-help">
                Need help?
              </a>
            </div>
          </form>

          <div className="login-footer">
            <span className="new-to-netflix">New to Netflix?&nbsp;</span>
            <Link to="/signup" className="signup-link">
              Sign up now
            </Link>
          </div>

          <p className="recaptcha-note">
            This page is protected by Google reCAPTCHA to ensure you're not a
            bot.{" "}
            <span className="learn-more">Learn more.</span>
          </p>
        </div>
      </main>
    </div>
  );
}

export default LoginPage;