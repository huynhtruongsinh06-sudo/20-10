(() => {
  'use strict';

  const STORAGE_KEY = 'flower.garden.greeting.20-10.v3';
  const card = document.getElementById('wishCard');
  const reading = document.getElementById('cardReading');
  const editor = document.getElementById('cardEditor');
  const editButton = document.getElementById('editCard');
  const status = document.getElementById('cardStatus');
  const recipient = document.getElementById('cardRecipient');
  const title = document.getElementById('cardTitle');
  const message = document.getElementById('cardMessage');
  const signature = document.getElementById('cardSignature');
  const flowerBadge = document.getElementById('cardFlowerBadge');
  const copyButton = document.getElementById('btnCopyWish');
  const toast = document.getElementById('toastNotification');
  const cardBouquetPreview = document.getElementById('cardBouquetPreview');
  const cardBouquetItems = document.getElementById('cardBouquetItems');
  const btnAdmireBouquet = document.getElementById('btnAdmireBouquet');
  const btnFloatingReopenCard = document.getElementById('btnFloatingReopenCard');

  let isMinimizing = false;

  const inputs = {
    recipient: document.getElementById('recipientInput'),
    title: document.getElementById('titleInput'),
    message: document.getElementById('messageInput'),
    signature: document.getElementById('signatureInput')
  };

  function showToast(text, duration = 2500) {
    if (!toast) return;
    toast.textContent = text;
    toast.hidden = false;
    toast.classList.add('is-visible');
    setTimeout(() => {
      toast.classList.remove('is-visible');
      setTimeout(() => { toast.hidden = true; }, 300);
    }, duration);
  }

  function renderGreeting(rec, tit, msg, sig) {
    if (recipient) recipient.textContent = rec;
    if (title) title.textContent = tit;
    if (signature) signature.textContent = sig;
    if (message) {
      const parts = (msg || '').split(/\n\s*\n/).filter(t => t.trim());
      message.replaceChildren(...parts.map(text => {
        const paragraph = document.createElement('p');
        paragraph.className = 'message';
        paragraph.textContent = text;
        return paragraph;
      }));
    }
  }

  function showReading() {
    if (editor) editor.hidden = true;
    if (reading) reading.hidden = false;
    if (card) {
      card.setAttribute('aria-labelledby', 'cardTitle');
      card.scrollTop = 0;
    }
  }

  if (editButton && editor) {
    editButton.addEventListener('click', () => {
      if (inputs.recipient && recipient) inputs.recipient.value = recipient.textContent;
      if (inputs.title && title) inputs.title.value = title.textContent;
      if (inputs.message && message) {
        inputs.message.value = [...message.querySelectorAll('p')].map(p => p.textContent).join('\n\n');
      }
      if (inputs.signature && signature) inputs.signature.value = signature.textContent;
      if (reading) reading.hidden = true;
      editor.hidden = false;
      if (status) status.textContent = '';
      card.setAttribute('aria-labelledby', 'editorTitle');
      card.scrollTop = 0;
      if (inputs.recipient) inputs.recipient.focus({ preventScroll: true });
    });
  }

  const cancelEditBtn = document.getElementById('cancelEdit');
  if (cancelEditBtn) {
    cancelEditBtn.addEventListener('click', () => {
      showReading();
      if (editButton) editButton.focus({ preventScroll: true });
    });
  }

  function handleCardClose() {
    showReading();
    if (status) status.textContent = '';
    if (card) card.classList.remove('is-open');
    if (!isMinimizing) {
      document.dispatchEvent(new CustomEvent('flower:return'));
    }
    isMinimizing = false;
  }

  if (card) {
    card.addEventListener('close', handleCardClose);
  }

  if (btnAdmireBouquet) {
    btnAdmireBouquet.addEventListener('click', () => {
      window.GardenCardManager.minimizeCard();
      showToast('Đang ngắm bó hoa trên vườn. Nhấn "💌 Xem lời chúc" để mở lại thiệp! 💐', 3500);
    });
  }

  if (btnFloatingReopenCard) {
    btnFloatingReopenCard.addEventListener('click', () => {
      btnFloatingReopenCard.hidden = true;
      openModalDirectly();
    });
  }

  if (copyButton) {
    copyButton.addEventListener('click', async () => {
      const fullText = `🌸 ${title ? title.textContent : ''}\n\nGửi ${recipient ? recipient.textContent : ''},\n${message ? [...message.querySelectorAll('p')].map(p => p.textContent).join('\n\n') : ''}\n\n${signature ? signature.textContent : ''}`;
      try {
        await navigator.clipboard.writeText(fullText);
        showToast('Đã sao chép lời chúc vào khay nhớ tạm! 🌸');
      } catch {
        const textarea = document.createElement('textarea');
        textarea.value = fullText;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast('Đã sao chép lời chúc! 🌸');
      }
    });
  }

  if (editor) {
    editor.addEventListener('submit', event => {
      event.preventDefault();
      const rec = inputs.recipient ? inputs.recipient.value.trim() : 'bạn thương mến';
      const tit = inputs.title ? inputs.title.value.trim() : 'Chúc mừng ngày 20/10!';
      const msg = inputs.message ? inputs.message.value.trim() : '';
      const sig = inputs.signature ? inputs.signature.value.trim() : 'Thương mến ♡';

      renderGreeting(rec, tit, msg, sig);
      showReading();
      showToast('Đã cập nhật lời chúc! ✨');
    });
  }

  function openModalDirectly() {
    if (!card) return;
    if (btnFloatingReopenCard) btnFloatingReopenCard.hidden = true;
    try {
      if (!card.open) {
        card.showModal();
      }
    } catch {
      card.setAttribute('open', '');
    }
    card.classList.add('is-open');
    card.scrollTop = 0;
  }

  window.GardenCardManager = {
    showFlowerWish(flower, guestName, flowerName) {
      const cleanName = (guestName || '').trim() || 'bạn';
      
      const wishMsg = window.FlowerWishes 
        ? window.FlowerWishes.getRandomWish(cleanName) 
        : `Nhân ngày Phụ nữ Việt Nam 20/10, chúc ${cleanName} luôn xinh đẹp, tự tin và rạng rỡ!`;
        
      const cardTitleText = `Mong những điều tuyệt vời nhất luôn bên ${cleanName}`;
      const sigText = `Gửi ${cleanName} vạn đóa yêu thương ♡`;

      if (flowerBadge) {
        const idLabel = flower.isHero ? 'Trái tim khu vườn' : `Đóa hoa #${flower.id}`;
        flowerBadge.textContent = `🌸 ${flowerName} · ${idLabel}`;
      }

      if (cardBouquetPreview) cardBouquetPreview.hidden = true;
      if (btnAdmireBouquet) btnAdmireBouquet.hidden = true;
      if (btnFloatingReopenCard) btnFloatingReopenCard.hidden = true;

      renderGreeting(cleanName, cardTitleText, wishMsg, sigText);
      showReading();
      openModalDirectly();
    },

    showBouquetWish(flowersList, guestName) {
      const cleanName = (guestName || '').trim() || 'bạn';
      const list = (flowersList && flowersList.length) ? flowersList : [];
      const count = list.length || 1;
      const flowerNames = list.map(f => f.flowerName || 'Đóa Hồng Yêu Thương').join(', ');
      
      const wishMsg = window.FlowerWishes 
        ? window.FlowerWishes.getRandomWish(cleanName) 
        : `Nhân ngày Phụ nữ Việt Nam 20/10, chúc ${cleanName} luôn xinh đẹp, tự tin và rạng rỡ!`;
        
      const cardTitleText = `Bó hoa đặc biệt dành tặng ${cleanName}`;
      const sigText = `Gửi ${cleanName} vạn đóa yêu thương ♡`;

      if (flowerBadge) {
        flowerBadge.textContent = `💐 Bó hoa gồm ${count} đóa do chính tay chọn`;
      }

      // Render bouquet preview chips inside modal
      if (cardBouquetPreview && cardBouquetItems) {
        cardBouquetPreview.hidden = false;
        cardBouquetItems.innerHTML = '';
        list.forEach((fl, idx) => {
          const item = document.createElement('span');
          item.className = 'card-bouquet-item';
          item.innerHTML = `<span>🌸</span> <strong>#${idx + 1}</strong> ${fl.flowerName || 'Đóa hoa'}`;
          cardBouquetItems.appendChild(item);
        });
      }

      if (btnAdmireBouquet) btnAdmireBouquet.hidden = false;
      if (btnFloatingReopenCard) btnFloatingReopenCard.hidden = true;

      const fullMessage = `Bó hoa ngát hương gồm ${count} đóa rực rỡ do chính bạn kết lại dành tặng riêng cho ${cleanName}.\n\n${wishMsg}`;

      renderGreeting(cleanName, cardTitleText, fullMessage, sigText);
      showReading();
      openModalDirectly();
    },

    minimizeCard() {
      isMinimizing = true;
      if (card && card.open) {
        card.classList.remove('is-open');
        try {
          card.close();
        } catch {
          card.removeAttribute('open');
        }
      }
      if (btnFloatingReopenCard) {
        btnFloatingReopenCard.hidden = false;
      }
    },

    hideFloatingReopen() {
      if (btnFloatingReopenCard) {
        btnFloatingReopenCard.hidden = true;
      }
    },

    closeCard() {
      if (btnFloatingReopenCard) btnFloatingReopenCard.hidden = true;
      if (card && card.open) {
        card.classList.remove('is-open');
        setTimeout(() => {
          try {
            card.close();
          } catch {
            card.removeAttribute('open');
          }
        }, 200);
      }
    },

    showToast
  };
})();
