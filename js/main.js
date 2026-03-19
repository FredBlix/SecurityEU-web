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

// Contact form submission to Tally
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = contactForm.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = 'Sending...';
    btn.disabled = true;

    const formData = {
      data: {
        '4ef6cd40-194a-4962-9860-7eda118466de': contactForm.querySelector('#first-name').value,
        'efeec5b1-680d-4d20-b924-82a055d3fc8b': contactForm.querySelector('#last-name').value,
        '7c893713-58d2-4dff-a340-f0a59343e568': contactForm.querySelector('#email').value,
        'b052de0b-ec94-4912-adf4-3bad98ab024c': contactForm.querySelector('#phone').value || '',
        '364df046-7065-45a5-8103-ca01f7b42023': contactForm.querySelector('#message') ? contactForm.querySelector('#message').value : ''
      }
    };

    // Service interest: use dropdown if present, otherwise use data-service attribute
    const serviceSelect = contactForm.querySelector('#service');
    const serviceValue = serviceSelect ? serviceSelect.value : contactForm.dataset.service;
    if (serviceValue) {
      formData.data['b85701bb-fd0a-476a-be0a-c2df7f0376fe'] = serviceValue;
    }

    try {
      const res = await fetch('https://api.tally.so/v1/forms/LZ0pbG/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer tly-BWb8DouRZI7U1K6bjOdefH9VR0clPr62'
        },
        body: JSON.stringify(formData)
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
