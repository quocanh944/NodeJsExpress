var salesChart;
var profitChart;

$(function () {
  function cb(start, end) {
    console.log(start, end)
    $('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
    loadSalesData(start, end);
    loadProfitData(start, end);
  }

  $('#reportrange').daterangepicker({
    startDate: moment().startOf('day'),
    endDate: moment().endOf('day'),
    ranges: {
      'Today': [moment().startOf('day'), moment().endOf('day')],
      'Yesterday': [moment().subtract(1, 'days').startOf('day'), moment().subtract(1, 'days').endOf('day')],
      'Last 7 Days': [moment().subtract(6, 'days'), moment()],
      'This Month': [moment().startOf('month'), moment().endOf('month')]
    }
  }, cb);

  cb(moment().startOf('day'), moment().endOf('day'));
});


async function loadSalesData(start, end) {
  try {
    const response = await axios.get('/statistic/sales-data', {
      params: {
        startDate: start.format('YYYY-MM-DD'),
        endDate: end.format('YYYY-MM-DD')
      }
    });
    console.log(response)
    const data = response.data;
    renderChart(data);
  } catch (error) {
    console.error('Error loading sales data:', error);
  }
}

function loadDashboardData() {
  axios.get('/statistic/dashboard')
    .then(function (response) {
      console.log(response)
      const data = response.data.data;

      if (data) {
        renderDashboardData(data);
      }
    })
    .catch(function (error) {
      console.error('Error loading dashboard data:', error);
    });
}

function renderDashboardData({ numberOfProducts, numberOfOrders, numberOfCustomers, numberOfUnreadNotifications }) {
  let arrCategoryTitle = ['Products', 'Orders', 'Customers', 'Alerts']
  let arrCategory = [numberOfProducts, numberOfOrders, numberOfCustomers, numberOfUnreadNotifications]
  let contentHTML = "";
  for (let i = 0; i < 4; i++) {
    contentHTML += `
      <div class="card">
        <div class="card-inner">
          <h3>${arrCategoryTitle[i]}</h3>
          <span class="material-icons-outlined">inventory_2</span>
        </div>
        <h1>${arrCategory[i]}</h1>
      </div>
    `;
  }
  document.querySelector('.main-cards').innerHTML = contentHTML;
}
function renderChart(data) {
  const barChartOptions = {
    series: [
      {
        data: [data.totalAmount / 10000, data.numberOfOrders, data.numberOfProducts],
        name: 'Products',
      },
    ],
    chart: {
      type: 'bar',
      background: 'transparent',
      height: 350,
      toolbar: {
        show: true,
      },
    },
    colors: ['#2962ff', '#d50000', '#2e7d32'],
    plotOptions: {
      bar: {
        distributed: true,
        borderRadius: 4,
        horizontal: false,
        columnWidth: '40%',
      },
    },
    dataLabels: {
      enabled: false,
    },
    fill: {
      opacity: 1,
    },
    grid: {
      borderColor: '#55596e',
      yaxis: {
        lines: {
          show: true,
        },
      },
      xaxis: {
        lines: {
          show: true,
        },
      },
    },
    legend: {
      labels: {
        colors: '#f5f7ff',
      },
      show: true,
      position: 'top',
    },
    stroke: {
      colors: ['transparent'],
      show: true,
      width: 2,
    },
    tooltip: {
      shared: true,
      intersect: false,
      theme: 'dark',
    },
    xaxis: {
      categories: ['Total Amount (10K $)', 'Orders', 'Products'],
      title: {
        style: {
          color: '#f5f7ff',
        },
      },
      axisBorder: {
        show: true,
        color: '#55596e',
      },
      axisTicks: {
        show: true,
        color: '#55596e',
      },
      labels: {
        style: {
          colors: '#f5f7ff',
        },
      },
    },
    yaxis: {
      title: {
        text: 'Count',
        style: {
          color: '#f5f7ff',
        },
      },
      axisBorder: {
        color: '#55596e',
        show: true,
      },
      axisTicks: {
        color: '#55596e',
        show: true,
      },
      labels: {
        style: {
          colors: '#f5f7ff',
        },
      },
    },
  };
  if (salesChart) {
    // salesChart.destroy();
    salesChart.updateSeries([{
      data: [data.totalAmount / 10000, data.numberOfOrders, data.numberOfProducts]
    }]);
  }
  else {
    salesChart = new ApexCharts(document.querySelector("#sales-chart"), barChartOptions);
    salesChart.render();
  }
}

function loadProfitData(start = moment('2023-10-01'), end = moment('2023-12-31')) {
  axios.get('/statistic/profit', {
    params: {
      startDate: start.format('YYYY-MM-DD'),
      endDate: end.format('YYYY-MM-DD')
    }
  })
    .then(response => {
      console.log(response)
      const profitData = response.data;
      renderProfitChart(profitData);
    })
    .catch(error => {
      console.error('Error loading profit data:', error);
    });
}

function renderProfitChart(profitData) {
  const dates = profitData?.map(item => item.date);
  const profits = profitData?.map(item => item.profit);
  const options = {
    series: [{
      name: 'Daily Profit',
      data: profits
    }],
    chart: {
      type: 'area',
      background: 'transparent',
      height: 350,
      stacked: false,
      toolbar: {
        show: true,
      },
    },
    colors: ['#00ab57'],
    dataLabels: {
      enabled: false,
    },
    fill: {
      gradient: {
        opacityFrom: 0.4,
        opacityTo: 0.1,
        shadeIntensity: 1,
        stops: [0, 100],
        type: 'vertical',
      },
      type: 'gradient',
    },
    grid: {
      borderColor: '#55596e',
      yaxis: {
        lines: {
          show: true,
        },
      },
      xaxis: {
        lines: {
          show: true,
        },
        categories: dates,
        type: 'datetime'
      },
    },
    legend: {
      labels: {
        colors: '#f5f7ff',
      },
      show: true,
      position: 'top',
    },
    markers: {
      size: 6,
      strokeColors: '#1b2635',
      strokeWidth: 3,
    },
    stroke: {
      curve: 'smooth',
    },
    xaxis: {
      axisBorder: {
        color: '#55596e',
        show: true,
      },
      axisTicks: {
        color: '#55596e',
        show: true,
      },
      labels: {
        offsetY: 5,
        style: {
          colors: '#f5f7ff',
        },
      },
    },
    yaxis: {
      title: {
        text: 'Daily Profit',
        style: {
          color: '#f5f7ff',
        },
      },
      labels: {
        style: {
          colors: '#f5f7ff',
        },
      },
    },
    tooltip: {
      shared: true,
      intersect: false,
      theme: 'dark',
    }
  };

  if (profitChart) {
    profitChart.updateOptions({
      series: [{
        data: profits
      }],
      xaxis: {
        categories: dates
      }
    }, true, true);
  }
  else {
    profitChart = new ApexCharts(document.querySelector("#profit-chart"), options);
    profitChart.render();
  }

}

document.addEventListener('DOMContentLoaded', () => {
  loadDashboardData();
})

