$.post("/api/visitorData", function (responseData) {
  const ctx = $("#myChart");
  const visitorData = responseData.data.reverse();
  const labels = [];
  const data = [];
  for (let i = 0; i < visitorData.length; i++) {
    labels.push(visitorData[i].date);
    data.push(visitorData[i].count);
  }
  new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Visitors",
          data,
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
});
