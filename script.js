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
      xhr.open('GET','https://paymegpt.com/api/landing/context/'+encodeURIComponent(contactId)+'?page_id=2232');
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
            // Function: Toggle mobile navigation menu visibility
            const mobileToggle = document.getElementById('mobile-toggle');
            const navLinks = document.getElementById('nav-links');
            
            mobileToggle.addEventListener('click', () => {
                navLinks.classList.toggle('active');
            });

            // Close mobile menu on link click
            navLinks.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    navLinks.classList.remove('active');
                });
            });

            // ===== STICKY NAV SCROLL EFFECT =====
            // Function: Add background and blur to navbar on scroll down
            const navbar = document.getElementById('navbar');
            
            window.addEventListener('scroll', () => {
                if (window.scrollY > 60) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            });

            // ===== FADE UP ANIMATION (IntersectionObserver) =====
            // Function: Trigger CSS transition when element enters viewport
            const fadeObserverOptions = {
                root: null,
                rootMargin: '0px',
                threshold: 0.15
            };

            const fadeObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, fadeObserverOptions);

            document.querySelectorAll('.fade-up').forEach(element => {
                fadeObserver.observe(element);
            });

            // ===== NUMBER COUNTER ANIMATION =====
            // Function: Animate statistics numbers counting up from zero
            const statsObserverOptions = {
                root: null,
                rootMargin: '0px',
                threshold: 0.5
            };

            const statsObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const targetEl = entry.target;
                        const targetStr = targetEl.getAttribute('data-target');
                        const isFloat = targetStr.includes('.');
                        const targetValue = isFloat ? parseFloat(targetStr) : parseInt(targetStr, 10);
                        const suffix = targetEl.getAttribute('data-suffix') || '';
                        
                        const duration = 2000; // Total animation time (ms)
                        const frames = 60; // Approximate frames per second calculation
                        const stepTime = Math.abs(Math.floor(duration / frames));
                        let current = 0;
                        
                        const increment = targetValue / (duration / stepTime);

                        const timer = setInterval(() => {
                            current += increment;
                            
                            if (current >= targetValue) {
                                current = targetValue;
                                clearInterval(timer);
                                // Format float values to 1 decimal point if required
                                const displayValue = isFloat ? current.toFixed(1) : Math.floor(current);
                                targetEl.innerText = displayValue + suffix;
                            } else {
                                const displayValue = isFloat ? current.toFixed(1) : Math.floor(current);
                                targetEl.innerText = displayValue + suffix;
                            }
                        }, stepTime);
                        
                        observer.unobserve(targetEl);
                    }
                });
            }, statsObserverOptions);

            document.querySelectorAll('.stat-number').forEach(element => {
                statsObserver.observe(element);
            });
        });