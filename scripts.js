document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM fully loaded and parsed');

  const truncateLength = 200;
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

          if (fullText.length > truncateLength) {
            cardText.innerHTML = truncatedText;

            const readMoreLink = card.querySelector('.read-more');
            readMoreLink.style.display = 'inline';
            readMoreLink.addEventListener('click', function(event) {
              event.preventDefault();
              console.log('Read More clicked');
              if (cardText.innerHTML === truncatedText) {
                cardText.innerHTML = fullText;
                readMoreLink.textContent = 'Read Less';
              } else {
                cardText.innerHTML = truncatedText;
                readMoreLink.textContent = 'Read More';
              }
            });
          } else {
            cardText.innerHTML = fullText;
            card.querySelector('.read-more').style.display = 'none';
          }
        }
      }
    });
  }

  // Function to highlight text within an element and its children
  function highlightText(element, searchTerm) {
    const regex = new RegExp(`(${searchTerm})`, 'gi');

    // Recursively highlight text in the element and its children
    function recursiveHighlight(node) {
      if (node.nodeType === 3) { // Text node
        const parent = node.parentNode;
        const highlightedText = node.nodeValue.replace(regex, '<span class="highlight">$1</span>');
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = highlightedText;
        while (tempDiv.firstChild) {
          parent.insertBefore(tempDiv.firstChild, node);
        }
        parent.removeChild(node);
      } else if (node.nodeType === 1 && node.childNodes) { // Element node
        node.childNodes.forEach(child => recursiveHighlight(child));
      }
    }

    recursiveHighlight(element);
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
                // Update data-full-text attribute to include highlighted text
                const fullText = textElement.getAttribute('data-full-text');
                if (fullText) {
                  const highlightedFullText = fullText.replace(new RegExp(`(${searchTerm})`, 'gi'), '<span class="highlight">$1</span>');
                  textElement.setAttribute('data-full-text', highlightedFullText);
                  textElement.innerHTML = highlightedFullText;
                } else {
                  highlightText(textElement, searchTerm);
                }
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
    const cardsPerButton = isMobile ? 3 : 6;

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

  insertResponseCards(Array.from(responseCards));
});
