export const scrollToSection = (sectionId: string) => {
  // Remove # if present
  const cleanId = sectionId.replace('#', '');
  
  // Wait for navigation to complete, then scroll
  setTimeout(() => {
    const element = document.getElementById(cleanId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, 100);
};

export const scrollToElement = (elementId: string) => {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
};