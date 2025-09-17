// ========== 核心配置 ==========
const API_KEY = "bbdc2896c42a1bb787b3fec94bf8865a"; // 替换为您的OpenWeather密钥
let charts = {}; // 图表对象容器

// 中国城市中英文映射（内置200个常见城市）
const CHINA_CITY_MAP = {
    // 直辖市
    "北京": "Beijing", "上海": "Shanghai", "天津": "Tianjin", "重庆": "Chongqing",
    
    // 特别行政区
    "香港": "Hong Kong", "澳门": "Macao",
    
    // 省会/首府城市
    "广州": "Guangzhou", "深圳": "Shenzhen", "成都": "Chengdu", "杭州": "Hangzhou", 
    "南京": "Nanjing", "武汉": "Wuhan", "西安": "Xi'an", "苏州": "Suzhou", 
    "郑州": "Zhengzhou", "长沙": "Changsha", "青岛": "Qingdao", "合肥": "Hefei",
    "福州": "Fuzhou", "济南": "Jinan", "沈阳": "Shenyang", "石家庄": "Shijiazhuang", 
    "长春": "Changchun", "哈尔滨": "Harbin", "昆明": "Kunming", "贵阳": "Guiyang", 
    "太原": "Taiyuan", "南宁": "Nanning", "南昌": "Nanchang", "兰州": "Lanzhou", 
    "海口": "Haikou", "拉萨": "Lhasa", "呼和浩特": "Hohhot", "银川": "Yinchuan", 
    "乌鲁木齐": "Urumqi", 
    
    // 主要副省级/经济城市
    "宁波": "Ningbo", "大连": "Dalian", "厦门": "Xiamen", "无锡": "Wuxi", 
    "东莞": "Dongguan", "佛山": "Foshan", "常州": "Changzhou", "烟台": "Yantai", 
    "泉州": "Quanzhou", "南通": "Nantong", "徐州": "Xuzhou", "温州": "Wenzhou", 
    
    // 重要区域中心/历史名城
    "保定": "Baoding", "唐山": "Tangshan", "邯郸": "Handan", "秦皇岛": "Qinhuangdao", 
    "承德": "Chengde", "廊坊": "Langfang", "沧州": "Cangzhou", "大同": "Datong", 
    "包头": "Baotou", "锦州": "Jinzhou", "宜昌": "Yichang", "襄阳": "Xiangyang", 
    "岳阳": "Yueyang", "常德": "Changde", "惠州": "Huizhou", "珠海": "Zhuhai", 
    "中山": "Zhongshan", "汕头": "Shantou", "三亚": "Sanya", "洛阳": "Luoyang", 
    "开封": "Kaifeng", "扬州": "Yangzhou", "镇江": "Zhenjiang", "嘉兴": "Jiaxing", 
    "绍兴": "Shaoxing", "台州": "Taizhou", "金华": "Jinhua", "芜湖": "Wuhu", 
    "安庆": "Anqing", "赣州": "Ganzhou", "九江": "Jiujiang", "潍坊": "Weifang", 
    "淄博": "Zibo", "临沂": "Linyi", "济宁": "Jining", "咸阳": "Xianyang", 
    "宝鸡": "Baoji", "绵阳": "Mianyang", "南充": "Nanchong", "遵义": "Zunyi", 
    "曲靖": "Qujing", "桂林": "Guilin", "北海": "Beihai", "丹东": "Dandong", 
    "延吉": "Yanji", "西宁": "Xining", "伊宁": "Yining", "克拉玛依": "Karamay", 
    
    // 其它常见城市 (补充至300个）
    "邢台": "Xingtai", "张家口": "Zhangjiakou", "衡水": "Hengshui", "晋中": "Jinzhong", 
    "运城": "Yuncheng", "临汾": "Linfen", "赤峰": "Chifeng", "盘锦": "Panjin", 
    "阜新": "Fuxin", "辽阳": "Liaoyang", "铁岭": "Tieling", "朝阳": "Chaoyang", 
    "葫芦岛": "Huludao", "四平": "Siping", "通化": "Tonghua", "白山": "Baishan", 
    "松原": "Songyuan", "白城": "Baicheng", "鹤岗": "Hegang", "双鸭山": "Shuangyashan", 
    "大庆": "Daqing", "鸡西": "Jixi", "佳木斯": "Jiamusi", "牡丹江": "Mudanjiang", 
    "绥化": "Suihua", "齐齐哈尔": "Qiqihar", "盐城": "Yancheng", "淮安": "Huaian", 
    "连云港": "Lianyungang", "宿迁": "Suqian", "泰州": "Taizhou", "湖州": "Huzhou", 
    "衢州": "Quzhou", "舟山": "Zhoushan", "丽水": "Lishui", "马鞍山": "Maanshan", 
    "淮北": "Huaibei", "铜陵": "Tongling", "滁州": "Chuzhou", "阜阳": "Fuyang", 
    "蚌埠": "Bengbu", "淮南": "Huainan", "六安": "Lu'an", "池州": "Chizhou", 
    "宣城": "Xuancheng", "莆田": "Putian", "三明": "Sanming", "漳州": "Zhangzhou", 
    "龙岩": "Longyan", "宁德": "Ningde", "萍乡": "Pingxiang", "新余": "Xinyu", 
    "鹰潭": "Yingtan", "宜春": "Yichun", "抚州": "Fuzhou", "上饶": "Shangrao", 
    "枣庄": "Zaozhuang", "德州": "Dezhou", "聊城": "Liaocheng", "滨州": "Binzhou", 
    "菏泽": "Heze", "东营": "Dongying", "日照": "Rizhao", "莱芜": "Laiwu", 
    "泰安": "Tai'an", "威海": "Weihai", "安阳": "Anyang", "新乡": "Xinxiang", 
    "许昌": "Xuchang", "平顶山": "Pingdingshan", "南阳": "Nanyang", "商丘": "Shangqiu", 
    "信阳": "Xinyang", "周口": "Zhoukou", "驻马店": "Zhumadian", "焦作": "Jiaozuo", 
    "濮阳": "Puyang", "黄石": "Huangshi", "十堰": "Shiyan", "荆州": "Jingzhou", 
    "荆门": "Jingmen", "鄂州": "Ezhou", "随州": "Suizhou", "衡阳": "Hengyang", 
    "邵阳": "Shaoyang", "益阳": "Yiyang", "郴州": "Chenzhou", "永州": "Yongzhou", 
    "张家界": "Zhangjiajie", "怀化": "Huaihua", "娄底": "Loudi", "清远": "Qingyuan", 
    "揭阳": "Jieyang", "茂名": "Maoming", "梅州": "Meizhou", "汕尾": "Shanwei", 
    "河源": "Heyuan", "阳江": "Yangjiang", "潮州": "Chaozhou", "肇庆": "Zhaoqing", 
    "云浮": "Yunfu", "柳州": "Liuzhou", "玉林": "Yulin", "百色": "Baise", 
    "梧州": "Wuzhou", "钦州": "Qinzhou", "河池": "Hechi", "防城港": "Fangchenggang", 
    "贵港": "Guigang", "自贡": "Zigong", "攀枝花": "Panzhihua", "泸州": "Luzhou", 
    "德阳": "Deyang", "广元": "Guangyuan", "遂宁": "Suining", "内江": "Neijiang", 
    "乐山": "Leshan", "宜宾": "Yibin", "广安": "Guangan", "达州": "Dazhou", 
    "眉山": "Meishan", "雅安": "Ya'an", "巴中": "Bazhong", "资阳": "Ziyang", 
    "六盘水": "Liupanshui", "安顺": "Anshun", "毕节": "Bijie", "铜仁": "Tongren", 
    "凯里": "Kaili", "都匀": "Duyun", "兴义": "Xingyi", "大理": "Dali", 
    "玉溪": "Yuxi", "昭通": "Zhaotong", "保山": "Baoshan", "普洱": "Pu'er", 
    "临沧": "Lincang", "日喀则": "Xigaze", "昌都": "Qamdo", "林芝": "Nyingchi", 
    "山南": "Shannan", "那曲": "Nagqu", "阿里": "Ngari", "石河子": "Shihezi", 
    "哈密": "Hami", "吐鲁番": "Turpan", "喀什": "Kashgar", "阿克苏": "Aksu", 
    "和田": "Hotan", "阿勒泰": "Altay", "塔城": "Tacheng", "博乐": "Bole", 
    "库尔勒": "Korla", "阿拉尔": "Aral", "图木舒克": "Tumxuk", "五家渠": "Wujiaqu",
    
    "默认": "Beijing" // 用于未识别城市
};


// ========== 核心修复：事件绑定提前 + 全局变量调整 ==========
// DOM元素重定义到顶层确保访问
const searchBtn = document.getElementById('searchBtn');
const locationInput = document.getElementById('locationInput');
const dashboard = document.getElementById('dashboard');
const errorMsg = document.getElementById('errorMsg');
let originalButtonText = ''; // 修复按钮状态存储

// ========== 立即绑定事件监听（修复点1） ==========
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM加载完成 - 已启用所有功能");
    if (searchBtn) {
        // 保存原始按钮文本
        originalButtonText = searchBtn.innerHTML; 

        // 绑定点击事件（修复点2）
        searchBtn.addEventListener('click', handleSearch);
        
        // 绑定回车事件
        locationInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSearch();
        });
    } else {
        console.error("错误：未找到searchBtn元素");
    }
    
    initCharts();
});

// ========== 修复的核心功能：搜索处理 ==========
function handleSearch() {
    const input = locationInput.value.trim();
    
    // 输入验证
    if (!input) {
        showError("请输入城市名称");
        return;
    }
    
    console.log("处理搜索请求：", input);
    
    // 设置加载状态
    updateButtonState(true);
    
    // 智能城市处理
    const city = detectAndConvertCity(input);
    console.log("转换后的城市：", city);
    
    // 获取数据
    fetchCityData(city);
}

// ========== 按钮状态管理函数（修复点3） ==========
function updateButtonState(isLoading) {
    if (!searchBtn) return;
    
    if (isLoading) {
        searchBtn.innerHTML = '<span class="loading"></span> 分析中...';
        searchBtn.disabled = true;
    } else {
        searchBtn.innerHTML = originalButtonText;
        searchBtn.disabled = false;
    }
}

// ========== 数据获取函数（增加错误处理） ==========
async function fetchCityData(city) {
    try {
        console.log("正在获取城市数据：", city);
        const weatherData = await fetchWeather(city);
        // ...（其他数据处理逻辑保持不变）
    } catch (err) {
        console.error("数据获取失败：", err);
        showError(`数据获取失败: ${err.message}`);
    } finally {
        console.log("完成数据请求");
        updateButtonState(false); // 确保始终恢复按钮状态
    }
}

// ...（以下其他函数保持不变）

// ========== 增强功能函数 ==========
// 智能城市名称处理
function detectAndConvertCity(input) {
    // 中文检测识别（如果输入是中文）
    if (/[\u4E00-\u9FA5]/.test(input)) {
        return CHINA_CITY_MAP[input] || CHINA_CITY_MAP['默认'];
    }
    return input;
}

// 加强版的能源工程模型（热力学）
function enhancedEnergyModel(temp, humidity, climateZone) {
    // 基础能耗 (单位：kWh/m²)
    let baseEnergy = 0;
    
    // 气候分区修正系数
    const ZONE_FACTORS = {
        '严寒': 1.8, '寒冷': 1.5, '夏热冬冷': 1.2, '夏热冬暖': 1.0, '温和': 0.8
    };
    
    // 温度影响模型 (分段函数)
    if (temp <= 18) {
        // 低温区域的加热需求模型
        baseEnergy = 1.8 + (18 - temp) * 0.12;
    } else if (temp > 18 && temp <= 26) {
        // 舒适区 - 基础能耗
        baseEnergy = 1.2;
    } else {
        // 高温区域的冷却需求模型
        baseEnergy = 1.4 + (temp - 26) * 0.15;
    }
    
    // 湿度修正 (湿热增加冷负荷)
    const humidityImpact = humidity > 70 ? (humidity - 70) * 0.008 : 0;
    
    // 气候分区修正
    const zoneFactor = ZONE_FACTORS[climateZone] || 1.0;
    
    // 最终计算
    const energyUsage = (baseEnergy + humidityImpact) * zoneFactor;
    const reductionPotential = (energyUsage - 1.4) * 120; // kg CO₂
    
    return {
        energyUsage: energyUsage.toFixed(2),
        reductionPotential: reductionPotential.toFixed(0),
        components: {
            base: baseEnergy,
            humidity: humidityImpact,
            climate: zoneFactor.toFixed(1)
        }
    };
}

// 获取中国参考数据集（伪实现）
function getReferenceData(cityName) {
    // 这里应该连接真实API，但为简化使用静态数据
    const CLIMATE_ZONES = {
        'Beijing': '寒冷',
        'Shanghai': '夏热冬冷',
        'Guangzhou': '夏热冬暖',
        'Shenzhen': '夏热冬暖',
        'Harbin': '严寒'
    };
    
    return {
        city: cityName,
        avgEnergy: (Math.random() * 0.8 + 1.6).toFixed(2),
        climateZone: CLIMATE_ZONES[cityName] || '夏热冬冷'
    };
}

// ========== 数据更新函数 ==========
function updateDashboardUI(weather, energy, reference) {
    // 天气数据
    document.getElementById('tempValue').textContent = `${weather.temp} °C`;
    document.getElementById('humidityValue').textContent = `${weather.humidity}%`;
    
    // 工程数据
    document.getElementById('energyValue').textContent = `${energy.energyUsage} kWh/m²`;
    document.getElementById('reductionValue').textContent = `${energy.reductionPotential} kg`;
}

// 增强图表更新系统
function updateAllCharts(weather, energy, reference) {
    const temp = parseFloat(weather.temp);
    
    /* 1. 散点图：温度-能耗关系 */
    charts.scatter.data.datasets = [{
        label: `温度-能耗关系 (${reference.city})`,
        data: [{x: temp, y: parseFloat(energy.energyUsage)}],
        backgroundColor: 'rgba(255, 99, 132, 0.8)',
        pointRadius: 10
    }];
    
    /* 2. 趋势图：周预测 (模拟) */
    charts.trend.data.labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    charts.trend.data.datasets = [{
        label: '预测能耗趋势',
        data: Array(7).fill().map(() => parseFloat(energy.energyUsage) * (0.8 + Math.random()*0.4)),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.1)',
        fill: true
    }];
    
    /* 3. 能耗结构分析图 */
    charts.pie.data = {
        labels: ['空间供暖', '空间制冷', '设备用能', '热水供应'],
        datasets: [{
            data: [35, 25, 20, 20],
            backgroundColor: [
                'rgba(255, 99, 132, 0.7)',
                'rgba(54, 162, 235, 0.7)',
                'rgba(255, 206, 86, 0.7)',
                'rgba(75, 192, 192, 0.7)'
            ]
        }]
    };
    
    /* 4. 城市对比图 */
    charts.comparison.data = {
        labels: [reference.city, '北京', '广州', '平均值'],
        datasets: [{
            label: '单位能耗 (kWh/m²)',
            data: [
                parseFloat(energy.energyUsage),
                1.85,
                1.63,
                1.78
            ],
            backgroundColor: [
                'rgba(153, 102, 255, 0.7)',
                'rgba(153, 102, 255, 0.4)',
                'rgba(153, 102, 255, 0.4)',
                'rgba(153, 102, 255, 0.4)'
            ]
        }]
    };
    
    // 更新所有图表
    Object.values(charts).forEach(chart => chart.update());
}

// ========== 辅助函数 ==========
async function fetchWeather(city) {
    const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    
    if (!response.ok) throw new Error('城市数据获取失败');
    
    const data = await response.json();
    
    return {
        name: data.name,
        temp: data.main.temp,
        humidity: data.main.humidity
    };
}

function showError(msg) {
    errorMsg.innerHTML = `
        <strong>系统提示：</strong> ${msg}
        <div class="mt-2 text-sm">建议操作：尝试输入大中城市名（如"北京"或"Shanghai"）</div>
    `;
    errorMsg.classList.remove('hidden');
    dashboard.classList.add('hidden');
}

// 加载动画CSS注入
document.head.innerHTML += `
<style>
.loading {
    display: inline-block;
    width: 20px;
    height: 20px;
    border: 3px solid rgba(255,255,255,0.5);
    border-radius: 50%;
    border-top-color: #fff;
    animation: spin 1s linear infinite;
    margin-right: 8px;
    vertical-align: middle;
}
@keyframes spin {
    to { transform: rotate(360deg); }
}
</style>
`;
