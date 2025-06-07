import{r as t,j as e,b as f}from"./app-D18Er4wJ.js";const m=!1;function b({children:a}){const[c,i]=t.useState(null),[u,n]=t.useState(!1),[l,s]=t.useState(null),[d,g]=t.useState(!0),o=async()=>{try{n(!1);const r=await f.get("/api/random-photo-from-dashboard-album");r.status===200&&(i(r.data.url),n(!1),s(null))}catch(r){console.error("Failed to fetch photo:",r),n(!0),s(r instanceof Error?r.message:"Unknown error")}finally{g(!1)}};return t.useEffect(()=>{o();const r=setInterval(o,1e3*60*10);return()=>clearInterval(r)},[]),d?e.jsx("div",{children:"Loading..."}):e.jsx("div",{children:e.jsxs("div",{className:"min-h-screen bg-gray-900",style:{backgroundImage:`url(${c})`,backgroundSize:"cover",backgroundPosition:"center",backgroundRepeat:"no-repeat",transition:"background-image 1s ease-in-out"},children:[u&&e.jsx("div",{className:"text-muted-foreground",children:l}),e.jsx(h,{children:a})]})})}function h({children:a}){return e.jsx("div",{className:"",style:{background:`
        linear-gradient(to bottom,
            rgba(0, 0, 0, 0.2) 50%,
            rgba(0, 0, 0, 0) 20%,
            rgba(0, 0, 0, 0) 30%,
            rgba(0, 0, 0, .2) 50%
        )
    `},children:a})}function p({children:a}){return e.jsx(e.Fragment,{children:e.jsx(b,{children:e.jsx("div",{className:"relative",children:e.jsx("main",{children:a})})})})}export{p as H};
//# sourceMappingURL=HaDashboardLayout-BN_YHsKw.js.map
