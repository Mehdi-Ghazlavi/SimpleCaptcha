class EnhancedTextCaptcha {
    constructor(formId) {
        this.form = document.getElementById(formId);
        this.challenge = null;
        this.answer = null;
        this.captchaContainer = null;
        this.inputField = null;
        this.feedbackMessage = null;

        this.initCaptcha();
    }

    initCaptcha() {
        if (!this.form) return;

        // Create CAPTCHA container (a div that holds both word and input)
        this.captchaContainer = document.createElement('div');
        this.captchaContainer.id = 'captcha-container';
        this.captchaContainer.style.display = 'flex';  // Flex container for captcha word and input
        this.captchaContainer.style.alignItems = 'center'; // Vertically align them
        this.captchaContainer.style.gap = '10px'; // Set the gap between the captcha word and input
        this.captchaContainer.style.marginBottom = '10px';
        this.captchaContainer.style.marginTop = '10px';

        // Create the CAPTCHA word (this will be displayed as the challenge)
        const wordElement = document.createElement('div');
        this.generateTextChallenge();
        wordElement.textContent = this.challenge;
        wordElement.style.fontSize = `${Math.floor(Math.random() * (30 - 20 + 1)) + 20}px`;
        wordElement.style.color = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
        wordElement.style.fontFamily = 'Arial, sans-serif';
        wordElement.style.userSelect = 'none';
        wordElement.style.backgroundColor = this.generateRandomBackground();
        wordElement.style.height = '40px';  // Set equal height for both elements
        wordElement.style.display = 'flex';
        wordElement.style.alignItems = 'center';
        wordElement.style.justifyContent = 'center';
        wordElement.style.padding = '0 10px';
        wordElement.style.borderRadius = '5px';
        wordElement.style.width = '40%';

        // Add the word element to the container
        this.captchaContainer.appendChild(wordElement);

        // Create the input field
        this.inputField = document.createElement('input');
        this.inputField.type = 'text';
        this.inputField.id = 'captcha-input';
        this.inputField.placeholder = 'Enter CAPTCHA';
        this.inputField.style.height = '40px';  // Set the same height for input
        this.inputField.style.padding = '0 10px';
        this.inputField.style.width = '150px';
        this.inputField.required = true;
        this.inputField.style.width = "60%";

        // Add the input field to the container
        this.captchaContainer.appendChild(this.inputField);

        // Feedback message area
        this.feedbackMessage = document.createElement('div');
        this.feedbackMessage.style.textAlign = 'center';
        this.feedbackMessage.style.fontSize = '14px';
        this.feedbackMessage.style.marginTop = '10px';

        // Insert the CAPTCHA container, input field, and feedback message before the submit button
        const submitButton = this.form.querySelector('button[type="submit"]');
        if (submitButton) {
            this.form.insertBefore(this.captchaContainer, submitButton);
            this.form.insertBefore(this.feedbackMessage, submitButton);
        } else {
            console.error("Submit button not found.");
        }

        // Add event listener to the form submit event
        this.form.addEventListener('submit', (event) => this.handleFormSubmit(event));
    }

    generateTextChallenge() {
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        const wordLength = Math.floor(Math.random() * 3) + 4;
        let randomWord = "";
        for (let i = 0; i < wordLength; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            randomWord += characters[randomIndex];
        }
        this.challenge = randomWord;
        this.answer = randomWord;
    }

    generateRandomBackground() {
        const colors = ['#FF5733', '#33FF57', '#5733FF', '#F0E68C', '#FF1493', '#32CD32', '#8A2BE2'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    handleFormSubmit(event) {
        event.preventDefault();

        if (!this.inputField.value.trim()) {
            this.showFeedback('Please enter the CAPTCHA text.', 'red');
            return;
        }

        if (this.validateResponse(this.inputField.value)) {
            this.showFeedback('CAPTCHA validated successfully!', 'green');
            setTimeout(() => this.form.submit(), 500); // Allow user to read feedback before form submission
        } else {
            this.showFeedback('Incorrect CAPTCHA, please try again.', 'red');
            setTimeout(() => {
                // Regenerate the CAPTCHA after a short delay to give user feedback first
                this.generateTextChallenge();
                this.renderCaptcha();
                this.inputField.value = ''; // Clear the input field
            }, 1500); // Wait for 1.5 seconds before regenerating the CAPTCHA
        }
    }

    validateResponse(userInput) {
        return userInput.trim().toUpperCase() === this.answer.toUpperCase();
    }

    showFeedback(message, color) {
        this.feedbackMessage.textContent = message;
        this.feedbackMessage.style.color = color;
    }

    renderCaptcha() {
        // Clear the current CAPTCHA and render a new one
        const wordElement = this.captchaContainer.querySelector('div');
        wordElement.textContent = this.challenge;
        wordElement.style.fontSize = `${Math.floor(Math.random() * (30 - 20 + 1)) + 20}px`;
        wordElement.style.color = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
        wordElement.style.backgroundColor = this.generateRandomBackground();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const captchaForms = document.querySelectorAll('[data-captcha-id]');
    captchaForms.forEach(form => {
        const formId = form.getAttribute('data-captcha-id');
        new EnhancedTextCaptcha(formId);
    });
});
