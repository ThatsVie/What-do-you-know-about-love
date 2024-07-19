document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('.question-link');
  
    links.forEach(link => {
      link.addEventListener('click', function(event) {
        event.preventDefault();
        const targetClass = this.getAttribute('data-target');
        const targetContainer = document.getElementById(this.getAttribute('href').substring(1));
  
        if (targetContainer) {
          // Clear all answer containers
          document.querySelectorAll('.answer-container').forEach(container => {
            container.innerHTML = '';
          });
  
          // Scroll to the target container
          targetContainer.scrollIntoView({ behavior: 'smooth' });
  
          // Collect related answers
          const relatedAnswers = document.querySelectorAll(`.${targetClass}`);
          relatedAnswers.forEach(answer => {
            targetContainer.appendChild(answer.cloneNode(true));
          });
        }
      });
    });
  });
  
  
  
  
  
  