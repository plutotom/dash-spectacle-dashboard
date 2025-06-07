import{r as a,j as e,b as g}from"./app-DEV_J7QQ.js";const f=!1;function m({children:t}){const[c,i]=a.useState(null),[h,n]=a.useState(!1),[p,o]=a.useState(null),[l,u]=a.useState(!0),d=!1,s=async()=>{try{n(!1);const r=await g.get("/api/random-photo-from-dashboard-album");r.status===200&&(i(r.data.url),n(!1),o(null))}catch(r){console.error("Failed to fetch photo:",r),n(!0),o(r instanceof Error?r.message:"Unknown error")}finally{u(!1)}};return a.useEffect(()=>{s();const r=setInterval(s,1e3*60*10);return()=>clearInterval(r)},[]),l?e.jsx("div",{children:"Loading..."}):e.jsx("div",{children:e.jsx("div",{className:"min-h-screen bg-gray-900",style:{backgroundImage:`url(${c})`,backgroundSize:"cover",backgroundPosition:"center",backgroundRepeat:"no-repeat",transition:"background-image 1s ease-in-out"},children:e.jsx(b,{children:t})})})}function b({children:t}){return e.jsx("div",{className:"",style:{background:`
        linear-gradient(to bottom,
            rgba(0, 0, 0, 0.2) 50%,
            rgba(0, 0, 0, 0) 20%,
            rgba(0, 0, 0, 0) 30%,
            rgba(0, 0, 0, .2) 50%
        )
    `},children:t})}function v({children:t}){return e.jsx(e.Fragment,{children:e.jsx(m,{children:e.jsx("div",{className:"relative",children:e.jsx("main",{children:t})})})})}export{v as H};
//# sourceMappingURL=HaDashboardLayout-DVoXCxt8.js.map
