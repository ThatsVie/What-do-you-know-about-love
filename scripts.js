document.addEventListener('DOMContentLoaded', function() {
  // Log to confirm the DOM is fully loaded
  console.log('DOM fully loaded and parsed');

  // Set the length for truncated text
  const truncateLength = 200;
  // Get all response cards
  const responseCards = document.querySelectorAll('.response-card');
  console.log('Response Cards:', responseCards);

  // Function to set up "Read More" links on cards
  function setupReadMoreLinks(cards) {
    cards.forEach(card => {
      const cardText = card.querySelector('.card-text[data-full-text]');
      if (cardText) {
        const fullText = cardText.getAttribute('data-full-text');
        if (fullText) {
          const truncatedText = fullText.substring(0, truncateLength) + '...';

          // If full text is longer than truncate length, set up "Read More" link
          if (fullText.length > truncateLength) {
            cardText.textContent = truncatedText;

            const readMoreLink = card.querySelector('.read-more');
            readMoreLink.style.display = 'inline';
            readMoreLink.addEventListener('click', function(event) {
              event.preventDefault();
              console.log('Read More clicked');
              if (cardText.textContent === truncatedText) {
                cardText.textContent = fullText;
                readMoreLink.textContent = 'Read Less';
              } else {
                cardText.textContent = truncatedText;
                readMoreLink.textContent = 'Read More';
              }
            });
          } else {
            // If full text is shorter than truncate length, display full text
            cardText.textContent = fullText;
            card.querySelector('.read-more').style.display = 'none';
          }
        }
      }
    });
  }

  // Function to highlight search terms in text
  function highlightText(element, searchTerm) {
    const innerHTML = element.innerHTML;
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const newHTML = innerHTML.replace(regex, '<span class="highlight">$1</span>');
    element.innerHTML = newHTML;
  }

  // Function to clear search results
  function clearSearchResults() {
    const searchContainer = document.querySelector('#search-results');
    const searchResultsSection = document.querySelector('#search-results-container');
    searchContainer.innerHTML = '';
    searchResultsSection.style.display = 'none';
    console.log('Search Results Cleared');
  }

  // Set up "Read More" links for initial response cards
  setupReadMoreLinks(responseCards);

  // Set up event listeners for question links
  const questionLinks = document.querySelectorAll('.question-link');
  const searchResultsSection = document.querySelector('#search-results-container');
  const searchContainer = document.querySelector('#search-results');

  console.log('Question Links:', questionLinks);
  console.log('Search Results Section:', searchResultsSection);
  console.log('Search Container:', searchContainer);

  if (questionLinks) {
    questionLinks.forEach(link => {
      link.addEventListener('click', function(event) {
        event.preventDefault();
        clearSearchResults(); // Clear previous search results
        const targetClass = this.getAttribute('data-target');
        console.log('Question Link Clicked:', targetClass);

        if (searchContainer) {
          const relatedAnswers = document.querySelectorAll(`.${targetClass}`);
          console.log('Related Answers:', relatedAnswers);
          relatedAnswers.forEach(answer => {
            searchContainer.appendChild(answer.cloneNode(true));
          });

          searchContainer.style.display = 'flex';
          searchContainer.style.flexWrap = 'wrap';
          searchContainer.style.justifyContent = 'center';

          if (relatedAnswers.length > 0) {
            searchResultsSection.style.display = 'block';
          } else {
            searchResultsSection.style.display = 'none';
          }

          searchResultsSection.scrollIntoView({ behavior: 'smooth' });

          // Reattach the event listeners to the dynamically added cards
          const newCards = searchContainer.querySelectorAll('.response-card');
          setupReadMoreLinks(newCards);
        }
      });
    });
  }

  // Set up smooth scrolling for navigation links
  const navLinks = document.querySelectorAll('a.nav-link');

  if (navLinks) {
    navLinks.forEach(link => {
      link.addEventListener('click', function(event) {
        const target = this.getAttribute('href');
        if (target.startsWith('#')) {
          event.preventDefault();
          const targetElement = document.querySelector(target);
          if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
          }
        } else {
          window.location.href = target;
        }
      });
    });
  }

  // Check URL parameters for target element to scroll into view
  const urlParams = new URLSearchParams(window.location.search);
  const target = urlParams.get('target');
  if (target) {
    const targetContainer = document.getElementById(target);
    if (targetContainer) {
      targetContainer.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Set up search form submission and clear buttons
  const searchForm = document.querySelector('#search-form');
  const searchInput = document.querySelector('#search-input');
  const searchQuestion = document.querySelector('#search-question');
  const clearResultsButton = document.querySelector('#clear-results-button');

  console.log('Search Form:', searchForm);
  console.log('Search Input:', searchInput);
  console.log('Search Question:', searchQuestion);
  console.log('Clear Results Button:', clearResultsButton);

  if (searchForm) {
    searchForm.addEventListener('submit', function(event) {
      event.preventDefault();
      clearSearchResults(); // Clear previous search results
      const searchTerm = searchInput.value.trim().toLowerCase();
      const searchQuestionValue = searchQuestion.value.trim().toLowerCase();
      console.log('Search Term:', searchTerm);
      console.log('Search Question Value:', searchQuestionValue);

      const allAnswers = document.querySelectorAll('.response-card');
      console.log('All Answers:', allAnswers);
      let hasResults = false;

      allAnswers.forEach(answer => {
        const cardTitleElement = answer.querySelector('.card-title');
        const cardTextElements = answer.querySelectorAll('.card-text');
        const tagsElement = answer.querySelector('.tags');
        console.log('Card Title Element:', cardTitleElement);
        console.log('Card Text Elements:', cardTextElements);

        if (cardTitleElement) {
          const cardTitle = cardTitleElement.textContent.toLowerCase();
          const tagsText = tagsElement ? tagsElement.textContent.toLowerCase() : '';
          let cardTextCombined = '';
          cardTextElements.forEach(textElement => {
            cardTextCombined += (textElement.getAttribute('data-full-text') || textElement.textContent) + ' ';
          });
          cardTextCombined = cardTextCombined.trim().toLowerCase();

          console.log('Card Title:', cardTitle);
          console.log('Card Text Combined:', cardTextCombined);
          console.log('Tags Text:', tagsText);

          if (
            (searchTerm && (cardTitle.includes(searchTerm) || cardTextCombined.includes(searchTerm) || tagsText.includes(searchTerm))) ||
            (searchQuestionValue && cardTitle.includes(searchQuestionValue))
          ) {
            console.log('Answer Found:', cardTitle);
            const answerClone = answer.cloneNode(true);

            if (searchTerm) {
              // Highlight the search term in the cloned card
              const clonedTitle = answerClone.querySelector('.card-title');
              highlightText(clonedTitle, searchTerm);
              const clonedTextElements = answerClone.querySelectorAll('.card-text');
              clonedTextElements.forEach(textElement => {
                highlightText(textElement, searchTerm);
              });
              const clonedTags = answerClone.querySelector('.tags');
              if (clonedTags) {
                highlightText(clonedTags, searchTerm);
              }
            }

            searchContainer.appendChild(answerClone);
            hasResults = true;
          }
        }
      });

      searchContainer.style.display = 'flex';
      searchContainer.style.flexWrap = 'wrap';
      searchContainer.style.justifyContent = 'center';

      if (hasResults) {
        searchResultsSection.style.display = 'block';
        console.log('Search Results Section Displayed');
      } else {
        searchResultsSection.style.display = 'none';
        console.log('No Results Found');
      }

      searchResultsSection.scrollIntoView({ behavior: 'smooth' });

      // Reattach the event listeners to the dynamically added cards
      const newCards = searchContainer.querySelectorAll('.response-card');
      setupReadMoreLinks(newCards);
    });

    clearResultsButton.addEventListener('click', function() {
      searchContainer.innerHTML = '';
      searchResultsSection.style.display = 'none';
      searchInput.value = '';
      searchQuestion.value = '';
    });
  }

  // Insert response cards into the response-container
  const responseContainer = document.getElementById('response-container');

  function insertResponseCards(cards) {
    const isMobile = window.innerWidth <= 768;
    const cardsPerButton = isMobile ? 3 : 9;

    cards.forEach((card, index) => {
      const answerContainer = document.getElementById(`answer-container-${Math.floor(index / cardsPerButton) + 1}`);
      if (answerContainer) {
        answerContainer.appendChild(card);
      }

      if ((index + 1) % cardsPerButton === 0) {
        const backToTopContainer = document.createElement('div');
        backToTopContainer.className = 'back-to-top-container';
        backToTopContainer.innerHTML = '<a href="#top" class="back-to-top">Back to Top</a>';
        answerContainer.appendChild(backToTopContainer);
      }
    });
  }

  // Insert the response cards and back-to-top buttons
  insertResponseCards(Array.from(responseCards));
});
