function app () {
  const sendMessageButton = document.getElementById('sendMessage');
  const userMessageText = document.getElementById('userMessage');
  const chartCtx = document.getElementById('myChart');
  let myLineChart;

  userMessageText.onkeydown = function(e){
    if (e.key === 'Enter') {
      messageHander();
    }
  };

  sendMessageButton.addEventListener('click', (evt) => {
    evt.preventDefault();

    messageHander();

  });

  function messageHander() {
    // If send is pressed and nothing is in the input, it does nothing
    const userMessageTextValue = userMessageText.value;

    if (userMessageTextValue.trim().length < 1) {
      return;
    }

    // reset the input
    userMessageText.value = '';

    // Send to the server
    sendToServer(userMessageTextValue);
  }

  function createChart(temperatureData) {
    // Create the chart from the data
    if (myLineChart) {
      myLineChart.destroy();
    }

    myLineChart = new Chart(chartCtx, {
      type: 'line',
      data: {
        labels: temperatureData.hourly.time,
        datasets: [{
          label: 'Temperatures',
          data: temperatureData.hourly.temperature_2m,
          borderWidth: 1
        }]
      },
      options: {
      }
    });
  }

  async function sendToServer(city) {
    const result = await fetch('/api/temperatures', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        city: city
      })
    });

    const jsonResult = await result.json();
    createChart(jsonResult.result);
  }
}

app();