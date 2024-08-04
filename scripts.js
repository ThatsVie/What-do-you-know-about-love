document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM fully loaded and parsed');

  const truncateLength = 200;
  let searchTerm = '';

  const responseCards = document.querySelectorAll('.response-card');
  console.log('Response Cards:', responseCards);

  // Function to set up "Read More" links for response cards
  function setupReadMoreLinks(cards) {
    cards.forEach(card => {
      const cardText = card.querySelector('.card-text[data-full-text]');
      if (cardText) {
        const fullText = cardText.getAttribute('data-full-text');
        if (fullText) {
          const truncatedText = fullText.substring(0, truncateLength) + '...';
          cardText.innerHTML = highlightText(truncatedText, searchTerm);

          const readMoreLink = card.querySelector('.read-more');
          readMoreLink.style.display = 'inline';
          readMoreLink.tabIndex = 0; // Make the link focusable

          readMoreLink.addEventListener('click', function(event) {
            event.preventDefault();
            toggleReadMore(cardText, fullText, truncatedText, readMoreLink);
          });

          // Allow keyboard activation
          readMoreLink.addEventListener('keydown', function(event) {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              toggleReadMore(cardText, fullText, truncatedText, readMoreLink);
            }
          });
        }
      }
    });
  }

  // Function to toggle "Read More" and "Read Less"
  function toggleReadMore(cardText, fullText, truncatedText, readMoreLink) {
    const isTruncated = cardText.innerHTML === highlightText(truncatedText, searchTerm);
    cardText.innerHTML = isTruncated ? highlightText(fullText, searchTerm) : highlightText(truncatedText, searchTerm);
    readMoreLink.textContent = isTruncated ? 'Read Less' : 'Read More';
  }

  // Function to highlight text within a string
  function highlightText(text, searchTerm) {
    if (!searchTerm) return text;
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.replace(regex, '<span class="highlight">$1</span>');
  }

  // Function to clear search results
  function clearSearchResults() {
    const searchContainer = document.querySelector('#search-results');
    const searchResultsSection = document.querySelector('#search-results-container');
    searchContainer.innerHTML = '';
    searchResultsSection.style.display = 'none';
    console.log('Search Results Cleared');
  }

  setupReadMoreLinks(responseCards);

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
            const clonedAnswer = answer.cloneNode(true);
            setupReadMoreLinks([clonedAnswer]);
            searchContainer.appendChild(clonedAnswer);
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

          // Insert "Back to Top" buttons at the correct intervals for the cloned cards
          insertBackToTopButtons(newCards, searchContainer);
        }
      });
    });
  }

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

  const urlParams = new URLSearchParams(window.location.search);
  const target = urlParams.get('target');
  if (target) {
    const targetContainer = document.getElementById(target);
    if (targetContainer) {
      targetContainer.scrollIntoView({ behavior: 'smooth' });
    }
  }

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
      searchTerm = searchInput.value.trim().toLowerCase();
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
              clonedTitle.innerHTML = highlightText(clonedTitle.innerHTML, searchTerm);
              const clonedTextElements = answerClone.querySelectorAll('.card-text');
              clonedTextElements.forEach(textElement => {
                textElement.innerHTML = highlightText(textElement.innerHTML, searchTerm);
              });
              const clonedTags = answerClone.querySelector('.tags');
              if (clonedTags) {
                clonedTags.innerHTML = highlightText(clonedTags.innerHTML, searchTerm);
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

      // Insert "Back to Top" buttons at the correct intervals for the cloned cards
      insertBackToTopButtons(newCards, searchContainer);
    });

    clearResultsButton.addEventListener('click', function() {
      searchContainer.innerHTML = '';
      searchResultsSection.style.display = 'none';
      searchInput.value = '';
      searchQuestion.value = '';
    });
  }

  // Function to insert "Back to Top" buttons at the correct intervals
  function insertBackToTopButtons(cards, container) {
    const isMobile = window.innerWidth <= 768;
    const cardsPerButton = isMobile ? 3 : 6;

    let count = 0;
    let tempContainer = document.createElement('div');
    tempContainer.className = 'row';

    cards.forEach((card, index) => {
      tempContainer.appendChild(card);
      count++;

      if (count === cardsPerButton || index === cards.length - 1) {
        const backToTopContainer = document.createElement('div');
        backToTopContainer.className = 'col-12 text-center my-3';
        backToTopContainer.innerHTML = '<a href="#top" class="back-to-top">Back to Top</a>';
        tempContainer.appendChild(backToTopContainer);
        container.appendChild(tempContainer);

        // Reset for the next group
        tempContainer = document.createElement('div');
        tempContainer.className = 'row';
        count = 0;
      }
    });
  }

  // Insert response cards into the response-container
  const responseContainer = document.getElementById('response-container');

  function insertResponseCards(cards) {
    const isMobile = window.innerWidth <= 768;
    const cardsPerButton = isMobile ? 3 : 6;

    let count = 0;
    let tempContainer = document.createElement('div');
    tempContainer.className = 'row';

    cards.forEach((card, index) => {
      tempContainer.appendChild(card);
      count++;

      if (count === cardsPerButton || index === cards.length - 1) {
        const backToTopContainer = document.createElement('div');
        backToTopContainer.className = 'col-12 text-center my-3';
        backToTopContainer.innerHTML = '<a href="#top" class="back-to-top">Back to Top</a>';
        tempContainer.appendChild(backToTopContainer);
        responseContainer.appendChild(tempContainer);

        // Reset for the next group
        tempContainer = document.createElement('div');
        tempContainer.className = 'row';
        count = 0;
      }
    });
  }

  insertResponseCards(Array.from(responseCards));
});

