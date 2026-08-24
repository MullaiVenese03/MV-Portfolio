import { useState, useId, useRef } from "react";
import { useSubmit } from "@formspree/react";
import { isSubmissionError } from "@formspree/core";
import { Mail, Phone, MapPin } from "lucide-react";
import { motion } from "motion/react";
import { socialLinks } from "../data/socialLinks";
import { SocialIconLink } from "./SocialIconLink";
import { PaperPlaneButton } from "./PaperPlaneButton";
import { GLOBAL_EMAIL_PATTERN, validateEmail, validateRequired } from "../lib/validation";
import { badgeStyle, FONT, FONT_DISPLAY, MOTION_EASE, themeVars, TIMING } from "../theme";

interface ContactProps {
  darkMode: boolean;
}

export function Contact({ darkMode }: ContactProps) {
  const fieldIds = {
    name: useId(),
    email: useId(),
    subject: useId(),
    message: useId(),
  };
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<{ name?: string; email?: string; subject?: string; message?: string }>({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  // useSubmit returns Promise<SubmissionResult> directly — no stale state issues
  const fsSubmit = useSubmit("mvkpjgdl");

  // Snapshot form values at validation time so the 0.85s plane animation delay
  // doesn't cause a stale closure to send outdated field data
  const pendingFormRef = useRef<{ name: string; email: string; subject: string; message: string } | null>(null);

  const c = themeVars;

  const validateForm = (): boolean => {
    const newErrors: { name?: string; email?: string; subject?: string; message?: string } = {};
    if (!validateRequired(form.name)) {
      newErrors.name = "Please enter your name";
    }
    if (!validateEmail(form.email)) {
      newErrors.email = "Please enter a valid email address (e.g. john@example.com)";
    }
    if (!validateRequired(form.subject)) {
      newErrors.subject = "Please enter a subject";
    }
    if (!validateRequired(form.message)) {
      newErrors.message = "Please enter your message";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return false;
    }

    setErrors({});
    // Snapshot current values NOW (before animation plays) so handleFlightComplete
    // always sends the correct data regardless of any re-renders during the delay
    pendingFormRef.current = { ...form };
    return true;
  };

  const handleFlightComplete = async () => {
    const snapshot = pendingFormRef.current;
    if (!snapshot) return;
    pendingFormRef.current = null;

    setSending(true);

    const data = new FormData();
    data.append("name", snapshot.name);
    data.append("email", snapshot.email);
    data.append("subject", snapshot.subject);
    data.append("message", snapshot.message);

    // useSubmit returns the result directly — no stale state, no ref workarounds needed
    const result = await fsSubmit(data);

    setSending(false);

    if (isSubmissionError(result)) {
      const mapped: { name?: string; email?: string; subject?: string; message?: string } = {};
      const knownFields = ["name", "email", "subject", "message"] as const;

      for (const field of knownFields) {
        const fieldErrs = result.getFieldErrors(field);
        if (fieldErrs.length > 0) {
          mapped[field] = fieldErrs[0].message;
        }
      }

      if (Object.keys(mapped).length > 0) {
        setErrors(mapped);
      } else {
        const formErrs = result.getFormErrors();
        setErrors({
          message:
            formErrs.length > 0
              ? formErrs[0].message
              : "Something went wrong. Please try again or email me directly.",
        });
      }
      return;
    }

    setSent(true);
    setForm({ name: "", email: "", subject: "", message: "" });
    setTimeout(() => setSent(false), 5000);
  };

  const contactInfo = [
    { icon: Mail, label: "Email", value: "mullaivenesep@gmail.com", href: "mailto:mullaivenesep@gmail.com", color: "#2563EB" },
    { icon: Phone, label: "Phone", value: "+91 86374 08125", href: "tel:+918637408125", color: "#059669" },
    { icon: MapPin, label: "Location", value: "India", color: "#DC2626" },
  ];

  return (
    <section id="contact" className="py-28" style={{ background: c.section }} aria-labelledby="contact-heading">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">

        <motion.div
          className="flex flex-col items-center mb-16 text-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: TIMING.reveal, ease: MOTION_EASE }}
        >
          <span className="px-4 py-1.5 rounded-full text-sm mb-4 border" style={badgeStyle(c)}>
            Get In Touch
          </span>
          <h2 id="contact-heading" style={{ fontFamily: FONT_DISPLAY, fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 400, color: c.heading, letterSpacing: "0.02em" }}>
            Let's Work <span style={{ color: c.primary }}>Together</span>
          </h2>
          <p className="mt-3 max-w-xl" style={{ fontFamily: FONT, fontSize: "15px", color: c.body, lineHeight: 1.7 }}>
            Have a project in mind? Let's discuss how I can help bring your vision to life.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* Contact info column */}
          <motion.div
            className="lg:col-span-2 flex flex-col gap-5"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.65, ease: MOTION_EASE }}
          >
            {contactInfo.map(({ icon: Icon, label, value, href, color }) => {
              const content = (
                <>
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3" style={{ background: color + "15", border: `1.5px solid ${color}25` }}>
                    <Icon size={18} style={{ color }} />
                  </div>
                  <div>
                    <div style={{ fontFamily: FONT, fontSize: "12px", fontWeight: 600, color: c.body, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</div>
                    <div className="mt-0.5" style={{ fontFamily: FONT, fontSize: "14px", fontWeight: 600, color: c.heading }}>{value}</div>
                  </div>
                </>
              );

              return href ? (
                <a
                  key={label}
                  href={href}
                  aria-label={`${label}: ${value}`}
                  className="group p-5 rounded-2xl border flex items-start gap-4 hover:-translate-y-1 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10"
                  style={{ background: c.card, borderColor: c.border, boxShadow: c.shadow }}
                >
                  {content}
                </a>
              ) : (
                <div
                  key={label}
                  className="group p-5 rounded-2xl border flex items-start gap-4 hover:-translate-y-1 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10"
                  style={{ background: c.card, borderColor: c.border, boxShadow: c.shadow }}
                >
                  {content}
                </div>
              );
            })}

            <div className="p-5 rounded-2xl border" style={{ background: c.card, borderColor: c.border, boxShadow: c.shadow }}>
              <div className="mb-3" style={{ fontFamily: FONT, fontSize: "13px", fontWeight: 700, color: c.heading }}>Follow Me</div>
              <div className="flex gap-3">
                {socialLinks
                  .filter((link) => link.label !== "Email")
                  .map((link) => (
                    <SocialIconLink
                      key={link.label}
                      {...link}
                      darkMode={darkMode}
                      variant="contact"
                    />
                  ))}
              </div>
            </div>

            <div
              className="p-5 rounded-2xl"
              style={{ background: "linear-gradient(135deg, #2563EB, #1D4ED8)", boxShadow: "0 8px 28px rgba(37,99,235,0.3)" }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "13px", fontWeight: 700, color: "#BAE6FD" }}>Available for Projects</span>
              </div>
              <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.8)", lineHeight: 1.6 }}>
                Currently open to freelance projects, collaborations, and full-time opportunities.
              </p>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.65, ease: MOTION_EASE, delay: 0.1 }}
          >
            <div
              className="contact-form-card p-8 rounded-3xl border"
              style={{ background: c.card, borderColor: c.border, boxShadow: c.shadowLg }}
            >
              {sent ? (
                <div
                  className="flex flex-col items-center justify-center py-16 gap-4 text-center"
                  role="status"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  <motion.div className="text-5xl" initial={{ scale: 0.4, opacity: 0, rotate: -12 }} animate={{ scale: 1, opacity: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 260, damping: 16 }}>🎉</motion.div>
                  <h3 style={{ fontFamily: FONT, fontSize: "22px", fontWeight: 700, color: c.heading }}>Message Sent!</h3>
                  <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} style={{ fontFamily: FONT, fontSize: "14px", color: c.body }}>Thanks for reaching out - I'll get back to you within 24 hours.</motion.p>
                </div>
              ) : (
                <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-5" noValidate>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor={fieldIds.name} style={{ fontFamily: FONT, fontSize: "13px", fontWeight: 600, color: c.body }}>Your Name</label>
                      <input
                        id={fieldIds.name}
                        type="text"
                        name="name"
                        required
                        autoComplete="name"
                        placeholder="John Doe"
                        value={form.name}
                        onChange={(e) => {
                          setForm({ ...form, name: e.target.value });
                          if (errors.name) setErrors({ ...errors, name: undefined });
                        }}
                        className={`w-full mt-1.5 px-4 py-3 rounded-xl outline-none portfolio-input ${
                          errors.name ? "input-error" : ""
                        }`}
                        style={{ fontFamily: FONT, fontSize: "14px" }}
                      />
                      {errors.name && (
                        <p className="mt-1 text-xs text-red-500 font-medium">{errors.name}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor={fieldIds.email} style={{ fontFamily: FONT, fontSize: "13px", fontWeight: 600, color: c.body }}>Email Address</label>
                      <input
                        id={fieldIds.email}
                        type="email"
                        name="email"
                        required
                        autoComplete="email"
                        pattern={GLOBAL_EMAIL_PATTERN}
                        title="Please enter a valid email address (e.g. john@example.com)"
                        placeholder="john@example.com"
                        value={form.email}
                        onChange={(e) => {
                          setForm({ ...form, email: e.target.value });
                          if (errors.email) setErrors({ ...errors, email: undefined });
                        }}
                        className={`w-full mt-1.5 px-4 py-3 rounded-xl outline-none portfolio-input ${
                          errors.email ? "input-error" : ""
                        }`}
                        style={{ fontFamily: FONT, fontSize: "14px" }}
                      />
                      {errors.email && (
                        <p className="mt-1 text-xs text-red-500 font-medium">{errors.email}</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label htmlFor={fieldIds.subject} style={{ fontFamily: FONT, fontSize: "13px", fontWeight: 600, color: c.body }}>Subject</label>
                    <input
                      id={fieldIds.subject}
                      type="text"
                      name="subject"
                      required
                      autoComplete="off"
                      placeholder="Project Inquiry"
                      value={form.subject}
                      onChange={(e) => {
                        setForm({ ...form, subject: e.target.value });
                        if (errors.subject) setErrors({ ...errors, subject: undefined });
                      }}
                      className={`w-full mt-1.5 px-4 py-3 rounded-xl outline-none portfolio-input ${
                        errors.subject ? "input-error" : ""
                      }`}
                      style={{ fontFamily: FONT, fontSize: "14px" }}
                    />
                    {errors.subject && (
                      <p className="mt-1 text-xs text-red-500 font-medium">{errors.subject}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor={fieldIds.message} style={{ fontFamily: FONT, fontSize: "13px", fontWeight: 600, color: c.body }}>Message</label>
                    <textarea
                      id={fieldIds.message}
                      name="message"
                      required
                      rows={5}
                      placeholder="Tell me about your project..."
                      value={form.message}
                      onChange={(e) => {
                        setForm({ ...form, message: e.target.value });
                        if (errors.message) setErrors({ ...errors, message: undefined });
                      }}
                      className={`w-full mt-1.5 px-4 py-3 rounded-xl outline-none resize-none portfolio-input ${
                        errors.message ? "input-error" : ""
                      }`}
                      style={{ fontFamily: FONT, fontSize: "14px" }}
                    />
                    {errors.message && (
                      <p className="mt-1 text-xs text-red-500 font-medium">{errors.message}</p>
                    )}
                  </div>
                  <PaperPlaneButton
                    type="submit"
                    isSending={sending}
                    isSent={sent}
                    label="Send Message"
                    sendingLabel="Sending..."
                    sentLabel="Message Sent"
                    onFlightStart={validateForm}
                    onFlightComplete={handleFlightComplete}
                  />
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

