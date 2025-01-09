import{b as m,j as e,r as s}from"./app-CLVS_CEf.js";const g={async getEvents(){return(await m.get("/api/calendar-events")).data.data}};function j({dayEvents:t,dayDate:n}){return t.length?e.jsxs("div",{className:"flex flex-col text-primary-foreground",children:[e.jsx("span",{className:"text-lg",children:new Date(n).toLocaleDateString("en-US",{weekday:"long",month:"short",day:"numeric",timeZone:t[0].start.timeZone||"UTC"})}),e.jsx("hr",{className:"border-[0.5px] border-gray-400"}),t.map(r=>e.jsx("div",{className:"my-1 border-l-4 border-l-primary ps-1",children:e.jsx(v,{event:r})},r.id))]}):null}function v({event:t}){return t.isAllDay?e.jsx("div",{children:e.jsxs("div",{className:"flex flex-col justify-between text-lg",children:[e.jsx("span",{className:"text-sm text-[#A9A9A9]",children:"All day"}),e.jsx("span",{children:t.summary})]})}):e.jsx("div",{children:e.jsxs("div",{className:"flex flex-col justify-between text-lg",children:[e.jsxs("span",{children:[new Date(t.start.dateTime).toLocaleTimeString("en-US",{hour:"numeric",minute:"numeric",hour12:!0,timeZone:t.start.timeZone??"UTC"})," - ",new Date(t.end.dateTime).toLocaleTimeString("en-US",{hour:"numeric",minute:"numeric",hour12:!0,timeZone:t.end.timeZone??"UTC"})]}),e.jsx("span",{children:t.summary})]})})}function p({className:t}){const[n,r]=s.useState(null),[c,i]=s.useState(!0),[o,a]=s.useState(null),[d,l]=s.useState(null);return s.useEffect(()=>{const x=async()=>{try{const h=await g.getEvents();r(h),l(new Date)}catch(h){a("Failed to fetch calendar events"),console.error(h)}finally{i(!1)}};x();const u=setInterval(x,20*60*1e3);return()=>clearInterval(u)},[]),c?e.jsx("div",{className:"flex items-center justify-center p-4",children:e.jsx("div",{className:"",children:"Loading Calendar..."})}):o?e.jsxs("div",{className:"p-4 text-destructive",children:["Error loading calendar: ",o]}):e.jsx("div",{className:`rounded-lg shadow-sm ${t}`,children:e.jsx("div",{children:e.jsx("div",{className:"flex space-x-2",children:Object.values(n).slice(0,4).map((x,u)=>e.jsx("div",{className:"w-1/4",children:e.jsx(j,{dayEvents:x,dayDate:Object.keys(n)[u]},u)},u))})})})}function y(){const[t,n]=s.useState([]),[r,c]=s.useState(!0),[i,o]=s.useState(null);return s.useEffect(()=>{const a=async()=>{try{const l=await m.get("/api/messages");n(l.data.data),c(!1)}catch{o("Failed to load messages"),c(!1)}};a();const d=setInterval(()=>{a()},1e3*60*1);return()=>clearInterval(d)},[]),r?e.jsx("div",{children:"Loading messages..."}):i?e.jsx("div",{className:"text-red-500",children:i}):e.jsx("div",{className:"",children:e.jsx("div",{className:"max-h-[30vh] overflow-y-auto",children:t.map(a=>e.jsxs("div",{className:"my-1 flex w-1/3 flex-col rounded-xl bg-white bg-opacity-10 p-1 backdrop-blur-sm transition-colors",children:[e.jsxs("div",{className:"mb-1 flex items-center justify-between text-sm text-gray-300",children:[e.jsx("span",{className:"text-xs font-medium",children:a.name}),e.jsx("span",{children:new Date(a.created_at).toLocaleTimeString()})]}),e.jsx("p",{className:"text-sm text-white",children:a.content})]},a.id))})})}const f={async getCurrentWeather(){return(await m.get("/api/weather/current")).data.data},async getForecast(){return(await m.get("/api/weather/forecast")).data.data}};function N(){const[t,n]=s.useState(null),[r,c]=s.useState(!0),[i,o]=s.useState(null),[a,d]=s.useState(null);return s.useEffect(()=>{const l=async()=>{try{const u=await f.getCurrentWeather();n(u),d(new Date)}catch(u){o("Failed to fetch current weather"),console.error(u)}finally{c(!1)}};l();const x=setInterval(l,15*60*1e3);return()=>clearInterval(x)},[]),r?e.jsx("div",{className:"flex items-center justify-center p-4",children:e.jsx("div",{className:"",children:"Loading Weather..."})}):i?e.jsxs("div",{className:"p-4 text-destructive",children:["Error loading weather: ",i]}):e.jsx("div",{className:"",children:e.jsx("div",{className:"inline-block rounded-md bg-white bg-opacity-10 p-4 backdrop-blur-sm transition-colors",children:e.jsxs("div",{className:"flex flex-col justify-between text-primary-foreground",children:[e.jsxs("div",{className:"flex items-end",children:[e.jsxs("h1",{className:"text-5xl",children:[t==null?void 0:t.current.temp_f,"°"]}),e.jsx("span",{className:"ml-2 pr-1 text-base",children:"But Feels like"}),e.jsxs("h1",{className:"text-xl",children:[t.current.feelslike_f,"°"]})]}),e.jsxs("div",{className:"text-base",children:["Wind: ",t.current.wind_dir," ",t.current.wind_mph,"MPH"]})]})})})}function b(t){const n=new Date;n.setHours(0,0,0,0);const r=new Date(t);r.setHours(0,0,0,0);const c=(r.getTime()-n.getTime())/(1e3*60*60*24);return c===0?"Today":c===1?"Tomorrow":c<7&&c>1?`Next ${r.toLocaleDateString(void 0,{weekday:"long"})}`:r.toLocaleDateString(void 0,{weekday:"long",month:"long",day:"numeric"})}const w=()=>{const[t,n]=s.useState(null),[r,c]=s.useState(!0),[i,o]=s.useState(null);return s.useEffect(()=>{const a=async()=>{try{const l=await f.getForecast();n(l),o(new Date)}catch(l){console.error("Failed to load forecast:",l)}finally{c(!1)}};a();const d=setInterval(a,20*60*1e3);return()=>clearInterval(d)},[]),r?e.jsx("div",{children:"Loading forecast..."}):t?e.jsx("div",{className:"space-y-2",children:e.jsx("div",{className:"grid grid-cols-5 gap-4 transition-colors",children:t.forecast.map(a=>e.jsxs("div",{className:"flex flex-col justify-around p-4 text-primary-foreground",children:[e.jsx("div",{className:"text-lg font-semibold",children:b(new Date(a.date+"T00:00:00"))}),e.jsxs("div",{children:[e.jsx("img",{src:a.day.condition.icon,alt:a.day.condition.text,className:"mx-auto h-16 w-16"}),e.jsxs("div",{className:"text-center align-baseline",children:[e.jsxs("div",{className:"text-lg",children:[e.jsxs("span",{className:"",children:[Math.round(a.day.maxtemp_f),"°"]})," / ",e.jsxs("span",{className:"",children:[Math.round(a.day.mintemp_f),"°"]})]}),e.jsxs("div",{className:"text text-sm text-gray-400",children:[a.day.daily_chance_of_rain,"%"]})]})]})]},a.date_epoch))})}):e.jsx("div",{children:"Unable to load forecast"})},S=!1;function D({children:t}){const[n,r]=s.useState(null),[c,i]=s.useState(!1),[o,a]=s.useState(!0),d=async()=>{try{const l=await m.get("/api/random-photo-from-dashboard-album");l.status===200&&(r(l.data.url),i(!1))}catch(l){console.error("Failed to fetch photo:",l),i(!0)}finally{a(!1)}};return s.useEffect(()=>{d();const l=setInterval(d,1e3*60*10);return()=>clearInterval(l)},[]),o?e.jsx("div",{children:"Loading..."}):e.jsx("div",{children:e.jsx("div",{className:"min-h-screen bg-gray-900",style:{backgroundImage:`url(${n})`,backgroundSize:"cover",backgroundPosition:"center",backgroundRepeat:"no-repeat",transition:"background-image 1s ease-in-out"},children:e.jsx(L,{children:t})})})}function L({children:t}){return e.jsx("div",{className:"",style:{background:`
        linear-gradient(to bottom,
            rgba(0, 0, 0, 0.2) 50%,
            rgba(0, 0, 0, 0) 20%,
            rgba(0, 0, 0, 0) 30%,
            rgba(0, 0, 0, .2) 50%
        )
    `},children:t})}function k({children:t}){return e.jsx(e.Fragment,{children:e.jsx(D,{children:e.jsx("div",{className:"relative",children:e.jsx("main",{children:t})})})})}function T(){return e.jsx(k,{header:e.jsx("h2",{className:"text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200",children:"HA Dashboard"}),children:e.jsxs("div",{className:"relative flex h-screen flex-col gap-1 p-4",children:[e.jsxs("div",{className:"flex items-start justify-between",children:[e.jsx("div",{className:"flex flex-col",children:e.jsx(E,{})}),e.jsx("div",{className:"w-1/4",children:e.jsx(N,{})})]}),e.jsx("div",{className:"flex flex-1 gap-4",children:e.jsx("div",{className:"w-full",children:e.jsx(w,{})})}),e.jsx("div",{className:"flex gap-4",children:e.jsx("div",{className:"w-full max-w-7xl",children:e.jsx(y,{})})}),e.jsx("div",{className:"h-1/3",children:e.jsx(p,{})})]})})}function E(){const[t,n]=s.useState(new Date);return s.useEffect(()=>{n(new Date);const r=setInterval(()=>{n(new Date)},1e3*60);return()=>clearInterval(r)},[]),e.jsxs("div",{children:[e.jsx("div",{className:"text-8xl text-primary-foreground",children:t.toLocaleTimeString("en-US",{hour:"numeric",minute:"numeric",hour12:!0}).replace("AM","").replace("PM","")}),e.jsxs("div",{className:"flex flex-col",children:[e.jsx("span",{className:"text-3xl text-primary-foreground",children:t.toLocaleDateString("en-US",{weekday:"long"})}),e.jsx("span",{className:"text-lg text-primary-foreground",children:t.toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"})})]})]})}export{T as default};
