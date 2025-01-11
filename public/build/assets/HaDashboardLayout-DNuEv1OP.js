import{r as a,j as e,b as d}from"./app-58cCs23Y.js";const l=!0,g="https://ucarecdn.com/05f649bf-b70b-4cf8-90f7-2588ce404a08/";function f({children:t}){const[c,o]=a.useState(null),[b,n]=a.useState(!1),[i,u]=a.useState(!0),s=async()=>{try{if(l){o(g),n(!1);return}const r=await d.get("/api/random-photo-from-dashboard-album");r.status===200&&(o(r.data.url),n(!1))}catch(r){console.error("Failed to fetch photo:",r),n(!0)}finally{u(!1)}};return a.useEffect(()=>{s();const r=setInterval(s,1e3*60*10);return()=>clearInterval(r)},[]),i?e.jsx("div",{children:"Loading..."}):e.jsx("div",{children:e.jsx("div",{className:"min-h-screen bg-gray-900",style:{backgroundImage:`url(${c})`,backgroundSize:"cover",backgroundPosition:"center",backgroundRepeat:"no-repeat",transition:"background-image 1s ease-in-out"},children:e.jsx(m,{children:t})})})}function m({children:t}){return e.jsx("div",{className:"",style:{background:`
        linear-gradient(to bottom,
            rgba(0, 0, 0, 0.2) 50%,
            rgba(0, 0, 0, 0) 20%,
            rgba(0, 0, 0, 0) 30%,
            rgba(0, 0, 0, .2) 50%
        )
    `},children:t})}function x({children:t}){return e.jsx(e.Fragment,{children:e.jsx(f,{children:e.jsx("div",{className:"relative",children:e.jsx("main",{children:t})})})})}export{x as H};
