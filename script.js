tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        navy: { DEFAULT: '#1E3A5F', 900: '#0f1e36', 800: '#1E3A5F', 700: '#1e4a7a' },
                        'navy-dark': '#152842',
                        blue: { accent: '#2563EB' },
                        electric: '#2563EB',
                        'electric-hover': '#1d4ed8',
                        dark: '#0f1d2f',
                        light: '#F8FAFC',
                        gray: '#64748B'
                    },
                    fontFamily: {
                        display: ['"Bebas Neue"', 'cursive'],
                        body: ['Outfit', 'sans-serif'],
                        bebas: ['"Bebas Neue"', 'sans-serif'],
                        outfit: ['"Outfit"', 'sans-serif'],
                    },
                    backgroundImage: {
                        'hero-pattern': "linear-gradient(to right, rgba(30, 58, 95, 0.95), rgba(30, 58, 95, 0.7)), url('https://images.unsplash.com/photo-1632759145355-14f7b445d947?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')",
                        'cta-pattern': "linear-gradient(to right, rgba(37, 99, 235, 0.95), rgba(30, 58, 95, 0.9)), url('https://images.unsplash.com/photo-1517581177682-a085bb7ffb15?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')",
                    }
                }
            }
        }

(function(){
  var params=new URLSearchParams(window.location.search);
  var fields={};
  var paramMap={
    'first_name':'firstName','last_name':'lastName','full_name':'fullName',
    'email':'email','phone':'phone','company':'company',
    'city':'city','state':'state','country':'country'
  };
  var skipTags={'SCRIPT':1,'STYLE':1,'NOSCRIPT':1,'TEXTAREA':1,'CODE':1,'PRE':1};
  var hasUrlFields=false;
  for(var p in paramMap){
    var v=params.get(p);
    if(v){fields[paramMap[p]]=v;hasUrlFields=true;}
  }
  var contactId=params.get('contact_id');
  function esc(s){
    if(!s)return s;
    var d=document.createElement('div');
    d.appendChild(document.createTextNode(s));
    return d.innerHTML;
  }
  function doReplace(data){
    var r={};
    r['{{full_name}}']=esc(((data.firstName||'')+' '+(data.lastName||'')).trim()||((data.fullName||data.name)||''));
    r['{{first_name}}']=esc(data.firstName||(data.name?data.name.split(' ')[0]:'')||'');
    r['{{last_name}}']=esc(data.lastName||(data.name&&data.name.indexOf(' ')>-1?data.name.substring(data.name.indexOf(' ')+1):'')||'');
    r['{{email}}']=esc(data.email||'');
    r['{{phone}}']=esc(data.phone||'');
    r['{{company}}']=esc(data.company||'');
    r['{{city}}']=esc(data.city||'');
    r['{{state}}']=esc(data.state||'');
    r['{{country}}']=esc(data.country||'');
    r['{{date}}']=new Date().toLocaleDateString();
    r['{{time}}']=new Date().toLocaleTimeString();
    r['{{location}}']=[data.city,data.state,data.country].filter(Boolean).join(', ');
    r['{{tracking_id}}']=esc(data.trackingId||'');
    r['{{lastClickedProduct}}']=esc(data.lastClickedProduct||'');
    r['{{lastProductClickDate}}']=esc(data.lastProductClickDate||'');
    r['{{lastClickedProductPrice}}']=esc(data.lastClickedProductPrice||'');
    r['{{lastClickedProductURL}}']=esc(data.lastClickedProductURL||'');
    r['{{productsClickedCount}}']=esc(data.productsClickedCount||'0');
    r['{{ip_address}}']=esc(data.ipAddress||'');
    r['{{ip}}']=esc(data.ipAddress||'');
    if(data.customFields){
      for(var k in data.customFields){
        r['{{'+k+'}}']=esc(String(data.customFields[k]||''));
      }
    }
    params.forEach(function(v,k){
      if(!paramMap[k]&&k!=='contact_id'&&k!=='page_id'&&k.indexOf('utm_')!==0){
        r['{{'+k+'}}']=esc(v);
      }
    });
    var hasValues=false;
    for(var key in r){if(r[key]){hasValues=true;break;}}
    if(!hasValues)return;
    var walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,{
      acceptNode:function(n){
        var p=n.parentNode;
        if(p&&skipTags[p.nodeName])return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var node;
    while(node=walker.nextNode()){
      var txt=node.nodeValue;
      if(txt&&txt.indexOf('{{')>-1){
        var changed=txt;
        for(var ph in r){
          if(r[ph]&&changed.indexOf(ph)>-1){
            changed=changed.split(ph).join(r[ph]);
          }
        }
        if(changed!==txt)node.nodeValue=changed;
      }
    }
    var attrs=['value','placeholder','content','alt','title'];
    attrs.forEach(function(attr){
      var els=document.querySelectorAll('['+attr+'*="{{"]');
      for(var i=0;i<els.length;i++){
        var tag=els[i].tagName;
        if(skipTags[tag])continue;
        var val=els[i].getAttribute(attr);
        if(val){
          var nv=val;
          for(var ph in r){
            if(r[ph]&&nv.indexOf(ph)>-1){
              nv=nv.split(ph).join(r[ph]);
            }
          }
          if(nv!==val)els[i].setAttribute(attr,nv);
        }
      }
    });
  }
  function run(){
    if(contactId){
      var xhr=new XMLHttpRequest();
      xhr.open('GET','https://paymegpt.com/api/landing/context/'+encodeURIComponent(contactId)+'?page_id=2228');
      xhr.onload=function(){
        if(xhr.status===200){
          try{
            var resp=JSON.parse(xhr.responseText);
            if(resp.success&&resp.contact){
              var merged=resp.contact;
              for(var k in fields){merged[k]=fields[k];}
              doReplace(merged);
              return;
            }
          }catch(e){}
        }
        if(hasUrlFields)doReplace(fields);
      };
      xhr.onerror=function(){if(hasUrlFields)doReplace(fields);};
      xhr.send();
    }else if(hasUrlFields){
      doReplace(fields);
    }
  }
  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',run);}
  else{run();}
})();

document.addEventListener('DOMContentLoaded', () => {
            
            // ===== MOBILE MENU TOGGLE =====
            const menuBtn = document.getElementById('mobile-menu-btn');
            const mobileMenu = document.getElementById('mobile-menu');
            const mobileLinks = document.querySelectorAll('.mobile-link');
            
            function toggleMenu() {
                mobileMenu.classList.toggle('open');
                const icon = menuBtn.querySelector('i');
                if (mobileMenu.classList.contains('open')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-xmark');
                } else {
                    icon.classList.remove('fa-xmark');
                    icon.classList.add('fa-bars');
                }
            }

            if(menuBtn) menuBtn.addEventListener('click', toggleMenu);
            
            mobileLinks.forEach(link => {
                link.addEventListener('click', () => {
                    if(mobileMenu.classList.contains('open')) {
                        toggleMenu();
                    }
                });
            });

            // ===== FORM SUBMISSION HANDLER =====
            const contactForm = document.getElementById('contact-form');
            if(contactForm) {
                contactForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const btn = contactForm.querySelector('button[type="submit"]');
                    const originalText = btn.innerText;
                    
                    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> SENDING...';
                    btn.disabled = true;
                    btn.classList.add('opacity-70');

                    setTimeout(() => {
                        btn.innerHTML = '<i class="fa-solid fa-check"></i> REQUEST SENT!';
                        btn.classList.remove('bg-electric');
                        btn.classList.add('bg-green-500');
                        contactForm.reset();
                        
                        setTimeout(() => {
                            btn.innerHTML = originalText;
                            btn.disabled = false;
                            btn.classList.remove('opacity-70', 'bg-green-500');
                            btn.classList.add('bg-electric');
                        }, 3000);
                    }, 1500);
                });
            }

        });

// Sticky nav
      window.addEventListener('scroll', () => {
        const nav = document.querySelector('nav');
        if (nav) nav.classList.toggle('scrolled', window.scrollY > 50);
      });
      // Fade-up on scroll
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
      }, { threshold: 0.1 });
      document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
      // Stats counter animation
      function animateCounter(el, target, duration = 2000) {
        let start = 0;
        const step = target / (duration / 16);
        const timer = setInterval(() => {
          start += step;
          if (start >= target) { el.textContent = target + (el.dataset.suffix || ''); clearInterval(timer); }
          else el.textContent = Math.floor(start) + (el.dataset.suffix || '');
        }, 16);
      }
      const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            const el = e.target;
            animateCounter(el, parseInt(el.dataset.target), 2000);
            statsObserver.unobserve(el);
          }
        });
      }, { threshold: 0.5 });
      document.querySelectorAll('[data-target]').forEach(el => statsObserver.observe(el));