tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        navy: '#1E3A5F',
                        'navy-dark': '#152842',
                        electric: '#2563EB',
                        'electric-hover': '#1d4ed8',
                        dark: '#0f1d2f',
                        light: '#F8FAFC',
                        gray: '#64748B'
                    },
                    fontFamily: {
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
            
            // ===== STICKY NAVBAR LOGIC =====
            // Purpose: Add background to navbar when scrolling down
            const navbar = document.getElementById('navbar');
            window.addEventListener('scroll', () => {
                if (window.scrollY > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            });

            // ===== MOBILE MENU TOGGLE =====
            // Purpose: Show/hide mobile navigation menu
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

            menuBtn.addEventListener('click', toggleMenu);
            
            // Close menu when a link is clicked
            mobileLinks.forEach(link => {
                link.addEventListener('click', () => {
                    if(mobileMenu.classList.contains('open')) {
                        toggleMenu();
                    }
                });
            });

            // ===== SCROLL REVEAL ANIMATIONS =====
            // Purpose: Fade in elements as they scroll into view using Intersection Observer
            const revealElements = document.querySelectorAll('.reveal');
            
            const revealOptions = {
                threshold: 0.15,
                rootMargin: "0px 0px -50px 0px"
            };

            const revealObserver = new IntersectionObserver(function(entries, observer) {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) {
                        return;
                    } else {
                        entry.target.classList.add('active');
                        observer.unobserve(entry.target);
                    }
                });
            }, revealOptions);

            revealElements.forEach(el => {
                revealObserver.observe(el);
            });

            // ===== STATS COUNTER ANIMATION =====
            // Purpose: Animate numbers counting up when the section comes into view
            const counters = document.querySelectorAll('.stat-counter');
            const statsSection = document.getElementById('stats-section');
            let hasCounted = false;

            const counterObserver = new IntersectionObserver((entries) => {
                const [entry] = entries;
                if (entry.isIntersecting && !hasCounted) {
                    hasCounted = true;
                    counters.forEach(counter => {
                        const target = parseFloat(counter.getAttribute('data-target'));
                        const isDecimal = counter.getAttribute('data-decimal') === 'true';
                        const duration = 2000; // 2 seconds
                        const frameRate = 1000 / 60; // 60fps
                        const totalFrames = Math.round(duration / frameRate);
                        let currentFrame = 0;

                        const count = setInterval(() => {
                            currentFrame++;
                            const progress = currentFrame / totalFrames;
                            // easeOutQuart easing function for smooth deceleration
                            const easeProgress = 1 - Math.pow(1 - progress, 4);
                            
                            let currentValue = target * easeProgress;
                            
                            if (isDecimal) {
                                counter.innerText = currentValue.toFixed(1);
                            } else {
                                counter.innerText = Math.floor(currentValue);
                            }

                            if (currentFrame === totalFrames) {
                                clearInterval(count);
                                counter.innerText = isDecimal ? target.toFixed(1) : target;
                            }
                        }, frameRate);
                    });
                }
            }, { threshold: 0.5 });

            if (statsSection) {
                counterObserver.observe(statsSection);
            }

            // ===== FORM SUBMISSION HANDLER =====
            // Standard form handler preventing default to simulate submission
            const contactForm = document.getElementById('contact-form');
            if(contactForm) {
                contactForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const btn = contactForm.querySelector('button[type="submit"]');
                    const originalText = btn.innerText;
                    
                    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> SENDING...';
                    btn.disabled = true;
                    btn.classList.add('opacity-70');

                    // Simulate API call delay
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

            // ===== FLOATING CHAT BUTTON LOGIC =====
            // Triggers UI interaction for the requested chat placeholder div
            const chatBtn = document.getElementById('floating-chat-btn');
            const chatWidgetDiv = document.getElementById('blue-roofing-chat-widget');
            
            if(chatBtn && chatWidgetDiv) {
                chatBtn.addEventListener('click', () => {
                    // Stop pulse animation once clicked
                    chatBtn.classList.remove('chat-pulse');
                    
                    // Toggle icon
                    const icon = chatBtn.querySelector('i');
                    if(icon.classList.contains('fa-comment-dots')) {
                        icon.classList.remove('fa-comment-dots');
                        icon.classList.add('fa-xmark');
                        // Placeholder logic to show user interaction
                        chatWidgetDiv.innerHTML = '<div class="fixed bottom-24 right-6 w-80 h-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-40 flex flex-col overflow-hidden animate-[pulse_0.5s_ease-out]"><div class="bg-navy text-white p-4 font-bebas text-xl flex justify-between items-center"><span>Blue Roofing Support</span></div><div class="flex-1 p-4 bg-light flex flex-col justify-end"><div class="bg-gray-200 text-navy p-3 rounded-lg rounded-bl-none text-sm w-3/4 mb-4">Hi! How can we help you with your roof today?</div></div><div class="p-3 bg-white border-t border-gray-200"><input type="text" placeholder="Type a message..." class="w-full bg-light border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-electric"></div></div>';
                    } else {
                        icon.classList.remove('fa-xmark');
                        icon.classList.add('fa-comment-dots');
                        chatWidgetDiv.innerHTML = ''; // Clear widget
                    }
                });
            }

        });