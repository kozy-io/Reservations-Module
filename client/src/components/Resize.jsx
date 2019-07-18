import React from 'react';
import App from './App.jsx';
import ErrorBoundary from './ErrorBoundary.jsx';
import OutsideClickHandler from 'react-outside-click-handler';
import NumberFormat from 'react-number-format';
import styles from '../styles/resize.css';
import axios from 'axios';

class Resize extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      width: null,
      height: null,
      displayFooter: false,
      displayPop: false,
      base_rate: null,
      review_count: null,
      star_rating: null,
    };

    this.updateDimensions = this.updateDimensions.bind(this);
    this.toggleDisplayPop = this.toggleDisplayPop.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.getListing = this.getListing.bind(this);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateDimensions);
    this.updateDimensions();
    this.getListing();
  }

  updateDimensions() {
    if (window.innerWidth < 700) {
      if (!this.state.displayFooter) {
        this.setState({
          displayFooter: true,
          displayPop: true,
          width: window.innerWidth,
          height: window.innerHeight,
        }, () => {
          document.getElementById('appPop').style.display = 'none';
        });
      }
    } else if (window.innerWidth > 700) {
      if (this.state.displayFooter) {
        this.setState({
          displayFooter: false,
          width: window.innerWidth,
          height: window.innerHeight,
        }, () => {
          document.getElementById('appPop').style.display = 'none';
          this.setState({ displayPop: false });
        });
      }
    }
  }

  toggleDisplayPop() {
    this.setState({ displayPop: true }, () => {
      document.getElementById('appPop').style.display = 'block';
    });
  }

  handleClickOutside() {
    document.getElementById('appPop').style.display = 'none';
  }

  getListing() {
    const parts = window.location.href.split('/');
    const id = parts[parts.length - 2];
    axios.get(`/listing/${id}`)
      .then((response) => {
        const { base_rate, review_count, star_rating } = response.data;
        this.setState({ base_rate, review_count, star_rating })})
      .catch((error) => { throw error; });
  }

  render() {
    const { base_rate, star_rating, review_count } = this.state;
    const ratingClass = 'ratings' + Math.ceil(star_rating);

    return (
      <div>
        { this.state.displayFooter ? (
          <div id={styles.footer}>
           <div className={styles.listing}>
            <div>
              <span className={styles.price}>
                <NumberFormat
                  value={base_rate}
                  displayType={'text'} 
                  thousandSeparator={true}
                  prefix={'$'}
                  decimalScale={0}/>
              </span>
              <span className={styles.perNight}>
                per night
              </span>
            </div>

            <div>
              <button className={styles.reviewsButtonFooter}>
                <span role="img" className={`${styles.ratingsImageFooter} ${styles[ratingClass]}`}></span>
              </button>
              <span className={styles.reviewsNumber}> {review_count}</span>
            </div>

          </div>

          </div>
        ) : null
        }
        { this.state.displayPop ? (
          <OutsideClickHandler
            onOutsideClick={() => { this.handleClickOutside(); }}
          >
          <div id={styles.appPop}>
            <ErrorBoundary>
              <App />
            </ErrorBoundary>
          </div>
          </OutsideClickHandler>
        ) : (
            <ErrorBoundary>
              <App />
            </ErrorBoundary>
        )}
      </div>
    );
  }
}

export default Resize;
