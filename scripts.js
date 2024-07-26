document.addEventListener('DOMContentLoaded', function() {
  // Functionality for question links
  const questionLinks = document.querySelectorAll('.question-link');
  const searchResultsSection = document.querySelector('#search-results-container');
  const searchContainer = document.querySelector('#search-results');

  questionLinks.forEach(link => {
    link.addEventListener('click', function(event) {
      event.preventDefault();
      const targetClass = this.getAttribute('data-target');

      if (searchContainer) {
        // Clear the search results container
        searchContainer.innerHTML = '';

        // Collect related answers
        const relatedAnswers = document.querySelectorAll(`.${targetClass}`);
        relatedAnswers.forEach(answer => {
          searchContainer.appendChild(answer.cloneNode(true));
        });

        // Apply the flex layout to the search results container
        searchContainer.style.display = 'flex';
        searchContainer.style.flexWrap = 'wrap';
        searchContainer.style.justifyContent = 'center';

        // Show the search results container if there are results
        if (relatedAnswers.length > 0) {
          searchResultsSection.style.display = 'block';
        } else {
          searchResultsSection.style.display = 'none';
        }

        // Scroll to the search results container
        searchResultsSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Functionality for navbar links with smooth scrolling
  const navLinks = document.querySelectorAll('a.nav-link');

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

  // Handle URL parameter for target container
  const urlParams = new URLSearchParams(window.location.search);
  const target = urlParams.get('target');
  if (target) {
    const targetContainer = document.getElementById(target);
    if (targetContainer) {
      targetContainer.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Functionality for search form
  const searchForm = document.querySelector('#search-form');
  const searchInput = document.querySelector('#search-input');
  const searchQuestion = document.querySelector('#search-question');
  const clearResultsButton = document.querySelector('#clear-results-button');

  if (searchForm) {
    searchForm.addEventListener('submit', function(event) {
      event.preventDefault();
      const searchTerm = searchInput.value.toLowerCase();
      const searchQuestionValue = searchQuestion.value.toLowerCase();

      // Clear the search results container
      searchContainer.innerHTML = '';

      // Filter and display answers based on search term and selected question
      const allAnswers = document.querySelectorAll('.response-card');
      let hasResults = false;

      allAnswers.forEach(answer => {
        const cardText = answer.textContent.toLowerCase();

        if (
          (searchTerm && cardText.includes(searchTerm)) ||
          (searchQuestionValue && cardText.includes(searchQuestionValue))
        ) {
          const answerClone = answer.cloneNode(true); // Clone the card with its container
          searchContainer.appendChild(answerClone);
          hasResults = true;
        }
      });

      // Apply the flex layout to the search results container
      searchContainer.style.display = 'flex';
      searchContainer.style.flexWrap = 'wrap';
      searchContainer.style.justifyContent = 'center';

      // Show the search results container if there are results
      if (hasResults) {
        searchResultsSection.style.display = 'block';
      } else {
        searchResultsSection.style.display = 'none';
      }

      // Scroll to the search results container
      searchResultsSection.scrollIntoView({ behavior: 'smooth' });
    });

    // Functionality for clear results button
    clearResultsButton.addEventListener('click', function() {
      // Clear the search results container
      searchContainer.innerHTML = '';
      // Hide the search results container
      searchResultsSection.style.display = 'none';
      // Clear the search input and question select
      searchInput.value = '';
      searchQuestion.value = '';
    });
  }
});


