document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM fully loaded and parsed');

  const truncateLength = 200;
  const responseCards = document.querySelectorAll('.response-card');
  console.log('Response Cards:', responseCards);

  function setupReadMoreLinks(cards) {
    cards.forEach(card => {
      const cardText = card.querySelector('.card-text[data-full-text]');
      if (cardText) {
        const fullText = cardText.getAttribute('data-full-text');
        if (fullText) {
          const truncatedText = fullText.substring(0, truncateLength) + '...';

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
            cardText.textContent = fullText;
            card.querySelector('.read-more').style.display = 'none';
          }
        }
      }
    });
  }

  function highlightText(element, searchTerm) {
    const innerHTML = element.innerHTML;
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const newHTML = innerHTML.replace(regex, '<span class="highlight">$1</span>');
    element.innerHTML = newHTML;
  }

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

  // Add event listener for form submission
  const form = document.getElementById('love-form');
  if (form) {
    form.addEventListener('submit', function(event) {
      event.preventDefault();
      form.classList.add('was-validated');
      if (form.checkValidity() === false) {
        return;
      }
      const formData = new FormData(event.target);
      fetch('https://vast-cliffs-70374.herokuapp.com/submit', {
        method: 'POST',
        body: JSON.stringify(Object.fromEntries(formData)),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (response.ok) {
          alert('Response submitted successfully!');
          event.target.reset();
          form.classList.remove('was-validated'); // Reset validation class
        } else {
          alert('Failed to submit response');
        }
      }).catch(error => {
        console.error('Error:', error);
        alert('Failed to submit response');
      });
    });
  }
});

  

  
  
  
  
  
  
  
  