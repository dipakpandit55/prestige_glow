// header scroll state
  const header = document.getElementById('siteHeader');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive:true });

  // scroll reveal
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if(e.isIntersecting){
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold:.15 });
  revealEls.forEach(el => io.observe(el));

  // animated counters
  const counters = document.querySelectorAll('.counter');
  const counterIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        const el = entry.target;
        const target = parseFloat(el.dataset.target);
        const decimals = parseInt(el.dataset.decimal || '0');
        const duration = 1600;
        const start = performance.now();
        function tick(now){
          const p = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          const val = target * eased;
          el.textContent = decimals ? val.toFixed(decimals) : Math.floor(val).toLocaleString();
          if(p < 1) requestAnimationFrame(tick);
          else el.textContent = decimals ? target.toFixed(decimals) : target.toLocaleString();
        }
        requestAnimationFrame(tick);
        counterIO.unobserve(el);
      }
    });
  }, { threshold:.6 });
  counters.forEach(c => counterIO.observe(c));

  // booking form (front-end only demo)
  const form = document.getElementById('bookForm');
  const note = document.getElementById('formNote');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    note.textContent = "Thank you — we'll confirm your appointment by phone shortly.";
    form.reset();
  });

  // ============ CHAT ASSISTANT ============
  (function(){
    const widget = document.getElementById('chatWidget');
    const toggle = document.getElementById('chatToggle');
    const messages = document.getElementById('chatMessages');
    const input = document.getElementById('chatInput');
    const send = document.getElementById('chatSend');
    const quickWrap = document.getElementById('chatQuick');

    toggle.addEventListener('click', () => {
      widget.classList.toggle('open');
      if(widget.classList.contains('open')) input.focus();
    });

    function addMessage(text, sender){
      const div = document.createElement('div');
      div.className = 'msg ' + sender;
      div.textContent = text;
      messages.appendChild(div);
      messages.scrollTop = messages.scrollHeight;
    }

    function showTyping(){
      const t = document.createElement('div');
      t.className = 'typing';
      t.id = 'typingIndicator';
      t.innerHTML = '<span></span><span></span><span></span>';
      messages.appendChild(t);
      messages.scrollTop = messages.scrollHeight;
    }
    function hideTyping(){
      const t = document.getElementById('typingIndicator');
      if(t) t.remove();
    }

    // simple keyword-based reply engine
    function getReply(raw){
      const q = raw.toLowerCase();

      if(/(price|cost|fee|charge|nrs|rupee)/.test(q)){
        return "Here's our starting pricing — Facial Rituals NRs 2,500 · Hair Artistry NRs 3,500 · Skin Renewal NRs 6,000 · Bridal Glow NRs 15,000 · Nail Studio NRs 1,200 · Brow & Lash NRs 800. Final pricing depends on your consultation.";
      }
      if(/(hour|open|close|timing|time)/.test(q)){
        return "We're open Tuesday to Sunday, 10am – 7pm. We're closed on Mondays.";
      }
      if(/(where|location|address|located|direction)/.test(q)){
        return "You'll find us in Narephat, Kathmandu, Nepal. Let me know if you'd like directions!";
      }
      if(/(book|appointment|schedule|reserve|slot)/.test(q)){
        document.querySelector('#book')?.scrollIntoView({behavior:'smooth'});
        return "I've scrolled you to our booking form below — fill it in and we'll confirm within one business day. You can also call or WhatsApp us directly.";
      }
      if(/(phone|contact|number|whatsapp|call)/.test(q)){
        return "You can reach us at +977 9851275855 for calls or WhatsApp.";
      }
      if(/bridal|wedding/.test(q)){
        return "Our Bridal Glow package includes trial-to-day styling for the bride and her party, starting from NRs 15,000. Want me to take you to the booking form?";
      }
      if(/facial/.test(q)){
        return "Our Facial Rituals are fully customized deep-cleanse and serum treatments, starting from NRs 2,500.";
      }
      if(/hair|color|colour|balayage|cut/.test(q)){
        return "Hair Artistry covers cuts, color and balayage from our trained stylists, starting from NRs 3,500.";
      }
      if(/skin|peel|microneedl/.test(q)){
        return "Skin Renewal includes peels and microneedling programs, usually planned across multiple sessions, from NRs 6,000.";
      }
      if(/nail|manicure|gel/.test(q)){
        return "Our Nail Studio offers gel and structured manicures from NRs 1,200, including hand-painted detail on request.";
      }
      if(/brow|lash/.test(q)){
        return "Brow & Lash includes shaping, tint and lamination, starting from NRs 800.";
      }
      if(/(hi|hello|hey|namaste)/.test(q)){
        return "Namaste! How can I help — services, prices, hours, or booking?";
      }
      if(/(thank|thanks)/.test(q)){
        return "You're most welcome! Is there anything else I can help with?";
      }
      return "I might not have that answer just yet — for anything specific, please call or WhatsApp us at +977 9851275855 and our team will help directly.";
    }

    function handleSend(text){
      const trimmed = text.trim();
      if(!trimmed) return;
      addMessage(trimmed, 'user');
      input.value = '';
      showTyping();
      setTimeout(() => {
        hideTyping();
        addMessage(getReply(trimmed), 'bot');
      }, 650 + Math.random()*400);
    }

    send.addEventListener('click', () => handleSend(input.value));
    input.addEventListener('keydown', (e) => {
      if(e.key === 'Enter') handleSend(input.value);
    });
    quickWrap.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-q]');
      if(btn) handleSend(btn.dataset.q);
    });
  })();
