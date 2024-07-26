document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    const contactsList = document.getElementById('contacts-list');
    let editingContactId = null;
  
    // Fetch and display contacts
    function fetchContacts() {
      fetch('/api/contacts')
        .then(response => response.json())
        .then(data => {
          contactsList.innerHTML = '';
          data.data.forEach(contact => {
            const li = document.createElement('li');
            li.classList.add('mb-2', 'p-2', 'border-b', 'border-gray-200', 'flex', 'justify-between', 'items-center');
            li.innerHTML = `
              <span>
                <strong>${contact.name}</strong><br>
                ${contact.email}<br>
                ${contact.phone}
              </span>
              <span>
                <button class="edit-btn bg-yellow-500 text-white px-2 py-1 rounded" data-id="${contact.id}">Edit</button>
                <button class="delete-btn bg-red-500 text-white px-2 py-1 rounded" data-id="${contact.id}">Delete</button>
              </span>
            `;
            contactsList.appendChild(li);
          });
        });
    }
  
    // Add or update contact
    contactForm.addEventListener('submit', function(event) {
      event.preventDefault();
      const formData = new FormData(contactForm);
      const contact = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone')
      };
  
      if (editingContactId) {
        fetch(`/api/contact/${editingContactId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(contact)
        })
        .then(response => response.json())
        .then(data => {
          fetchContacts();
          contactForm.reset();
          editingContactId = null;
        });
      } else {
        fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(contact)
        })
        .then(response => response.json())
        .then(data => {
          fetchContacts();
          contactForm.reset();
        });
      }
    });
  
    // Edit contact
    contactsList.addEventListener('click', function(event) {
      if (event.target.classList.contains('edit-btn')) {
        const id = event.target.getAttribute('data-id');
        fetch(`/api/contact/${id}`)
          .then(response => response.json())
          .then(data => {
            document.getElementById('name').value = data.data.name;
            document.getElementById('email').value = data.data.email;
            document.getElementById('phone').value = data.data.phone;
            editingContactId = id;
          });
      }
  
      // Delete contact
      if (event.target.classList.contains('delete-btn')) {
        const id = event.target.getAttribute('data-id');
        fetch(`/api/contact/${id}`, { method: 'DELETE' })
          .then(response => response.json())
          .then(data => {
            fetchContacts();
          });
      }
    });
  
    fetchContacts();
  });
  