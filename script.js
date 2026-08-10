const config=window.SCHOOLHUB_CONFIG||{};
const menuButton=document.querySelector('.menu-toggle');
const nav=document.querySelector('.primary-nav');

menuButton?.addEventListener('click',()=>{
  const open=menuButton.getAttribute('aria-expanded')==='true';
  menuButton.setAttribute('aria-expanded',String(!open));
  menuButton.setAttribute('aria-label',open?'Open navigation':'Close navigation');
  nav.classList.toggle('open');
  document.body.classList.toggle('menu-open',!open);
});
nav?.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{
  nav.classList.remove('open');document.body.classList.remove('menu-open');
  menuButton?.setAttribute('aria-expanded','false');
}));
document.querySelector('#year').textContent=new Date().getFullYear();

if('IntersectionObserver' in window){
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}
  }),{threshold:.12});
  document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
}else document.querySelectorAll('.reveal').forEach(el=>el.classList.add('visible'));

document.querySelectorAll('[data-billing]').forEach(button=>button.addEventListener('click',()=>{
  document.querySelectorAll('[data-billing]').forEach(b=>b.classList.toggle('active',b===button));
  const annual=button.dataset.billing==='annual';
  document.querySelectorAll('[data-monthly]').forEach(price=>price.textContent=annual?price.dataset.annual:price.dataset.monthly);
  document.querySelectorAll('[data-period]').forEach(period=>period.textContent=annual?'/ year':'/ month');
  document.querySelector('#annual-note').hidden=!annual;
}));

const today=new Date().toISOString().split('T')[0];
document.querySelectorAll('input[type="date"]').forEach(input=>input.min=today);

async function handleForm(form,type){
  form.addEventListener('submit',async event=>{
    event.preventDefault();
    const status=form.querySelector('.form-status');
    status.className='form-status';
    form.querySelectorAll('[aria-invalid]').forEach(el=>el.removeAttribute('aria-invalid'));
    if(!form.checkValidity()){
      form.querySelectorAll(':invalid').forEach(el=>el.setAttribute('aria-invalid','true'));
      status.textContent='Please complete all required fields correctly.';status.classList.add('error');
      form.querySelector(':invalid')?.focus();return;
    }
    const submit=form.querySelector('[type="submit"]');
    const payload=Object.fromEntries(new FormData(form));
    payload.formType=type;payload.page=location.href;payload.submittedAt=new Date().toISOString();
    try{
      submit.disabled=true;submit.textContent='Sending…';
      if(config.formEndpoint){
        const response=await fetch(config.formEndpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
        if(!response.ok)throw new Error('Request failed');
        status.textContent='Thank you. Your request has been received and our team will contact you.';
        status.classList.add('success');form.reset();
      }else if(config.contactEmail){
        const subject=type==='demo'?`SchoolHub demo request — ${payload.school}`:`SchoolHub enquiry — ${payload.subject}`;
        status.textContent='Your email application is opening so you can send the request.';status.classList.add('success');
        location.href=`mailto:${config.contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(JSON.stringify(payload,null,2))}`;
      }else throw new Error('Contact delivery is not configured');
    }catch(error){
      status.textContent='We could not send your request. Please use the WhatsApp or telephone contact shown on this page.';
      status.classList.add('error');
    }finally{submit.disabled=false;submit.textContent=type==='demo'?'Book a Free Demo':'Send Message'}
  });
}
document.querySelectorAll('form').forEach(form=>handleForm(form,form.id==='demo-form'?'demo':'contact'));

document.querySelectorAll('.whatsapp-link').forEach(link=>{
  if(config.whatsappNumber)link.href=`https://wa.me/${config.whatsappNumber}`;
  link.addEventListener('click',event=>{
    if(!config.whatsappNumber){event.preventDefault();alert('The official SchoolHub WhatsApp number will be added before launch.')}
  });
});

document.querySelectorAll('[data-contact-subject]').forEach(link=>link.addEventListener('click',()=>{
  const select=document.querySelector('#contact-form [name="subject"]');
  if(select){const other=[...select.options].find(option=>option.text==='Other');select.value=other?.value||'Other'}
  document.querySelector('#contact-form [name="message"]')?.setAttribute('placeholder',link.dataset.contactSubject);
}));

const banner=document.querySelector('.cookie-banner');
try{if(localStorage.getItem('schoolhub-cookie-choice'))banner?.classList.add('is-hidden')}catch(error){}
document.querySelectorAll('[data-cookie]').forEach(button=>button.addEventListener('click',()=>{
  try{localStorage.setItem('schoolhub-cookie-choice',button.dataset.cookie)}catch(error){}
  banner?.classList.add('is-hidden');
}));
