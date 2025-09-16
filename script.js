// DOM元素引用
const searchBtn = document.getElementById('searchBtn');
const locationInput = document.getElementById('locationInput');
const dashboard = document.getElementById('dashboard');
const errorMsg = document.getElementById('errorMsg');

// 模拟API密钥 (实际使用时替换为您的OpenWeather密钥)
const API_KEY = "bbdc2896c42a1bb787b3fec94bf8865a"; // 注册地址: https://home.openweathermap.org/api_keys

// 初始化图表
const ctx = document.getElementById('energyChart').getContext('2d');
let energyChart = null;

// 点击事件：触发数据获取
searchBtn.addEventListener('click', () => {
    const location = locationInput.value.trim();
    if (!location) {
        showError("请输入有效位置");
        return;
    }
    fetchWeatherData(location);
});

// 获取天气数据 + 能耗计算
async function fetchWeatherData(city) {
    try {
        // 调用OpenWeather API (免费版示例)
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`
        );
        
        if (!response.ok) throw new Error("城市未找到或API错误");
        
        const data = await response.json();
        
        // 处理数据
        const tempCelsius = (data.main.temp - 273.15).toFixed(1); // 开尔文→摄氏
        const humidity = data.main.humidity;
        
        // 关键步骤：调用您的工程知识模型 （示例公式）
        const energyUsage = calculateEnergyImpact(tempCelsius, humidity);
        
        // 更新UI
        updateDashboard(tempCelsius, humidity, energyUsage);
        renderChart(tempCelsius, energyUsage);
        
        // 隐藏错误/展示数据区
        dashboard.classList.remove('hidden');
        errorMsg.classList.add('hidden');
        
    } catch (err) {
        showError(`查询失败: ${err.message}`);
    }
}

// 能耗计算模型 (您的专业领域！)
function calculateEnergyImpact(temp, humidity) {
    // 公式说明：基础能耗 2kWh + 温度影响系数 + 湿度补偿
    const baseEnergy = 2.0; 
    const tempImpact = temp > 25 ? (temp - 25) * 0.15 : 0; // 高温显著增加能耗
    const humidityImpact = humidity > 70 ? 0.3 : 0;        // 高湿度加大制冷负担
    return (baseEnergy + tempImpact + humidityImpact).toFixed(1);
}

// 刷新仪表板数据
function updateDashboard(temp, humidity, energy) {
    document.getElementById('tempValue').textContent = `${temp} °C`;
    document.getElementById('humidityValue').textContent = `${humidity}%`;
    document.getElementById('energyValue').textContent = `${energy} kWh`;
}

// 绘制图表 (使用Chart.js)
function renderChart(temp, energy) {
    // 销毁旧图表避免重叠
    if (energyChart) energyChart.destroy();
    
    energyChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['能源影响指数'],
            datasets: [
                {
                    label: `温度: ${temp}°C`,
                    data: [energy],
                    backgroundColor: 'rgba(16, 185, 129, 0.6)',
                }
            ]
        },
        options: {
            scales: { y: { beginAtZero: true } },
            plugins: {
                title: {
                    display: true,
                    text: '温度对能耗的影响趋势',
                    font: { size: 16 }
                }
            }
        }
    });
}

// 错误处理
function showError(message) {
    errorMsg.textContent = message;
    errorMsg.classList.remove('hidden');
    dashboard.classList.add('hidden');
}
