import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [apiSuccess, setApiSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!form.username.trim()) {
      newErrors.username = "Please enter your name.";
    }
    if (!form.email.trim()) {
      newErrors.email = "Please enter a valid email.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!form.password) {
      newErrors.password = "Password must be between 6 and 60 characters.";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }
    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    if (apiError) setApiError("");
    if (apiSuccess) setApiSuccess("");
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
const BASE = import.meta.env.VITE_API_URL;
const res = await axios.post(`${BASE}/signup`, form);
      setApiSuccess(res.data.message + " Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      const message =
        err.response?.data?.message || "Something went wrong. Please try again.";
      setApiError(message);
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: "username", type: "text", label: "Full Name", autoComplete: "name" },
    { name: "email", type: "email", label: "Email address", autoComplete: "email" },
    { name: "password", type: "password", label: "Password", autoComplete: "new-password" },
    { name: "confirmPassword", type: "password", label: "Confirm Password", autoComplete: "new-password" },
  ];

  return (
    <div className="signup-root">
      <div className="signup-bg" />
      <div className="signup-bg-overlay" />

      <header className="signup-header">
        <div className="netflix-logo">NETFLIX</div>
      </header>

      <main className="signup-main">
        <div className="signup-card">
          <h1 className="signup-title">Sign Up</h1>
          <p className="signup-sub">Just a few more steps and you're done!</p>

          {apiError && (
            <div className="api-error-box">
              <span>⚠</span> {apiError}
            </div>
          )}
          {apiSuccess && (
            <div className="api-success-box">
              <span>✓</span> {apiSuccess}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="signup-form">
            {fields.map(({ name, type, label, autoComplete }) => (
              <div
                key={name}
                className={`field-group ${errors[name] ? "has-error" : ""}`}
              >
                <div className="float-label-wrap">
                  <input
                    type={type}
                    id={name}
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    className={`float-input ${form[name] ? "has-value" : ""}`}
                    autoComplete={autoComplete}
                    spellCheck="false"
                  />
                  <label htmlFor={name} className="float-label">
                    {label}
                  </label>
                </div>
                {errors[name] && (
                  <span className="field-error">
                    <i>⚠</i> {errors[name]}
                  </span>
                )}
              </div>
            ))}

            <button type="submit" className="signup-btn" disabled={loading}>
              {loading ? <span className="btn-spinner" /> : "Create Account"}
            </button>
          </form>

          <div className="signup-footer">
            <span>Already have an account? </span>
            <Link to="/login" className="signin-link">
              Sign in
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Signup;