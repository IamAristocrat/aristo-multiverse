'use strict';
(() => {
  const $=(q,base=document)=>base.querySelector(q);
  const nav=$('#site-nav'), toggle=$('.mobile-toggle');
  if (nav && toggle) {
    const closeNav=()=>{nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Open navigation');};
    toggle.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Close navigation':'Open navigation');});
    nav.addEventListener('click',e=>{if(e.target.closest('a')) closeNav();});
    document.addEventListener('keydown',e=>{if(e.key==='Escape')closeNav();});
  }
  const product=$('#lab-product'), budget=$('#lab-budget'), influence=$('#lab-influence'), market=$('#lab-market'), message=$('#lab-message');
  if (product && budget && influence && market && message) {
    const productReason={fashion:'Fashion purchases are shaped by identity, trends, social influence and visual preference.',school:'School footwear buyers weigh fit, school rules, durability and replacement needs.',sport:'Sports footwear buyers weigh activity, comfort, performance, reliability and suitability.'};
    const budgetReason={low:'Price sensitivity and practical value may dominate.',medium:'Buyers balance quality, fashion, value and brand familiarity.',high:'Brand perception, quality expectations and perceived exclusivity may carry more weight.'};
    const influenceReason={teen:'The wearer’s preference and social context may strongly influence the final choice.',parent:'The payer may prioritise durability, safety and suitability.',both:'The wearer and payer can disagree—even when the product fits the need.'};
    const marketReason={metro:'Retail choice and competing brands may be wider.',tier2:'Availability, trusted sellers and changing trends matter.',town:'Local access, practical value and distribution may be decisive.'};
    const render=()=>{message.textContent=`${productReason[product.value]} ${budgetReason[budget.value]} ${influenceReason[influence.value]} ${marketReason[market.value]}`;};
    [product,budget,influence,market].forEach(el=>el.addEventListener('change',render));render();
  }
  const year=$('#year');if(year)year.textContent=String(new Date().getFullYear());
  const form=$('#qualify-form'), result=$('#form-result'), error=$('#form-error'), wa=$('#wa-link'), copy=$('#copy-summary'), edit=$('#edit-introduction');
  let summary='';
  if(form && result && error && wa && copy && edit){
    form.addEventListener('submit',e=>{
      e.preventDefault();error.textContent='';
      if(!form.checkValidity()){
        const bad=form.querySelector(':invalid');error.textContent=bad?.name==='consent'?'Please confirm that you choose to share your introduction through WhatsApp.':'Please complete the required fields before preparing your introduction.';
        bad?.focus();return;
      }
      const data=new FormData(form);
      const val=k=>String(data.get(k)||'').trim().replace(/[\r\n]+/g,' ').slice(0,260);
      const fields=[['Contact',val('name')],['Organisation',val('company')],['Industry',val('industry')],['Markets served',val('geography')],['Offering',val('offering')],['Ideal buyers',val('buyers')],['Priority',val('priority')],['Timing',val('timing')],['Phone',val('phone')||'Not supplied']];
      summary='Business Conversion Fulcrum — Partnership Introduction\nBy Aristocrat Intelli-Tech\n\n'+fields.map(([k,v])=>`${k}: ${v}`).join('\n')+'\n\nI would like to explore whether a strategic partnership is mutually suitable. I understand no engagement is established until both sides agree.';
      wa.href='https://wa.me/919894595035?text='+encodeURIComponent(summary);
      form.hidden=true;result.hidden=false;result.scrollIntoView({behavior:'smooth',block:'center'});
    });
    copy.addEventListener('click',async()=>{
      try{await navigator.clipboard.writeText(summary);copy.textContent='Copied';setTimeout(()=>copy.textContent='Copy summary',2200);}catch(_){const range=document.createElement('textarea');range.value=summary;document.body.appendChild(range);range.select();const ok=document.execCommand('copy');range.remove();copy.textContent=ok?'Copied':'Copy unavailable';setTimeout(()=>copy.textContent='Copy summary',2200);}
    });
    edit.addEventListener('click',()=>{result.hidden=true;form.hidden=false;form.scrollIntoView({behavior:'smooth',block:'center'});});
  }
})();
