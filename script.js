
    let startTime, endTime;

    function generateQuestion(operation, difficulty) {
      const maxLimit = Math.pow(10, parseInt(difficulty)) - 1;
      const minLimit = Math.pow(10, parseInt(difficulty) - 1);

      let num1, num2;

      switch (operation) {
        case 'addition':
          num1 = Math.floor(Math.random() * maxLimit);
          num2 = Math.floor(Math.random() * maxLimit);
          operator = '+'
          break;
        case 'subtraction':
          num1 = Math.floor(Math.random() * maxLimit);
          num2 = Math.floor(Math.random() * (num1 - minLimit)) + minLimit;
          operator = '-'
          break;
        case 'multiplication':
          num1 = Math.floor(Math.random() * (maxLimit - minLimit + 1)) + minLimit;
          num2 = Math.floor(Math.random() * (maxLimit - minLimit + 1)) + minLimit;
          operator = '*'
          break;
        case 'division':
          num2 = Math.floor(Math.random() * (maxLimit - minLimit + 1)) + minLimit;
          num1 = num2 * Math.floor(Math.random() * (maxLimit / num2 - minLimit / num2 + 1)) + minLimit;
          break;
        default:
          num1 = 90;
          num2 = 10;
      }
      const question = `${num1} ${operation === 'division' ? '÷' :operator} ${num2}`;
      document.getElementById('question').innerText = question;
      //localStorage.setItem('question',JSON.stringify(question));
      localStorage.setItem('answer', JSON.stringify(eval(question)));
      startTime = new Date().getTime();
    }


    function checkAnswer() {
      endTime = new Date().getTime();
      const userAnswer = parseInt(document.getElementById('userAnswer').value);
      const correctAnswer = parseInt(localStorage.getItem('answer'));
      question = document.getElementById('question').innerText;

      if (!isNaN(userAnswer)) {
        const timeTaken = (endTime - startTime) / 1000; // Calculate time in seconds
        document.getElementById('timeTaken').innerText = `Time taken: ${timeTaken.toFixed(2)} seconds`;
        document.getElementById('result').style.color = userAnswer === correctAnswer ? 'green' : 'red';

        if (userAnswer === correctAnswer) {
          document.getElementById('result').innerText = 'Correct!';
        } else {
          document.getElementById('result').innerText = 'Incorrect. Try again!';
        }

        const previousAnswers = localStorage.getItem('previousAnswers') ? JSON.parse(localStorage.getItem('previousAnswers')) : [];
        const isCorrect = userAnswer == correctAnswer ? true : false;

        previousAnswers.push({ question, userAnswer, correctAnswer, timeTaken: timeTaken.toFixed(2), isCorrect });
        localStorage.setItem('previousAnswers', JSON.stringify(previousAnswers));
        displayPreviousAnswers();
      } else {
        document.getElementById('result').innerText = 'Please enter a valid number!';
      }

      document.getElementById('userAnswer').value = '';
      generateQuestion(
        document.getElementById('operation').value,
        document.getElementById('difficulty').value
      );
      updateProgressBar()
    }

    function displayPreviousAnswers() {
      const previousAnswers = localStorage.getItem('previousAnswers');
      if (previousAnswers) {
        const answers = JSON.parse(previousAnswers);
        const previousAnswersDiv = document.getElementById('previousAnswers');
        previousAnswersDiv.innerHTML = '<h2>Previous Answers:</h2>';
        answers.forEach((answer, index) => {
          color = answer.userAnswer == answer.correctAnswer ? 'green' : 'red';
          previousAnswersDiv.innerHTML += `<div><p>Question#${index + 1}: ${answer.question}</p> <p>Correct answer : ${answer.correctAnswer},</p><p> Time taken : ${answer.timeTaken} seconds</p><p style="color:${color}">your answer = ${answer.userAnswer}</p></div>`;
        });
      }
    }


    generateQuestion('addition', 1);
    displayPreviousAnswers();

    function togglePreviousAnswers() {
      const previousAnswersDiv = document.getElementById('previousAnswers');
      if (previousAnswersDiv.style.display === 'none') {
        previousAnswersDiv.style.display = 'flex';
      } else {
        previousAnswersDiv.style.display = 'none';
      }
    }

    function clearPreviousAnswers() {
      localStorage.removeItem('previousAnswers');
      document.getElementById('previousAnswers').innerHTML = '<h2>Previous Answers:</h2>';
    }

    // Function to calculate success rate based on last 25 answers
    function calculateSuccessRate() {

      const previousAnswers = JSON.parse(localStorage.getItem('previousAnswers')) || [];
      const correctAnswers = previousAnswers.filter(answer => answer.isCorrect).length;
      const successRate = (correctAnswers / 15) * 100; // Assuming 25 is the total questions
      return successRate;
    }

    // Function to update the progress bar width
    function updateProgressBar() {
      const successRate = calculateSuccessRate();
      const successProgressBar = document.getElementById('successProgressBar');
      successProgressBar.style.width = `${successRate}%`;
      // Clear previous answers after every 25 answers
      const previousAnswers = JSON.parse(localStorage.getItem('previousAnswers')) || [];
      if (previousAnswers.length % 15 === 0) {
        successRate > 0 ? alert(`Congratulation,your success rate is ${successRate.toFixed(2)}, over last 15 question,all previousAnswers will be cleared`) : console.warn('no previous answers');

        clearPreviousAnswers()


      }
    }


