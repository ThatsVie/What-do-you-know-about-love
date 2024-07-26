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
          const targetClass = this.getAttribute('data-target');
          console.log('Question Link Clicked:', targetClass);
  
          if (searchContainer) {
            searchContainer.innerHTML = '';
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
        const searchTerm = searchInput.value.trim().toLowerCase();
        const searchQuestionValue = searchQuestion.value.trim().toLowerCase();
        console.log('Search Term:', searchTerm);
        console.log('Search Question Value:', searchQuestionValue);
  
        searchContainer.innerHTML = '';
  
        const allAnswers = document.querySelectorAll('.response-card');
        console.log('All Answers:', allAnswers);
        let hasResults = false;
  
        allAnswers.forEach(answer => {
          const cardTitleElement = answer.querySelector('.card-title');
          const cardTextElement = answer.querySelector('.card-text');
          const tagsElement = answer.querySelector('.tags');
          console.log('Card Title Element:', cardTitleElement);
          console.log('Card Text Element:', cardTextElement);
  
          if (cardTitleElement && cardTextElement) {
            const cardTitle = cardTitleElement.textContent.toLowerCase();
            const cardText = cardTextElement.getAttribute('data-full-text') || cardTextElement.textContent;
            const tagsText = tagsElement ? tagsElement.textContent.toLowerCase() : '';
            console.log('Card Title:', cardTitle);
            console.log('Card Text:', cardText);
            console.log('Tags Text:', tagsText);
  
            if (cardText) {
              const cardTextLower = cardText.toLowerCase();
  
              if (
                (searchTerm && (cardTextLower.includes(searchTerm) || tagsText.includes(searchTerm))) ||
                (searchQuestionValue && cardTitle.includes(searchQuestionValue))
              ) {
                console.log('Answer Found:', cardTitle);
                const answerClone = answer.cloneNode(true);
                searchContainer.appendChild(answerClone);
                hasResults = true;
              }
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
  });
  
  
  
  
  
  
  
  