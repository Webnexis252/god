"use client";

import { useActionState } from "react";
import { submitLeadAction } from "@/app/actions";
import { siteConfig } from "@/lib/site";

const initialState = {
  status: "idle",
  message: "",
  errors: {},
  mailtoLink: "",
};

export default function ContactForm() {
  const [state, formAction, pending] = useActionState(
    submitLeadAction,
    initialState
  );

  return (
    <div className="contact-form-shell">
      <div className="contact-form-intro">
        <p className="section-eyebrow">Lead Capture</p>
        <h2 className="section-title">Request a launch-ready quote</h2>
        <p className="section-copy">
          Tell us what you are building, what matters most, and how fast you
          need to move. We will review your brief and come back with a clear
          scope, realistic timeline, and a build plan tailored to your goals.
        </p>
      </div>

      <form className="contact-form" action={formAction} noValidate>
        <div className="contact-grid">
          <label className="field">
            <span className="field-label">Name</span>
            <input
              className="field-input"
              type="text"
              name="name"
              autoComplete="name"
              aria-invalid={Boolean(state.errors.name)}
              aria-describedby={state.errors.name ? "error-name" : undefined}
              placeholder="Your name"
            />
            {state.errors.name ? (
              <span className="field-error" id="error-name">
                {state.errors.name}
              </span>
            ) : null}
          </label>

          <label className="field">
            <span className="field-label">Email</span>
            <input
              className="field-input"
              type="email"
              name="email"
              autoComplete="email"
              inputMode="email"
              aria-invalid={Boolean(state.errors.email)}
              aria-describedby={state.errors.email ? "error-email" : undefined}
              placeholder="you@company.com"
            />
            {state.errors.email ? (
              <span className="field-error" id="error-email">
                {state.errors.email}
              </span>
            ) : null}
          </label>

          <label className="field">
            <span className="field-label">Company</span>
            <input
              className="field-input"
              type="text"
              name="company"
              autoComplete="organization"
              placeholder="Company or brand"
            />
          </label>

          <label className="field">
            <span className="field-label">Project Type</span>
            <select
              className="field-input"
              name="projectType"
              defaultValue=""
              aria-invalid={Boolean(state.errors.projectType)}
              aria-describedby={
                state.errors.projectType ? "error-project-type" : undefined
              }
            >
              <option value="" disabled>
                Select one
              </option>
              <option value="UI / UX">UI / UX</option>
              <option value="Web Development">Web Development</option>
              <option value="Android App Development">Android App Development</option>
              <option value="iOS App Development">iOS App Development</option>
              <option value="Debugging / Management">Debugging / Management</option>
              <option value="SEO">SEO</option>
              <option value="Branding">Branding</option>
              <option value="Social Media Marketing">Social Media Marketing</option>
            </select>
            {state.errors.projectType ? (
              <span className="field-error" id="error-project-type">
                {state.errors.projectType}
              </span>
            ) : null}
          </label>

          <label className="field">
            <span className="field-label">Budget</span>
            <select
              className="field-input"
              name="budget"
              defaultValue=""
              aria-invalid={Boolean(state.errors.budget)}
              aria-describedby={state.errors.budget ? "error-budget" : undefined}
            >
              <option value="" disabled>
                Select one
              </option>
              <option value="Under $5k">Under $5k</option>
              <option value="$5k - $10k">$5k - $10k</option>
              <option value="$10k - $25k">$10k - $25k</option>
              <option value="$25k+">$25k+</option>
            </select>
            {state.errors.budget ? (
              <span className="field-error" id="error-budget">
                {state.errors.budget}
              </span>
            ) : null}
          </label>

          <label className="field">
            <span className="field-label">Timeline</span>
            <select
              className="field-input"
              name="timeline"
              defaultValue=""
              aria-invalid={Boolean(state.errors.timeline)}
              aria-describedby={state.errors.timeline ? "error-timeline" : undefined}
            >
              <option value="" disabled>
                Select one
              </option>
              <option value="ASAP">ASAP</option>
              <option value="2-4 weeks">2-4 weeks</option>
              <option value="1-2 months">1-2 months</option>
              <option value="Flexible planning window">Flexible planning window</option>
            </select>
            {state.errors.timeline ? (
              <span className="field-error" id="error-timeline">
                {state.errors.timeline}
              </span>
            ) : null}
          </label>
        </div>

        <label className="field">
          <span className="field-label">Project Brief</span>
          <textarea
            className="field-input field-textarea"
            name="details"
            rows="6"
            aria-invalid={Boolean(state.errors.details)}
            aria-describedby={state.errors.details ? "error-details" : undefined}
            placeholder="What are you building, who is it for, and what should this website help you achieve?"
          />
          {state.errors.details ? (
            <span className="field-error" id="error-details">
              {state.errors.details}
            </span>
          ) : null}
        </label>

        <div className="contact-actions">
          <button className="primary-button" type="submit" disabled={pending}>
            {pending ? "Reviewing brief..." : "Prepare my quote request"}
          </button>
          <p className="contact-note">
            Prefer email? Reach us directly at{" "}
            <a className="inline-link" href={`mailto:${siteConfig.email}`}>
              {siteConfig.email}
            </a>
            .
          </p>
        </div>

        <p className={`form-status is-${state.status}`} aria-live="polite">
          {state.message || "We reply with next steps, scope clarity, and a realistic build plan."}
        </p>


      </form>
    </div>
  );
}
