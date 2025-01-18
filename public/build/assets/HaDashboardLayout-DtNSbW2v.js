import{r as t,j as e,b as d}from"./app-MnWL4b8s.js";const l=!1;function g({children:a}){const[s,c]=t.useState(null),[m,n]=t.useState(!1),[i,u]=t.useState(!0),o=async()=>{try{const r=await d.get("/api/random-photo-from-dashboard-album");r.status===200&&(c(r.data.url),n(!1))}catch(r){console.error("Failed to fetch photo:",r),n(!0)}finally{u(!1)}};return t.useEffect(()=>{o();const r=setInterval(o,1e3*60*10);return()=>clearInterval(r)},[]),i?e.jsx("div",{children:"Loading..."}):e.jsx("div",{children:e.jsx("div",{className:"min-h-screen bg-gray-900",style:{backgroundImage:`url(${s})`,backgroundSize:"cover",backgroundPosition:"center",backgroundRepeat:"no-repeat",transition:"background-image 1s ease-in-out"},children:e.jsx(f,{children:a})})})}function f({children:a}){return e.jsx("div",{className:"",style:{background:`
        linear-gradient(to bottom,
            rgba(0, 0, 0, 0.2) 50%,
            rgba(0, 0, 0, 0) 20%,
            rgba(0, 0, 0, 0) 30%,
            rgba(0, 0, 0, .2) 50%
        )
    `},children:a})}function h({children:a}){return e.jsx(e.Fragment,{children:e.jsx(g,{children:e.jsx("div",{className:"relative",children:e.jsx("main",{children:a})})})})}export{h as H};
