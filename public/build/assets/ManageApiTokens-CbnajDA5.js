import{r as c,W as f,j as e}from"./app-Be_EVZd7.js";import{T as d,I as j}from"./TextInput-D2KYJDig.js";import{I as k}from"./InputLabel-NnPDfpm2.js";import{P as p}from"./PrimaryButton-B2Ousn6t.js";/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const y=r=>r.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),v=(...r)=>r.filter((a,n,l)=>!!a&&a.trim()!==""&&l.indexOf(a)===n).join(" ").trim();/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var N={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const w=c.forwardRef(({color:r="currentColor",size:a=24,strokeWidth:n=2,absoluteStrokeWidth:l,className:i="",children:o,iconNode:t,...m},u)=>c.createElement("svg",{ref:u,...N,width:a,height:a,stroke:r,strokeWidth:l?Number(n)*24/Number(a):n,className:v("lucide",i),...m},[...t.map(([x,s])=>c.createElement(x,s)),...Array.isArray(o)?o:[o]]));/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const g=(r,a)=>{const n=c.forwardRef(({className:l,...i},o)=>c.createElement(w,{ref:o,iconNode:a,className:v(`lucide-${y(r)}`,l),...i}));return n.displayName=`${r}`,n};/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const b=g("Pencil",[["path",{d:"M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",key:"1a8usu"}],["path",{d:"m15 5 4 4",key:"1mk7zo"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const C=g("Plus",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const T=g("Trash",[["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6",key:"4alrt4"}],["path",{d:"M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2",key:"v07s0e"}]]);function P({className:r="",tokens:a=[]}){const[n,l]=c.useState(null),[i,o]=c.useState(!1),t=f({name:"",token:""}),m=s=>{s.preventDefault(),t.post(route("api-tokens.store"),{preserveScroll:!0,onSuccess:()=>{t.reset(),o(!1)}})},u=s=>{t.put(route("api-tokens.update",s.id),{preserveScroll:!0,onSuccess:()=>{l(null),t.reset()}})},x=s=>{confirm("Are you sure you want to delete this token?")&&t.delete(route("api-tokens.destroy",s.id))};return e.jsxs("section",{className:r,children:[e.jsxs("header",{children:[e.jsx("h2",{className:"text-lg font-medium text-gray-900 dark:text-gray-100",children:"API Tokens"}),e.jsx("p",{className:"mt-1 text-sm text-gray-600 dark:text-gray-400",children:"Manage your API tokens that can be used to access your application."})]}),e.jsxs("div",{className:"mt-6",children:[e.jsx("div",{className:"mb-4 flex justify-end",children:e.jsxs(p,{onClick:()=>o(!0),disabled:i,children:[e.jsx(C,{className:"mr-2 h-4 w-4"})," ","New Token"]})}),i&&e.jsxs("form",{onSubmit:m,className:"mb-6 rounded-lg bg-gray-50 p-4 dark:bg-gray-700",children:[e.jsxs("div",{className:"grid grid-cols-2 gap-4",children:[e.jsxs("div",{children:[e.jsx(k,{htmlFor:"name",value:"Name"}),e.jsx(d,{id:"name",type:"text",className:"mt-1 block w-full",value:t.data.name,onChange:s=>t.setData("name",s.target.value),autoFocus:!0}),e.jsx(j,{message:t.errors.name,className:"mt-2"})]}),e.jsxs("div",{children:[e.jsx(k,{htmlFor:"token",value:"Token"}),e.jsx(d,{id:"token",type:"text",className:"mt-1 block w-full",value:t.data.token,onChange:s=>t.setData("token",s.target.value)}),e.jsx(j,{message:t.errors.token,className:"mt-2"})]})]}),e.jsx("div",{className:"mt-4 flex justify-end",children:e.jsx(p,{className:"ml-4",disabled:t.processing,children:"Save"})})]}),e.jsx("div",{className:"space-y-4",children:a.map(s=>e.jsx("div",{className:"flex items-center justify-between rounded-lg bg-white p-4 shadow dark:bg-gray-800",children:n===s.id?e.jsxs("div",{className:"grid flex-1 grid-cols-2 gap-4",children:[e.jsx(d,{type:"text",value:t.data.name,onChange:h=>t.setData("name",h.target.value),className:"w-full"}),e.jsx(d,{type:"text",value:t.data.token,onChange:h=>t.setData("token",h.target.value),className:"w-full"}),e.jsx("div",{className:"col-span-2 flex justify-end",children:e.jsx(p,{onClick:()=>u(s),disabled:t.processing,children:"Save"})})]}):e.jsxs(e.Fragment,{children:[e.jsxs("div",{children:[e.jsx("div",{className:"font-medium",children:s.name}),e.jsx("div",{className:"text-sm text-gray-600 dark:text-gray-400",children:s.token})]}),e.jsxs("div",{className:"flex space-x-2",children:[e.jsxs("button",{onClick:()=>{l(s.id),t.setData({name:s.name,token:s.token})},className:"text-gray-400 hover:text-gray-600",children:[e.jsx(b,{className:"h-5 w-5"})," "]}),e.jsxs("button",{onClick:()=>x(s),className:"text-red-400 hover:text-red-600",children:[e.jsx(T,{className:"h-5 w-5"})," "]})]})]})},s.id))})]})]})}export{P as default};
