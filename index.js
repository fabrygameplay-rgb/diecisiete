const brandProfiles = {
    arti: { base: 500, volatility: 200 },
    kum: { base: 450, volatility: 180 },
    fabriano: { base: 480, volatility: 220 },
    uhu: { base: 520, volatility: 250 },
    stabilo: { base: 550, volatility: 300 },
    acrilex: { base: 400, volatility: 180 },
    nilo: { base: 300, volatility: 150 },
    sadipal: { base: 350, volatility: 160 },
    fredigoni: { base: 360, volatility: 170 },
    activity: { base: 200, volatility: 100 },
    econovo: { base: 220, volatility: 90 }
};

let fictionHour = 8;
let fictionDay = 1;
let stop = false;

let dailySales = 0;
let monthlySales = 0;
let customers = 0;
let averageTicket = 0;
let unitsSoldToday = 0;
let annulmentSales = 0;

let hourlyData = [];
let hourlySalesData = [];
let brandData = {};
Object.keys(brandProfiles).forEach(key => {
    brandData[key] = { daily: [], monthly: 0 };
});

let currentBrand = "general";
let currentViewHour = null;

Object.keys(brandProfiles).forEach(key => {
    const profile = brandProfiles[key];
    const sale = profile.base;
    brandData[key].daily.push(sale);
    brandData[key].monthly += sale;
});

updateDashboard();

function chargeNewData() {
    if (stop) return;

    const hourFactor = fictionHour >= 12 && fictionHour <= 15 ? 1.4 :
                       fictionHour >= 18 ? 1.2 :
                       fictionHour <= 9 ? 0.6 : 1;

    Object.keys(brandProfiles).forEach(key => {
        const profile = brandProfiles[key];
        const sale = Math.floor((profile.base + Math.random() * profile.volatility) * hourFactor);
        brandData[key].daily.push(sale);
        brandData[key].monthly += sale;
    });

    updateHourView(0, true);

    fictionHour++;
    if (fictionHour > 20) {
        fictionHour = 8;
        fictionDay++;
    }

    if (!stop) setTimeout(chargeNewData, 5000);
}

function renewData() { if(!stop) chargeNewData(); }

function updateDashboard() {
    currentViewHour = null;
    updateHourView(0, true);
}

function updateDashboardElements() {
    document.querySelector("#dailySales").textContent = "S/" + dailySales;
    document.querySelector("#monthlySales").textContent = "S/" + monthlySales;
    document.querySelector("#averageTicket").textContent = "S/" + averageTicket;
    document.querySelector("#unitsSoldToday").textContent = unitsSoldToday;
    document.querySelector("#annulmentSales").textContent = annulmentSales;
}

document.querySelectorAll(".brands a").forEach(link => {
    link.addEventListener("click", e=>{
        e.preventDefault();
        currentBrand = link.dataset.brand;
        updateDashboard();
    });
});

const nav = document.querySelector("nav");
if(nav){
    const controlBar = document.createElement("div");
    controlBar.style.cssText="display:flex;justify-content:space-between;align-items:center;margin:10px 2%;";

    const botonLoop = document.createElement("button");
    botonLoop.textContent = "Stop";
    botonLoop.style.cssText="font-family:arial;padding:5px;background:cornsilk;font-size:16px;font-weight:bold;cursor:pointer;border:solid sienna 4px;";
    botonLoop.addEventListener("click", e=>{
        e.preventDefault();
        stop = !stop;
        botonLoop.textContent = stop ? "Resume" : "Stop";
        if(!stop) renewData();
    });

    const clock = document.createElement("div");
    clock.id = "clock";
    clock.style.cssText="font-weight:bold;font-size:18px;";

    const leftArrow = document.createElement("button");
    leftArrow.textContent = "◀";
    leftArrow.style.cssText="font-size:20px;padding:5px;margin-right:5px;cursor:pointer;";
    const rightArrow = document.createElement("button");
    rightArrow.textContent = "▶";
    rightArrow.style.cssText="font-size:20px;padding:5px;margin-left:5px;cursor:pointer;";

    leftArrow.addEventListener("click",()=>updateHourView(-1));
    rightArrow.addEventListener("click",()=>updateHourView(1));

    const navControls = document.createElement("div");
    navControls.style.display="flex";
    navControls.style.alignItems="center";
    navControls.appendChild(leftArrow);
    navControls.appendChild(rightArrow);

    controlBar.appendChild(botonLoop);
    controlBar.appendChild(clock);
    controlBar.appendChild(navControls);

    nav.after(controlBar);
}

function updateHourView(increment, force=false){
    let data = currentBrand==="general" ?
        Object.keys(brandData).reduce((arr,key)=>{
            brandData[key].daily.forEach((v,i)=>{
                arr[i] = (arr[i]||0)+v;
            });
            return arr;
        },[]) :
        [...brandData[currentBrand].daily];

    if(currentViewHour===null || force) currentViewHour = data.length-1;
    currentViewHour += increment;
    if(currentViewHour<0) currentViewHour=0;
    if(currentViewHour>data.length-1) currentViewHour=data.length-1;

    hourlyData = data.slice(0,currentViewHour+1);
    hourlySalesData = data.slice(0,currentViewHour+1);

    dailySales = hourlyData[hourlyData.length-1] || 0;
    monthlySales = currentBrand==="general" ?
                   Object.keys(brandData).reduce((sum,k)=>sum + brandData[k].monthly,0) :
                   brandData[currentBrand].monthly;
    annulmentSales = Math.floor(dailySales*0.02);
    customers = Math.max(1,Math.floor(dailySales/35));
    averageTicket = Math.floor(dailySales/customers);
    unitsSoldToday = Math.floor(customers*(Math.random()*2+1));

    updateDashboardElements();
    drawAllCharts();

    const startHour = 8;
    const hoursPerDay = 13;

    const day = 1 + Math.floor(currentViewHour / hoursPerDay);
    const hour = startHour + (currentViewHour % hoursPerDay);

    const clock = document.querySelector("#clock");
    if(clock){
        clock.textContent = `Day ${String(day).padStart(2,"0")} - ${String(hour).padStart(2,"0")}:00`;
    }

}

function drawAllCharts(){
    drawDailyChart();
    drawHourlyBarChart();
    drawDistributionChart();
    drawMonthlyChart();
    drawMonthlyBarChart();
    drawDailyVariationChart();
}

function drawDailyChart(){
    const canvas = document.querySelector("#dailyChart");
    if(!canvas || hourlyData.length<2) return;

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,canvas.width,canvas.height);

    ctx.font = "bold 14px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("Daily Sales", 10, 20);

    const padding = 30;
    const maxValue = Math.max(...hourlyData,1);
    const stepX = (canvas.width-padding*2)/(hourlyData.length-1);
    ctx.beginPath();
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 2;
    hourlyData.forEach((v,i)=>{
        const x = padding + i*stepX;
        const y = canvas.height-padding-(v/maxValue)*(canvas.height-padding*2);
        i===0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y);
    });
    ctx.stroke();

    // Ejes
    ctx.beginPath();
    ctx.strokeStyle="black";
    ctx.moveTo(padding,canvas.height-padding);
    ctx.lineTo(canvas.width-padding,canvas.height-padding);
    ctx.moveTo(padding,30);
    ctx.lineTo(padding,canvas.height-padding);
    ctx.stroke();
}

function drawHourlyBarChart(){
    const canvas = document.querySelector("#hourlyBarChart");
    if(!canvas || hourlySalesData.length===0) return;

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,canvas.width,canvas.height);

    ctx.font = "bold 14px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("Hourly Sales", 10, 20);

    const padding = 30;
    const maxValue = Math.max(...hourlySalesData,1);
    const barWidth = (canvas.width-padding*2)/hourlySalesData.length;
    hourlySalesData.forEach((v,i)=>{
        const barHeight = (v/maxValue)*(canvas.height-padding*2);
        const x = padding + i*barWidth;
        const y = canvas.height-padding-barHeight;
        ctx.fillStyle="pink";
        ctx.fillRect(x,y,barWidth-5,barHeight);
    });

    // Ejes
    ctx.beginPath();
    ctx.strokeStyle="black";
    ctx.moveTo(padding,canvas.height-padding);
    ctx.lineTo(canvas.width-padding,canvas.height-padding);
    ctx.moveTo(padding,30);
    ctx.lineTo(padding,canvas.height-padding);
    ctx.stroke();
}

function drawDistributionChart(){
    const canvas = document.querySelector("#distributionChart");
    if(!canvas) return;

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,canvas.width,canvas.height);

    ctx.font = "bold 14px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("Distribution Pie", 10, 20);

    const x = canvas.width/2;
    const y = canvas.height/2;
    const radius = Math.min(x,y)-20;

    let values = [], colors = [];
    if(currentBrand==="general"){
        Object.keys(brandData).forEach(k=>{
            values.push(brandData[k].daily[currentViewHour] || 0);
            colors.push(randomColor(k));
        });
    } else {
        values = [hourlyData[hourlyData.length-1] || 1];
        colors = ["steelblue"];
    }

    const total = values.reduce((a,b)=>a+b,1);
    let startAngle = -0.5*Math.PI;
    values.forEach((v,i)=>{
        const slice = (v/total)*2*Math.PI;
        ctx.beginPath();
        ctx.fillStyle = colors[i];
        ctx.moveTo(x,y);
        ctx.arc(x,y,radius,startAngle,startAngle+slice);
        ctx.fill();
        startAngle += slice;
    });
}

function drawMonthlyChart(){
    const canvas = document.querySelector("#monthlyChart");
    if(!canvas) return;
    
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,canvas.width,canvas.height);

    ctx.font = "bold 14px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("Monthly Sales", 10, 20);

    const padding = 30;
    const keys = Object.keys(brandData);
    const maxValue = Math.max(...keys.map(k=>brandData[k].monthly),1);
    const barWidth = (canvas.width-padding*2)/keys.length;
    keys.forEach((k,i)=>{
        const barHeight = (brandData[k].monthly/maxValue)*(canvas.height-padding*2);
        const x = padding + i*barWidth;
        const y = canvas.height-padding-barHeight;
        ctx.fillStyle = randomColor(k);
        ctx.fillRect(x,y,barWidth-5,barHeight);
    });
}

function drawMonthlyBarChart(){
    const canvas = document.querySelector("#monthlyBarChart");
    if(!canvas) return;

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,canvas.width,canvas.height);

    ctx.font = "bold 14px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("Monthly Bar", 10, 20);

    const padding = 30;
    const keys = Object.keys(brandData);
    const maxValue = Math.max(...keys.map(k=>brandData[k].monthly),1);
    const barHeight = (canvas.height-padding*2)/keys.length;
    keys.forEach((k,i)=>{
        const width = (brandData[k].monthly/maxValue)*(canvas.width-padding*2);
        const y = padding + i*barHeight;
        ctx.fillStyle = randomColor(k);
        ctx.fillRect(padding,y,width,barHeight-5);
    });
}

function drawDailyVariationChart(){
    const canvas = document.querySelector("#variationChart");
    if(!canvas || hourlyData.length<2) return;

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,canvas.width,canvas.height);

    ctx.font = "bold 14px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("Daily Variation", 10, 20);

    const padding = 30;
    const maxValue = Math.max(...hourlyData);
    const stepX = (canvas.width-padding*2)/(hourlyData.length-1);
    ctx.beginPath();
    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;
    hourlyData.forEach((v,i)=>{
        const prev = hourlyData[i-1] || v;
        const diff = v - prev;
        const x = padding + i*stepX;
        const y = canvas.height-padding - ((diff+maxValue/2)/maxValue)*(canvas.height-padding*2);
        i===0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y);
    });
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle="black";
    ctx.moveTo(padding,canvas.height-padding);
    ctx.lineTo(canvas.width-padding,canvas.height-padding);
    ctx.moveTo(padding,30);
    ctx.lineTo(padding,canvas.height-padding);
    ctx.stroke();
}

function randomColor(str){
    let hash = 0;
    for(let i=0;i<str.length;i++) hash = str.charCodeAt(i) + ((hash<<5)-hash);
    const c = (hash & 0x00FFFFFF).toString(16).toUpperCase();
    return "#" + "00000".substring(0,6-c.length) + c;
}

renewData();

const toggleBtn = document.querySelector(".menu-toggle");
const navBar = document.querySelector("nav");

if(toggleBtn){
    toggleBtn.addEventListener("click", () => {
        navBar.classList.toggle("active");
    });
}