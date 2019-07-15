import React from 'react';
import styles from '../styles/app.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, info) {
    this.setState({ hasError: true });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
        <h1 className={styles.error}>Looks like something went wrong on our end.</h1>
        <span className={styles.highlightsTextMain}>Head back to our homepage to view our current available listings (1-100)</span>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;