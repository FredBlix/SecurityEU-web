// Mobile navigation toggle
const hamburger = document.querySelector('.hamburger');
const mobileNav = document.querySelector('.mobile-nav');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  mobileNav.classList.toggle('active');
});

// Close mobile nav on link click
mobileNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    mobileNav.classList.remove('active');
  });
});

// Scroll-triggered fade-in animations
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// Contact form submission to Formspree
console.log('Form code loaded - Formspree version');
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  console.log('Form element found, attaching Formspree listener');
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = contactForm.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = 'Sending...';
    btn.disabled = true;

    const formDataObj = new FormData();
    formDataObj.append('first_name', contactForm.querySelector('#first-name').value);
    formDataObj.append('last_name', contactForm.querySelector('#last-name').value);
    formDataObj.append('email', contactForm.querySelector('#email').value);
    formDataObj.append('phone', contactForm.querySelector('#phone').value || '');
    formDataObj.append('message', contactForm.querySelector('#message') ? contactForm.querySelector('#message').value : '');

    const serviceSelect = contactForm.querySelector('#service');
    const serviceValue = serviceSelect ? serviceSelect.value : contactForm.dataset.service;
    if (serviceValue) {
      const serviceNames = {
        '6b4316e3-427e-4ca3-8247-20639e405d8b': 'CSR Managed Assurance',
        '18b4a8a6-5896-4604-b802-f9336af7ec39': 'NIS2 Mandatory Training',
        '22496622-f958-4693-8206-cb58e03d6107': 'NIS2 Policy Compliance Check',
        '6f420db6-8b46-4d9f-801d-7db619b01ff3': 'Other'
      };
      formDataObj.append('service_interest', serviceNames[serviceValue] || 'Other');
    }

    try {
      const res = await fetch('https://formspree.io/f/mdokyonw', {
        method: 'POST',
        body: formDataObj
      });

      if (res.ok) {
        contactForm.innerHTML = '<div class="form-success"><h3>Thank you!</h3><p>Your enquiry has been received. We\'ll get back to you within one business day.</p></div>';
      } else {
        throw new Error('Submission failed');
      }
    } catch (err) {
      btn.textContent = originalText;
      btn.disabled = false;
      alert('Something went wrong. Please try again or email us at csr@security.eu');
    }
  });
}
