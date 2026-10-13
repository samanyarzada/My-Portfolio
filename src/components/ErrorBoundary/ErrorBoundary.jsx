import { Component } from "react";
import "./ErrorBoundary.css";

const text = {
  en: {
    title: "Something went wrong",
    body: "This page could not be loaded. Check your connection and try again.",
    retry: "Reload page",
  },
  fa: {
    title: "مشکلی پیش آمد",
    body: "این صفحه بارگذاری نشد. اینترنتت را بررسی کن و دوباره امتحان کن.",
    retry: "بارگذاری دوباره",
  },
};

export default class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error("Page error:", error);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    // A class component cannot use hooks, so we read the language from <html>
    const lang = document.documentElement.lang === "fa" ? "fa" : "en";
    const t = text[lang];

    return (
      <section className="container error-boundary" role="alert">
        <h1>{t.title}</h1>
        <p>{t.body}</p>
        <button type="button" className="btn btn-primary" onClick={() => window.location.reload()}>
          {t.retry}
        </button>
      </section>
    );
  }
}